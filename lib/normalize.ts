import { NormalizedGfgProfile } from './providers/types';

export function normalizeProfile(profile: NormalizedGfgProfile): NormalizedGfgProfile {
  const safeDisplayName = profile.displayName 
    ? profile.displayName.replace(/<[^>]*>?/gm, '').split('|')[0].split('-')[0].trim().substring(0, 30)
    : profile.username;

  // Safely handle stringified nulls with random punctuation (e.g., 'null,')
  let safeInstitution = profile.institution;
  if (safeInstitution && safeInstitution.toLowerCase().includes('null')) {
    safeInstitution = null;
  } else if (safeInstitution) {
    safeInstitution = safeInstitution.replace(/^,\s*|\s*,$/g, '').trim();
  }

  return {
    ...profile,
    displayName: safeDisplayName || profile.username,
    institution: safeInstitution || null,
    codingScore: isNaN(profile.codingScore) ? 0 : profile.codingScore,
    totalProblemsSolved: isNaN(profile.totalProblemsSolved) ? 0 : profile.totalProblemsSolved,
    currentStreak: isNaN(profile.currentStreak) ? 0 : Math.min(profile.currentStreak, isNaN(profile.maxStreak) ? 0 : profile.maxStreak),
    maxStreak: isNaN(profile.maxStreak) ? 0 : profile.maxStreak,
  };
}
