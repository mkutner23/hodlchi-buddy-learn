import { createFileRoute } from "@tanstack/react-router";
import { Home } from "./dashboard";

export const Route = createFileRoute("/es/dashboard")({
  component: Home,
  head: () => ({
    meta: [
      { title: "Tu Hodlchi — Panel" },
      { name: "description", content: "Alimenta a tu Hodlchi con una lección, mantén viva tu racha y evoluciona de Bebé a Leyenda del Dinero." },
      { property: "og:title", content: "Tu Hodlchi — Panel" },
      { property: "og:description", content: "Las lecciones diarias alimentan a tu Hodlchi. Vuelve mañana para mantener la racha." },
      { property: "og:url", content: "https://hodlchi.com/es/dashboard" },
      { property: "og:locale", content: "es_LA" },
      { name: "robots", content: "noindex, follow" },
    ],
    links: [{ rel: "canonical", href: "https://hodlchi.com/es/dashboard" }],
  }),
});
