import express from "express";
import { upload } from "../middleware/upload.middleware.js";
import { uploadProjectFiles } from "../controllers/upload.controller.js";
import { authUser } from "../middleware/auth.middleware.js";

const uploadRouter = express.Router();

uploadRouter.post(
  "/:projectId",
  authUser,
  upload.array("files", 20),
  uploadProjectFiles
);

export default uploadRouter;