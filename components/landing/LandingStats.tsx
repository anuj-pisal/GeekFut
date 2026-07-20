import prisma from '@/lib/db';

export async function CardsScoutedCount() {
  try {
    const count = await prisma.player.count();
    return <span className="text-white font-bold">{count}</span>;
  } catch (e) {
    return <span className="text-white font-bold">0</span>;
  }
}

export async function ActivityGraph() {
  try {
    const count = await prisma.player.count();
    
    return (
      <div className="flex flex-col items-start opacity-80 hover:opacity-100 transition-all duration-500 group cursor-default">
        {/* Sleek Neon Sparkline SVG */}
        <div className="relative w-52 h-10 mb-2">
          <svg viewBox="0 0 200 40" className="w-full h-full overflow-visible">
            <defs>
              <linearGradient id="neonGlow" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#00FF66" stopOpacity="0.1" />
                <stop offset="60%" stopColor="#00FF66" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#00FF66" stopOpacity="1" />
              </linearGradient>
              <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            {/* The line */}
            <path 
              d="M 0 35 L 90 35 C 130 35 150 10 190 5" 
              fill="none" 
              stroke="url(#neonGlow)" 
              strokeWidth="2.5" 
              strokeLinecap="round"
              filter="url(#glow)"
              className="group-hover:stroke-[3px] transition-all duration-500"
            />
            {/* The dot at the end */}
            <circle cx="190" cy="5" r="4" fill="#00FF66" className="animate-pulse" filter="url(#glow)" />
          </svg>
        </div>
        <div className="text-xs font-body text-gray-400 uppercase tracking-[0.15em] flex items-center gap-3">
          <span className="text-[#00FF66] font-bold text-base tracking-normal drop-shadow-[0_0_8px_rgba(0,255,102,0.6)]">
            {count}
          </span> 
          <span className="group-hover:text-gray-300 transition-colors duration-300">
            users scouted <span className="opacity-40 font-light mx-1">/</span> last 30 days
          </span>
        </div>
      </div>
    );
  } catch (e) {
    return null;
  }
}
