import axios from "axios";
import { Contest } from "../../../shared/types/contest";

// Create axios instance with proper baseURL configuration
const api = axios.create({
  baseURL: import.meta.env.DEV ? "http://localhost:5000/api" : "/api",
  timeout: 10000,
});

// Sample fallback data for development
const mockContests: Contest[] = [
  {
    id: "cf_1234",
    name: "Codeforces Round #789",
    platform: "Codeforces",
    startTime: new Date(Date.now() + 86400000), // Tomorrow
    duration: 2.5,
    url: "https://codeforces.com/contest/1234",
    isBookmarked: false
  },
  {
    id: "cc_starter99",
    name: "CodeChef Starters 99",
    platform: "CodeChef",
    startTime: new Date(Date.now() + 172800000), // Day after tomorrow
    duration: 3,
    url: "https://www.codechef.com/START99",
    isBookmarked: true
  },
  {
    id: "lc_weekly345",
    name: "LeetCode Weekly Contest 345",
    platform: "LeetCode",
    startTime: new Date(Date.now() - 86400000), // Yesterday
    duration: 1.5,
    url: "https://leetcode.com/contest/weekly-contest-345",
    isBookmarked: false,
    solutionUrl: "https://youtube.com/watch?v=example",
    solutionDetails: {
      title: "LeetCode Weekly Contest 345 Solutions",
      description: "Solutions to all problems from LeetCode Weekly Contest 345",
      publishedAt: new Date().toISOString(),
      thumbnailUrl: "https://i.ytimg.com/vi/example/default.jpg"
    }
  }
];

export const fetchContests = async (): Promise<Contest[]> => {
  try {
    const response = await api.get("/contests");
    return response.data;
  } catch (error) {
    console.warn("Failed to fetch contests from API, using mock data:", error);
    // Return mock data when the API fails
    return mockContests;
  }
};

export const bookmarkContest = async (id: string): Promise<boolean> => {
  try {
    const response = await api.post(`/contests/${id}/bookmark`);
    if (response.data.success) {
      return response.data.isBookmarked;
    }
    throw new Error('Bookmark update failed');
  } catch (error) {
    console.error("Failed to bookmark contest:", error);
    throw error; // Re-throw to handle in the UI
  }
};
