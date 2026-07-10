import express from "express";
import { getSchoolAdminStats, getStudentStats, getParentStats } from "../controllers/dashboardController.js";
import { protect, authorize } from "../middlewares/auth.js";

const router = express.Router();
router.use(protect);

router.get("/school-admin", authorize("schooladmin", "teacher"), getSchoolAdminStats);
router.get("/student", authorize("student"), getStudentStats);
router.get("/parent", authorize("parent"), getParentStats);

export default router;
