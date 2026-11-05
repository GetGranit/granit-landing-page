// Règle « en ligne » de la rubrique d'actualités, écrite une seule fois.
// Utilisée par le plugin Vite (scripts/actualites/vite-plugin.ts), le sitemap, llms.txt et les tests.
//
// Une édition est un fichier content/actualites/{slug}.json. Elle n'est en ligne que si son statut
// vaut « publie » et qu'elle passe tous les contrôles : une édition « publie » incomplète fait
// échouer le build, elle ne se met jamais en ligne à moitié. Un statut inconnu est refusé
// à la lecture : une faute de frappe ne publie jamais rien.
// Node pur, sans TypeScript : gen-llms.mjs et gen-sitemap.mjs tournent sans drapeau.
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { basename, join } from "node:path";

export const STATUTS = ["brouillon", "publie"];
export const FORMATS = ["ce-qui-change", "le-reflexe", "le-controle", "le-releve"];

/** Les seuls champs qui quittent le fichier pour le site : une note de travail n'y entre jamais. */
const CHAMPS_PUBLICS = [
  "slug",
  "numero",
  "format",
  "fait",
  "titre",
  "seoTitle",
  "chapo",
  "metaDescription",
  "metiers",
  "datePublished",
  "dateModified",
  "change",
  "qui",
  "gestes",
  "inconnu",
  "sources",
  "relecteur",
  "statut",
  "chiffres",
];
/** Champ de travail : ce qui reste à contrôler. Jamais affiché, vide avant publication. */
const NOTES = "reste_a_verifier";

const SLUG = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const DATE = /^\d{4}-\d{2}-\d{2}$/;

const lireJson = (p) => JSON.parse(readFileSync(p, "utf8"));
const estTexte = (v) => typeof v === "string" && v.trim().length > 0;
const estListeDeTextes = (v) => Array.isArray(v) && v.length > 0 && v.every(estTexte);
const estDate = (v) =>
  typeof v === "string" && DATE.test(v) && !Number.isNaN(Date.parse(`${v}T00:00:00Z`));

/**
 * Une marque de relecture : un crochet n'importe où, ou un texte qui commence par une consigne
 * (« À contrôler le matin de la publication… »). « La liste à vérifier avant un contrôle » ou
 * « il reste à confirmer » sont des phrases, pas des marques : elles ne bloquent pas.
 */
export function estMarque(texte) {
  return (
    /\[[^\]]*\]/.test(texte) ||
    /^\s*à (vérifier|sourcer|confirmer|préciser|retrouver|contrôler|compléter)(\s|:|$)/i.test(texte)
  );
}

function chaines(v) {
  if (typeof v === "string") return [v];
  if (Array.isArray(v)) return v.flatMap(chaines);
  if (v && typeof v === "object") return Object.values(v).flatMap(chaines);
  return [];
}

/** Les slugs de métier admis : ceux des pages métier, jamais un ancien slug fusionné. */
export function metiersValides(racine) {
  return lireJson(join(racine, "src/lib/ressources/verticales.json")).ordre;
}

/** Tous les fichiers d'éditions, triés du plus récent au plus ancien. Le slug vient du nom de fichier. */
export function lireEditions(racine) {
  const dossier = join(racine, "content/actualites");
  if (!existsSync(dossier)) return [];
  const editions = readdirSync(dossier)
    .filter((f) => f.endsWith(".json"))
    .map((f) => {
      const p = join(dossier, f);
      let contenu;
      try {
        contenu = lireJson(p);
      } catch (e) {
        throw new Error(`Actualités : ${f} est illisible (${e.message})`);
      }
      if (!STATUTS.includes(contenu?.statut))
        throw new Error(`Actualités : ${f} a un statut inconnu (${contenu?.statut})`);
      return { ...contenu, slug: basename(f, ".json"), fichier: p };
    });
  return editions.sort((a, b) => (b.numero ?? 0) - (a.numero ?? 0));
}

function validerChiffres(e, erreurs) {
  if (e.format !== "le-releve") {
    if (e.chiffres !== undefined) erreurs.push("chiffres interdits hors du format le-releve");
    return;
  }
  const ok =
    Array.isArray(e.chiffres) &&
    e.chiffres.length > 0 &&
    e.chiffres.every((c) => estTexte(c?.valeur) && estTexte(c?.libelle));
  if (!ok) erreurs.push("chiffres requis pour le format le-releve");
}

function validerQui(qui, erreurs) {
  if (!estTexte(qui?.texte)) erreurs.push("qui.texte manquant");
  if (qui?.tableau === undefined) return;
  const { entetes, lignes } = qui.tableau;
  const ok =
    estListeDeTextes(entetes) &&
    Array.isArray(lignes) &&
    lignes.length > 0 &&
    lignes.every((l) => estListeDeTextes(l) && l.length === entetes.length);
  if (!ok) erreurs.push("qui.tableau mal formé");
}

/** Forme du fichier, quel que soit le statut. Renvoie la liste des erreurs. */
export function validerStructure(e, metiers) {
  const erreurs = [];
  if (!SLUG.test(e.slug ?? "")) erreurs.push(`slug invalide : ${e.slug}`);
  if (!Number.isInteger(e.numero) || e.numero < 1) erreurs.push("numero invalide");
  if (!FORMATS.includes(e.format)) erreurs.push(`format inconnu : ${e.format}`);
  for (const c of ["fait", "titre", "seoTitle", "chapo", "metaDescription"])
    if (!estTexte(e[c])) erreurs.push(`${c} manquant`);
  if (typeof e.seoTitle === "string" && e.seoTitle.length > 60)
    erreurs.push(`seoTitle de ${e.seoTitle.length} caractères (60 au plus)`);
  if (!Array.isArray(e.metiers) || e.metiers.length === 0) erreurs.push("metiers manquants");
  for (const m of e.metiers ?? [])
    if (!metiers.includes(m)) erreurs.push(`métier inconnu : ${m}`);
  if (!estDate(e.datePublished)) erreurs.push("datePublished invalide");
  if (!estDate(e.dateModified)) erreurs.push("dateModified invalide");
  if (estDate(e.datePublished) && estDate(e.dateModified) && e.dateModified < e.datePublished)
    erreurs.push("dateModified avant datePublished");
  for (const c of ["change", "gestes", "inconnu"])
    if (!estListeDeTextes(e[c])) erreurs.push(`${c} manquant`);
  validerQui(e.qui, erreurs);
  const sources = Array.isArray(e.sources) ? e.sources : null;
  if (!sources) erreurs.push("sources manquantes");
  for (const s of sources ?? []) {
    if (!estTexte(s?.libelle)) erreurs.push("source sans libellé");
    if (typeof s?.url !== "string" || !s.url.startsWith("https://"))
      erreurs.push(`source sans url https : ${s?.url}`);
    if (typeof s?.primaire !== "boolean") erreurs.push(`source sans champ primaire : ${s?.url}`);
  }
  if (e.relecteur !== null && !(estTexte(e.relecteur?.nom) && estDate(e.relecteur?.date)))
    erreurs.push("relecteur mal formé (null, ou nom et date)");
  if (!Array.isArray(e[NOTES] ?? [])) erreurs.push(`${NOTES} doit être une liste`);
  validerChiffres(e, erreurs);
  return erreurs;
}

/** Ce qu'il faut de plus pour publier. Renvoie la liste des erreurs. */
export function validerPublication(e) {
  const erreurs = [];
  if (!e.relecteur) erreurs.push("aucun relecteur");
  if (e.format !== "le-releve" && !e.sources?.some((s) => s?.primaire === true))
    erreurs.push("aucune source primaire");
  const longueur = e.metaDescription?.length ?? 0;
  if (longueur < 120 || longueur > 160)
    erreurs.push(`metaDescription de ${longueur} caractères (120 à 160)`);
  if ((e[NOTES] ?? []).length > 0) erreurs.push(`${NOTES} n'est pas vide`);
  const { [NOTES]: _notes, fichier: _fichier, ...texte } = e;
  for (const c of chaines(texte)) if (estMarque(c)) erreurs.push(`marque restante : ${c}`);
  return erreurs;
}

/** Contrôles entre éditions : un numéro n'existe qu'une fois. */
export function validerCollection(editions) {
  const vus = new Map();
  const erreurs = [];
  for (const e of editions) {
    if (vus.has(e.numero))
      erreurs.push(`numero ${e.numero} en double : ${vus.get(e.numero)} et ${e.slug}`);
    vus.set(e.numero, e.slug);
  }
  return erreurs;
}

function exigerPubliables(editions, metiers) {
  const erreurs = editions.flatMap((e) =>
    [...validerStructure(e, metiers), ...validerPublication(e)].map((m) => `${e.slug} : ${m}`),
  );
  erreurs.push(...validerCollection(editions));
  if (erreurs.length)
    throw new Error(`Actualités, publication refusée :\n- ${erreurs.join("\n- ")}`);
}

/** Les éditions publiées, contrôlées. Une seule erreur fait échouer le build. */
export function editionsEnLigne(racine) {
  return lireContenu(racine).editions;
}

/**
 * Le contenu d'un build : les éditions publiées, plus les brouillons si `avecBrouillons`.
 * Renvoie aussi les fichiers lus, pour que le serveur de dev recharge quand ils changent.
 */
export function lireContenu(racine, { avecBrouillons = false } = {}) {
  const toutes = lireEditions(racine);
  const publiees = toutes.filter((e) => e.statut === "publie");
  if (publiees.length) exigerPubliables(publiees, metiersValides(racine));
  return {
    editions: avecBrouillons ? toutes : publiees,
    lus: toutes.map((e) => e.fichier),
  };
}

/**
 * La version qui part vers le site : les seuls champs publics, sans aucune marque.
 * Une liste perd la ligne marquée, un autre texte devient vide. Une édition publiée n'a plus de
 * marque (contrôlé) ; ceci protège l'aperçu des brouillons.
 */
export function pourAffichage(edition) {
  const effacer = (v) => {
    if (typeof v === "string") return estMarque(v) ? "" : v;
    if (Array.isArray(v)) return v.map(effacer);
    if (v && typeof v === "object")
      return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, effacer(x)]));
    return v;
  };
  const publics = Object.fromEntries(
    CHAMPS_PUBLICS.filter((c) => edition[c] !== undefined).map((c) => [c, effacer(edition[c])]),
  );
  for (const c of ["change", "gestes", "inconnu"])
    if (Array.isArray(publics[c])) publics[c] = publics[c].filter(Boolean);
  return publics;
}
