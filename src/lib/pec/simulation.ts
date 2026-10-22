/**
 * Simulation de PEC en direct sur le portail de l'opticien (lead magnet /pec).
 *
 * Contrat que l'endpoint réel devra respecter :
 * - `startSimulation(input)` ouvre une session ; le portail est piloté côté
 *   infra Granit, le navigateur ne fait que suivre les événements.
 * - Événements, dans l'ordre : `etape connexion` → `code_requis` (si le portail
 *   en demande un) → `etape code` → `etape beneficiaire` → `etape formulaire`
 *   → `etape chiffrage` → `resultat`. Un `echec` peut arriver à tout moment et
 *   clôt la session. `etape X` = X est en cours, les étapes d'avant sont faites.
 * - `code_requis.essai` compte les tentatives (1, 2, 3) : un code refusé
 *   redemande un code, le troisième refus donne `echec code`.
 * - La simulation s'arrête avant l'envoi : rien ne part à la mutuelle.
 *
 * Données sensibles : les identifiants, le NIR, la date de naissance et le
 * prescripteur ne sont ni stockés ni loggés ici, et ne doivent jamais l'être.
 */

export type SimInput = {
  platformId: string;
  nir: string;
  dateNaissance: string;
  prescripteur: string;
  adherent?: string;
  identifiant: string;
  motDePasse: string;
};

export type SimEtape = "connexion" | "code" | "beneficiaire" | "formulaire" | "chiffrage";
export type SimEchecCause = "identifiants" | "code" | "patient" | "portail" | "inconnu";

export type SimEvent =
  | { type: "etape"; etape: SimEtape }
  | { type: "code_requis"; canal: "totp" | "email"; essai: number }
  | {
      type: "resultat";
      total: number;
      partSecu: number;
      partMutuelle: number;
      resteACharge: number;
      dureeSec: number;
      captureUrl?: string;
      numero?: string;
    }
  | { type: "echec"; cause: SimEchecCause };

export interface SimulationSession {
  onEvent(cb: (e: SimEvent) => void): () => void;
  submitCode(code: string): void;
  cancel(): void;
}

export const SIM_ETAPES: SimEtape[] = [
  "connexion",
  "code",
  "beneficiaire",
  "formulaire",
  "chiffrage",
];

/** Équipement d'exemple simulé (le même partout : on ne demande rien de plus au comptoir). */
export const EQUIPEMENT_EXEMPLE = [
  { label: "Monture classe B", montant: 180 },
  { label: "Verre progressif droit", montant: 450 },
  { label: "Verre progressif gauche", montant: 450 },
] as const;

/** Viamédis et Kalixia : appli d'authentification ; EMOA et Génération : code reçu par e-mail. */
export function canalCode(platformId: string): "totp" | "email" {
  return platformId === "emoa" || platformId === "generation" ? "email" : "totp";
}

function env(): Record<string, string | boolean | undefined> {
  return (import.meta as { env?: Record<string, string | boolean | undefined> }).env ?? {};
}

/**
 * Passe à `true` quand `startSimulation` pilotera vraiment le portail (TODO(CTO)).
 * D'ici là, la seule présence de VITE_PEC_SIMULATION_URL ne suffit pas : on ne
 * présente jamais le mock comme une simulation en direct.
 */
const SIMULATION_REELLE_IMPLEMENTEE = false as boolean;

/** Vrai si la simulation en direct existe ET qu'un endpoint est configuré. */
export function simulationEnDirect(): boolean {
  return SIMULATION_REELLE_IMPLEMENTEE && Boolean(env().VITE_PEC_SIMULATION_URL);
}

/** Démos de Paul : DEV ou VITE_PEC_APERCU=on (simulation factice + compte). */
function apercuActif(): boolean {
  const e = env();
  return e.DEV === true || e.VITE_PEC_APERCU === "on";
}

/**
 * Les écrans de simulation ne sont montrés à un visiteur que si la simulation
 * est réelle. Le mock ne sert qu'en DEV ou en aperçu explicite : on ne fait pas
 * taper de vrais identifiants dans un faux parcours.
 */
export function simulationProposee(): boolean {
  return simulationEnDirect() || apercuActif();
}

/** Ce que voit le visiteur sur un portail simulable (propriété `mode` des événements). */
export function modeSimulation(): "direct" | "apercu" | "paul" {
  if (simulationEnDirect()) return "direct";
  return apercuActif() ? "apercu" : "paul";
}

/** L'espace /essai : DEV, VITE_PEC_ESSAI=on ou aperçu. Sinon /essai renvoie vers /pec. */
export function espaceEssaiActif(): boolean {
  return env().VITE_PEC_ESSAI === "on" || simulationProposee();
}

export function startSimulation(input: SimInput): SimulationSession {
  if (simulationEnDirect()) {
    // TODO(CTO) : brancher l'endpoint (VITE_PEC_SIMULATION_URL) en respectant le contrat
    // décrit en tête de fichier, puis passer SIMULATION_REELLE_IMPLEMENTEE à true.
    throw new Error("Simulation en direct non implémentée");
  }
  if (!apercuActif()) {
    // Garde-fou : jamais le mock devant un vrai visiteur, qui taperait de vrais identifiants.
    throw new Error(
      "Simulation en direct non implémentée : seul l'aperçu (DEV, VITE_PEC_APERCU) existe",
    );
  }
  return startMock(input);
}

/* ── Mock : aucune donnée envoyée, résultat d'exemple ──────────────────────
 * identifiant « refus » → échec identifiants ; « panne » → portail en panne ;
 * prescripteur 999999999 → patient introuvable ; code 999999 → code refusé
 * (trois fois = échec code) ; tout autre code à 6 chiffres passe. */

function startMock(input: SimInput): SimulationSession {
  const listeners = new Set<(e: SimEvent) => void>();
  const timers = new Set<ReturnType<typeof setTimeout>>();
  const t0 = Date.now();
  const canal = canalCode(input.platformId);
  const refus = input.identifiant.trim().toLowerCase() === "refus";
  const panne = input.identifiant.trim().toLowerCase() === "panne";
  const introuvable = input.prescripteur === "999999999";
  let essai = 0;
  let attendCode = false;
  let fini = false;

  const emit = (e: SimEvent) => {
    if (fini) return;
    if (e.type === "resultat" || e.type === "echec") fini = true;
    listeners.forEach((cb) => cb(e));
  };
  const later = (ms: number, fn: () => void) => {
    const t = setTimeout(() => {
      timers.delete(t);
      fn();
    }, ms);
    timers.add(t);
  };
  const demanderCode = () => {
    essai += 1;
    attendCode = true;
    emit({ type: "code_requis", canal, essai });
  };

  // Laisse le temps à l'appelant de s'abonner avant le premier événement.
  later(0, () => emit({ type: "etape", etape: "connexion" }));
  later(4200, () => {
    if (refus) return emit({ type: "echec", cause: "identifiants" });
    if (panne) return emit({ type: "echec", cause: "portail" });
    demanderCode();
  });

  function suite() {
    emit({ type: "etape", etape: "code" });
    later(1800, () => emit({ type: "etape", etape: "beneficiaire" }));
    later(7000, () =>
      introuvable
        ? emit({ type: "echec", cause: "patient" })
        : emit({ type: "etape", etape: "formulaire" }),
    );
    later(15000, () => emit({ type: "etape", etape: "chiffrage" }));
    later(22000, () => {
      const total = EQUIPEMENT_EXEMPLE.reduce((s, l) => s + l.montant, 0);
      const partSecu = 0.09;
      const partMutuelle = 720;
      emit({
        type: "resultat",
        total,
        partSecu,
        partMutuelle,
        resteACharge: Math.round((total - partSecu - partMutuelle) * 100) / 100,
        dureeSec: Math.round((Date.now() - t0) / 1000),
        numero: "EXEMPLE-0001",
      });
    });
  }

  return {
    onEvent(cb) {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    submitCode(code) {
      if (!attendCode || fini) return;
      attendCode = false;
      emit({ type: "etape", etape: "code" });
      later(1500, () => {
        if (!/^\d{6}$/.test(code) || code === "999999") {
          return essai >= 3 ? emit({ type: "echec", cause: "code" }) : demanderCode();
        }
        suite();
      });
    },
    cancel() {
      fini = true;
      timers.forEach(clearTimeout);
      timers.clear();
      listeners.clear();
    },
  };
}

/* ── Contrôles de saisie du patient ──────────────────────────────────────── */

export const chiffres = (s: string) => s.replace(/[\s.-]/g, "").toUpperCase();

/**
 * Clé du n° de sécurité sociale : 97 - (13 premiers chiffres mod 97).
 * Corse : « 2A » compte comme 19, « 2B » comme 18 (départements 20 éclatés).
 */
export function nirValide(raw: string): boolean {
  const s = chiffres(raw);
  if (!/^[12378]\d{4}(?:\d{2}|2A|2B)\d{6}\d{2}$/.test(s)) return false;
  const corps = s.slice(0, 13).replace("2A", "19").replace("2B", "18");
  const n = Number(corps);
  return 97 - (n % 97) === Number(s.slice(13));
}

export type DateErreur = "format" | "inexistante" | "future" | "ancienne";

/** Pourquoi une date de naissance ne passe pas ; `null` si elle est bonne. */
export function dateErreur(raw: string): DateErreur | null {
  const m = raw.trim().match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!m) return "format";
  const [j, mo, a] = [+m[1], +m[2], +m[3]];
  const d = new Date(a, mo - 1, j);
  if (d.getFullYear() !== a || d.getMonth() !== mo - 1 || d.getDate() !== j) return "inexistante";
  if (d > new Date()) return "future";
  return a < 1900 ? "ancienne" : null;
}

/** JJ/MM/AAAA, date réelle, passée, après 1900. */
export function dateValide(raw: string): boolean {
  return dateErreur(raw) === null;
}

/** L'année du NIR (2e et 3e chiffres) doit correspondre à la date de naissance. */
export function nirCoherentAvecDate(nir: string, date: string): boolean {
  return chiffres(nir).slice(1, 3) === date.trim().slice(8, 10);
}
