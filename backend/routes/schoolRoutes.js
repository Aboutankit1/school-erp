import express from "express";
import { getSchools, approveSchool, suspendSchool, getPlatformAnalytics } from "../controllers/schoolController.js";
import { protect, authorize } from "../middlewares/auth.js";

const router = express.Router();

router.use(protect, authorize("superadmin"));

router.get("/", getSchools);
router.get("/analytics", getPlatformAnalytics);
router.put("/:id/approve", approveSchool);
router.put("/:id/suspend", suspendSchool);

export default router;
