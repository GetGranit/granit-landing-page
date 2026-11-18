// Types de pages.mjs (tsconfig n'a pas allowJs).
import type { AuditPage, OptionsPages, PageOutil, SourceDonnee } from "../socle/types";
import type { METIERS } from "./publication.mjs";

type Options = OptionsPages & { metiers?: typeof METIERS };
export function pages(o: Options): PageOutil[];
export function audit(o: Options): AuditPage[];
export function redirections(o: Options): Record<string, string>;
export function groupesPublies(o?: {
  candidates?: boolean;
  metiers?: typeof METIERS;
}): { slug: string }[];
export function ancreCode(e: { type_code: string; code: string }): string;
export function sourcesGroupe(g: unknown, codes: unknown[], extra?: string[]): SourceDonnee[];
export function contenus(jour?: string, ctx?: Record<string, unknown>): Map<string, unknown>;
export function comptesMots(jour?: string, ctx?: Record<string, unknown>): Map<string, number>;
