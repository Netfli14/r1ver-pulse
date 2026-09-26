import { createFileRoute } from "@tanstack/react-router";
import RiverPulseApp from "@/components/riverpulse-app";

export const Route = createFileRoute("/operator")({
  head: () => ({
    meta: [
      { title: "Панель оператора — RiverPulse" },
      { name: "description", content: "Оперативная панель для служб мониторинга и очистки." },
      { property: "og:title", content: "Панель оператора — RiverPulse" },
      { property: "og:description", content: "Оперативная панель для служб мониторинга и очистки." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: RiverPulseApp,
});
