import Link from "next/link";
import { notFound } from "next/navigation";
import { curriculum, getLesson } from "@/lib/curriculum";
import LessonClient from "@/components/LessonClient";

export function generateStaticParams() {
  return curriculum.flatMap((level) =>
    level.lessons.map((lesson) => ({ levelId: level.id, lessonId: lesson.id }))
  );
}

export function generateMetadata({ params }) {
  const found = getLesson(params.levelId, params.lessonId);
  return { title: found ? `${found.lesson.title} | أكاديمية الفهم` : "الدرس" };
}

export default function LessonPage({ params }) {
  const found = getLesson(params.levelId, params.lessonId);
  if (!found) notFound();
  const { level, lesson, prevLesson, nextLesson } = found;

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <Link href={`/curriculum/${level.id}`} className="text-sm text-ink-faint hover:text-brass">
        ← {level.title}
      </Link>

      <p className="tick-label text-xs text-brass mt-6 mb-2">
        المستوى {String(level.order).padStart(2, "0")} · {level.title}
      </p>
      <h1 className="font-display text-3xl text-ink mb-4">{lesson.title}</h1>
      <p className="text-ink-muted text-lg leading-relaxed mb-8">{lesson.summary}</p>

      <div className="hairline mb-8" />

      <article className="space-y-5 mb-10">
        {lesson.content.map((para, i) => (
          <p key={i} className="text-ink/90 leading-loose">
            {para}
          </p>
        ))}
      </article>

      <div className="rounded-xl border border-brass/25 bg-brass/5 p-6 mb-10">
        <p className="tick-label text-xs text-brass mb-3">نقاط أساسية للحفظ</p>
        <ul className="space-y-2">
          {lesson.keyPoints.map((kp, i) => (
            <li key={i} className="flex items-start gap-2 text-ink/90 text-sm leading-relaxed">
              <span className="text-brass mt-1">◆</span>
              <span>{kp}</span>
            </li>
          ))}
        </ul>
      </div>

      <LessonClient
        level={level}
        lesson={lesson}
        prevHref={prevLesson ? `/curriculum/${level.id}/${prevLesson.id}` : null}
        nextHref={nextLesson ? `/curriculum/${level.id}/${nextLesson.id}` : `/curriculum/${level.id}`}
        nextLabel={nextLesson ? nextLesson.title : "العودة لقائمة المستوى"}
        prevLabel={prevLesson ? prevLesson.title : null}
      />
    </div>
  );
}
