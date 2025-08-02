
import express from "express";
import { signup, login } from "../Controllers/authController.js"
import authMiddleware from "../middlware/authMiddleware.js"
import checkRole from "../middlware/rolemiddleware.js"

const router = express.Router();


router.post("/signup", signup);
router.post("/login", login);


router.get("/me", authMiddleware, (req, res) => {
  res.status(200).json({
    message: "Authenticated user",
    userId: req.user.id,
    role: req.user.role,
  });
});

router.get("/admin-only", authMiddleware, checkRole(["admin"]), (req, res) => {
  res.status(200).json({ message: "Hello Admin " });
});

export default router;
