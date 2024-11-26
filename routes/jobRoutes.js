import express from "express";
import {
  createJob,
  allJob,
  getJob,
  applyForJob,
  getJobCategories,
  getFeaturedJobs,
  getJobApplicants,
  deleteJob,
} from "../controllers/jobController.js";
import { restrictTo } from "../middlewares/authMiddleware.js";
import { authenticateUser } from "../controllers/authController.js";
import upload from "../middlewares/uploadMiddlerware.js";

const router = express.Router();

router
  .get("", allJob)
  .get("/categories", getJobCategories)
  .get("/featured", getFeaturedJobs)
  .get("/:id", getJob)
  .get(
    "/jobapplicants",
    authenticateUser,
    restrictTo("employer"),
    getJobApplicants
  )
  .post("", authenticateUser, restrictTo("employer", "admin"), createJob)
  .post(
    "/apply",
    authenticateUser,
    restrictTo("job_seekers"),
    upload.fields([
      { name: "cv", maxCount: 1 },
      { name: "cover_letter", maxCount: 1 },
    ]),
    applyForJob
  )
  .delete("/job", authenticateUser, restrictTo("employer", "admin"), deleteJob);

export default router;
