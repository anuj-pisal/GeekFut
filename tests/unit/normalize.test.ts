import { expect, test, describe } from 'vitest';
import { normalizeProfile } from '../../lib/normalize';
import { NormalizedGfgProfile } from '../../lib/providers/types';

describe('normalizeProfile', () => {
  test('replaces NaNs with 0', () => {
    const profile: NormalizedGfgProfile = {
      username: 'test',
      displayName: 'test',
      institution: null,
      profilePicture: null,
      codingScore: NaN,
      totalProblemsSolved: 10,
      currentStreak: NaN,
      maxStreak: 100,
      instituteRank: null,
    };
    
    const normalized = normalizeProfile(profile);
    expect(normalized.codingScore).toBe(0);
    expect(normalized.currentStreak).toBe(0);
    expect(normalized.maxStreak).toBe(100);
  });
});
