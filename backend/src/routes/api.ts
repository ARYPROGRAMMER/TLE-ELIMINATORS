import express from "express";
import { ContestFetcherService } from "../services/contestFetcher";
import { YouTubeService } from "../youtube/youtube.service";
import { MockSolutionsService } from "../services/mockSolutionsService";
import Contest from "../models/Contest";

const router = express.Router();
const contestFetcher = new ContestFetcherService();
const youtubeService = new YouTubeService();
const mockSolutionsService = new MockSolutionsService();

router.get("/contests", async (req, res) => {
  try {
    const contests = await contestFetcher.fetchAllContests();
    res.json(contests);
  } catch (error) {
    console.error("Error fetching contests:", error);
    res.status(500).json({ error: "Failed to fetch contests" });
  }
});

router.post("/contests/:id/bookmark", async (req, res) => {
  try {
    const contestId = req.params.id;
    const contest = await Contest.findOne({ id: contestId });
    
    if (!contest) {
      return res.status(404).json({ error: "Contest not found" });
    }

    contest.isBookmarked = !contest.isBookmarked;
    await contest.save();
    
    res.json({ 
      success: true,
      isBookmarked: contest.isBookmarked,
      contestId: contest.id
    });
  } catch (error) {
    console.error("Error bookmarking contest:", error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    res.status(500).json({ 
      error: "Failed to bookmark contest",
      details: errorMessage 
    });
  }
});

router.post("/sync-solutions", async (req, res) => {
  try {
    try {
      await youtubeService.fetchSolutions();
    } catch (error) {
      console.error("YouTube API error, using mock solutions instead:", error);
      await mockSolutionsService.createMockSolutions();
    }
    res.json({ success: true });
  } catch (error) {
    console.error("Error syncing solutions:", error);
    res.status(500).json({ error: "Failed to sync solutions" });
  }
});

// New endpoint to create mock solutions for testing
router.post("/create-mock-solutions", async (req, res) => {
  try {
    await mockSolutionsService.createMockSolutions();
    res.json({ success: true, message: "Mock solutions created" });
  } catch (error) {
    console.error("Error creating mock solutions:", error);
    res.status(500).json({ error: "Failed to create mock solutions" });
  }
});

export default router;
