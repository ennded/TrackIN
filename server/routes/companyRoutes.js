import express from "express";
import Company from "../models/Company.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

// Create Company
router.post("/", auth, async (req, res) => {
  try {
    const newCompany = await Company.create(req.body);
    res.status(201).json(newCompany);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Add Round to Company
// Add auth middleware to round routes
router.post("/:companyId/rounds", auth, async (req, res) => {
  try {
    const company = await Company.findById(req.params.companyId);
    if (!company) return res.status(404).json({ error: "Company not found" });

    const duration = Number(req.body.duration);
    if (!duration || isNaN(duration) || duration < 15 || duration > 480) {
      return res.status(400).json({
        error:
          "Duration is required and must be a number between 15 and 480 minutes",
      });
    }

    // Create new round with validation
    const newRound = {
      roundName: req.body.roundName,
      date: new Date(req.body.date),
      duration: Number(req.body.duration),
      status: "Scheduled",
      // Add other fields as needed
    };

    // Push and save
    company.rounds.push(newRound);
    const savedCompany = await company.save();

    res.status(201).json(savedCompany);
  } catch (error) {
    console.error("Error adding round:", error);
    res.status(400).json({ error: error.message });
  }
});

// Add Question to Round
// Add auth middleware to question route
router.post("/:companyId/rounds/:roundId/questions", auth, async (req, res) => {
  try {
    const company = await Company.findById(req.params.companyId);
    const round = company.rounds.id(req.params.roundId);

    if (!req.body.questionText || req.body.questionText.trim().length < 3) {
      return res.status(400).json({ error: "Valid question text required" });
    }

    round.questions.push({
      questionText: req.body.questionText.trim(),
      askedBy: req.user.id, // Ensure this is populated
    });

    const savedCompany = await company.save();
    res.json(savedCompany);
  } catch (error) {
    console.error("Question creation error:", error);
    res.status(400).json({
      error: error.message,
      validationErrors: error.errors,
    });
  }
});

// Get All Companies
router.get("/", auth, async (req, res) => {
  try {
    const companies = await Company.find();
    res.json(companies);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete Company
router.delete("/:companyId", auth, async (req, res) => {
  try {
    const company = await Company.findByIdAndDelete(req.params.companyId);
    if (!company) return res.status(404).json({ error: "Company not found" });
    res.json({ _id: company._id }); // Return deleted ID
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete Round
router.delete("/:companyId/rounds/:roundId", async (req, res) => {
  try {
    const company = await Company.findById(req.params.companyId);
    if (!company) return res.status(404).json({ error: "Company not found" });

    // Pull the round from the array
    company.rounds.pull({ _id: req.params.roundId });

    // Validate before saving
    const validationError = company.validateSync();
    if (validationError) {
      return res.status(400).json({ error: validationError.message });
    }

    await company.save();
    res.json(company);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update Company
router.patch("/:id", auth, async (req, res) => {
  try {
    const company = await Company.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.send(company);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Delete Question
// router.delete(
//   "/:companyId/rounds/:roundId/questions/:questionId",
//   auth,
//   async (req, res) => {
//     try {
//       const company = await Company.findById(req.params.companyId);
//       if (!company) return res.status(404).json({ error: "Company not found" });

//       const round = company.rounds.id(req.params.roundId);
//       if (!round) return res.status(404).json({ error: "Round not found" });

//       // Remove question using filter
//       round.questions = round.questions.filter(
//         (q) => q._id.toString() !== req.params.questionId
//       );

//       await company.save();
//       res.json(company);
//     } catch (error) {
//       res.status(400).json({ error: error.message });
//     }
//   }
// );

import mongoose from "mongoose";

router.delete(
  "/:companyId/rounds/:roundId/questions/:questionId",
  async (req, res) => {
    const { companyId, roundId, questionId } = req.params;

    // ✅ Validate IDs
    if (
      ![companyId, roundId, questionId].every(mongoose.Types.ObjectId.isValid)
    ) {
      return res.status(400).json({ error: "Invalid ID format" });
    }

    try {
      const company = await Company.findById(companyId);
      if (!company) return res.status(404).json({ error: "Company not found" });

      const round = company.rounds.id(roundId);
      if (!round) return res.status(404).json({ error: "Round not found" });

      const question = round.questions.id(questionId);
      if (!question)
        return res.status(404).json({ error: "Question not found" });

      question.remove();

      await company.save();
      res.json({ success: true });
    } catch (err) {
      console.error("Error deleting question:", err);
      res.status(500).json({ error: err.message });
    }
  }
);

// Update Round Status
router.put("/:companyId/rounds/:roundId/status", auth, async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ["Scheduled", "pending", "success", "failed"];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid or missing status" });
    }

    const company = await Company.findById(req.params.companyId);
    if (!company) return res.status(404).json({ error: "Company not found" });

    const round = company.rounds.id(req.params.roundId);
    if (!round) return res.status(404).json({ error: "Round not found" });

    round.status = status;

    const savedCompany = await company.save();

    res.json(savedCompany);
  } catch (error) {
    console.error("Error updating round status:", error);
    res.status(400).json({ error: error.message });
  }
});

router.get("/search", auth, async (req, res) => {
  try {
    const companies = await Company.find({
      companyName: { $regex: req.query.term, $options: "i" },
    });
    res.send(companies);
  } catch (error) {
    res.status(500).send();
  }
});

export default router;
