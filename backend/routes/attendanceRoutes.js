import express from "express";
import { markAttendance, getAttendance, getAttendanceReport } from "../controllers/attendanceController.js";
import { protect, authorize } from "../middlewares/auth.js";

const router = express.Router();
router.use(protect);

router.post("/mark", authorize("teacher", "schooladmin"), markAttendance);
router.get("/", getAttendance);
router.get("/report/:studentId", getAttendanceReport);

export default router;
