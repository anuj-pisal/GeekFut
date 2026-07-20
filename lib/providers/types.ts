export interface NormalizedGfgProfile {
  username: string;
  displayName: string;
  institution: string | null;
  language: string | null;
  profilePicture: string | null;
  codingScore: number;
  totalProblemsSolved: number;
  currentStreak: number;
  maxStreak: number;
  instituteRank: number | null;
}

export interface CardAttributes {
  pace: number;
  shooting: number;
  passing: number;
  dribbling: number;
  defending: number;
  physical: number;
}

export interface StreakStats {
  current: number;
  max: number;
  percent: number;
}

export interface CardModel {
  ovr: number;
  tier: 'bronze' | 'silver' | 'gold' | 'icon';
  position: string;
  attributes: CardAttributes;
  streak: StreakStats;
}

export interface GfgProvider {
  name: string;
  fetchProfile: (username: string) => Promise<NormalizedGfgProfile>;
}
