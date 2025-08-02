import Task from "../models/task.js";

export const getTasks = async (req, res) => {
  try {
    const user = req.user;

    let tasks = [];

    if (user.role === "admin") {
      tasks = await Task.find()
        .populate("assignee", "name email")
        .populate("createdBy", "name email");
    } else {
      tasks = await Task.find({
        $or: [
          { assignee: user._id },
          { createdBy: user._id }
        ],
      })
        .populate("assignee", "name email")
        .populate("createdBy", "name email");
    }

    res.status(200).json(tasks);
  } catch (err) {
    console.error(" Failed to fetch tasks:", err);
    res.status(500).json({ message: "Server error" });
  }
};


export const createTask = async (req, res) => {
  try {
    const { name, description, assignee, status, priority, taskType, dueDate } = req.body;

    if (!name || !description || !assignee) {
      return res.status(400).json({ message: "Name, description, and assignee are required" });
    }

    const newTask = await Task.create({
      name,
      description,
      assignee,
      status,
      priority,
      taskType,
      dueDate,
      createdBy: req.user.id, 
    });

    
    res.status(201).json(newTask);
  } catch (err) {
    console.error(" Task creation failed:", err);
    res.status(500).json({ message: "Server error" });
  }
};