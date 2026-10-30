// Génère public/llms.txt (format llmstxt.org) à partir des mêmes données que le sitemap.
// Tourne au build juste après gen-sitemap.mjs (voir package.json) : chaque article publié
// y entre tout seul, rien à éditer à la main.
//
// Source de vérité de ce qui est en ligne = public/sitemap.xml qui vient d'être écrit :
// une page absente du sitemap (aperçu, ancien article remplacé, métier trop maigre) est
// absente d'ici aussi. Les titres et descriptions viennent des articles eux-mêmes.
import { readFileSync, writeFileSync } from "node:fs";
import { articlesEnLigne } from "./ressources/en-ligne.mjs";

const SITE = "https://www.getgranit.ai";
const racine = process.cwd();
const lireJson = (p) => JSON.parse(readFileSync(p, "utf8"));

const enLigne = new Set(
  [...readFileSync("public/sitemap.xml", "utf8").matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]),
);
const publie = (path) => enLigne.has(SITE + path);

// Une ligne par lien : - [titre](url): description
const ligne = (titre, path, desc) =>
  `- [${titre}](${SITE}${path})${desc ? `: ${desc.replace(/\s+/g, " ").trim()}` : ""}`;

// Pages fixes : on ne liste que ce qui aide à comprendre l'offre.
const pages = [
  ["Accueil", "/", "Présentation de Granit et de ses agents IA pour l'administratif santé."],
  [
    "Agents",
    "/agents",
    "Les agents par métier et par tâche : prises en charge, rejets, paiements, relances, facturation.",
  ],
  [
    "Tarifs",
    "/tarifs",
    "Tarification à l'usage : forfait plateforme par centre et fee par agent selon les volumes traités.",
  ],
  ["Sécurité", "/securite", "Hébergement, protection des données de santé et conformité."],
  ["À propos", "/a-propos", "L'équipe, la mission et l'histoire de Granit."],
  [
    "Programme partenaires",
    "/affiliation",
    "Programme d'affiliation pour les professionnels de santé et prescripteurs.",
  ],
].filter(([, path]) => publie(path));

// Articles du moteur SEO, regroupés par catégorie dans l'ordre du hub, piliers d'abord.
const { ordre, categories } = lireJson("src/lib/ressources/categories.json");
const ressources = articlesEnLigne(racine).filter((a) => publie(`/ressources/${a.slug}`));
const rangPilier = (a) => (a.level?.startsWith("Pilier") ? 0 : 1);
const sectionsCategories = ordre
  .map((cat) => {
    const liste = ressources
      .filter((a) => a.category === cat)
      .sort((a, b) => rangPilier(a) - rangPilier(b) || a.title.localeCompare(b.title, "fr"));
    if (!liste.length) return undefined;
    const hub = publie(`/ressources/categorie/${cat}`)
      ? [ligne(`Tous les articles : ${categories[cat].nom}`, `/ressources/categorie/${cat}`)]
      : [];
    return {
      titre: categories[cat].nom,
      lignes: [
        ...hub,
        ...liste.map((a) => ligne(a.title, `/ressources/${a.slug}`, a.metaDescription)),
      ],
    };
  })
  .filter(Boolean);

// Anciens articles (src/lib/articles.ts, français seulement) encore en ligne et non remplacés.
const src = readFileSync("src/lib/articles.ts", "utf8");
const fr = src.slice(0, src.search(/^\s*en:\s*\[/m));
const champ = (bloc, nom) =>
  bloc.match(new RegExp(`${nom}:\\s*"((?:[^"\\\\]|\\\\.)*)"`))?.[1]?.replace(/\\(.)/g, "$1");
const dejaListes = new Set(ressources.map((a) => a.slug));
const anciens = fr
  .split(/(?=^\s*slug:\s*")/m)
  .slice(1)
  .map((bloc) => ({
    slug: champ(bloc, "slug"),
    title: champ(bloc, "title"),
    desc: champ(bloc, "desc"),
  }))
  .filter((a) => a.slug && !dejaListes.has(a.slug) && publie(`/ressources/${a.slug}`));

// Pages métier : seulement celles que le sitemap retient.
const { ordre: ordreMetiers, verticales } = lireJson("src/lib/ressources/verticales.json");
const metiers = ordreMetiers
  .filter((v) => publie(`/ressources/metier/${v}`))
  .map((v) => ligne(verticales[v].nom, `/ressources/metier/${v}`, verticales[v].description));

const section = (titre, lignes) => (lignes.length ? `## ${titre}\n\n${lignes.join("\n")}\n` : "");

const txt = `# Granit

> Granit conçoit des agents IA qui prennent en charge le back-office des professionnels de santé en France, directement dans leurs outils du quotidien : tiers payant et prises en charge, facturation, commandes fournisseurs, traitement des rejets, relances et rapprochement des paiements. Pas de projet d'intégration : les agents travaillent dans le logiciel métier, les portails et le navigateur. Granit a commencé par l'optique et s'étend aux autres métiers de santé.

Le site est en français. La rubrique Ressources (${SITE}/ressources) est un guide pratique de l'administratif santé, centré aujourd'hui sur le tiers payant : plateformes et portails des complémentaires, codes de rejet, paiements et rapprochement, conformité.

${section(
  "Pages principales",
  pages.map(([t, p, d]) => ligne(t, p, d)),
)}
${section("Ressources par métier", metiers)}
${sectionsCategories.map((s) => section(s.titre, s.lignes)).join("\n")}
${section(
  "Optional",
  anciens.map((a) => ligne(a.title, `/ressources/${a.slug}`, a.desc)),
)}`.replace(/\n{3,}/g, "\n\n");

writeFileSync("public/llms.txt", txt);
console.log(
  `llms.txt written: ${pages.length} pages + ${metiers.length} métiers + ${ressources.length} ressources + ${anciens.length} anciens articles`,
);
