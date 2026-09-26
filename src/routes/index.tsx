import { createFileRoute } from "@tanstack/react-router";
import RiverPulseApp from "@/components/riverpulse-app";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "RiverPulse — мониторинг состояния воды" },
      { name: "description", content: "Интерактивная платформа экологического мониторинга рек, предупреждений и работы RiverCleaner." },
      { property: "og:title", content: "RiverPulse — мониторинг состояния воды" },
      { property: "og:description", content: "Интерактивная платформа экологического мониторинга рек, предупреждений и работы RiverCleaner." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: RiverPulseApp,
});
