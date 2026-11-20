import data from "./platforms.json" with { type: "json" };
import type { CardRead } from "./readCard";

/**
 * Passe de la carte lue (ou du portail tapé) à ce qu'on montre à l'opticien :
 * un portail sûr, plusieurs possibles, ou rien de connu.
 *
 * On ne se fie qu'à ce qui est écrit sur la carte : le nom du portail ou du
 * réseau (ligne optique, gestionnaire). Aucune table mutuelle → portail ici :
 * ce dépôt est public, la correspondance du produit n'y a pas sa place.
 * Une carte qui ne nomme aucun portail connu donne « inconnu », et Paul répond.
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
  /**
   * « prevenir » : on ne propose pas de faire ces PEC (portail qui ferme), on
   * propose d'être prévenu de la suite. Ne touche pas à `pec_optique_granit`.
   */
  affichage?: "prevenir";
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

/** Minuscules, sans accents ni ponctuation, espaces réduits. */
export function norm(s: string | null | undefined): string {
  return (s ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9+]+/g, " ")
    .trim();
}

/**
 * Portails et réseaux tels qu'ils sont écrits sur les cartes (gestionnaire,
 * colonne OPTI, réseau). Un réseau (Kalixia) se résout sur le portail qui le
 * porte via `reseau_via` de platforms.json.
 */
const NAMED: [string, string[]][] = [
  ["sp_sante", ["sp sante", "spsante"]],
  ["isante", ["isante", "i sante"]],
  ["almerys", ["almerys"]],
  ["santeclair", ["santeclair", "tp+"]],
  ["seveane", ["seveane", "séveane"]],
  ["actil", ["actil"]],
  ["oxantis", ["oxantis"]],
  ["carte_blanche", ["carte blanche"]],
  ["itelis", ["itelis"]],
  ["viamedis", ["viamedis"]],
  ["kalixia", ["kalixia"]],
  ["generation", ["generation"]],
];

function namedOnCard(card: CardRead): string[] {
  const text = norm([card.gestionnaire, card.tp_optique, card.reseau].filter(Boolean).join(" / "));
  return NAMED.filter(([, keys]) => keys.some((k) => text.includes(norm(k)))).map(([id]) => id);
}

/** Le portail que la carte nomme ; plusieurs : on demande ; aucun : inconnu. */
export function resolveCard(card: CardRead): Resolution {
  return resolveIds(namedOnCard(card));
}

const INDEX = PLATFORMS.map((p) => ({
  p,
  cles: [p.label, p.id.replace(/_/g, " "), ...(NAMED.find(([id]) => id === p.id)?.[1] ?? [])].map(
    norm,
  ),
}));

/**
 * Saisie manuelle : portails dont le nom contient la requête (ceux qui
 * COMMENCENT par elle passent devant). Le nom d'une mutuelle ne trouve rien :
 * l'écran propose alors Paul.
 */
export function searchPortails(query: string, limit = 8): { nom: string; platforms: string[] }[] {
  const q = norm(query);
  if (q.length < 2) return [];
  const debut = (cles: string[]) => cles.some((c) => c.startsWith(q));
  return INDEX.filter(({ cles }) => cles.some((c) => c.includes(q)))
    .sort(
      (a, b) =>
        Number(!debut(a.cles)) - Number(!debut(b.cles)) || a.p.label.localeCompare(b.p.label),
    )
    .slice(0, limit)
    .map(({ p }) => ({ nom: p.label, platforms: [p.id] }));
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
