import { createFileRoute } from "@tanstack/react-router";
import { MoneyBasicsHub } from "./money-basics.index";

export const Route = createFileRoute("/es/money-basics/")({
  component: MoneyBasicsHub,
  head: () => ({
    meta: [
      { title: "Conceptos básicos de dinero — Glosario | Hodlchi" },
      { name: "description", content: "Glosario en lenguaje sencillo de conceptos básicos de dinero: presupuesto, interés compuesto, puntaje de crédito y más." },
      { property: "og:title", content: "Conceptos básicos de dinero — Glosario | Hodlchi" },
      { property: "og:description", content: "Definiciones simples de los términos de dinero más importantes." },
      { property: "og:url", content: "https://hodlchi.com/es/money-basics" },
      { property: "og:locale", content: "es_LA" },
    ],
    links: [
      { rel: "canonical", href: "https://hodlchi.com/es/money-basics" },
      { rel: "alternate", hrefLang: "en", href: "https://hodlchi.com/money-basics" },
      { rel: "alternate", hrefLang: "es", href: "https://hodlchi.com/es/money-basics" },
    ],
  }),
});
