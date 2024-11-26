import express from "express";
import {
  createSponsor,
  getSponsors,
} from "../controllers/sponsorsController.js";
import logoUpload from "../middlewares/logoUploadMiddleware.js";

const sponsorRouter = express.Router();

sponsorRouter
  .get("/sponsors", getSponsors)
  .post("/sponsors", logoUpload.single("logo"), createSponsor);

export default sponsorRouter;
