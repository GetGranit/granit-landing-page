// Accès aux fichiers du repo : file d'articles, articles publiés, anciens articles, faits.
import { execFileSync } from "node:child_process";
import { appendFileSync, existsSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

export const RACINE = new URL("../../../", import.meta.url).pathname;
export const MOTEUR = join(RACINE, "scripts/seo-engine");
export const FILE = join(MOTEUR, "articles-queue.json");
export const CONTENU = join(RACINE, "content/ressources");
export const FAITS = join(RACINE, "content/plateformes");
export const CONCURRENTS = join(RACINE, "content/concurrents");

export const lireJson = (p) => JSON.parse(readFileSync(p, "utf8"));
export const ecrireJson = (p, d) => writeFileSync(p, JSON.stringify(d, null, 2) + "\n");

export function lireFile() {
  return lireJson(FILE);
}

export function ecrireFile(file) {
  ecrireJson(FILE, file);
}

/** Articles du moteur déjà en ligne : statut published ET fichier présent. */
export function publies(file) {
  const fichiers = existsSync(CONTENU) ? new Set(readdirSync(CONTENU)) : new Set();
  return file.filter((a) => a.status === "published" && fichiers.has(`${a.slug}.json`));
}

/** Anciens articles français de src/lib/articles.ts (cibles de liens au démarrage). */
export function anciensArticles() {
  const src = readFileSync(join(RACINE, "src/lib/articles.ts"), "utf8");
  const fr = src.slice(src.indexOf("fr: ["), src.indexOf("en: ["));
  return [...fr.matchAll(/slug:\s*"([^"]+)",\s*category:\s*"([^"]+)",\s*title:\s*"([^"]+)"/g)].map((m) => ({
    slug: m[1],
    categorie: m[2],
    titre: m[3],
  }));
}

/** Ancien article complet (titre, description, paragraphes) lu dans src/lib/articles.ts. */
export function ancienArticle(slug) {
  const src = join(RACINE, "src/lib/articles.ts");
  const code = `import(${JSON.stringify("file://" + src)}).then(({ articles }) => process.stdout.write(JSON.stringify(articles.fr.find((a) => a.slug === ${JSON.stringify(slug)}) ?? null)))`;
  const out = execFileSync(process.execPath, ["--experimental-strip-types", "--no-warnings", "-e", code], { encoding: "utf8" });
  return JSON.parse(out);
}

/** Nom du fichier de faits d'une plateforme : portail-viamedis -> viamedis */
export function faitsPour(article) {
  const nom = [article.slug, article.parentSlug]
    .filter((s) => s?.startsWith("portail-"))
    .map((s) => s.slice("portail-".length))[0];
  if (!nom) return null;
  const p = join(FAITS, `${nom}.json`);
  return existsSync(p) ? { nom, faits: lireJson(p) } : { nom, faits: null };
}

/** Fichiers de faits des acteurs comparés : { slug: contenu } (absent = clé manquante). */
export function concurrentsPour(article) {
  const out = {};
  for (const slug of article.concurrents ?? []) {
    const p = join(CONCURRENTS, `${slug}.json`);
    if (existsSync(p)) out[slug] = lireJson(p);
  }
  return out;
}

/** Sections 5, 6 et 6 bis du gabarit, envoyées à Claude avec le guide. */
export function sectionsGabarit() {
  const g = readFileSync(join(MOTEUR, "GABARIT_ARTICLE_granit.md"), "utf8");
  return g.slice(g.indexOf("## 5."), g.indexOf("## 7."));
}

export function sortieGithub(valeurs) {
  const f = process.env.GITHUB_OUTPUT;
  if (!f) return;
  for (const [k, v] of Object.entries(valeurs)) appendFileSync(f, `${k}=${String(v).replace(/\n/g, " ")}\n`);
}

/** Message système commun (guide + extrait du gabarit), identique d'un appel à l'autre pour profiter du cache. */
export function systemeGuide() {
  return `${readFileSync(join(MOTEUR, "BLOG_CMS_granit.md"), "utf8")}\n\n---\n\n# Extrait du gabarit (GABARIT_ARTICLE_granit.md)\n\n${sectionsGabarit()}`;
}

/** Liens internes autorisés pour un article déjà écrit (lui-même exclu) : chemin -> titre. */
export function ciblesDeLiens(file, article) {
  const enLigne = publies(file).filter((a) => a.slug !== article.slug);
  const cibles = new Map();
  for (const a of enLigne) cibles.set(`/ressources/${a.slug}`, a.title);
  const remplaces = new Set([...enLigne, article].flatMap((a) => a.remplace ?? []));
  for (const a of anciensArticles()) {
    if (remplaces.has(a.slug) || a.slug === article.slug) continue;
    cibles.set(`/ressources/${a.slug}`, a.titre);
  }
  cibles.set("/ressources", "Hub des ressources");
  return cibles;
}
