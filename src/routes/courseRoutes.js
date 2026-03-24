const express = require("express");
const router = express.Router();
const {
  createCourse,
  getAllCourses,
  getCourseById,
  editCourse,
  deleteCourse,
} = require("../controllers/courseController");
const { addLesson } = require("../controllers/lessonController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.get("/", protect, getAllCourses);
router.post("/", protect, authorize("ADMIN"), createCourse);
router.get("/:id", protect, getCourseById);
router.put("/:id", protect, authorize("ADMIN"), editCourse);
router.delete("/:id", protect, authorize("ADMIN"), deleteCourse);
router.post("/:courseId/lessons", protect, authorize("ADMIN"), addLesson);

module.exports = router;
