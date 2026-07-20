'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { PlayerCard } from '@/components/PlayerCard';
import { RadarChart } from '@/components/duel/RadarChart';

interface DuelMatchDisplayProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  p1Data: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  p2Data: any;
}

const STATS = [
  { key: 'pace', label: 'PAC' },
  { key: 'shooting', label: 'SHO' },
  { key: 'passing', label: 'PAS' },
  { key: 'dribbling', label: 'DRI' },
  { key: 'defending', label: 'DEF' },
  { key: 'physical', label: 'PHY' },
];

export function DuelMatchDisplay({ p1Data, p2Data }: DuelMatchDisplayProps) {
  const [stage, setStage] = useState(0);
  const [isCopied, setIsCopied] = useState(false);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  useEffect(() => {
    // Stage 0: Initial (Cards)
    // Stage 1-6: Stats
    // Stage 7: Radar
    // Stage 8: Receipts
    if (stage < 8) {
      const timer = setTimeout(() => {
        setStage(s => s + 1);
      }, stage === 0 ? 1500 : stage <= 6 ? 1500 : 1000);
      return () => clearTimeout(timer);
    }
  }, [stage]);

  // Calculate dynamic scores up to current stage
  let currentScore1 = 0;
  let currentScore2 = 0;
  
  STATS.forEach((stat, index) => {
    if (stage >= index + 1) {
      const v1 = p1Data.card.attributes[stat.key];
      const v2 = p2Data.card.attributes[stat.key];
      if (v1 > v2) currentScore1++;
      else if (v2 > v1) currentScore2++;
    }
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getMaskedAttributes = (attributes: any) => ({
    pace: stage >= 1 ? attributes.pace : 0,
    shooting: stage >= 2 ? attributes.shooting : 0,
    passing: stage >= 3 ? attributes.passing : 0,
    dribbling: stage >= 4 ? attributes.dribbling : 0,
    defending: stage >= 5 ? attributes.defending : 0,
    physical: stage >= 6 ? attributes.physical : 0,
  });

  const maskedAttributes1 = getMaskedAttributes(p1Data.card.attributes);
  const maskedAttributes2 = getMaskedAttributes(p2Data.card.attributes);

  return (
    <div className="w-full text-center mt-4 pb-12 z-10 transform lg:scale-[0.85] xl:scale-[0.70] 2xl:scale-[0.65] origin-top lg:-mb-[100px] xl:-mb-[250px] 2xl:-mb-[350px]">
      <div className="text-gfg-green font-display font-bold tracking-widest uppercase text-sm mb-4 animate-fade-in-up">Scout Duel</div>
      <div className="flex items-center justify-center gap-6 font-display font-black text-3xl md:text-5xl uppercase tracking-tighter animate-fade-in-up animate-delay-100">
        <span className="text-[#2ECCA1] drop-shadow-md">{p1Data.username}</span>
        <span className="text-white text-4xl md:text-6xl italic transform -skew-x-12 drop-shadow-md">VS</span>
        <span className="text-[#F39C12] drop-shadow-md">{p2Data.username}</span>
      </div>

      <div className="w-full max-w-7xl mx-auto flex flex-col xl:flex-row items-start justify-center gap-12 xl:gap-8 mt-12">
        
        {/* Player 1 Column */}
        <div className="flex flex-col items-center animate-fade-in-up animate-delay-200 w-full xl:w-1/3">
          <div className="transform hover:scale-[1.03] transition-transform duration-500 drop-shadow-[0_0_30px_rgba(46,204,161,0.3)] mb-8">
            <PlayerCard 
              model={p1Data.card} 
              displayName={p1Data.displayName} 
              institution={p1Data.institution}
              profilePicture={p1Data.profilePicture}
              codingScore={p1Data.raw.codingScore}
            />
          </div>
          
          <div className={`transition-all duration-1000 transform ${stage >= 1 ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
            <RadarChart attributes={maskedAttributes1} color="#2ECCA1" />
          </div>
        </div>

        {/* Center: Score & Comparison */}
        <div className="flex flex-col items-center w-full xl:w-1/3 order-last xl:order-none mt-8 xl:mt-0">
          
          <div className={`transition-opacity duration-1000 ${stage >= 1 ? 'opacity-100' : 'opacity-0'}`}>
            <div className="text-gray-400 font-display font-bold tracking-[0.3em] text-sm uppercase mb-2 text-center">Full Time</div>
            <div className="text-7xl font-display font-black text-white mb-12 drop-shadow-[0_0_15px_rgba(255,255,255,0.2)] text-center transition-all duration-500">
              {currentScore1} - {currentScore2}
            </div>
          </div>

          {/* Possession Bars */}
          <div className={`w-full max-w-md flex flex-col gap-6 mb-16 transition-opacity duration-1000 ${stage >= 1 ? 'opacity-100' : 'opacity-0'}`}>
            <div className="flex justify-between text-xs font-display font-bold text-gray-400 uppercase tracking-widest mb-2 border-b border-white/10 pb-2">
              <span className="text-[#2ECCA1] transition-all duration-500">{Math.round((currentScore1 / Math.max(1, currentScore1 + currentScore2)) * 100) || 0}%</span>
              <span>POSSESSION</span>
              <span className="text-[#F39C12] transition-all duration-500">{Math.round((currentScore2 / Math.max(1, currentScore1 + currentScore2)) * 100) || 0}%</span>
            </div>

            {STATS.map(({ key, label }, index) => {
              const v1 = p1Data.card.attributes[key];
              const v2 = p2Data.card.attributes[key];
              
              const total = v1 + v2 || 1;
              

              const isRevealed = stage >= index + 1;
              const p1Wins = v1 > v2;
              const p2Wins = v2 > v1;

              return (
                <div key={label} className={`flex items-center gap-4 w-full transition-all duration-700 transform ${isRevealed ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}>
                  <div className={`w-8 text-right font-display font-bold transition-all duration-500 ${!isRevealed ? 'text-transparent' : p1Wins ? 'text-[#2ECCA1] drop-shadow-[0_0_8px_rgba(46,204,161,0.8)]' : p2Wins ? 'text-gray-600' : 'text-gray-400'}`}>{v1}</div>
                  
                  <div className="flex-1 flex items-center h-1.5 bg-black/50 rounded-full justify-end">
                    <div className={`h-full rounded-full transition-all duration-1000 ${isRevealed && p1Wins ? 'bg-[#2ECCA1] drop-shadow-[0_0_8px_rgba(46,204,161,1)]' : 'bg-[#2ECCA1]/30'}`} style={{ width: isRevealed ? `${v1}%` : '0%' }}></div>
                  </div>
                  
                  <div className={`w-10 text-center font-body text-xs font-bold transition-colors duration-500 ${isRevealed ? 'text-white' : 'text-gray-600'}`}>{label}</div>
                  
                  <div className="flex-1 flex items-center h-1.5 bg-black/50 rounded-full justify-start">
                     <div className={`h-full rounded-full transition-all duration-1000 ${isRevealed && p2Wins ? 'bg-[#F39C12] drop-shadow-[0_0_8px_rgba(243,156,18,1)]' : 'bg-[#F39C12]/30'}`} style={{ width: isRevealed ? `${v2}%` : '0%' }}></div>
                  </div>
                  
                  <div className={`w-8 text-left font-display font-bold transition-all duration-500 ${!isRevealed ? 'text-transparent' : p2Wins ? 'text-[#F39C12] drop-shadow-[0_0_8px_rgba(243,156,18,0.8)]' : p1Wins ? 'text-gray-600' : 'text-gray-400'}`}>{v2}</div>
                </div>
              );
            })}
          </div>

          {/* The Receipts */}
          <div className={`w-full border border-white/10 rounded-2xl overflow-hidden shadow-2xl transition-all duration-1000 transform ${stage >= 8 ? 'opacity-100 translate-y-0 bg-black/20 backdrop-blur-md' : 'opacity-0 translate-y-8 bg-transparent'}`}>
            <div className="py-4 text-center border-b border-white/10 text-xs text-white font-bold uppercase tracking-[0.3em]">
              The Receipts
            </div>
            <div className="divide-y divide-white/5 font-body">
              {[
                { label: 'Problems Solved', v1: p1Data.raw.totalProblemsSolved, v2: p2Data.raw.totalProblemsSolved },
                { label: 'Coding Score', v1: p1Data.raw.codingScore, v2: p2Data.raw.codingScore },
                { label: 'Current Streak', v1: p1Data.raw.currentStreak, v2: p2Data.raw.currentStreak },
                { label: 'Best Streak', v1: p1Data.raw.maxStreak, v2: p2Data.raw.maxStreak },
              ].map((row, i) => (
                <div key={i} className="flex justify-between items-center px-6 py-4">
                  <div className={`w-1/3 text-left font-bold ${row.v1 > row.v2 ? 'text-[#2ECCA1]' : 'text-gray-500'}`}>
                    {row.v1.toLocaleString()}
                  </div>
                  <div className="w-1/3 text-center text-xs text-gray-400 uppercase tracking-wider">{row.label}</div>
                  <div className={`w-1/3 text-right font-bold ${row.v2 > row.v1 ? 'text-[#F39C12]' : 'text-gray-500'}`}>
                    {row.v2.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className={`w-full flex flex-col gap-3 mt-6 transition-all duration-1000 ${stage >= 8 ? 'opacity-100' : 'opacity-0'}`}>
            <button 
              onClick={handleShare}
              className="w-full py-4 bg-gradient-to-r from-[#F39C12] to-[#D35400] hover:from-[#F39C12] hover:to-[#E67E22] transition-all text-black text-xs font-black uppercase tracking-widest text-center rounded-xl flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(243,156,18,0.2)] active:scale-95"
            >
              {isCopied ? (
                <>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                  LINK COPIED!
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
                  SHARE THE DUEL
                </>
              )}
            </button>
            <Link 
              href={`/duel/${p2Data.username}/${p1Data.username}`}
              className="w-full py-4 bg-transparent border border-white/10 hover:bg-white/5 transition-colors text-white text-xs font-bold uppercase tracking-widest text-center rounded-xl flex items-center justify-center gap-2"
            >
               <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>
               Swap Corners
            </Link>
          </div>

        </div>

        {/* Player 2 Column */}
        <div className="flex flex-col items-center animate-fade-in-up animate-delay-300 w-full xl:w-1/3">
          <div className="transform hover:scale-[1.03] transition-transform duration-500 drop-shadow-[0_0_30px_rgba(243,156,18,0.3)] mb-8">
            <PlayerCard 
              model={p2Data.card} 
              displayName={p2Data.displayName} 
              institution={p2Data.institution}
              profilePicture={p2Data.profilePicture}
              codingScore={p2Data.raw.codingScore}
            />
          </div>
          
          <div className={`transition-all duration-1000 transform ${stage >= 1 ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
            <RadarChart attributes={maskedAttributes2} color="#F39C12" />
          </div>
        </div>

      </div>
    </div>
  );
}
