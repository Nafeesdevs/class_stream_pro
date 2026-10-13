// import app from "./app.js";
// import dotenv from "dotenv";
// import path from "node:path";
// import { fileURLToPath } from "node:url";

// const backendDir = path.dirname(fileURLToPath(import.meta.url));
// dotenv.config({ path: path.join(backendDir, "config", "config.env") });

// process.on("uncaughtException", (err) => {
//   console.log(`Error: ${err.message}`);
//   console.log("Server is shutting down due to uncaught Exception");
//   process.exit(1);
// });

// const [{ default: app }, { connectDB }] = await Promise.all([
//   import("./app.js"),
//   import("./config/db.js"),
// ]);

// let server;
// process.on("unhandledRejection", (err) => {
//   console.log(`Error: ${err.message}`);
//   console.log("Server is shutting down due to unhandled Rejection");
//   if (server) {
//     server.close(() => process.exit(1));
//   } else {
//     process.exit(1);
//   }
// });

// await connectDB();

// const PORT = Number(process.env.PORT) || 8000;
// server = app.listen(PORT, "0.0.0.0", () => {
//   console.log(`Backend server is running on http://localhost:${PORT}`);
// });

// export default server;



import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";

const backendDir = path.dirname(fileURLToPath(import.meta.url));

dotenv.config({
  path: path.join(backendDir, "config", "config.env"),
});

process.on("uncaughtException", (err) => {
  console.error(`Error: ${err.message}`);
  console.error("Server is shutting down due to uncaught exception");
  process.exit(1);
});

const [{ default: app }, { connectDB }] = await Promise.all([
  import("./app.js"),
  import("./config/db.js"),
]);

let server;

process.on("unhandledRejection", (err) => {
  console.error(`Error: ${err.message}`);
  console.error("Server is shutting down due to unhandled rejection");

  if (server) {
    server.close(() => process.exit(1));
  } else {
    process.exit(1);
  }
});

console.log(
  "DB_URL loaded:",
  Boolean(process.env.DB_URL),
  "Atlas URL:",
  process.env.DB_URL?.includes("mongodb.net")
);

await connectDB();

const PORT = Number(process.env.PORT) || 8000;

server = app.listen(PORT, "0.0.0.0", () => {
  console.log(`Backend server is running on http://localhost:${PORT}`);
});

export default server;
