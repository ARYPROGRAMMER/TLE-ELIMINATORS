import express from "express";
import cors from "cors";
import apiRouter from "./routes/api";
import { YouTubeService } from "./youtube/youtube.service";
import { DbService } from "./services/dbService";

// Hardcoded config
const PORT = 5000;

const app = express();

// Create instances
const youtubeService = new YouTubeService();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api", apiRouter);

// Error handling middleware
app.use(
  (
    err: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error("Server error:", err.stack);
    res.status(500).send({ error: "Something went wrong" });
  }
);

// Start the application
async function startServer() {
  try {
    // Connect to MongoDB
    await DbService.connect();
    
    // Start server
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      
      // Initial YouTube solution sync with delay to ensure DB is ready
      setTimeout(() => {
        console.log("Starting initial YouTube solution sync...");
        youtubeService.fetchSolutions()
          .then(() => console.log("Initial YouTube sync completed"))
          .catch(err => console.error("Initial YouTube sync error:", err));
      }, 5000);
    });
    
    // Schedule YouTube solution sync (every 6 hours)
    setInterval(() => {
      console.log("Running scheduled YouTube solution sync...");
      youtubeService
        .fetchSolutions()
        .then(() => console.log("Scheduled YouTube sync completed"))
        .catch(err => console.error("YouTube sync error:", err));
    }, 6 * 60 * 60 * 1000);
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();

export default app;
