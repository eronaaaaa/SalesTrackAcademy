const express = require("express");
const router = express.Router();
const { createQuestion, submitQuiz } = require("../controllers/quizController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.post(
  "/lesson/:lessonId/questions",
  protect,
  authorize("ADMIN"),
  createQuestion,
);

router.post("/lesson/:lessonId/submit", protect, submitQuiz);

module.exports = router;
