import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import taskRoutes from "./routes/taskroutes.js"
import userRoutes from "./routes/userroutes.js"
import authRoutes from "./routes/router.js";
import mongoose from "mongoose";
dotenv.config();
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
});

mongoose.connection.on("error", (err) => {
  console.error(" MongoDB connection error:", err);
});



const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/tasks", taskRoutes); 
app.use("/api/v1/users", userRoutes);

export default app;
