"use client";

import { useEffect, useState } from "react";
import { curriculum, totalLessonsCount } from "@/lib/curriculum";
import { getCompletedCount } from "@/lib/progress";

export default function ProgressOverview() {
  const [done, setDone] = useState(0);

  useEffect(() => {
    setDone(getCompletedCount(curriculum));
  }, []);

  const pct = totalLessonsCount ? Math.round((done / totalLessonsCount) * 100) : 0;

  return (
    <div className="rounded-xl border border-base-line bg-base-surface p-6 flex items-center gap-6">
      <div className="relative w-20 h-20 shrink-0">
        <svg viewBox="0 0 36 36" className="w-20 h-20 -rotate-90">
          <circle cx="18" cy="18" r="15.5" fill="none" stroke="#26323E" strokeWidth="3" />
          <circle
            cx="18"
            cy="18"
            r="15.5"
            fill="none"
            stroke="#C9A227"
            strokeWidth="3"
            strokeDasharray={`${pct} 100`}
            strokeLinecap="round"
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center tick-label text-sm text-ink">
          {pct}%
        </span>
      </div>
      <div>
        <p className="font-display text-lg text-ink">تقدّمك في المنهج</p>
        <p className="text-ink-muted text-sm mt-1">
          أكملت <span className="text-brass tick-label">{done}</span> من{" "}
          <span className="tick-label">{totalLessonsCount}</span> درساً
        </p>
      </div>
    </div>
  );
}
