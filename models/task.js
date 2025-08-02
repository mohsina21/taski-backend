import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  assignee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  status: { type: String, default: "todo" },
  priority: { type: String, default: "medium" },
  taskType: { type: String },
  dueDate: { type: Date },
});

const Task = mongoose.model("Task", taskSchema);
export default Task;
