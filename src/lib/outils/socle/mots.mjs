// Seuil de contenu des pages d'entrée, identique pour les trois outils.
//
// Une page d'entrée n'existe que si son texte propre (ses champs tels qu'ils sont rendus, sans
// intertitres, liens, blocs communs ni carte Granit) compte au moins SEUIL_MOTS_PROPRES mots, en
// retirant les phrases de gabarit : une phrase qui revient dans 3 entrées candidates ou plus du même
// outil ne compte pas. Chaque phrase n'est comptée qu'une fois par entrée.
//
// Décision commune à valider par Paul : seo.md fixe 150 mots propres sans dire comment on les compte.
// Compté sans les phrases répétées, 150 ne laisse presque rien ; 100 mots dédupliqués donnent à peu
// près ce que donnent 150 mots comptés champ par champ. Remettre 150 : une ligne ici (pour tous les
// outils) ou SEUIL_MOTS_PROPRES dans le publication.mjs d'un outil.
import { normaliser } from "./texte.mjs";

/** Mots propres dédupliqués qu'il faut pour avoir une page. */
export const SEUIL_DEFAUT = 100;
/** Voisins publiés qu'il faut pour avoir une page (pages de l'outil ou articles /ressources en ligne). */
export const MIN_VOISINS = 2;
/** Une phrase présente dans au moins ce nombre d'entrées candidates est du gabarit. */
export const REPETITION_GABARIT = 3;

const MOT = /[\p{L}\p{N}]+(?:[’'-][\p{L}\p{N}]+)*/gu;

/** « d’exonération » = 1 mot ; les espaces insécables séparent les mots. @param {string} texte */
export function compterMots(texte) {
  return (String(texte ?? "").match(MOT) ?? []).length;
}

/** Phrases d'un texte, coupées après . ! ? ou …, phrases vides retirées. @param {string} texte */
export function decouperPhrases(texte) {
  return String(texte ?? "")
    .split(/(?<=[.!?…])\s+/)
    .map((p) => p.trim())
    .filter(Boolean);
}

/**
 * Phrases dédupliquées d'un texte : forme normalisée (ce qu'on compare d'une entrée à l'autre)
 * → phrase telle qu'écrite (ce qu'on compte : « d’exonération » reste un seul mot).
 */
function phrasesNormalisees(texte) {
  const phrases = new Map();
  for (const p of decouperPhrases(texte)) {
    const cle = normaliser(p);
    if (cle && !phrases.has(cle)) phrases.set(cle, p);
  }
  return phrases;
}

/**
 * Les phrases (normalisées) présentes dans au moins `repetition` des textes donnés.
 * @param {readonly string[]} textes
 * @param {number} [repetition]
 */
export function phrasesGabarit(textes, repetition = REPETITION_GABARIT) {
  const compte = new Map();
  for (const t of textes)
    for (const p of phrasesNormalisees(t).keys()) compte.set(p, (compte.get(p) ?? 0) + 1);
  return new Set([...compte].filter(([, n]) => n >= repetition).map(([p]) => p));
}

/**
 * Mots des phrases du texte qui ne sont pas du gabarit, chaque phrase comptée une fois.
 * @param {string} texte
 * @param {ReadonlySet<string>} [gabarit]
 */
export function motsPropres(texte, gabarit = new Set()) {
  let n = 0;
  for (const [cle, p] of phrasesNormalisees(texte)) if (!gabarit.has(cle)) n += compterMots(p);
  return n;
}

/**
 * Raccourci pour pages.mjs : les mots propres de chaque texte, le gabarit étant calculé sur
 * l'ensemble des textes donnés (la population : toutes les entrées `sur` de l'outil, pas seulement
 * la vague, pour que le compte d'une entrée ne dépende pas de la vague).
 * @param {readonly string[]} textes
 * @param {number} [repetition]
 */
export function compterMotsPropres(textes, repetition = REPETITION_GABARIT) {
  const gabarit = phrasesGabarit(textes, repetition);
  return textes.map((t) => motsPropres(t, gabarit));
}
