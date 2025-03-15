import mongoose, { Schema, Model } from "mongoose";
import { Contest } from "../types/contest";

interface ContestModel extends Model<Contest> {
  seedInitialContests(): Promise<void>;
}

const solutionDetailsSchema = new Schema({
  title: String,
  description: String,
  publishedAt: String,
  thumbnailUrl: String
}, { _id: false });

const contestSchema = new Schema<Contest, ContestModel>({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  platform: {
    type: String,
    required: true,
    enum: ["Codeforces", "CodeChef", "LeetCode"],
  },
  startTime: { type: Date, required: true },
  duration: { type: Number, required: true },
  url: { type: String, required: true },
  solutionUrl: { type: String },
  solutionDetails: solutionDetailsSchema,
  isBookmarked: { type: Boolean, default: false },
});

// Add proper typing for the static method
contestSchema.static('seedInitialContests', async function(this: ContestModel): Promise<void> {
  const count = await this.countDocuments();
  if (count === 0) {
    console.log("No contests found, seeding initial data...");
    
    const initialContests = [
      {
        id: "cf_1234",
        name: "Codeforces Round #1234",
        platform: "Codeforces",
        startTime: new Date(),
        duration: 2.5,
        url: "https://codeforces.com/contest/1234",
      },
      {
        id: "cc_starter99",
        name: "CodeChef Starters 99",
        platform: "CodeChef",
        startTime: new Date(Date.now() + 172800000), // 2 days from now
        duration: 3,
        url: "https://www.codechef.com/START99",
      },
      {
        id: "lc_weekly345",
        name: "LeetCode Weekly Contest 345",
        platform: "LeetCode",
        startTime: new Date(Date.now() - 86400000), // 1 day ago
        duration: 1.5,
        url: "https://leetcode.com/contest/weekly-contest-345",
      }
    ];
    
    await this.insertMany(initialContests);
    console.log("Initial contests seeded successfully");
  }
});

const ContestModel = mongoose.model<Contest, ContestModel>("Contest", contestSchema);

// Update error handling with proper types
ContestModel.seedInitialContests().catch((err: Error) => {
  console.error("Error seeding initial contests:", err);
});

export default ContestModel;
