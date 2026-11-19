// Découverte des outils référentiels, côté Node : sitemap (gen-sitemap.mjs), llms.txt (gen-llms.mjs)
// et tests communs (tests/outils/socle.ts). Côté app, src/lib/outils/socle/outils.ts fait la même
// découverte avec import.meta.glob.
//
// Un outil = un sous-dossier de src/lib/outils/ qui contient à la fois outil.mjs et pages.mjs
// (socle/ n'en a pas ; les fichiers calculs.ts, mailOutils.ts… à la racine sont ignorés). Sans
// dossier d'outil, la liste est vide : ni /outils, ni URL nouvelle dans le sitemap, rien dans llms.txt.
//
// Le build s'arrête (exception en français) si un outil ne respecte pas le contrat : identifiant ou
// chemin qui ne correspondent pas au dossier, hub absent ou pas en premier, chemin hors de l'outil
// ou avec une barre finale, chemin en double (dans un outil ou entre deux outils), lastmod mal formé.
import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { anciensSlugsFr, articlesEnLigne, redirections } from "../ressources/en-ligne.mjs";

export { ACCUEIL_OUTILS } from "../../src/lib/outils/socle/accueil.mjs";

const DOSSIER = "src/lib/outils";
const LASTMOD = /^\d{4}-\d{2}-\d{2}$/;

/**
 * Ce qu'un outil sait du reste du site, côté Node : les slugs /ressources en ligne (articles JSON
 * publiés, anciens articles français non remplacés). Même règle que contexteSite() côté app.
 */
export function contexteSiteNode(racine) {
  const json = articlesEnLigne(racine);
  const remplaces = redirections(json);
  const anciens = existsSync(join(racine, "src/lib/articles.ts")) ? anciensSlugsFr(racine) : [];
  return {
    articles: new Set([...json.map((a) => a.slug), ...anciens.filter((s) => !remplaces[s])]),
  };
}

/** Les dossiers d'outil : sous-dossiers de src/lib/outils/ avec outil.mjs et pages.mjs. */
export function dossiersOutils(racine) {
  const base = join(racine, DOSSIER);
  if (!existsSync(base)) return [];
  return readdirSync(base, { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .map((e) => e.name)
    .filter(
      (nom) => existsSync(join(base, nom, "outil.mjs")) && existsSync(join(base, nom, "pages.mjs")),
    )
    .sort();
}

const importer = (chemin) => import(pathToFileURL(chemin).href);

/**
 * Tous les outils du dépôt, triés par OUTIL.ordre, avec leurs pages publiées et leurs redirections.
 * @param {string} racine racine du dépôt (process.cwd() pour les scripts)
 * @param {{ site?: { articles: ReadonlySet<string> } }} [options] contexte du site (par défaut : lu sur le disque)
 */
export async function decouvrirOutils(racine, options = {}) {
  const dossiers = dossiersOutils(racine);
  if (!dossiers.length) return [];
  const site = options.site ?? contexteSiteNode(racine);
  const erreurs = [];
  const outils = [];

  for (const dossier of dossiers) {
    const base = join(racine, DOSSIER, dossier);
    const [{ OUTIL: outil }, module] = await Promise.all([
      importer(join(base, "outil.mjs")),
      importer(join(base, "pages.mjs")),
    ]);
    const publication = existsSync(join(base, "publication.mjs"))
      ? await importer(join(base, "publication.mjs"))
      : {};
    const ici = `src/lib/outils/${dossier}`;
    if (!outil || typeof outil !== "object") {
      erreurs.push(`${ici}/outil.mjs n'exporte pas OUTIL`);
      continue;
    }
    const manquantes = ["pages", "audit", "redirections"].filter(
      (f) => typeof module[f] !== "function",
    );
    if (manquantes.length) {
      erreurs.push(`${ici}/pages.mjs n'exporte pas : ${manquantes.join(", ")}`);
      continue;
    }
    if (outil.id !== dossier)
      erreurs.push(
        `${ici} : OUTIL.id vaut « ${outil.id} », il doit valoir le nom du dossier (« ${dossier} »)`,
      );
    const chemin = `/outils/${dossier}`;
    if (outil.chemin !== chemin)
      erreurs.push(`${ici} : OUTIL.chemin vaut « ${outil.chemin} », attendu « ${chemin} »`);

    let pages, redirs;
    try {
      pages = module.pages({ site });
      redirs = module.redirections({ site });
    } catch (e) {
      erreurs.push(`${ici}/pages.mjs a levé une erreur : ${e?.message ?? e}`);
      continue;
    }
    if (!Array.isArray(pages) || !pages.length) {
      erreurs.push(`${ici} : pages() doit renvoyer au moins le hub`);
      continue;
    }
    if (pages[0].type !== "hub" || pages[0].chemin !== chemin)
      erreurs.push(`${ici} : pages()[0] doit être le hub (type « hub », chemin « ${chemin} »)`);
    pages.forEach((p, i) => {
      if (i > 0 && p.type === "hub") erreurs.push(`${ici} : un seul hub par outil (${p.chemin})`);
      if (
        typeof p.chemin !== "string" ||
        (p.chemin !== chemin && !p.chemin.startsWith(`${chemin}/`))
      )
        erreurs.push(`${ici} : le chemin « ${p.chemin} » sort de ${chemin}`);
      else if (p.chemin.endsWith("/"))
        erreurs.push(`${ici} : le chemin « ${p.chemin} » finit par /`);
      if (!LASTMOD.test(p.lastmod ?? ""))
        erreurs.push(
          `${ici} : lastmod « ${p.lastmod} » de ${p.chemin} n'est pas au format AAAA-MM-JJ`,
        );
    });
    if (!redirs || typeof redirs !== "object" || Array.isArray(redirs))
      erreurs.push(`${ici} : redirections() doit renvoyer un objet { slug reçu: chemin cible }`);
    outils.push({
      id: dossier,
      dossier: base,
      outil,
      pages,
      redirections: redirs,
      module,
      publication,
      site,
    });
  }

  // Chemins en double, dans un outil ou entre deux outils.
  const vus = new Map();
  for (const o of outils)
    for (const p of o.pages) {
      if (vus.has(p.chemin))
        erreurs.push(`chemin en double : ${p.chemin} (${vus.get(p.chemin)} et ${o.id})`);
      else vus.set(p.chemin, o.id);
    }

  if (erreurs.length) throw new Error(`Outils :\n- ${erreurs.join("\n- ")}`);
  return outils.sort((a, b) => a.outil.ordre - b.outil.ordre || a.id.localeCompare(b.id));
}

/** Valeurs par défaut du sitemap (types.ts, PageOutil) : hub 0.8 weekly, entrée 0.6 monthly. */
export function entreeSitemap(p) {
  const hub = p.type === "hub";
  return {
    chemin: p.chemin,
    lastmod: p.lastmod,
    frequence: p.frequence ?? (hub ? "weekly" : "monthly"),
    priorite: p.priorite ?? (hub ? "0.8" : "0.6"),
  };
}

/**
 * Les URL d'outils du sitemap : /outils (si au moins un outil ; lastmod = le plus récent des hubs),
 * puis les pages de chaque outil, hub en premier.
 */
export function pagesSitemap(outils) {
  if (!outils.length) return [];
  const hubs = outils.map((o) => o.pages[0].lastmod).sort();
  return [
    { chemin: "/outils", lastmod: hubs.at(-1), frequence: "weekly", priorite: "0.8" },
    ...outils.flatMap((o) => o.pages.map(entreeSitemap)),
  ];
}
