import { expect, test, describe } from 'vitest';
import { computeCardModel } from '../../lib/rating';
import { NormalizedGfgProfile } from '../../lib/providers/types';

describe('rating heuristic', () => {
  test('calculates correct OVR and tier for high stats', () => {
    const profile: NormalizedGfgProfile = {
      username: 'test',
      displayName: 'test',
      institution: null,
      profilePicture: null,
      codingScore: 2000,
      totalProblemsSolved: 500,
      currentStreak: 100,
      maxStreak: 200,
      instituteRank: null,
      language: 'C++',
    };
    
    const card = computeCardModel(profile);
    expect(card.ovr).toBeGreaterThanOrEqual(90);
    expect(card.tier).toBe('icon');
    expect(card.streak.percent).toBe(50);
  });
  
  test('handles zero stats correctly', () => {
    const profile: NormalizedGfgProfile = {
      username: 'test',
      displayName: 'test',
      institution: null,
      profilePicture: null,
      codingScore: 0,
      totalProblemsSolved: 0,
      currentStreak: 0,
      maxStreak: 0,
      instituteRank: null,
      language: 'C++',
    };
    
    const card = computeCardModel(profile);
    expect(card.ovr).toBe(0);
    expect(card.tier).toBe('bronze');
    expect(card.streak.percent).toBe(0);
  });
});
