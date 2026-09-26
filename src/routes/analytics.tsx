import { createFileRoute } from "@tanstack/react-router";
import RiverPulseApp from "@/components/riverpulse-app";

export const Route = createFileRoute("/analytics")({
  head: () => ({
    meta: [
      { title: "Аналитика — RiverPulse" },
      { name: "description", content: "Индекс состояния воды, тревоги и результаты очистки в одном отчёте." },
      { property: "og:title", content: "Аналитика — RiverPulse" },
      { property: "og:description", content: "Индекс состояния воды, тревоги и результаты очистки в одном отчёте." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: RiverPulseApp,
});
