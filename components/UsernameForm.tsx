"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { HowItWorksModal } from './HowItWorksModal';

export function UsernameForm() {
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      setIsLoading(true);
      router.push(`/player/${username.trim()}`);
    }
  };

  const sampleUsers = ['speedcuberayush', 'sumitpardhiya3'];

  return (
    <>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-xl mx-auto animate-fade-in-up animate-delay-200 opacity-0">
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <div className="relative w-full flex-1 group">
            <div className="absolute inset-0 bg-gfg-green opacity-0 group-focus-within:opacity-20 blur-xl transition-opacity duration-500 rounded-2xl"></div>
            <input 
              type="text"
              placeholder="Enter GFG Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={isLoading}
              className="relative w-full bg-white/5 backdrop-blur-md text-white border border-white/10 px-6 py-4 rounded-2xl focus:outline-none focus:border-gfg-green focus:ring-1 focus:ring-gfg-green uppercase tracking-wider font-body placeholder:text-gray-500 transition-all duration-300 shadow-xl"
            />
          </div>
          <button 
            type="submit" 
            disabled={isLoading || !username.trim()}
            className="relative overflow-hidden bg-gradient-to-br from-gfg-green to-gfg-green-dark text-white px-10 py-4 rounded-2xl font-display uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:hover:scale-100 shadow-[0_0_20px_rgba(47,141,70,0.3)] hover:shadow-[0_0_30px_rgba(47,141,70,0.5)] w-full sm:w-auto font-bold"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                Scouting...
              </span>
            ) : 'Scout Player'}
          </button>
        </div>

        {/* Quick Links and How it Works */}
        <div className="flex flex-col sm:flex-row items-center justify-between text-sm font-body text-gray-400 px-2">
          <div className="flex items-center gap-1.5 flex-wrap justify-center sm:justify-start">
            <span>try</span>
            {sampleUsers.map((user, idx) => (
              <span key={user} className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setUsername(user)}
                  className="hover:text-gfg-green transition-colors cursor-pointer outline-none focus:text-gfg-green font-medium"
                >
                  {user}
                </button>
                <span className="text-gray-600">·</span>
              </span>
            ))}
            <span>or your own</span>
          </div>

          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="mt-3 sm:mt-0 flex items-center gap-1 hover:text-white transition-colors cursor-pointer font-medium tracking-wide text-sm"
          >
            how it works ↗
          </button>
        </div>
      </form>

      <HowItWorksModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
