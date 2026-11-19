import type { MetierOutil } from "./types";

export type MetierInfo = {
  id: MetierOutil;
  /** Nom de verticales.json (« Opticiens et audioprothésistes »). */
  nom: string;
  /** Libellé court des pastilles et des filtres (« Optique et audio »). */
  court: string;
  /** Page métier du site (`/metiers/opticiens`). */
  page: string;
  /** Rubrique Ressources du métier (`/ressources/metier/optique`). */
  rubrique: string;
};

export const METIERS_OUTILS: readonly MetierInfo[];
export const IDS_METIERS: readonly MetierOutil[];
export function estMetierOutil(v: unknown): v is MetierOutil;
export function metierOutil(id: string): MetierInfo | undefined;
export function versMetiers(
  cles: readonly string[],
  table?: Record<string, MetierOutil | null>,
): MetierOutil[];
