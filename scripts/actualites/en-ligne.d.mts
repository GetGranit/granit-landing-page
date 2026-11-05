import type { Edition, EditionJson } from "../../src/lib/actualites/types";

/** Une édition telle que lue sur le disque : le fichier, plus son slug et son chemin. */
export type EditionLue = EditionJson & { slug: string; fichier: string };

export const STATUTS: string[];
export const FORMATS: string[];
export function estMarque(texte: string): boolean;
export function metiersValides(racine: string): string[];
export function lireEditions(racine: string): EditionLue[];
export function validerStructure(e: unknown, metiers: string[]): string[];
export function validerPublication(e: unknown): string[];
export function validerCollection(editions: { numero: number; slug: string }[]): string[];
export function editionsEnLigne(racine: string): EditionLue[];
export function lireContenu(
  racine: string,
  options?: { avecBrouillons?: boolean },
): { editions: EditionLue[]; lus: string[] };
export function pourAffichage(edition: EditionLue): Edition;
