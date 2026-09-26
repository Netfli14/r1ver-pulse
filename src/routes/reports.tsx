import { createFileRoute } from "@tanstack/react-router";
import RiverPulseApp from "@/components/riverpulse-app";

export const Route = createFileRoute("/reports")({
  head: () => ({
    meta: [
      { title: "Сообщить о загрязнении — RiverPulse" },
      { name: "description", content: "Отправьте сообщение о загрязнении водоёма и отслеживайте реакцию." },
      { property: "og:title", content: "Сообщить о загрязнении — RiverPulse" },
      { property: "og:description", content: "Отправьте сообщение о загрязнении водоёма и отслеживайте реакцию." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: RiverPulseApp,
});
