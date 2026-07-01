import Link from "next/link";
import { notFound } from "next/navigation";
import { curriculum, getLevel } from "@/lib/curriculum";
import LessonRow from "@/components/LessonRow";

export function generateStaticParams() {
  return curriculum.map((l) => ({ levelId: l.id }));
}

export function generateMetadata({ params }) {
  const level = getLevel(params.levelId);
  return { title: level ? `${level.title} | أكاديمية الفهم` : "المستوى" };
}

export default function LevelPage({ params }) {
  const level = getLevel(params.levelId);
  if (!level) notFound();

  const idx = curriculum.findIndex((l) => l.id === level.id);
  const prevLevel = curriculum[idx - 1];
  const nextLevel = curriculum[idx + 1];

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 space-y-8">
      <div>
        <Link href="/curriculum" className="text-sm text-ink-faint hover:text-brass">
          ← كل المستويات
        </Link>
        <div className="flex items-center gap-3 mt-4">
          <span className="tick-label text-3xl text-brass/70">
            {String(level.order).padStart(2, "0")}
          </span>
          <div>
            <h1 className="font-display text-3xl text-ink">{level.title}</h1>
            <p className="tick-label text-xs text-ink-faint">{level.subtitle}</p>
          </div>
        </div>
        <p className="text-ink-muted mt-4 leading-relaxed max-w-2xl">{level.description}</p>
      </div>

      <ol className="space-y-3">
        {level.lessons.map((lesson, i) => (
          <LessonRow key={lesson.id} level={level} lesson={lesson} index={i} />
        ))}
      </ol>

      <div className="hairline" />

      <div className="flex justify-between text-sm">
        {prevLevel ? (
          <Link href={`/curriculum/${prevLevel.id}`} className="text-ink-muted hover:text-brass">
            ← {prevLevel.title}
          </Link>
        ) : (
          <span />
        )}
        {nextLevel ? (
          <Link href={`/curriculum/${nextLevel.id}`} className="text-ink-muted hover:text-brass">
            {nextLevel.title} →
          </Link>
        ) : (
          <span />
        )}
      </div>
    </div>
  );
}
