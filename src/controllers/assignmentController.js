const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const { Pool } = require("pg");
const sendEmail = require("../utils/email");

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const BASE_URL = process.env.FRONTEND_URL;

const buildEnrollmentEmail = (courseTitle, inviteUrl) => `
  <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px; border: 1px solid #e2e8f0; border-radius: 24px; color: #1e293b;">
    <h1 style="font-size: 24px; font-weight: 900; color: #2563eb; margin-bottom: 16px;">New Course Enrollment!</h1>
    <p style="font-size: 16px; line-height: 1.6; color: #64748b;">
      Hi there! You have been officially enrolled in <strong>${courseTitle}</strong>.
      Log in to your dashboard to start your journey.
    </p>
    <div style="margin-top: 32px; text-align: center;">
      <a href="${inviteUrl}" style="background-color: #2563eb; color: #ffffff; padding: 14px 32px; border-radius: 12px; font-weight: bold; text-decoration: none; display: inline-block; box-shadow: 0 4px 6px -1px rgba(37, 99, 235, 0.2);">
        Enter Academy
      </a>
    </div>
    <hr style="margin-top: 40px; border: 0; border-top: 1px solid #f1f5f9;" />
    <p style="font-size: 12px; color: #94a3b8; text-align: center; margin-top: 20px;">
      SalesTrack Academy &copy; 2026
    </p>
  </div>
`;

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
    const myCourses = await prisma.assignment.findMany({
      where: { userId: req.user.id },
      include: {
        course: {
          include: {
            lessons: { orderBy: { order: "asc" } },
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
    const normalizedEmail = email.toLowerCase();

    const course = await prisma.course.findUnique({
      where: { id: parseInt(courseId) },
    });
    if (!course) return res.status(404).json({ error: "Course not found" });

    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });
    const page = user ? "login" : "register";
    const inviteUrl = `${BASE_URL}/${page}?email=${normalizedEmail}&courseId=${courseId}`;

    await sendEmail({
      email: normalizedEmail,
      subject: "Academy Invitation",
      html: buildEnrollmentEmail(course.title, inviteUrl),
    });

    res.status(200).json({ message: `Invite link sent to ${normalizedEmail}` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.removeAgent = async (req, res) => {
  try {
    const { userId, courseId } = req.params;
    await prisma.assignment.delete({
      where: {
        userId_courseId: {
          userId: parseInt(userId),
          courseId: parseInt(courseId),
        },
      },
    });
    res.status(200).json({ message: "Agent removed from course" });
  } catch (error) {
    if (error.code === "P2025")
      return res.status(404).json({ error: "Assignment not found" });
    res
      .status(500)
      .json({ error: "Failed to remove agent", details: error.message });
  }
};

exports.bulkAssignCourses = async (req, res) => {
  try {
    const { emails, courseId } = req.body;
    const courseIdInt = parseInt(courseId);

    if (!Array.isArray(emails) || emails.length === 0) {
      return res
        .status(400)
        .json({ error: "Please provide an array of emails" });
    }

    const course = await prisma.course.findUnique({
      where: { id: courseIdInt },
    });
    if (!course) return res.status(404).json({ error: "Course not found" });

    const users = await prisma.user.findMany({
      where: { email: { in: emails.map((e) => e.toLowerCase()) } },
      select: { id: true, email: true },
    });

    const assignments = await prisma.assignment.createMany({
      data: users.map((user) => ({ userId: user.id, courseId: courseIdInt })),
      skipDuplicates: true,
    });

    for (const user of users) {
      try {
        const inviteUrl = `${BASE_URL}/login?email=${user.email}&courseId=${courseIdInt}`;
        await sendEmail({
          email: user.email,
          subject: `New Enrollment: ${course.title}`,
          html: buildEnrollmentEmail(course.title, inviteUrl),
        });
      } catch (emailErr) {
        console.error(`Email failed for ${user.email}:`, emailErr.message);
      }
    }

    res.status(201).json({
      message: `${assignments.count} agents assigned. Note: Some emails may have been throttled by provider limits.`,
      count: assignments.count,
    });
  } catch (error) {
    console.error("Bulk Assignment Error:", error);
    res
      .status(500)
      .json({ error: "Bulk assignment failed", details: error.message });
  }
};
