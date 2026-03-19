const express = require("express");
const router = express.Router();
const {
  createCourse,
  getAllCourses,
  getCourseById,
} = require("../controllers/courseController");

const { isLessonUnlocked } = require("../middleware/lessonLock");

const {
  addLesson,
  getLessonContent,
} = require("../controllers/lessonController");

const { protect, authorize } = require("../middleware/authMiddleware");
router.post(
  "/:courseId/lessons",
  protect,
  authorize("ADMIN"),
  addLesson,
);
router.get("/lesson/:lessonId", protect, isLessonUnlocked, getLessonContent);

router.get("/", protect, getAllCourses);

router.get("/:id", protect, getCourseById);

router.post("/", protect, authorize("ADMIN"), createCourse);

module.exports = router;
