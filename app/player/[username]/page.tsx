import { notFound } from 'next/navigation';
import Link from 'next/link';
import { fetchProfileWithFallback } from '@/lib/providerChain';
import { normalizeProfile } from '@/lib/normalize';
import { computeCardModel } from '@/lib/rating';
import { PlayerCard } from '@/components/PlayerCard';
import { PlayerHeader } from '@/components/dashboard/PlayerHeader';
import { PlayerAttributesPanel } from '@/components/dashboard/PlayerAttributesPanel';
import { PlayerStatsPanel } from '@/components/dashboard/PlayerStatsPanel';
import { DownloadButton } from '@/components/DownloadButton';
import { ShareButton } from '@/components/ShareButton';
import { getCache, setCache } from '@/lib/cache';

const CACHE_TTL_SECONDS = 600; // 10 mins

export async function generateMetadata({ params }: { params: Promise<{ username: string }> | { username: string } }) {
  const resolvedParams = await Promise.resolve(params);
  return {
    title: `${resolvedParams.username} | GeekFut Player Card`,
    description: `GeekFut ultimate team card for ${resolvedParams.username}`,
  };
}

export default async function PlayerPage({ params }: { params: Promise<{ username: string }> | { username: string } }) {
  const resolvedParams = await Promise.resolve(params);
  const username = resolvedParams.username;

  if (!username || !/^[a-zA-Z0-9_.-]{1,64}$/.test(username)) {
    notFound();
  }

  let profileData;
  const cacheKey = `profile:v2:${username.toLowerCase()}`;
  const cachedData = getCache<any>(cacheKey);

  if (cachedData) {
    profileData = cachedData;
  } else {
    try {
      const { profile, providerName } = await fetchProfileWithFallback(username);
      const normalizedProfile = normalizeProfile(profile);
      const cardModel = computeCardModel(normalizedProfile);

      profileData = {
        username: normalizedProfile.username,
        displayName: normalizedProfile.displayName,
        institution: normalizedProfile.institution,
        language: normalizedProfile.language,
        profilePicture: normalizedProfile.profilePicture,
        raw: {
          codingScore: normalizedProfile.codingScore,
          totalProblemsSolved: normalizedProfile.totalProblemsSolved,
          currentStreak: normalizedProfile.currentStreak,
          maxStreak: normalizedProfile.maxStreak,
          instituteRank: normalizedProfile.instituteRank,
        },
        card: cardModel,
      };

      setCache(cacheKey, profileData, CACHE_TTL_SECONDS);
    } catch (error: any) {
      if (error.message === 'profile_not_found') {
        return (
          <main className="flex-1 flex flex-col items-center justify-center p-6 min-h-[calc(100vh-80px)] text-center">
            <h1 className="text-4xl font-display font-bold text-white mb-4">Player Not Found</h1>
            <p className="text-gray-400 mb-8 font-body">We couldn't find a GeeksforGeeks profile for @{username}.</p>
            <Link href="/" className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-full font-body text-white transition-colors">
              Go Back
            </Link>
          </main>
        );
      }
      return (
        <main className="flex-1 flex flex-col items-center justify-center p-6 min-h-[calc(100vh-80px)] text-center">
          <h1 className="text-4xl font-display font-bold text-white mb-4">Scouting Failed</h1>
          <p className="text-gray-400 mb-8 font-body">Upstream providers failed to fetch the stats for @{username}.</p>
          <Link href="/" className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-full font-body text-white transition-colors">
            Go Back
          </Link>
        </main>
      );
    }
  }

  // Determine Position for the header based on attributes
  const { pace, shooting, passing, dribbling, defending, physical } = profileData.card.attributes;
  const stScore = shooting * 0.6 + physical * 0.2 + pace * 0.2;
  const wingScore = pace * 0.6 + dribbling * 0.3 + passing * 0.1;
  const camScore = passing * 0.5 + dribbling * 0.4 + shooting * 0.1;
  const cdmScore = defending * 0.5 + physical * 0.4 + passing * 0.1;
  const cbScore = defending * 0.6 + physical * 0.4;
  const fbScore = pace * 0.4 + defending * 0.4 + physical * 0.2;
  
  const maxScore = Math.max(stScore, wingScore, camScore, cdmScore, cbScore, fbScore);
  let position = 'CM';
  if (maxScore === stScore) position = 'ST';
  else if (maxScore === wingScore) position = pace > 88 ? 'LW' : 'RW';
  else if (maxScore === camScore) position = 'CAM';
  else if (maxScore === cdmScore) position = 'CDM';
  else if (maxScore === cbScore) position = 'CB';
  else if (maxScore === fbScore) position = pace > 85 ? 'LB' : 'RB';

  return (
    <main className="flex-1 flex flex-col items-center justify-start p-8 md:p-16 lg:px-24 lg:pt-24 lg:pb-4 relative min-h-[calc(100vh-80px)] overflow-x-hidden">
      
      {/* Background Orbs */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gfg-green rounded-full mix-blend-screen filter blur-[200px] opacity-[0.05] pointer-events-none"></div>
      
      <div className="w-full max-w-6xl z-10 transform scale-90 lg:scale-[0.70] origin-top lg:-mb-[300px]">
        
        {/* Navigation Back */}
        <Link href="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-white transition-colors font-body text-sm mb-8 animate-fade-in-up">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Search
        </Link>

        {/* Top Header */}
        <PlayerHeader 
          displayName={profileData.displayName}
          username={profileData.username}
          ovr={profileData.card.ovr}
          tier={profileData.card.tier}
          position={position}
          codingScore={profileData.raw.codingScore}
        />

        {/* Dashboard Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-8 items-start mt-12 w-full">
          
          {/* Left Panel: Attributes */}
          <div className="flex justify-center lg:justify-end order-2 lg:order-1">
            <PlayerAttributesPanel model={profileData.card} />
          </div>

          {/* Center: The Card */}
          <div className="flex flex-col items-center justify-center order-1 lg:order-2">
            <div className="transform hover:scale-[1.03] transition-transform duration-500 shadow-2xl rounded-3xl animate-fade-in-up">
              <PlayerCard 
                model={profileData.card} 
                displayName={profileData.displayName} 
                institution={profileData.institution}
                profilePicture={profileData.profilePicture}
                codingScore={profileData.raw.codingScore}
              />
            </div>
            
            <div className="w-full max-w-[320px] mt-8 flex flex-col animate-fade-in-up animate-delay-200">
              <ShareButton />
              <DownloadButton />
            </div>
          </div>

          {/* Right Panel: Metrics */}
          <div className="flex justify-center lg:justify-start order-3 lg:order-3">
            <PlayerStatsPanel raw={{ ...profileData.raw, institution: profileData.institution }} />
          </div>
          
        </div>
      </div>
    </main>
  );
}
