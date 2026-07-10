import Student from "../models/Student.js";
import User from "../models/User.js";
import crypto from "crypto";
import { success, failure } from "../utils/apiResponse.js";

const generatePassword = () => crypto.randomBytes(4).toString("hex"); // 8-char random password

// @desc Create a student (creates linked User with role=student)
// @route POST /api/students
export const createStudent = async (req, res, next) => {
  try {
    const { name, email, password, admissionNo, rollNo, classId, section, dob, gender, bloodGroup, address } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return failure(res, 400, "Email already in use");

    const plainPassword = password && password.length >= 6 ? password : generatePassword();

    const user = await User.create({
      name,
      email,
      password: plainPassword,
      role: "student",
      school: req.user.school,
    });

    const student = await Student.create({
      school: req.user.school,
      user: user._id,
      admissionNo,
      rollNo,
      class: classId,
      section,
      dob,
      gender,
      bloodGroup,
      address,
    });

    const populated = await student.populate([{ path: "user", select: "-password" }, { path: "class" }]);

    return success(res, 201, "Student admitted successfully", {
      student: populated,
      credentials: { email, password: plainPassword },
    });
  } catch (error) {
    next(error);
  }
};

// @desc Get all students for a school
// @route GET /api/students
export const getStudents = async (req, res, next) => {
  try {
    const { classId, section, search, page = 1, limit = 10 } = req.query;
    const filter = { school: req.user.school };
    if (classId) filter.class = classId;
    if (section) filter.section = section;

    let query = Student.find(filter)
      .populate("user", "-password")
      .populate("class", "name")
      .sort({ createdAt: -1 });

    if (search) {
      const users = await User.find({
        school: req.user.school,
        role: "student",
        name: { $regex: search, $options: "i" },
      }).select("_id");
      query = query.where("user").in(users.map((u) => u._id));
    }

    const total = await Student.countDocuments(filter);
    const students = await query.skip((page - 1) * limit).limit(Number(limit));

    return success(res, 200, "Students fetched", {
      students,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    next(error);
  }
};

// @desc Get single student
// @route GET /api/students/:id
export const getStudent = async (req, res, next) => {
  try {
    const student = await Student.findOne({ _id: req.params.id, school: req.user.school })
      .populate("user", "-password")
      .populate("class")
      .populate("parent");
    if (!student) return failure(res, 404, "Student not found");
    return success(res, 200, "Student fetched", { student });
  } catch (error) {
    next(error);
  }
};

// @desc Update student
// @route PUT /api/students/:id
export const updateStudent = async (req, res, next) => {
  try {
    const student = await Student.findOneAndUpdate(
      { _id: req.params.id, school: req.user.school },
      req.body,
      { new: true, runValidators: true }
    );
    if (!student) return failure(res, 404, "Student not found");
    return success(res, 200, "Student updated successfully", { student });
  } catch (error) {
    next(error);
  }
};

// @desc Delete / transfer-out student
// @route DELETE /api/students/:id
export const deleteStudent = async (req, res, next) => {
  try {
    const student = await Student.findOneAndDelete({ _id: req.params.id, school: req.user.school });
    if (!student) return failure(res, 404, "Student not found");
    await User.findByIdAndDelete(student.user);
    return success(res, 200, "Student removed successfully");
  } catch (error) {
    next(error);
  }
};
