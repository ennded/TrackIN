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
const RoundSchema = new mongoose.Schema({
  roundName: {
    type: String,
    required: [true, "Round name is required"],
  },
  date: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ["pending", "success", "failed"],
    default: "pending",
  },
  questions: [QuestionSchema],
});

const CompanySchema = new mongoose.Schema({
  companyName: {
    type: String,
    required: [true, "Company name is required"],
    trim: true,
    maxlength: [50, "Company name cannot exceed 50 characters"],
  },
  rounds: [RoundSchema],
});

export default mongoose.model("Company", CompanySchema);
