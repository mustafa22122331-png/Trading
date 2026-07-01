import Link from "next/link";
import StructureHero from "@/components/StructureHero";
import ProgressOverview from "@/components/ProgressOverview";
import { curriculum } from "@/lib/curriculum";

const PILLARS = [
  {
    title: "منهج متسلسل",
    body: "من قراءة الشمعة الأولى إلى بناء استراتيجية كاملة، ٦ مستويات و١٨ درساً مبنية فوق بعضها.",
  },
  {
    title: "مرشد ذكاء اصطناعي",
    body: "اسأل عن أي مفهوم، أو اطلب مراجعة تحليلك الخاص، بمرشد مدرّب على منهجية ICT وSMC.",
  },
  {
    title: "تدريب عملي بأسعار حقيقية",
    body: "شارت تفاعلي ببيانات حقيقية لتطبيق ما تتعلمه فوراً، بدون مخاطرة برأس مال حقيقي.",
  },
];

export default function HomePage() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-12 space-y-16">
      <section className="grid lg:grid-cols-[1.1fr_0.9fr] gap-8 items-center">
        <div className="space-y-6">
          <span className="tick-label text-xs text-brass border border-brass/30 rounded-full px-3 py-1">
            ICT · Smart Money Concepts
          </span>
          <h1 className="font-display text-4xl sm:text-5xl leading-[1.15] text-ink">
            تعلّم أن تقرأ السوق
            <br />
            كما يقرأه <span className="text-brass">المال الذكي</span>
          </h1>
          <p className="text-ink-muted text-lg leading-relaxed max-w-xl">
            منصة تعليمية متكاملة تأخذك من الصفر المطلق إلى امتلاك منهجية تداول
            منضبطة قائمة على هيكل السوق والسيولة ومناطق الاهتمام المؤسساتية،
            مدعومة بمرشد ذكاء اصطناعي وتدريب عملي على شارت حي.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Link
              href="/curriculum"
              className="px-6 py-3 rounded-md bg-brass text-base font-semibold hover:bg-brass-light transition-colors"
            >
              ابدأ من المستوى الأول
            </Link>
            <Link
              href="/mentor"
              className="px-6 py-3 rounded-md border border-base-line text-ink hover:border-brass/50 transition-colors"
            >
              جرّب المرشد الذكي
            </Link>
          </div>
        </div>

        <StructureHero />
      </section>

      <section>
        <ProgressOverview />
      </section>

      <section className="grid sm:grid-cols-3 gap-4">
        {PILLARS.map((p) => (
          <div
            key={p.title}
            className="rounded-xl border border-base-line bg-base-surface p-6 space-y-2"
          >
            <p className="font-display text-lg text-ink">{p.title}</p>
            <p className="text-ink-muted text-sm leading-relaxed">{p.body}</p>
          </div>
        ))}
      </section>

      <section className="space-y-6">
        <div className="flex items-end justify-between">
          <div>
            <p className="tick-label text-xs text-brass mb-1">خارطة المنهج</p>
            <h2 className="font-display text-2xl text-ink">٦ مستويات، من الأساسيات للاحتراف</h2>
          </div>
          <Link href="/curriculum" className="text-sm text-brass hover:text-brass-light">
            عرض المنهج كاملاً ←
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {curriculum.map((level) => (
            <Link
              key={level.id}
              href={`/curriculum/${level.id}`}
              className="group rounded-xl border border-base-line bg-base-surface p-6 hover:border-brass/40 transition-colors"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="tick-label text-2xl text-brass/70 group-hover:text-brass transition-colors">
                  {String(level.order).padStart(2, "0")}
                </span>
                <span className="tick-label text-xs text-ink-faint">
                  {level.lessons.length} دروس
                </span>
              </div>
              <p className="font-display text-lg text-ink">{level.title}</p>
              <p className="text-ink-faint text-xs tick-label mb-2">{level.subtitle}</p>
              <p className="text-ink-muted text-sm leading-relaxed">{level.description}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
