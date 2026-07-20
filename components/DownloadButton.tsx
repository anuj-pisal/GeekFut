"use client";

import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { toPng } from 'html-to-image';
import { PlayerCard } from '@/components/PlayerCard';

interface DownloadButtonProps {
  model?: any;
  displayName?: string;
  institution?: string | null;
  profilePicture?: string | null;
  codingScore?: number;
}

export function DownloadButton({ model, displayName, institution, profilePicture, codingScore }: DownloadButtonProps) {
  const [downloading, setDownloading] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDownloadCard = async () => {
    setDropdownOpen(false);
    const cardElement = document.getElementById('player-card');
    if (!cardElement) return;

    setDownloading(true);
    try {
      const dataUrl = await toPng(cardElement, {
        cacheBust: true,
        quality: 1,
        pixelRatio: 2,
        skipFonts: false,
      });
      const link = document.createElement('a');
      link.download = `geekfut-${displayName}-card.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error('Failed to generate image', error);
      alert('Failed to generate image. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  const handleDownloadStory = async () => {
    setDropdownOpen(false);
    const storyElement = document.getElementById('story-format-container');
    if (!storyElement) return;

    setDownloading(true);
    try {
      const dataUrl = await toPng(storyElement, {
        cacheBust: true,
        quality: 1,
        pixelRatio: 2,
        skipFonts: false,
      });
      const link = document.createElement('a');
      link.download = `geekfut-${displayName}-story.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error('Failed to generate image', error);
      alert('Failed to generate image. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="relative w-full" ref={menuRef}>
      
      {/* Hidden Story Container for html-to-image */}
      {mounted && model && createPortal(
        <div 
          id="story-format-container" 
          className="fixed top-0 -left-[9999px] w-[540px] h-[960px] flex flex-col items-center justify-between pointer-events-none bg-[#0a0f0d] overflow-hidden py-16"
          style={{
             backgroundImage: 'radial-gradient(circle at center, rgba(46,204,113,0.15) 0%, #0a0f0d 60%)'
          }}
        >
          {/* Top Text */}
          <div className="flex flex-col items-center text-center z-10 pt-4">
            <h1 className="text-5xl font-display font-bold uppercase tracking-tight">
               <span className="text-white">Geek</span>
               <span className="text-transparent bg-clip-text bg-gradient-to-br from-gfg-green to-emerald-400">Fut</span>
            </h1>
            <p className="text-gray-400 font-body text-xs tracking-[0.3em] uppercase mt-4 font-medium">
               Your GeeksforGeeks, Scouted
            </p>
          </div>

          {/* The Card */}
          <div className="z-10 scale-110">
            <PlayerCard 
               model={model} 
               displayName={displayName!} 
               institution={institution}
               profilePicture={profilePicture!}
               codingScore={codingScore!}
            />
          </div>

          {/* Bottom Text */}
          <div className="flex flex-col items-center text-center z-10 pb-4">
            <h2 className="text-[#F39C12] font-display text-4xl font-bold uppercase tracking-wider mb-8 drop-shadow-[0_0_10px_rgba(243,156,18,0.3)]">
              {model.tier}
            </h2>
            <div className="text-[#F39C12] font-body text-sm uppercase tracking-widest font-semibold flex items-center gap-3">
              Try your card on geekfut.vercel.app <span className="text-xl">→</span>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Dropdown Menu */}
      {dropdownOpen && (
        <div className="absolute top-full mt-2 left-0 right-0 bg-[#16201a] border border-gfg-green/30 rounded-xl overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.5)] z-50 animate-fade-in-up origin-top">
          <button 
            onClick={handleDownloadCard} 
            className="w-full px-6 py-4 text-left text-sm text-gray-200 font-body hover:bg-white/5 transition-colors flex items-center gap-4 border-b border-white/5"
          >
            <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Card Format
          </button>
          <button 
            onClick={handleDownloadStory} 
            className="w-full px-6 py-4 text-left text-sm text-gray-200 font-body hover:bg-white/5 transition-colors flex items-center gap-4"
          >
            <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Story Format
          </button>
        </div>
      )}

      {/* Main Download Button */}
      <button
        onClick={() => setDropdownOpen(!dropdownOpen)}
        disabled={downloading}
        className="w-full py-4 bg-transparent border border-white/10 text-white font-display font-bold uppercase tracking-widest hover:bg-white/5 transition-all disabled:opacity-50 rounded-b-2xl flex items-center justify-center gap-3 relative"
      >
        <svg className="w-5 h-5 text-gfg-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
        {downloading ? 'Rendering...' : 'Download'}
        
        {/* Right Arrow */}
        <div className="absolute right-4 border-l border-white/10 pl-4">
          <svg className={`w-5 h-5 text-gray-400 transform transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </svg>
        </div>
      </button>
      
    </div>
  );
}
