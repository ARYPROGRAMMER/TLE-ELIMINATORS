import { Document } from 'mongoose';

export interface Contest extends Document {
  id: string;
  name: string;
  platform: "Codeforces" | "CodeChef" | "LeetCode";
  startTime: Date;
  duration: number;
  url: string;
  solutionUrl?: string;
  isBookmarked?: boolean;
  solutionDetails?: {
    title: string;
    description: string;
    publishedAt: string | null;
    thumbnailUrl: string | null;
  };
}

export interface ContestFilter {
  platforms: string[];
  status: "upcoming" | "past" | "all";
}
