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
  getJobCount,
  getUserJobs,
  getJobApplications,
} from "../controllers/jobController.js";
import { restrictTo } from "../middlewares/authMiddleware.js";
import { authenticateUser } from "../controllers/authController.js";
import upload from "../middlewares/uploadMiddlerware.js";

const router = express.Router();

/**
 * @swagger
 * /jobs:
 *   get:
 *     summary: Retrieve all jobs
 *     description: Fetch a list of all available jobs.
 *     tags:
 *       - Jobs
 *     responses:
 *       200:
 *         description: A list of jobs.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: successful
 *                 results:
 *                   type: integer
 *                   example: 3
 *                 jobs:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Job'
 */
router.get("", allJob);

/**
 * @swagger
 * /jobs/categories:
 *   get:
 *     summary: Retrieve job categories
 *     description: Fetch a list of all job categories.
 *     tags:
 *       - Jobs
 *     responses:
 *       200:
 *         description: A list of job categories.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: successful
 *                 categories:
 *                   type: array
 *                   items:
 *                     type: string
 */
router.get("/categories", getJobCategories);

/**
 * @swagger
 * /jobs/featured:
 *   get:
 *     summary: Retrieve featured jobs
 *     description: Fetch a list of featured jobs.
 *     tags:
 *       - Jobs
 *     responses:
 *       200:
 *         description: A list of featured jobs.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: successful
 *                 jobs:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Job'
 */
router.get("/featured", getFeaturedJobs);

/**
 * @swagger
 * /jobs/{id}:
 *   get:
 *     summary: Retrieve a single job
 *     description: Fetch a specific job by its ID.
 *     tags:
 *       - Jobs
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the job to retrieve.
 *         schema:
 *           type: string
 *           example: This is a sample response
 *     responses:
 *       200:
 *         description: A single job.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Job'
 *       404:
 *         description: Job not found.
 *       500:
 *         description: Server error.
 */
router.get("/:id", getJob);

/**
 * @swagger
 * /jobs/jobapplicants:
 *   get:
 *     summary: Retrieve job applicants
 *     description: Fetch a list of applicants for a specific job.
 *     tags:
 *       - Jobs
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of job applicants.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: successful
 *                 applicants:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: 1234567890
 *                       name:
 *                         type: string
 *                         example: John Doe
 */
router.get(
  "/jobapplicants",
  authenticateUser,
  restrictTo("employer"),
  getJobApplicants
);

/**
 * @swagger
 * /jobs:
 *   post:
 *     summary: Create a new job
 *     description: Add a new job to the database.
 *     tags:
 *       - Jobs
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Job'
 *     responses:
 *       201:
 *         description: Job created successfully.
 *       400:
 *         description: Invalid input.
 *       500:
 *         description: Server error.
 */
router.post("", authenticateUser, restrictTo("employer", "admin"), createJob);

router.get(
  "/count",
  authenticateUser,
  restrictTo("employer", "admin"),
  getJobCount
);
router.get(
  "/user-jobs",
  authenticateUser,
  restrictTo("employer", "admin"),
  getUserJobs
);
router.get(
  "/applications",
  authenticateUser,
  restrictTo("employer", "admin"),
  getJobApplications
);

/**
 * @swagger
 * /jobs/apply:
 *   post:
 *     summary: Apply for a job
 *     description: Apply for a specific job.
 *     tags:
 *       - Jobs
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               jobId:
 *                 type: string
 *                 example: 1234567890
 *               cv:
 *                 type: string
 *                 format: binary
 *               coverLetter:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Application submitted successfully.
 *       400:
 *         description: Invalid input.
 *       500:
 *         description: Server error.
 */
router.post(
  "/apply",
  authenticateUser,
  restrictTo("job_seekers"),
  upload.fields([
    { name: "cv", maxCount: 1 },
    { name: "coverLetter", maxCount: 1 },
  ]),
  applyForJob
);

/**
 * @swagger
 * /jobs/job:
 *   delete:
 *     summary: Delete a job
 *     description: Delete a specific job.
 *     tags:
 *       - Jobs
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the job to delete.
 *         schema:
 *           type: string
 *           example: 1234567890
 *     responses:
 *       200:
 *         description: Job deleted successfully.
 *       404:
 *         description: Job not found.
 *       500:
 *         description: Server error.
 */
router.delete(
  "/job",
  authenticateUser,
  restrictTo("employer", "admin"),
  deleteJob
);

export default router;
