const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const { Pool } = require("pg");

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

exports.assignCourse = async (req, res) => {
  try {
    const { userId, courseId } = req.body;
    const assignment = await prisma.assignment.create({
      data: {
        userId: parseInt(userId),
        courseId: parseInt(courseId),
      },
    });
    res.status(201).json({ message: "Course assigned", assignment });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Failed to assign course", details: error.message });
  }
};

exports.getAssignedCoursesAdmin = async (req, res) => {
  try {
    const stats = await prisma.assignment.findMany({
      include: {
        user: { select: { email: true } },
        course: { select: { title: true } },
      },
    });
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getMyAssignments = async (req, res) => {
  try {
    const userId = req.user.id;

    const myCourses = await prisma.assignment.findMany({
      where: { userId: userId },
      include: {
        course: {
          include: {
            lessons: {
              orderBy: { order: "asc" },
            },
          },
        },
      },
    });

    res.status(200).json(myCourses);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch your assigned courses" });
  }
};
