import { createFileRoute } from "@tanstack/react-router";
import RiverPulseApp from "@/components/riverpulse-app";

export const Route = createFileRoute("/water/$id")({
  head: () => ({
    meta: [
      { title: "Станция мониторинга — RiverPulse" },
      { name: "description", content: "Показатели воды в реальном времени и прогноз RiverPulse AI." },
      { property: "og:title", content: "Станция мониторинга — RiverPulse" },
      { property: "og:description", content: "Показатели воды в реальном времени и прогноз RiverPulse AI." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: RiverPulseApp,
});
