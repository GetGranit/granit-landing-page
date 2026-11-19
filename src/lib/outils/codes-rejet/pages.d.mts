import type { AuditPage, GroupeHub, OptionsPages, PageOutil } from "../socle/types";
import type { GroupeSources, InfosHub, LigneCode, ModeleEntree } from "./types";
import type { Famille } from "./publication.mjs";

/** Options de l'outil A : celles du socle, plus des réglages simulés (tests, comptes de la PR). */
export type OptionsCodesRejet = OptionsPages & {
  familles?: Record<string, Famille>;
  seuil?: number;
};

export const HUB: { titre: string; description: string; h1Titre: string; h1Accent: string };
export const TABLE_METIERS: Record<string, string>;

export function pages(o: OptionsCodesRejet): PageOutil[];
export function audit(o: OptionsCodesRejet): AuditPage[];
export function redirections(o: OptionsCodesRejet): Record<string, string>;
export function motsPropresEntree(slug: string): number | undefined;

export type Resolution =
  | { type: "page"; slug: string }
  | { type: "redirection"; vers: string }
  | { type: "recherche"; vers: string }
  | { type: "introuvable" };
export function resoudre(slug: string, o: OptionsCodesRejet): Resolution;

export function lignesHub(o: OptionsCodesRejet): LigneCode[];
export function groupesHub(o: OptionsCodesRejet): GroupeHub[];
export function sourcesHub(o: OptionsCodesRejet): GroupeSources[];
export function infosHub(o: OptionsCodesRejet): InfosHub;
export function modeleEntree(slug: string, o: OptionsCodesRejet): ModeleEntree | undefined;
