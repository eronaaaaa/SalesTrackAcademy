const express = require("express");
const router = express.Router();
const {
  createCourse,
  getAllCourses,
} = require("../controllers/courseController");

const { isLessonUnlocked } = require("../middleware/lessonLock");

const {
  addLesson,
  getLessonContent,
} = require("../controllers/lessonController");

const { protect, authorize } = require("../middleware/authMiddleware");
router.get("/lesson/:lessonId", protect, isLessonUnlocked, getLessonContent);

router.get("/", protect, getAllCourses);

router.post("/", protect, authorize("ADMIN"), createCourse);

router.post("/:courseId/lessons", protect, authorize("ADMIN"), addLesson);

module.exports = router;
