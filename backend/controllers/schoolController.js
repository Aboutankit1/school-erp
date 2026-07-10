import School from "../models/School.js";
import User from "../models/User.js";
import Student from "../models/Student.js";
import Teacher from "../models/Teacher.js";
import { success, failure } from "../utils/apiResponse.js";

// @desc Get all schools (Super Admin)
// @route GET /api/schools
export const getSchools = async (req, res, next) => {
  try {
    const { status, search } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (search) filter.name = { $regex: search, $options: "i" };

    const schools = await School.find(filter).sort({ createdAt: -1 });
    return success(res, 200, "Schools fetched", { schools, count: schools.length });
  } catch (error) {
    next(error);
  }
};

// @desc Approve a school
// @route PUT /api/schools/:id/approve
export const approveSchool = async (req, res, next) => {
  try {
    const school = await School.findByIdAndUpdate(
      req.params.id,
      { status: "approved" },
      { new: true }
    );
    if (!school) return failure(res, 404, "School not found");
    return success(res, 200, "School approved successfully", { school });
  } catch (error) {
    next(error);
  }
};

// @desc Suspend a school
// @route PUT /api/schools/:id/suspend
export const suspendSchool = async (req, res, next) => {
  try {
    const school = await School.findByIdAndUpdate(
      req.params.id,
      { status: "suspended" },
      { new: true }
    );
    if (!school) return failure(res, 404, "School not found");
    return success(res, 200, "School suspended successfully", { school });
  } catch (error) {
    next(error);
  }
};

// @desc Platform-wide analytics for Super Admin
// @route GET /api/schools/analytics
export const getPlatformAnalytics = async (req, res, next) => {
  try {
    const totalSchools = await School.countDocuments();
    const approvedSchools = await School.countDocuments({ status: "approved" });
    const pendingSchools = await School.countDocuments({ status: "pending" });
    const suspendedSchools = await School.countDocuments({ status: "suspended" });
    const totalStudents = await Student.countDocuments();
    const totalTeachers = await Teacher.countDocuments();

    const planDistribution = await School.aggregate([
      { $group: { _id: "$plan", count: { $sum: 1 } } },
    ]);

    return success(res, 200, "Analytics fetched", {
      totalSchools,
      approvedSchools,
      pendingSchools,
      suspendedSchools,
      totalStudents,
      totalTeachers,
      planDistribution,
    });
  } catch (error) {
    next(error);
  }
};
