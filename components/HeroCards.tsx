import { fetchProfileWithFallback } from '@/lib/providerChain';
import { normalizeProfile } from '@/lib/normalize';
import { computeCardModel } from '@/lib/rating';
import { PlayerCard } from './PlayerCard';
import { getCache, setCache } from '@/lib/cache';

const HERO_USERS = ['speedcuberayush', 'dewansh01', 'anujpi5cgn', 'codewithghtqh8'];

async function getHeroProfile(username: string) {
  const cacheKey = `hero_profile:${username}`;
  const cached = getCache<any>(cacheKey);
  if (cached) return cached;

  try {
    const { profile } = await fetchProfileWithFallback(username);
    const normalized = normalizeProfile(profile);
    const card = computeCardModel(normalized);
    const result = { normalized, card };
    // Cache for a long time (1 hour) since it's just for the background
    setCache(cacheKey, result, 3600);
    return result;
  } catch (e) {
    return null;
  }
}

export async function HeroCards() {
  const profiles = await Promise.all(HERO_USERS.map(getHeroProfile));

  // The cards should fan out from left to right.
  // Rotations: -15deg, -5deg, +5deg, +15deg
  // Z-indexes: 10, 20, 30, 40
  // Translations and scales to create depth
  const styles = [
    { rotate: '-12deg', translateX: '-40%', translateY: '10%', scale: 0.85, zIndex: 10 },
    { rotate: '-4deg', translateX: '-15%', translateY: '0%', scale: 0.95, zIndex: 20 },
    { rotate: '4deg', translateX: '15%', translateY: '-5%', scale: 1.05, zIndex: 30 },
    { rotate: '12deg', translateX: '45%', translateY: '5%', scale: 0.9, zIndex: 40 },
  ];

  return (
    <div className="relative w-full h-[600px] flex items-center justify-center perspective-1000">
      {profiles.map((p, idx) => {
        if (!p) return null;
        const style = styles[idx];
        return (
          <div 
            key={HERO_USERS[idx]}
            className="absolute transition-all duration-500 ease-out origin-bottom animate-fade-in-up translate-x-[var(--card-tx)] translate-y-[var(--card-ty)] rotate-[var(--card-rotate)] scale-[var(--card-scale)] z-[var(--card-z)] hover:translate-x-0 hover:-translate-y-10 hover:rotate-0 hover:scale-[1.15] hover:z-50 cursor-pointer group/card"
            style={{ 
              '--card-rotate': style.rotate,
              '--card-tx': style.translateX,
              '--card-ty': style.translateY,
              '--card-scale': style.scale,
              '--card-z': style.zIndex,
              animationDelay: `${idx * 150}ms`,
              filter: `drop-shadow(0 30px 40px rgba(0,0,0,0.6))`
            } as React.CSSProperties}
          >
            <div className="opacity-75 mix-blend-luminosity group-hover/card:mix-blend-normal group-hover/card:opacity-100 transition-all duration-500">
              <PlayerCard 
                model={p.card}
                displayName={p.normalized.displayName}
                institution={p.normalized.institution}
                profilePicture={p.normalized.profilePicture}
                codingScore={p.normalized.codingScore}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
