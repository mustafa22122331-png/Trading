"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { isLessonComplete } from "@/lib/progress";

export default function LessonRow({ level, lesson, index }) {
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDone(isLessonComplete(level.id, lesson.id));
  }, [level.id, lesson.id]);

  return (
    <li>
      <Link
        href={`/curriculum/${level.id}/${lesson.id}`}
        className="flex items-center gap-4 rounded-lg border border-base-line bg-base-surface px-5 py-4 hover:border-brass/40 transition-colors"
      >
        <span
          className={`w-7 h-7 shrink-0 rounded-full flex items-center justify-center tick-label text-xs border ${
            done
              ? "bg-bull/15 border-bull/40 text-bull"
              : "border-base-line text-ink-faint"
          }`}
        >
          {done ? "✓" : index + 1}
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-ink font-medium">{lesson.title}</p>
          <p className="text-ink-muted text-sm truncate">{lesson.summary}</p>
        </div>
      </Link>
    </li>
  );
}
