import express from "express";
import { authUser } from "../middleware/auth.middleware.js";
import { 
  intentAnalysis, 
  explainCodebase, 
  explainGraphWithAI,
  generateSchema,
  generateTests,
  reviewCode
} from "../controllers/ai.controller.js";

const aiRouter = express.Router();

aiRouter.get("/ping", (req, res) => res.json({ message: "pong" }));

aiRouter.post("/intent/:projectId", authUser, intentAnalysis);
aiRouter.get("/explain/:projectId", authUser, explainCodebase);
aiRouter.get("/explain-ai/:projectId", authUser, explainGraphWithAI);
aiRouter.post("/schema/:projectId", authUser, generateSchema);
aiRouter.post("/test/:projectId", authUser, generateTests);
aiRouter.post("/review/:projectId", authUser, reviewCode);

export default aiRouter;
