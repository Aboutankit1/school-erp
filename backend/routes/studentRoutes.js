import express from "express";
import {
  createStudent,
  getStudents,
  getStudent,
  updateStudent,
  deleteStudent,
} from "../controllers/studentController.js";
import { protect, authorize } from "../middlewares/auth.js";

const router = express.Router();

router.use(protect);

router.get("/", authorize("schooladmin", "teacher"), getStudents);
router.get("/:id", authorize("schooladmin", "teacher"), getStudent);
router.post("/", authorize("schooladmin"), createStudent);
router.put("/:id", authorize("schooladmin"), updateStudent);
router.delete("/:id", authorize("schooladmin"), deleteStudent);

export default router;
