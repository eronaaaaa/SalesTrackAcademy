const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const { Pool } = require("pg");

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

exports.isLessonUnlocked = async (req, res, next) => {
  try {
    const { lessonId } = req.params;
    const userId = req.user.id;

    const lesson = await prisma.lesson.findUnique({
      where: { id: parseInt(lessonId) },
    });

    if (!lesson) return res.status(404).json({ error: "Lesson not found" });

    if (lesson.order === 1) return next();

    const prevLesson = await prisma.lesson.findFirst({
      where: { courseId: lesson.courseId, order: lesson.order - 1 },
    });

    if (!prevLesson) return next();

    const progress = await prisma.lessonProgress.findUnique({
      where: { userId_lessonId: { userId, lessonId: prevLesson.id } },
    });

    if (progress?.completed) return next();

    return res.status(403).json({
      error: "Lesson Locked",
      message: `You must pass the quiz for '${prevLesson.title}' to unlock this lesson.`,
    });
  } catch (error) {
    res.status(500).json({ error: "Security check failed", details: error.message });
  }
};