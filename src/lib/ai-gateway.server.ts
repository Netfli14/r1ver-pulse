// Streams a Lovable AI Gateway chat completion as plain text.
export async function streamGatewayText(opts: {
  model: string;
  messages: { role: "system" | "user" | "assistant"; content: string }[];
  signal?: AbortSignal;
  extra?: Record<string, unknown>;
}): Promise<Response> {
  const key = process.env.LOVABLE_API_KEY;
  if (!key) return new Response("AI не настроен.", { status: 401 });
  const upstream = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`,
      "Lovable-API-Key": key,
      "X-Lovable-AIG-SDK": "fetch",
    },
    body: JSON.stringify({ model: opts.model, messages: opts.messages, stream: true, ...opts.extra }),
    signal: opts.signal,
  });
  if (!upstream.ok || !upstream.body) {
    let message = "Ошибка AI-сервиса.";
    try {
      const j = (await upstream.json()) as { error?: { message?: string }; message?: string };
      message = j.error?.message || j.message || message;
    } catch {}
    if (upstream.status === 429) message = "Слишком много запросов, попробуйте чуть позже.";
    if (upstream.status === 402) message = "Закончились AI-кредиты рабочего пространства.";
    return new Response(message, { status: upstream.status });
  }
  const decoder = new TextDecoder();
  const encoder = new TextEncoder();
  let buffer = "";
  const out = upstream.body.pipeThrough(
    new TransformStream<Uint8Array, Uint8Array>({
      transform(chunk, controller) {
        buffer += decoder.decode(chunk, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";
        for (const line of lines) {
          const l = line.trim();
          if (!l.startsWith("data:")) continue;
          const data = l.slice(5).trim();
          if (data === "[DONE]") continue;
          try {
            const j = JSON.parse(data) as { choices?: { delta?: { content?: string } }[] };
            const text = j.choices?.[0]?.delta?.content;
            if (text) controller.enqueue(encoder.encode(text));
          } catch {}
        }
      },
    }),
  );
  const headers: Record<string, string> = { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" };
  upstream.headers.forEach((v, k) => {
    if (k.toLowerCase().startsWith("x-lovable-aig-")) headers[k] = v;
  });
  return new Response(out, { headers });
}
