import path from "path";
import { config } from "dotenv";

config();

const appPath = path.resolve(__dirname, "../app");

export default appPath;
