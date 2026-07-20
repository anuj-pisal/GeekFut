interface Props {
  raw: {
    codingScore: number;
    totalProblemsSolved: number;
    currentStreak: number;
    maxStreak: number;
    instituteRank?: string | number;
    institution?: string | null;
  };
}

export function PlayerStatsPanel({ raw }: Props) {
  
  // A helper to render a metric row with a horizontal bar
  const MetricRow = ({ label, value, subtext, max }: { label: string, value: number, subtext: string, max: number }) => {
    const percentage = Math.min(100, Math.max(0, (value / max) * 100));
    return (
      <div className="py-3 border-b border-white/5 group hover:bg-white/[0.02] transition-colors -mx-4 px-4 rounded-lg">
        <div className="flex justify-between items-end mb-2">
          <span className="text-gray-400 text-sm">{label}</span>
          <div className="flex items-baseline gap-2">
            <span className="text-gray-500 text-xs">{subtext}</span>
            <span className="text-white font-display font-bold text-lg">{value.toLocaleString()}</span>
          </div>
        </div>
        <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
          <div 
            className="h-full bg-[#eaddb9] rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_#eaddb9]" 
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-8 w-full max-w-sm font-body animate-fade-in-up">
      <div>
        <div className="flex items-center gap-3 mb-6">
          <div className="h-px w-6 bg-[#eaddb9]"></div>
          <h3 className="text-[#eaddb9] text-xs font-bold tracking-widest uppercase font-display">Scouting Metrics</h3>
        </div>
        
        <div className="space-y-1">
          <MetricRow 
            label="Problems Solved" 
            value={raw.totalProblemsSolved} 
            subtext="total" 
            max={2000} // assumed upper bound for full bar
          />
          <MetricRow 
            label="Coding Score" 
            value={raw.codingScore} 
            subtext="points" 
            max={5000}
          />
          <MetricRow 
            label="Best Streak" 
            value={raw.maxStreak} 
            subtext="days" 
            max={365}
          />
          <MetricRow 
            label="Current Streak" 
            value={raw.currentStreak} 
            subtext="days" 
            max={100}
          />
          
          {raw.instituteRank && (
            <div className="py-4 border-b border-white/5">
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-sm">Club Rank</span>
                <span className="text-white font-display font-bold text-lg">#{raw.instituteRank}</span>
              </div>
            </div>
          )}

          {raw.institution && (
            <div className="py-4 border-b border-white/5">
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-sm">Club</span>
                <span className="text-white font-display font-bold text-lg truncate max-w-[200px] text-right" title={raw.institution}>{raw.institution}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
