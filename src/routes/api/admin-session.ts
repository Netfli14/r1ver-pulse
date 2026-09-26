import { createFileRoute } from "@tanstack/react-router";
import { verifyAdminSession } from "@/lib/admin-auth.server";

const headers = { "Cache-Control": "no-store", "Content-Type": "application/json" };

function cookie(request: Request, name: string) {
  return request.headers
    .get("cookie")
    ?.split(";")
    .map((part) => part.trim().split("="))
    .find(([key]) => key === name)?.[1];
}

export const Route = createFileRoute("/api/admin-session")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const bearer = request.headers.get("authorization")?.match(/^Bearer (.+)$/)?.[1];
        const ok = await verifyAdminSession(bearer || cookie(request, "riverpulse_admin"));
        return new Response(JSON.stringify({ ok }), { status: ok ? 200 : 401, headers });
      },
      DELETE: async () =>
        new Response(JSON.stringify({ ok: true }), {
          headers: {
            ...headers,
            "Set-Cookie": "riverpulse_admin=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0",
          },
        }),
    },
  },
});
