import Job from "./../models/JobModels.js";
import JobApplication from "../models/JobApplicationSchema.js";
import logger from "../config/logger.js";
import QueryBuilder from "../util/queryBuilder.js";
import User from "../models/UserModels.js";

const ERROR_CODES = {
  INVALID_REQUEST: 400,
  NOT_FOUND: 404,
  SERVER_ERROR: 500,
  DATABASE_ERROR: 503,
  VALIDATION_ERROR: 422,
};

export const allJob = async (req, res, next) => {
  try {
    const queryBuilder = new QueryBuilder(req);
    const { query, options } = queryBuilder.build();

    const jobs = await Job.find(query, options.select)
      .sort(options.sort)
      .limit(options.limit)
      .skip(options.skip);

    if (!jobs || jobs.length === 0) {
      return res.status(404).json({ message: "No Job Found" });
    }

    res.status(200).json({
      status: "successful",
      results: jobs.length,
      jobs,
    });
  } catch (err) {
    logger.error(err);
    res.status(500).json({ message: "Server error" });
    next(err);
  }
};

export const getJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(ERROR_CODES.NOT_FOUND).json({
        message: "job not found",
      });
    }
    res.status(200).json({
      status: "sucessful",
      data: job,
    });
  } catch (err) {
    logger.error(err);
    res.status(ERROR_CODES.SERVER_ERROR).json({ message: "sever error" });
    next(err);
  }
};

export const createJob = async (req, res, next) => {
  try {
    const { title, description, company, salary, jobType, requirement } =
      req.body;

    if (
      !title ||
      !description ||
      !company ||
      !salary ||
      !jobType ||
      !requirement
    ) {
      return res.status(400).json({
        message: "Please fill all required fields",
      });
    }

    const job = await Job.create({
      title,
      description,
      company,
      salary,
      jobType,
      requirement,
      createdBy: req.user._id,
    });

    res.status(201).json({
      status: "successful",
      data: job,
    });
  } catch (err) {
    res.status(500).json({
      message: "Server error",
    });
    next(err);
  }
};

export const updateJob = async (req, res, next) => {
  try {
    const job = await Job.findByIdAndUpdate(req.params.id, req.body);
    if (!job) {
      return res.status(ERROR_CODES.NOT_FOUND).json({
        message: "job not found",
      });
    }
    res.status(200).json({
      status: "sucessful",
      data: job,
    });
  } catch (err) {
    logger.error(err);
    res.status(ERROR_CODES.SERVER_ERROR).json({ message: "sever error" });
    next(err);
  }
};

export const deleteJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res
        .status(ERROR_CODES.NOT_FOUND)
        .json({ message: "Job not found" });
    }
    if (job.createdBy.toString() !== req.user.id && req.user.role !== "admin") {
      return res
        .status(ERROR_CODES.UNAUTHORIZED)
        .json({ message: "You do not have permission to delete this job" });
    }

    const deletedJob = await Job.findByIdAndDelete(req.params.id);

    res.status(200).json({
      status: "sucessful",
      data: deletedJob,
    });
  } catch (err) {
    logger.error(err);
    res.status(ERROR_CODES.SERVER_ERROR).json({ message: "sever error" });
    next(err);
  }
};

export const applyForJob = async (req, res, next) => {
  try {
    const uploadedDocuments = req.files;
    if (!uploadedDocuments || !uploadedDocuments.cv) {
      res.status(400).json({
        message: "please upload resume",
      });
    }

    let documents = {};
    const resumeDocument = await Document.create({
      user: req.user.id,
      type: cv,
      fileUrl: uploadedDocuments.cv[0].path,
    });
    documents.cv = resumeDocument._id;

    if (uploadedDocuments.cover_letter) {
      const coverLetterDocument = await Document.create({
        user: req.user.id,
        type: "cover_letter",
        fileUrl: uploadedDocuments.cover_letter[0].path,
      });
      documents.cover_letter = coverLetterDocument._id;
    }

    const job = await JobApplication.create({
      user: req.user.id,
      job: req.body.job,
      coverLetter: req.body.coverLetter || "",
      resume: documents.cv,
      additionalDocuments: documents.cover_letter || null,
    });
    if (!job) {
      return res.status(ERROR_CODES.NOT_FOUND).json({
        message: "job not found",
      });
    }
    res.status(200).json({
      status: "successful",
      message: "Job application Successful",
      data: job,
    });
  } catch (err) {
    logger.error(err);
    res.status(500).json({ message: "sever error" });
    next(err);
  }
};

export const getJobCategories = async (req, res, next) => {
  try {
    const categories = await Job.aggregate([
      {
        $group: {
          _id: "$category",
          totalJob: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    return res.status(200).json({
      status: "successful",
      result: categories.length,
      categories,
    });
  } catch (err) {
    return res.status(500).json({
      status: "fail",
      message: err.message,
    });
    next(err);
  }
};

export const getFeaturedJobs = async (req, res, next) => {
  try {
    const featured = await Job.find({ featured: true });

    res.status(200).json({
      status: "successful",
      result: featured.length,
      featured,
    });
  } catch (err) {
    res.status(404).json({
      messaga: "server error",
      error: err.message,
    });
    next(err);
  }
};

export const getJobApplicants = async (req, res, next) => {
  try {
    const job = await JobApplication.find({ createdBy: req.body.id });
    if (job.length === 0) {
      return res
        .status(ERROR_CODES.NOT_FOUND)
        .json({ message: "No job found" });
    }

    const jobIds = job.map((job) => job._id);
    const applications = await JobApplication.find({ job: { $in: jobIds } })
      .populate("user")
      .populate("job");

    res.status(200).json({
      status: "successful",
      result: applications.length,
      applications: { applications },
    });
  } catch (err) {
    logger.error(err);
    res.status(ERROR_CODES.SERVER_ERROR).json({ message: "sever error" });
    next(err);
  }
};

export const getAdminStats = async (req, res, next) => {
  try {
    const jobSeekers = await User.find({ role: "job_seeker" }).populate({
      path: "applications",
      populate: { path: "job" },
    });

    const employers = await User.find({ role: "employer" }).populate({
      path: "jobs",
      model: "Job",
    });

    const jobSeekerStats = jobSeekers.map((seeker) => ({
      user: seeker,
      applications: seeker.applications.length,
    }));

    const employerStats = employers.map((employer) => ({
      user: employer,
      jobsPosted: employer.jobs.length,
    }));

    const allUsers = await User.find();

    res.status(200).json({
      status: "success",
      stats: {
        totalUsers: allUsers.length,
        jobSeekers: jobSeekers.length,
        employers: employers.length,
        jobSeekerStats,
        employerStats,
      },
    });
  } catch (err) {
    logger.error("error", err);
    res.status(ERROR_CODES.SERVER_ERROR).json({ message: "sever error" });
    next(err);
  }
};
