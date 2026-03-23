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
    const normalizedEmail = email.toLowerCase();

    const course = await prisma.course.findUnique({
      where: { id: parseInt(courseId) },
    });
    if (!course) return res.status(404).json({ error: "Course not found" });

    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    const baseUrl = user
      ? "http://localhost:3000/login"
      : "http://localhost:3000/register";
    const inviteUrl = `${baseUrl}?email=${normalizedEmail}&courseId=${courseId}`;

   const html = `
  <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px; border: 1px solid #e2e8f0; border-radius: 24px; color: #1e293b;">
    <h1 style="font-size: 24px; font-weight: 900; color: #2563eb; margin-bottom: 16px;">New Course Enrollment!</h1>
    <p style="font-size: 16px; line-height: 1.6; color: #64748b;">
      Hi there! You have been officially enrolled in <strong>${course.title}</strong>. 
      Log in to your dashboard to start your journey.
    </p>
    <div style="margin-top: 32px; text-align: center;">
      <a href="${inviteUrl}" 
style="background-color: #2563eb; color: #ffffff; padding: 14px 32px; border-radius: 12px; font-weight: bold; text-decoration: none; display: inline-block; box-shadow: 0 4px 6px -1px rgba(37, 99, 235, 0.2);">   Enter Academy
</a>
    </div>
    <hr style="margin-top: 40px; border: 0; border-top: 1px solid #f1f5f9;" />
    <p style="font-size: 12px; color: #94a3b8; text-align: center; margin-top: 20px;">
      SalesTrack Academy &copy; 2026
    </p>
  </div>
`;

    await sendEmail({
      email: normalizedEmail,
      subject: "Academy Invitation",
      html,
    });

    res.status(200).json({ message: `Invite link sent to ${normalizedEmail}` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// exports.inviteAgentByEmail = async (req, res) => {
//   try {
//     const { email, courseId } = req.body;

//     const course = await prisma.course.findUnique({
//       where: { id: parseInt(courseId) },
//     });
//     if (!course) return res.status(404).json({ error: "Course not found" });

//     const user = await prisma.user.findUnique({
//       where: { email: email.toLowerCase() },
//     });

//     if (!user) {
//       return res.status(404).json({
//         error: "User not found",
//         message: `No agent found with email ${email}. Please have them register first.`,
//       });
//     }

//     const existingAssignment = await prisma.assignment.findUnique({
//       where: {
//         userId_courseId: { userId: user.id, courseId: course.id },
//       },
//     });

//     if (existingAssignment) {
//       return res
//         .status(400)
//         .json({ error: "Agent is already enrolled in this course." });
//     }

//     const assignment = await prisma.assignment.create({
//       data: {
//         userId: user.id,
//         courseId: course.id,
//         status: "IN_PROGRESS",
//       },
//     });
//     const loginUrl = `http://localhost:3000/login?redirect=/courses/${course.id}`;
//     const message = `Hi there! \n\nYou have been officially enrolled in "${course.title}". \n\nLog in to SalesTrack Academy to start your first lesson!`;
//     const html = `
//   <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px; border: 1px solid #e2e8f0; border-radius: 24px; color: #1e293b;">
//     <h1 style="font-size: 24px; font-weight: 900; color: #2563eb; margin-bottom: 16px;">New Course Enrollment!</h1>
//     <p style="font-size: 16px; line-height: 1.6; color: #64748b;">
//       Hi there! You have been officially enrolled in <strong>${course.title}</strong>. 
//       Log in to your dashboard to start your journey.
//     </p>
//     <div style="margin-top: 32px; text-align: center;">
//       <a href="${loginUrl}" 
// style="background-color: #2563eb; color: #ffffff; padding: 14px 32px; border-radius: 12px; font-weight: bold; text-decoration: none; display: inline-block; box-shadow: 0 4px 6px -1px rgba(37, 99, 235, 0.2);">   Enter Academy
// </a>
//     </div>
//     <hr style="margin-top: 40px; border: 0; border-top: 1px solid #f1f5f9;" />
//     <p style="font-size: 12px; color: #94a3b8; text-align: center; margin-top: 20px;">
//       SalesTrack Academy &copy; 2026
//     </p>
//   </div>
// `;
//     try {
//       const info = await sendEmail({
//         email: user.email,
//         subject: `New Course Enrollment: ${course.title}`,
//         message,
//         html,
//       });

//       console.log("Email sent! ID:", info.messageId);
//     } catch (err) {
//       console.error("Email failed to send:", err.message);
//     }

//     res.status(201).json({
//       message: `Successfully invited ${email} and sent notification email.`,
//       assignment,
//     });
//   } catch (error) {
//     res
//       .status(500)
//       .json({ error: "Internal Server Error", details: error.message });
//   }
// };
