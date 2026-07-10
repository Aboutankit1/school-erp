import express from "express";
import {
  createTeacher,
  getTeachers,
  getTeacher,
  updateTeacher,
  deleteTeacher,
} from "../controllers/teacherController.js";
import { protect, authorize } from "../middlewares/auth.js";

const router = express.Router();
router.use(protect);

router.get("/", authorize("schooladmin"), getTeachers);
router.get("/:id", authorize("schooladmin"), getTeacher);
router.post("/", authorize("schooladmin"), createTeacher);
router.put("/:id", authorize("schooladmin"), updateTeacher);
router.delete("/:id", authorize("schooladmin"), deleteTeacher);

export default router;
