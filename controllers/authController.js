import User from "../models/UserModels.js";
import jwt from "jsonwebtoken";
import logger from "../config/logger.js";

export const registerUser = async (req, res) => {
  try {
    const { name, email, username, password, passwordConfirm } = req.body;

    if (!name || !email || !username || !password || !passwordConfirm) {
      return res
        .status(400)
        .json({ message: "Please fill all required fields" });
    }

    if (password !== passwordConfirm) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const newUser = await User.create({
      name,
      email,
      username,
      password,
      passwordConfirm,
    });

    const token = newUser.Tokenize();

    res.status(201).json({
      token,
      message: "User registered successfully",
    });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  } finally {
    setLoading(false);
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Please fill all required fields",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const isCorrectPassword = await user.correctPassword(
      password,
      user.password
    );

    if (!isCorrectPassword) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const token = user.Tokenize();

    res.status(200).json({
      status: "sucessfull",
      message: "User logged in successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profilePicture: user.profilePicture,
      },
      token,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Server error",
    });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, passwordConfirm } = req.body;
    const userId = req.user.id;

    if (!currentPassword || !newPassword || !passwordConfirm) {
      return res
        .status(400)
        .json({ message: "Please fill all required fields" });
    }

    if (newPassword !== passwordConfirm) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await user.correctPassword(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect current password" });
    }

    user.password = newPassword;

    await user.save({ validateModifiedOnly: true });

    res.status(200).json({ message: "Password updated successfully" });
  } catch (err) {
    logger.error(err);
    res.status(500).json({ message: "Server error", error: err });
  }
};

export const authenticateUser = async (req, res, next) => {
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ message: "You are not logged in" });
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const currentUser = await User.findById(decodedToken.id);

    if (!currentUser) {
      return res
        .status(401)
        .json({ message: "User belonging to this token no longer exists" });
    }

    req.user = currentUser;
    console.log("Authenticated User:", req.user); // Debugging log

    next();
  } catch (err) {
    logger.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const logoutUser = (req, res) => {
  res.status(200).json({ message: "Logged out successfully" });
};
