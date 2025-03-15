import { google } from "googleapis";
import Contest from "../models/Contest";

export class YoutubeService {
  private youtube;

  constructor() {
    this.youtube = google.youtube({
      version: "v3",
      auth: process.env.YOUTUBE_API_KEY,
    });
  }

  async fetchSolutions() {
    const playlists = {
      LeetCode: process.env.LEETCODE_PLAYLIST_ID,
      Codeforces: process.env.CODEFORCES_PLAYLIST_ID,
      CodeChef: process.env.CODECHEF_PLAYLIST_ID,
    };

    for (const [platform, playlistId] of Object.entries(playlists)) {
      const response = await this.youtube.playlistItems.list({
        part: ["snippet"],
        playlistId: playlistId,
        maxResults: 50,
      });

      for (const item of response.data.items || []) {
        const title = item.snippet?.title || "";
        const description = item.snippet?.description || "";
        const videoId = item.snippet?.resourceId?.videoId;
        const publishedAt = item.snippet?.publishedAt;
        const contestId = this.extractContestId(title, platform);

        if (contestId) {
          await Contest.findOneAndUpdate(
            { id: contestId },
            {
              solutionUrl: `https://youtube.com/watch?v=${videoId}`,
              solutionDetails: {
                title,
                description,
                publishedAt,
                thumbnailUrl: item.snippet?.thumbnails?.default?.url,
              },
            }
          );
        }
      }
    }
  }

  private extractContestId(title: string, platform: string): string | null {
    const patterns = {
      Codeforces: /Codeforces Round (\d+)/i,
      CodeChef: /CodeChef ([\w]+)/i,
      LeetCode: /LeetCode Weekly Contest (\d+)/i,
    };

    const match = title.match(patterns[platform as keyof typeof patterns]);
    if (!match) return null;

    const idPrefix = {
      Codeforces: "cf_",
      CodeChef: "cc_",
      LeetCode: "lc_",
    };

    return `${
      idPrefix[platform as keyof typeof idPrefix]
    }${match[1].toLowerCase()}`;
  }
}
