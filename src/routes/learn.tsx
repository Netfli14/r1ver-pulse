import { createFileRoute } from "@tanstack/react-router";
import RiverPulseApp from "@/components/riverpulse-app";

export const Route = createFileRoute("/learn")({
  head: () => ({
    meta: [
      { title: "Обучение — RiverPulse" },
      { name: "description", content: "Короткие уроки о качестве воды, датчиках и экологии рек." },
      { property: "og:title", content: "Обучение — RiverPulse" },
      { property: "og:description", content: "Короткие уроки о качестве воды, датчиках и экологии рек." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: RiverPulseApp,
});
