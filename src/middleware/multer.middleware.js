import multer from "multer";
import fs from "fs";
import path from "path";
import { generateOTP } from "../controllers/nodemailer.controller.js";

// Ensure directory exists
const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

export const userAvatarUpload = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "./uploads/avatars";
    ensureDir(dir);
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const name = path.parse(file.originalname).name;
    const ext = path.parse(file.originalname).ext;
    const uniqueVal = Date.now() + generateOTP();
    cb(null, `${name}--${uniqueVal}${ext}`);
  },
});

export const avatarUpload = multer({
  storage: userAvatarUpload,
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) cb(null, true);
    else cb(new Error("Only images allowed"), false);
  },
});

export const bookCoverUpload = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "./uploads/book-covers";
    ensureDir(dir);
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const name = path.parse(file.originalname).name;
    const ext = path.parse(file.originalname).ext;
    const uniqueVal = Date.now() + generateOTP();
    cb(null, `${name}--${uniqueVal}${ext}`);
  },
});

export const bookCoverMulter = multer({
  storage: bookCoverUpload,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) cb(null, true);
    else cb(new Error("Only images allowed"), false);
  },
});
