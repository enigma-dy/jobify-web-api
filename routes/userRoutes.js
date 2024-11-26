import express from "express";
import {
  getMe,
  updateMe,
  deleteMe,
  getAllUsers,
  getUserById,
  updateUserById,
  deleteUserById,
} from "../controllers/userController.js";

import {
  registerUser,
  loginUser,
  logoutUser,
  authenticateUser,
  changePassword,
} from "../controllers/authController.js";

import { restrictTo } from "../middlewares/authMiddleware.js";
import upload from "../middlewares/uploadMiddlerware.js";

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.post("/logout", logoutUser);

userRouter.use(authenticateUser);

userRouter.get("/me", getMe);
userRouter.patch("/me/updateProfile", updateMe);
userRouter.patch("/me/changePassword", changePassword);
userRouter.delete("/me/deleteAccount", deleteMe);
userRouter.post(
  "/me/uploadProfilePicture",
  upload.single("profilePicture"),
  updateMe
);

userRouter.use(restrictTo("admin"));

userRouter.get("/", getAllUsers);
userRouter
  .route("/:id")
  .get(getUserById)
  .patch(updateUserById)
  .delete(deleteUserById);

export default userRouter;
