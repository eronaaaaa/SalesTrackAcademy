const express = require("express");
const router = express.Router();
const {
  assignCourse,
  getAssignedCoursesAdmin,
  getMyAssignments,
  inviteAgentByEmail,
  bulkAssignCourses,
  removeAgent,
} = require("../controllers/assignmentController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.post("/assign", protect, authorize("ADMIN"), assignCourse);
router.post("/bulk-assign", protect, authorize("ADMIN"), bulkAssignCourses);
router.post("/invite", protect, authorize("ADMIN"), inviteAgentByEmail);
router.delete("/:userId/:courseId", protect, authorize("ADMIN"), removeAgent);
router.get("/admin", protect, authorize("ADMIN"), getAssignedCoursesAdmin);
router.get("/me", protect, getMyAssignments);

module.exports = router;
