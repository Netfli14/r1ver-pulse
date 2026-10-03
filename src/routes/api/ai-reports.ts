import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { streamGatewayText } from "@/lib/ai-gateway.server";
import { verifyAdminSession } from "@/lib/admin-auth.server";

const schema = z.object({
  reports: z
    .array(
      z.object({
        id: z.string().max(40),
        category: z.string().max(100),
        date: z.string().max(40),
        description: z.string().max(1000),
        location: z.string().max(200),
      }),
    )
    .min(1)
    .max(60),
});

function cookie(request: Request, name: string) {
  return request.headers.get("cookie")?.split(";").map((p) => p.trim().split("=")).find(([k]) => k === name)?.[1];
}

export const Route = createFileRoute("/api/ai-reports")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const bearer = request.headers.get("authorization")?.match(/^Bearer (.+)$/)?.[1];
        if (!(await verifyAdminSession(bearer || cookie(request, "riverpulse_admin"))))
          return new Response("Нет доступа.", { status: 401 });
        const parsed = schema.safeParse(await request.json().catch(() => null));
        if (!parsed.success) return new Response("Некорректный запрос.", { status: 400 });
        const list = parsed.data.reports
          .map((r) => `${r.id} | ${r.date} | ${r.category} | ${r.location} | ${r.description}`)
          .join("\n");
        return streamGatewayText({
          model: "google/gemini-2.5-pro",
          signal: request.signal,
          messages: [
            {
              role: "system",
              content:
                "Ты аналитик экологической службы RiverPulse. Проанализируй обращения жителей о загрязнении рек. " +
                "Ответ на русском, простым текстом с заголовками в виде строк, без markdown-таблиц. Структура:\n" +
                "1) СРОЧНО — нужно решение сегодня: список с ID, местом, почему срочно и конкретным действием.\n" +
                "2) Требует проверки на этой неделе.\n3) Можно запланировать.\n" +
                "4) Закономерности: повторяющиеся места, типы, возможные источники.\n5) Короткая рекомендация руководству (3-4 предложения).",
            },
            { role: "user", content: `Обращения (${parsed.data.reports.length}):\n${list}` },
          ],
        });
      },
    },
  },
});
