export const SCHEMA_RELECTURE: object;
export const SCHEMA_VERDICT: object;
export function corps(edition: Record<string, unknown>): Record<string, unknown>;
export function messageRelecteur(edition: Record<string, unknown>, pages: any[], date: string): string;
export function lireSources(sources: { url: string }[], options?: { lire?: unknown; timeoutMs?: number }): Promise<any[]>;
export function decider(r: { pages: any[]; relecture: any; verif: any }): "pret" | "humain";
export function relire(p: { edition: Record<string, unknown>; pages: any[]; date: string; appeler: unknown; log?: (m: string) => void }): Promise<any>;
export function rapportMarkdown(r: any, m: { slug: string; model: string; cout: number; date: string }): string;
