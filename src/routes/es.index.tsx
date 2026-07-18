import { createFileRoute } from "@tanstack/react-router";
import { Landing } from "./index";

export const Route = createFileRoute("/es/")({
  component: Landing,
  head: () => ({
    meta: [
      { title: "Hodlchi — Aprende de dinero. Cría a tu Hodlchi." },
      { name: "description", content: "Hodlchi es el Duolingo del Dinero. Lecciones de 5 minutos. Rachas diarias. Un compañero que crece contigo." },
      { property: "og:title", content: "Hodlchi — Aprende de dinero. Cría a tu Hodlchi." },
      { property: "og:description", content: "Hodlchi es el Duolingo del Dinero. Lecciones de 5 minutos. Rachas diarias. Un compañero que crece contigo." },
      { property: "og:url", content: "https://hodlchi.com/es" },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "es_LA" },
    ],
    links: [
      { rel: "canonical", href: "https://hodlchi.com/es" },
      { rel: "alternate", hrefLang: "en", href: "https://hodlchi.com/" },
      { rel: "alternate", hrefLang: "es", href: "https://hodlchi.com/es" },
      { rel: "alternate", hrefLang: "x-default", href: "https://hodlchi.com/" },
    ],
  }),
});
