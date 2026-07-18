import { createFileRoute } from "@tanstack/react-router";
import { TeensPage } from "./financial-literacy-for-everyone";

export const Route = createFileRoute("/es/financial-literacy-for-everyone")({
  component: TeensPage,
  head: () => ({
    meta: [
      { title: "Curso gratuito de alfabetización financiera para todos — Hodlchi" },
      { name: "description", content: "Un curso gratuito y práctico de alfabetización financiera. 20 lecciones cortas sobre ahorro, inversión, crédito, emprendimiento y cripto — para todos." },
      { property: "og:title", content: "Curso gratuito de alfabetización financiera para todos — Hodlchi" },
      { property: "og:description", content: "20 lecciones cortas sobre ahorro, inversión, crédito, emprendimiento y cripto — para todos." },
      { property: "og:url", content: "https://hodlchi.com/es/financial-literacy-for-everyone" },
      { property: "og:locale", content: "es_LA" },
    ],
    links: [
      { rel: "canonical", href: "https://hodlchi.com/es/financial-literacy-for-everyone" },
      { rel: "alternate", hrefLang: "en", href: "https://hodlchi.com/financial-literacy-for-everyone" },
      { rel: "alternate", hrefLang: "es", href: "https://hodlchi.com/es/financial-literacy-for-everyone" },
    ],
  }),
});
