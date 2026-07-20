import { CardModel } from '@/lib/providers/types';

interface Props {
  model: CardModel;
}

function StarRating({ stars }: { stars: number }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map(i => (
        <svg 
          key={i} 
          className={`w-4 h-4 ${i <= stars ? 'text-[#eaddb9] fill-current' : 'text-gray-700'}`} 
          viewBox="0 0 24 24"
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      ))}
    </div>
  );
}

export function PlayerAttributesPanel({ model }: Props) {
  const { ovr, attributes } = model;
  
  // Fake calculation for attributes based on stats
  const skillMoves = ovr >= 90 ? 5 : ovr >= 80 ? 4 : 3;
  const weakFoot = ovr >= 85 ? 5 : ovr >= 75 ? 4 : 3;
  
  let style = 'BALANCED';
  if (attributes.pace > 85 && attributes.dribbling > 85) style = 'EXPLOSIVE';
  else if (attributes.passing > 85) style = 'MEASURED';
  else if (attributes.physical > 85) style = 'POWERHOUSE';

  const playstyles = [];
  if (attributes.pace > 80) playstyles.push({ icon: '⚡', name: 'Rapid' });
  if (attributes.shooting > 80) playstyles.push({ icon: '🎯', name: 'Dead Ball' });
  if (attributes.passing > 80) playstyles.push({ icon: '📐', name: 'Incisive Pass' });
  if (attributes.dribbling > 80) playstyles.push({ icon: '🪄', name: 'Technical' });
  if (attributes.defending > 80) playstyles.push({ icon: '🛡️', name: 'Anticipate' });
  if (attributes.physical > 80) playstyles.push({ icon: '💪', name: 'Bruiser' });
  
  if (playstyles.length === 0) playstyles.push({ icon: '🏃', name: 'Relentless' });
  
  // Highlight the top playstyle
  if (playstyles.length > 0) playstyles[0].name += ' +';

  return (
    <div className="flex flex-col gap-8 w-full max-w-sm font-body animate-fade-in-up">
      {/* ATTRIBUTES */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <div className="h-px w-6 bg-[#eaddb9]"></div>
          <h3 className="text-[#eaddb9] text-xs font-bold tracking-widest uppercase font-display">Attributes</h3>
        </div>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center py-2 border-b border-white/5">
            <span className="text-gray-400">Skill moves</span>
            <StarRating stars={skillMoves} />
          </div>
          <div className="flex justify-between items-center py-2 border-b border-white/5">
            <span className="text-gray-400">Weak foot</span>
            <StarRating stars={weakFoot} />
          </div>
          <div className="flex justify-between items-center py-2 border-b border-white/5">
            <span className="text-gray-400">Work rate</span>
            <span className="text-white font-bold uppercase text-sm">High / High</span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-gray-400">Style</span>
            <span className="text-white font-bold uppercase text-sm">{style}</span>
          </div>
        </div>
      </div>

      {/* PLAYSTYLES */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <div className="h-px w-6 bg-[#eaddb9]"></div>
          <h3 className="text-[#eaddb9] text-xs font-bold tracking-widest uppercase font-display">Playstyles</h3>
        </div>
        
        <div className="space-y-3">
          {playstyles.map((ps, i) => (
            <div key={ps.name} className="flex items-center gap-3 py-1">
              <span className={`flex items-center justify-center w-6 h-6 rounded-md ${i === 0 ? 'bg-[#eaddb9] text-black' : 'bg-white/5 text-gray-300'}`}>
                {ps.icon}
              </span>
              <span className={`${i === 0 ? 'text-[#eaddb9] font-bold' : 'text-gray-300'} text-sm`}>
                {ps.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
