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
router.delete("/:companyId/rounds/:roundId", auth, async (req, res) => {
  try {
    const company = await Company.findById(req.params.companyId);
    if (!company) return res.status(404).json({ error: "Company not found" });

    // Find index and remove
    const roundIndex = company.rounds.findIndex(
      (r) => r._id.toString() === req.params.roundId
    );

    if (roundIndex === -1) {
      return res.status(404).json({ error: "Round not found" });
    }

    company.rounds.splice(roundIndex, 1);
    await company.save();

    res.json({ message: "Round deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
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
router.delete(
  "/:companyId/rounds/:roundId/questions/:questionId",
  auth,
  async (req, res) => {
    try {
      const company = await Company.findById(req.params.companyId);
      const round = company.rounds.id(req.params.roundId);
      round.questions.pull({ _id: req.params.questionId });
      const updatedCompany = await company.save();
      res.json(updatedCompany);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
);

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
