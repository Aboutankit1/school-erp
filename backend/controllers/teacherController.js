import Teacher from "../models/Teacher.js";
import User from "../models/User.js";
import crypto from "crypto";
import { success, failure } from "../utils/apiResponse.js";

const generatePassword = () => crypto.randomBytes(4).toString("hex");

export const createTeacher = async (req, res, next) => {
  try {
    const { name, email, password, employeeId, qualification, salary, subjects, classes } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return failure(res, 400, "Email already in use");

    const plainPassword = password && password.length >= 6 ? password : generatePassword();

    const user = await User.create({
      name,
      email,
      password: plainPassword,
      role: "teacher",
      school: req.user.school,
    });

    const teacher = await Teacher.create({
      school: req.user.school,
      user: user._id,
      employeeId,
      qualification,
      salary,
      subjects,
      classes,
    });

    const populated = await teacher.populate([{ path: "user", select: "-password" }, { path: "classes" }]);
    return success(res, 201, "Teacher added successfully", {
      teacher: populated,
      credentials: { email, password: plainPassword },
    });
  } catch (error) {
    next(error);
  }
};

export const getTeachers = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const filter = { school: req.user.school };
    const total = await Teacher.countDocuments(filter);
    const teachers = await Teacher.find(filter)
      .populate("user", "-password")
      .populate("classes", "name")
      .populate("subjects", "name")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    return success(res, 200, "Teachers fetched", { teachers, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (error) {
    next(error);
  }
};

export const getTeacher = async (req, res, next) => {
  try {
    const teacher = await Teacher.findOne({ _id: req.params.id, school: req.user.school })
      .populate("user", "-password")
      .populate("classes")
      .populate("subjects");
    if (!teacher) return failure(res, 404, "Teacher not found");
    return success(res, 200, "Teacher fetched", { teacher });
  } catch (error) {
    next(error);
  }
};

export const updateTeacher = async (req, res, next) => {
  try {
    const teacher = await Teacher.findOneAndUpdate(
      { _id: req.params.id, school: req.user.school },
      req.body,
      { new: true, runValidators: true }
    );
    if (!teacher) return failure(res, 404, "Teacher not found");
    return success(res, 200, "Teacher updated successfully", { teacher });
  } catch (error) {
    next(error);
  }
};

export const deleteTeacher = async (req, res, next) => {
  try {
    const teacher = await Teacher.findOneAndDelete({ _id: req.params.id, school: req.user.school });
    if (!teacher) return failure(res, 404, "Teacher not found");
    await User.findByIdAndDelete(teacher.user);
    return success(res, 200, "Teacher removed successfully");
  } catch (error) {
    next(error);
  }
};
