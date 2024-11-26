import mongoose from "mongoose";
import bcrypt from "bcrypt";
import validator from "validator";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide a name"],
    minlength: [3, "Name must have a minimum length of 3 characters"],
  },
  email: {
    type: String,
    unique: true,
    required: [true, "Please provide an email"],
    lowercase: true,
    validate: {
      validator: function (value) {
        return validator.isEmail(value);
      },
      message: "A valid email address is required",
    },
  },
  username: {
    type: String,
    required: [true, "Please provide a username"],
    unique: true,
    minlength: [4, "Username must be at least 4 characters long"],
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    minlength: [8, "Password must be at least 8 characters long"],
    validate: {
      validator: function (value) {
        return validator.isStrongPassword(value, {
          minLength: 8,
          minLowercase: 1,
          minUppercase: 1,
          minNumbers: 1,
          minSymbols: 1,
        });
      },
      message:
        "Password must contain at least 8 characters, 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character",
    },
  },
  passwordConfirm: {
    type: String,
    required: [true, "Please confirm your password"],
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: "Passwords do not match",
    },
  },
  profilePicture: {
    type: String,
  },
  role: {
    type: String,
    enum: ["user", "admin", "employer"],
    default: "user",
  },
  savedJob: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "SavedJob",
  },
  notification: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Notification",
  },
  preference: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UserPreferences",
  },
  document: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Document",
  },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);

  this.passwordConfirm = undefined;
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.Tokenize = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: "90d",
  });
};

const User = mongoose.model("User", userSchema);
export default User;
