import { Router } from "express";
import {
  createUser,
  deleteUser,
  forgotPassword,
  login,
  resendOTP,
  resetPassword,
  updateUser,
  verifyOTP,
} from "../controllers/user.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const userRouter = Router();

userRouter.post("/", createUser);
userRouter.post("/login", login);
userRouter.post("/verify-otp", verifyOTP);
userRouter.post("/resend-otp", resendOTP);
userRouter.post("/forgot-password", forgotPassword);
userRouter.post("/reset-password", resetPassword);
userRouter.put("/update", authMiddleware, updateUser);
userRouter.delete("/delete", authMiddleware, deleteUser);

export default userRouter;
