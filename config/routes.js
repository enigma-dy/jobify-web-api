import express from "express";
import jobRoutes from "../routes/jobRoutes.js";

const routes = express.Router();

routes.use("/api", jobRoutes);

export default routes;
