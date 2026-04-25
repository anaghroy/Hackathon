import express from "express";
import cookieParser from "cookie-parser";
import passport from "./config/passport.js"
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import morgan from "morgan";
import authRouter from "./routes/auth.routes.js";
import { config } from "./config/config.js";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev"));
app.use(
  cors({
    origin: ["http://localhost:5173", config.FRONTEND_URL],
    credentials: true,
  }),
);


app.use(passport.initialize());


// API routes — must be BEFORE the static/catch-all
app.use("/api/auth", authRouter);


// Serve React build with correct absolute path
app.use(express.static(path.join(__dirname, "../public")));



export default app;