import mongoose from "mongoose";

const UserPreferencesSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  jobAlerts: {
    email: {
      type: Boolean,
      default: true,
    },
    sms: {
      type: Boolean,
      default: false,
    },
    frequency: {
      type: String,
      enum: ["daily", "weekly", "monthly"],
      default: "weekly",
    },
  },
  preferredJobTypes: {
    type: [String],
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Export the model
const UserPreferences = mongoose.model(
  "UserPreferences",
  UserPreferencesSchema
);
export default UserPreferences;
