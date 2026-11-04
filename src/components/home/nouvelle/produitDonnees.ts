/* Nouvelle home : les données de la démo produit (lm/produit.js de la maquette, présentation 1 « Démo en calques »).
   Textes en fr et en ; la chronologie (en fraction de la boucle, 0 → 1) est commune aux deux langues.
   Les éléments animés de la démo sont repérés par une clé (data-k), plus par des id. */
import type { Lang } from "./socle";

export type CopieProduit = {
  eb: string;
  titre: [string, string];
  texte: string;
  chapitres: {
    groupe: string;
    nom: (i: number, t: string) => string;
    titres: [string, string, string, string];
  };
  scene: string;
  calques: [string, string, string, string];
  ameli: {
    cr: string;
    onglets: [string, string, string];
    label: string;
    consulter: string;
    amo: string;
    amoOk: string;
    amc: string;
    amcOk: string;
  };
  metier: {
    nom: string;
    cr: string;
    notes: string;
    cotation: string;
    actes: [string, string];
    coter: string;
    cote: string;
    fse: string;
    aEnvoyer: string;
    envoi: string;
    teletransmise: string;
    teletransmettre: string;
    envoyee: string;
  };
  tp: {
    nom: string;
    cr: string;
    demande: string;
    pieces: string;
    fichiers: [string, string];
    montant: string;
    somme: string;
    envoyer: string;
    envoyee: string;
    reponse: string;
    accord: string;
  };
  banque: {
    nom: string;
    cr: string;
    libelle: string;
    montantCol: string;
    lignes: [[string, string], [string, string], [string, string]];
    aPointer: string;
    pointe: string;
    question: string;
  };
  bilan: { dossier: string; paye: string; sous: string; etapes: [string, string, string, string] };
  agents: [string, string, string];
  actions: Record<ActionCle, string>;
};

export type ActionCle =
  | "saisitNir"
  | "consulte"
  | "droitsOk"
  | "versFacturation"
  | "litNotes"
  | "cote"
  | "teletransmet"
  | "fseOk"
  | "joint"
  | "saisitMontant"
  | "envoie"
  | "accordOk"
  | "versEncaissement"
  | "pointeMutuelle"
  | "retrouve"
  | "sansRef";

export const copy: Record<Lang, CopieProduit> = {
  fr: {
    eb: "Le produit",
    titre: ["Du rendez-vous au virement,", "sans que personne n’y touche."],
    texte:
      "Droits, facturation, encaissement : chaque dossier va jusqu’au virement. Quand un cas sort de l’ordinaire, nos experts métiers le gèrent. Le reste, vous n’en entendez plus parler.",
    chapitres: {
      groupe: "Chapitres de la démo",
      nom: (i, t) => `Chapitre ${i + 1} : ${t}`,
      titres: [
        "Vérifier les droits",
        "Coter et télétransmettre",
        "Facturer la mutuelle",
        "Encaisser et pointer",
      ],
    },
    scene: "Démo : un dossier passe dans quatre logiciels, exemple avec des données fictives",
    calques: ["AmeliPro", "Logiciel métier", "Tiers payant", "Compte bancaire"],
    ameli: {
      cr: "Assurance Maladie",
      onglets: ["Droits", "Feuilles de soins", "Paiements"],
      label: "N° de sécurité sociale · patient de 9 h 30",
      consulter: "Consulter les droits",
      amo: "Assurance Maladie",
      amoOk: "Droits ouverts ✓",
      amc: "Mutuelle",
      amcOk: "Confirmée ✓",
    },
    metier: {
      nom: "Logiciel métier",
      cr: "Dossier 2026-1042 · 9 h 30",
      notes: "Notes du praticien",
      cotation: "Cotation",
      actes: ["Acte 1 ✓", "Acte 2 ✓"],
      coter: "Coter",
      cote: "Coté",
      fse: "Feuille de soins",
      aEnvoyer: "À envoyer",
      envoi: "Envoi…",
      teletransmise: "Télétransmise ✓",
      teletransmettre: "Télétransmettre",
      envoyee: "Envoyée",
    },
    tp: {
      nom: "Tiers payant",
      cr: "Plateforme de la mutuelle",
      demande: "Demande de prise en charge · dossier 2026-1042",
      pieces: "Pièces",
      fichiers: ["Devis.pdf", "Ordonnance.pdf"],
      montant: "Montant",
      somme: "412,00 €",
      envoyer: "Envoyer",
      envoyee: "Envoyée",
      reponse: "Réponse de la mutuelle",
      accord: "Accord reçu · 412,00 € ✓",
    },
    banque: {
      nom: "Compte bancaire",
      cr: "Relevé du 24 oct.",
      libelle: "Libellé",
      montantCol: "Montant",
      lignes: [
        ["Virement mutuelle · 9 dossiers", "1 284,60 €"],
        ["Tiers payant · dossier 2026-1042", "412,00 €"],
        ["Virement sans référence", "180,00 €"],
      ],
      aPointer: "À pointer",
      pointe: "Pointé ✓",
      question: "Question posée",
    },
    bilan: {
      dossier: "Dossier 2026-1042",
      paye: "Payé",
      sous: "Du rendez-vous au relevé bancaire, pointé le 24 oct.",
      etapes: [
        "Droits vérifiés",
        "Feuille de soins envoyée",
        "Mutuelle facturée",
        "Paiement pointé",
      ],
    },
    agents: ["Droits", "Facturation", "Encaissement"],
    actions: {
      saisitNir: "Saisit le n° de sécurité sociale…",
      consulte: "Consulte les droits…",
      droitsOk: "Droits ouverts, mutuelle confirmée",
      versFacturation: "Transmis à l’agent Facturation",
      litNotes: "Lit les notes du praticien…",
      cote: "Cote les actes…",
      teletransmet: "Télétransmet la feuille de soins…",
      fseOk: "Feuille de soins télétransmise",
      joint: "Joint le devis et l’ordonnance…",
      saisitMontant: "Saisit le montant…",
      envoie: "Envoie la demande…",
      accordOk: "Accord reçu : 412,00 €",
      versEncaissement: "Transmis à l’agent Encaissement",
      pointeMutuelle: "Pointe le virement mutuelle…",
      retrouve: "Retrouve le paiement du dossier 2026-1042…",
      sansRef: "Sans référence : je demande à l’équipe",
    },
  },
  en: {
    eb: "The product",
    titre: ["From appointment to payment,", "hands-free."],
    texte:
      "Eligibility, claims, payments: every file goes all the way to the bank. When a case is unusual, the agent flags it to our experts. Everything else, you never hear about.",
    chapitres: {
      groupe: "Demo chapters",
      nom: (i, t) => `Chapter ${i + 1}: ${t}`,
      titres: [
        "Check eligibility",
        "Code and submit the claim",
        "Bill the insurer",
        "Collect and reconcile",
      ],
    },
    scene: "Demo: one patient file goes through four software tools, example with fictional data",
    calques: ["AmeliPro", "Practice software", "Direct billing", "Bank account"],
    ameli: {
      cr: "National health insurance",
      onglets: ["Eligibility", "Claims", "Payments"],
      label: "Social security no. · 9:30 am patient",
      consulter: "Check eligibility",
      amo: "National insurance",
      amoOk: "Coverage active ✓",
      amc: "Supplemental insurer",
      amcOk: "Confirmed ✓",
    },
    metier: {
      nom: "Practice software",
      cr: "File 2026-1042 · 9:30 am",
      notes: "Practitioner’s notes",
      cotation: "Coding",
      actes: ["Procedure 1 ✓", "Procedure 2 ✓"],
      coter: "Code",
      cote: "Coded",
      fse: "Claim form",
      aEnvoyer: "To send",
      envoi: "Sending…",
      teletransmise: "Transmitted ✓",
      teletransmettre: "Transmit",
      envoyee: "Sent",
    },
    tp: {
      nom: "Direct billing",
      cr: "Insurer’s platform",
      demande: "Coverage request · file 2026-1042",
      pieces: "Documents",
      fichiers: ["Quote.pdf", "Prescription.pdf"],
      montant: "Amount",
      somme: "€412.00",
      envoyer: "Send",
      envoyee: "Sent",
      reponse: "Insurer’s response",
      accord: "Approved · €412.00 ✓",
    },
    banque: {
      nom: "Bank account",
      cr: "Statement of Oct 24",
      libelle: "Description",
      montantCol: "Amount",
      lignes: [
        ["Insurer transfer · 9 files", "€1,284.60"],
        ["Direct billing · file 2026-1042", "€412.00"],
        ["Transfer with no reference", "€180.00"],
      ],
      aPointer: "To match",
      pointe: "Matched ✓",
      question: "Question sent",
    },
    bilan: {
      dossier: "File 2026-1042",
      paye: "Paid",
      sous: "From appointment to bank statement, matched on Oct 24.",
      etapes: ["Eligibility checked", "Claim form sent", "Insurer billed", "Payment matched"],
    },
    agents: ["Eligibility", "Billing", "Collections"],
    actions: {
      saisitNir: "Enters the social security number…",
      consulte: "Checks eligibility…",
      droitsOk: "Coverage active, insurer confirmed",
      versFacturation: "Handed to the Billing agent",
      litNotes: "Reads the practitioner’s notes…",
      cote: "Codes the procedures…",
      teletransmet: "Transmits the claim form…",
      fseOk: "Claim form transmitted",
      joint: "Attaches the quote and prescription…",
      saisitMontant: "Enters the amount…",
      envoie: "Sends the request…",
      accordOk: "Approved: €412.00",
      versEncaissement: "Handed to the Collections agent",
      pointeMutuelle: "Matches the insurer transfer…",
      retrouve: "Finds the payment for file 2026-1042…",
      sansRef: "No reference: asking the team",
    },
  },
};

/* ---------- la chronologie (fractions de la boucle de 21 s, reprises telles quelles de la maquette) ---------- */
export const CH: [number, number][] = [
  [0.12, 0.3],
  [0.3, 0.5],
  [0.5, 0.7],
  [0.7, 0.9],
];
export const DUR = 21000;
export const END = 0.965;
export const HOLD = 3200;

/* deux poses : bureau (scène de 900 × 640) et mobile (600 × 760) */
export type Pose = {
  W: number;
  H: number;
  iso: { x: number; y: number; s: number; g: number };
  deck: { x: number; y: number; s: number; dy: number; ds: number };
  rx: number;
  rz: number;
};
export const POSE: { d: Pose; m: Pose } = {
  d: {
    W: 900,
    H: 640,
    iso: { x: 0, y: 10, s: 1, g: 82 },
    deck: { x: 0, y: 50, s: 1.14, dy: 44, ds: 0.06 },
    rx: 56,
    rz: -40,
  },
  m: {
    W: 600,
    H: 760,
    iso: { x: 0, y: 10, s: 0.94, g: 96 },
    deck: { x: 0, y: 80, s: 1.02, dy: 40, ds: 0.05 },
    rx: 56,
    rz: -40,
  },
};

/* les trois agents : où ils attendent (home), où ils se posent sous « Payé » (sum), quand ils sont visibles, leurs étapes.
   t : la clé de l'élément visé (« sum » : leur place sous la carte « Payé ») ; m : la durée du trajet qui y mène */
export type Etape = {
  p: number;
  t: string;
  act: ActionCle | "";
  click?: boolean;
  fin?: boolean;
  m?: number;
};
export type AgentSpec = {
  color: string;
  home: string;
  sum: string;
  vis: [number, number][];
  wp: Etape[];
};
export const SPEC: AgentSpec[] = [
  {
    color: "var(--mint)",
    home: "home1",
    sum: "sum1",
    vis: [
      [0.11, 0.305],
      [0.9, 2],
    ],
    wp: [
      { p: 0.155, t: "nir", act: "saisitNir", click: true, m: 0.03 },
      { p: 0.21, t: "b-droits", act: "consulte", click: true },
      { p: 0.238, t: "res-amc-l", act: "droitsOk", fin: true },
      { p: 0.27, t: "res-amc-l", act: "versFacturation", fin: true },
      { p: 0.92, t: "sum", act: "", fin: true, m: 0.025 },
    ],
  },
  {
    color: "var(--sky)",
    home: "home2",
    sum: "sum2",
    vis: [
      [0.29, 0.705],
      [0.912, 2],
    ],
    wp: [
      { p: 0.335, t: "notes", act: "litNotes", m: 0.03 },
      { p: 0.362, t: "b-coter", act: "cote", click: true },
      { p: 0.412, t: "b-tele", act: "teletransmet", click: true },
      { p: 0.445, t: "l-fse", act: "fseOk", fin: true },
      { p: 0.532, t: "att", act: "joint", click: true, m: 0.03 },
      { p: 0.575, t: "mt", act: "saisitMontant", click: true },
      { p: 0.612, t: "b-env", act: "envoie", click: true },
      { p: 0.645, t: "res-acc-l", act: "accordOk", fin: true },
      { p: 0.672, t: "res-acc-l", act: "versEncaissement", fin: true },
      { p: 0.937, t: "sum", act: "", fin: true, m: 0.025 },
    ],
  },
  {
    color: "var(--blush)",
    home: "home3",
    sum: "sum3",
    vis: [[0.685, 2]],
    wp: [
      { p: 0.73, t: "tr1", act: "pointeMutuelle", click: true, m: 0.03 },
      { p: 0.762, t: "tr2", act: "retrouve", click: true },
      { p: 0.797, t: "tr3-l", act: "sansRef", fin: true },
      { p: 0.954, t: "sum", act: "", fin: true, m: 0.025 },
    ],
  },
];

/* les changements d'état des fenêtres : c ajoute une classe (« -x » la retire), t change le texte */
type TexteCle =
  "cote" | "envoi" | "teletransmise" | "envoyee" | "envoyeeTp" | "pointe" | "question";
export const STATES: { p: number; k: string; c?: string; t?: TexteCle }[] = [
  { p: 0.155, k: "nir", c: "focus" },
  { p: 0.196, k: "nir", c: "-focus" },
  { p: 0.215, k: "res-amo", c: "on" },
  { p: 0.232, k: "res-amc", c: "on" },
  { p: 0.335, k: "notes", c: "read" },
  { p: 0.362, k: "notes", c: "-read" },
  { p: 0.366, k: "codes", c: "on" },
  { p: 0.366, k: "b-coter", t: "cote" },
  { p: 0.415, k: "st-fse", t: "envoi" },
  { p: 0.432, k: "st-fse", t: "teletransmise", c: "ok" },
  { p: 0.432, k: "b-tele", t: "envoyee" },
  { p: 0.535, k: "att1", c: "on" },
  { p: 0.545, k: "att2", c: "on" },
  { p: 0.575, k: "mt", c: "focus" },
  { p: 0.596, k: "mt", c: "-focus" },
  { p: 0.615, k: "b-env", t: "envoyeeTp" },
  { p: 0.63, k: "res-acc", c: "on" },
  { p: 0.733, k: "tr1", c: "hit" },
  { p: 0.736, k: "tr1-st", t: "pointe", c: "ok" },
  { p: 0.765, k: "tr2", c: "hit" },
  { p: 0.768, k: "tr2-st", t: "pointe", c: "ok" },
  { p: 0.8, k: "tr3-st", t: "question", c: "ask" },
  { p: 0.912, k: "sum", c: "on" },
];

/* les deux saisies au clavier */
export const TYPES: { p0: number; p1: number; k: string }[] = [
  { p0: 0.158, p1: 0.192, k: "nir-typed" },
  { p0: 0.578, p1: 0.592, k: "mt-typed" },
];

/* le texte de départ (avant tout changement) des éléments dont le texte change, et les textes d'arrivée */
export function textes(c: CopieProduit) {
  const orig: Record<string, string> = {
    "b-coter": c.metier.coter,
    "st-fse": c.metier.aEnvoyer,
    "b-tele": c.metier.teletransmettre,
    "b-env": c.tp.envoyer,
    "tr1-st": c.banque.aPointer,
    "tr2-st": c.banque.aPointer,
    "tr3-st": c.banque.aPointer,
  };
  const etat: Record<TexteCle, string> = {
    cote: c.metier.cote,
    envoi: c.metier.envoi,
    teletransmise: c.metier.teletransmise,
    envoyee: c.metier.envoyee,
    envoyeeTp: c.tp.envoyee,
    pointe: c.banque.pointe,
    question: c.banque.question,
  };
  const typed: Record<string, string> = {
    "nir-typed": "1 84 •• •• ••• ••• ••",
    "mt-typed": c.tp.somme,
  };
  return { orig, etat, typed };
}

/* l'état des fenêtres à l'instant p : texte (si changé) et classes de chaque élément repéré */
export type EtatEl = { t: string | null; cls: Record<string, boolean> };
export function etatsA(p: number, c: CopieProduit): Record<string, EtatEl> {
  const { orig, etat, typed } = textes(c);
  const out: Record<string, EtatEl> = {};
  for (const st of STATES) {
    const e = (out[st.k] ??= { t: st.k in orig ? orig[st.k] : null, cls: {} });
    if (st.c) {
      const nom = st.c.replace("-", "");
      if (!(nom in e.cls)) e.cls[nom] = false;
    }
    if (p < st.p) continue;
    if (st.t) e.t = etat[st.t];
    if (st.c) e.cls[st.c.replace("-", "")] = st.c.charAt(0) !== "-";
  }
  for (const ty of TYPES) {
    const txt = typed[ty.k];
    const f = Math.min(1, Math.max(0, (p - ty.p0) / (ty.p1 - ty.p0)));
    out[ty.k] = { t: txt.slice(0, Math.round(txt.length * f)), cls: {} };
  }
  return out;
}

/* ---------- la pose d'un calque à l'instant p : pile isométrique → paquet de fenêtres → pile refermée sous « Payé » ---------- */
const clamp = (v: number, a = 0, b = 1) => (v < a ? a : v > b ? b : v);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
export const smooth = (a: number, b: number, x: number) => {
  const t = clamp((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};
export function chap(p: number) {
  let c = 0;
  CH.slice(0, 3).forEach((ch) => {
    c += smooth(ch[1] - 0.025, ch[1] + 0.025, p);
  });
  return c;
}

export function poseCalque(i: number, p: number, P: Pose) {
  const m = smooth(0.07, 0.13, p),
    c = chap(p),
    o = smooth(0.885, 0.935, p);
  const ap = easeOut(clamp((p - 0.004 - i * 0.011) / 0.04));
  const iy = P.iso.y + (i - 1.5) * P.iso.g + (1 - ap) * 520;
  const dd0 = i - c;
  let dy: number, ds: number, dop: number;
  if (dd0 >= 0) {
    const dd = Math.min(dd0, 3);
    dy = P.deck.y - dd * P.deck.dy;
    ds = P.deck.s - dd * P.deck.ds;
    dop = 1;
  } else {
    dy = P.deck.y - dd0 * 260;
    ds = P.deck.s + dd0 * 0.06;
    dop = 1 - clamp(-dd0 * 3);
  }
  let x = lerp(P.iso.x, P.deck.x, m),
    y = lerp(iy, dy, m),
    rx = lerp(P.rx, 0, m),
    rz = lerp(P.rz, 0, m),
    s = lerp(P.iso.s, ds, m),
    op = ap * lerp(1, dop, m);
  if (o > 0) {
    const fy = P.iso.y + 110 + (i - 1.5) * 14,
      fs = P.iso.s * 0.78;
    if (dd0 < 0) {
      x = P.iso.x;
      y = fy;
      rx = P.rx;
      rz = P.rz;
      s = fs;
      op = o * 0.9;
    } else {
      y = lerp(y, fy, o);
      x = lerp(x, P.iso.x, o);
      rx = lerp(rx, P.rx, o);
      rz = lerp(rz, P.rz, o);
      s = lerp(s, fs, o);
      op = lerp(op, 0.9, o);
    }
  }
  return {
    transform: `translate(${x.toFixed(1)}px,${y.toFixed(1)}px) rotateX(${rx.toFixed(2)}deg) rotateZ(${rz.toFixed(2)}deg) scale(${s.toFixed(4)})`,
    op,
    z: o > 0.5 ? 10 - i : dd0 < 0 ? 30 : 20 - Math.round(Math.min(dd0, 9) * 2),
    dim: m * (1 - o) * clamp(dd0) * 0.55 + o * 0.25,
  };
}
