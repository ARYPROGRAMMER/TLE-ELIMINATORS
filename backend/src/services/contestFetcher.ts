import axios from "axios";
import { Contest } from "../types/contest";
import ContestModel from "../models/Contest";

export class ContestFetcherService {
  async fetchCodeforces(): Promise<Contest[]> {
    const response = await axios.get("https://codeforces.com/api/contest.list");
    return response.data.result.map((contest: any) => ({
      id: `cf_${contest.id}`,
      name: contest.name,
      platform: "Codeforces",
      startTime: new Date(contest.startTimeSeconds * 1000),
      duration: contest.durationSeconds / 3600,
      url: `https://codeforces.com/contest/${contest.id}`,
    }));
  }

  async fetchCodechef(): Promise<Contest[]> {
    const response = await axios.get(
      "https://www.codechef.com/api/list/contests/all"
    );
    return response.data.future_contests.map((contest: any) => ({
      id: `cc_${contest.contest_code}`,
      name: contest.contest_name,
      platform: "CodeChef",
      startTime: new Date(contest.contest_start_date),
      duration: contest.contest_duration / 3600,
      url: `https://www.codechef.com/${contest.contest_code}`,
    }));
  }

  async fetchLeetcode(): Promise<Contest[]> {
    const response = await axios.post("https://leetcode.com/graphql", {
      query: `{
        allContests {
          title
          titleSlug
          startTime
          duration
        }
      }`,
    });

    return response.data.data.allContests.map((contest: any) => ({
      id: `lc_${contest.titleSlug}`,
      name: contest.title,
      platform: "LeetCode",
      startTime: new Date(contest.startTime * 1000),
      duration: contest.duration / 3600,
      url: `https://leetcode.com/contest/${contest.titleSlug}`,
    }));
  }

  async fetchAllContests(): Promise<Contest[]> {
    try {
      console.log("Fetching all contests from APIs");
      
      const [codeforces, codechef, leetcode] = await Promise.all([
        this.fetchCodeforces(),
        this.fetchCodechef(),
        this.fetchLeetcode(),
      ]);
      
      const allContests = [...codeforces, ...codechef, ...leetcode];
      
      // Save or update contests in the database
      await this.saveContestsToDb(allContests);
      
      // Fetch contests from database to include bookmarks and solutions
      return this.getContestsFromDb();
    } catch (error) {
      console.error("Error fetching all contests:", error);
      // Fallback to database if API calls fail
      return this.getContestsFromDb();
    }
  }

  private async saveContestsToDb(contests: Contest[]): Promise<void> {
    try {
      console.log(`Saving ${contests.length} contests to database`);
      
      const operations = contests.map(contest => ({
        updateOne: {
          filter: { id: contest.id },
          update: { $set: contest },
          upsert: true
        }
      }));
      
      if (operations.length > 0) {
        await ContestModel.bulkWrite(operations);
        console.log("Successfully saved contests to database");
      }
    } catch (error) {
      console.error("Error saving contests to database:", error);
    }
  }

  private async getContestsFromDb(): Promise<Contest[]> {
    try {
      console.log("Fetching contests from database");
      return await ContestModel.find().lean();
    } catch (error) {
      console.error("Error fetching contests from database:", error);
      return [];
    }
  }
}
