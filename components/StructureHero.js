import { curriculum } from "@/lib/curriculum";

// نقاط تأرجح تصاعدية (Higher Highs / Higher Lows) يمثّل كل منها مستوى من المنهج
const POINTS = [
  { x: 20, y: 210 },
  { x: 90, y: 150 },
  { x: 160, y: 175 },
  { x: 230, y: 110 },
  { x: 300, y: 135 },
  { x: 370, y: 70 },
  { x: 440, y: 95 },
  { x: 510, y: 30 },
  { x: 580, y: 50 },
  { x: 650, y: -10 },
  { x: 720, y: 10 },
  { x: 780, y: -45 },
];

export default function StructureHero() {
  const path = POINTS.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");
  // النقاط الفردية = قمم (تحمل رقم المستوى)، بمعدل نقطة قمة لكل مستوى من مستويات المنهج
  const peaks = POINTS.filter((_, i) => i % 2 === 1);

  return (
    <div className="relative w-full overflow-hidden rounded-2xl border border-base-line bg-base-surface">
      <svg
        viewBox="-20 -60 820 300"
        className="w-full h-[220px] sm:h-[280px]"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#8A6E1D" />
            <stop offset="100%" stopColor="#E4C766" />
          </linearGradient>
          <linearGradient id="fillGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#C9A227" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#C9A227" stopOpacity="0" />
          </linearGradient>
        </defs>

        <path d={`${path} L780,240 L20,240 Z`} fill="url(#fillGrad)" />
        <path d={path} fill="none" stroke="url(#lineGrad)" strokeWidth="2.5" />

        {POINTS.map((p, i) => (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r={i % 2 === 1 ? 4.5 : 3}
            fill={i % 2 === 1 ? "#E4C766" : "#0B0F14"}
            stroke="#C9A227"
            strokeWidth="1.5"
          />
        ))}

        {peaks.slice(0, curriculum.length).map((p, i) => (
          <text
            key={i}
            x={p.x}
            y={p.y - 16}
            textAnchor="middle"
            className="tick-label"
            fontSize="12"
            fill="#8A96A3"
          >
            {String(curriculum[i]?.order).padStart(2, "0")}
          </text>
        ))}
      </svg>

      <div className="absolute bottom-3 right-4 tick-label text-[11px] text-ink-faint">
        HH · HL — هيكل سوق صاعد، كل قمة تمثل مرحلة من المنهج
      </div>
    </div>
  );
}
