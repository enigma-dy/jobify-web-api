import express from "express";
import { uploadDocument } from "../controllers/documentController.js";
import upload from "../middlewares/uploadMiddleware.js";

const router = express.Router();

router.post("/documents/upload", upload.single("document"), uploadDocument);

export default router;
