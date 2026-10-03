import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { streamGatewayText } from "@/lib/ai-gateway.server";

const schema = z.object({
  messages: z
    .array(z.object({ role: z.enum(["user", "assistant"]), content: z.string().min(1).max(4000) }))
    .min(1)
    .max(30),
});

const system =
  "Ты — RiverPulse AI, дружелюбный эксперт по экологии рек и качеству воды в Казахстане (Есиль, Нура, Коргалжын). " +
  "Объясняй просто и точно: мутность (NTU), pH, растворённый кислород, температура, проводимость, нитраты, микропластик, датчики, роботы-очистители, что делать жителям. " +
  "Отвечай на языке вопроса, кратко (до 200 слов), без выдумывания конкретных измерений. Если вопрос о здоровье — советуй обратиться к официальным службам.";

export const Route = createFileRoute("/api/ai-learn")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const parsed = schema.safeParse(await request.json().catch(() => null));
        if (!parsed.success) return new Response("Некорректный запрос.", { status: 400 });
        return streamGatewayText({
          model: "google/gemini-2.5-flash",
          messages: [{ role: "system", content: system }, ...parsed.data.messages],
          signal: request.signal,
        });
      },
    },
  },
});
