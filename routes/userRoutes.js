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

/**
 * @swagger
 * /register:
 *   post:
 *     summary: Register a new user
 *     description: Create a new user account
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - username
 *               - password
 *               - passwordConfirm
 *             properties:
 *               name:
 *                 type: string
 *                 description: User name
 *               email:
 *                 type: string
 *                 description: User email
 *               username:
 *                 type: string
 *                 description: User username
 *               password:
 *                 type: string
 *                 description: User password
 *               passwordConfirm:
 *                 type: string
 *                 description: Confirm password
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Invalid request
 */
userRouter.post("/register", registerUser);

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Login to an existing account
 *     description: Authenticate a user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 description: User email
 *               password:
 *                 type: string
 *                 description: User password
 *     responses:
 *       200:
 *         description: User logged in successfully
 *       401:
 *         description: Invalid credentials
 */
userRouter.post("/login", loginUser);

/**
 * @swagger
 * /logout:
 *   post:
 *     summary: Logout from the current session
 *     description: Invalidate the current user session
 *     responses:
 *       200:
 *         description: User logged out successfully
 */
userRouter.post("/logout", logoutUser);

userRouter.use(authenticateUser);

/**
 * @swagger
 * /me:
 *   get:
 *     summary: Get the current user's profile
 *     description: Retrieve the authenticated user's profile information
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 */
userRouter.get("/me", getMe);

/**
 * @swagger
 * /me/update:
 *   patch:
 *     summary: Update the current user's profile
 *     description: Update the authenticated user's profile information
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: User name
 *               email:
 *                 type: string
 *                 description: User email
 *               username:
 *                 type: string
 *                 description: User username
 *     responses:
 *       200:
 *         description: User profile updated successfully
 */
userRouter.patch("/me/update", updateMe);

/**
 * @swagger
 * /me/changePassword:
 *   patch:
 *     summary: Change the current user's password
 *     description: Update the authenticated user's password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - currentPassword
 *               - newPassword
 *               - confirmNewPassword
 *             properties:
 *               currentPassword:
 *                 type: string
 *                 description: Current password
 *               newPassword:
 *                 type: string
 *                 description: New password
 *               confirmNewPassword:
 *                 type: string
 *                 description: Confirm new password
 *     responses:
 *       200:
 *         description: Password changed successfully
 */
userRouter.patch("/me/changePassword", changePassword);

/**
 * @swagger
 * /me/deleteAccount:
 *   delete:
 *     summary: Delete the current user's account
 *     description: Delete the authenticated user's account
 *     responses:
 *       204:
 *         description: Account deleted successfully
 */
userRouter.delete("/me/deleteAccount", deleteMe);

/**
 * @swagger
 * /me/uploadProfilePicture:
 *   post:
 *     summary: Upload a profile picture
 *     description: Upload a profile picture for the authenticated user
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: formData
 *         name: profilePicture
 *         type: file
 *         description: Profile picture
 *     responses:
 *       200:
 *         description: Profile picture uploaded successfully
 */
userRouter.post(
  "/me/uploadProfilePicture",
  upload.single("profilePicture"),
  updateMe
);

userRouter.use(restrictTo("admin"));

/**
 * @swagger
 * /:
 *   get:
 *     summary: Get all users
 *     description: Retrieve a list of all users
 *     responses:
 *       200:
 *         description: Users retrieved successfully
 */
userRouter.get("/", getAllUsers);

/**
 * @swagger
 * /{id}:
 *   get:
 *     summary: Get a user by ID
 *     description: Retrieve a user by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User retrieved successfully
 */
userRouter.get("/:id", getUserById);

/**
 * @swagger
 * /{id}:
 *   patch:
 *     summary: Update a user by ID
 *     description: Update a user by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         type: string
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: User name
 *               email:
 *                 type: string
 *                 description: User email
 *               username:
 *                 type: string
 *                 description: User username
 *     responses:
 *       200:
 *         description: User updated successfully
 */
userRouter.patch("/:id", updateUserById);

/**
 * @swagger
 * /{id}:
 *   delete:
 *     summary: Delete a user by ID
 *     description: Delete a user by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         type: string
 *         description: User ID
 *     responses:
 *       204:
 *         description: User deleted successfully
 */
userRouter.delete("/:id", deleteUserById);

export default userRouter;
