import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { PATHS } from "@/lib/lessons-data";

const BASE_URL = "https://demo.hodlchi.com";

interface SitemapEntry {
  path: string;
  changefreq?: "weekly" | "monthly";
  priority?: string;
}

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const entries: SitemapEntry[] = [
          { path: "/", changefreq: "weekly", priority: "1.0" },
          { path: "/onboarding", changefreq: "monthly", priority: "0.6" },
          { path: "/dashboard", changefreq: "weekly", priority: "0.8" },
          { path: "/financial-literacy-for-everyone", changefreq: "monthly", priority: "0.9" },
          { path: "/blog/what-is-financial-literacy-for-teens", changefreq: "monthly", priority: "0.8" },
          { path: "/compare/khan-academy", changefreq: "monthly", priority: "0.7" },
          { path: "/certificate", changefreq: "monthly", priority: "0.8" },
          ...PATHS.map((p) => ({
            path: `/path/${p.id}`,
            changefreq: "monthly" as const,
            priority: "0.7",
          })),
          ...PATHS.flatMap((p) =>
            p.lessons.map((l) => ({
              path: `/lesson/${p.id}/${l.id}`,
              changefreq: "monthly" as const,
              priority: "0.6",
            })),
          ),
        ];
        const urls = entries
          .map(
            (e) =>
              `  <url>\n    <loc>${BASE_URL}${e.path}</loc>\n    <changefreq>${e.changefreq}</changefreq>\n    <priority>${e.priority}</priority>\n  </url>`,
          )
          .join("\n");
        const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`;
        return new Response(xml, {
          headers: { "Content-Type": "application/xml", "Cache-Control": "public, max-age=3600" },
        });
      },
    },
  },
});
