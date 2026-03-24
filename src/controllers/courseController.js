const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const { Pool } = require("pg");

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const calcProgress = (lessons) => {
  const total = lessons.length;
  const completed = lessons.filter(
    (l) => l.lessonProgress?.[0]?.completed === true,
  ).length;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
  return {
    percentage,
    completedCount: completed,
    totalCount: total,
    isFullyCompleted: percentage === 100,
  };
};

exports.createCourse = async (req, res) => {
  try {
    const { title, description, thumbnail } = req.body;
    const course = await prisma.course.create({
      data: { title, description, thumbnail, authorId: req.user.id },
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
    const { id } = req.params;
    const { title, description, thumbnail } = req.body;
    const course = await prisma.course.update({
      where: { id: parseInt(id) },
      data: {
        title: title || undefined,
        description: description || undefined,
        thumbnail: thumbnail || undefined,
      },
    });
    res.status(200).json({ message: "Course updated successfully", course });
  } catch (error) {
    if (error.code === "P2025")
      return res.status(404).json({ error: "Course not found" });
    res
      .status(500)
      .json({ error: "Failed to update course", details: error.message });
  }
};

exports.getAllCourses = async (req, res) => {
  try {
    const { id: userId, role } = req.user;

    const courses = await prisma.course.findMany({
      ...(role === "ADMIN"
        ? { include: { lessons: true, assignments: true } }
        : {
            where: { assignments: { some: { userId } } },
            include: {
              lessons: {
                include: { lessonProgress: { where: { userId } } },
              },
              assignments: { where: { userId } },
            },
          }),
    });

    res.status(200).json(
      courses.map((course) => ({
        ...course,
        progress: calcProgress(course.lessons ?? []),
      })),
    );
  } catch (error) {
    console.error("Fetch error:", error);
    res
      .status(500)
      .json({ error: "Failed to fetch courses", details: error.message });
  }
};

exports.getCourseById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const course = await prisma.course.findUnique({
      where: { id: parseInt(id) },
      include: {
        lessons: {
          include: {
            questions: { include: { choices: true } },
            lessonProgress: { where: { userId } },
          },
        },
        assignments: { where: { userId } },
      },
    });

    if (!course) return res.status(404).json({ message: "Course not found" });

    res.json({ ...course, progress: calcProgress(course.lessons) });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error fetching course details" });
  }
};

exports.deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const courseId = parseInt(id);

    const lessons = await prisma.lesson.findMany({
      where: { courseId },
      select: { id: true },
    });
    const lessonIds = lessons.map((l) => l.id);

    await prisma.lessonProgress.deleteMany({
      where: { lessonId: { in: lessonIds } },
    });
    await prisma.comment.deleteMany({ where: { lessonId: { in: lessonIds } } });
    await prisma.question.deleteMany({
      where: { lessonId: { in: lessonIds } },
    });
    await prisma.lesson.deleteMany({ where: { courseId } });
    await prisma.assignment.deleteMany({ where: { courseId } });
    await prisma.course.delete({ where: { id: courseId } });

    res.status(200).json({ message: "Course deleted successfully" });
  } catch (error) {
    if (error.code === "P2025")
      return res.status(404).json({ error: "Course not found" });
    res
      .status(500)
      .json({ error: "Failed to delete course", details: error.message });
  }
};

exports.checkCourseCompletion = async (userId, courseId) => {
  try {
    const courseIdInt = parseInt(courseId);

    const totalLessons = await prisma.lesson.count({
      where: { courseId: courseIdInt },
    });
    const completedLessons = await prisma.lessonProgress.count({
      where: { userId, lesson: { courseId: courseIdInt }, completed: true },
    });

    if (totalLessons > 0 && totalLessons === completedLessons) {
      await prisma.assignment.upsert({
        where: { userId_courseId: { userId, courseId: courseIdInt } },
        update: { status: "COMPLETED" },
        create: { userId, courseId: courseIdInt, status: "COMPLETED" },
      });
      console.log(`User ${userId} graduated from Course ${courseId}`);
      return true;
    }

    return false;
  } catch (error) {
    console.error("Error checking course completion:", error.message);
  }
};
