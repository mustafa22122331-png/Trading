import ChatPanel from "@/components/ChatPanel";

export const metadata = { title: "المرشد الذكي | أكاديمية الفهم" };

export default function MentorPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-12 space-y-6">
      <div>
        <p className="tick-label text-xs text-brass mb-2">مدعوم بالذكاء الاصطناعي عبر OpenRouter</p>
        <h1 className="font-display text-3xl text-ink mb-3">المرشد الذكي</h1>
        <p className="text-ink-muted leading-relaxed max-w-2xl">
          اسأل عن أي مفهوم من مفاهيم ICT وSMC، اطلب توضيحاً إضافياً لدرس معين، أو
          الصق وصف تحليلك الخاص لصفقة (بدون توصيات مالية مباشرة) لمراجعة منطقك.
        </p>
      </div>

      <ChatPanel placeholder="مثال: ما الفرق بين الأوردر بلوك والبريكر بلوك؟" />
    </div>
  );
}
