import mongoose from "mongoose";
import validator from "validator";

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Job title is required"],
      trim: true,
      minlength: [5, "Job title must be at least 5 characters long"],
    },
    description: {
      type: String,
      required: [true, "Job description is required"],
    },
    category: {
      type: String,
    },
    company: {
      name: {
        type: String,
        required: [true, "Company name is required"],
        trim: true,
      },

      location: {
        type: String,
        required: [true, "Location is required"],
        trim: true,
      },
      website: {
        type: String,
        validate: {
          validator: (v) => validator.isURL(v, { require_tld: true }),
          message: "Please input a valid URL",
        },
        required: [true, "Company website is required"],
      },
    },
    salary: {
      type: Number,
      required: [true, "Salary is required"],
      min: [0, "Salary must be a positive number"],
    },
    jobType: {
      type: String,
      enum: ["Full-time", "Part-time", "Contract", "Internship", "Temporary"],
      required: [true, "Job Type is required"],
    },
    featured: {
      type: Boolean,
      default: false,
      validate: {
        validator: function (v) {
          return !v || (this.createdBy && this.createdBy.premiumServices);
        },
        message: "Only premium employers can feature jobs",
      },
    },
    remote: {
      type: Boolean,
      default: false,
    },
    requirement: {
      type: [String],
      required: [true, "Job requirement is required"],
    },
    benefits: {
      type: [String],
      default: [],
    },
    applicationDeadline: {
      type: Date,
    },
    datePosted: {
      type: Date,
      default: Date.now,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const Job = mongoose.model("Job", jobSchema);

export default Job;
