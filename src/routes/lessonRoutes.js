const express = require("express");
const router = express.Router();
const {
  getLessonContent,
  editLesson,
  deleteLesson,
} = require("../controllers/lessonController");
const { protect, authorize } = require("../middleware/authMiddleware");
const { isLessonUnlocked } = require("../middleware/lessonLock");

router.put("/:lessonId", protect, authorize("ADMIN"), editLesson);
router.delete("/:lessonId", protect, authorize("ADMIN"), deleteLesson);
router.get("/:lessonId", protect, isLessonUnlocked, getLessonContent);

module.exports = router;
