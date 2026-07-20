'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface DuelButtonProps {
  currentUser: string;
}

export function DuelButton({ currentUser }: DuelButtonProps) {
  const router = useRouter();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [opponent, setOpponent] = useState('');

  const handleKickOff = (e: React.FormEvent) => {
    e.preventDefault();
    if (opponent.trim()) {
      router.push(`/duel/${currentUser}/${opponent.trim().toLowerCase()}`);
    }
  };

  if (isExpanded) {
    return (
      <div className="w-full mt-4 flex flex-col gap-2 animate-fade-in-up origin-top">
        <div className="w-full py-4 bg-[#111] border border-white/10 rounded-2xl flex items-center justify-center gap-2 text-white font-display font-bold text-lg tracking-widest uppercase">
          @{currentUser} <span className="text-gfg-green mx-2">VS</span> ???
        </div>
        
        <form onSubmit={handleKickOff} className="flex justify-center gap-2 w-full mt-2">
          <input
            type="text"
            placeholder="their username"
            value={opponent}
            onChange={(e) => setOpponent(e.target.value)}
            className="w-full max-w-[250px] bg-black/50 border border-gfg-green/50 text-white font-body px-4 py-3 rounded-xl focus:outline-none focus:border-gfg-green transition-colors font-mono text-center"
            autoFocus
          />
          <button
            type="submit"
            disabled={!opponent.trim()}
            className="px-6 py-3 bg-[#1a1a1a] border border-gfg-green/30 text-gfg-green font-display font-bold uppercase tracking-widest rounded-xl hover:bg-gfg-green/10 transition-colors disabled:opacity-50 flex items-center gap-2 shrink-0"
          >
            Kick Off &rarr;
          </button>
        </form>
      </div>
    );
  }

  return (
    <button
      onClick={() => setIsExpanded(true)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="w-full mt-4 py-4 bg-transparent border border-gfg-green/30 text-white font-display font-bold text-lg uppercase tracking-widest hover:bg-gfg-green/10 transition-all rounded-2xl flex items-center justify-center gap-3 relative overflow-hidden group shadow-[0_0_15px_rgba(46,204,113,0.05)] hover:shadow-[0_0_20px_rgba(46,204,113,0.15)]"
    >
      <div className="absolute inset-0 border border-gfg-green/20 rounded-2xl scale-95 opacity-0 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300"></div>
      
      {isHovered ? (
        <span className="animate-fade-in-up">
          @{currentUser} <span className="text-gfg-green mx-2">VS</span> ???
        </span>
      ) : (
        <span className="animate-fade-in-up flex items-center gap-3">
          Duel a Rival <span className="text-gfg-green">VS</span>
        </span>
      )}
    </button>
  );
}
