import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { streamGatewayText } from "@/lib/ai-gateway.server";

const schema = z.object({
  reports: z.array(z.object({
    id: z.string().max(40), category: z.string().max(100), date: z.string().max(40),
    description: z.string().max(1000), location: z.string().max(200),
  })).min(1).max(60),
});

export const Route = createFileRoute("/api/ai-analytics")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const parsed = schema.safeParse(await request.json().catch(() => null));
        if (!parsed.success) return new Response("Некорректный запрос.", { status: 400 });
        const list = parsed.data.reports.map((r) => `${r.id} | ${r.date} | ${r.category} | ${r.location} | ${r.description}`).join("\n");
        return streamGatewayText({
          model: "openai/gpt-6-astra",
          extra: { reasoning_effort: "low" },
          signal: request.signal,
          messages: [
            { role: "system", content: "Ты аналитик RiverPulse. Напиши вывод для аналитического отчёта о состоянии рек на основе жалоб жителей. Русский язык, обычный текст без markdown и звёздочек, заголовки отдельными строками. Разделы: Общая картина; Основные проблемы (по типам и местам, с цифрами); Горячие точки; Динамика; Рекомендации. До 350 слов." },
            { role: "user", content: `Жалобы (${parsed.data.reports.length}):\n${list}` },
          ],
        });
      },
    },
  },
});
