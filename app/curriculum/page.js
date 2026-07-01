import Link from "next/link";
import { curriculum } from "@/lib/curriculum";
import LevelProgressBadge from "@/components/LevelProgressBadge";

export const metadata = { title: "المنهج | أكاديمية الفهم" };

export default function CurriculumPage() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-12 space-y-10">
      <div>
        <p className="tick-label text-xs text-brass mb-2">المنهج الكامل</p>
        <h1 className="font-display text-3xl text-ink mb-3">
          من الصفر المطلق إلى استراتيجية احترافية متكاملة
        </h1>
        <p className="text-ink-muted max-w-2xl leading-relaxed">
          سِر بالمنهج بالترتيب؛ كل مستوى يُبنى على سابقه، تماماً كما يُبنى هيكل
          السوق قمة فوق قمة. أكمل الاختبار القصير في نهاية كل درس لترسيخ الفهم.
        </p>
      </div>

      <ol className="space-y-4">
        {curriculum.map((level) => (
          <li key={level.id}>
            <Link
              href={`/curriculum/${level.id}`}
              className="flex flex-col sm:flex-row sm:items-center gap-4 rounded-xl border border-base-line bg-base-surface p-6 hover:border-brass/40 transition-colors"
            >
              <span className="tick-label text-3xl text-brass/70 shrink-0 w-14">
                {String(level.order).padStart(2, "0")}
              </span>
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-display text-xl text-ink">{level.title}</p>
                  <span className="tick-label text-xs text-ink-faint">{level.subtitle}</span>
                </div>
                <p className="text-ink-muted text-sm mt-1 leading-relaxed">
                  {level.description}
                </p>
              </div>
              <LevelProgressBadge level={level} />
            </Link>
          </li>
        ))}
      </ol>
    </div>
  );
}
