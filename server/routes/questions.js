const express = require("express");
const {
  getQuestions,
  getQuestion,
  createQuestion,
  updateQuestion,
  deleteQuestion,
} = require("../controllers/questions");

const router = express.Router();

const { protect } = require("../middleware/auth");

router.route("/").get(protect, getQuestions);

router
  .route("/:id")
  .get(protect, getQuestion)
  .put(protect, updateQuestion)
  .delete(protect, deleteQuestion);

router
  .route("/rounds/:roundId/questions")
  .get(protect, getQuestions)
  .post(protect, createQuestion);

module.exports = router;
