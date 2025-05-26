import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/User.js";

const router = express.Router();

router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) throw new Error("Invalid credentials");

    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) throw new Error("Invalid credentials");

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.send({ token });
  } catch (error) {
    res.status(401).send({ error: error.message });
  }
});

router.post("/register", async (req, res) => {
  try {
    const exists = await User.findOne({ email: req.body.email });
    if (exists) throw new Error("Email already registered");

    const user = new User(req.body);
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(201).send({ token });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

export default router;
