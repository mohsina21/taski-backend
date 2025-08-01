import express from "express";
import authMiddleware from "../middlware/authMiddleware.js";
import checkRole from "../middlware/rolemiddleware.js";
import Task from "../models/task.js";
import mongoose from "mongoose";

const router = express.Router();

router.get("/", authMiddleware, async (req, res) => {
  try {
    const filter = req.user.role === "admin" ? {} : { assignee: req.user.id };
    const tasks = await Task.find(filter).populate("assignee", "name email");
    res.status(200).json(tasks);
  } catch (err) {
    res.status(500).json({ message: "Failed to get tasks" });
  }
});


router.post("/", authMiddleware, checkRole(["admin"]), async (req, res) => {
  try {
    const { name, description, assignee, status, priority, dueDate, taskType } = req.body;

    if (!name || !description || !assignee) {
      return res.status(400).json({ message: "Name, description, and assignee are required" });
    }

    if (!mongoose.Types.ObjectId.isValid(assignee)) {
      return res.status(400).json({ message: "Invalid assignee ID" });
    }

    const newTask = new Task({ name, description, assignee, status, priority, dueDate, taskType });
    const saved = await newTask.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: "Failed to create task", error: err.message });
  }
});


router.delete("/:id", authMiddleware, checkRole(["admin"]), async (req, res) => {
  try {
    const taskId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(taskId)) {
      return res.status(400).json({ message: "Invalid task ID" });
    }

    const deleted = await Task.findByIdAndDelete(taskId);

    if (!deleted) return res.status(404).json({ message: "Task not found" });

    res.status(200).json({ message: "Task deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete task", error: err.message });
  }
});



export default router;
