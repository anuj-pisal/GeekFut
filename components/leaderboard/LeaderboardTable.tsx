'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Player } from '@prisma/client';

export function LeaderboardTable({ players }: { players: Player[] }) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const totalPages = Math.ceil(players.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentPlayers = players.slice(startIndex, startIndex + itemsPerPage);

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <div className="w-full bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden shadow-2xl flex flex-col">
      <div className="overflow-x-auto">
        <table className="w-full text-left font-body border-collapse">
          <thead>
            <tr className="bg-white/5 border-b border-white/10 text-gray-400 text-xs uppercase tracking-wider">
              <th className="py-4 px-6 font-semibold text-center w-24">Rank</th>
              <th className="py-4 px-6 font-semibold text-left">Player</th>
              <th className="py-4 px-6 font-semibold text-center w-32">Tier</th>
              <th className="py-4 px-6 font-semibold text-center w-40">Coding Score</th>
              <th className="py-4 px-6 font-semibold text-center w-24">OVR</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {currentPlayers.map((player, index) => {
              const rank = startIndex + index + 1;
              let rankColor = 'text-gray-400';
              if (rank === 1) rankColor = 'text-yellow-400 font-bold drop-shadow-[0_0_8px_rgba(250,204,21,0.6)]';
              else if (rank === 2) rankColor = 'text-gray-300 font-bold drop-shadow-[0_0_8px_rgba(209,213,219,0.5)]';
              else if (rank === 3) rankColor = 'text-amber-600 font-bold drop-shadow-[0_0_8px_rgba(217,119,6,0.6)]';

              return (
                <tr 
                  key={player.username} 
                  className="hover:bg-white/5 transition-colors duration-150 group"
                >
                  <td className={`py-4 px-6 ${rankColor} font-display text-xl text-center`}>
                    #{rank}
                  </td>
                  <td className="py-4 px-6 text-left">
                    <Link href={`/player/${player.username}`} className="flex items-center gap-4 group-hover:opacity-80 transition-opacity w-max">
                      <img 
                        src={player.profilePicture || 'https://media.geeksforgeeks.org/img-practice/user_web-1598433228.svg'} 
                        alt={player.displayName}
                        className="w-10 h-10 rounded-full border border-white/20 shadow-sm object-cover bg-white/5"
                      />
                      <div>
                        <div className="text-white font-bold text-base truncate max-w-[150px] sm:max-w-[200px]">
                          {player.displayName}
                        </div>
                        <div className="text-gfg-green text-xs truncate max-w-[150px] sm:max-w-[200px]">
                          @{player.username}
                        </div>
                      </div>
                    </Link>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <span className="px-3 py-1 rounded-full bg-white/10 border border-white/5 text-xs text-gray-300 font-semibold uppercase tracking-wider inline-block">
                      {player.tier}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-center text-gray-300 font-medium">
                    {player.codingScore.toLocaleString()}
                  </td>
                  <td className="py-4 px-6 text-center">
                    <span className="text-xl font-display font-bold text-white">
                      {player.ovr}
                    </span>
                  </td>
                </tr>
              );
            })}
            
            {players.length === 0 && (
              <tr>
                <td colSpan={5} className="py-12 text-center text-gray-500 font-body">
                  No players scouted yet. Be the first!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="w-full flex items-center justify-between px-6 py-4 border-t border-white/10 bg-white/5">
          <button 
            onClick={handlePrev}
            disabled={currentPage === 1}
            className="px-4 py-2 rounded-full text-sm font-body font-medium transition-colors bg-white/10 hover:bg-white/20 text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          
          <span className="text-gray-400 font-body text-sm">
            Page <span className="text-white font-semibold">{currentPage}</span> of {totalPages}
          </span>
          
          <button 
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className="px-4 py-2 rounded-full text-sm font-body font-medium transition-colors bg-white/10 hover:bg-white/20 text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
