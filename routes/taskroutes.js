import express from "express";
import authMiddleware from "../middlware/authMiddleware.js";
import checkRole from "../middlware/rolemiddleware.js";
import Task from "../models/task.js";
import mongoose from "mongoose";

const router = express.Router();

router.get("/", authMiddleware, async (req, res) => {
  console.log("GET /tasks hit by:", req.user.id, req.user.role);
  try {
    const filter = req.user.role === "admin"
      ? {}
      : { assignee: new mongoose.Types.ObjectId(req.user.id) };

    console.log("🔍 Filter being applied:", filter);

    const tasks = await Task.find(filter).populate("assignee", "name email");

    console.log("📋 Tasks found:", tasks.length);
    console.log("📋 Tasks:", tasks.map(t => ({ id: t._id, name: t.name, assignee: t.assignee })));

    res.status(200).json(tasks);
  } catch (err) {
    console.error("Task fetch error:", err.message);
    res.status(500).json({ message: "Failed to get tasks" });
  }
});

router.post("/", authMiddleware, checkRole(["admin"]), async (req, res) => {
  try {
    const {
      name,
      description,
      assignee,
      status = "Pending",
      priority = "Medium",
      dueDate,
      taskType = "General",
    } = req.body;

    if (!name || !description || !assignee) {
      return res
        .status(400)
        .json({ message: "Name, description, and assignee are required" });
    }

    if (!mongoose.Types.ObjectId.isValid(assignee)) {
      return res.status(400).json({ message: "Invalid assignee ID" });
    }

    console.log("📝 Creating task with assignee:", assignee);
    
    const newTask = new Task({
      name,
      description,
      assignee,
      status,
      priority,
      dueDate,
      taskType,
    });

    const savedTask = await newTask.save();
    console.log("✅ Task created with ID:", savedTask._id, "Assignee:", savedTask.assignee);
    res.status(201).json(savedTask);
  } catch (err) {
    console.error("Task creation error:", err.message);
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
