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
      className="mt-12 px-8 py-3 bg-gfg-green text-white font-display uppercase tracking-widest hover:bg-gfg-green-dark transition-all shadow-lg hover:shadow-gfg-green/50 hover:-translate-y-1 disabled:opacity-50 disabled:hover:translate-y-0 rounded"
    >
      {downloading ? 'Rendering...' : 'Download PNG'}
    </button>
  );
}
