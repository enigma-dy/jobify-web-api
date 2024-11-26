import dotenv from "dotenv";

dotenv.config();

const config = {
  port: process.env.PORT || 3000,
  mongoURI: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET || "My_JWT_SECRET_12345",
  logLevel: process.env.NODE_ENV === "production" ? "error" : "info",
};

export default config;
