const Company = require("../models/Company");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");

// @desc    Get all companies
// @route   GET /api/companies
// @access  Private
exports.getCompanies = asyncHandler(async (req, res, next) => {
  const companies = await Company.find({ user: req.user.id });

  res.status(200).json({
    success: true,
    count: companies.length,
    data: companies,
  });
});

// @desc    Get single company
// @route   GET /api/companies/:id
// @access  Private
exports.getCompany = asyncHandler(async (req, res, next) => {
  const company = await Company.findOne({
    _id: req.params.id,
    user: req.user.id,
  });

  if (!company) {
    return next(
      new ErrorResponse(`Company not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: company,
  });
});

// @desc    Create company
// @route   POST /api/companies
// @access  Private
exports.createCompany = asyncHandler(async (req, res, next) => {
  req.body.user = req.user.id;

  const company = await Company.create(req.body);

  res.status(201).json({
    success: true,
    data: company,
  });
});

// @desc    Update company
// @route   PUT /api/companies/:id
// @access  Private
exports.updateCompany = asyncHandler(async (req, res, next) => {
  let company = await Company.findById(req.params.id);

  if (!company) {
    return next(
      new ErrorResponse(`Company not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is company owner
  if (company.user.toString() !== req.user.id) {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to update this company`,
        401
      )
    );
  }

  company = await Company.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: company,
  });
});

// @desc    Delete company
// @route   DELETE /api/companies/:id
// @access  Private
exports.deleteCompany = asyncHandler(async (req, res, next) => {
  const company = await Company.findById(req.params.id);

  if (!company) {
    return next(
      new ErrorResponse(`Company not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is company owner
  if (company.user.toString() !== req.user.id) {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to delete this company`,
        401
      )
    );
  }

  await company.remove();

  res.status(200).json({
    success: true,
    data: {},
  });
});
