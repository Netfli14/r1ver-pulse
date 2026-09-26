import { createFileRoute } from "@tanstack/react-router";
import RiverPulseApp from "@/components/riverpulse-app";

export const Route = createFileRoute("/robots/$id")({
  head: () => ({
    meta: [
      { title: "RiverCleaner — RiverPulse" },
      { name: "description", content: "Телеметрия робота-очистителя, маршрут и результаты уборки." },
      { property: "og:title", content: "RiverCleaner — RiverPulse" },
      { property: "og:description", content: "Телеметрия робота-очистителя, маршрут и результаты уборки." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: RiverPulseApp,
});
