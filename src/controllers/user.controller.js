import bcrypt from "bcrypt";
import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { generateOTP, sendOTPEmail } from "./nodemailer.controller.js";
export const createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email, and password are required",
        success: false,
      });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const user = await userModel.findOne({ email: normalizedEmail });

    if (user) {
      return res.status(400).json({
        message: "user already exists",
        success: false,
      });
    }

    const salt = parseInt(process.env.SALT) || 10;

    const hashedpassword = bcrypt.hashSync(password, salt);
    const otp = generateOTP();
    const newUser = await userModel.create({
      name,
      email: normalizedEmail,
      password: hashedpassword,
      otp,
      otpExpiry: Date.now() + 5 * 60 * 1000,
    });

    await sendOTPEmail(normalizedEmail, otp);

    const safeUser = {
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      isVerified: newUser.isVerified,
      createdAt: newUser.createdAt,
    };

    return res.status(201).json({
      data: safeUser,
      message: "user created successfully",
      success: true,
      requiresVerification: true,
    });
  } catch (error) {
    console.error("createUser error:", error);
    return res.status(500).json({
      message: error.message || "something went wrong",
      success: false,
    });
  }
};

export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        message: "Email and OTP are required",
        success: false,
      });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const user = await userModel.findOne({ email: normalizedEmail });

    if (!user || !user.otp || user.otp !== String(otp).trim()) {
      return res.status(400).json({
        message: "Invalid OTP",
        success: false,
      });
    }

    if (user.otpExpiry < Date.now()) {
      return res.status(400).json({
        message: "OTP expired",
        success: false,
      });
    }
    user.isVerified = true;
    user.otp = null;
    user.otpExpiry = null;

    await user.save();

    return res.status(200).json({
      message: "OTP verified successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Something went wrong",
      success: false,
    });
  }
};

export const resendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Email is required",
        success: false,
      });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const user = await userModel.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(400).json({
        message: "User not found",
        success: false,
      });
    }

    if (user.isVerified) {
      return res.status(400).json({
        message: "User is already verified",
        success: false,
      });
    }

    const otp = generateOTP();
    user.otp = otp;
    user.otpExpiry = Date.now() + 5 * 60 * 1000;
    await user.save();

    await sendOTPEmail(normalizedEmail, otp);

    return res.status(200).json({
      message: "A new OTP has been sent to your email",
      success: true,
    });
  } catch (error) {
    console.error("resendOTP error:", error);
    return res.status(500).json({
      message: "Something went wrong",
      success: false,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
        success: false,
      });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const existingUser = await userModel
      .findOne({ email: normalizedEmail })
      .select("+password");

    if (!existingUser) {
      return res.status(400).json({
        message: "user not exists",
        success: false,
      });
    }

    const compare = bcrypt.compareSync(password, existingUser.password);
    if (!compare) {
      return res.status(400).json({
        message: "invalid password",
        success: false,
      });
    }

    if (!existingUser.isVerified) {
      return res.status(400).json({
        message: "Please verify OTP first",
      });
    }

    const token = jwt.sign(
      { id: existingUser._id, role: existingUser.role },
      process.env.TOKEN_SECRET_KEY,
      { expiresIn: "1h" },
    );

    const safeUser = {
      _id: existingUser._id,
      name: existingUser.name,
      email: existingUser.email,
      role: existingUser.role,
      isVerified: existingUser.isVerified,
      profileImage: existingUser.profileImage,
      createdAt: existingUser.createdAt,
    };

    return res.status(200).json({
      data: safeUser,
      token: token,
      message: "login successful",
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: "api error || something went wrong ",
      success: false,
    });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Email is required",
        success: false,
      });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const user = await userModel.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(200).json({
        message: "If this email is registered, a reset OTP has been sent.",
        success: true,
      });
    }

    const otp = generateOTP();
    user.otp = otp;
    user.otpExpiry = Date.now() + 5 * 60 * 1000;
    await user.save();

    await sendOTPEmail(normalizedEmail, otp);

    return res.status(200).json({
      message: "If this email is registered , a reset OTP has been sent.",
      success: true,
    });
  } catch (error) {
    console.error("forgotPassword error:", error);
    return res
      .status(500)
      .json({ message: "Something went wrong", success: false });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({
        message: "Email , OTP , and new password are required",
        success: false,
      });
    }
    if (newPassword.length < 8) {
      return res.status(400).json({
        message: "Password must be at least 8 characters",
        success: false,
      });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const user = await userModel
      .findOne({ email: normalizedEmail })
      .select("+password");

    if (!user) {
      return res.status(400).json({
        message: "Invalid email or OTP",
        success: false,
      });
    }

    if (!user.otpExpiry || user.otpExpiry < Date.now()) {
      return res.status(400).json({
        message: "OTP has expired. Please request a new one.",
        success: false,
      });
    }

    if (user.otp !== String(otp).trim()) {
      return res.status(400).json({ message: "Invalid OTP", success: false });
    }

    const isSamePassword = await bcrypt.compare(newPassword, user.password);

    if (isSamePassword) {
      return res.status(400).json({
        message: "New password cannot be the same as your current password",
        success: false,
      });
    }

    const salt = Number(process.env.SALT);

    user.password = bcrypt.hashSync(newPassword, salt);
    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    return res.status(200).json({
      message: "Password reset successfully. You can now log in.",
      success: true,
    });
  } catch (error) {
    console.error("resetPassword error:", error);
    return res
      .status(500)
      .json({ message: "Something went wrong", success: false });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { name, currentPassword, newPassword } = req.body;

    const userId = req.user.id;

    const user = await userModel.findById(userId).select("+password");

    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    }

    if (name) {
      if (name.trim().length < 2) {
        return res.status(400).json({
          message: "Name must be at least 2 characters",
          success: false,
        });
      }
      user.name = name.trim();
    }

    if (currentPassword || newPassword) {
      if (!currentPassword || !newPassword) {
        return res.status(400).json({
          message:
            "Both current and new password are required to change password",
          success: false,
        });
      }

      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res
          .status(400)
          .json({ message: "Current password is incorrect", success: false });
      }

      if (newPassword.length < 8) {
        return res.status(400).json({
          message: "New password must be at least 8 characters",
          success: false,
        });
      }

      const isSame = await bcrypt.compare(newPassword, user.password);
      if (isSame) {
        return res.status(400).json({
          message: "New password cannot be the same as your current password",
          success: false,
        });
      }

      const salt = parseInt(process.env.SALT, 10) || 10;
      user.password = await bcrypt.hash(newPassword, salt);
    }

    await user.save();

    const { password: _, otp, otpExpiry, ...safeUser } = user.toObject();

    return res.status(200).json({
      data: safeUser,
      message: "Profile updated successfully",
      success: true,
    });
  } catch (error) {
    console.error("updateUser error:", error);
    return res
      .status(500)
      .json({ message: "Something went wrong", success: false });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { password } = req.body;
    const userId = req.user.id;

    if (!password) {
      return res.status(400).json({
        message: "Please confirm your password to delete your account",
        success: false,
      });
    }

    const user = await userModel.findById(userId).select("+password");

    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ message: "Incorrect password", success: false });
    }

    await userModel.findByIdAndDelete(userId);

    return res
      .status(200)
      .json({ message: "Account deleted successfully", success: true });
  } catch (error) {
    console.error("deleteUser error:", error);
    return res
      .status(500)
      .json({ message: "Something went wrong", success: false });
  }
};
