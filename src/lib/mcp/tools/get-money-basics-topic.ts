import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { MONEY_BASICS_TOPICS } from "@/lib/money-basics";

export default defineTool({
  name: "get_money_basics_topic",
  title: "Get money basics topic",
  description:
    "Fetch a full Hodlchi Money Basics glossary entry (definition, body sections, example, FAQ) by slug. Use list_money_basics to discover valid slugs.",
  inputSchema: {
    slug: z.string().min(1).describe("Topic slug, e.g. 'budgeting' or 'credit-score'."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ slug }) => {
    const topic = MONEY_BASICS_TOPICS.find((t) => t.slug === slug);
    if (!topic) {
      return {
        content: [{ type: "text", text: `Topic not found: ${slug}` }],
        isError: true,
      };
    }
    return {
      content: [{ type: "text", text: JSON.stringify(topic, null, 2) }],
      structuredContent: { topic },
    };
  },
});
