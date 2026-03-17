const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const { Pool } = require("pg");

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

exports.createCourse = async (req, res) => {
  try {
    const { title, description, thumbnail } = req.body;
    const course = await prisma.course.create({
      data: {
        title,
        description,
        thumbnail,
        authorId: req.user.id,
      },
    });
    res.status(201).json({ message: "Course created", course });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Failed to create course", details: error.message });
  }
};

exports.getAllCourses = async (req, res) => {
  try {
    const courses = await prisma.course.findMany({
      include: {
        lessons: true,
      },
    });
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch courses" });
  }
};
