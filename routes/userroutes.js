import express from "express";
import authMiddleware from "../middlware/authMiddleware.js";
import User from "../models/user.js";

const router = express.Router();

router.get("/", authMiddleware, async (req, res) => {
  try {
    const users = await User.find({ role: "user" }).select("-password");
    res.status(200).json(users);
  } catch (err) {
    console.error("Failed to get users:", err);
    res.status(500).json({ error: "Server error" });
  }
});
router.get("/team", authMiddleware, async (req, res) => {
  try {
    const teamUsers = await User.find({ role: "team" }).select("name email");
    res.status(200).json(teamUsers);
  } catch (err) {
    res.status(500).json({ message: "Failed to get team users" });
  }
});

export default router;
