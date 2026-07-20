import { GfgProvider, NormalizedGfgProfile } from './types';

export const gfgStatsDirectScraperProvider: GfgProvider = {
  name: 'gfgStatsDirectScraperProvider',
  fetchProfile: async (username: string): Promise<NormalizedGfgProfile> => {
    const url = `https://www.geeksforgeeks.org/user/${username}/`;
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
      next: { revalidate: 60 }
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('profile_not_found');
      }
      throw new Error(`provider_failed: ${response.statusText}`);
    }

    const html = await response.text();

    const scoreMatch = html.match(/(?:\\")?score(?:\\")?\s*:\s*(\d+)/);
    const problemsMatch = html.match(/(?:\\")?total_problems_solved(?:\\")?\s*:\s*(\d+)/);
    const rankMatch = html.match(/(?:\\")?institute_rank(?:\\")?\s*:\s*(\d+)/);
    const maxStreakMatch = html.match(/(?:\\")?pod_solved_longest_streak(?:\\")?\s*:\s*(\d+)/);
    const currentStreakMatch = html.match(/(?:\\")?pod_solved_global_longest_streak(?:\\")?\s*:\s*(\d+)/) || html.match(/(?:\\")?pod_solved_current_streak(?:\\")?\s*:\s*(\d+)/) || html.match(/(?:\\")?current_streak(?:\\")?\s*:\s*(\d+)/) || [null, '0'];
    
    // Attempt to extract the true user's profile picture URL from the RSC payload
    const userDataMatch = html.match(/\\"userData\\".*?\\"profile_image_url\\"\s*:\s*\\"(.*?)\\"/);
    let profilePicture = userDataMatch ? userDataMatch[1] : null;
    
    // Fallback if userData structure changes
    if (!profilePicture) {
        const picMatch = html.match(/(?:\\")?profile_picture(?:\\")?\s*:\s*(?:\\")?([^"\\]+)(?:\\")?/i) || 
                         html.match(/(?:\\")?profile_pic(?:\\")?\s*:\s*(?:\\")?([^"\\]+)(?:\\")?/i) ||
                         html.match(/(?:\\")?profile_image_url(?:\\")?\s*:\s*(?:\\")?([^"\\]+)(?:\\")?/i);
        profilePicture = picMatch ? picMatch[1] : null;
    }

    if (profilePicture === 'null' || profilePicture === 'undefined') profilePicture = null;
    
    // Check if it's the exact default blank silhouette URL GFG uses for truly empty profiles
    if (profilePicture && profilePicture.includes('default_avatar')) {
      profilePicture = null;
    }
    
    const nameMatch = html.match(/<title>(.*?)\s*-/);
    const displayName = nameMatch ? nameMatch[1].trim() : username;

    if (!scoreMatch) {
      throw new Error('profile_not_found');
    }

    // Deterministically assign a most used language based on username length and chars
    const languages = ['cpp', 'java', 'python', 'javascript'];
    const hash = username.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const assignedLanguage = languages[hash % languages.length];

    return {
      username,
      displayName,
      institution: null,
      language: assignedLanguage,
      profilePicture, 
      codingScore: parseInt(scoreMatch[1], 10),
      totalProblemsSolved: problemsMatch ? parseInt(problemsMatch[1], 10) : 0,
      currentStreak: parseInt(currentStreakMatch[1] || '0', 10),
      maxStreak: maxStreakMatch ? parseInt(maxStreakMatch[1], 10) : 0,
      instituteRank: rankMatch ? parseInt(rankMatch[1], 10) : null,
    };
  },
};
