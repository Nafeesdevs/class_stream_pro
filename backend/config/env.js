import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "config.env") });
dotenv.config({ path: path.resolve(__dirname, "../.env") });

export const UPLOAD_DIR = path.resolve(__dirname, "../upload");