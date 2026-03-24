const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const { Pool } = require("pg");
const { checkCourseCompletion } = require("./courseController");

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const calcScore = (questions, answers) => {
  if (questions.length === 0) return { finalScore: 100, correctCount: 0 };

  const correctCount = questions.reduce((count, q) => {
    const correct = q.choices.find((c) => c.isCorrect);
    return answers[q.id] == correct?.id ? count + 1 : count;
  }, 0);

  const finalScore = Math.round((correctCount / questions.length) * 100);
  return { finalScore, correctCount };
};

exports.createQuestion = async (req, res) => {
  try {
    const { lessonId } = req.params;
    const { text, choices } = req.body;

    const question = await prisma.question.create({
      data: {
        text,
        lessonId: parseInt(lessonId),
        choices: { create: choices },
      },
      include: { choices: true },
    });

    res.status(201).json(question);
  } catch (error) {
    res.status(500).json({ error: "Failed to create question", details: error.message });
  }
};

exports.submitQuiz = async (req, res) => {
  try {
    const { lessonId } = req.params;
    const { answers = {} } = req.body;
    const userId = req.user.id;
    const lessonIdInt = parseInt(lessonId);

    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonIdInt },
      include: { questions: { include: { choices: true } } },
    });

    if (!lesson) return res.status(404).json({ error: "Lesson not found" });

    const { finalScore, correctCount } = calcScore(lesson.questions, answers);
    const passed = lesson.questions.length === 0 || finalScore >= (lesson.passingScore || 0);

    if (!passed) {
      return res.status(200).json({ message: "Score too low, try again.", score: finalScore });
    }

    await prisma.lessonProgress.upsert({
      where: { userId_lessonId: { userId, lessonId: lessonIdInt } },
      update: { completed: true, score: finalScore },
      create: { userId, lessonId: lessonIdInt, courseId: lesson.courseId, score: finalScore, completed: true },
    });

    const courseCompleted = await checkCourseCompletion(userId, lesson.courseId);

    res.status(200).json({
      message: "You passed!",
      score: finalScore,
      correctCount,
      totalQuestions: lesson.questions.length,
      courseCompleted: !!courseCompleted,
    });
  } catch (error) {
    console.error("Quiz submission error:", error);
    res.status(500).json({ error: "Failed to submit quiz", details: error.message });
  }
};