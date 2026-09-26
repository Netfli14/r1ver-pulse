import { createFileRoute } from "@tanstack/react-router";
import { createAdminSession } from "@/lib/admin-auth.server";

const headers = { "Cache-Control": "no-store", "Content-Type": "application/json" };
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers });

export const Route = createFileRoute("/api/admin-login")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const body = (await request.json().catch(() => ({}))) as { password?: unknown };
        const expected = process.env.ADMIN_PASSWORD || "riverpulse-demo";
        if (typeof body.password !== "string" || body.password !== expected) {
          return json({ ok: false }, 401);
        }
        const token = await createAdminSession();
        return new Response(JSON.stringify({ ok: true, token }), {
          headers: {
            ...headers,
            "Set-Cookie": `riverpulse_admin=${token}; HttpOnly; SameSite=Lax; Path=/; Max-Age=${8 * 60 * 60}`,
          },
        });
      },
    },
  },
});
