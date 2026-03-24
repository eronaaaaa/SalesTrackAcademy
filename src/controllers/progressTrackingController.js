const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const { Pool } = require("pg");

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

exports.getGlobalStats = async (req, res) => {
  try {
    const [
      totalAgents,
      totalCourses,
      totalComments,
      totalAssignments,
      completedAssignments,
      avgScore,
    ] = await Promise.all([
      prisma.user.count({ where: { role: "AGENT" } }),
      prisma.course.count(),
      prisma.comment.count(),
      prisma.assignment.count(),
      prisma.assignment.count({ where: { status: "COMPLETED" } }),
      prisma.lessonProgress.aggregate({
        _avg: { score: true },
        where: { score: { not: null } },
      }),
    ]);

    const completionRate =
      totalAssignments > 0
        ? Math.round((completedAssignments / totalAssignments) * 100)
        : 0;

    res.json({
      platformOverview: {
        totalAgents,
        totalCourses,
        totalComments,
        totalAssignments,
        averageQuizScore: Math.round(avgScore._avg.score || 0),
        completionRate,
      },
    });
  } catch (error) {
    console.error("Stats error:", error);
    res.status(500).json({ error: "Failed to fetch dashboard stats" });
  }
};

exports.getAgentProgressReport = async (req, res) => {
  try {
    const agents = await prisma.user.findMany({
      where: { role: "AGENT" },
      include: {
        assignments: {
          include: {
            course: {
              include: { _count: { select: { lessons: true } } },
            },
          },
        },
        lessonProgress: {
          where: { completed: true },
          include: { lesson: { select: { title: true, courseId: true } } },
        },
      },
    });

    const report = agents.map((agent) => {
      const enrolledCourses = agent.assignments.map((assign) => {
        const total = assign.course._count.lessons;
        const completed = agent.lessonProgress.filter(
          (lp) => lp.lesson.courseId === assign.course.id,
        ).length;
        const percentage =
          total > 0 ? Math.round((completed / total) * 100) : 0;

        return {
          courseId: assign.course.id,
          courseTitle: assign.course.title,
          completionRate: `${percentage}%`,
          lessonsFinished: `${completed}/${total}`,
          status: percentage === 100 ? "GRADUATED" : "IN_TRAINING",
        };
      });

      return {
        userId: agent.id,
        agentEmail: agent.email,
        enrolledCourses,
        coursesEnrolled: agent.assignments.length,
        quizResults: agent.lessonProgress.map((lp) => ({
          lesson: lp.lesson.title,
          score: `${lp.score}%`,
          status: lp.completed ? "PASSED" : "FAILED",
        })),
      };
    });

    res.json(report);
  } catch (error) {
    console.error("Report error:", error);
    res
      .status(500)
      .json({ error: "Failed to fetch agent report", details: error.message });
  }
};
