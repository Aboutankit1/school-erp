import express from "express";
import {
  createParent,
  getParents,
  getParent,
  updateParent,
  deleteParent,
} from "../controllers/parentController.js";
import { protect, authorize } from "../middlewares/auth.js";

const router = express.Router();
router.use(protect, authorize("schooladmin"));

router.get("/", getParents);
router.get("/:id", getParent);
router.post("/", createParent);
router.put("/:id", updateParent);
router.delete("/:id", deleteParent);

export default router;
