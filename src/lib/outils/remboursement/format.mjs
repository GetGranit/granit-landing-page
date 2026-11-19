// Mise en forme des textes et des montants de l'outil B · Remboursement : typographie française et
// euros. Fonctions pures, sans donnée : importées par le navigateur (calcul, tableau) comme par le
// serveur (contenu.mjs, vues.mjs).
import { nombreFr } from "../socle/texte.mjs";

// ── Typographie ──────────────────────────────────────────────────────────────

/**
 * Typographie française d'un texte écrit avec des espaces simples (textes de groupes.mjs, conditions
 * de donnees.json) : espace insécable avant : ; ? ! et %, dans « », dans les milliers (1 700),
 * entre un nombre et €, après n° ;
 * apostrophe typographique. Jamais appliqué aux désignations LPP (texte officiel) ni aux URL.
 * @param {string} texte
 */
export function typo(texte) {
  return String(texte ?? "")
    .replace(/ ([:;?!%])/g, "\u00a0$1")
    .replace(/« /g, "«\u00a0")
    .replace(/ »/g, "\u00a0»")
    .replace(/(\d) (\d{3})(?!\d)/g, "$1\u00a0$2")
    .replace(/(\d) €/g, "$1\u00a0€")
    .replace(/\bn° /g, "n°\u00a0")
    .replace(/'/g, "’");
}

/** Première lettre en capitale. @param {string} t */
export const capitale = (t) => (t ? t[0].toUpperCase() + t.slice(1) : t);

/**
 * Montant en euros à la française : « 9 € », « 9,75 € », « 1 400 € » (espaces insécables).
 * @param {number} v
 */
export function euros(v) {
  const c = Math.round(v * 100);
  const entier = nombreFr(Math.trunc(c / 100));
  const reste = Math.abs(c % 100);
  return `${reste ? `${entier},${String(reste).padStart(2, "0")}` : entier}\u00a0€`;
}
