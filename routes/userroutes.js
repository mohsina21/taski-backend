import express from "express";
import authMiddleware from "../middlware/authMiddleware.js";
import checkRole from "../middlware/rolemiddleware.js";
import User from "../models/User.js";

const router = express.Router();


router.get("/", authMiddleware, checkRole(["admin"]), async (req, res) => {
  try {
    const users = await User.find().select("-password"); // hide password for safety
    res.status(200).json(users);
  } catch (err) {
    console.error("Failed to get users:", err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
