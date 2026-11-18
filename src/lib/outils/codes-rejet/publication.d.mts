import type { OutilId } from "../socle/types";

export type Famille = { liste: boolean; pages: boolean };
export type Nature = "droits" | "identification" | "facture" | "transmission" | "attente";

export const GIE_SESAM_VITALE: Famille;
export const FAMILLES: Record<string, Famille>;
export const SEUIL_MOTS_PROPRES: number;
export const PAGES_MAX: number;
export const PRIORITE: string[];
export const LIBELLES_COURTS: Record<string, string>;
export const RESUMES: Record<string, string>;
export const NATURES: Record<string, Nature>;
export const ARTICLES: Record<string, string[]>;
export const OUTILS_LIES: Record<string, { id: OutilId; texte: string }[]>;
