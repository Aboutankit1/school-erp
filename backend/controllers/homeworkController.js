import Homework from "../models/Homework.js";
import Teacher from "../models/Teacher.js";
import { success, failure } from "../utils/apiResponse.js";

export const createHomework = async (req, res, next) => {
  try {
    const payload = { ...req.body, school: req.user.school };

    // Resolve the teacher reference automatically for teacher accounts.
    // (Previously this field was required on the model but never set here,
    // so every homework creation failed validation — this was the "homework
    // add nahi ho raha" bug.)
    if (req.user.role === "teacher") {
      const teacherProfile = await Teacher.findOne({ user: req.user._id });
      if (teacherProfile) payload.teacher = teacherProfile._id;
    } else if (!payload.teacher) {
      delete payload.teacher; // school admin creating without picking a teacher
    }

    // Strip empty-string optional fields (e.g. an unselected <select subject>)
    // so Mongoose doesn't try to cast "" to an ObjectId.
    if (!payload.subject) delete payload.subject;

    const homework = await Homework.create(payload);
    return success(res, 201, "Homework created successfully", { homework });
  } catch (error) {
    next(error);
  }
};

export const getHomeworks = async (req, res, next) => {
  try {
    const { classId, section, studentId } = req.query;
    const filter = { school: req.user.school };
    if (classId) filter.class = classId;
    if (section) filter.section = section;

    const homeworks = await Homework.find(filter)
      .populate("subject", "name")
      .populate({ path: "teacher", populate: { path: "user", select: "name" } })
      .sort({ dueDate: -1 });

    return success(res, 200, "Homework fetched", { homeworks });
  } catch (error) {
    next(error);
  }
};

export const submitHomework = async (req, res, next) => {
  try {
    const { studentId, attachment } = req.body;
    const homework = await Homework.findById(req.params.id);
    if (!homework) return failure(res, 404, "Homework not found");

    const already = homework.submissions.find((s) => s.student.toString() === studentId);
    if (already) return failure(res, 400, "Homework already submitted");

    const status = new Date() > homework.dueDate ? "late" : "submitted";
    homework.submissions.push({ student: studentId, attachment, status });
    await homework.save();

    return success(res, 200, "Homework submitted successfully", { homework });
  } catch (error) {
    next(error);
  }
};

export const gradeSubmission = async (req, res, next) => {
  try {
    const { studentId, grade, feedback } = req.body;
    const homework = await Homework.findById(req.params.id);
    if (!homework) return failure(res, 404, "Homework not found");

    const submission = homework.submissions.find((s) => s.student.toString() === studentId);
    if (!submission) return failure(res, 404, "Submission not found");

    submission.grade = grade;
    submission.feedback = feedback;
    submission.status = "graded";
    await homework.save();

    return success(res, 200, "Submission graded successfully", { homework });
  } catch (error) {
    next(error);
  }
};
