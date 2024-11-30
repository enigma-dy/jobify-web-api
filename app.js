import express from "express";
import connectDB from "./config/database.js";
import cors from "cors";
import logger from "./config/logger.js";
import dotenv from "dotenv";
import jobRoutes from "./routes/jobRoutes.js";
import userRouter from "./routes/userRoutes.js";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import path from "path";
import { fileURLToPath } from "url";
import compression from "compression";
import sponsorRouter from "./routes/sponsorRoutes.js";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./docs/swaggerConfig.js";
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const corsOptions = {
  origin: "https://jobify-liart-two.vercel.app",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
};

app.use(cors(corsOptions));

app.use("/images", express.static(path.join(__dirname, "public/images")));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    expectCt: true,
    referrerPolicy: { policy: "no-referrer" },
  })
);

app.use(compression());

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
app.use(limiter);

app.use(express.json());

connectDB();

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/api/v1/sponsors", sponsorRouter);
app.use("/api/v1/jobs", jobRoutes);
app.use("/api/v1/user", userRouter);


app.use((err, req, res, next) => {
  logger.error(err.message);
  res.status(err.status || 500).json({
    message: err.message,
    ...(process.env.NODE_ENV !== "production" && { stack: err.stack }),
  });
});

const PORT =  5000;
const server = app.listen(PORT, () =>
  logger.info(`Server is running on Port ${PORT}`)
);

// Handling uncaught exceptions
process.on("uncaughtException", (err) => {
  logger.error("Uncaught Exception:", err);
  shutdown();
});

// Handling unhandled promise rejections
process.on("unhandledRejection", (reason, promise) => {
  logger.error("Unhandled Rejection at:", promise, "Reason:", reason);
  shutdown();
});

const shutdown = () => {
  server.close(() => {
    logger.info("Server shutdown gracefully");
    process.exit(1);
  });

  setTimeout(() => {
    logger.error("Forcing Shutdown due to delay");
    process.exit(1);
  }, 5000);
};
