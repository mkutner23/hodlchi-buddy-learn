import { createFileRoute, notFound } from "@tanstack/react-router";
import { getTopic } from "@/lib/money-basics";
import { TopicPage } from "./money-basics.$topic";

export const Route = createFileRoute("/es/money-basics/$topic")({
  component: TopicPage,
  loader: ({ params }) => {
    const topic = getTopic(params.topic, "es") ?? getTopic(params.topic);
    if (!topic) throw notFound();
    return { topic };
  },
  head: ({ params, loaderData }) => {
    const topic = loaderData?.topic;
    if (!topic) {
      return {
        meta: [
          { title: "Conceptos básicos — No encontrado | Hodlchi" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const url = `https://hodlchi.com/es/money-basics/${params.topic}`;
    const title = `${topic.title} — Una guía en simple | Hodlchi`;
    const description = topic.short;
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
        { rel: "alternate", hrefLang: "en", href: `https://hodlchi.com/money-basics/${params.topic}` },
        { rel: "alternate", hrefLang: "es", href: url },
      ],
    };
  },
});
