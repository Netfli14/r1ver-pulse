import { createFileRoute } from "@tanstack/react-router";
import RiverPulseApp from "@/components/riverpulse-app";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Вход — RiverPulse" },
      { name: "description", content: "Войдите в личный кабинет RiverPulse." },
      { property: "og:title", content: "Вход — RiverPulse" },
      { property: "og:description", content: "Войдите в личный кабинет RiverPulse." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: RiverPulseApp,
});
