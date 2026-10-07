import { candidatesForCard, fold } from "./classify.ts";
import data from "./platforms.json" with { type: "json" };
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

/**
 * Portails écrits en toutes lettres sur la carte (gestionnaire, colonne OPTI).
 * Le routage produit en ignore certains (SP Santé n'a aucun alias, une carte
 * « iSanté » sort d'abord Viamédis) : sans ce garde-fou, on annoncerait « votre
 * PEC Viamédis est prête » pour une carte gérée par SP Santé.
 */
const NAMED: [string, string[]][] = [
  ["sp_sante", ["sp sante", "spsante", "sp-sante"]],
  ["isante", ["isante", "i-sante"]],
  ["almerys", ["almerys"]],
  ["santeclair", ["santeclair", "tp+"]],
  ["seveane", ["seveane", "séveane"]],
  ["actil", ["actil"]],
  ["oxantis", ["oxantis"]],
  ["carte_blanche", ["carte blanche"]],
  ["itelis", ["itelis"]],
  ["viamedis", ["viamedis"]],
  ["generation", ["generation"]],
];

function namedOnCard(card: CardRead): string[] {
  const text = fold([card.gestionnaire, card.tp_optique, card.reseau].filter(Boolean).join(" / "));
  return NAMED.filter(([, keys]) => keys.some((k) => text.includes(fold(k)))).map(([id]) => id);
}

export function resolveCard(card: CardRead): Resolution {
  const fromRouting = candidatesForCard(card);
  // CGRM : le catalogue Viamédis la connaît encore, mais Viamédis ne trouve plus
  // ces bénéficiaires depuis 09/2026 (platforms.py:235) → portail CGRM.
  if (fold(card.assureur).includes("cgrm")) return resolveIds(["cgrm"]);
  const named = namedOnCard(card);
  if (named.length === 0) return resolveIds(fromRouting);
  // Ce que la carte nomme passe devant ; si le routage proposait autre chose, on demande.
  return resolveIds([...named, ...fromRouting]);
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
