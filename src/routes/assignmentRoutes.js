const express = require("express");
const router = express.Router();

const {
  assignCourse,
  getAssignedCoursesAdmin,
  getMyAssignments,
  inviteAgentByEmail,
  bulkAssignCourses,
} = require("../controllers/assignmentController");
const {
  getGlobalStats,
  getAgentProgressReport,
} = require("../controllers/progressTrackingController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.get("/reports/global", protect, authorize("ADMIN"), getGlobalStats);
router.get(
  "/reports/agents",
  protect,
  authorize("ADMIN"),
  getAgentProgressReport,
);

router.post("/bulk-assign", protect, authorize("ADMIN"), bulkAssignCourses);

router.post("/assign", protect, authorize("ADMIN"), assignCourse);
router.get("/dashboard", protect, authorize("ADMIN"), getAssignedCoursesAdmin);
router.get("/my-courses", protect, getMyAssignments);
router.post("/invite", protect, authorize("ADMIN"), inviteAgentByEmail);

module.exports = router;
