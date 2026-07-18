import { createFileRoute } from "@tanstack/react-router";
import { ComparePage } from "./compare.khan-academy";

export const Route = createFileRoute("/es/compare/khan-academy")({
  component: ComparePage,
  head: () => ({
    meta: [
      { title: "Hodlchi vs Khan Academy: ¿Cuál es mejor para principiantes? — Hodlchi" },
      { name: "description", content: "Una comparación honesta entre Hodlchi y Khan Academy para aprender de dinero: formato, tiempo, ritmo y a quién le va mejor cada uno." },
      { property: "og:title", content: "Hodlchi vs Khan Academy — Hodlchi" },
      { property: "og:description", content: "Comparación entre Hodlchi y Khan Academy para principiantes en finanzas personales." },
      { property: "og:url", content: "https://hodlchi.com/es/compare/khan-academy" },
      { property: "og:locale", content: "es_LA" },
    ],
    links: [
      { rel: "canonical", href: "https://hodlchi.com/es/compare/khan-academy" },
      { rel: "alternate", hrefLang: "en", href: "https://hodlchi.com/compare/khan-academy" },
      { rel: "alternate", hrefLang: "es", href: "https://hodlchi.com/es/compare/khan-academy" },
    ],
  }),
});
