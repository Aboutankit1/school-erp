import Student from "../models/Student.js";
import Teacher from "../models/Teacher.js";
import Class from "../models/Class.js";
import Parent from "../models/Parent.js";
import Attendance from "../models/Attendance.js";
import Homework from "../models/Homework.js";
import Announcement from "../models/Announcement.js";
import Fee from "../models/Fee.js";
import { success } from "../utils/apiResponse.js";

// @desc School Admin dashboard stats
// @route GET /api/dashboard/school-admin
export const getSchoolAdminStats = async (req, res, next) => {
  try {
    const school = req.user.school;

    const [totalStudents, totalTeachers, totalClasses, totalParents] = await Promise.all([
      Student.countDocuments({ school }),
      Teacher.countDocuments({ school }),
      Class.countDocuments({ school }),
      Parent.countDocuments({ school }),
    ]);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayAttendance = await Attendance.find({
      school,
      date: { $gte: today, $lt: tomorrow },
    });

    const presentToday = todayAttendance.filter((a) => a.status === "present").length;
    const attendanceRate = todayAttendance.length
      ? Math.round((presentToday / todayAttendance.length) * 100)
      : 0;

    const recentAnnouncements = await Announcement.find({ school })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("createdBy", "name");

    const upcomingHomework = await Homework.find({ school, dueDate: { $gte: new Date() } })
      .sort({ dueDate: 1 })
      .limit(5)
      .populate("subject", "name");

    // weekly attendance trend (last 7 days)
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 6);
    weekAgo.setHours(0, 0, 0, 0);

    const weeklyRaw = await Attendance.aggregate([
      { $match: { school: req.user.school, date: { $gte: weekAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
          present: { $sum: { $cond: [{ $eq: ["$status", "present"] }, 1, 0] } },
          absent: { $sum: { $cond: [{ $eq: ["$status", "absent"] }, 1, 0] } },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    return success(res, 200, "Dashboard stats fetched", {
      totalStudents,
      totalTeachers,
      totalClasses,
      totalParents,
      attendanceRate,
      presentToday,
      totalMarkedToday: todayAttendance.length,
      recentAnnouncements,
      upcomingHomework,
      weeklyAttendance: weeklyRaw,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Student Portal stats
// @route GET /api/dashboard/student
export const getStudentStats = async (req, res, next) => {
  try {
    const student = await Student.findOne({ user: req.user._id }).populate("class");
    if (!student) return success(res, 200, "No student profile linked", {});

    const homeworks = await Homework.find({
      class: student.class,
      section: student.section,
    })
      .sort({ dueDate: -1 })
      .limit(5);

    const attendanceRecords = await Attendance.find({ student: student._id }).sort({ date: -1 }).limit(30);
    const present = attendanceRecords.filter((a) => a.status === "present").length;
    const attendancePercent = attendanceRecords.length
      ? Math.round((present / attendanceRecords.length) * 100)
      : 0;

    const announcements = await Announcement.find({
      school: student.school,
      audience: { $in: ["all", "student"] },
    })
      .sort({ createdAt: -1 })
      .limit(5);

    const pendingFees = await Fee.find({ student: student._id, status: { $ne: "paid" } }).sort({ dueDate: 1 });

    return success(res, 200, "Student dashboard fetched", {
      student,
      homeworks,
      attendancePercent,
      announcements,
      pendingFees,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Parent Portal stats
// @route GET /api/dashboard/parent
export const getParentStats = async (req, res, next) => {
  try {
    const parent = await Parent.findOne({ user: req.user._id }).populate({
      path: "children",
      populate: [{ path: "user", select: "name avatar" }, { path: "class" }],
    });
    if (!parent) return success(res, 200, "No parent profile linked", {});

    return success(res, 200, "Parent dashboard fetched", { parent });
  } catch (error) {
    next(error);
  }
};
