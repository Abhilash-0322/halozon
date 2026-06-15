'use client';
import { useState } from 'react';
import { formatPrice } from '@/lib/utils';

export default function Sparkline({
  data,
  height = 160,
}: {
  data: { date: string; revenue: number; units: number }[];
  height?: number;
}) {
  const [hover, setHover] = useState<number | null>(null);
  const max = Math.max(1, ...data.map((d) => d.revenue));
  const width = 600;
  const padX = 30;
  const padY = 20;
  const step = (width - padX * 2) / Math.max(1, data.length - 1);

  const points = data.map((d, i) => ({
    x: padX + i * step,
    y: padY + (1 - d.revenue / max) * (height - padY * 2),
    ...d,
  }));

  const path = points
    .map((p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`))
    .join(' ');
  const area = `${path} L ${points[points.length - 1].x} ${height - padY} L ${points[0].x} ${height - padY} Z`;

  return (
    <div className="relative">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full"
        style={{ maxHeight: height }}
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="sparkline-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FF9900" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#FF9900" stopOpacity="0" />
          </linearGradient>
        </defs>
        {/* Y axis gridlines */}
        {[0, 0.25, 0.5, 0.75, 1].map((p, i) => (
          <line
            key={i}
            x1={padX}
            x2={width - padX}
            y1={padY + p * (height - padY * 2)}
            y2={padY + p * (height - padY * 2)}
            stroke="#DDD"
            strokeDasharray="3 3"
          />
        ))}
        {/* Area + line */}
        <path d={area} fill="url(#sparkline-grad)" />
        <path d={path} fill="none" stroke="#FF9900" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
        {/* Points + hover */}
        {points.map((p, i) => (
          <g key={i}>
            <circle
              cx={p.x}
              cy={p.y}
              r={hover === i ? 6 : 3.5}
              fill="#FF9900"
              stroke="white"
              strokeWidth="2"
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(null)}
              className="cursor-pointer"
            />
            {hover === i && (
              <g>
                <line x1={p.x} y1={padY} x2={p.x} y2={height - padY} stroke="#FF9900" strokeDasharray="2 3" />
              </g>
            )}
          </g>
        ))}
        {/* X axis labels (date) */}
        {points.map((p, i) => (
          <text
            key={i}
            x={p.x}
            y={height - 4}
            textAnchor="middle"
            fontSize="10"
            fill="#565959"
          >
            {p.date.slice(5)}
          </text>
        ))}
      </svg>
      {hover !== null && (
        <div className="absolute top-0 right-0 bg-amazon-navy text-white text-xs rounded px-2 py-1">
          {new Date(points[hover].date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
          : <b>{formatPrice(points[hover].revenue)}</b> ({points[hover].units} units)
        </div>
      )}
    </div>
  );
}
