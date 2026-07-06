import { defineMcp } from "@lovable.dev/mcp-js";
import listAgents from "./tools/list-agents";
import listArticles from "./tools/list-articles";
import getArticle from "./tools/get-article";

export default defineMcp({
  name: "granit-mcp",
  title: "Granit AI",
  version: "0.1.0",
  instructions:
    "Granit deploys specialized AI agents for French healthcare workflows (billing, third-party payers, collections, admissions, compliance). Use `list_agents` to browse the agent catalog (optionally filter by vertical or use case), and `list_articles` / `get_article` to read Granit resource content.",
  tools: [listAgents, listArticles, getArticle],
});
