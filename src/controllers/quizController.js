const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const { Pool } = require("pg");
const { checkCourseCompletion } = require("./courseController");

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

exports.createQuestion = async (req, res) => {
  try {
    const { lessonId } = req.params;
    const { text, choices } = req.body;

    const question = await prisma.question.create({
      data: {
        text,
        lessonId: parseInt(lessonId),
        choices: {
          create: choices,
        },
      },
      include: { choices: true },
    });

    res.status(201).json(question);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to create question", details: error.message });
  }
};

exports.submitQuiz = async (req, res) => {
  try {
    const { lessonId } = req.params;
    const { answers } = req.body;
    const userId = req.user.id;

    const lesson = await prisma.lesson.findUnique({
      where: { id: parseInt(lessonId) },
      include: {
        questions: { include: { choices: true } },
      },
    });

    if (!lesson) return res.status(404).json({ error: "Lesson not found" });

    let correctCount = 0;
    const totalQuestions = lesson.questions.length;

    lesson.questions.forEach((q) => {
      const submittedChoiceId = answers[q.id];
      const correctChoice = q.choices.find((c) => c.isCorrect);

      if (submittedChoiceId == correctChoice.id) {
        correctCount++;
      }
    });

    const finalScore =
      totalQuestions > 0
        ? Math.round((correctCount / totalQuestions) * 100)
        : 0;
    const passed = finalScore >= lesson.passingScore;

    if (passed) {
      await prisma.lessonProgress.upsert({
        where: {
          userId_lessonId: {
            userId: userId,
            lessonId: parseInt(lessonId),
          },
        },
        update: { completed: true },
        create: {
          userId: userId,
          lessonId: parseInt(lessonId),
          completed: true,
        },
      });

      const isGraduated = await checkCourseCompletion(userId, lesson.courseId);

      return res.status(200).json({
        message: "You passed!",
        score: finalScore,
        correctCount,
        totalQuestions,
        courseCompleted: isGraduated || false,
      });
    } else {
      return res.status(200).json({
        message: "Score too low, try again.",
        score: finalScore,
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
