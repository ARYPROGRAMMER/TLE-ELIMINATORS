import Contest from '../models/Contest';

export class MockSolutionsService {
  async createMockSolutions(): Promise<void> {
    console.log('Creating mock solutions for testing...');
    
    const mockSolutions = [
      {
        contestId: 'cf_1234',
        videoId: 'jJxKXyZNvO0', // Real TLE video
        title: 'Codeforces Round #1234 Solutions by TLE Eliminators',
        description: 'Step-by-step walkthrough of all problems',
        publishedAt: new Date().toISOString(),
        thumbnailUrl: 'https://img.youtube.com/vi/jJxKXyZNvO0/maxresdefault.jpg'
      },
      {
        contestId: 'lc_weekly345',
        videoId: 'dQw4w9WgXcQ',
        title: 'LeetCode Weekly Contest 345 - Full Solutions Explained',
        description: 'Complete analysis and solutions for all problems in LeetCode Weekly Contest 345',
        publishedAt: new Date().toISOString(),
        thumbnailUrl: 'https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg'
      },
      {
        contestId: 'cc_starter99',
        videoId: 'dQw4w9WgXcQ',
        title: 'CodeChef Starters 99 - Problem Solutions',
        description: 'Solutions for all problems in CodeChef Starters 99 with time complexity analysis',
        publishedAt: new Date().toISOString(),
        thumbnailUrl: 'https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg'
      }
    ];
    
    for (const solution of mockSolutions) {
      try {
        await Contest.findOneAndUpdate(
          { id: solution.contestId },
          {
            solutionUrl: `https://youtube.com/watch?v=${solution.videoId}`,
            solutionDetails: {
              title: solution.title,
              description: solution.description,
              publishedAt: solution.publishedAt,
              thumbnailUrl: solution.thumbnailUrl,
            }
          },
          { upsert: true }
        );
      } catch (error) {
        console.error(`Error creating mock solution for ${solution.contestId}:`, error);
      }
    }
    
    console.log('Mock solutions created successfully');
  }
}
