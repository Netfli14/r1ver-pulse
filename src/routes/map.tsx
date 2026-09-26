import { createFileRoute } from "@tanstack/react-router";
import RiverPulseApp from "@/components/riverpulse-app";

export const Route = createFileRoute("/map")({
  head: () => ({
    meta: [
      { title: "Карта водоёмов — RiverPulse" },
      { name: "description", content: "Живая карта станций мониторинга воды в Астане и Акмолинской области." },
      { property: "og:title", content: "Карта водоёмов — RiverPulse" },
      { property: "og:description", content: "Живая карта станций мониторинга воды в Астане и Акмолинской области." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: RiverPulseApp,
});
