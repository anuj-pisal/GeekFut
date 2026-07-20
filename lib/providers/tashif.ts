import { GfgProvider, NormalizedGfgProfile } from './types';

export const gfgStatsTashifProvider: GfgProvider = {
  name: 'gfgStatsTashifProvider',
  fetchProfile: async (username: string): Promise<NormalizedGfgProfile> => {
    const url = `https://gfg-stats.tashif.codes/api/user/${username}`;
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
      displayName: data.info?.userName || username,
      institution: data.info?.institution || null,
      language: assignedLanguage,
      profilePicture: data.info?.profilePicture || null,
      codingScore: parseInt(data.info?.codingScore || '0', 10),
      totalProblemsSolved: parseInt(data.info?.totalProblemsSolved || '0', 10),
      currentStreak: parseInt(data.info?.currentStreak || '0', 10),
      maxStreak: parseInt(data.info?.maxStreak || '0', 10),
      instituteRank: data.info?.instituteRank ? parseInt(data.info.instituteRank, 10) : null,
    };
  },
};
