const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const { Pool } = require("pg");

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

exports.addComment = async (req, res) => {
  try {
    const { text } = req.body;
    const { lessonId } = req.params;

    const comment = await prisma.comment.create({
      data: {
        text,
        lessonId: parseInt(lessonId),
        userId: req.user.id,
      },
      include: {
        user: { select: { email: true } },
      },
    });

    res.status(201).json(comment);
  } catch (error) {
    console.error("Failed to post comment:", error);
    res.status(500).json({ error: "Failed to post comment", message: error.message });
  }
};

exports.getLessonComments = async (req, res) => {
  try {
    const { lessonId } = req.params;
    const comments = await prisma.comment.findMany({
      where: { lessonId: parseInt(lessonId) },
      include: { user: { select: { email: true } } },
      orderBy: { createdAt: "desc" },
    });
    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ error: "Failed to load comments", message: error.message });
  }
};