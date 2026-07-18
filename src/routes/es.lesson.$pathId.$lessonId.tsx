import { createFileRoute } from "@tanstack/react-router";
import { getLocalizedPath } from "@/lib/lessons-data";
import { LessonView } from "./lesson.$pathId.$lessonId";

export const Route = createFileRoute("/es/lesson/$pathId/$lessonId")({
  component: LessonView,
  head: ({ params }) => {
    const path = getLocalizedPath(params.pathId as never, "es");
    const lesson = path?.lessons.find((l) => l.id === params.lessonId);
    const title = lesson ? `${lesson.title} — ${path!.title} · Hodlchi` : "Lección — Hodlchi";
    const description = lesson
      ? `${lesson.intro.slice(0, 150)}${lesson.intro.length > 150 ? "…" : ""}`
      : "Una lección corta de alfabetización financiera en Hodlchi.";
    const url = `https://hodlchi.com/es/lesson/${params.pathId}/${params.lessonId}`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:url", content: url },
        { property: "og:type", content: "article" },
        { property: "og:locale", content: "es_LA" },
      ],
      links: [
        { rel: "canonical", href: url },
        { rel: "alternate", hrefLang: "en", href: `https://hodlchi.com/lesson/${params.pathId}/${params.lessonId}` },
        { rel: "alternate", hrefLang: "es", href: url },
      ],
      scripts: lesson
        ? [
            {
              type: "application/ld+json",
              children: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "LearningResource",
                name: lesson.title,
                description: lesson.intro,
                timeRequired: `PT${lesson.minutes}M`,
                learningResourceType: "Lesson",
                educationalLevel: "beginner",
                inLanguage: "es",
                isPartOf: { "@type": "Course", name: `${path!.title} — Hodlchi` },
                provider: { "@type": "Organization", name: "Hodlchi", url: "https://hodlchi.com" },
              }),
            },
          ]
        : [],
    };
  },
});
