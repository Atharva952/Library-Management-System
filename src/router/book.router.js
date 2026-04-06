import { Router } from "express";
import {
  createBook,
  getAllBooks,
  getSingleBook,
  updateBook,
  softDeleteBook,
} from "../controllers/book.controller.js";
import { authMiddleware, isAdmin } from "../middleware/auth.middleware.js";
import { bookCoverMulter } from "../middleware/multer.middleware.js";

const bookRouter = Router();

// Public routes - Get operations
bookRouter.get("/", getAllBooks);
bookRouter.get("/:id", getSingleBook);

// Protected routes - Require authentication and admin role
bookRouter.post(
  "/",
  authMiddleware,
  isAdmin,
  bookCoverMulter.single("coverImage"),
  createBook,
);
bookRouter.put(
  "/:id",
  authMiddleware,
  isAdmin,
  bookCoverMulter.single("coverImage"),
  updateBook,
);
bookRouter.delete("/:id", authMiddleware, isAdmin, softDeleteBook);

export default bookRouter;
