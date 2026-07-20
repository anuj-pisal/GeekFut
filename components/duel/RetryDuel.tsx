'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function RetryDuel({ player1 }: { player1: string }) {
  const router = useRouter();
  const [opponent, setOpponent] = useState('');

  const handleRetry = (e: React.FormEvent) => {
    e.preventDefault();
    if (opponent.trim()) {
      router.push(`/duel/${player1}/${opponent.trim().toLowerCase()}`);
    }
  };

  return (
    <form onSubmit={handleRetry} className="flex gap-2 w-full max-w-sm mt-4 animate-fade-in-up">
      <input
        type="text"
        placeholder="try another username"
        value={opponent}
        onChange={(e) => setOpponent(e.target.value)}
        className="flex-1 bg-black/50 border border-gfg-green/50 text-white font-body px-4 py-3 rounded-xl focus:outline-none focus:border-gfg-green transition-colors font-mono text-sm"
        autoFocus
      />
      <button
        type="submit"
        disabled={!opponent.trim()}
        className="px-6 py-3 bg-[#1a1a1a] border border-gfg-green/30 text-gfg-green font-display font-bold uppercase tracking-widest rounded-xl hover:bg-gfg-green/10 transition-colors disabled:opacity-50 flex items-center gap-2 shrink-0 text-sm"
      >
        Duel &rarr;
      </button>
    </form>
  );
}
