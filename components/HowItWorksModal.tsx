"use client";
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function HowItWorksModal({ isOpen, onClose }: Props) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!mounted || !isOpen) return null;

  const modalContent = (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-[2px] transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal Container */}
      <div className="relative bg-[#161616]/95 backdrop-blur-md border border-white/10 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col animate-fade-in-up custom-scrollbar">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors z-10"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="p-8 md:p-10 text-left text-gray-300 font-body">
          <p className="text-gfg-green text-xs font-bold tracking-widest uppercase mb-2 font-display">The Scout&apos;s Eye</p>
          <h2 className="text-4xl md:text-5xl font-display font-black text-white uppercase leading-none mb-6 tracking-tight">
            We don&apos;t rate you.<br />
            We read you<span className="text-gfg-green">.</span>
          </h2>
          
          <p className="text-[15px] leading-relaxed mb-10 text-gray-400">
            Six signals off your live GeeksforGeeks profile, weighed against each other to find your shape. 
            That shape is your card — so two solvers with the same numbers still walk out different. 
            Here&apos;s how to read yours.
          </p>

          <div className="space-y-8">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="h-[2px] w-6 bg-gfg-green"></div>
                <h3 className="text-gfg-green text-xs font-bold tracking-widest uppercase font-display">Measured against you</h3>
              </div>
              <h4 className="text-xl font-black text-white uppercase font-display mb-2 tracking-tight">Your own curve, not the world&apos;s.</h4>
              <p className="text-[15px] leading-relaxed text-gray-400">
                Each stat is weighed against the rest of your profile, so a high one marks where you stand out 
                and a low one where you don&apos;t. That&apos;s why your weakest area can read lower than the raw number 
                suggests — the card grades you on you.
              </p>
            </div>

            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="h-[2px] w-6 bg-gfg-green"></div>
                <h3 className="text-gfg-green text-xs font-bold tracking-widest uppercase font-display">Every card has a shape</h3>
              </div>
              <h4 className="text-xl font-black text-white uppercase font-display mb-2 tracking-tight">Nobody&apos;s elite at everything.</h4>
              <p className="text-[15px] leading-relaxed text-gray-400">
                Your strongest signals get pushed up and your weakest pulled down, so the card leans instead 
                of sitting flat. That lean is what decides your position and archetype — read off your stats, never picked.
              </p>
            </div>

            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="h-[2px] w-6 bg-gfg-green"></div>
                <h3 className="text-gfg-green text-xs font-bold tracking-widest uppercase font-display">Rating & Position</h3>
              </div>
              <h4 className="text-xl font-black text-white uppercase font-display mb-2 tracking-tight">Calculated, not guessed.</h4>
              <p className="text-[15px] leading-relaxed text-gray-400">
                Your <strong className="text-white font-medium">OVR</strong> is heavily driven by your Coding Score, consistency, and problem-solving tenacity. 
                Your <strong className="text-white font-medium">Position</strong> (e.g. ST, CAM, CB) is algorithmically assigned by matching your highest-performing attributes against standard football archetypes.
              </p>
            </div>
          </div>

          <hr className="border-white/10 my-10" />

          {/* WHAT FEEDS THE SIX */}
          <div className="mb-10">
            <h3 className="text-gray-400 text-xs font-bold tracking-[0.2em] uppercase font-display mb-6">What Feeds the Six</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
              <div className="flex items-start gap-4">
                <div className="bg-white/5 text-gfg-green font-display font-black tracking-wider px-3 py-1.5 rounded text-sm w-14 text-center shrink-0">PAC</div>
                <p className="text-sm text-gray-400 leading-relaxed">Pace measures your problem-solving consistency, active days, and maximum streak.</p>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-white/5 text-gfg-green font-display font-black tracking-wider px-3 py-1.5 rounded text-sm w-14 text-center shrink-0">SHO</div>
                <p className="text-sm text-gray-400 leading-relaxed">Shooting represents your overall Coding Score and the total volume of problems solved.</p>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-white/5 text-gfg-green font-display font-black tracking-wider px-3 py-1.5 rounded text-sm w-14 text-center shrink-0">PAS</div>
                <p className="text-sm text-gray-400 leading-relaxed">Passing looks at your institute rank, community standing, and medium problem ratio.</p>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-white/5 text-gfg-green font-display font-black tracking-wider px-3 py-1.5 rounded text-sm w-14 text-center shrink-0">DRI</div>
                <p className="text-sm text-gray-400 leading-relaxed">Dribbling focuses on your language versatility and your ability to tackle hard problems.</p>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-white/5 text-gfg-green font-display font-black tracking-wider px-3 py-1.5 rounded text-sm w-14 text-center shrink-0">DEF</div>
                <p className="text-sm text-gray-400 leading-relaxed">Defending highlights your accuracy, efficiency, and avoidance of just farming easy problems.</p>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-white/5 text-gfg-green font-display font-black tracking-wider px-3 py-1.5 rounded text-sm w-14 text-center shrink-0">PHY</div>
                <p className="text-sm text-gray-400 leading-relaxed">Physicality is your long-term dedication and stamina over your active years on the platform.</p>
              </div>
            </div>
          </div>

          <hr className="border-white/10 my-10" />

          {/* THE LADDER */}
          <div>
            <h3 className="text-gray-400 text-xs font-bold tracking-[0.2em] uppercase font-display mb-6">The Ladder</h3>
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <span className="bg-[#4a331c] text-[#e0b589] font-display font-black uppercase tracking-wider px-4 py-1.5 rounded text-sm shadow-inner shadow-black/50">Bronze</span>
              <span className="text-gray-600 text-sm">→</span>
              <span className="bg-[#2c3035] text-[#b0b9c2] font-display font-black uppercase tracking-wider px-4 py-1.5 rounded text-sm shadow-inner shadow-black/50">Silver</span>
              <span className="text-gray-600 text-sm">→</span>
              <span className="bg-[#59440f] text-[#f4d171] font-display font-black uppercase tracking-wider px-4 py-1.5 rounded text-sm shadow-inner shadow-black/50">Gold</span>
              <span className="text-gray-600 text-sm">→</span>
              <span className="bg-[#6b1c23] text-[#f3b5bc] font-display font-black uppercase tracking-wider px-4 py-1.5 rounded text-sm shadow-inner shadow-black/50">In-Form</span>
              <span className="text-gray-600 text-sm">→</span>
              <span className="bg-[#1a365d] text-[#93c5fd] font-display font-black uppercase tracking-wider px-4 py-1.5 rounded text-sm shadow-inner shadow-black/50">TOTY</span>
              <span className="text-gray-600 text-sm">→</span>
              <span className="bg-[#2e1f49] text-[#d8b4fe] font-display font-black uppercase tracking-wider px-4 py-1.5 rounded text-sm shadow-inner shadow-black/50">Icon</span>
            </div>
            <p className="text-[15px] leading-relaxed text-gray-400 max-w-2xl">
              Read live from your public GeeksforGeeks profile. No inputs, no edits — just the tape.
            </p>
          </div>

        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
