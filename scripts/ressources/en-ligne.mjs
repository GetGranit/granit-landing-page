// Règle « en ligne » de la rubrique Ressources, écrite une seule fois.
// Utilisée par le site (plugin Vite, scripts/ressources/vite-plugin.ts) et par le sitemap.
//
// Un article du moteur est en ligne quand son fichier content/ressources/{slug}.json existe
// ET que son statut dans scripts/seo-engine/articles-queue.json est « published ».
// Sans file d'articles (cas de main tant que le moteur n'est pas fusionné), rien n'est en ligne.
//
// L'aperçu (content/apercu/) n'est lu que si on le demande : jamais pour la production ni le sitemap.
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const lireJson = (p) => JSON.parse(readFileSync(p, "utf8"));

function fichiersJson(dossier) {
  if (!existsSync(dossier)) return [];
  return readdirSync(dossier)
    .filter((f) => f.endsWith(".json"))
    .sort()
    .map((f) => join(dossier, f));
}

/** Statut et vague de chaque slug de la file, ou une Map vide si la file n'existe pas. */
export function lireFile(racine) {
  const p = join(racine, "scripts/seo-engine/articles-queue.json");
  if (!existsSync(p)) return new Map();
  return new Map(lireJson(p).map((a) => [a.slug, { status: a.status, wave: a.wave }]));
}

/** Articles du moteur en ligne, avec leur vague (tirée de la file). */
export function articlesEnLigne(racine) {
  const file = lireFile(racine);
  return fichiersJson(join(racine, "content/ressources"))
    .map((p) => lireJson(p))
    .filter((a) => file.get(a.slug)?.status === "published")
    .map((a) => ({ ...a, wave: file.get(a.slug).wave }));
}

/**
 * Tout le contenu à afficher : articles en ligne, plus l'aperçu si `avecApercu`.
 * Un vrai fichier publié l'emporte sur un fichier d'aperçu du même slug.
 * Renvoie aussi les fichiers de faits des plateformes utilisées, et la liste des fichiers lus
 * (pour que le serveur de dev recharge quand ils changent).
 */
export function lireContenu(racine, { avecApercu = false } = {}) {
  const lus = [join(racine, "scripts/seo-engine/articles-queue.json")];
  const articles = articlesEnLigne(racine);
  const plateformes = {};
  const lirePlateforme = (dossier, nom) => {
    const p = join(racine, dossier, `${nom}.json`);
    lus.push(p);
    if (!plateformes[nom] && existsSync(p)) plateformes[nom] = lireJson(p);
  };
  for (const a of articles) if (a.plateforme) lirePlateforme("content/plateformes", a.plateforme);

  if (avecApercu) {
    const publies = new Set(articles.map((a) => a.slug));
    for (const p of fichiersJson(join(racine, "content/apercu/ressources"))) {
      lus.push(p);
      const a = lireJson(p);
      if (publies.has(a.slug)) continue;
      articles.push({ ...a, preview: true });
      if (a.plateforme) {
        lirePlateforme("content/plateformes", a.plateforme);
        lirePlateforme("content/apercu/plateformes", a.plateforme);
      }
    }
  }
  return { articles, plateformes, lus };
}

/** Slugs des anciens articles français de src/lib/articles.ts. */
export function anciensSlugsFr(racine) {
  const src = readFileSync(join(racine, "src/lib/articles.ts"), "utf8");
  const fr = src.slice(0, src.search(/^\s*en:\s*\[/m));
  return [...new Set([...fr.matchAll(/slug:\s*"([^"]+)"/g)].map((m) => m[1]))];
}

/**
 * Contrôles qui doivent faire échouer le build :
 * - un même slug en JSON et dans articles.ts (deux pages pour une URL) ;
 * - une meta description de catégorie hors de 120 à 160 caractères.
 */
export function controler(racine, articles) {
  const erreurs = [];
  const anciens = new Set(anciensSlugsFr(racine));
  for (const a of articles) {
    if (anciens.has(a.slug)) erreurs.push(`slug en double (JSON et articles.ts) : ${a.slug}`);
  }
  const { categories, suffixeDescription } = lireJson(
    join(racine, "src/lib/ressources/categories.json"),
  );
  for (const [cle, c] of Object.entries(categories)) {
    const n = (c.description + suffixeDescription).length;
    if (n < 120 || n > 160) erreurs.push(`description de la catégorie ${cle} : ${n} caractères`);
  }
  if (erreurs.length) throw new Error(`Ressources :\n- ${erreurs.join("\n- ")}`);
}
