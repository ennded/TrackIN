import mongoose from "mongoose";

const QuestionSchema = new mongoose.Schema({
  questionText: String,
});

const RoundSchema = new mongoose.Schema({
  roundName: String,
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
