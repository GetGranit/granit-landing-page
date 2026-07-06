import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { articles } from "@/lib/articles";

export default defineTool({
  name: "list_articles",
  title: "List Granit resources",
  description: "List the Granit resource articles (guides, analyses). Optionally search by keyword or filter by language.",
  inputSchema: {
    query: z.string().optional().describe("Keyword to match in title, description or category."),
    lang: z.enum(["fr", "en"]).optional().describe("Language (default fr)."),
    limit: z.number().int().min(1).max(50).optional(),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ query, lang, limit }) => {
    const list = articles[lang ?? "fr"] ?? [];
    const q = (query ?? "").toLowerCase();
    const filtered = list
      .filter((a) =>
        !q ||
        a.title.toLowerCase().includes(q) ||
        a.desc.toLowerCase().includes(q) ||
        a.category.toLowerCase().includes(q),
      )
      .slice(0, limit ?? 20)
      .map(({ slug, category, title, desc, time }) => ({ slug, category, title, desc, time }));
    return {
      content: [{ type: "text", text: JSON.stringify(filtered, null, 2) }],
      structuredContent: { count: filtered.length, articles: filtered },
    };
  },
});
