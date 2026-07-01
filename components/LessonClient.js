"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Quiz from "@/components/Quiz";
import { isLessonComplete, setLessonComplete } from "@/lib/progress";

export default function LessonClient({
  level,
  lesson,
  prevHref,
  nextHref,
  nextLabel,
  prevLabel,
}) {
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDone(isLessonComplete(level.id, lesson.id));
  }, [level.id, lesson.id]);

  function markDone() {
    setLessonComplete(level.id, lesson.id, true);
    setDone(true);
  }

  return (
    <>
      {done && (
        <p className="mb-3 inline-flex items-center gap-2 text-bull text-sm tick-label">
          ✓ أكملت هذا الدرس من قبل — يمكنك إعادة الاختبار للمراجعة
        </p>
      )}
      <Quiz questions={lesson.quiz} onPassed={markDone} />

      {!lesson.quiz?.length && !done && (
        <button
          onClick={markDone}
          className="mt-6 px-5 py-2.5 rounded-md bg-brass text-base font-semibold hover:bg-brass-light transition-colors"
        >
          تحديد الدرس كمكتمل
        </button>
      )}

      <div className="hairline my-10" />

      <div className="flex items-center justify-between text-sm">
        {prevHref ? (
          <Link href={prevHref} className="text-ink-muted hover:text-brass">
            ← {prevLabel}
          </Link>
        ) : (
          <span />
        )}
        <Link
          href={nextHref}
          className="px-5 py-2.5 rounded-md border border-brass/40 text-brass hover:bg-brass/10 transition-colors"
        >
          {nextLabel} →
        </Link>
      </div>
    </>
  );
}
