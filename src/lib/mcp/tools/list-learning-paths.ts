import { defineTool } from "@lovable.dev/mcp-js";
import { PATHS } from "@/lib/lessons-data";

export default defineTool({
  name: "list_learning_paths",
  title: "List learning paths",
  description:
    "List all Hodlchi learning paths (Saving, Investing, Credit, Entrepreneurship, Crypto) with tagline and lesson count.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: () => {
    const paths = PATHS.map((p) => ({
      id: p.id,
      title: p.title,
      emoji: p.emoji,
      tagline: p.tagline,
      lessonCount: p.lessons.length,
      lessonIds: p.lessons.map((l) => l.id),
    }));
    return {
      content: [{ type: "text", text: JSON.stringify(paths, null, 2) }],
      structuredContent: { paths },
    };
  },
});
