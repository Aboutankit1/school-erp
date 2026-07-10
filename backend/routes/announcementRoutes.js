import express from "express";
import {
  createAnnouncement,
  getAnnouncements,
  deleteAnnouncement,
} from "../controllers/announcementController.js";
import { protect, authorize } from "../middlewares/auth.js";

const router = express.Router();
router.use(protect);

router.get("/", getAnnouncements);
router.post("/", authorize("schooladmin", "teacher"), createAnnouncement);
router.delete("/:id", authorize("schooladmin"), deleteAnnouncement);

export default router;
