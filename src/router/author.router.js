import { Router } from "express";
import {
  createAuthor,
  getAllAuthor,
  getSingleAuthor,
  updateAuthor,
  softDeleteAuthor,
  restoreAuthor,
} from "../controllers/author.controller.js";
import { authMiddleware, isAdmin } from "../middleware/auth.middleware.js";

const authorRouter = Router();

// Public routes - Get operations
authorRouter.get("/", getAllAuthor);
authorRouter.get("/:id", getSingleAuthor);

// Protected routes - Require authentication and admin role
authorRouter.post("/", authMiddleware, isAdmin, createAuthor);
authorRouter.put("/:id", authMiddleware, isAdmin, updateAuthor);
authorRouter.delete("/:id", authMiddleware, isAdmin, softDeleteAuthor);
authorRouter.post("/restore/:id", authMiddleware, isAdmin, restoreAuthor);

export default authorRouter;
