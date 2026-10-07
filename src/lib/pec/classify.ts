// Port TypeScript de `candidates_for_card` (GetGranit/granit, granit_shared/tp/classify.py:53),
// limité à l'OPTIQUE. Les données viennent de mutuelles.json (export du registre
// granit_shared/tp/platforms.py et des catalogues name_options_optique.json).
// Pur TS, sans dépendance : aucune donnée de la carte ne quitte la fonction.
import data from "./mutuelles.json" with { type: "json" };

export type Card = {
  assureur?: string | null;
  gestionnaire?: string | null; // organisme_gestionnaire côté Python
  reseau?: string | null;
  tp_optique?: string | null;
  tp_audio?: string | null; // lu aussi par le Python, même en optique
  amc?: string | null; // num_amc
  amc_candidates?: string[] | null;
};

type Routage = {
  id: string;
  alias: string[]; // déjà « foldés »
  exact: string[];
  reseau: boolean;
  via: string | null; // réseau → opérateur en optique (Kalixia → viamedis)
  catalogue: string[]; // libellés foldés, ≥ 4 caractères
};

const ROUTAGE = (data as { routage: Routage[] }).routage;
const MUTUELLES = (data as { mutuelles: { nom: string; platforms: string[] }[] }).mutuelles;

/** routing.py:19 — minuscules, é/è/ê/à/â aplatis, espaces réduits. Volontairement
 *  identique au Python (pas de NFD) pour garder le même routage. */
export function fold(s: string | null | undefined): string {
  let out = (s ?? "").toLowerCase();
  for (const [a, b] of [
    ["é", "e"],
    ["è", "e"],
    ["ê", "e"],
    ["à", "a"],
    ["â", "a"],
  ]) {
    out = out.split(a).join(b);
  }
  return out.split(/\s+/).filter(Boolean).join(" ");
}

/** routing.py:29 — libellé ⊆ signal ou signal ⊆ libellé, ≥ 4 caractères des deux côtés. */
function matchesCatalog(signal: string, labels: string[]): boolean {
  if (signal.length < 4) return false;
  return labels.some((lab) => lab.length >= 4 && (signal.includes(lab) || lab.includes(signal)));
}

function aliasHit(r: Routage, signal: string): boolean {
  return r.alias.some((a) => signal.includes(a)) || r.exact.some((e) => e === signal);
}

/** classify.py:125 — un réseau se résout sur son opérateur. */
function resolve(r: Routage): string {
  return r.reseau && r.via ? r.via : r.id;
}

function cardText(values: (string | null | undefined)[]): string {
  return values.filter((v) => v).join(" / ");
}

/** Plateformes candidates, ordonnées (ids de platforms.json). [] = aucune plateforme
 *  connue : la mutuelle gère probablement seule son tiers payant. */
export function candidatesForCard(card: Card | null | undefined): string[] {
  if (!card) return [];
  const tpSig = fold(cardText([card.tp_optique, card.tp_audio, card.reseau, card.gestionnaire]));
  const brandSig = fold(cardText([card.assureur, card.amc, ...(card.amc_candidates ?? [])]));

  const scan = (signal: string): string[] => {
    const out: string[] = [];
    for (const r of ROUTAGE) {
      if (out.includes(r.id)) continue;
      let hit = aliasHit(r, signal) || matchesCatalog(signal, r.catalogue);
      if (!hit) {
        // un réseau opéré par cette plateforme en optique compte pour elle
        hit = ROUTAGE.some((x) => x.reseau && x.via === r.id && aliasHit(x, signal));
      }
      if (hit) out.push(resolve(r));
    }
    return out;
  };

  const ordered: string[] = [];
  for (const id of [...scan(tpSig), ...scan(brandSig)]) {
    if (!ordered.includes(id)) ordered.push(id);
  }
  return ordered;
}

/** Normalisation de RECHERCHE (plus tolérante que fold) : tous accents, casse, ponctuation. */
function norm(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

const INDEX = MUTUELLES.map((m) => ({ ...m, key: norm(m.nom) }));

/** Saisie manuelle : mutuelles des catalogues optique dont le nom contient la requête.
 *  Les noms qui COMMENCENT par la requête passent devant. */
export function searchMutuelles(query: string, limit = 8): { nom: string; platforms: string[] }[] {
  const q = norm(query);
  if (q.length < 2) return [];
  const hits = INDEX.filter((m) => m.key.includes(q));
  hits.sort(
    (a, b) =>
      Number(!a.key.startsWith(q)) - Number(!b.key.startsWith(q)) || a.key.localeCompare(b.key),
  );
  return hits.slice(0, limit).map(({ nom, platforms }) => ({ nom, platforms }));
}
