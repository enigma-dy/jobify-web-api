import mongoose from "mongoose";
import dotenv from "dotenv";
import logger from "./logger.js";

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    logger.info("Database Connection Succesfull");
  } catch (err) {
    logger.error("Database Connection Error", err);
    console.error(err.message);
    process.exit(1);
  }
};

export default connectDB;
