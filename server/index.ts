import express from "express";
import cors from "cors";
import { createRoutes } from "./routes";
import { MemStorage } from "./storage";
import { setupStaticFiles } from "./static";

const app = express();
//const port = process.env.PORT || "3000";
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Initialize storage
const storage = new MemStorage();

// API Routes
app.use(createRoutes(storage));

// Health check
app.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Setup static file serving for production
setupStaticFiles(app);

app.listen(port, "0.0.0.0", () => {
  console.log(`Personal CMS running on port ${port}`);
  console.log(`Visit http://localhost:${port} to access your CMS`);
});