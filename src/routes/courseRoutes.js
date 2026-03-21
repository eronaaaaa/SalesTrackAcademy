const express = require("express");
const router = express.Router();
const {
  createCourse,
  getAllCourses,
  getCourseById,
  editCourse,
} = require("../controllers/courseController");

const { isLessonUnlocked } = require("../middleware/lessonLock");

const {
  addLesson,
  getLessonContent,
  editLesson,
} = require("../controllers/lessonController");

const { protect, authorize } = require("../middleware/authMiddleware");
router.post("/:courseId/lessons", protect, authorize("ADMIN"), addLesson);

router.put("/lesson/:lessonId", protect, editLesson);
router.get("/lesson/:lessonId", protect, isLessonUnlocked, getLessonContent);

router.put("/:courseId", protect, editCourse);

router.get("/", protect, getAllCourses);

router.get("/:id", protect, getCourseById);

router.post("/", protect, authorize("ADMIN"), createCourse);

module.exports = router;
