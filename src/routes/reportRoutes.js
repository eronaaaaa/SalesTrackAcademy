const express = require("express");
const router = express.Router();
const {
  getGlobalStats,
  getAgentProgressReport,
} = require("../controllers/progressTrackingController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.get("/global", protect, authorize("ADMIN"), getGlobalStats);
router.get("/agents", protect, authorize("ADMIN"), getAgentProgressReport);

module.exports = router;