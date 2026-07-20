import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET() {
  try {
    // Group players by OVR score and count them
    const distribution = await prisma.player.groupBy({
      by: ['ovr'],
      _count: {
        username: true,
      },
      orderBy: {
        ovr: 'asc'
      }
    });
    
    // Format the response as an array of { ovr, count }
    const formattedDistribution = distribution.map((d: { ovr: number; _count: { username: number } }) => ({
      ovr: d.ovr,
      count: d._count.username
    }));

    return NextResponse.json({ distribution: formattedDistribution }, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200' // cache for 1 hour
      }
    });
  } catch (error) {
    console.error('Failed to fetch distribution stats:', error);
    return NextResponse.json({ error: 'Failed to fetch distribution' }, { status: 500 });
  }
}
