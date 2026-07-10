import express from "express";
import {
  createClass,
  getClasses,
  updateClass,
  deleteClass,
  createSubject,
  getSubjects,
} from "../controllers/classController.js";
import { protect, authorize } from "../middlewares/auth.js";

const router = express.Router();
router.use(protect);

router.get("/", getClasses);
router.post("/", authorize("schooladmin"), createClass);
router.put("/:id", authorize("schooladmin"), updateClass);
router.delete("/:id", authorize("schooladmin"), deleteClass);

router.get("/subjects/all", getSubjects);
router.post("/subjects", authorize("schooladmin"), createSubject);

export default router;
