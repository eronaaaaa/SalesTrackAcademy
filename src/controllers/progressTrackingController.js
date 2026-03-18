const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const { Pool } = require("pg");

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

exports.getGlobalStats = async (req, res) => {
  try {
    const totalAgents = await prisma.user.count({ where: { role: "AGENT" } });
    const totalCourses = await prisma.course.count();
    const totalAssignments = await prisma.assignment.count();

    const avgScore = await prisma.lessonProgress.aggregate({
      _avg: { score: true },
    });

    res.json({
      platformOverview: {
        totalAgents,
        totalCourses,
        totalAssignments,
        averageQuizScore: Math.round(avgScore._avg.score || 0) + "%",
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// exports.getAgentProgressReport = async (req, res) => {
//   try {
//     const reports = await prisma.user.findMany({
//       where: { role: "AGENT" },
//       select: {
//         id: true,
//         email: true,
//         assignments: {
//           include: {
//             course: {
//               select: {
//                 title: true,
//                 _count: { select: { lessons: true } },
//               },
//             },
//           },
//         },
//         lessonProgress: {
//           include: {
//             lesson: { select: { title: true } },
//           },
//         },
//       },
//     });

//     const formattedReport = reports.map((agent) => ({
//       agentEmail: agent.email,
//       coursesEnrolled: agent.assignments.length,
//       quizResults: agent.lessonProgress.map((lp) => ({
//         lesson: lp.lesson.title,
//         score: lp.score + "%",
//         status: lp.completed ? "PASSED" : "FAILED",
//       })),
//     }));

//     res.json(formattedReport);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

exports.getAgentProgressReport = async (req, res) => {
  try {
    const agents = await prisma.user.findMany({
      where: { role: "AGENT" },
      include: {
        assignments: {
          include: {
            course: {
              include: {
                _count: { select: { lessons: true } },
              },
            },
          },
        },
        lessonProgress: {
          where: { completed: true },
          include: {
            lesson: { select: { title: true, courseId: true } },
          },
        },
      },
    });

    const detailedReport = agents.map((agent) => {
      const courseProgress = agent.assignments.map((assign) => {
        const totalLessons = assign.course._count.lessons;

        const completedCount = agent.lessonProgress.filter(
          (lp) => lp.completed && lp.lesson.courseId === assign.course.id,
        ).length;

        const percentage =
          totalLessons > 0
            ? Math.round((completedCount / totalLessons) * 100)
            : 0;

        return {
          courseTitle: assign.course.title,
          completionRate: `${percentage}%`,
          lessonsFinished: `${completedCount}/${totalLessons}`,
          status: percentage === 100 ? "GRADUATED" : "IN_TRAINING",
        };
      });

      return {
        agentEmail: agent.email,
        enrolledCourses: courseProgress,
        coursesEnrolled: agent.assignments.length,
        quizResults: agent.lessonProgress.map((lp) => ({
          lesson: lp.lesson.title,
          score: lp.score + "%",
          status: lp.completed ? "PASSED" : "FAILED",
        })),
      };
    });

    res.json(detailedReport);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
