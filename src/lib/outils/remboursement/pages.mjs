// Contrat de découverte de l'outil B · Remboursement (socle.md § 2.3) : pages(), audit(),
// redirections(). ESM pur, lisible par Node 22 sans option ; le même fichier tourne dans le worker
// (serveur.ts). La même fonction décide de la publication pour le sitemap, les routes et les tests.
//
// Une page par GROUPE (cadre.md § 3), jamais par code LPP. Un groupe a sa page s'il est dans
// PRIORITE, si son métier a `pages: true`, si tous ses codes sont `sur`, s'il a ses textes écrits
// (groupes.mjs), s'il passe le seuil de mots propres et s'il a 2 voisins publiés (cadre.md § 4).
//
// La décision ne dépend pas du jour : elle est prise avec le texte rendu à la date des données
// (`donnees.genere_le`). Un test vérifie que les mêmes groupes passent le seuil avec le texte rendu
// après le 01/01/2027 (taux non publié) : la bascule ne fait tomber aucune page.
import { OUTIL } from "./outil.mjs";
import { METIERS, PAGES_MAX, PRIORITE, SEUIL_MOTS_PROPRES } from "./publication.mjs";
import { GROUPES, groupeRedige } from "./groupes.mjs";
import { contenuGroupe, textePropre, typo } from "./contenu.mjs";
import { HUB } from "./textesHub.mjs";
import { SOURCES, contexte, donnees, entreesDuGroupe, groupeDe, ouvert } from "./entrees.mjs";
import { MIN_VOISINS, compterMotsPropres } from "../socle/mots.mjs";
import { estDateIso } from "../socle/texte.mjs";

const chemin = (slug) => `${OUTIL.chemin}/${slug}`;
const datee = (id) => /\b(19|20)\d{2}\b/.test(SOURCES.get(id)?.date_source ?? "");

/** Ancre d'une ligne (hub) ou d'une ligne de tableau (page de groupe). */
export function ancreCode(e) {
  if (e.type_code === "LPP") return `lpp-${e.code}`;
  if (e.type_code === "CCAM") return `ccam-${String(e.code).toLowerCase()}`;
  return `cip-${e.code}`;
}

/** lastmod d'une entrée : verifie_le si le champ existe, sinon la date des données (socle § 2.4). */
const lastmodEntree = (e) => e.verifie_le ?? donnees.genere_le;
const lastmodGroupe = (codes) =>
  codes.map(lastmodEntree).filter(estDateIso).sort().at(-1) ?? donnees.genere_le;

/** Les sources d'un groupe : celles de ses codes et de ses textes, dans l'ordre de donnees.json. */
export function sourcesGroupe(g, codes, extra = []) {
  const ids = new Set([
    ...codes.flatMap((e) => e.source_ids),
    ...(g.texte ?? []).flatMap((t) => t.source_ids),
    ...extra,
  ]);
  return donnees.sources.filter((s) => ids.has(s.id));
}

// Les groupes qui pourraient avoir une page : textes écrits, au moins un code, tous `sur`, sources
// datées. Le gabarit du seuil est calculé sur eux tous (pas seulement la vague).
const REDIGES = GROUPES.filter((g) => groupeRedige(g))
  .map((g) => ({ g, codes: entreesDuGroupe(g) }))
  .filter(({ codes }) => codes.length && codes.every((e) => e.statut === "sur"));

/** Le contenu rendu de chaque groupe rédigé, un jour donné (défaut : la date des données). */
export function contenus(jour = donnees.genere_le, ctx = {}) {
  return new Map(
    REDIGES.map(({ g, codes }) => [g.slug, contenuGroupe(g, codes, { ...contexte(jour, ctx) })]),
  );
}

/** Mots propres de chaque groupe rédigé, le gabarit étant calculé sur tous (socle § 4). */
export function comptesMots(jour = donnees.genere_le, ctx = {}) {
  const c = contenus(jour, ctx);
  const slugs = REDIGES.map(({ g }) => g.slug);
  const n = compterMotsPropres(slugs.map((s) => textePropre(c.get(s))));
  return new Map(slugs.map((s, i) => [s, n[i]]));
}

const COMPTES = comptesMots();

/** Voisins publiés d'un groupe (chemins des pages), dans l'ordre déclaré, 6 au plus. */
function voisinsDe(g, publies) {
  return (g.voisins ?? [])
    .filter((s) => s !== g.slug && publies.has(s))
    .slice(0, 6)
    .map(chemin);
}

/**
 * Les groupes qui ont une page.
 * @param {{ candidates?: boolean, metiers?: typeof METIERS }} options `candidates` : sans la vague
 *   (PRIORITE, PAGES_MAX) ni les métiers fermés ; `metiers` : pour les tests (défaut : METIERS).
 */
export function groupesPublies({ candidates = false, metiers = METIERS } = {}) {
  let liste = REDIGES.filter(
    ({ g, codes }) =>
      COMPTES.get(g.slug) >= SEUIL_MOTS_PROPRES && codes.some((e) => e.source_ids.some(datee)),
  ).map(({ g }) => g);
  if (!candidates)
    liste = PRIORITE.map((s) => liste.find((g) => g.slug === s))
      .filter((g) => g && ouvert(g.metier, "pages", metiers) && ouvert(g.metier, "liste", metiers))
      .slice(0, PAGES_MAX);
  // Retire, jusqu'à stabilité, les groupes qui n'ont plus assez de voisins publiés.
  for (;;) {
    const slugs = new Set(liste.map((g) => g.slug));
    const garde = liste.filter((g) => voisinsDe(g, slugs).length >= MIN_VOISINS);
    if (garde.length === liste.length) return liste;
    liste = garde;
  }
}

function pageGroupe(g) {
  return {
    type: "entree",
    chemin: chemin(g.slug),
    slug: g.slug,
    titre: typo(g.titre),
    description: typo(g.description),
    h1: typo(g.h1),
    lastmod: lastmodGroupe(entreesDuGroupe(g)),
  };
}

/** @param {import("../socle/types").OptionsPages & { metiers?: typeof METIERS }} options */
export function pages(options) {
  const entrees = groupesPublies(options).map(pageGroupe);
  return [
    {
      type: "hub",
      chemin: OUTIL.chemin,
      titre: typo(HUB.titre),
      description: typo(HUB.description),
      h1: typo(`${HUB.titreH1} ${HUB.accent}`),
      lastmod: [donnees.genere_le, ...entrees.map((p) => p.lastmod)]
        .filter(estDateIso)
        .sort()
        .at(-1),
    },
    ...entrees,
  ];
}

/** @param {import("../socle/types").OptionsPages & { metiers?: typeof METIERS }} options */
export function audit(options) {
  const liste = groupesPublies(options);
  const slugs = new Set(liste.map((g) => g.slug));
  const c = contenus();
  return liste.map((g) => {
    const codes = entreesDuGroupe(g);
    return {
      chemin: chemin(g.slug),
      // Ce que la page affiche comme acquis : chaque code du tableau.
      entrees: codes.map((e) => ({ id: e.slug, statut: e.statut, source_ids: e.source_ids })),
      sources: sourcesGroupe(g, codes),
      textePropre: textePropre(c.get(g.slug)),
      voisins: voisinsDe(g, slugs),
      articles: (g.articles ?? []).filter((s) => options.site.articles.has(s)),
    };
  });
}

/**
 * 301 (cadre.md § 7) : `lpp-<code>`, `<code>` et le slug de donnees.json mènent à la ligne du code
 * dans la page de son groupe (`<groupe>#lpp-<code>`), ou dans le hub (`#lpp-<code>`) si le groupe
 * n'a pas de page. Seulement pour les codes listés dans le hub (statut `sur`, métier ouvert) ; un
 * code CCAM d'un dentaire fermé reste en 404, avec le message « le dentaire n'est pas encore dans
 * l'outil ». Pas d'URL par CIP (seo.md).
 * @param {import("../socle/types").OptionsPages & { metiers?: typeof METIERS }} options
 */
export function redirections(options) {
  const publies = new Set(groupesPublies(options).map((g) => g.slug));
  const r = {};
  for (const e of donnees.entrees) {
    if (e.statut !== "sur" || !e.code || e.type_code === "CIP13") continue;
    if (!ouvert(e.metier, "liste", options.metiers)) continue;
    const g = groupeDe(e);
    const ancre = ancreCode(e);
    const cible =
      g && publies.has(g.slug) ? `${chemin(g.slug)}#${ancre}` : `${OUTIL.chemin}#${ancre}`;
    for (const cle of [ancre, String(e.code).toLowerCase(), e.slug])
      if (!publies.has(cle)) r[cle] = cible;
  }
  return r;
}
