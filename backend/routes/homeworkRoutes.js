import express from "express";
import {
  createHomework,
  getHomeworks,
  submitHomework,
  gradeSubmission,
} from "../controllers/homeworkController.js";
import { protect, authorize } from "../middlewares/auth.js";

const router = express.Router();
router.use(protect);

router.get("/", getHomeworks);
router.post("/", authorize("teacher", "schooladmin"), createHomework);
router.post("/:id/submit", authorize("student"), submitHomework);
router.put("/:id/grade", authorize("teacher"), gradeSubmission);

export default router;
