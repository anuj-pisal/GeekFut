interface Props {
  displayName: string;
  username: string;
  ovr: number;
  tier: string;
  position: string;
  codingScore: number;
}

export function PlayerHeader({ displayName, username, ovr, tier, position, codingScore }: Props) {
  let tierColor = 'text-[#3b3117]';
  let tierBg = 'bg-gradient-to-br from-[#c89938] to-[#9a762b]';
  let tierLabel = 'BRONZE';

  if (tier === 'icon') {
    tierColor = 'text-[#111]';
    tierBg = 'bg-gradient-to-br from-[#eaddb9] to-[#c6b48f]';
    tierLabel = 'ICON';
  } else if (tier === 'gold') {
    tierColor = 'text-[#3b3117]';
    tierBg = 'bg-gradient-to-br from-[#f1d06e] to-[#d6ab32]';
    tierLabel = 'GOLD';
  } else if (tier === 'silver') {
    tierColor = 'text-[#1a1f22]';
    tierBg = 'bg-gradient-to-br from-[#e0e3e5] to-[#99a1a6]';
    tierLabel = 'SILVER';
  }

  let titleText = 'Dedicated Problem Solver';
  if (ovr >= 90) titleText = 'Generational Talent';
  else if (ovr >= 85) titleText = 'World Class Developer';
  else if (ovr >= 80) titleText = 'Elite Programmer';
  
  return (
    <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6 mb-8 animate-fade-in-up">
      {/* OVR Box */}
      <div className={`flex flex-col items-center justify-center w-24 h-28 rounded-2xl ${tierBg} shadow-2xl relative overflow-hidden group`}>
        <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity"></div>
        <span className={`text-5xl font-display font-black leading-none ${tierColor} drop-shadow-md`}>{ovr}</span>
        <span className={`text-xs font-display font-bold tracking-widest mt-1 ${tierColor} opacity-80 uppercase`}>{tierLabel}</span>
      </div>

      {/* Name and Info */}
      <div className="flex flex-col items-center sm:items-start flex-1 min-w-0">
        <h1 className="text-5xl md:text-6xl font-display font-black text-white uppercase tracking-tight leading-none mb-3 break-words text-center sm:text-left">
          {displayName}
        </h1>
        
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mb-3 text-sm font-body">
          <span className="px-2 py-1 bg-white/10 rounded border border-white/20 text-[#eaddb9] font-display font-bold">{position}</span>
          <span className="text-gray-300 capitalize">{titleText}</span>
          <span className="text-gray-500">@{username}</span>
          <span className="flex items-center gap-1 text-gfg-green font-medium">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 7l10 5 10-5-10-5zm0 7.5l-10-5v9.5l10 5 10-5v-9.5l-10 5z"/></svg>
            Score: {codingScore >= 1000 ? (codingScore/1000).toFixed(1)+'k' : codingScore}
          </span>
        </div>

        <p className="text-gray-400 font-body text-sm max-w-xl text-center sm:text-left leading-relaxed">
          <span className="text-[#eaddb9] font-bold uppercase tracking-wider text-xs mr-2">Scout Report</span>
          A highly adaptable developer showing distinct prowess across {position} attributes. Evaluated against GeeksforGeeks global standards based on problem-solving consistency and output.
        </p>
      </div>
    </div>
  );
}
