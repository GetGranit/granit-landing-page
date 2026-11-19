import type { ContexteSite } from "../socle/types";
import type { DonneesHub, ReponseEntree } from "./types";
export function modeleHub(site: ContexteSite): DonneesHub;
export function modeleEntree(slug: string, site: ContexteSite): ReponseEntree;
export const MENTIONS: Record<string, string>;
