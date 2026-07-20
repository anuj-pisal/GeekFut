import { notFound } from 'next/navigation';
import Link from 'next/link';
import { fetchProfileWithFallback } from '@/lib/providerChain';
import { normalizeProfile } from '@/lib/normalize';
import { computeCardModel } from '@/lib/rating';
import { PlayerCard } from '@/components/PlayerCard';
import { PlayerHeader } from '@/components/dashboard/PlayerHeader';
import { PlayerAttributesPanel } from '@/components/dashboard/PlayerAttributesPanel';
import { PlayerStatsPanel } from '@/components/dashboard/PlayerStatsPanel';
import { PlayerDistributionGraph } from '@/components/dashboard/PlayerDistributionGraph';
import { DownloadButton } from '@/components/DownloadButton';
import { ShareButton } from '@/components/ShareButton';
import prisma from '@/lib/db';

const CACHE_TTL_HOURS = 12;


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
  const usernameLower = username.toLowerCase();
  
  try {
    const dbPlayer = await prisma.player.findUnique({
      where: { username: usernameLower }
    });

    const isStale = dbPlayer ? (new Date().getTime() - dbPlayer.scoutedAt.getTime()) > (CACHE_TTL_HOURS * 60 * 60 * 1000) : true;

    if (dbPlayer && !isStale) {
      // Background view count increment
      prisma.player.update({
        where: { username: usernameLower },
        data: { viewCount: { increment: 1 } }
      }).catch(console.error);

      // Sanitize displayName in case the database cached a broken HTML string from previous bugs
      const safeDisplayName = dbPlayer.displayName
        ? dbPlayer.displayName.replace(/<[^>]*>?/gm, '').split('|')[0].split('-')[0].trim().substring(0, 30)
        : dbPlayer.username;

      profileData = {
        username: dbPlayer.username,
        displayName: safeDisplayName,
        institution: dbPlayer.institution,
        language: dbPlayer.language,
        profilePicture: dbPlayer.profilePicture,
        raw: {
          codingScore: dbPlayer.codingScore,
          totalProblemsSolved: dbPlayer.totalProblemsSolved,
          currentStreak: dbPlayer.currentStreak,
          maxStreak: dbPlayer.maxStreak,
          instituteRank: dbPlayer.instituteRank,
        },
        card: {
          ovr: dbPlayer.ovr,
          tier: dbPlayer.tier as any,
          position: dbPlayer.position,
          attributes: {
            pace: dbPlayer.pace,
            shooting: dbPlayer.shooting,
            passing: dbPlayer.passing,
            dribbling: dbPlayer.dribbling,
            defending: dbPlayer.defending,
            physical: dbPlayer.physical,
          },
          streak: {
            current: dbPlayer.currentStreak,
            max: dbPlayer.maxStreak,
            percent: dbPlayer.maxStreak > 0 ? Math.round((dbPlayer.currentStreak / dbPlayer.maxStreak) * 100) : 0,
          }
        }
      };
    } else {
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

      // Upsert to Prisma
      await prisma.player.upsert({
        where: { username: normalizedProfile.username.toLowerCase() },
        update: {
          displayName: normalizedProfile.displayName,
          profilePicture: normalizedProfile.profilePicture,
          institution: normalizedProfile.institution,
          language: normalizedProfile.language || 'Unknown',
          codingScore: normalizedProfile.codingScore,
          totalProblemsSolved: normalizedProfile.totalProblemsSolved,
          currentStreak: normalizedProfile.currentStreak,
          maxStreak: normalizedProfile.maxStreak,
          instituteRank: normalizedProfile.instituteRank,
          ovr: cardModel.ovr,
          tier: cardModel.tier,
          position: cardModel.position,
          pace: cardModel.attributes.pace,
          shooting: cardModel.attributes.shooting,
          passing: cardModel.attributes.passing,
          dribbling: cardModel.attributes.dribbling,
          defending: cardModel.attributes.defending,
          physical: cardModel.attributes.physical,
          scoutedAt: new Date(),
          viewCount: dbPlayer ? { increment: 1 } : 1,
        },
        create: {
          username: normalizedProfile.username.toLowerCase(),
          displayName: normalizedProfile.displayName,
          profilePicture: normalizedProfile.profilePicture,
          institution: normalizedProfile.institution,
          language: normalizedProfile.language || 'Unknown',
          codingScore: normalizedProfile.codingScore,
          totalProblemsSolved: normalizedProfile.totalProblemsSolved,
          currentStreak: normalizedProfile.currentStreak,
          maxStreak: normalizedProfile.maxStreak,
          instituteRank: normalizedProfile.instituteRank,
          ovr: cardModel.ovr,
          tier: cardModel.tier,
          position: cardModel.position,
          pace: cardModel.attributes.pace,
          shooting: cardModel.attributes.shooting,
          passing: cardModel.attributes.passing,
          dribbling: cardModel.attributes.dribbling,
          defending: cardModel.attributes.defending,
          physical: cardModel.attributes.physical,
        }
      }).catch(console.error);
    }
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

  // Get Position for the header from the card model
  const position = profileData.card.position;

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
              <DownloadButton 
                model={profileData.card} 
                displayName={profileData.displayName} 
                institution={profileData.institution}
                profilePicture={profileData.profilePicture}
                codingScore={profileData.raw.codingScore}
              />
            </div>
          </div>

          {/* Right Panel: Metrics */}
          <div className="flex justify-center lg:justify-start order-3 lg:order-3">
            <PlayerStatsPanel raw={{ ...profileData.raw, institution: profileData.institution, instituteRank: profileData.raw.instituteRank ?? undefined }} />
          </div>
          
        </div>

        {/* Bottom Section: Distribution Graph */}
        <div className="w-full mt-8 flex justify-center">
          <PlayerDistributionGraph 
            username={profileData.username} 
            ovr={profileData.card.ovr} 
          />
        </div>

      </div>
    </main>
  );
}
