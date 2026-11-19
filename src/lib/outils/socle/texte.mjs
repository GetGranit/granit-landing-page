// Fonctions de texte communes aux outils : recherche, slugs, dates, typographie.
// ESM pur, sans dépendance : lu par Node (pages.mjs, tests) comme par l'app.

/**
 * Forme de comparaison d'un texte libre : sans accents, en minuscules, la ponctuation et les
 * apostrophes remplacées par une espace, espaces réduites. « Exonération » → « exoneration ».
 * @param {string} texte
 */
export function normaliser(texte) {
  return String(texte ?? "")
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim();
}

/**
 * Forme de comparaison d'un code : comme `normaliser`, sans aucune séparation.
 * « 0450 054 » = « 0450-054 » = « 0450.054 » = « 0450054 ».
 * @param {string} code
 */
export function cleCode(code) {
  return normaliser(code).replace(/ /g, "");
}

/**
 * Slug d'URL : minuscules, sans accents, mots séparés par des tirets.
 * « La Mutuelle Générale » → « la-mutuelle-generale ».
 * @param {string} texte
 */
export function slugifier(texte) {
  return normaliser(texte).replace(/ /g, "-");
}

/**
 * Nombre à la française : milliers séparés par une espace insécable (1 500).
 * @param {number} n
 */
export function nombreFr(n) {
  return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, "\u00a0");
}

/** @param {string} texte */
export const estDateIso = (texte) => /^\d{4}-\d{2}-\d{2}(?:$|T)/.test(String(texte ?? ""));

/**
 * Date affichée : ISO (« 2019-11-22 », avec ou sans heure) → « 22/11/2019 » ; tout autre texte
 * (« non datée », « état au 2026-11-18 ») est rendu tel quel.
 * @param {string} texte
 */
export function formaterDate(texte) {
  const t = String(texte ?? "");
  if (!estDateIso(t)) return t;
  const [a, m, j] = t.slice(0, 10).split("-");
  return `${j}/${m}/${a}`;
}

// Fautes de typographie et de vocabulaire (TON.md), dans l'ordre où on les cherche.
// Espace simple = U+0020 ; les espaces permises sont l'insécable (U+00A0) et la fine (U+202F).
const FAUTES = [
  [/ [:;?!]/, (m) => `espace simple avant « ${m[0].trim()} » (insécable attendue)`],
  [/« |(?<=\S) »/, () => "espace simple dans « » (insécable attendue)"],
  [/"/, () => "guillemets droits (« » attendus)"],
  [/—/, () => "tiret long (virgule, deux-points ou parenthèses attendus)"],
  [/tiers-payant/i, () => "« tiers-payant » s'écrit « tiers payant »"],
  [/certifié HDS/i, () => "« certifié HDS » : on écrit « infrastructure certifiée (HDS) »"],
];

/**
 * La première faute trouvée dans un texte affiché, ou null.
 * @param {string} texte
 * @returns {string | null}
 */
export function fauteTypo(texte) {
  const t = String(texte ?? "");
  for (const [re, message] of FAUTES) {
    const m = t.match(re);
    if (m) return `${message(m)} : « ${extrait(t, m.index ?? 0)} »`;
  }
  return null;
}

function extrait(t, i) {
  const debut = Math.max(0, i - 20);
  return `${debut > 0 ? "…" : ""}${t.slice(debut, i + 20)}${i + 20 < t.length ? "…" : ""}`;
}
