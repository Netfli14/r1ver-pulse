import { createFileRoute } from "@tanstack/react-router";
import RiverPulseApp from "@/components/riverpulse-app";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Личный кабинет — RiverPulse" },
      { name: "description", content: "Ваши водоёмы, уведомления и тревоги." },
      { property: "og:title", content: "Личный кабинет — RiverPulse" },
      { property: "og:description", content: "Ваши водоёмы, уведомления и тревоги." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: RiverPulseApp,
});
