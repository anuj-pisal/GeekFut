import prisma from '@/lib/db';
import { LeaderboardTable } from '@/components/leaderboard/LeaderboardTable';

export const metadata = {
  title: 'Global Leaderboard | GeekFut',
  description: 'Top ranked GeeksforGeeks Ultimate Team players.',
};

export const revalidate = 300; // Cache this page for 5 minutes

export default async function LeaderboardPage() {
  const topPlayers = await prisma.player.findMany({
    take: 100,
    orderBy: [
      { ovr: 'desc' },
      { codingScore: 'desc' }
    ]
  });

  return (
    <main className="flex-1 flex flex-col items-center p-6 md:p-12 relative z-10 w-full max-w-5xl mx-auto animate-fade-in-up">
      <div className="text-center mb-10 mt-8">
        <h1 className="text-5xl md:text-7xl font-display font-bold text-white tracking-tight uppercase drop-shadow-md">
          Global <span className="text-transparent bg-clip-text bg-gradient-to-br from-gfg-green to-emerald-400">Leaderboard</span>
        </h1>
        <p className="text-gray-400 font-body mt-4 text-lg">Top 100 highest rated players on GeekFut</p>
      </div>

      <LeaderboardTable players={topPlayers as any} />
    </main>
  );
}
