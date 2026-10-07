// Generates public/sitemap.xml from static routes + every article slug.
// Runs automatically before `vite build` (see package.json).
import { execFileSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";

const SITE = "https://www.getgranit.ai";
const ARTICLES = "src/lib/articles.ts";

function git(args) {
  try {
    return execFileSync("git", args, { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] });
  } catch {
    return "";
  }
}

// Commits at the edge of a shallow clone (Vercel clones with a limited depth)
// carry every older file: their date says nothing about the file, so skip them.
const shallowFile = git(["rev-parse", "--git-path", "shallow"]).trim();
const shallow = new Set(
  shallowFile && existsSync(shallowFile)
    ? readFileSync(shallowFile, "utf8").split("\n").filter(Boolean)
    : [],
);

/** YYYY-MM-DD of the last commit touching `files`, or undefined if unknown. */
function lastModified(files) {
  const [sha, date] = git(["log", "-1", "--format=%H %cs", "--", ...files])
    .trim()
    .split(" ");
  return sha && !shallow.has(sha) ? date : undefined;
}

// Per-article date: newest commit among the lines of each article block (git blame).
function articleDates() {
  const commitDate = new Map();
  const lineCommit = [];
  let sha;
  for (const line of git(["blame", "--porcelain", ARTICLES]).split("\n")) {
    const header = line.match(/^([0-9a-f]{40}) \d+ (\d+)/);
    if (header) {
      sha = header[1];
      lineCommit[Number(header[2])] = sha;
    } else if (line.startsWith("committer-time ")) {
      commitDate.set(sha, Number(line.slice(15)));
    }
  }
  const dates = new Map();
  let current;
  articlesSrc.split("\n").forEach((line, i) => {
    const m = line.match(/slug:\s*"([^"]+)"/);
    if (m) current = m[1];
    const c = lineCommit[i + 1];
    if (!current || !c || shallow.has(c)) return;
    dates.set(current, Math.max(dates.get(current) ?? 0, commitDate.get(c)));
  });
  return new Map(
    [...dates].map(([slug, t]) => [slug, new Date(t * 1000).toISOString().slice(0, 10)]),
  );
}

const articlesSrc = readFileSync(ARTICLES, "utf8");
// French articles only: the English market is out of scope for now, so the
// /ressources/<english-slug> pages stay online but out of the sitemap.
const frSrc = articlesSrc.slice(0, articlesSrc.search(/^\s*en:\s*\[/m));
const slugs = [...new Set([...frSrc.matchAll(/slug:\s*"([^"]+)"/g)].map((m) => m[1]))];
const slugDates = articleDates();

// /produit and /cas-usage redirect to /agents: they don't belong in the sitemap.
const staticPages = [
  {
    path: "/",
    files: ["src/routes/index.tsx", "src/components/home"],
    priority: "1.0",
    freq: "weekly",
  },
  { path: "/agents", files: ["src/routes/agents.tsx"], priority: "0.9", freq: "weekly" },
  { path: "/tarifs", files: ["src/routes/tarifs.tsx"], priority: "0.8", freq: "monthly" },
  { path: "/securite", files: ["src/routes/securite.tsx"], priority: "0.7", freq: "monthly" },
  {
    path: "/ressources",
    files: ["src/routes/ressources.index.tsx", "src/lib/articles.ts"],
    priority: "0.8",
    freq: "weekly",
  },
  { path: "/a-propos", files: ["src/routes/a-propos.tsx"], priority: "0.6", freq: "monthly" },
  {
    path: "/affiliation",
    files: ["src/routes/affiliation.tsx", "src/lib/affiliationCopy.ts"],
    priority: "0.5",
    freq: "monthly",
  },
  { path: "/demo", files: ["src/routes/demo.tsx"], priority: "0.6", freq: "monthly" },
  { path: "/cgv", files: ["src/routes/cgv.tsx"], priority: "0.3", freq: "yearly" },
];

// Articles du moteur SEO (content/ressources/*.json), seulement ceux publiés dans la file.
const QUEUE = "scripts/seo-engine/articles-queue.json";
const publies = existsSync(QUEUE)
  ? new Set(JSON.parse(readFileSync(QUEUE, "utf8")).filter((a) => a.status === "published").map((a) => a.slug))
  : new Set();
const moteur = existsSync("content/ressources")
  ? readdirSync("content/ressources")
      .filter((f) => f.endsWith(".json"))
      .map((f) => JSON.parse(readFileSync(`content/ressources/${f}`, "utf8")))
      .filter((a) => publies.has(a.slug) && !slugs.includes(a.slug))
  : [];

const urls = [
  ...staticPages.map((p) => ({
    loc: SITE + p.path,
    lastmod: lastModified(p.files),
    freq: p.freq,
    priority: p.priority,
  })),
  ...slugs.map((s) => ({
    loc: `${SITE}/ressources/${s}`,
    lastmod: slugDates.get(s),
    freq: "monthly",
    priority: "0.7",
  })),
  ...moteur.map((a) => ({
    loc: `${SITE}/ressources/${a.slug}`,
    lastmod: a.dateModified,
    freq: "monthly",
    priority: a.level?.startsWith("Pilier") ? "0.8" : "0.7",
  })),
];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${u.loc}</loc>${u.lastmod ? `\n    <lastmod>${u.lastmod}</lastmod>` : ""}
    <changefreq>${u.freq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`,
  )
  .join("\n")}
</urlset>
`;

writeFileSync("public/sitemap.xml", xml);
const dated = urls.filter((u) => u.lastmod).length;
console.log(
  `sitemap.xml written: ${urls.length} URLs (${slugs.length} articles + ${moteur.length} du moteur + ${staticPages.length} pages, ${dated} with lastmod)`,
);
