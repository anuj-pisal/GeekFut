import { NextResponse } from 'next/server';
import { fetchProfileWithFallback } from '@/lib/providerChain';
import { normalizeProfile } from '@/lib/normalize';
import { computeCardModel } from '@/lib/rating';
import { getCache, setCache } from '@/lib/cache';

const CACHE_TTL_SECONDS = 600; // 10 minutes

export async function GET(
  request: Request,
  { params }: { params: Promise<{ username: string }> | { username: string } }
) {
  // Await params if it's a promise (Next.js 15), otherwise use directly
  const resolvedParams = await Promise.resolve(params);
  const { username } = resolvedParams;

  // Basic validation per API_SPEC.md (Alphanumeric + _/-/., 1-64 chars)
  if (!username || !/^[a-zA-Z0-9_.-]{1,64}$/.test(username)) {
    return NextResponse.json(
      { error: 'invalid_username', message: 'Invalid username format.' },
      { status: 400 }
    );
  }

  try {
    const cacheKey = `profile:${username.toLowerCase()}`;
    const cachedData = getCache<any>(cacheKey);

    if (cachedData) {
      return NextResponse.json(cachedData);
    }

    const { profile, providerName } = await fetchProfileWithFallback(username);
    const normalizedProfile = normalizeProfile(profile);
    const cardModel = computeCardModel(normalizedProfile);

    const responseData = {
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
      meta: {
        provider: providerName,
        cached: false,
        fetchedAt: new Date().toISOString(),
      },
    };

    setCache(cacheKey, { ...responseData, meta: { ...responseData.meta, cached: true } }, CACHE_TTL_SECONDS);

    return NextResponse.json(responseData);
  } catch (error: any) {
    if (error.message === 'profile_not_found') {
      return NextResponse.json(
        { error: 'profile_not_found', message: 'GeeksforGeeks profile not found.' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: 'upstream_unavailable', message: 'Upstream stats providers failed.' },
      { status: 502 }
    );
  }
}
