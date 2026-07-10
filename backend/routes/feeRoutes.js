import express from "express";
import { createFee, getFees, recordPayment, deleteFee } from "../controllers/feeController.js";
import { protect, authorize } from "../middlewares/auth.js";

const router = express.Router();
router.use(protect);

router.get("/", authorize("schooladmin", "student", "parent"), getFees);
router.post("/", authorize("schooladmin"), createFee);
router.post("/:id/pay", authorize("schooladmin"), recordPayment);
router.delete("/:id", authorize("schooladmin"), deleteFee);

export default router;
