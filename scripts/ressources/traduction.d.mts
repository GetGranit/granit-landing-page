import type { Article } from "../../src/lib/articles";
import type { Concurrent, Plateforme, RessourceJson } from "../../src/lib/ressources/types";

type Schema = unknown;

export const SCHEMAS: Record<"article" | "plateforme" | "concurrent" | "ancien", Schema>;
export function fusionner<T>(
  fr: T,
  en: unknown,
  schema: Schema,
  chemin?: string,
): { valeur: T; problemes: string[] };
export function traduire<T>(
  fichier: string,
  fr: T,
  schema: Schema,
  controle?: (fr: T, en: Record<string, unknown>) => string[],
): { valeur?: T; avertissement?: string };
export function lireTraductions(
  racine: string,
  contenu: {
    articles: RessourceJson[];
    plateformes: Record<string, Plateforme>;
    concurrents: Record<string, Concurrent & { exclus?: unknown }>;
  },
  anciensFr?: Article[],
): {
  articles: Record<string, RessourceJson>;
  plateformes: Record<string, Plateforme>;
  concurrents: Record<string, Concurrent & { exclus?: unknown }>;
  anciens: Record<string, Article>;
  avertissements: string[];
  lus: string[];
};
