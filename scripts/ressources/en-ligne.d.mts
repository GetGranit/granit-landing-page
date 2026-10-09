import type { Concurrent, Plateforme, RessourceJson } from "../../src/lib/ressources/types";

export function lireFile(racine: string): Map<string, { status: string; wave: number }>;
export function articlesEnLigne(racine: string): RessourceJson[];
export function lireContenu(
  racine: string,
  options?: { avecApercu?: boolean },
): {
  articles: RessourceJson[];
  plateformes: Record<string, Plateforme>;
  concurrents: Record<string, Concurrent & { exclus?: unknown }>;
  lus: string[];
};
export function redirections(articles: RessourceJson[]): Record<string, string>;
export function anciensSlugsFr(racine: string): string[];
export function controler(racine: string, articles: RessourceJson[]): void;
