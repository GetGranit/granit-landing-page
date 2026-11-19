// Contrat de découverte de l'outil C (mutuelle → portail de tiers payant) : pages(), audit(),
// redirections(). ESM pur, lisible par Node sans option (sitemap, llms.txt, tests) et par le worker
// (serveur.ts) : pas de .ts, pas d'import.meta.glob, pas de node:fs.
//
// Règle de publication (cadre.md § 2 et § 6) : une seule URL par mutuelle.
// - La mutuelle a une fiche /ressources/portail-<x> en ligne : jamais de page d'outil ; son slug part
//   en 301 vers la fiche, et sa ligne du hub y mène.
// - Sinon, une page si l'entrée est dans PRIORITE, sûre, avec au moins un métier sûr, une source datée,
//   assez de texte propre (SEUIL_MOTS_PROPRES) et 2 voisins (pages d'outil ou fiches).
// - Sinon, seulement sa ligne du hub (<details>), et son slug part en 301 vers le hub, ancre #slug.
import donnees from "./donnees.json" with { type: "json" };
import { OUTIL } from "./outil.mjs";
import {
  A_CONFIRMER_VISIBLE,
  ALIAS_FICHES,
  FICHES_OPERATEURS,
  PAGES_MAX,
  PRIORITE,
  SEUIL_MOTS_PROPRES,
} from "./publication.mjs";
import { MIN_VOISINS, compterMotsPropres } from "../socle/mots.mjs";
import { estDateIso, slugifier } from "../socle/texte.mjs";
import { faitsDe, fr, metiersSurs, principauxSurs } from "./releve.mjs";
import { descriptions, forme, h1, textePropre, titres } from "./redaction.mjs";

export { TABLE_METIERS } from "./releve.mjs";

/** Les sources, par identifiant. */
export const SOURCES = new Map(donnees.sources.map((s) => [s.id, s]));

/** Chaque entrée de donnees.json avec ses faits relus (releve.mjs). */
export const ENTREES = donnees.entrees.map((e) => ({ e, faits: faitsDe(e) }));
const parSlug = new Map(ENTREES.map((x) => [x.e.slug, x]));

/** L'entrée d'un slug (serveur.ts, tests). */
export const entree = (slug) => parSlug.get(slug);

const chemin = (slug) => `${OUTIL.chemin}/${slug}`;

/** La fiche /ressources de la mutuelle si elle est en ligne, sinon null. */
export function ficheDe(slug, site) {
  const fiche = `portail-${ALIAS_FICHES[slug] ?? slug}`;
  return site.articles.has(fiche) ? fiche : null;
}

/** Entrées sûres avec au moins un métier sûr : la population du gabarit (toutes, pas la vague). */
const SURES = ENTREES.filter((x) => x.e.statut === "sur" && metiersSurs(x.faits).length);
const COMPTES = new Map(
  compterMotsPropres(SURES.map((x) => textePropre(x.e, x.faits))).map((n, i) => [
    SURES[i].e.slug,
    n,
  ]),
);

/** Mots propres d'une entrée (0 hors de la population). */
export const motsPropresDe = (slug) => COMPTES.get(slug) ?? 0;

const estDatee = (id) => /\b(19|20)\d{2}\b/.test(SOURCES.get(id)?.date_source ?? "");
/** Au moins une source datée parmi celles des métiers sûrs. */
const datee = (x) => principauxSurs(x.faits).some((f) => f.sourceIds.some(estDatee));

/** lastmod et « Vérifié le » : verifie_le s'il existe, sinon la date de génération des données. */
export const lastmodDe = (e) => e.verifie_le ?? donnees.genere_le;

/**
 * Voisins d'une entrée : les autres mutuelles qui ont une page (d'outil publiée, ou fiche en ligne)
 * chez le même opérateur, en tête celles qui partagent le plus de couples (opérateur, métier) ; puis
 * celles du même groupe. 6 au plus, sans ancre.
 * @returns {{ chemin: string, slug: string, memeOperateur: boolean }[]}
 */
export function voisinsDe(x, publiees, site) {
  const surs = principauxSurs(x.faits);
  const ops = new Set(surs.map((f) => f.operateurId));
  const paires = new Set(surs.map((f) => `${f.operateurId}|${f.metier}`));
  const liste = [];
  for (const y of ENTREES) {
    if (y.e.slug === x.e.slug) continue;
    const fiche = ficheDe(y.e.slug, site);
    const c = publiees.has(y.e.slug) ? chemin(y.e.slug) : fiche ? `/ressources/${fiche}` : null;
    if (!c) continue;
    const ySurs = y.faits.filter((f) => f.statut === "sur");
    const memeOperateur = ySurs.some((f) => ops.has(f.operateurId));
    const memeGroupe = Boolean(x.e.groupe) && y.e.groupe === x.e.groupe;
    if (!memeOperateur && !memeGroupe) continue;
    const communs = new Set(
      ySurs.filter((f) => paires.has(`${f.operateurId}|${f.metier}`)).map((f) => f.metier),
    ).size;
    liste.push({ chemin: c, slug: y.e.slug, memeOperateur, memeGroupe, communs, page: !fiche });
  }
  liste.sort(
    (a, b) =>
      Number(b.memeOperateur) - Number(a.memeOperateur) ||
      b.communs - a.communs ||
      Number(b.memeGroupe) - Number(a.memeGroupe) ||
      Number(b.page) - Number(a.page) ||
      a.slug.localeCompare(b.slug),
  );
  return liste
    .slice(0, 6)
    .map(({ chemin: c, slug, memeOperateur }) => ({ chemin: c, slug, memeOperateur }));
}

/** Les entrées qui ont une page (candidates : sans PRIORITE ni PAGES_MAX). */
function publiees({ site, candidates = false }) {
  let liste = SURES.filter(
    (x) =>
      !ficheDe(x.e.slug, site) && (COMPTES.get(x.e.slug) ?? 0) >= SEUIL_MOTS_PROPRES && datee(x),
  );
  if (!candidates)
    liste = PRIORITE.map((s) => liste.find((x) => x.e.slug === s))
      .filter(Boolean)
      .slice(0, PAGES_MAX);
  // Retire, jusqu'à stabilité, les entrées qui n'ont plus assez de voisins publiés.
  for (;;) {
    const slugs = new Set(liste.map((x) => x.e.slug));
    const garde = liste.filter((x) => voisinsDe(x, slugs, site).length >= MIN_VOISINS);
    if (garde.length === liste.length) return liste;
    liste = garde;
  }
}

/** Les slugs publiés en page d'outil. */
export const slugsPublies = (options) => new Set(publiees(options).map((x) => x.e.slug));

function pageEntree(x) {
  const { e, faits } = x;
  return {
    type: "entree",
    chemin: chemin(e.slug),
    slug: e.slug,
    titre: forme(titres(e, faits), 10, 60, `titre de ${e.slug}`),
    description: forme(descriptions(e, faits, SOURCES), 140, 160, `description de ${e.slug}`),
    h1: h1(e, faits),
    lastmod: lastmodDe(e),
  };
}

/** Le hub : titres de textes.md § 1.1. */
export const HUB = {
  titre: fr("Quel portail pour quelle mutuelle ? Tiers payant par métier"),
  description: fr(
    "Cherchez la complémentaire par son nom ou son numéro AMC : le portail de tiers payant relevé pour chaque métier, sa source et sa date. La carte fait foi.",
  ),
  h1: fr("Quel portail de tiers payant pour quelle mutuelle ?"),
};

/** @param {import("../socle/types").OptionsPages} options */
export function pages(options) {
  const entrees = publiees(options).map(pageEntree);
  const lastmod = [donnees.genere_le, ...ENTREES.map((x) => lastmodDe(x.e))]
    .filter(estDateIso)
    .sort()
    .at(-1);
  return [{ type: "hub", chemin: OUTIL.chemin, ...HUB, lastmod }, ...entrees];
}

/**
 * Les sources que la page d'une entrée (ou sa ligne du hub) cite : celles des faits affichés (sûrs, et
 * « à confirmer » si Paul les montre), des réseaux de soins sûrs et du groupe, plus `enPlus`.
 */
export function sourcesPage(x, enPlus = []) {
  const ids = [
    ...new Set([
      ...x.faits
        .filter((f) => f.statut === "sur" || A_CONFIRMER_VISIBLE)
        .flatMap((f) => f.sourceIds),
      ...(x.e.reseau_soins ?? []).filter((r) => r.statut === "sur").flatMap((r) => r.source_ids),
      ...(x.e.groupe_source_ids ?? []),
      ...enPlus,
    ]),
  ];
  return ids.map((id) => SOURCES.get(id)).filter(Boolean);
}

/** Articles liés d'une page : la fiche des opérateurs sûrs (2 au plus), puis mutuelle-quel-portail. */
export function articlesDe(x, site) {
  const fiches = [...new Set(principauxSurs(x.faits).map((f) => FICHES_OPERATEURS[f.operateurId]))]
    .filter((s) => s && site.articles.has(s))
    .slice(0, 2);
  return [...fiches, "mutuelle-quel-portail"].filter((s) => site.articles.has(s)).slice(0, 3);
}

/** Ce que la page affiche comme acquis : les faits sûrs et les réseaux de soins sûrs. */
export function acquisDe(x) {
  return [
    ...x.faits
      .filter((f) => f.statut === "sur")
      .map((f) => ({ id: f.id, statut: f.statut, source_ids: f.sourceIds })),
    ...(x.e.reseau_soins ?? [])
      .filter((r) => r.statut === "sur")
      .map((r) => ({
        id: `${x.e.slug}:reseau:${slugifier(r.nom)}`,
        statut: r.statut,
        source_ids: r.source_ids,
      })),
  ];
}

/** @param {import("../socle/types").OptionsPages} options */
export function audit(options) {
  const liste = publiees(options);
  const slugs = new Set(liste.map((x) => x.e.slug));
  return liste.map((x) => ({
    chemin: chemin(x.e.slug),
    entrees: acquisDe(x),
    sources: sourcesPage(x),
    textePropre: textePropre(x.e, x.faits),
    voisins: voisinsDe(x, slugs, options.site).map((v) => v.chemin),
    articles: articlesDe(x, options.site),
  }));
}

/**
 * 301 : le slug d'une mutuelle à fiche → la fiche ; un autre nom (slugifié) → la page de la mutuelle
 * (page d'outil, fiche ou ligne du hub) ; une entrée connue sans page → le hub, ancre de sa ligne.
 * Toutes les entrées ont une ligne dans le hub. Un autre nom partagé par deux entrées n'est pas redirigé.
 * @param {import("../socle/types").OptionsPages} options
 */
export function redirections(options) {
  const enLigne = slugsPublies(options);
  const r = {};
  const connus = new Set(ENTREES.map((x) => x.e.slug));
  const ambigus = new Set();
  const alias = new Map();
  for (const { e } of ENTREES) {
    const fiche = ficheDe(e.slug, options.site);
    const cible = enLigne.has(e.slug)
      ? chemin(e.slug)
      : fiche
        ? `/ressources/${fiche}`
        : `${OUTIL.chemin}#${e.slug}`;
    if (!enLigne.has(e.slug)) r[e.slug] = cible;
    for (const nom of [e.mutuelle, ...(e.autres_noms ?? [])]) {
      const s = slugifier(nom);
      if (!s || connus.has(s)) continue;
      if (alias.has(s) && alias.get(s) !== cible) ambigus.add(s);
      else alias.set(s, cible);
    }
  }
  for (const [s, cible] of alias) if (!ambigus.has(s)) r[s] = cible;
  return r;
}
