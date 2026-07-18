import { createFileRoute } from "@tanstack/react-router";
import { GuidePage } from "./blog.what-is-financial-literacy";

export const Route = createFileRoute("/es/blog/what-is-financial-literacy")({
  component: GuidePage,
  head: () => ({
    meta: [
      { title: "¿Qué es la alfabetización financiera? Guía para principiantes — Hodlchi" },
      { name: "description", content: "Alfabetización financiera explicada en simple: qué es, por qué importa y cómo empezar en 5 minutos al día." },
      { property: "og:title", content: "¿Qué es la alfabetización financiera? — Hodlchi" },
      { property: "og:description", content: "Alfabetización financiera explicada en simple, con un plan para empezar." },
      { property: "og:url", content: "https://hodlchi.com/es/blog/what-is-financial-literacy" },
      { property: "og:type", content: "article" },
      { property: "og:locale", content: "es_LA" },
    ],
    links: [
      { rel: "canonical", href: "https://hodlchi.com/es/blog/what-is-financial-literacy" },
      { rel: "alternate", hrefLang: "en", href: "https://hodlchi.com/blog/what-is-financial-literacy" },
      { rel: "alternate", hrefLang: "es", href: "https://hodlchi.com/es/blog/what-is-financial-literacy" },
    ],
  }),
});
