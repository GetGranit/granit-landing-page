// Outil A, codes rejet : contrat de découverte du socle (pages, audit, redirections) et ce que
// serveur.ts sert aux routes (lignes du hub, modèle d'une page, résolution d'une adresse).
// La même fonction `publiees` décide pour le sitemap, les routes et les tests : une entrée est en
// ligne si et seulement si elle est dans pages().
//
// ESM pur, lisible par Node sans option, sans node:fs (le même fichier tourne dans le worker).
// Jamais importé par une route ni un composant : seulement par serveur.ts et les scripts Node.
import donnees from "./donnees.json" with { type: "json" };
import { OUTIL } from "./outil.mjs";
import { FAMILLES, PAGES_MAX, PRIORITE, SEUIL_MOTS_PROPRES } from "./publication.mjs";
import { MIN_VOISINS, compterMotsPropres } from "../socle/mots.mjs";
import { cleCode, estDateIso, normaliser, slugifier } from "../socle/texte.mjs";
import * as M from "./modele.mjs";

export { TABLE_METIERS } from "./modele.mjs";

const NB = "\u00a0";

/** Le hub (textes.md § 1.1). */
export const HUB = {
  titre: `Liste des codes rejets NOEMIE${NB}: sens, cause et correction`,
  description:
    "Les codes rejets NOEMIE publiés par les caisses, code par code\u00a0: libellé, cause probable, quoi corriger et métiers concernés, avec la source et sa date.",
  h1Titre: `Codes rejets NOEMIE et télétransmission${NB}:`,
  h1Accent: "la liste, code par code",
};

/** Groupes du hub : un par famille ouverte en liste (cadre.md § 3). */
const GROUPES = [
  { famille: "noemie", id: "famille-noemie", titre: "Rejets NOEMIE" },
  { famille: "arl", id: "famille-arl", titre: "ARL négatifs" },
  { famille: "sesam-vitale", id: "famille-sesam-vitale", titre: "Messages de service" },
];

/** Sources que la méthode et la FAQ du hub citent, en plus de celles des lignes. */
const SOURCES_METHODE = [
  "cdc-noemie-ps-2004",
  "ameli-medecin-rejets-2026",
  "ameli-pharmacien-retour-noemie-2022",
  "ameli-pharmacien-fse-mode-emploi-2021",
  "gie-cdc-annexe1b-2025",
];

const sures = donnees.entrees.filter((e) => e.statut === "sur");
const tousLesSlugs = new Set(donnees.entrees.map((e) => e.slug));

// Mots propres : le gabarit est calculé sur toutes les entrées sûres, pas seulement la vague.
const comptes = new Map(
  compterMotsPropres(sures.map(M.textePropre)).map((n, i) => [sures[i].slug, n]),
);

/** Mots propres d'une entrée sûre (seuil du socle), pour les tests et la PR. */
export const motsPropresEntree = (slug) => comptes.get(slug);

const TOUT_OUVERT = Object.fromEntries(
  [...new Set([...Object.keys(FAMILLES), ...donnees.entrees.map((e) => e.famille)])].map((f) => [
    f,
    { liste: true, pages: true },
  ]),
);

/**
 * Les familles en vigueur : celles de publication.mjs, ou toutes ouvertes pour les candidates.
 * `options.familles` (tests, comptes de la PR) simule un autre réglage sans toucher au fichier.
 */
const familles = (o = {}) => (o.candidates ? TOUT_OUVERT : (o.familles ?? FAMILLES));

const datee = (e) => e.source_ids.some((id) => M.estDatee(M.sources.get(id)));
const lastmod = (e) => e.verifie_le ?? donnees.genere_le;

const cache = new Map();

/**
 * Les entrées qui ont une page : sûres, d'une famille ouverte en pages, au-dessus du seuil, avec une
 * source datée, dans PRIORITE (coupée à PAGES_MAX), puis, jusqu'à stabilité, avec au moins
 * MIN_VOISINS voisins publiés. Candidates : sans PRIORITE, PAGES_MAX ni familles fermées.
 */
function publiees(o = {}) {
  const fam = familles(o);
  // `options.seuil` (tests, comptes de la PR) simule un autre seuil sans toucher à publication.mjs.
  const seuil = o.seuil ?? SEUIL_MOTS_PROPRES;
  const cle = `${o.candidates ? 1 : 0}|${seuil}|${JSON.stringify(fam)}`;
  if (cache.has(cle)) return cache.get(cle);
  let liste = sures.filter(
    (e) => fam[e.famille]?.pages && comptes.get(e.slug) >= seuil && datee(e),
  );
  if (!o.candidates)
    liste = PRIORITE.map((s) => liste.find((e) => e.slug === s))
      .filter(Boolean)
      .slice(0, PAGES_MAX);
  for (;;) {
    const slugs = new Set(liste.map((e) => e.slug));
    const garde = liste.filter((e) => M.voisins(e, slugs).length >= MIN_VOISINS);
    if (garde.length === liste.length) break;
    liste = garde;
  }
  cache.set(cle, liste);
  return liste;
}

/** Les entrées listées dans le hub : sûres, d'une famille ouverte en liste. */
function listees(o = {}) {
  const fam = familles(o);
  return sures.filter((e) => fam[e.famille]?.liste);
}

function pageEntree(e) {
  return {
    type: "entree",
    chemin: M.cheminEntree(e.slug),
    slug: e.slug,
    titre: M.titre(e),
    description: M.description(e),
    h1: M.h1(e),
    lastmod: lastmod(e),
  };
}

/** @param {import("../socle/types").OptionsPages} options */
export function pages(options) {
  const entrees = publiees(options).map(pageEntree);
  return [
    {
      type: "hub",
      chemin: OUTIL.chemin,
      titre: HUB.titre,
      description: HUB.description,
      h1: `${HUB.h1Titre} ${HUB.h1Accent}`,
      lastmod: [donnees.genere_le, ...listees(options).map(lastmod)]
        .filter(estDateIso)
        .sort()
        .at(-1),
    },
    ...entrees,
  ];
}

/** @param {import("../socle/types").OptionsPages} options */
export function audit(options) {
  const liste = publiees(options);
  const slugs = new Set(liste.map((e) => e.slug));
  return liste.map((e) => ({
    chemin: M.cheminEntree(e.slug),
    entrees: [{ id: e.slug, statut: e.statut, source_ids: e.source_ids }],
    sources: M.sourcesEntree(e),
    textePropre: M.textePropre(e),
    voisins: M.voisins(e, slugs).map((x) => M.cheminEntree(x.slug)),
    articles: M.articles(e, options.site),
  }));
}

/** Les écritures d'un code reçues dans une adresse : « 0450054 », « 450054 », « 0450-054 »… */
function clesAdresse(e) {
  const formes = [e.code, ...(e.autres_ecritures ?? [])];
  if (/^0\d{6}$/.test(e.code)) formes.push(e.code.slice(1));
  if (/^\d{7}$/.test(e.code)) formes.push(`${e.code.slice(0, 4)}-${e.code.slice(4)}`);
  return [...new Set(formes.flatMap((f) => [cleCode(f), slugifier(f)]).filter(Boolean))].filter(
    (k) => !tousLesSlugs.has(k),
  );
}

/** Écritures partagées par plusieurs entrées listées (ARL 2004, 4005…) : clé → entrées. */
function ecrituresParCle(o) {
  const par = new Map();
  for (const e of listees(o))
    for (const k of clesAdresse(e)) par.set(k, [...(par.get(k) ?? []), e]);
  return par;
}

/**
 * 301 (cadre.md § 6) : chaque écriture d'un code listé vers sa page, ou vers sa ligne du hub
 * (`#slug`) s'il n'a pas de page ; une entrée connue sans page (sous le seuil, famille fermée,
 * à vérifier) vers le hub, avec l'ancre de sa ligne si elle est listée. Une écriture partagée par
 * deux entrées n'est pas ici : serveur.ts l'envoie en 302 vers la recherche du hub.
 * @param {import("../socle/types").OptionsPages} options
 */
export function redirections(options) {
  const enLigne = new Set(publiees(options).map((e) => e.slug));
  const visibles = new Set(listees(options).map((e) => e.slug));
  const cible = (e) =>
    enLigne.has(e.slug)
      ? M.cheminEntree(e.slug)
      : visibles.has(e.slug)
        ? `${OUTIL.chemin}#${e.slug}`
        : OUTIL.chemin;
  const r = {};
  for (const e of donnees.entrees) if (!enLigne.has(e.slug)) r[e.slug] = cible(e);
  for (const [k, es] of ecrituresParCle(options)) if (es.length === 1) r[k] = cible(es[0]);
  return r;
}

/**
 * Ce que serveur.ts fait d'une adresse /outils/codes-rejet/<slug> :
 * page publiée ; 301 (redirections(), après avoir essayé l'adresse telle quelle, sa clé de code et
 * son slug) ; 302 vers ?q= pour une écriture partagée par deux codes ; sinon introuvable (404).
 * @param {string} slug
 * @param {import("../socle/types").OptionsPages} options
 */
export function resoudre(slug, options) {
  const enLigne = new Set(publiees(options).map((e) => e.slug));
  if (enLigne.has(slug)) return { type: "page", slug };
  const r = redirections(options);
  const brut = String(slug ?? "");
  for (const k of [brut, cleCode(brut), slugifier(brut)]) {
    if (k && enLigne.has(k)) return { type: "redirection", vers: M.cheminEntree(k) };
    if (k && Object.hasOwn(r, k)) return { type: "redirection", vers: r[k] };
  }
  const partagee = ecrituresParCle(options).get(cleCode(brut));
  if (partagee && partagee.length > 1)
    return { type: "recherche", vers: `${OUTIL.chemin}?q=${encodeURIComponent(partagee[0].code)}` };
  return { type: "introuvable" };
}

// ─── Hub ──────────────────────────────────────────────────────────────────────────────────────

/** Ordre du hub : familles dans l'ordre des groupes, codes par ordre croissant, motifs sans code en dernier. */
function ordreHub(a, b) {
  const g = (e) => GROUPES.findIndex((x) => x.famille === e.famille);
  const num = (e) => (/^\d+$/.test(e.code) ? 0 : 1);
  return (
    g(a) - g(b) ||
    num(a) - num(b) ||
    String(a.code).localeCompare(String(b.code)) ||
    a.slug.localeCompare(b.slug)
  );
}

/**
 * Les lignes du hub : une par entrée listée, dans le HTML serveur. Ligne avec page : un lien ;
 * sans page : le corps du <details> (libellé, explication, cause, action, source principale).
 * @param {import("../socle/types").OptionsPages} options
 */
export function lignesHub(options) {
  const enLigne = new Set(publiees(options).map((e) => e.slug));
  return listees(options)
    .sort(ordreHub)
    .map((e) => {
      const page = enLigne.has(e.slug);
      const s = M.sourcePrincipale(e);
      const cles = [e.code, ...(e.autres_ecritures ?? [])];
      if (/^0\d{6}$/.test(e.code)) cles.push(e.code.slice(1));
      return {
        id: e.slug,
        code: M.codeAffiche(e),
        titre: M.libelleAffiche(e.libelle_officiel),
        resume: M.premierePhrase(e.explication),
        groupe: GROUPES.find((g) => g.famille === e.famille)?.id ?? e.famille,
        facettes: { metier: M.metiersEntree(e) },
        chemin: page ? M.cheminEntree(e.slug) : undefined,
        cles: [...new Set(cles.map(cleCode).filter(Boolean))],
        texte: normaliser(
          [e.libelle_officiel, ...(e.libelles_variantes ?? []).map((v) => v.texte)].join(" "),
        ),
        details: page
          ? undefined
          : {
              explication: M.typo(e.explication),
              causes: M.causes(e),
              etapes: M.etapes(e),
              metiers: M.libelleMetiers(M.metiersEntree(e)),
              source: {
                id: s.id,
                editeur: M.nomSource(s).court,
                titre: s.titre,
                url: s.url,
                date: M.dateSource(s),
              },
            },
      };
    });
}

/** Les groupes du hub qui ont des lignes. */
export function groupesHub(options) {
  const fam = familles(options);
  return GROUPES.filter((g) => fam[g.famille]?.liste).map(({ id, titre }) => ({ id, titre }));
}

/** Groupe d'une source dans le bloc Sources du hub. */
const groupeSource = (id) =>
  /^(ameli-|cpam|fiche-)/.test(id)
    ? "Assurance Maladie et CPAM"
    : /^(gie|cdc)-/.test(id)
      ? "Cahiers des charges (sesam-vitale.fr)"
      : "Éditeurs et organismes concentrateurs";

/**
 * Sources du hub, groupées : celles des lignes listées et celles que la méthode cite, du document
 * le plus récent au plus ancien dans chaque groupe.
 * @param {import("../socle/types").OptionsPages} options
 */
export function sourcesHub(options) {
  const ids = new Set([...listees(options).flatMap((e) => e.source_ids), ...SOURCES_METHODE]);
  const toutes = M.sourcesEntree({ source_ids: [...ids] });
  const titres = [
    "Assurance Maladie et CPAM",
    "Cahiers des charges (sesam-vitale.fr)",
    "Éditeurs et organismes concentrateurs",
  ];
  return titres
    .map((titre) => ({
      titre,
      sources: toutes.filter((s) => groupeSource(s.id) === titre).map(M.sourceAffichee),
    }))
    .filter((g) => g.sources.length);
}

/**
 * Ce que le hub dit de ses données : les années des mémos des caisses qui donnent les libellés
 * officiels listés, et si les familles du GIE sont ouvertes (avertissement, état vide).
 * @param {import("../socle/types").OptionsPages} options
 */
export function infosHub(options) {
  const fam = familles(options);
  const annees = listees(options)
    .filter((e) => e.famille === "noemie" && e.source_ids[0].startsWith("cpam"))
    .map((e) => M.anneeSource(M.sourcePrincipale(e)))
    .filter(Boolean)
    .sort();
  const gie = M.sources.get("gie-cdc-annexe1b-2025");
  return {
    anneesMemos: [annees[0], annees.at(-1)],
    gieListe: Boolean(fam.arl?.liste || fam["sesam-vitale"]?.liste),
    dateGie: M.dateSource(gie),
  };
}

// ─── Page d'entrée ────────────────────────────────────────────────────────────────────────────

/**
 * Tout ce que la page d'une entrée publiée affiche, déjà mis en mots (le composant ne fait que
 * le rendre). undefined si le slug n'est pas une page publiée.
 * @param {string} slug
 * @param {import("../socle/types").OptionsPages} options
 */
export function modeleEntree(slug, options) {
  const liste = publiees(options);
  const e = liste.find((x) => x.slug === slug);
  if (!e) return undefined;
  const slugs = new Set(liste.map((x) => x.slug));
  const vs = M.voisins(e, slugs);
  const metiers = M.metiersEntree(e);
  return {
    slug: e.slug,
    code: M.codeAffiche(e),
    famille: e.famille,
    surTitre: M.surTitre(e),
    reponse: M.reponse(e).phrases,
    metiers,
    essentiel: M.essentiel(e),
    avertissement: M.avertissement(e),
    libelles: M.libelles(e),
    ecritures: M.ecritures(e),
    ...M.sectionsCauseAction(e),
    question: M.question(e),
    note: M.note(e),
    sources: M.sourcesEntree(e).map(M.sourceAffichee),
    voisins: { titre: M.titreVoisins(e, vs), entrees: vs.map(M.carteVoisin) },
    articles: M.articles(e, options.site),
    outilsLies: M.outilsLies(e),
  };
}
