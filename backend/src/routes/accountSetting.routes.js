import express from "express";
import { authUser } from "../middleware/auth.middleware.js";
import { getSettings, updateSettings } from "../controllers/accountSetting.controller.js";

const router = express.Router();

router.use(authUser);

router.get("/", getSettings);
router.put("/", updateSettings);

export default router;
