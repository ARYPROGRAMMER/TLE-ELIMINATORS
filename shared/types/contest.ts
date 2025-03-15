export interface Contest {
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
    publishedAt: string;
    thumbnailUrl: string;
  };
}

export interface ContestFilter {
  platforms: string[];
  status: "upcoming" | "past" | "all";
}
