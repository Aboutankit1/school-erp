import Fee from "../models/Fee.js";
import Student from "../models/Student.js";
import Parent from "../models/Parent.js";
import { success, failure } from "../utils/apiResponse.js";

// @desc Assign a fee to a single student, or bulk to a whole class+section
// @route POST /api/fees
export const createFee = async (req, res, next) => {
  try {
    const { studentId, classId, section, category, amount, discount, fine, dueDate } = req.body;

    if (studentId) {
      const fee = await Fee.create({
        school: req.user.school,
        student: studentId,
        category,
        amount,
        discount: discount || 0,
        fine: fine || 0,
        dueDate,
      });
      return success(res, 201, "Fee assigned successfully", { fees: [fee] });
    }

    if (classId && section) {
      const students = await Student.find({ school: req.user.school, class: classId, section });
      if (!students.length) return failure(res, 404, "No students found in this class/section");

      const fees = await Fee.insertMany(
        students.map((s) => ({
          school: req.user.school,
          student: s._id,
          category,
          amount,
          discount: discount || 0,
          fine: fine || 0,
          dueDate,
        }))
      );
      return success(res, 201, `Fee assigned to ${fees.length} students`, { fees });
    }

    return failure(res, 400, "Provide either studentId or classId + section");
  } catch (error) {
    next(error);
  }
};

// @desc Get fees (filterable by student/class/section/status)
// @route GET /api/fees
export const getFees = async (req, res, next) => {
  try {
    const { studentId, status, search } = req.query;
    const filter = { school: req.user.school };

    // Students and parents can only ever see their own / their children's fees,
    // regardless of what studentId is passed in the query.
    if (req.user.role === "student") {
      const student = await Student.findOne({ user: req.user._id });
      if (!student) return success(res, 200, "Fees fetched", { fees: [], summary: {} });
      filter.student = student._id;
    } else if (req.user.role === "parent") {
      const parent = await Parent.findOne({ user: req.user._id });
      const childIds = parent?.children || [];
      if (studentId && childIds.map(String).includes(studentId)) {
        filter.student = studentId;
      } else {
        filter.student = { $in: childIds };
      }
    } else {
      if (studentId) filter.student = studentId;
    }

    if (status) filter.status = status;

    let fees = await Fee.find(filter)
      .populate({ path: "student", populate: [{ path: "user", select: "name" }, { path: "class", select: "name" }] })
      .sort({ dueDate: 1 });

    if (search) {
      const term = search.toLowerCase();
      fees = fees.filter((f) => f.student?.user?.name?.toLowerCase().includes(term));
    }

    const summary = {
      totalBilled: fees.reduce((s, f) => s + (f.amount - f.discount + f.fine), 0),
      totalCollected: fees.reduce((s, f) => s + f.payments.reduce((a, p) => a + p.amount, 0), 0),
      pendingCount: fees.filter((f) => f.status !== "paid").length,
    };

    return success(res, 200, "Fees fetched", { fees, summary });
  } catch (error) {
    next(error);
  }
};

// @desc Record a payment against a fee
// @route POST /api/fees/:id/pay
export const recordPayment = async (req, res, next) => {
  try {
    const { amount, mode, receiptNo } = req.body;
    const fee = await Fee.findOne({ _id: req.params.id, school: req.user.school });
    if (!fee) return failure(res, 404, "Fee record not found");

    fee.payments.push({ amount, mode, receiptNo, recordedBy: req.user._id });
    fee.recalculateStatus();
    await fee.save();

    return success(res, 200, "Payment recorded successfully", { fee });
  } catch (error) {
    next(error);
  }
};

// @desc Delete a fee record
// @route DELETE /api/fees/:id
export const deleteFee = async (req, res, next) => {
  try {
    const fee = await Fee.findOneAndDelete({ _id: req.params.id, school: req.user.school });
    if (!fee) return failure(res, 404, "Fee record not found");
    return success(res, 200, "Fee record deleted successfully");
  } catch (error) {
    next(error);
  }
};
