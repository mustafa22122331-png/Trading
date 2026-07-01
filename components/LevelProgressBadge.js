"use client";

import { useEffect, useState } from "react";
import { getLevelProgress } from "@/lib/progress";

export default function LevelProgressBadge({ level }) {
  const [progress, setProgress] = useState({ done: 0, total: level.lessons.length });

  useEffect(() => {
    setProgress(getLevelProgress(level));
  }, [level]);

  const complete = progress.done === progress.total && progress.total > 0;

  return (
    <span
      className={`tick-label text-xs shrink-0 px-3 py-1.5 rounded-full border ${
        complete
          ? "border-bull/40 text-bull"
          : progress.done > 0
          ? "border-brass/40 text-brass"
          : "border-base-line text-ink-faint"
      }`}
    >
      {progress.done}/{progress.total}
    </span>
  );
}
