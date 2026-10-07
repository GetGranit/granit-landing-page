// Accès aux fichiers du repo : file d'articles, articles publiés, anciens articles, faits.
import { appendFileSync, existsSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

export const RACINE = new URL("../../../", import.meta.url).pathname;
export const MOTEUR = join(RACINE, "scripts/seo-engine");
export const FILE = join(MOTEUR, "articles-queue.json");
export const CONTENU = join(RACINE, "content/ressources");
export const FAITS = join(RACINE, "content/plateformes");

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

/** Nom du fichier de faits d'une plateforme : portail-viamedis -> viamedis */
export function faitsPour(article) {
  const nom = [article.slug, article.parentSlug]
    .filter((s) => s?.startsWith("portail-"))
    .map((s) => s.slice("portail-".length))[0];
  if (!nom) return null;
  const p = join(FAITS, `${nom}.json`);
  return existsSync(p) ? { nom, faits: lireJson(p) } : { nom, faits: null };
}

/** Sections 5 et 6 du gabarit, envoyées à Claude avec le guide. */
export function sectionsGabarit() {
  const g = readFileSync(join(MOTEUR, "GABARIT_ARTICLE_granit.md"), "utf8");
  return g.slice(g.indexOf("## 5."), g.indexOf("## 7."));
}

export function sortieGithub(valeurs) {
  const f = process.env.GITHUB_OUTPUT;
  if (!f) return;
  for (const [k, v] of Object.entries(valeurs)) appendFileSync(f, `${k}=${String(v).replace(/\n/g, " ")}\n`);
}
