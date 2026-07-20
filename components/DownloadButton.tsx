"use client";

import { useState } from 'react';
import { toPng } from 'html-to-image';

export function DownloadButton() {
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    const cardElement = document.getElementById('player-card');
    if (!cardElement) return;

    setDownloading(true);
    try {
      // html-to-image generally handles complex CSS much better
      const dataUrl = await toPng(cardElement, {
        cacheBust: true,
        quality: 1,
        pixelRatio: 2, // High resolution
        skipFonts: false, // Ensure custom fonts load
      });
      const link = document.createElement('a');
      link.download = 'gfg-fut-card.png';
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
    <button
      onClick={handleDownload}
      disabled={downloading}
      className="w-full py-4 bg-gfg-green text-white font-display font-bold uppercase tracking-widest hover:bg-gfg-green-dark transition-all disabled:opacity-50 rounded-b-2xl shadow-[0_0_15px_rgba(46,204,113,0.2)]"
    >
      {downloading ? 'Rendering...' : 'Download PNG'}
    </button>
  );
}
