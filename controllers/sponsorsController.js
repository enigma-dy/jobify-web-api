import SponsorsModel from "../models/SponsorsModel.js";
import logger from "../config/logger.js";

export const createSponsor = async (req, res, next) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({
        message: "Please input Sponsor Name",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        message: "Please upload Sponsor logo",
      });
    }

    const logo = req.file.path;

    const sponsorData = await SponsorsModel.create({
      name,
      logo,
    });

    res.status(201).json({
      status: "successful",
      sponsor: sponsorData,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
    logger.error(err.message);
    next(err);
  }
};

export const getSponsors = async (req, res, next) => {
  try {
    const sponsors = await SponsorsModel.find();

    if (!sponsors.length) {
      return res.status(404).json({ message: "No sponsors found" });
    }

    res.status(200).json({
      status: "successful",
      result: sponsors.length,
      sponsors: sponsors,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
    logger.error(err.message);
    next(err);
  }
};
