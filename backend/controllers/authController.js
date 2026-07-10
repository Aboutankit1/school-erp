import User from "../models/User.js";
import School from "../models/School.js";
import { generateAccessToken, generateRefreshToken } from "../utils/generateToken.js";
import { success, failure } from "../utils/apiResponse.js";
import crypto from "crypto";

// @desc Register a new school + school admin
// @route POST /api/auth/register-school
export const registerSchool = async (req, res, next) => {
  try {
    const { schoolName, schoolEmail, schoolPhone, adminName, adminEmail, password } = req.body;

    const existingSchool = await School.findOne({ email: schoolEmail });
    if (existingSchool) return failure(res, 400, "A school with this email already exists");

    const existingUser = await User.findOne({ email: adminEmail });
    if (existingUser) return failure(res, 400, "This admin email is already registered");

    const code = schoolName.substring(0, 3).toUpperCase() + Math.floor(1000 + Math.random() * 9000);

    const school = await School.create({
      name: schoolName,
      code,
      email: schoolEmail,
      phone: schoolPhone,
      status: "pending",
    });

    const admin = await User.create({
      name: adminName,
      email: adminEmail,
      password,
      role: "schooladmin",
      school: school._id,
    });

    return success(res, 201, "School registered successfully. Awaiting Super Admin approval.", {
      school,
      admin: { id: admin._id, name: admin.name, email: admin.email },
    });
  } catch (error) {
    next(error);
  }
};

// @desc Login
// @route POST /api/auth/login
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password").populate("school");
    if (!user) return failure(res, 401, "Invalid email or password");

    const isMatch = await user.matchPassword(password);
    if (!isMatch) return failure(res, 401, "Invalid email or password");

    if (!user.isActive) return failure(res, 403, "Your account has been deactivated");

    if (user.role === "schooladmin" && user.school?.status === "pending") {
      return failure(res, 403, "Your school registration is pending Super Admin approval");
    }
    if (user.role === "schooladmin" && user.school?.status === "suspended") {
      return failure(res, 403, "Your school has been suspended. Contact support.");
    }

    user.lastLogin = new Date();
    await user.save();

    const accessToken = generateAccessToken(user._id, user.role, user.school?._id);
    const refreshToken = generateRefreshToken(user._id);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    return success(res, 200, "Login successful", {
      accessToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        school: user.school,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc Get current logged in user
// @route GET /api/auth/me
export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate("school");
    return success(res, 200, "User fetched", { user });
  } catch (error) {
    next(error);
  }
};

// @desc Forgot password
// @route POST /api/auth/forgot-password
export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return failure(res, 404, "No account found with this email");

    const resetToken = crypto.randomBytes(20).toString("hex");
    user.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
    await user.save();

    // In production this would be emailed via Nodemailer
    return success(res, 200, "Password reset token generated", {
      resetToken, // demo only - normally sent via email, not returned in response
    });
  } catch (error) {
    next(error);
  }
};

// @desc Reset password
// @route PUT /api/auth/reset-password/:token
export const resetPassword = async (req, res, next) => {
  try {
    const resetPasswordToken = crypto.createHash("sha256").update(req.params.token).digest("hex");

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) return failure(res, 400, "Invalid or expired reset token");

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    return success(res, 200, "Password reset successful");
  } catch (error) {
    next(error);
  }
};

// @desc Refresh access token
// @route POST /api/auth/refresh-token
export const refreshToken = async (req, res, next) => {
  try {
    const token = req.cookies?.refreshToken;
    if (!token) return failure(res, 401, "No refresh token provided");

    const jwt = (await import("jsonwebtoken")).default;
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);

    const user = await User.findById(decoded.id);
    if (!user) return failure(res, 401, "User not found");

    const accessToken = generateAccessToken(user._id, user.role, user.school);
    return success(res, 200, "Token refreshed", { accessToken });
  } catch (error) {
    return failure(res, 401, "Invalid or expired refresh token");
  }
};

// @desc Logout
// @route POST /api/auth/logout
export const logout = async (req, res) => {
  res.clearCookie("refreshToken");
  return success(res, 200, "Logged out successfully");
};
