import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { UPLOAD_DIR } from "./config/env.js";
import user from "./routes/userRoutes.js";
import classs from "./routes/classRoutes.js";
import category from "./routes/categoryRoute.js";
import course from "./routes/courseRoutes.js";
import payment from "./routes/paymentRoutes.js";
import growthHighlight from "./routes/growthHighlightRoutes.js";
import lesson from "./routes/lessonRoutes.js";
import plan from "./routes/planRoutes.js";
import subscription from "./routes/subscriptionRoutes.js";
import errorhandler from "./middleware/error.js";

const app = express();

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Serve local media uploads
app.use("/upload", express.static(UPLOAD_DIR));

// API v1 Routes
app.use("/api/v1", user);
app.use("/api/v1", category);
app.use("/api/v1", classs);
app.use("/api/v1", course);
app.use("/api/v1", payment);
app.use("/api/v1", growthHighlight);
app.use("/api/v1", lesson);
app.use("/api/v1", plan);
app.use("/api/v1", subscription);

// Centralized Error Handling Middleware
app.use(errorhandler);

export default app;
