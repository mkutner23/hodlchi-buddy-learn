import { createFileRoute } from "@tanstack/react-router";
import { CertificatePage } from "./certificate";

export const Route = createFileRoute("/es/certificate")({
  component: CertificatePage,
  head: () => ({
    meta: [
      { title: "Certificado gratuito de alfabetización financiera — Hodlchi" },
      { name: "description", content: "Termina las 20 lecciones de Hodlchi y desbloquea un certificado gratuito y personalizado de alfabetización financiera." },
      { property: "og:title", content: "Certificado gratuito de alfabetización financiera — Hodlchi" },
      { property: "og:description", content: "Termina las 20 lecciones de Hodlchi y desbloquea un certificado gratuito y personalizado de alfabetización financiera." },
      { property: "og:url", content: "https://hodlchi.com/es/certificate" },
      { property: "og:locale", content: "es_LA" },
    ],
    links: [
      { rel: "canonical", href: "https://hodlchi.com/es/certificate" },
      { rel: "alternate", hrefLang: "en", href: "https://hodlchi.com/certificate" },
      { rel: "alternate", hrefLang: "es", href: "https://hodlchi.com/es/certificate" },
    ],
  }),
});
