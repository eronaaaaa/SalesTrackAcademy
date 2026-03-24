const express = require("express");
const router = express.Router();
const {
  addComment,
  getLessonComments,
} = require("../controllers/commentController");
const { protect } = require("../middleware/authMiddleware");

router.post("/:lessonId", protect, addComment);
router.get("/:lessonId", protect, getLessonComments);

module.exports = router;