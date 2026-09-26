import { createFileRoute } from "@tanstack/react-router";
import RiverPulseApp from "@/components/riverpulse-app";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "О проекте — RiverPulse" },
      { name: "description", content: "Команда, технологии и цели платформы RiverPulse." },
      { property: "og:title", content: "О проекте — RiverPulse" },
      { property: "og:description", content: "Команда, технологии и цели платформы RiverPulse." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: RiverPulseApp,
});
