import express from "express";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import passport from "./config/passport.js";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import morgan from "morgan";
import authRouter from "./routes/auth.routes.js";
import projectRouter from "./routes/project.routes.js"
import uploadRouter from "./routes/upload.routes.js"
import aiRoutes from "./routes/ai.routes.js";
import { config } from "./config/config.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "https:"],
        styleSrc: ["'self'", "'unsafe-inline'", "https:"],
        imgSrc: ["'self'", "data:", "https:"],
        connectSrc: [
          "'self'",
          "https:",
          "http://localhost:5173",
          config.FRONTEND_URL,
        ],
      },
    },
  }),
);
app.disable("x-powered-by");
app.use(morgan("dev"));
app.use(
  cors({
    origin: ["http://localhost:5173", config.FRONTEND_URL],
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(passport.initialize());

// API routes — must be BEFORE the static/catch-all
app.use("/api/auth", authRouter);
app.use("/api/projects", projectRouter);
app.use("/api/upload", uploadRouter);
app.use("/api/ai", aiRoutes);

// Serve React build with correct absolute path
app.use(express.static(path.join(__dirname, "../public"), { index: false }));

export default app;
