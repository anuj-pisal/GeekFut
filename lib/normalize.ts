import { NormalizedGfgProfile } from './providers/types';

export function normalizeProfile(profile: NormalizedGfgProfile): NormalizedGfgProfile {
  return {
    ...profile,
    codingScore: isNaN(profile.codingScore) ? 0 : profile.codingScore,
    totalProblemsSolved: isNaN(profile.totalProblemsSolved) ? 0 : profile.totalProblemsSolved,
    currentStreak: isNaN(profile.currentStreak) ? 0 : Math.min(profile.currentStreak, isNaN(profile.maxStreak) ? 0 : profile.maxStreak),
    maxStreak: isNaN(profile.maxStreak) ? 0 : profile.maxStreak,
  };
}
