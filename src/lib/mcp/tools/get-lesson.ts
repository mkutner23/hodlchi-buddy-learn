import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { PATHS, type PathId } from "@/lib/lessons-data";

const PATH_IDS = ["saving", "investing", "credit", "entrepreneurship", "crypto"] as const;

export default defineTool({
  name: "get_lesson",
  title: "Get lesson",
  description:
    "Fetch a single Hodlchi lesson (intro text + 3-question quiz) by path id and lesson id. Use list_learning_paths to discover valid ids.",
  inputSchema: {
    pathId: z.enum(PATH_IDS).describe("Learning path id, e.g. 'saving'."),
    lessonId: z.string().min(1).describe("Lesson id within the path, e.g. 's1'."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ pathId, lessonId }) => {
    const path = PATHS.find((p) => p.id === (pathId as PathId));
    const lesson = path?.lessons.find((l) => l.id === lessonId);
    if (!path || !lesson) {
      return {
        content: [{ type: "text", text: `Lesson not found: ${pathId}/${lessonId}` }],
        isError: true,
      };
    }
    const payload = {
      path: { id: path.id, title: path.title, emoji: path.emoji },
      lesson,
    };
    return {
      content: [{ type: "text", text: JSON.stringify(payload, null, 2) }],
      structuredContent: payload,
    };
  },
});
