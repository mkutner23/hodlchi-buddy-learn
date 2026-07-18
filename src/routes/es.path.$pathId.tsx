import { createFileRoute } from "@tanstack/react-router";
import { getLocalizedPath } from "@/lib/lessons-data";
import { PathView } from "./path.$pathId";

export const Route = createFileRoute("/es/path/$pathId")({
  component: PathView,
  head: ({ params }) => {
    const path = getLocalizedPath(params.pathId as never, "es");
    const title = path ? `${path.title} — Lecciones Hodlchi` : "Ruta de aprendizaje — Hodlchi";
    const description = path
      ? `${path.tagline} ${path.lessons.length} lecciones cortas para principiantes en Hodlchi.`
      : "Lecciones cortas de alfabetización financiera en Hodlchi.";
    const url = `https://hodlchi.com/es/path/${params.pathId}`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:url", content: url },
        { property: "og:locale", content: "es_LA" },
      ],
      links: [
        { rel: "canonical", href: url },
        { rel: "alternate", hrefLang: "en", href: `https://hodlchi.com/path/${params.pathId}` },
        { rel: "alternate", hrefLang: "es", href: url },
      ],
    };
  },
});
