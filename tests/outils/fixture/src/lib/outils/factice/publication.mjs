// Ce que Paul règle d'une ligne (dans un vrai outil : la décision attendue et son effet chiffré).
import { SEUIL_DEFAUT } from "../../../../../../../src/lib/outils/socle/mots.mjs";

/** La fixture surcharge le seuil commun (SEUIL_DEFAUT) : ses textes sont courts. */
export const SEUIL_MOTS_PROPRES = Math.min(SEUIL_DEFAUT, 20);
/** Taille de la vague publiée. */
export const PAGES_MAX = 25;
/** Ordre de publication ; hors de cette liste, jamais de page. */
export const PRIORITE = ["alpha", "beta", "gamma", "delta", "zeta", "epsilon"];
/** Familles : `liste` = lignes du hub, `pages` = pages d'entrée. */
export const FAMILLES = {
  ouverte: { liste: true, pages: true },
  fermee: { liste: false, pages: false },
};
