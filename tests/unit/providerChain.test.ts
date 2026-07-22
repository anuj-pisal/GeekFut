import { expect, test, describe, vi } from 'vitest';
import { fetchProfileWithFallback } from '../../lib/providerChain';
import { gfgStatsTashifProvider } from '../../lib/providers/tashif';
import { gfgStatsDirectScraperProvider } from '../../lib/providers/directScraper';

describe('providerChain', () => {
  test('returns profile from first successful provider', async () => {
    const mockProfile = { username: 'test' } as import('../../lib/providers/types').NormalizedGfgProfile;
    vi.spyOn(gfgStatsDirectScraperProvider, 'fetchProfile').mockRejectedValue(new Error('profile_not_found'));
    vi.spyOn(gfgStatsTashifProvider, 'fetchProfile').mockResolvedValue(mockProfile);
    
    const result = await fetchProfileWithFallback('test');
    expect(result.profile).toEqual(mockProfile);
    expect(result.providerName).toBe('gfgStatsTashifProvider');
  });
});
