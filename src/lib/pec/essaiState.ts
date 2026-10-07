/**
 * État partagé de l'espace freemium PEC (/essai).
 *
 * /pec fait la vraie simulation sur le portail, crée le compte en coulisse
 * avec l'e-mail, puis écrit le résultat dans sessionStorage["granit.pec.case"].
 * /essai le relit. `readCase()` ne garde que les champs connus : jamais de NIR,
 * d'identité patient ni d'identifiants de portail, même si on en trouvait.
 * Seule une demande de contact (e-mail, téléphone, portail) part vers le
 * webhook des leads ; les identifiants saisis dans l'espace restent dans
 * l'état React local.
 */

import data from "./platforms.json" with { type: "json" };

export type TfaKind = "email" | "sms" | "totp" | "aucune" | "inconnu";

export type PecPlatform = {
  id: string;
  label: string;
  url: string;
  simulable: boolean;
  tfa: TfaKind;
};

/** Résultat de la simulation faite sur /pec (montants en euros). */
export type PecSimulation = {
  total: number;
  partSecu: number;
  partMutuelle: number;
  resteACharge: number;
  dureeSec: number;
  captureUrl?: string;
  numero?: string;
  /** Simulation d'aperçu (montants d'exemple), pas un vrai passage sur le portail. */
  apercu: boolean;
};

export type PecCase = {
  source: "photo" | "exemple" | "saisie";
  email?: string;
  mutuelle: string | null;
  amc: string | null;
  reseau: string | null;
  platform: PecPlatform | null;
  /** Le portail de la carte a été branché sur /pec : on ne redemande rien. */
  portailConnecte?: boolean;
  simulation?: PecSimulation;
  /** Temps déclaré par l'opticien pour une PEC faite à la main. */
  minutesManuelles?: number;
  /** Pour l'accueil, si /pec les connaît un jour (facultatifs). */
  prenom?: string;
  magasin?: string;
  /** Compte gratuit créé sur /pec (« Créer mon compte gratuit »). Jamais de mot de passe. */
  compte?: { email: string; creeLe: string };
};

export const CASE_KEY = "granit.pec.case";
const PHONE_KEY = "granit.pec.phone";
const SHEET_KEY = "granit.pec.paulSheetShown";

const TFA: readonly TfaKind[] = ["email", "sms", "totp", "aucune", "inconnu"];

type RawPlatform = PecPlatform & { pec_optique_granit: boolean; reseau_via: string | null };

/**
 * Portails proposés dans « Ajouter un portail » : ceux où Granit fait la PEC
 * optique, sans les réseaux qui passent par un autre portail (Kalixia → Viamédis).
 */
export const PORTAILS: PecPlatform[] = (data.platforms as RawPlatform[])
  .filter((p) => p.pec_optique_granit && !p.reseau_via)
  .map(({ id, label, url, simulable, tfa }) => ({
    id,
    label,
    url,
    simulable,
    tfa: TFA.includes(tfa) ? tfa : "inconnu",
  }));

export const VIAMEDIS: PecPlatform = PORTAILS.find((p) => p.id === "viamedis") ?? {
  id: "viamedis",
  label: "Viamédis",
  url: "https://www.viamedis.net",
  simulable: true,
  tfa: "totp",
};

export const EXAMPLE_SIMULATION: PecSimulation = {
  total: 630,
  partSecu: 0.09,
  partMutuelle: 485,
  resteACharge: 144.91,
  dureeSec: 160,
  apercu: true,
};

/** Cas affiché quand rien n'arrive de /pec (badgé « Cas d'exemple »). */
export const EXAMPLE_CASE: PecCase = {
  source: "exemple",
  mutuelle: "Mutuelle Exemple",
  amc: null,
  reseau: null,
  platform: VIAMEDIS,
  portailConnecte: true,
  simulation: EXAMPLE_SIMULATION,
};

function storage(): Storage | null {
  try {
    return typeof window === "undefined" ? null : window.sessionStorage;
  } catch {
    return null;
  }
}

const str = (v: unknown): string | null => (typeof v === "string" && v.trim() ? v : null);
const num = (v: unknown): number | null => (typeof v === "number" && Number.isFinite(v) ? v : null);

function toPlatform(v: unknown): PecPlatform | null {
  if (!v || typeof v !== "object") return null;
  const p = v as Record<string, unknown>;
  const id = str(p.id);
  const label = str(p.label);
  if (!id || !label) return null;
  const tfa = TFA.find((t) => t === p.tfa) ?? "inconnu";
  return { id, label, url: str(p.url) ?? "", simulable: p.simulable === true, tfa };
}

/** Capture du portail : seulement une image https ou en data URI. */
function safeImageUrl(v: unknown): string | undefined {
  const s = str(v);
  return s && (s.startsWith("https://") || s.startsWith("data:image/")) ? s : undefined;
}

function toSimulation(v: unknown): PecSimulation | undefined {
  if (!v || typeof v !== "object") return undefined;
  const s = v as Record<string, unknown>;
  const [total, partSecu, partMutuelle, resteACharge, dureeSec] = [
    num(s.total),
    num(s.partSecu),
    num(s.partMutuelle),
    num(s.resteACharge),
    num(s.dureeSec),
  ];
  if (total === null || partSecu === null || partMutuelle === null || resteACharge === null) {
    return undefined;
  }
  return {
    total,
    partSecu,
    partMutuelle,
    resteACharge,
    dureeSec: dureeSec ?? 0,
    captureUrl: safeImageUrl(s.captureUrl),
    numero: str(s.numero) ?? undefined,
    apercu: s.apercu !== false,
  };
}

function toCompte(v: unknown): PecCase["compte"] {
  if (!v || typeof v !== "object") return undefined;
  const c = v as Record<string, unknown>;
  const email = str(c.email);
  const creeLe = str(c.creeLe);
  return email && creeLe ? { email, creeLe } : undefined;
}

/** Recopie champ par champ : tout ce qui n'est pas au contrat est ignoré. */
export function sanitizeCase(v: unknown): PecCase | null {
  if (!v || typeof v !== "object") return null;
  const c = v as Record<string, unknown>;
  if (c.source !== "photo" && c.source !== "exemple" && c.source !== "saisie") return null;
  const minutes = num(c.minutesManuelles);
  return {
    source: c.source,
    email: str(c.email) ?? undefined,
    mutuelle: str(c.mutuelle),
    amc: str(c.amc),
    reseau: str(c.reseau),
    platform: toPlatform(c.platform),
    portailConnecte: c.portailConnecte === true,
    simulation: toSimulation(c.simulation),
    minutesManuelles: minutes !== null && minutes > 0 ? minutes : undefined,
    prenom: str(c.prenom) ?? undefined,
    magasin: str(c.magasin) ?? undefined,
    compte: toCompte(c.compte),
  };
}

/** Lit le cas laissé par /pec ; `null` si absent ou illisible. */
export function readCase(): PecCase | null {
  try {
    const raw = storage()?.getItem(CASE_KEY);
    return raw ? sanitizeCase(JSON.parse(raw)) : null;
  } catch {
    return null;
  }
}

export function writeCase(c: PecCase): void {
  try {
    storage()?.setItem(CASE_KEY, JSON.stringify(c));
  } catch {
    /* stockage indisponible (navigation privée…) : on continue sans */
  }
}

export function readPhone(): string | null {
  try {
    return storage()?.getItem(PHONE_KEY) || null;
  } catch {
    return null;
  }
}

export function writePhone(phone: string): void {
  try {
    storage()?.setItem(PHONE_KEY, phone);
  } catch {
    /* ignoré */
  }
}

/** Le bandeau Paul ne s'ouvre tout seul qu'une fois par session. */
export function paulSheetAlreadyShown(): boolean {
  try {
    return storage()?.getItem(SHEET_KEY) === "1";
  } catch {
    return false;
  }
}

export function markPaulSheetShown(): void {
  try {
    storage()?.setItem(SHEET_KEY, "1");
  } catch {
    /* ignoré */
  }
}

export type ContactRequest = { type: "rappel" | "creneau"; phone?: string };

/**
 * Demande de contact depuis /essai : même canal que /pec (webhook B11), avec
 * l'e-mail laissé sur /pec. Sans e-mail (cas d'exemple ouvert directement),
 * il n'y a personne à rappeler : on ne fait rien partir.
 */
export async function contactPaul(req: ContactRequest, c: PecCase): Promise<void> {
  if (req.phone) writePhone(req.phone);
  const email = c.email ?? c.compte?.email;
  if (!email) return;
  const { sendPecLead } = await import("./lead");
  await sendPecLead({
    kind: req.type,
    email,
    phone: req.phone ?? readPhone() ?? undefined,
    platform: c.platform?.id ?? null,
  });
}

/* ── Espace freemium (maquette) ── */

export const LOGICIELS = [
  "Cosium",
  "Osmose",
  "Optimum",
  "Winoptics",
  "MyEasyOptic",
  "Autre",
] as const;

/** Dossiers du faux sélecteur de la demande de PEC : clairement fictifs. */
export const DOSSIERS_FICTIFS = [
  { id: "f1", nom: "Patient fictif A", equipement: "Monture + 2 verres progressifs", total: 630 },
  { id: "f2", nom: "Patient fictif B", equipement: "2 verres unifocaux", total: 240 },
  { id: "f3", nom: "Patient fictif C", equipement: "Monture + 2 verres unifocaux", total: 395 },
] as const;

export type DossierFictif = (typeof DOSSIERS_FICTIFS)[number];

export function euros(n: number): string {
  return n.toLocaleString("fr-FR", { style: "currency", currency: "EUR" });
}

export function duree(s: number): string {
  if (s < 60) return `${Math.round(s)} s`;
  return `${Math.floor(s / 60)} min ${String(Math.round(s % 60)).padStart(2, "0")}`;
}
