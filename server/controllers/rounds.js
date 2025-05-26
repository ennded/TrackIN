const Round = require("../models/Round");
const Company = require("../models/Company");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");

// @desc    Get all rounds for a company
// @route   GET /api/companies/:companyId/rounds
// @access  Private
exports.getRounds = asyncHandler(async (req, res, next) => {
  if (req.params.companyId) {
    const rounds = await Round.find({
      company: req.params.companyId,
      user: req.user.id,
    });

    return res.status(200).json({
      success: true,
      count: rounds.length,
      data: rounds,
    });
  } else {
    res.status(200).json(res.advancedResults);
  }
});

// @desc    Get single round
// @route   GET /api/rounds/:id
// @access  Private
exports.getRound = asyncHandler(async (req, res, next) => {
  const round = await Round.findOne({
    _id: req.params.id,
    user: req.user.id,
  }).populate({
    path: "company",
    select: "name website",
  });

  if (!round) {
    return next(
      new ErrorResponse(`Round not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: round,
  });
});

// @desc    Create round
// @route   POST /api/companies/:companyId/rounds
// @access  Private
exports.createRound = asyncHandler(async (req, res, next) => {
  req.body.company = req.params.companyId;
  req.body.user = req.user.id;

  const company = await Company.findById(req.params.companyId);

  if (!company) {
    return next(
      new ErrorResponse(
        `No company with the id of ${req.params.companyId}`,
        404
      )
    );
  }

  // Make sure user is company owner
  if (company.user.toString() !== req.user.id) {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to add a round to company ${company._id}`,
        401
      )
    );
  }

  const round = await Round.create(req.body);

  res.status(201).json({
    success: true,
    data: round,
  });
});

// @desc    Update round
// @route   PUT /api/rounds/:id
// @access  Private
exports.updateRound = asyncHandler(async (req, res, next) => {
  let round = await Round.findById(req.params.id);

  if (!round) {
    return next(
      new ErrorResponse(`Round not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is round owner
  if (round.user.toString() !== req.user.id) {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to update this round`,
        401
      )
    );
  }

  round = await Round.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: round,
  });
});

// @desc    Delete round
// @route   DELETE /api/rounds/:id
// @access  Private
exports.deleteRound = asyncHandler(async (req, res, next) => {
  const round = await Round.findById(req.params.id);

  if (!round) {
    return next(
      new ErrorResponse(`Round not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is round owner
  if (round.user.toString() !== req.user.id) {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to delete this round`,
        401
      )
    );
  }

  await round.remove();

  res.status(200).json({
    success: true,
    data: {},
  });
});
