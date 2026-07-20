import Link from 'next/link';
import { notFound } from 'next/navigation';
import prisma from '@/lib/db';
import { fetchProfileWithFallback } from '@/lib/providerChain';
import { normalizeProfile } from '@/lib/normalize';
import { computeCardModel } from '@/lib/rating';
import { RetryDuel } from '@/components/duel/RetryDuel';
import { DuelMatchDisplay } from '@/components/duel/DuelMatchDisplay';

const CACHE_TTL_HOURS = 12;

async function getPlayerData(username: string) {
  const usernameLower = username.toLowerCase();
  
  try {
    const dbPlayer = await prisma.player.findUnique({
      where: { username: usernameLower }
    });

    const isStale = dbPlayer ? (new Date().getTime() - dbPlayer.scoutedAt.getTime()) > (CACHE_TTL_HOURS * 60 * 60 * 1000) : true;

    if (dbPlayer && !isStale) {
      const safeDisplayName = dbPlayer.displayName
        ? dbPlayer.displayName.replace(/<[^>]*>?/gm, '').split('|')[0].split('-')[0].trim().substring(0, 30)
        : dbPlayer.username;

      return {
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
      const { profile } = await fetchProfileWithFallback(username);
      const normalizedProfile = normalizeProfile(profile);
      const cardModel = computeCardModel(normalizedProfile);

      // Async upsert to not block response
      prisma.player.upsert({
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

      return {
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
        card: cardModel
      };
    }
  } catch (error) {
    return null;
  }
}

export const metadata = {
  title: 'Head to Head Duel | GeekFut',
};

export default async function DuelPage({ params }: { params: Promise<{ player1: string, player2: string }> }) {
  const { player1, player2 } = await Promise.resolve(params);

  // Fetch both concurrently
  const [p1Data, p2Data] = await Promise.all([
    getPlayerData(player1),
    getPlayerData(player2)
  ]);

  if (!p1Data || !p2Data) {
    return (
      <main className="flex-1 flex flex-col items-center justify-center p-6 min-h-[calc(100vh-80px)] text-center">
        <h1 className="text-4xl font-display font-bold text-white mb-4 animate-fade-in-up">Rival Not Found</h1>
        <p className="text-gray-400 mb-8 font-body animate-fade-in-up animate-delay-100 max-w-md">Looks like we couldn&apos;t find stats for one of the players. Double-check the GeeksforGeeks handles and try again!</p>
        
        <RetryDuel player1={p1Data ? p1Data.username : player1} />
        
        <Link href={`/player/${p1Data ? p1Data.username : player1}`} className="mt-8 text-sm text-gray-500 hover:text-white transition-colors animate-fade-in-up animate-delay-200">
          Or go back to dashboard
        </Link>
      </main>
    );
  }

  return (
    <main className="flex-1 flex flex-col items-center p-6 md:p-12 relative min-h-[calc(100vh-80px)] overflow-x-hidden">
      
      {/* Background Lighting */}
      <div className="fixed top-0 left-0 w-1/2 h-screen bg-[#2ECCA1]/10 mix-blend-screen pointer-events-none blur-3xl -z-10"></div>
      <div className="fixed top-0 right-0 w-1/2 h-screen bg-[#F39C12]/10 mix-blend-screen pointer-events-none blur-3xl -z-10"></div>

      <DuelMatchDisplay p1Data={p1Data} p2Data={p2Data} />
    </main>
  );
}
