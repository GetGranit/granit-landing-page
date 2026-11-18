import type {
  AuditPage,
  ContexteSite,
  OptionsPages,
  PageOutil,
  SourceDonnee,
} from "../socle/types";
export function pages(o: OptionsPages): PageOutil[];
export function audit(o: OptionsPages): AuditPage[];
export function redirections(o: OptionsPages): Record<string, string>;
export const TABLE_METIERS: Record<string, string | null>;
export const SOURCES: Map<string, SourceDonnee & { acces?: string }>;
export const HUB: { titre: string; description: string; h1: string };
export function ficheDe(slug: string, site: ContexteSite): string | null;
export function slugsPublies(o: OptionsPages): Set<string>;
export function motsPropresDe(slug: string): number;
export function lastmodDe(e: { verifie_le?: string }): string;
// Les entrées relues (releve.mjs) : forme libre, lue seulement par modele.mjs et les tests.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const ENTREES: { e: any; faits: any[] }[];
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function entree(slug: string): { e: any; faits: any[] } | undefined;
