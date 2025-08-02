import Task from "../models/task.js";

export const getTasks = async (req, res) => {
  try {
    const user = req.user;
 console.log("📥 User in getTasks:", user);
    let tasks;

    if (user.role === "admin") {
      tasks = await Task.find().populate("assignee", "name email");
    } else {
      tasks = await Task.find({ assignee: user._id }).populate("assignee", "name email");
    }

    res.status(200).json(tasks);
  } catch (err) {
    console.error(" Error fetching tasks:", err);
    res.status(500).json({ message: "Failed to fetch tasks" });
  }
};


