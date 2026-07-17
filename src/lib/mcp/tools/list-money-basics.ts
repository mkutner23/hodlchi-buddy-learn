import { defineTool } from "@lovable.dev/mcp-js";
import { MONEY_BASICS_TOPICS } from "@/lib/money-basics";

export default defineTool({
  name: "list_money_basics",
  title: "List money basics topics",
  description:
    "List all Hodlchi Money Basics glossary topics (budgeting, saving, APR, credit score, etc.) with slug and short description.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: () => {
    const topics = MONEY_BASICS_TOPICS.map((t) => ({
      slug: t.slug,
      title: t.title,
      emoji: t.emoji,
      short: t.short,
    }));
    return {
      content: [{ type: "text", text: JSON.stringify(topics, null, 2) }],
      structuredContent: { topics },
    };
  },
});
