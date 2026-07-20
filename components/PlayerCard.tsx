"use client";
import { useState, CSSProperties } from 'react';
import { CardModel } from '@/lib/providers/types';

interface Props {
  model: CardModel;
  displayName: string;
  institution: string | null;
  profilePicture: string | null;
  codingScore: number;
}

const STATS_TOP = 66.3;
const ROW_GAP = 8;

const AVATAR_FALLBACK =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="320" height="320"><rect width="320" height="320" fill="%23000" fill-opacity="0"/><circle cx="160" cy="128" r="62" fill="%23ffffff" fill-opacity="0.18"/><rect x="58" y="206" width="204" height="150" rx="80" fill="%23ffffff" fill-opacity="0.18"/></svg>',
  );

const AVATAR_MASK_FEATHER = "radial-gradient(ellipse 66% 88% at 52% 40%, #000 56%, transparent 80%)";
const AVATAR_MASK_BOTTOM_FADE = "linear-gradient(220deg, #000 70%, transparent 100%)";
const AVATAR_MASK_TOP_FADE = "linear-gradient(180deg, transparent 1%, #000 22%)";

const pad2 = (n: number) => String(Math.round(n)).padStart(2, "0");

// [left%, top%, width%] — recalculated with more clearance from the text above them
const H_LINES: [number, number, number][] = [
  [16.67, 64, 66.67],   // under name (was 63 — was clipping the name's descenders)
  [44.44, 91, 11.11],   // under stats
];

export function PlayerCard({ model, displayName, institution, profilePicture, codingScore }: Props) {
  const { ovr, tier, attributes } = model;
  const [imgError, setImgError] = useState(false);

  let bg = '/cards/bronze.png';
  let ink = '#3b3117';
  let avatarHalo = 'rgba(0,0,0,0)';
  
  if (tier === 'icon') { bg = '/cards/legend.png'; ink = '#111111'; avatarHalo = 'rgba(234, 221, 185, 0.2)'; }
  else if (tier === 'gold') { bg = '/cards/gold.png'; ink = '#3b3117'; }
  else if (tier === 'silver') { bg = '/cards/silver.png'; ink = '#1a1f22'; }
  else if (tier === 'bronze') { bg = '/cards/bronze.png'; ink = '#3b3117'; }

  const getPos = () => {
    const { pace, shooting, passing, dribbling, defending, physical } = attributes;
    
    const stScore = shooting * 0.6 + physical * 0.2 + pace * 0.2;
    const wingScore = pace * 0.6 + dribbling * 0.3 + passing * 0.1;
    const camScore = passing * 0.5 + dribbling * 0.4 + shooting * 0.1;
    const cdmScore = defending * 0.5 + physical * 0.4 + passing * 0.1;
    const cbScore = defending * 0.6 + physical * 0.4;
    const fbScore = pace * 0.4 + defending * 0.4 + physical * 0.2;
    
    const maxScore = Math.max(stScore, wingScore, camScore, cdmScore, cbScore, fbScore);
    
    if (maxScore === stScore) return 'ST';
    if (maxScore === wingScore) return pace > 88 ? 'LW' : 'RW';
    if (maxScore === camScore) return 'CAM';
    if (maxScore === cdmScore) return 'CDM';
    if (maxScore === cbScore) return 'CB';
    if (maxScore === fbScore) return pace > 85 ? 'LB' : 'RB';
    return 'CM';
  };

  const wrap: CSSProperties = {
    containerType: "inline-size",
    position: "relative",
    width: "320px",
    aspectRatio: "540 / 820",
    filter: `drop-shadow(0 20px 25px rgba(0,0,0,.5))`,
    userSelect: "none",
  };

  const at = (left: number, top: number): CSSProperties => ({
    position: "absolute",
    left: `${left}%`,
    top: `${top}%`,
  });

  return (
    <div id="player-card" className="font-display bg-transparent" style={wrap}>
      {/* Background PNG */}
      <img src={bg} alt="" aria-hidden style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "fill" }} />
      
      {/* Avatar Masking Container */}
      <div style={{ position: "absolute", inset: 0, WebkitMaskImage: `url("${bg}")`, maskImage: `url("${bg}")`, WebkitMaskSize: "100% 100%", maskSize: "100% 100%" }}>
        <div style={{ position: "absolute", left: "27cqw", top: "13cqw", width: "68cqw", height: "70cqw", WebkitMaskImage: AVATAR_MASK_FEATHER, maskImage: AVATAR_MASK_FEATHER }}>
          <div style={{ width: "100%", height: "100%", WebkitMaskImage: AVATAR_MASK_BOTTOM_FADE, maskImage: AVATAR_MASK_BOTTOM_FADE }}>
            <div style={{ position: "relative", width: "100%", height: "100%", WebkitMaskImage: AVATAR_MASK_TOP_FADE, maskImage: AVATAR_MASK_TOP_FADE, filter: `drop-shadow(0 3cqw 6cqw rgba(0,0,0,.5)) drop-shadow(0 0 5cqw ${avatarHalo})` }}>
              <img
                src={!imgError && profilePicture ? `/api/image-proxy?url=${encodeURIComponent(profilePicture)}` : AVATAR_FALLBACK}
                onError={(e) => {
                  console.error('Image failed to load in PlayerCard');
                  setImgError(true);
                }}
                alt={displayName}
                crossOrigin="anonymous"
                style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 20%" }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Lines */}
      {H_LINES.map(([l, top, w], i) => (
        <div key={i} style={{ ...at(l, top), width: `${w}%`, height: "0.4cqw", background: ink, opacity: 0.5 }} />
      ))}
      <div style={{ ...at(50, 66), width: "0.4cqw", height: "24%", background: ink, opacity: 0.5 }} />

      {/* OVR */}
      <div style={{ ...at(16.3, 11), fontSize: "18cqw", fontWeight: 700, lineHeight: 1, color: ink }}>
        {pad2(ovr)}
      </div>

      {/* POS */}
      <div style={{ ...at(25, 24), transform: "translateX(-50%)", fontSize: "8cqw", fontWeight: 700, lineHeight: 1, letterSpacing: ".02em", color: ink }}>
        {getPos()}
      </div>

      {/* Flag */}
      <img src={`/badges/flags/in.png`} alt="India" style={{ ...at(17.59, 32), width: "14.81%", height: "5.73%", objectFit: "contain" }} crossOrigin="anonymous" />
      
      {/* Coding Score Badge */}
      <div style={{ ...at(15, 39), width: "20%", height: "13%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <div style={{ fontSize: "3.5cqw", fontWeight: 700, lineHeight: 1, letterSpacing: ".1em", color: ink, opacity: 0.7, textTransform: "uppercase", marginBottom: "0.5cqw" }}>
          SCORE
        </div>
        <div style={{ fontSize: "7.5cqw", fontWeight: 900, lineHeight: 1, color: ink, filter: `drop-shadow(0 0 1cqw rgba(255,255,255,0.8))` }}>
          {codingScore >= 1000 ? (codingScore / 1000).toFixed(1) + 'k' : codingScore}
        </div>
      </div>

      {/* Name */}
      <div style={{ ...at(50, 55), transform: "translateX(-50%)", fontSize: "11cqw", fontWeight: 700, lineHeight: 1, whiteSpace: "nowrap", color: ink }}>
        {displayName.split(' ').pop()?.toUpperCase()}
      </div>

      {/* Stats */}

    {/* Left Column */}
    <div style={{ ...at(17, STATS_TOP), fontSize: "8.5cqw", fontWeight: 700, lineHeight: 1, color: ink }}>
      {pad2(attributes.pace)}
    </div>
    <div style={{ ...at(31, STATS_TOP + 0.5), fontSize: "7.5cqw", fontWeight: 500, lineHeight: 1, letterSpacing: ".02em", color: ink }}>
      PAC
    </div>

    <div style={{ ...at(17, STATS_TOP + ROW_GAP), fontSize: "8.5cqw", fontWeight: 700, lineHeight: 1, color: ink }}>
      {pad2(attributes.shooting)}
    </div>
    <div style={{ ...at(31, STATS_TOP + ROW_GAP + 0.5), fontSize: "7.5cqw", fontWeight: 500, lineHeight: 1, letterSpacing: ".02em", color: ink }}>
      SHO
    </div>

    <div style={{ ...at(17, STATS_TOP + ROW_GAP * 2), fontSize: "8.5cqw", fontWeight: 700, lineHeight: 1, color: ink }}>
      {pad2(attributes.passing)}
    </div>
    <div style={{ ...at(31, STATS_TOP + ROW_GAP * 2 + 0.5), fontSize: "7.5cqw", fontWeight: 500, lineHeight: 1, letterSpacing: ".02em", color: ink }}>
      PAS
    </div>

    {/* Right Column: DRI, DEF, PHY */}
    <div style={{ ...at(56, STATS_TOP), fontSize: "8.5cqw", fontWeight: 700, lineHeight: 1, color: ink }}>
      {pad2(attributes.dribbling)}
    </div>
    <div style={{ ...at(70, STATS_TOP + 0.5), fontSize: "7.5cqw", fontWeight: 500, lineHeight: 1, letterSpacing: ".02em", color: ink }}>
      DRI
    </div>

    <div style={{ ...at(56, STATS_TOP + ROW_GAP), fontSize: "8.5cqw", fontWeight: 700, lineHeight: 1, color: ink }}>
      {pad2(attributes.defending)}
    </div>
    <div style={{ ...at(70, STATS_TOP + ROW_GAP + 0.5), fontSize: "7.5cqw", fontWeight: 500, lineHeight: 1, letterSpacing: ".02em", color: ink }}>
      DEF
    </div>

    <div style={{ ...at(56, STATS_TOP + ROW_GAP * 2), fontSize: "8.5cqw", fontWeight: 700, lineHeight: 1, color: ink }}>
      {pad2(attributes.physical)}
    </div>
    <div style={{ ...at(70, STATS_TOP + ROW_GAP * 2 + 0.5), fontSize: "7.5cqw", fontWeight: 500, lineHeight: 1, letterSpacing: ".02em", color: ink }}>
      PHY
    </div>
    </div>
  );
}