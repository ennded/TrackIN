import mongoose from "mongoose";

const QuestionSchema = new mongoose.Schema(
  {
    questionText: {
      type: String,
      required: [true, "Question text is required"],
      trim: true,
    },
    // Make other fields optional initially
    category: {
      type: String,
      default: "technical",
    },
    difficulty: {
      type: String,
      default: "medium",
    },
    askedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);
const RoundSchema = new mongoose.Schema(
  {
    roundName: {
      type: String,
      required: [true, "Round name is required"],
    },
    date: {
      type: Date,
      required: [true, "Interview date is required"],
    },
    status: {
      type: String,
      enum: ["pending", "success", "failed"],
      default: "Scheduled",
    },
    outcome: {
      type: String,
      enum: ["Selected", "Rejected", "On Hold", "Awaiting Feedback"],
    },
    duration: Number, // in minutes
    type: {
      type: String,
      enum: ["HR", "Technical", "System Design", "Managerial", "Case Study"],
    },
    mode: {
      type: String,
      enum: ["Online", "Offline", "Telephonic", "Video Call"],
    },
    interviewer: {
      name: String,
      role: String,
      email: String,
    },
    feedback: String,
    questions: [QuestionSchema],
  },
  { timestamps: true }
);

const CompanySchema = new mongoose.Schema({
  offerStatus: {
    type: String,
    enum: ["Accepted", "Declined", "Negotiating", "Pending"],
  },
  companyName: {
    type: String,
    required: [true, "Company name is required"],
    trim: true,
    maxlength: [50, "Company name cannot exceed 50 characters"],
  },
  rounds: [RoundSchema],
});

export default mongoose.model("Company", CompanySchema);
