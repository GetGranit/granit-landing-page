// Types de publication.mjs (tsconfig n'a pas allowJs).
import type { TauxPublie } from "./calcul.mjs";

export type ReglageMetier = { liste: boolean; pages: boolean };
export const METIERS: Record<"optique" | "audio" | "dentaire" | "pharmacie", ReglageMetier>;
export const SEUIL_MOTS_PROPRES: number;
export const PAGES_MAX: number;
export const PRIORITE: string[];
export const TAUX_2027: Record<
  "lpp" | "dentaire" | "medicament_30" | "medicament_15",
  TauxPublie | null
>;
export const DATE_BASCULE: string;
