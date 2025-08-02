import express from "express";
import authMiddleware from "../middlware/authMiddleware.js";
import checkRole from "../middlware/rolemiddleware.js";
import Task from "../models/task.js";
import mongoose from "mongoose";

import User from "../models/user.js";
const router = express.Router();

router.get("/", authMiddleware, async (req, res) => {
  const user = req.user;

  try {
    let tasks;

    if (user.role === "admin") {
      // 👑 Admin sees EVERYTHING
      tasks = await Task.find().populate("assignee", "name email");
    } else {
      // 👤 Regular user sees:
      // - tasks assigned TO them
      // - tasks they CREATED for others
      tasks = await Task.find({
        $or: [
          { assignee: user.id },
          { createdBy: user.id },
        ],
      }).populate("assignee", "name email");
    }

    res.json(tasks);
  } catch (error) {
    console.error("🔥 Error fetching tasks:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/", authMiddleware, async (req, res) => {
  try {
    

    let {
      name,
      description,
      assignee,
      status = "Pending",
      priority = "Medium",
      dueDate,
      taskType = "General",
    } = req.body;

    if (!assignee) {
      assignee = req.user.id; 
    }

    if (!name || !description || !assignee) {
      return res.status(400).json({ message: "Name, description, and assignee are required" });
    }

    if (!mongoose.Types.ObjectId.isValid(assignee)) {
      return res.status(400).json({ message: "Invalid assignee ID" });
    }

    const assignedUser = await User.findById(assignee);

    if (!assignedUser) {
      return res.status(404).json({ message: "Assignee user not found" });
    }

    if (assignedUser.role === "admin") {
      return res.status(403).json({ message: "You cannot assign tasks to an admin" });
    }

   


    const newTask = new Task({
      name,
      description,
      assignee,
      status,
      priority,
      dueDate,
      taskType,
      createdBy: req.user.id, 
    });

    const savedTask = await newTask.save();
    res.status(201).json(savedTask);
  } catch (err) {
    console.error("❌ Task creation error:", err.message);
    res.status(400).json({ message: "Failed to create task", error: err.message });
  }
});




router.delete("/:id", authMiddleware, checkRole(["admin"]), async (req, res) => {
  try {
    const taskId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(taskId)) {
      return res.status(400).json({ message: "Invalid task ID" });
    }

    const deletedTask = await Task.findByIdAndDelete(taskId);

    if (!deletedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json({ message: "Task deleted successfully" });
  } catch (err) {
    console.error("Task delete error:", err.message);
    res.status(500).json({ message: "Failed to delete task", error: err.message });
  }
});

export default router;
