const SYSTEM_PROMPT = `أنت "المرشد"، مساعد ذكاء اصطناعي تعليمي متخصص حصرياً في تعليم التداول بمنهجية ICT (Inner Circle Trader) وSmart Money Concepts (SMC).

قواعد صارمة يجب اتباعها دائماً:
- أجب دائماً باللغة العربية الفصحى الواضحة، بأسلوب مبسّط وودود لكن دقيق مهنياً.
- اربط إجاباتك دائماً بالمفاهيم الأساسية: هيكل السوق (BOS/CHoCH)، السيولة (Liquidity)، مناطق الاهتمام (Order Block, FVG, Breaker)، Premium/Discount، الجلسات وKillzones، وPower of Three.
- أنت أداة تعليمية بحتة، ولست مستشاراً مالياً. لا تُصدر أبداً توصيات مباشرة مثل "اشترِ الآن" أو "بِع الآن" أو تتنبأ بسعر مستقبلي مؤكد. اشرح المنطق والاحتمالات فقط.
- إذا سأل المستخدم عن تحليل صفقة أو شارت معين، وجّهه لتطبيق خطوات التحليل التنازلي (Top-Down) وناقش نقاط القوة والضعف في تفكيره، بدل إعطائه قراراً جاهزاً.
- ذكّر دائماً بأهمية إدارة المخاطر (لا تتجاوز 1-2% من رأس المال في الصفقة) عند مناقشة أي مثال عملي.
- إن كان السؤال خارج نطاق التداول وتعليم الأسواق المالية، وجّه المستخدم بلطف للعودة لموضوع الأكاديمية.
- حافظ على إجابات مركّزة وعملية، وتجنب الحشو غير المفيد.`;

export async function POST(req) {
  try {
    const { messages, context } = await req.json();

    if (!process.env.OPENROUTER_API_KEY) {
      return Response.json(
        {
          error:
            "لم يتم إعداد مفتاح OpenRouter على الخادم بعد. أضف OPENROUTER_API_KEY في ملف .env.local ثم أعد تشغيل التطبيق.",
        },
        { status: 500 }
      );
    }

    if (!Array.isArray(messages) || messages.length === 0) {
      return Response.json({ error: "لا توجد رسائل لإرسالها." }, { status: 400 });
    }

    const model = process.env.OPENROUTER_MODEL || "openrouter/auto";

    const payloadMessages = [
      { role: "system", content: SYSTEM_PROMPT },
      ...(context ? [{ role: "system", content: `سياق إضافي من التطبيق: ${context}` }] : []),
      ...messages.slice(-16), // حد أقصى لتاريخ المحادثة المُرسل، لتقليل التكلفة
    ];

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "HTTP-Referer": process.env.SITE_URL || "http://localhost:3000",
        "X-Title": "Trading Academy - ICT/SMC",
      },
      body: JSON.stringify({
        model,
        messages: payloadMessages,
        temperature: 0.4,
        max_tokens: 900,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      return Response.json(
        { error: `تعذّر الاتصال بـ OpenRouter (${response.status}): ${errText.slice(0, 300)}` },
        { status: 502 }
      );
    }

    const data = await response.json();
    const reply = data?.choices?.[0]?.message?.content;

    if (!reply) {
      return Response.json({ error: "لم يصل رد صالح من النموذج، حاول مجدداً." }, { status: 502 });
    }

    return Response.json({ reply });
  } catch (err) {
    return Response.json(
      { error: `حدث خطأ غير متوقع في الخادم: ${err?.message || "غير معروف"}` },
      { status: 500 }
    );
  }
}
