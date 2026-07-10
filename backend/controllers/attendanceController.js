import Attendance from "../models/Attendance.js";
import Student from "../models/Student.js";
import { success, failure } from "../utils/apiResponse.js";

// @desc Mark attendance in bulk for a class/section/date
// @route POST /api/attendance/mark
export const markAttendance = async (req, res, next) => {
  try {
    const { classId, section, date, records } = req.body;
    // records: [{ studentId, status, remarks }]

    const operations = records.map((r) => ({
      updateOne: {
        filter: { student: r.studentId, date: new Date(date) },
        update: {
          $set: {
            school: req.user.school,
            student: r.studentId,
            class: classId,
            section,
            date: new Date(date),
            status: r.status,
            remarks: r.remarks || "",
            markedBy: req.user._id,
          },
        },
        upsert: true,
      },
    }));

    await Attendance.bulkWrite(operations);
    return success(res, 200, "Attendance marked successfully");
  } catch (error) {
    next(error);
  }
};

// @desc Get attendance for a class/section/date
// @route GET /api/attendance
export const getAttendance = async (req, res, next) => {
  try {
    const { classId, section, date, studentId, from, to } = req.query;
    const filter = { school: req.user.school };
    if (classId) filter.class = classId;
    if (section) filter.section = section;
    if (studentId) filter.student = studentId;
    if (date) filter.date = new Date(date);
    if (from && to) filter.date = { $gte: new Date(from), $lte: new Date(to) };

    const attendance = await Attendance.find(filter)
      .populate({ path: "student", populate: { path: "user", select: "name" } })
      .sort({ date: -1 });

    return success(res, 200, "Attendance fetched", { attendance });
  } catch (error) {
    next(error);
  }
};

// @desc Get attendance summary/report (monthly) for a student
// @route GET /api/attendance/report/:studentId
export const getAttendanceReport = async (req, res, next) => {
  try {
    const { studentId } = req.params;
    const { month, year } = req.query;

    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 0, 23, 59, 59);

    const records = await Attendance.find({
      student: studentId,
      date: { $gte: start, $lte: end },
    }).sort({ date: 1 });

    const summary = {
      present: records.filter((r) => r.status === "present").length,
      absent: records.filter((r) => r.status === "absent").length,
      leave: records.filter((r) => r.status === "leave").length,
      late: records.filter((r) => r.status === "late").length,
      total: records.length,
    };

    return success(res, 200, "Attendance report fetched", { records, summary });
  } catch (error) {
    next(error);
  }
};
