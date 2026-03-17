const express = require("express");
const router = express.Router();

const {
  assignCourse,
  getAssignedCoursesAdmin,
  getMyAssignments,
} = require("../controllers/assignmentController");

const { protect, authorize } = require("../middleware/authMiddleware");

router.post("/assign", protect, authorize("ADMIN"), assignCourse);
router.get("/dashboard", protect, authorize("ADMIN"), getAssignedCoursesAdmin);
router.get("/my-courses", protect, getMyAssignments);

module.exports = router;
