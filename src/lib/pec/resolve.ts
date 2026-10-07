import { candidatesForCard } from "./classify";
import data from "./platforms.json";
import type { CardRead } from "./readCard";

/**
 * Passe de la carte lue (ou de la mutuelle tapée) à ce qu'on montre à
 * l'opticien : un portail sûr, plusieurs possibles, ou rien de connu.
 * Données et règles exportées du produit (voir README dans ce dossier).
 */

export type Tfa = "email" | "sms" | "totp" | "aucune" | "inconnu";
export type Platform = {
  id: string;
  label: string;
  url: string;
  simulable: boolean;
  /** Granit fait déjà de vraies PEC optique sur ce portail (sinon : on ne le promet pas). */
  pec_optique_granit: boolean;
  tfa: Tfa;
  note_fermeture: string | null;
  note: string | null;
  reseau_via: string | null;
};

const PLATFORMS: Platform[] = (data as { platforms: Platform[] }).platforms;
const byId = new Map(PLATFORMS.map((p) => [p.id, p]));

export function platformById(id: string): Platform | undefined {
  return byId.get(id);
}

export type Resolution =
  | { kind: "unique"; platform: Platform }
  | { kind: "plusieurs"; platforms: Platform[] }
  | { kind: "inconnu" };

/** Un réseau (Kalixia…) se traite sur le portail qui le porte : on garde le réseau pour l'affichage mais on dédoublonne par portail réel. */
function dedupe(ids: string[]): Platform[] {
  const seen = new Set<string>();
  const out: Platform[] = [];
  for (const id of ids) {
    const p = byId.get(id);
    if (!p) continue;
    const key = p.reseau_via ?? p.id;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(p);
  }
  return out;
}

export function resolveIds(ids: string[]): Resolution {
  const list = dedupe(ids);
  if (list.length === 0) return { kind: "inconnu" };
  if (list.length === 1) return { kind: "unique", platform: list[0] };
  return { kind: "plusieurs", platforms: list.slice(0, 3) };
}

export function resolveCard(card: CardRead): Resolution {
  return resolveIds(candidatesForCard(card));
}

/** Carte fictive pour « Essayer avec une carte d'exemple » : réseau Kalixia, donc Viamédis, donc simulable. */
export const EXAMPLE_CARD: CardRead = {
  est_carte_tp: true,
  lisible: true,
  assureur: "Mutuelle Exemple",
  gestionnaire: null,
  reseau: "Kalixia",
  tp_optique: "KALIXIA",
  amc: "99999999",
  fin_droits: "31/12/2026",
};
