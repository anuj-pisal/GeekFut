"use client";

import { useState } from 'react';
import { UsernameForm } from '@/components/UsernameForm';
import { PlayerCard } from '@/components/PlayerCard';
import { DownloadButton } from '@/components/DownloadButton';

export default function Home() {
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (username: string) => {
    setLoading(true);
    setError(null);
    setProfileData(null);

    try {
      const res = await fetch(`/api/profile/${username}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to fetch profile');
      }

      setProfileData(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex-1 flex flex-col items-center justify-center p-6 md:p-12 relative overflow-hidden min-h-[calc(100vh-80px)]">

      {/* Background Ambient Glowing Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gfg-green rounded-full mix-blend-screen filter blur-[128px] opacity-20 animate-float pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#d9a53a] rounded-full mix-blend-screen filter blur-[128px] opacity-10 animate-float animate-delay-300 pointer-events-none"></div>

      <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-8 items-center z-10 my-auto">

        {/* Left Side: Hero Text and Form */}
        <div className="min-w-0 flex flex-col items-center lg:items-start text-center lg:text-left animate-fade-in-up">

          {/* Logo and Title Box */}
          <div className="flex flex-row items-center justify-center lg:justify-start gap-3 sm:gap-6 mb-10">
            <div className="relative group z-20 flex-shrink-0">
              <div className="absolute inset-0 bg-white/15 blur-3xl rounded-full opacity-40"></div>
              <img
                src="/newLogo.png"
                alt="GeekFut Logo"
                className="relative w-32 h-32 sm:w-44 sm:h-44 md:w-56 md:h-56 lg:w-64 lg:h-64 object-contain drop-shadow-[0_20px_30px_rgba(0,0,0,0.45)] animate-float"
              />
            </div>
            <h1 className="relative z-10 text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-display font-bold tracking-tighter leading-[0.9] break-words">
              <span className="text-white">Geek</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-br from-gfg-green via-gfg-green to-emerald-400">Fut</span>
            </h1>
          </div>

          <p className="text-lg md:text-2xl font-body text-gray-300 mb-12 max-w-xl leading-relaxed font-light opacity-90">
            Forge your legacy. Turn your GeeksforGeeks stats into an elite <strong className="text-white font-semibold">Ultimate Team</strong> player card.
          </p>

          <div className="w-full max-w-xl relative z-20">
            <UsernameForm onSearch={handleSearch} isLoading={loading} />

            {error && (
              <div className="mt-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-200 font-body text-sm animate-fade-in-up backdrop-blur-md shadow-lg flex items-center gap-3">
                <svg className="w-5 h-5 text-red-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                {error}
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Player Card Display */}
        <div className="min-w-0 flex flex-col items-center justify-center min-h-[500px] animate-fade-in-up animate-delay-300 relative w-full perspective-1000">

          {loading && (
            <div className="flex flex-col items-center justify-center space-y-6">
              <div className="relative w-20 h-20">
                <div className="absolute inset-0 border-4 border-white/10 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-gfg-green border-t-transparent rounded-full animate-spin"></div>
              </div>
              <p className="font-display uppercase tracking-widest text-gfg-green animate-pulse text-lg">Scouting Player...</p>
            </div>
          )}

          {!loading && !profileData && (
            <div className="glass-panel w-full max-w-sm aspect-[5/7] rounded-3xl flex flex-col items-center justify-center p-12 text-center text-gray-500 font-body border-dashed border-2 border-white/5 bg-gradient-to-br from-white/5 to-transparent hover:from-white/10 transition-all duration-500">
              <svg className="w-16 h-16 mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
              </svg>
              <p className="text-lg font-light">Your player card will be drafted here.</p>
            </div>
          )}

          {profileData && (
            <div className="flex flex-col items-center space-y-8 animate-fade-in-up">
              <div className="transform hover:scale-[1.03] hover:-rotate-1 transition-all duration-500 shadow-2xl rounded-3xl hover:shadow-[0_30px_60px_rgba(47,141,70,0.2)]">
                <PlayerCard
                  model={profileData.card}
                  displayName={profileData.displayName}
                  institution={profileData.institution}
                  profilePicture={profileData.profilePicture}
                  codingScore={profileData.raw.codingScore}
                />
              </div>
              <div className="w-full max-w-xs">
                <DownloadButton />
              </div>
            </div>
          )}
        </div>
      </div>

      <footer className="absolute bottom-6 text-center text-sm font-body text-gray-500 w-full animate-fade-in-up animate-delay-300 z-10">
        <p className="flex items-center justify-center space-x-2">
          <span>Built by</span>
          <a href="https://github.com/anuj-pisal" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors flex items-center space-x-1 font-bold group">
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current group-hover:scale-110 transition-transform"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
            <span>Anuj Pisal</span>
          </a>
        </p>
      </footer>
    </main>
  );
}