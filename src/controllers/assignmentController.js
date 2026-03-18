const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const { Pool } = require("pg");
const sendEmail = require("../utils/email");

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

exports.inviteAgentByEmail = async (req, res) => {
  try {
    const { email, courseId } = req.body;

    const course = await prisma.course.findUnique({
      where: { id: parseInt(courseId) },
    });
    if (!course) return res.status(404).json({ error: "Course not found" });

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      return res.status(404).json({
        error: "User not found",
        message: `No agent found with email ${email}. Please have them register first.`,
      });
    }

    const existingAssignment = await prisma.assignment.findUnique({
      where: {
        userId_courseId: { userId: user.id, courseId: course.id },
      },
    });

    if (existingAssignment) {
      return res
        .status(400)
        .json({ error: "Agent is already enrolled in this course." });
    }

    const assignment = await prisma.assignment.create({
      data: {
        userId: user.id,
        courseId: course.id,
        status: "IN_PROGRESS",
      },
    });

    const message = `Hi there! \n\nYou have been officially enrolled in "${course.title}". \n\nLog in to SalesTrack Academy to start your first lesson!`;

    try {
      const info = await sendEmail({
        email: user.email,
        subject: `New Course Enrollment: ${course.title}`,
        message,
      });

      console.log("Email sent! ID:", info.messageId);
    } catch (err) {
      console.error("Email failed to send:", err.message);
    }

    res.status(201).json({
      message: `Successfully invited ${email} and sent notification email.`,
      assignment,
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
};
