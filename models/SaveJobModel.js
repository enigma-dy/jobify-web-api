import mongoose, { mongo } from "mongoose";

const SavedJobSchema = new mongoose.Schema({
  user: {
    type: String,
    ref: "User",
    required: true,
  },
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Job",
    required: true,
  },
  savedAt: {
    type: Date,
    default: Date.now,
  },
});

const SavedJob = mongoose.model("SavedJob", SavedJobSchema);
export default SavedJob;
