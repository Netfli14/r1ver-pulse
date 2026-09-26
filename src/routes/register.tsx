import { createFileRoute } from "@tanstack/react-router";
import RiverPulseApp from "@/components/riverpulse-app";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "Регистрация — RiverPulse" },
      { name: "description", content: "Создайте аккаунт RiverPulse и следите за своими водоёмами." },
      { property: "og:title", content: "Регистрация — RiverPulse" },
      { property: "og:description", content: "Создайте аккаунт RiverPulse и следите за своими водоёмами." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: RiverPulseApp,
});
