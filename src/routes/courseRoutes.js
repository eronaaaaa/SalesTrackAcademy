const express = require("express");
const router = express.Router();
const {
  createCourse,
  getAllCourses,
} = require("../controllers/courseController");

const { addLesson } = require("../controllers/lessonController");

const { protect, authorize } = require("../middleware/authMiddleware");

router.get("/", protect, getAllCourses);

router.post("/", protect, authorize("ADMIN"), createCourse);

router.post("/:courseId/lessons", protect, authorize("ADMIN"), addLesson);

module.exports = router;
