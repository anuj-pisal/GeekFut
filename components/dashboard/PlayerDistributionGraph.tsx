"use client";

import React, { useEffect, useState } from 'react';

interface Props {
  username: string;
  ovr: number;
}

export function PlayerDistributionGraph({ username, ovr }: Props) {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  // Generate a mock right-skewed distribution curve for 50 bars (representing ratings 50 to 99)
  // We use a fixed seed-like approach so the graph looks identical every render instead of jumping
  const bars = Array.from({ length: 50 }, (_, i) => {
    // Exponential decay curve
    const height = Math.max(2, Math.floor(95 * Math.exp(-i * 0.1)));
    // Add some pseudo-random noise based on index
    const noise = (Math.sin(i * 12.9898) * 43758.5453) % 1;
    return height + (noise * 8);
  });

  // Clamp ovr to [50, 99] and calculate index
  const clampedOvr = Math.max(50, Math.min(99, ovr));
  const activeIndex = clampedOvr - 50;

  // Calculate mock percentile
  const getTopPercentile = (rating: number) => {
    if (rating >= 99) return "0.01";
    if (rating >= 95) return "0.12";
    if (rating >= 90) return "1.45";
    if (rating >= 80) return "7.30";
    if (rating >= 70) return "22.8";
    if (rating >= 60) return "54.2";
    return "89.0";
  };
  
  const topPercent = getTopPercentile(clampedOvr);

  return (
    <div className="w-full mt-16 bg-black/30 border border-white/5 rounded-3xl p-6 lg:p-10 animate-fade-in-up font-body">
      <div className="flex items-center gap-3 mb-10">
        <div className="h-px w-6 bg-[#00FF66]"></div>
        <h3 className="text-white font-display uppercase tracking-widest text-sm font-bold opacity-90">DISTRIBUTION</h3>
      </div>
      
      <div className="relative w-full h-48 lg:h-56 mt-16 max-w-4xl mx-auto">
        {/* Bars Container */}
        <div className="absolute inset-0 flex items-end justify-between pb-[1px]">
          {bars.map((height, i) => (
            <div 
              key={i} 
              className={`flex-1 mx-[1px] md:mx-[2px] rounded-t-sm transition-all duration-1000 ease-out ${
                i === activeIndex 
                  ? 'bg-[#00FF66] shadow-[0_0_12px_#00FF66] z-10' 
                  : 'bg-[#00FF66] opacity-[0.15] hover:opacity-40'
              }`}
              style={{ height: mounted ? `${height}%` : '0%', transitionDelay: `${i * 10}ms` }}
            />
          ))}
        </div>

        {/* Horizontal Baseline */}
        <div className="absolute bottom-0 left-0 w-full border-b border-dashed border-[#00FF66]/30" />

        {/* X Axis Labels */}
        <div className="absolute -bottom-7 left-0 w-full flex justify-between text-gray-500 text-[10px] md:text-xs font-semibold tracking-wider px-1">
          <span>50</span>
          <span>60</span>
          <span>70</span>
          <span>80</span>
          <span>90</span>
          <span>100</span>
        </div>

        {/* Active Marker */}
        <div 
          className="absolute bottom-0 flex flex-col items-center pointer-events-none transition-all duration-[1.5s] ease-out"
          style={{ 
            left: `calc(${(activeIndex / 49) * 100}%)`, 
            height: '140%',
            transform: 'translateX(-50%)',
            opacity: mounted ? 1 : 0
          }}
        >
          {/* Text Label */}
          <div className="text-[#00FF66] text-xs md:text-sm font-bold whitespace-nowrap mb-2 drop-shadow-[0_0_8px_rgba(0,255,102,0.8)] tracking-wide">
            {username} • {clampedOvr}
          </div>
          
          {/* Dashed vertical line */}
          <div className="flex-grow border-l-2 border-dashed border-[#00FF66] w-0 relative drop-shadow-[0_0_4px_#00FF66]"></div>
          
          {/* Dot on baseline */}
          <div className="w-3 h-3 rounded-full bg-[#00FF66] shadow-[0_0_12px_#00FF66] translate-y-[6px] z-10" />
        </div>
      </div>

      {/* Footer text */}
      <div className="mt-16 flex items-center justify-center gap-2 text-xs md:text-sm text-gray-400 tracking-wide">
        <span className="text-[#00FF66] font-bold drop-shadow-[0_0_5px_rgba(0,255,102,0.4)]">TOP {topPercent}%</span> of GeeksforGeeks 
        <span className="mx-2 opacity-30">|</span> 
        <span className="text-[#00FF66] font-bold drop-shadow-[0_0_5px_rgba(0,255,102,0.4)]">TOP {(parseFloat(topPercent) * 2.1).toFixed(2)}%</span> of active solvers
      </div>
    </div>
  );
}
