import { NormalizedGfgProfile, CardModel, CardAttributes, StreakStats } from './providers/types';

export function computeCardModel(profile: NormalizedGfgProfile): CardModel {
  // Use a square-root based algorithm to make high ratings exponentially harder to achieve
  // Score 2088, Probs 814 -> ~88 OVR
  let ovr = Math.floor(Math.sqrt(profile.codingScore) * 1.3 + Math.sqrt(profile.totalProblemsSolved) * 1.0);
  
  if (ovr > 99) ovr = 99;
  if (ovr < 40 && (profile.codingScore > 0 || profile.totalProblemsSolved > 0)) ovr = 40; 
  if (profile.codingScore === 0 && profile.totalProblemsSolved === 0) ovr = 0;

  let tier: CardModel['tier'] = 'bronze';
  if (ovr >= 90) tier = 'icon';
  else if (ovr >= 75) tier = 'gold';
  else if (ovr >= 65) tier = 'silver';
  
  const pace = Math.min(99, Math.floor(40 + Math.sqrt(profile.currentStreak) * 1.5 + Math.sqrt(profile.maxStreak) * 3));
  const shooting = Math.min(99, Math.floor(40 + Math.sqrt(profile.codingScore) * 0.8)); 
  const passing = Math.min(99, Math.floor(40 + Math.sqrt(profile.totalProblemsSolved) * 0.9)); 
  const dribbling = Math.min(99, Math.floor(40 + Math.sqrt(profile.totalProblemsSolved) * 1.1)); 
  const physical = Math.min(99, Math.floor(40 + Math.sqrt(profile.codingScore) * 0.6 + Math.sqrt(profile.totalProblemsSolved) * 0.5));

  // Institute rank proxy for defending
  let defending = 40;
  if (profile.instituteRank && profile.instituteRank > 0) {
    // Rank 1 -> ~99 DEF, Rank 10,000 -> ~50 DEF
    defending = Math.min(99, Math.max(40, Math.floor(100 - Math.sqrt(profile.instituteRank) * 0.5)));
  } else {
    defending = Math.min(99, Math.floor(40 + Math.sqrt(profile.codingScore) * 0.5)); // Fallback metric
  }

  const attributes: CardAttributes = {
    pace,
    shooting,
    passing,
    dribbling,
    defending,
    physical,
  };

  const streak: StreakStats = {
    current: profile.currentStreak,
    max: profile.maxStreak,
    percent: profile.maxStreak > 0 ? Math.round((profile.currentStreak / profile.maxStreak) * 100) : 0,
  };

  return { ovr, tier, attributes, streak };
}
