import type { Platform } from "./resolve";
import data from "./estimations.json" with { type: "json" };

/**
 * Estimation indicative du remboursement de la complémentaire, par portail de
 * gestion (pas par mutuelle : plusieurs mutuelles passent par le même portail).
 *
 * Source : facturations réelles de Granit (`tp_facturation.part_tp`), agrégées
 * HORS LIGNE en fourchettes anonymes (p25–médiane–p75) et figées dans
 * estimations.json. Aucune donnée patient n'est embarquée ni ne transite ici :
 * ce ne sont que des ordres de grandeur. Ce N'EST PAS le remboursement du
 * client (il dépend de son contrat, de l'équipement et des prix du magasin).
 *
 * On montre TOUJOURS un chiffre : la fourchette du portail quand on l'a, sinon
 * la fourchette globale (toutes PEC optique confondues), signalée comme telle.
 */

export type Fourchette = { n: number; bas: number; median: number; haut: number };
export type Estimation = { lunettes?: Fourchette; lentilles?: Fourchette };
/** Fourchette lunettes retenue + `general` = repli sur la moyenne toutes PEC. */
export type EstimationLunettes = { f: Fourchette; general: boolean };

const PORTAILS = (data as { portails: Record<string, Estimation> }).portails;
const GLOBAL = (data as { _global: Estimation })._global;
const EQUIV = (data as { _meta: { equivalences?: Record<string, string> } })._meta.equivalences ?? {};
export const ESTIMATION_META = (data as { _meta: Record<string, unknown> })._meta;

/** Id de portail effectif : un réseau se traite sur son portail porteur. */
function portailEffectif(p: Platform): string {
  const id = p.reseau_via ?? p.id;
  return EQUIV[id] ?? id;
}

/** Estimation lunettes : propre au portail si on l'a, sinon la globale (general). */
export function estimationLunettes(p: Platform): EstimationLunettes | null {
  const propre = PORTAILS[portailEffectif(p)]?.lunettes;
  if (propre) return { f: propre, general: false };
  if (GLOBAL.lunettes) return { f: GLOBAL.lunettes, general: true };
  return null;
}
