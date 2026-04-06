import { uploadOnCloudinary, deleteCloudinaryImage } from "./cloudinary.js";
import fs from "fs";
import path from "path";
import crypto from "crypto";

const generateFileHash = (filePath) => {
  const fileBuffer = fs.readFileSync(filePath);
  return crypto.createHash("md5").update(fileBuffer).digest("hex");
};

export const processImageUpload = async (
  req,
  fieldName,
  modelField = "avatar",
) => {
  if (!req.file) return null;

  const uploadDir = req.file.destination; // e.g., './uploads/avatars' or './uploads/book-covers'
  const fileHash = generateFileHash(req.file.path);
  const ext = path.extname(req.file.originalname);
  const hashFileName = `${fileHash}${ext}`; // Use hash as filename
  const finalPath = path.join(uploadDir, hashFileName);

  // Check if file with same hash already exists
  if (fs.existsSync(finalPath)) {
    // File already exists, delete the temp upload and return existing path
    fs.unlinkSync(req.file.path);
    const cloudinaryData = await uploadOnCloudinary(finalPath);
    return {
      localPath: finalPath,
      cloudinary: cloudinaryData,
    };
  }

  // File doesn't exist, rename temp file to hash-based name
  fs.renameSync(req.file.path, finalPath);

  const cloudinaryData = await uploadOnCloudinary(finalPath);

  return {
    localPath: finalPath,
    cloudinary: cloudinaryData,
  };
};

export const replaceImage = async (req, existingImage, fieldName) => {
  if (req.file) {
    if (existingImage?.cloudinary?.public_id) {
      await deleteCloudinaryImage(existingImage.cloudinary.public_id);
    }

    if (existingImage?.localPath && fs.existsSync(existingImage.localPath)) {
      fs.unlinkSync(existingImage.localPath);
    }

    return await processImageUpload(req, fieldName);
  }
  return existingImage;
};
