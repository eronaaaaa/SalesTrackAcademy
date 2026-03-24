const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const { Pool } = require("pg");

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

exports.addLesson = async (req, res) => {
  try {
    const { title, contentUrl, contentType, order, passingScore, description } =
      req.body;
    const { courseId } = req.params;

    const lesson = await prisma.lesson.create({
      data: {
        title,
        contentUrl,
        contentType: contentType || "VIDEO",
        description,
        order: parseInt(order),
        passingScore: passingScore ? parseInt(passingScore) : undefined,
        courseId: parseInt(courseId),
      },
    });

    await prisma.assignment.updateMany({
      where: { courseId: parseInt(courseId), status: "COMPLETED" },
      data: { status: "IN_PROGRESS" },
    });

    res.status(201).json({ message: "Lesson added", lesson });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Failed to add lesson", details: error.message });
  }
};

exports.editLesson = async (req, res) => {
  try {
    const { lessonId } = req.params;
    const { title, contentUrl, contentType, order, passingScore, description } =
      req.body;

    const lesson = await prisma.lesson.update({
      where: { id: parseInt(lessonId) },
      data: {
        title: title || undefined,
        contentUrl: contentUrl || undefined,
        contentType: contentType || undefined,
        order: order !== undefined ? parseInt(order) : undefined,
        passingScore:
          passingScore !== undefined ? parseInt(passingScore) : undefined,
        description: description || undefined,
      },
    });

    res.status(200).json({ message: "Lesson updated successfully", lesson });
  } catch (error) {
    if (error.code === "P2025")
      return res.status(404).json({ error: "Lesson not found" });
    res
      .status(500)
      .json({ error: "Failed to update lesson", details: error.message });
  }
};

exports.deleteLesson = async (req, res) => {
  try {
    const { lessonId } = req.params;
    const id = parseInt(lessonId);

    await prisma.lessonProgress.deleteMany({ where: { lessonId: id } });
    await prisma.comment.deleteMany({ where: { lessonId: id } });
    await prisma.question.deleteMany({ where: { lessonId: id } });
    await prisma.lesson.delete({ where: { id } });

    res.status(200).json({ message: "Lesson deleted successfully" });
  } catch (error) {
    if (error.code === "P2025")
      return res.status(404).json({ error: "Lesson not found" });
    res
      .status(500)
      .json({ error: "Failed to delete lesson", details: error.message });
  }
};
exports.getLessonContent = async (req, res) => {
  try {
    const { lessonId } = req.params;

    const lesson = await prisma.lesson.findUnique({
      where: { id: parseInt(lessonId) },
      include: {
        questions: {
          include: { choices: { select: { id: true, text: true } } },
        },
        lessonProgress: { where: { userId: req.user.id } },
      },
    });

    if (!lesson) return res.status(404).json({ error: "Lesson not found" });

    res.status(200).json(lesson);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to load lesson content", details: error.message });
  }
};
