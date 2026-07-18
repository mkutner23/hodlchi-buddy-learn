import { createFileRoute } from "@tanstack/react-router";
import { Onboarding } from "./onboarding";

export const Route = createFileRoute("/es/onboarding")({
  component: Onboarding,
  head: () => ({
    meta: [
      { title: "Incuba tu Hodlchi — Hodlchi" },
      { name: "description", content: "Elige tu huevo, nómbralo y da vida a tu compañero de dinero." },
      { property: "og:title", content: "Incuba tu Hodlchi — Hodlchi" },
      { property: "og:description", content: "Elige tu huevo, nómbralo y da vida a tu compañero de dinero." },
      { property: "og:url", content: "https://hodlchi.com/es/onboarding" },
      { property: "og:locale", content: "es_LA" },
      { name: "robots", content: "noindex, follow" },
    ],
    links: [{ rel: "canonical", href: "https://hodlchi.com/es/onboarding" }],
  }),
});
