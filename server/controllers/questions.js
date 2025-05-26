const Question = require("../models/Question");
const Round = require("../models/Round");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");

// @desc    Get all questions for a round
// @route   GET /api/rounds/:roundId/questions
// @access  Private
exports.getQuestions = asyncHandler(async (req, res, next) => {
  if (req.params.roundId) {
    const questions = await Question.find({
      round: req.params.roundId,
      user: req.user.id,
    });

    return res.status(200).json({
      success: true,
      count: questions.length,
      data: questions,
    });
  } else {
    res.status(200).json(res.advancedResults);
  }
});

// @desc    Get single question
// @route   GET /api/questions/:id
// @access  Private
exports.getQuestion = asyncHandler(async (req, res, next) => {
  const question = await Question.findOne({
    _id: req.params.id,
    user: req.user.id,
  }).populate({
    path: "round",
    select: "name status",
  });

  if (!question) {
    return next(
      new ErrorResponse(`Question not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: question,
  });
});

// @desc    Create question
// @route   POST /api/rounds/:roundId/questions
// @access  Private
exports.createQuestion = asyncHandler(async (req, res, next) => {
  req.body.round = req.params.roundId;
  req.body.user = req.user.id;

  const round = await Round.findById(req.params.roundId);

  if (!round) {
    return next(
      new ErrorResponse(`No round with the id of ${req.params.roundId}`, 404)
    );
  }

  // Make sure user is round owner
  if (round.user.toString() !== req.user.id) {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to add a question to round ${round._id}`,
        401
      )
    );
  }

  const question = await Question.create(req.body);

  res.status(201).json({
    success: true,
    data: question,
  });
});

// @desc    Update question
// @route   PUT /api/questions/:id
// @access  Private
exports.updateQuestion = asyncHandler(async (req, res, next) => {
  let question = await Question.findById(req.params.id);

  if (!question) {
    return next(
      new ErrorResponse(`Question not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is question owner
  if (question.user.toString() !== req.user.id) {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to update this question`,
        401
      )
    );
  }

  question = await Question.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: question,
  });
});

// @desc    Delete question
// @route   DELETE /api/questions/:id
// @access  Private
exports.deleteQuestion = asyncHandler(async (req, res, next) => {
  const question = await Question.findById(req.params.id);

  if (!question) {
    return next(
      new ErrorResponse(`Question not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is question owner
  if (question.user.toString() !== req.user.id) {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to delete this question`,
        401
      )
    );
  }

  await question.remove();

  res.status(200).json({
    success: true,
    data: {},
  });
});
