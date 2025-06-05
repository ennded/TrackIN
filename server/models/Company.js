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
    date: {
      type: Date,
      required: [true, "Interview date is required"],
    },
    roundName: {
      type: String,
      required: [true, "Round name is required"],
      trim: true,
      minlength: [3, "Round name must be at least 3 characters"],
    },

    status: {
      type: String,
      enum: ["Pending", "Success", "Failed", "On Hold", "Completed"],
      default: "Pending",
      required: true,
    },

    outcome: {
      type: String,
      enum: ["Selected", "Rejected", "On Hold", "Awaiting Feedback"],
    },
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
    followUp: {
      reminderDate: Date,
      lastFollowUp: Date,
      followUpCount: {
        type: Number,
        default: 0,
      },
    },
    duration: {
      type: Number,
      min: 1,
      default: 30,
      required: true,
    },
    //calendarEventId: String, // For sync operations
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
