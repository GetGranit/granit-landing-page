// Generates public/sitemap.xml from static routes + every article slug.
// Runs automatically before `vite build` (see package.json).
import { readFileSync, writeFileSync } from "node:fs";

const SITE = "https://www.getgranit.ai";

const articlesSrc = readFileSync("src/lib/articles.ts", "utf8");
const slugs = [...new Set([...articlesSrc.matchAll(/slug:\s*"([^"]+)"/g)].map((m) => m[1]))];

const staticPages = [
  { path: "/", priority: "1.0", freq: "weekly" },
  { path: "/produit", priority: "0.9", freq: "weekly" },
  { path: "/agents", priority: "0.9", freq: "weekly" },
  { path: "/cas-usage", priority: "0.8", freq: "weekly" },
  { path: "/tarifs", priority: "0.8", freq: "monthly" },
  { path: "/securite", priority: "0.7", freq: "monthly" },
  { path: "/ressources", priority: "0.8", freq: "weekly" },
  { path: "/a-propos", priority: "0.6", freq: "monthly" },
  { path: "/demo", priority: "0.6", freq: "monthly" },
  { path: "/cgv", priority: "0.3", freq: "yearly" },
];

const urls = [
  ...staticPages.map((p) => ({ loc: SITE + p.path, freq: p.freq, priority: p.priority })),
  ...slugs.map((s) => ({ loc: `${SITE}/ressources/${s}`, freq: "monthly", priority: "0.7" })),
];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${u.loc}</loc>
    <changefreq>${u.freq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`,
  )
  .join("\n")}
</urlset>
`;

writeFileSync("public/sitemap.xml", xml);
console.log(`sitemap.xml written: ${urls.length} URLs (${slugs.length} articles + ${staticPages.length} pages)`);
