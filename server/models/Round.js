const mongoose = require("mongoose");

const roundSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter round name"],
    trim: true,
    maxlength: [100, "Round name cannot exceed 100 characters"],
  },
  scheduledDate: {
    type: Date,
    required: [true, "Please enter scheduled date"],
  },
  status: {
    type: String,
    enum: ["scheduled", "completed", "cancelled", "passed", "failed"],
    default: "scheduled",
  },
  notes: {
    type: String,
    trim: true,
  },
  interviewer: {
    type: String,
    trim: true,
  },
  company: {
    type: mongoose.Schema.ObjectId,
    ref: "Company",
    required: true,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Round", roundSchema);
