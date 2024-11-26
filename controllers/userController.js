import User from "../models/UserModels.js";
import logger from "../config/logger.js";

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      status: "success",
      user,
    });
  } catch (err) {
    logger.error(err.message);
    res.status(500).json({ message: "Server error", error: err });
  }
};

export const updateMe = async (req, res) => {
  try {
    if (req.body.password || req.body.passwordConfirm) {
      return res.status(400).json({
        message: "This route is not for updating password. Use /updatePassword",
      });
    }

    const updatedMe = await User.findByIdAndUpdate(
      req.user.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    res.status(200).json({
      status: "success",
      data: { user: updatedMe },
    });
  } catch (err) {
    logger.error(err.message);
    res.status(500).json({ message: "Server error", error: err });
  }
};

export const deleteMe = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user.id);
    res.status(204).json({
      status: "success",
      message: "User deleted successfully",
      data: null,
    });
  } catch (err) {
    logger.error(err.message);
    res.status(500).json({ message: "Server error", error: err });
  }
};

// Admin
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({
      status: "success",
      results: users.length,
      data: { users },
    });
  } catch (err) {
    logger.error(err.message);
    res.status(500).json({ message: "Server error", error: err });
  }
};

// Admin:
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      status: "success",
      data: { user },
    });
  } catch (err) {
    logger.error(err.message);
    res.status(500).json({ message: "Server error", error: err });
  }
};

export const updateUserById = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      status: "success",
      data: { user: updatedUser },
    });
  } catch (err) {
    logger.error(err.message);
    res.status(500).json({ message: "Server error", error: err });
  }
};

export const deleteUserById = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      status: "success",
      message: "User has been deleted",
    });
  } catch (err) {
    logger.error(err.message);
    res.status(500).json({ message: "Server error", error: err });
  }
};
