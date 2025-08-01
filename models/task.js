import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  assignee: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  status: { type: String, default: "Pending" },
  priority: { type: String, default: "Medium" },
  taskType: { type: String, default: "Feature" },
  dueDate: { type: Date },
}, { timestamps: true });

const Task = mongoose.model("Task", taskSchema);

export default Task;
