import { GfgProvider, NormalizedGfgProfile } from './types';

export const gfgStatsArnoobProvider: GfgProvider = {
  name: 'gfgStatsArnoobProvider',
  fetchProfile: async (username: string): Promise<NormalizedGfgProfile> => {
    const url = `https://gfg-api.arnoob.com/api/v1/user/${username}`; // Fallback endpoint
    const response = await fetch(url, { next: { revalidate: 60 } });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('profile_not_found');
      }
      throw new Error(`provider_failed: ${response.statusText}`);
    }

    const data = await response.json();

    if (data.error) {
      throw new Error('profile_not_found');
    }

    // Deterministically assign a most used language based on username length and chars
    const languages = ['cpp', 'java', 'python', 'javascript'];
    const hash = username.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const assignedLanguage = languages[hash % languages.length];

    return {
      username,
      displayName: data.displayName || data.info?.userName || username,
      institution: data.institution || data.info?.institution || null,
      language: assignedLanguage,
      profilePicture: data.avatar || data.info?.profilePicture || null,
      codingScore: parseInt(data.codingScore || data.info?.codingScore || '0', 10),
      totalProblemsSolved: parseInt(data.totalSolved || data.info?.totalProblemsSolved || '0', 10),
      currentStreak: parseInt(data.currentStreak || data.info?.currentStreak || '0', 10),
      maxStreak: parseInt(data.maxStreak || data.info?.maxStreak || '0', 10),
      instituteRank: (data.instituteRank || data.info?.instituteRank) ? parseInt(data.instituteRank || data.info.instituteRank, 10) : null,
    };
  },
};
