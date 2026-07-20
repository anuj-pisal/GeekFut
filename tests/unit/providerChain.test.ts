import { expect, test, describe, vi } from 'vitest';
import { fetchProfileWithFallback } from '../../lib/providerChain';
import { gfgStatsTashifProvider } from '../../lib/providers/tashif';

describe('providerChain', () => {
  test('returns profile from first successful provider', async () => {
    const mockProfile = { username: 'test' } as any;
    vi.spyOn(gfgStatsTashifProvider, 'fetchProfile').mockResolvedValue(mockProfile);
    
    const result = await fetchProfileWithFallback('test');
    expect(result.profile).toEqual(mockProfile);
    expect(result.providerName).toBe('gfgStatsTashifProvider');
  });
});
