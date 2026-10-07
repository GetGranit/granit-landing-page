/**
 * État partagé de l'espace d'essai PEC (/essai).
 *
 * /pec écrit le cas scanné dans sessionStorage["granit.pec.case"], /essai le
 * relit. Tout est simulé côté front : seule une demande de contact (e-mail,
 * téléphone, portail) part vers le webhook des leads, et les identifiants de
 * portail n'y passent JAMAIS (ils restent dans l'état React local de l'écran
 * « Branchez »).
 */

export type TfaKind = "email" | "sms" | "totp" | "aucune" | "inconnu";

export type PecPlatform = {
  id: string;
  label: string;
  url: string;
  simulable: boolean;
  tfa: TfaKind;
};

export type PecCase = {
  source: "photo" | "exemple" | "saisie";
  mutuelle: string | null;
  amc: string | null;
  adherent: string | null;
  reseau: string | null;
  platform: PecPlatform | null;
  email?: string;
  /** Temps déclaré par l'opticien pour une PEC faite à la main. */
  minutesManuelles?: number;
};

export const CASE_KEY = "granit.pec.case";
const PHONE_KEY = "granit.pec.phone";
const SHEET_KEY = "granit.pec.paulSheetShown";

export const VIAMEDIS: PecPlatform = {
  id: "viamedis",
  label: "Viamédis",
  url: "https://www.viamedis.net",
  simulable: true,
  tfa: "totp",
};

/** Cas affiché quand rien n'a été scanné sur /pec (affiché comme exemple). */
export const EXAMPLE_CASE: PecCase = {
  source: "exemple",
  mutuelle: "Mutuelle Exemple",
  amc: "12345678",
  adherent: "0601234567",
  reseau: null,
  platform: VIAMEDIS,
};

function storage(): Storage | null {
  try {
    return typeof window === "undefined" ? null : window.sessionStorage;
  } catch {
    return null;
  }
}

function isCase(v: unknown): v is PecCase {
  if (!v || typeof v !== "object") return false;
  const c = v as Record<string, unknown>;
  return (
    (c.source === "photo" || c.source === "exemple" || c.source === "saisie") &&
    (c.platform === null || typeof c.platform === "object")
  );
}

/** Lit le cas scanné ; `null` si absent ou illisible. */
export function readCase(): PecCase | null {
  try {
    const raw = storage()?.getItem(CASE_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    return isCase(parsed) ? parsed : null;
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
 * l'e-mail laissé à l'étape précédente. Sans e-mail (cas d'exemple ouvert
 * directement), il n'y a personne à rappeler : on ne fait rien partir.
 */
export async function contactPaul(req: ContactRequest, c: PecCase): Promise<void> {
  if (req.phone) writePhone(req.phone);
  if (!c.email) return;
  const { sendPecLead } = await import("./lead");
  await sendPecLead({
    kind: req.type,
    email: c.email,
    phone: req.phone ?? readPhone() ?? undefined,
    platform: c.platform?.id ?? null,
  });
}

/* ── Données fictives de la simulation (mêmes postes que la vraie simulation de l'app) ── */

export const EQUIPEMENT = [
  { label: "Monture", montant: 180 },
  { label: "2 verres progressifs", montant: 450 },
] as const;

export const MONTANTS = {
  total: 630,
  secu: 0.09,
  mutuelle: 485,
  resteACharge: 144.91,
} as const;

/** Durée réelle annoncée d'une PEC par Granit, en secondes (2 min 40). */
export const DUREE_REELLE_S = 160;

export function euros(n: number): string {
  return n.toLocaleString("fr-FR", { style: "currency", currency: "EUR" });
}
