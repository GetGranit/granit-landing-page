// Ce que Paul règle d'une ligne pour l'outil B · Remboursement (cadre.md § 4 et § 12).
// ESM pur : lu par pages.mjs (sitemap, tests) et par serveur.ts. Aucune donnée ici.
import { SEUIL_DEFAUT } from "../socle/mots.mjs";

/**
 * Métiers de donnees.json : `liste` = lignes du hub (et recherche), `pages` = pages de groupe.
 *
 * Décision n° 2 de Paul (périmètre de la V0). Proposé : optique et audio seulement.
 * - dentaire `liste: true` : + 31 lignes dans le hub (4 groupes de prothèses et un acte hors
 *   groupe), avec base, part Sécu, honoraire limite et panier quand la source le donne (16 sur 31).
 *   `pages: true` ne crée aucune page tant que les groupes dentaires n'ont pas leurs textes
 *   (titre, description, H1, paragraphes sourcés) dans groupes.mjs.
 * - pharmacie `liste: true` : + 23 médicaments sûrs (sur des milliers) dans un groupe
 *   « Médicaments », sans page (pas de page par CIP, seo.md).
 */
export const METIERS = {
  optique: { liste: true, pages: true },
  audio: { liste: true, pages: true },
  dentaire: { liste: false, pages: false },
  pharmacie: { liste: false, pages: false },
};

/** Mots propres dédupliqués qu'il faut à un groupe pour avoir sa page (socle : 100). */
export const SEUIL_MOTS_PROPRES = SEUIL_DEFAUT;

/** Taille de la vague publiée. */
export const PAGES_MAX = 25;

/**
 * Ordre de publication des groupes ; hors de cette liste, jamais de page.
 * Décision n° 1 de Paul (granularité) : 7 pages de groupe, aucune page par code LPP. Les groupes
 * dentaires (couronnes-dentaires, bridges-dentaires, inlay-core, protheses-dentaires-amovibles)
 * s'ajoutent ici le jour où le dentaire ouvre et où leurs textes sont écrits dans groupes.mjs ;
 * verres-freinateurs-myopie quand ses conditions d'inscription auront été lues.
 */
export const PRIORITE = [
  "verre-unifocal-classe-a",
  "verre-progressif-classe-a",
  "montures",
  "verres-classe-b",
  "verre-multifocal-classe-a",
  "aides-auditives",
  "prestations-optique",
];

/**
 * Taux de la Sécurité sociale au 01/01/2027 (décision n° 3 de Paul et formules.md § 5).
 *
 * Les décrets n° 2026-809 (dentaire), 2026-810 (LPP : optique, audio) et 2026-811 (médicaments à
 * 30 % et 15 %) changent les fourchettes de R160-5 au 01/01/2027 ; le taux exact est fixé ensuite
 * par l'Uncam ou par arrêté, et n'était pas publié au 18/11/2026.
 *
 * `null` : à partir de DATE_BASCULE, l'outil n'affiche AUCUN montant Sécu (ni ticket modérateur, ni
 * part de la complémentaire) pour ce poste, seulement la base et le prix limite.
 *
 * Le jour où le taux paraît : ajouter la décision (ou l'arrêté) dans `sources` de donnees.json, puis
 * remplacer `null` par `{ taux: 45, source_id: "<id de cette source>" }` (taux de la Sécurité
 * sociale, en %). Les montants sont alors recalculés (base × taux, arrondi au centime) et datés par
 * cette source ; pages.mjs arrête le build si `source_id` n'existe pas dans donnees.json.
 */
export const TAUX_2027 = {
  lpp: null,
  dentaire: null,
  medicament_30: null,
  medicament_15: null,
};

/** Date d'entrée en vigueur des décrets d'août 2026 (art. 2 de chacun). */
export const DATE_BASCULE = "2027-01-01";
