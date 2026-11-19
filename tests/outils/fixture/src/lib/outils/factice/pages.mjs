// Contrat de découverte de l'outil factice (fixture des tests du socle) : pages(), audit(),
// redirections(). ESM pur, lisible par Node sans option : pas de .ts, pas d'import.meta.glob.
// Dans un vrai outil, les imports du socle s'écrivent « ../socle/mots.mjs » ; ici la fixture vit
// sous tests/, d'où le long chemin relatif.
import donnees from "./donnees.json" with { type: "json" };
import { OUTIL } from "./outil.mjs";
import { FAMILLES, PAGES_MAX, PRIORITE, SEUIL_MOTS_PROPRES } from "./publication.mjs";
import {
  MIN_VOISINS,
  compterMotsPropres,
} from "../../../../../../../src/lib/outils/socle/mots.mjs";
import { versMetiers } from "../../../../../../../src/lib/outils/socle/metiers.mjs";
import { cleCode, estDateIso } from "../../../../../../../src/lib/outils/socle/texte.mjs";

/** Clés métier des données → métiers du site (socle). */
export const TABLE_METIERS = { "optique-audio": "optique" };

const sures = donnees.entrees.filter((e) => e.statut === "sur");
const parSlug = new Map(donnees.entrees.map((e) => [e.slug, e]));
const sources = new Map(donnees.sources.map((s) => [s.id, s]));
const chemin = (slug) => `${OUTIL.chemin}/${slug}`;

/** Le texte propre d'une entrée, tel que la page le rend (sans intertitres ni blocs communs). */
export const textePropre = (e) => [e.libelle, e.explication, e.cause, e.action].join(" ");

// Mots propres : le gabarit est calculé sur toutes les entrées sûres, pas seulement la vague.
const comptes = new Map(
  compterMotsPropres(sures.map(textePropre)).map((n, i) => [sures[i].slug, n]),
);

const datee = (e) =>
  e.source_ids.some((id) => /\b(19|20)\d{2}\b/.test(sources.get(id)?.date_source ?? ""));
const lastmod = (e) => e.verifie_le ?? donnees.genere_le;

/** Voisins publiés d'une entrée : pages de l'outil, puis articles /ressources en ligne. */
function voisinsDe(e, publiees, site) {
  return [
    ...(e.voisins ?? []).filter((s) => publiees.has(s)).map(chemin),
    ...(e.voisins_ressources ?? [])
      .filter((s) => site.articles.has(s))
      .map((s) => `/ressources/${s}`),
  ];
}

/** Les entrées qui ont une page (candidates : sans la vague ni les familles fermées). */
function publiees({ site, candidates = false }) {
  let liste = sures.filter((e) => comptes.get(e.slug) >= SEUIL_MOTS_PROPRES && datee(e));
  if (!candidates)
    liste = PRIORITE.map((s) => liste.find((e) => e.slug === s))
      .filter((e) => e && FAMILLES[e.famille]?.pages)
      .slice(0, PAGES_MAX);
  // Retire, jusqu'à stabilité, les entrées qui n'ont plus assez de voisins publiés.
  for (;;) {
    const slugs = new Set(liste.map((e) => e.slug));
    const garde = liste.filter((e) => voisinsDe(e, slugs, site).length >= MIN_VOISINS);
    if (garde.length === liste.length) return liste;
    liste = garde;
  }
}

/** La première forme dont la longueur tient dans les bornes, sinon une erreur (le build s'arrête). */
function forme(formes, min, max, quoi) {
  const ok = formes.find((f) => f.length >= min && f.length <= max);
  if (!ok) throw new Error(`${quoi} : aucune forme entre ${min} et ${max} caractères`);
  return ok;
}

function pageEntree(e) {
  return {
    type: "entree",
    chemin: chemin(e.slug),
    slug: e.slug,
    titre: forme(
      [`Code factice ${e.code}\u00a0: ${e.libelle.toLowerCase()}`, `Code factice ${e.code}`],
      10,
      60,
      `titre de ${e.slug}`,
    ),
    description: forme(
      [
        `Code factice ${e.code} «\u00a0${e.libelle}\u00a0»\u00a0: ce qu'il signale, la cause probable et quoi corriger avant de renvoyer le dossier de démonstration.`,
        `Code factice ${e.code} «\u00a0${e.libelle}\u00a0»\u00a0: ce qu'il signale, la cause probable et quoi corriger avant de renvoyer le dossier.`,
      ],
      140,
      160,
      `description de ${e.slug}`,
    ),
    h1: `Code factice ${e.code}\u00a0: «\u00a0${e.libelle}\u00a0»`,
    lastmod: lastmod(e),
  };
}

/** @param {import("../../../../../../../src/lib/outils/socle/types").OptionsPages} options */
export function pages(options) {
  const entrees = publiees(options).map(pageEntree);
  return [
    {
      type: "hub",
      chemin: OUTIL.chemin,
      titre: "Outil factice\u00a0: la liste de démonstration",
      description:
        "La liste de démonstration du socle des outils, code par code\u00a0: ce que signale chaque code, la cause probable, quoi corriger et la source datée.",
      h1: "Outil factice\u00a0: la liste de démonstration",
      lastmod: [donnees.genere_le, ...entrees.map((p) => p.lastmod)]
        .filter(estDateIso)
        .sort()
        .at(-1),
    },
    ...entrees,
  ];
}

/** @param {import("../../../../../../../src/lib/outils/socle/types").OptionsPages} options */
export function audit(options) {
  const liste = publiees(options);
  const slugs = new Set(liste.map((e) => e.slug));
  return liste.map((e) => ({
    chemin: chemin(e.slug),
    entrees: [{ id: e.slug, statut: e.statut, source_ids: e.source_ids }],
    sources: e.source_ids.map((id) => sources.get(id)).filter(Boolean),
    textePropre: textePropre(e),
    voisins: voisinsDe(e, slugs, options.site),
    articles: e.articles ?? ["guide-factice"],
  }));
}

/**
 * 301 : le code (sous toutes ses écritures) vers la page ; une entrée connue sans page vers le hub,
 * avec l'ancre de sa ligne si elle est listée.
 * @param {import("../../../../../../../src/lib/outils/socle/types").OptionsPages} options
 */
export function redirections(options) {
  const enLigne = new Set(publiees(options).map((e) => e.slug));
  const r = {};
  for (const e of donnees.entrees) {
    const listee = e.statut === "sur" && FAMILLES[e.famille]?.liste;
    const cible = enLigne.has(e.slug)
      ? chemin(e.slug)
      : listee
        ? `${OUTIL.chemin}#${e.slug}`
        : OUTIL.chemin;
    if (!enLigne.has(e.slug)) r[e.slug] = cible;
    if (e.code && cleCode(e.code) !== e.slug) r[cleCode(e.code)] = cible;
  }
  return r;
}

/** Pour serveur.ts et les tests propres : l'entrée d'un slug publié. */
export const entree = (slug) => parSlug.get(slug);
