import express from "express";
import { authUser } from "../middleware/auth.middleware.js";
import {
  addMemory,
  getMemories,
  getFileMemory,
} from "../controllers/memory.controller.js";

const router = express.Router();

router.post("/:projectId", authUser, addMemory);
router.get("/:projectId", authUser, getMemories);
router.get("/:projectId/:filePath", authUser, getFileMemory);

export default router;