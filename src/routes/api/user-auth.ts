import { createFileRoute } from "@tanstack/react-router";
import {
  createUserSession,
  normalizeEmail,
  verifyUserSession,
} from "@/lib/user-auth.server";

const noStore = { "Cache-Control": "no-store", "Content-Type": "application/json" };
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: noStore });

const encodeEmail = (email: string) =>
  Array.from(new TextEncoder().encode(email), (b) => b.toString(16).padStart(2, "0")).join("");

function decodeEmail(value: string) {
  if (!value || value.length % 2 !== 0 || !/^[0-9a-f]+$/i.test(value)) return null;
  try {
    const bytes = new Uint8Array(value.match(/.{2}/g)!.map((b) => Number.parseInt(b, 16)));
    return new TextDecoder().decode(bytes);
  } catch {
    return null;
  }
}

export const Route = createFileRoute("/api/user-auth")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const body = (await request.json().catch(() => ({}))) as {
          action?: string;
          email?: unknown;
          password?: unknown;
        };
        const email = typeof body.email === "string" ? normalizeEmail(body.email) : null;
        const password = body.password;
        if (
          !email ||
          typeof password !== "string" ||
          password.length < 8 ||
          password.length > 128
        ) {
          return json({ ok: false, error: "invalid_input" }, 400);
        }
        if (body.action !== "register" && body.action !== "login") {
          return json({ ok: false, error: "invalid_action" }, 400);
        }
        return json({
          ok: true,
          token: await createUserSession(`demo:${encodeEmail(email)}`),
          email,
        });
      },
      GET: async ({ request }) => {
        const token = request.headers.get("authorization")?.match(/^Bearer (.+)$/)?.[1];
        const userId = await verifyUserSession(token);
        const email = userId?.startsWith("demo:") ? decodeEmail(userId.slice(5)) : null;
        return email ? json({ ok: true, email }) : json({ ok: false }, 401);
      },
    },
  },
});
