import mongoose from "mongoose";

const JobApplicationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Job",
    required: true,
  },
  coverLetter: {
    type: String,
  },
  resume: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Document",
  },
  status: {
    type: String,
    enum: ["applied", "reviewed", "interviewed", "accepted", "rejected"],
    default: "applied",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const JobApplication = mongoose.model("JobApplication", JobApplicationSchema);

export default JobApplication;
