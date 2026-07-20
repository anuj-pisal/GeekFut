'use client';

import { useEffect, useState } from 'react';
import { CardAttributes } from '@/lib/providers/types';

interface RadarChartProps {
  attributes: CardAttributes;
  color: string;
}

export function RadarChart({ attributes, color }: RadarChartProps) {
  const data = [
    { label: 'PAC', value: attributes.pace },
    { label: 'DRI', value: attributes.dribbling },
    { label: 'DEF', value: attributes.defending },
    { label: 'PHY', value: attributes.physical },
    { label: 'PAS', value: attributes.passing },
    { label: 'SHO', value: attributes.shooting },
  ];

  const targetValues = data.map(d => d.value);

  const size = 200;
  const center = size / 2;
  const radius = size / 2.5;

  const [animatedValues, setAnimatedValues] = useState([0, 0, 0, 0, 0, 0]);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;
    
    // Capture current values as the starting point for this animation cycle
    const startValues = [...animatedValues];
    const durationMs = 1000;

    const animate = (time: number) => {
      if (!startTime) startTime = time;
      const progress = Math.min((time - startTime) / durationMs, 1);
      
      // easeOutCubic
      const ease = 1 - Math.pow(1 - progress, 3);
      
      setAnimatedValues(startValues.map((start, i) => start + (targetValues[i] - start) * ease));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(targetValues)]);

  const getPoint = (val: number, angle: number) => {
    const normalized = Math.max(0, (val - 30) / 70); 
    const r = radius * normalized;
    const x = center + r * Math.cos(angle - Math.PI / 2);
    const y = center + r * Math.sin(angle - Math.PI / 2);
    return { x, y };
  };

  const points = animatedValues.map((val, i) => getPoint(val, (i * 2 * Math.PI) / 6));

  // Generate grid hexagons
  const levels = [0.2, 0.4, 0.6, 0.8, 1];
  const grids = levels.map((level) => {
    return Array.from({ length: 6 }).map((_, i) => {
      const r = radius * level;
      const angle = (i * 2 * Math.PI) / 6;
      const x = center + r * Math.cos(angle - Math.PI / 2);
      const y = center + r * Math.sin(angle - Math.PI / 2);
      return { x, y };
    });
  });

  return (
    <div className="relative flex flex-col items-center animate-fade-in-up">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="overflow-visible">
        {/* Grids */}
        {grids.map((grid, index) => (
          <polygon
            key={index}
            points={grid.map(p => `${p.x},${p.y}`).join(' ')}
            fill="none"
            stroke="rgba(255, 255, 255, 0.1)"
            strokeWidth="1"
          />
        ))}

        {/* Axes */}
        {Array.from({ length: 6 }).map((_, i) => {
          const angle = (i * 2 * Math.PI) / 6;
          const x = center + radius * Math.cos(angle - Math.PI / 2);
          const y = center + radius * Math.sin(angle - Math.PI / 2);
          return (
            <line
              key={i}
              x1={center}
              y1={center}
              x2={x}
              y2={y}
              stroke="rgba(255, 255, 255, 0.1)"
              strokeWidth="1"
            />
          );
        })}

        {/* Data Polygon */}
        <polygon
          points={points.map(p => `${p.x},${p.y}`).join(' ')}
          fill={color}
          fillOpacity={0.3}
          stroke={color}
          strokeWidth="3"
          className="drop-shadow-[0_0_15px_currentColor]"
        />

        {/* Labels */}
        {data.map((d, i) => {
          const angle = (i * 2 * Math.PI) / 6;
          // Push labels a bit further out
          const x = center + (radius + 20) * Math.cos(angle - Math.PI / 2);
          const y = center + (radius + 20) * Math.sin(angle - Math.PI / 2);
          return (
            <text
              key={d.label}
              x={x}
              y={y}
              fill="rgba(255,255,255,0.5)"
              fontSize="10"
              fontWeight="bold"
              fontFamily="sans-serif"
              textAnchor="middle"
              alignmentBaseline="middle"
            >
              {d.label}
            </text>
          );
        })}
      </svg>
    </div>
  );
}
