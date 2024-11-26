import mongoose from "mongoose";
import validator from "validator";

const DocumentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  type: {
    type: String,
    enum: ["cv", "cover_letter", "certificate"],
    required: true,
  },
  fileUrl: {
    type: String,
    required: true,
    validate: {
      validator: (value) =>
        validator.isURL(value, {
          protocol: ["http", "https"],
          require_protocol: true,
        }) || value.startsWith("file://"),
      message: "Invalid file URL or local file",
    },
  },
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
});

const Document = mongoose.model("Document", DocumentSchema);
export default Document;
