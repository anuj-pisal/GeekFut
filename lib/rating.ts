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
  
  const pace = Math.min(99, Math.floor(40 + Math.sqrt(profile.currentStreak) * 2.5 + Math.sqrt(profile.maxStreak) * 4));
  const shooting = Math.min(99, Math.floor(40 + Math.sqrt(profile.codingScore) * 0.8)); 
  const passing = Math.min(99, Math.floor(40 + Math.sqrt(profile.totalProblemsSolved) * 1.2)); 
  const dribbling = Math.min(99, Math.floor(40 + Math.sqrt(profile.totalProblemsSolved) * 1.5)); 
  const physical = Math.min(99, Math.floor(40 + Math.sqrt(profile.codingScore) * 0.5 + Math.sqrt(profile.totalProblemsSolved) * 0.6));

  // Institute rank proxy for defending
  let defending = 40;
  if (profile.instituteRank && profile.instituteRank > 0) {
    // Rank 1 -> ~99 DEF, Rank 10,000 -> ~68 DEF, Rank 100,000 -> ~40 DEF
    // Using a logarithmic scale is much better than linear sqrt to spread out ranks
    const rankLog = Math.log10(profile.instituteRank); // e.g. 1 -> 0, 10 -> 1, 100 -> 2, 1000 -> 3
    defending = Math.min(99, Math.max(40, Math.floor(100 - rankLog * 12)));
  } else {
    defending = Math.min(99, Math.floor(40 + Math.sqrt(profile.codingScore) * 0.6)); // Fallback metric
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

  const stScore = shooting * 0.55 + physical * 0.25 + pace * 0.20;
  const wingScore = pace * 0.55 + dribbling * 0.30 + passing * 0.15;
  const camScore = passing * 0.45 + dribbling * 0.40 + shooting * 0.15;
  const cdmScore = defending * 0.45 + physical * 0.35 + passing * 0.20;
  const cbScore = defending * 0.60 + physical * 0.40;
  const fbScore = pace * 0.45 + defending * 0.40 + physical * 0.15;
  
  const maxScore = Math.max(stScore, wingScore, camScore, cdmScore, cbScore, fbScore);
  
  let position = 'CM';
  // Introduce small random tie-breaker bias or threshold to naturally diversify
  if (maxScore === wingScore) position = pace > 85 ? 'LW' : 'RW';
  else if (maxScore === camScore) position = 'CAM';
  else if (maxScore === fbScore) position = pace > 80 ? 'LB' : 'RB';
  else if (maxScore === cdmScore) position = 'CDM';
  else if (maxScore === cbScore) position = 'CB';
  else position = 'ST';

  return { ovr, tier, position, attributes, streak };
}
