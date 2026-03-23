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

exports.editCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { title, description, thumbnail } = req.body;

    const course = await prisma.course.update({
      where: {
        id: parseInt(courseId),
      },
      data: {
        title: title || undefined,
        description: description || undefined,
        thumbnail: thumbnail || undefined,
      },
    });

    res.status(200).json({ message: "Course updated successfully", course });
  } catch (error) {
    console.error(error);

    if (error.code === "P2025") {
      //this is from prisma
      return res.status(404).json({ error: "Course not found" });
    }

    res.status(500).json({
      error: "Failed to update course",
      details: error.message,
    });
  }
};

// exports.getAllCourses = async (req, res) => {
//   try {
//     const courses = await prisma.course.findMany({
//       include: {
//         lessons: true,
//         assignments: true,
//       },
//     });
//     res.status(200).json(courses);
//   } catch (error) {
//     res.status(500).json({ error: "Failed to fetch courses" });
//   }
// };

exports.getAllCourses = async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;

    let courses;

    if (userRole === "ADMIN") {
      courses = await prisma.course.findMany({
        include: { lessons: true, assignments: true },
      });
    } else {
      courses = await prisma.course.findMany({
        where: {
          assignments: {
            some: {
              userId: userId,
            },
          },
        },
        include: {
          lessons: {
            include: {
              lessonProgress: {
                where: { userId: userId },
              },
            },
          },
          assignments: {
            where: { userId: userId },
          },
        },
      });
    }

    res.status(200).json(courses);
  } catch (error) {
    console.error("Fetch error:", error);
    res.status(500).json({ error: "Failed to fetch assigned courses" });
  }
};

exports.checkCourseCompletion = async (userId, courseId) => {
  try {
    const totalLessons = await prisma.lesson.count({
      where: { courseId: parseInt(courseId) },
    });

    const completedLessons = await prisma.lessonProgress.count({
      where: {
        userId: userId,
        lesson: { courseId: parseInt(courseId) },
        completed: true,
      },
    });

    if (totalLessons > 0 && totalLessons === completedLessons) {
      await prisma.assignment.update({
        where: {
          userId_courseId: { userId, courseId: parseInt(courseId) },
        },
        data: { status: "COMPLETED" },
      });
      console.log(`User ${userId} has graduated from Course ${courseId}!`);
      return true;
    }

    return false;
  } catch (error) {
    console.error("Error checking course completion:", error.message);
  }
};

exports.getCourseById = async (req, res) => {
  try {
    const { id } = req.params;

    const course = await prisma.course.findUnique({
      where: { id: parseInt(id) },
      include: {
        lessons: {
          include: {
            questions: {
              include: { choices: true },
            },
            lessonProgress: {
              where: { userId: req.user.id },
            },
          },
        },
        assignments: {
          where: { userId: req.user.id },
        },
      },
    });

    const totalLessons = course.lessons.length;
    const completedCount = course.lessons.filter(
      (lesson) => lesson.lessonProgress?.[0]?.completed === true,
    ).length;
    const progressPercentage =
      totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.json({
      ...course,
      progress: {
        percentage: progressPercentage,
        completedCount,
        totalCount: totalLessons,
        isFullyCompleted: progressPercentage === 100,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error fetching course details" });
  }
};
