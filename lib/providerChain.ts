import { gfgStatsTashifProvider } from './providers/tashif';
import { gfgStatsNapiyoProvider } from './providers/napiyo';
import { gfgStatsArnoobProvider } from './providers/arnoob';
import { gfgStatsDirectScraperProvider } from './providers/directScraper';
import { NormalizedGfgProfile, GfgProvider } from './providers/types';

const providers: GfgProvider[] = [
  gfgStatsDirectScraperProvider,
  gfgStatsTashifProvider,
  gfgStatsNapiyoProvider,
  gfgStatsArnoobProvider,
];

export async function fetchProfileWithFallback(
  username: string
): Promise<{ profile: NormalizedGfgProfile; providerName: string }> {
  let allNotFound = true;

  for (const provider of providers) {
    try {
      const profile = await provider.fetchProfile(username);
      return { profile, providerName: provider.name };
    } catch (error: any) {
      if (error.message !== 'profile_not_found') {
        allNotFound = false;
      }
      console.warn(`[${provider.name}] failed: ${error.message}`);
    }
  }

  if (allNotFound) {
    throw new Error('profile_not_found');
  }

  throw new Error('upstream_unavailable');
}
