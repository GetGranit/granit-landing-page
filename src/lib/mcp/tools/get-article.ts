import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { articles } from "@/lib/articles";

export default defineTool({
  name: "get_article",
  title: "Get a Granit article",
  description: "Fetch the full content of a Granit resource article by its slug.",
  inputSchema: {
    slug: z.string().min(1).describe("Article slug (see list_articles)."),
    lang: z.enum(["fr", "en"]).optional().describe("Language (default fr)."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ slug, lang }) => {
    const list = articles[lang ?? "fr"] ?? [];
    const article = list.find((a) => a.slug === slug);
    if (!article) {
      return { content: [{ type: "text", text: `No article found for slug "${slug}".` }], isError: true };
    }
    return {
      content: [{ type: "text", text: `# ${article.title}\n\n${article.body.join("\n\n")}` }],
      structuredContent: { article },
    };
  },
});
