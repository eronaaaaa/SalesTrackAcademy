const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const { Pool } = require("pg");

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

exports.addLesson = async (req, res) => {
  try {
    const { title, videoUrl, order } = req.body;
    const { courseId } = req.params;

    const lesson = await prisma.lesson.create({
      data: {
        title,
        videoUrl,
        order: parseInt(order),
        courseId: parseInt(courseId),
      },
    });

    res.status(201).json({ message: "Lesson added", lesson });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Failed to add lesson", details: error.message });
  }
};

exports.getLessonContent = async (req, res) => {
  try {
    const { lessonId } = req.params;

    const lesson = await prisma.lesson.findUnique({
      where: { id: parseInt(lessonId) },
      include: {
        questions: {
          include: {
            choices: {
              select: { id: true, text: true },
            },
          },
        },
      },
    });

    if (!lesson) {
      return res.status(404).json({ error: "Lesson not found" });
    }

    res.status(200).json(lesson);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to load lesson content", details: error.message });
  }
};
