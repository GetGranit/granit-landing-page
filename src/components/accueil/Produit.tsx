/* Accueil : la section Produit, « Démo en calques » (la présentation que la maquette finale affiche).
   Quatre logiciels empilés (AmeliPro, logiciel métier, tiers payant, banque), trois agents qui y travaillent ;
   lue comme une mini-vidéo de 21 s en boucle, chapitres cliquables. En pause hors écran.
   « Mouvements réduits » : l'état final posé (« Payé »), les chapitres restent cliquables. */
import { useEffect, useRef } from "react";
import { useLanguage } from "@/lib/i18n";
import { useReducedMotion } from "./commun";

const copy = {
  fr: {
    eb: "Le produit",
    h: ["Du rendez-vous au virement,", "sans que personne n’y touche."],
    lead: "Droits, facturation, encaissement : chaque dossier va jusqu’au virement. Quand un cas sort de l’ordinaire, nos experts métiers le gèrent. Le reste, vous n’en entendez plus parler.",
    chapGroup: "Chapitres de la démo",
    chap: (i: number, s: string) => `Chapitre ${i} : ${s}`,
    chapitres: [
      "Vérifier les droits",
      "Coter et télétransmettre",
      "Facturer la mutuelle",
      "Encaisser et pointer",
    ],
    stage: "Démo : un dossier passe dans quatre logiciels, exemple avec des données fictives",
    l0: {
      b: "AmeliPro",
      cr: "Assurance Maladie",
      tabs: ["Droits", "Feuilles de soins", "Paiements"],
      label: "N° de sécurité sociale · patient de 9 h 30",
      btn: "Consulter les droits",
      amo: "Assurance Maladie",
      amoSt: "Droits ouverts ✓",
      amc: "Mutuelle",
      amcSt: "Confirmée ✓",
    },
    l1: {
      b: "Logiciel métier",
      cr: "Dossier 2026-1042 · 9 h 30",
      notes: "Notes du praticien",
      cot: "Cotation",
      a1: "Acte 1 ✓",
      a2: "Acte 2 ✓",
      coter: "Coter",
      fse: "Feuille de soins",
      fseSt: "À envoyer",
      tele: "Télétransmettre",
    },
    l2: {
      b: "Tiers payant",
      cr: "Plateforme de la mutuelle",
      ph: "Demande de prise en charge · dossier 2026-1042",
      pieces: "Pièces",
      devis: "Devis.pdf",
      ordo: "Ordonnance.pdf",
      montant: "Montant",
      typed: "412,00 €",
      env: "Envoyer",
      rep: "Réponse de la mutuelle",
      repSt: "Accord reçu · 412,00 € ✓",
    },
    l3: {
      b: "Compte bancaire",
      cr: "Relevé du 24 oct.",
      lib: "Libellé",
      mt: "Montant",
      rows: [
        ["Virement mutuelle · 9 dossiers", "1 284,60 €"],
        ["Tiers payant · dossier 2026-1042", "412,00 €"],
        ["Virement sans référence", "180,00 €"],
      ],
      aPointer: "À pointer",
    },
    sum: {
      k: "Dossier 2026-1042",
      big: "Payé",
      sub: "Du rendez-vous au relevé bancaire, pointé le 24 oct.",
      li: ["Droits vérifiés", "Feuille de soins envoyée", "Mutuelle facturée", "Paiement pointé"],
    },
    agents: ["Droits", "Facturation", "Encaissement"],
    act: {
      nir: "Saisit le n° de sécurité sociale…",
      droits: "Consulte les droits…",
      ouverts: "Droits ouverts, mutuelle confirmée",
      versFact: "Transmis à l’agent Facturation",
      notes: "Lit les notes du praticien…",
      coter: "Cote les actes…",
      tele: "Télétransmet la feuille de soins…",
      teleOk: "Feuille de soins télétransmise",
      joint: "Joint le devis et l’ordonnance…",
      montant: "Saisit le montant…",
      envoie: "Envoie la demande…",
      accord: "Accord reçu : 412,00 €",
      versEnc: "Transmis à l’agent Encaissement",
      tr1: "Pointe le virement mutuelle…",
      tr2: "Retrouve le paiement du dossier 2026-1042…",
      tr3: "Sans référence : je demande à l’équipe",
    },
    st: {
      cote: "Coté",
      envoi: "Envoi…",
      teleOk: "Télétransmise ✓",
      envoyee: "Envoyée",
      pointe: "Pointé ✓",
      question: "Question posée",
    },
  },
  en: {
    eb: "The product",
    h: ["From the appointment to the bank transfer,", "without anyone touching it."],
    lead: "Eligibility, billing, collection: every claim goes all the way to the bank transfer. When a case is out of the ordinary, our in-house experts handle it. The rest, you never hear about again.",
    chapGroup: "Demo chapters",
    chap: (i: number, s: string) => `Chapter ${i}: ${s}`,
    chapitres: [
      "Verify eligibility",
      "Code and e-transmit",
      "Bill the mutuelle",
      "Collect and reconcile",
    ],
    stage: "Demo: one claim moves through four software tools, an example with fictitious data",
    l0: {
      b: "AmeliPro",
      cr: "Assurance Maladie",
      tabs: ["Eligibility", "Claim forms", "Payments"],
      label: "Social security no. · 9:30 a.m. patient",
      btn: "Check eligibility",
      amo: "Assurance Maladie",
      amoSt: "Coverage active ✓",
      amc: "Mutuelle",
      amcSt: "Confirmed ✓",
    },
    l1: {
      b: "Practice software",
      cr: "File 2026-1042 · 9:30 a.m.",
      notes: "Practitioner’s notes",
      cot: "Coding",
      a1: "Procedure 1 ✓",
      a2: "Procedure 2 ✓",
      coter: "Code",
      fse: "Claim form",
      fseSt: "To send",
      tele: "E-transmit",
    },
    l2: {
      b: "Third-party payment",
      cr: "Mutuelle platform",
      ph: "Coverage request · file 2026-1042",
      pieces: "Attachments",
      devis: "Quote.pdf",
      ordo: "Prescription.pdf",
      montant: "Amount",
      typed: "€412.00",
      env: "Send",
      rep: "Mutuelle response",
      repSt: "Approved · €412.00 ✓",
    },
    l3: {
      b: "Bank account",
      cr: "Statement of Oct 24",
      lib: "Description",
      mt: "Amount",
      rows: [
        ["Mutuelle transfer · 9 files", "€1,284.60"],
        ["Third-party payment · file 2026-1042", "€412.00"],
        ["Transfer without reference", "€180.00"],
      ],
      aPointer: "To reconcile",
    },
    sum: {
      k: "File 2026-1042",
      big: "Paid",
      sub: "From appointment to bank statement, reconciled on Oct 24.",
      li: ["Eligibility verified", "Claim form sent", "Mutuelle billed", "Payment reconciled"],
    },
    agents: ["Eligibility", "Billing", "Collection"],
    act: {
      nir: "Enters the social security no.…",
      droits: "Checks eligibility…",
      ouverts: "Coverage active, mutuelle confirmed",
      versFact: "Handed to the Billing agent",
      notes: "Reads the practitioner’s notes…",
      coter: "Codes the procedures…",
      tele: "E-transmits the claim form…",
      teleOk: "Claim form e-transmitted",
      joint: "Attaches the quote and prescription…",
      montant: "Enters the amount…",
      envoie: "Sends the request…",
      accord: "Approved: €412.00",
      versEnc: "Handed to the Collection agent",
      tr1: "Reconciles the mutuelle transfer…",
      tr2: "Finds the payment for file 2026-1042…",
      tr3: "No reference: asking the team",
    },
    st: {
      cote: "Coded",
      envoi: "Sending…",
      teleOk: "E-transmitted ✓",
      envoyee: "Sent",
      pointe: "Reconciled ✓",
      question: "Question asked",
    },
  },
};
type Copy = (typeof copy)["fr"];

/* ---------- petits outils d'animation ---------- */
const clamp = (v: number, a = 0, b = 1) => (v < a ? a : v > b ? b : v);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
const smooth = (a: number, b: number, x: number) => {
  const t = clamp((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};
const SPIN =
  '<svg viewBox="0 0 16 16">' +
  [0, 1, 2, 3, 4, 5, 6, 7]
    .map(
      (i) =>
        `<line x1="8" y1="1.8" x2="8" y2="4.6" transform="rotate(${i * 45} 8 8)" opacity="${(0.25 + i * 0.107).toFixed(2)}"/>`,
    )
    .join("") +
  "</svg>";

/* un curseur d'agent : la flèche, l'anneau du clic, la bulle (nom, ce qu'il fait) */
class Agent {
  el: HTMLDivElement;
  actEl: HTMLElement;
  sp!: Spec;
  private _t: string | null = null;
  private _s: string | null = null;
  private _wt: string | null = null;
  private _tw = 0;
  private _fl: boolean | null = null;
  private _mw = "";
  private _ct = 0;
  constructor(parent: HTMLElement, who: string, color: string) {
    const el = document.createElement("div");
    el.className = "acc-agent idle";
    el.style.setProperty("--ac", color);
    el.innerHTML =
      '<span class="ring"></span><svg class="ptr" viewBox="0 0 22 24"><path d="M1 1l17 9.6-7.4 1.7L6.6 19.6z"/></svg>' +
      '<span class="tag"><span class="spin">' +
      SPIN +
      '</span><span class="okk">✓</span><span class="who"></span><span class="act"></span></span>';
    (el.querySelector(".who") as HTMLElement).textContent = who;
    parent.appendChild(el);
    this.el = el;
    this.actEl = el.querySelector(".act") as HTMLElement;
  }
  place(x: number, y: number, op: string) {
    this.el.style.transform = `translate3d(${x.toFixed(1)}px,${y.toFixed(1)}px,0)`;
    this.el.style.opacity = op;
  }
  say(text: string, state: string) {
    if (this._t !== text) {
      this._t = text;
      this.actEl.textContent = text || "";
    }
    if (this._s !== state) {
      this._s = state;
      this.el.classList.toggle("idle", state === "idle");
      this.el.classList.toggle("fin", state === "fin");
    }
  }
  click() {
    const el = this.el;
    el.classList.remove("click");
    void el.offsetWidth;
    el.classList.add("click");
    window.clearTimeout(this._ct);
    this._ct = window.setTimeout(() => el.classList.remove("click"), 600);
  }
  /* la bulle passe à gauche du curseur quand elle déborderait à droite */
  fit(x: number, limL: number, limR: number) {
    if (this._wt !== this._t) {
      this._wt = this._t;
      this.el.style.removeProperty("--mw");
      this._mw = "";
      this._tw = (this.el.querySelector(".tag") as HTMLElement).offsetWidth;
    }
    const roomR = limR - (x + 20);
    const roomL = x - 6 - limL;
    let on: boolean;
    let mw = "";
    if (this._tw <= roomR) on = false;
    else if (this._tw <= roomL) on = true;
    else {
      on = roomL > roomR;
      mw = Math.max(110, Math.floor(on ? roomL : roomR)) + "px";
    }
    if (on !== this._fl) {
      this._fl = on;
      this.el.classList.toggle("flip", on);
    }
    if (mw !== this._mw) {
      this._mw = mw;
      if (mw) this.el.style.setProperty("--mw", mw);
      else this.el.style.removeProperty("--mw");
    }
  }
}

type Wp = { p: number; t: string; act: string; click?: 1; fin?: 1; m?: number; el?: HTMLElement };
type Spec = {
  who: string;
  color: string;
  home: string;
  sum: string;
  vis: number[][];
  wp: Wp[];
  homeEl?: HTMLElement;
  sumEl?: HTMLElement;
};
type St = { p: number; s: string; c?: string; t?: string };

const CH = [
  [0.12, 0.3],
  [0.3, 0.5],
  [0.5, 0.7],
  [0.7, 0.9],
];
const POSE = {
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
const DUR = 21000;
const END = 0.965;
const HOLD = 3200;

/* Le moteur de la démo : la position p (0 → 1) fait tout bouger ; le temps la fait avancer. */
function lancerDemo(root: HTMLElement, t: Copy, still: boolean) {
  const $ = (s: string) => root.querySelector<HTMLElement>(s) as HTMLElement;
  const $$ = (s: string) => Array.from(root.querySelectorAll<HTMLElement>(s));
  const mobile = () => window.innerWidth < 861;
  const live = !still;
  let now = performance.now();
  const S = {
    stage: $(".acc-pr1-stage"),
    inner: $(".acc-pr1-inner"),
    over: $(".acc-pr1-over"),
    layers: $$(".acc-layer"),
    labels: $$(".acc-lyr"),
    segs: $$(".acc-segs button"),
    p: live ? 0 : END,
    ps: live ? 0 : END,
    prev: 0,
    playing: live,
    hold: 0,
    drawn: -1,
  };
  const a = t.act;
  const SPEC: Spec[] = [
    {
      who: t.agents[0],
      color: "var(--acc-mint)",
      home: "#accd-home1",
      sum: "#accd-sum1",
      vis: [
        [0.11, 0.305],
        [0.9, 2],
      ],
      wp: [
        { p: 0.155, t: "#accd-nir", act: a.nir, click: 1, m: 0.03 },
        { p: 0.21, t: "#accd-b-droits", act: a.droits, click: 1 },
        { p: 0.238, t: "#accd-res-amc span", act: a.ouverts, fin: 1 },
        { p: 0.27, t: "#accd-res-amc span", act: a.versFact, fin: 1 },
        { p: 0.92, t: "sum", act: "", fin: 1, m: 0.025 },
      ],
    },
    {
      who: t.agents[1],
      color: "var(--acc-sky)",
      home: "#accd-home2",
      sum: "#accd-sum2",
      vis: [
        [0.29, 0.705],
        [0.912, 2],
      ],
      wp: [
        { p: 0.335, t: "#accd-notes", act: a.notes, m: 0.03 },
        { p: 0.362, t: "#accd-b-coter", act: a.coter, click: 1 },
        { p: 0.412, t: "#accd-b-tele", act: a.tele, click: 1 },
        { p: 0.445, t: "#accd-l-fse", act: a.teleOk, fin: 1 },
        { p: 0.532, t: "#accd-att", act: a.joint, click: 1, m: 0.03 },
        { p: 0.575, t: "#accd-mt", act: a.montant, click: 1 },
        { p: 0.612, t: "#accd-b-env", act: a.envoie, click: 1 },
        { p: 0.645, t: "#accd-res-acc span", act: a.accord, fin: 1 },
        { p: 0.672, t: "#accd-res-acc span", act: a.versEnc, fin: 1 },
        { p: 0.937, t: "sum", act: "", fin: 1, m: 0.025 },
      ],
    },
    {
      who: t.agents[2],
      color: "var(--acc-blush)",
      home: "#accd-home3",
      sum: "#accd-sum3",
      vis: [[0.685, 2]],
      wp: [
        { p: 0.73, t: "#accd-tr1", act: a.tr1, click: 1, m: 0.03 },
        { p: 0.762, t: "#accd-tr2", act: a.tr2, click: 1 },
        { p: 0.797, t: "#accd-tr3 span", act: a.tr3, fin: 1 },
        { p: 0.954, t: "sum", act: "", fin: 1, m: 0.025 },
      ],
    },
  ];
  const s = t.st;
  const STATES: St[] = [
    { p: 0.155, s: "#accd-nir", c: "focus" },
    { p: 0.196, s: "#accd-nir", c: "-focus" },
    { p: 0.215, s: "#accd-res-amo", c: "on" },
    { p: 0.232, s: "#accd-res-amc", c: "on" },
    { p: 0.335, s: "#accd-notes", c: "read" },
    { p: 0.362, s: "#accd-notes", c: "-read" },
    { p: 0.366, s: "#accd-codes", c: "on" },
    { p: 0.366, s: "#accd-b-coter", t: s.cote },
    { p: 0.415, s: "#accd-st-fse", t: s.envoi },
    { p: 0.432, s: "#accd-st-fse", t: s.teleOk, c: "ok" },
    { p: 0.432, s: "#accd-b-tele", t: s.envoyee },
    { p: 0.535, s: "#accd-att1", c: "on" },
    { p: 0.545, s: "#accd-att2", c: "on" },
    { p: 0.575, s: "#accd-mt", c: "focus" },
    { p: 0.596, s: "#accd-mt", c: "-focus" },
    { p: 0.615, s: "#accd-b-env", t: s.envoyee },
    { p: 0.63, s: "#accd-res-acc", c: "on" },
    { p: 0.733, s: "#accd-tr1", c: "hit" },
    { p: 0.736, s: "#accd-tr1 .acc-st", t: s.pointe, c: "ok" },
    { p: 0.765, s: "#accd-tr2", c: "hit" },
    { p: 0.768, s: "#accd-tr2 .acc-st", t: s.pointe, c: "ok" },
    { p: 0.8, s: "#accd-tr3 .acc-st", t: s.question, c: "ask" },
    { p: 0.912, s: "#accd-sum", c: "on" },
  ];
  const TYPES = [
    { p0: 0.158, p1: 0.192, el: $("#accd-nir .acc-typed"), text: "" },
    { p0: 0.578, p1: 0.592, el: $("#accd-mt .acc-typed"), text: "" },
  ];
  TYPES.forEach((ty) => (ty.text = ty.el.dataset.text ?? ""));

  const agents = SPEC.map((sp) => {
    const ag = new Agent(S.over, sp.who, sp.color);
    ag.sp = sp;
    return ag;
  });
  type Rec = { el: HTMLElement; orig: string; items: St[]; hasText?: boolean };
  const stateEls: Rec[] = [];
  STATES.forEach((st) => {
    const el = $(st.s);
    if (!el) return;
    let rec = stateEls.find((r) => r.el === el);
    if (!rec) {
      rec = { el, orig: el.textContent ?? "", items: [] };
      stateEls.push(rec);
    }
    rec.items.push(st);
    if (st.t != null) rec.hasText = true;
  });
  SPEC.forEach((sp) => {
    sp.homeEl = $(sp.home);
    sp.sumEl = $(sp.sum);
    sp.wp.forEach((w) => {
      w.el = w.t === "sum" ? sp.sumEl : $(w.t);
      w.m = w.m || 0.018;
    });
  });

  const center = (el: Element, ref: DOMRect) => {
    const r = el.getBoundingClientRect();
    return { x: r.left + r.width / 2 - ref.left, y: r.top + r.height / 2 - ref.top };
  };
  const press = (el: HTMLElement | undefined) => {
    if (!el) return;
    el.classList.add("press");
    window.setTimeout(() => el.classList.remove("press"), 240);
  };
  const chap = (p: number) =>
    CH.slice(0, 3).reduce((c, ch) => c + smooth(ch[1] - 0.025, ch[1] + 0.025, p), 0);

  function applyStates(p: number) {
    stateEls.forEach((rec) => {
      let txt: string | null = null;
      const cls: Record<string, boolean> = {};
      rec.items.forEach((st) => {
        if (p < st.p) return;
        if (st.t != null) txt = st.t;
        if (st.c) {
          if (st.c.charAt(0) === "-") cls[st.c.slice(1)] = false;
          else cls[st.c] = true;
        }
      });
      if (rec.hasText) {
        const want = txt == null ? rec.orig : txt;
        if (rec.el.textContent !== want) rec.el.textContent = want;
      }
      rec.items.forEach((st) => {
        if (st.c) {
          const c = st.c.replace("-", "");
          rec.el.classList.toggle(c, !!cls[c]);
        }
      });
    });
    TYPES.forEach((ty) => {
      const sub = ty.text.slice(
        0,
        Math.round(ty.text.length * clamp((p - ty.p0) / (ty.p1 - ty.p0))),
      );
      if (ty.el.textContent !== sub) ty.el.textContent = sub;
    });
  }
  function target(ag: Agent, p: number) {
    const wp = ag.sp.wp;
    let last: Wp | null = null;
    let next: Wp | null = null;
    for (let i = 0; i < wp.length; i++) {
      if (wp[i].p <= p) last = wp[i];
      else {
        next = wp[i];
        break;
      }
    }
    return { last, next };
  }

  function draw(dt: number, force?: boolean) {
    if (!force && !S.playing && S.ps === S.p && S.drawn === S.p) return;
    S.drawn = S.p;
    /* 21 s du début à « Payé », une pause, puis on recommence */
    if (S.playing) {
      if (S.p < END) S.p = Math.min(END, S.p + dt / DUR);
      else {
        S.hold += dt;
        if (S.hold > HOLD) {
          S.hold = 0;
          S.p = 0;
          S.ps = 0;
          S.prev = 0;
        }
      }
    }
    S.ps = Math.abs(S.p - S.ps) > 0.02 ? lerp(S.ps, S.p, Math.min(1, dt * 0.008)) : S.p;
    const p = S.ps;
    const P = mobile() ? POSE.m : POSE.d;
    const k = Math.min(S.stage.clientWidth / P.W, S.stage.clientHeight / P.H);
    S.inner.style.width = P.W + "px";
    S.inner.style.height = P.H + "px";
    S.inner.style.transform = `translate(-50%,-50%) scale(${k.toFixed(4)})`;
    /* pile isométrique → paquet de fenêtres (une devant, les suivantes derrière) → pile refermée sous « Payé » */
    const m = smooth(0.07, 0.13, p);
    const c = chap(p);
    const o = smooth(0.885, 0.935, p);
    const lop: number[] = [];
    S.layers.forEach((L, i) => {
      const ap = easeOut(clamp((p - 0.004 - i * 0.011) / 0.04));
      const iy = P.iso.y + (i - 1.5) * P.iso.g + (1 - ap) * 520;
      const dd0 = i - c;
      let dy: number;
      let ds: number;
      let dop: number;
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
      let x = lerp(P.iso.x, P.deck.x, m);
      let y = lerp(iy, dy, m);
      let rx = lerp(P.rx, 0, m);
      let rz = lerp(P.rz, 0, m);
      let sc = lerp(P.iso.s, ds, m);
      let op = ap * lerp(1, dop, m);
      if (o > 0) {
        const fy = P.iso.y + 110 + (i - 1.5) * 14;
        const fs = P.iso.s * 0.78;
        if (dd0 < 0) {
          x = P.iso.x;
          y = fy;
          rx = P.rx;
          rz = P.rz;
          sc = fs;
          op = o * 0.9;
        } else {
          y = lerp(y, fy, o);
          x = lerp(x, P.iso.x, o);
          rx = lerp(rx, P.rx, o);
          rz = lerp(rz, P.rz, o);
          sc = lerp(sc, fs, o);
          op = lerp(op, 0.9, o);
        }
      }
      L.style.transform = `translate(${x.toFixed(1)}px,${y.toFixed(1)}px) rotateX(${rx.toFixed(2)}deg) rotateZ(${rz.toFixed(2)}deg) scale(${sc.toFixed(4)})`;
      L.style.opacity = op.toFixed(3);
      lop[i] = op;
      L.style.zIndex = String(
        o > 0.5 ? 10 - i : dd0 < 0 ? 30 : 20 - Math.round(Math.min(dd0, 9) * 2),
      );
      L.style.setProperty("--dim", (m * (1 - o) * clamp(dd0) * 0.55 + o * 0.25).toFixed(3));
    });
    const ref = S.stage.getBoundingClientRect();
    S.labels.forEach((lb, i) => {
      const r = S.layers[i].getBoundingClientRect();
      const vis = clamp((p - 0.02 - i * 0.011) / 0.03) * (1 - smooth(0.062, 0.082, p));
      lb.style.transform = `translate(${(r.right - ref.left - r.width * 0.16).toFixed(1)}px,${(r.top - ref.top + r.height * 0.5 - 6).toFixed(1)}px)`;
      lb.style.opacity = vis.toFixed(3);
    });
    applyStates(p);
    agents.forEach((ag, ai) => {
      const sp = ag.sp;
      const tg = target(ag, p);
      const home = center(sp.homeEl as HTMLElement, ref);
      const at = (w: Wp) => center(w.el as HTMLElement, ref);
      let pos = home;
      let state = "idle";
      let text = "";
      if (!tg.last) {
        if (tg.next && p > tg.next.p - (tg.next.m as number)) {
          const f0 = (p - (tg.next.p - (tg.next.m as number))) / (tg.next.m as number);
          const b0 = at(tg.next);
          pos = {
            x: lerp(home.x, b0.x, ease(f0)),
            y: lerp(home.y, b0.y, ease(f0)) - Math.sin(f0 * Math.PI) * 26,
          };
          text = tg.next.act;
          state = "run";
        }
      } else {
        const P0 = at(tg.last);
        pos = P0;
        text = tg.last.act;
        state = tg.last.fin ? "fin" : "run";
        if (tg.next && p > tg.next.p - (tg.next.m as number)) {
          const f = (p - (tg.next.p - (tg.next.m as number))) / (tg.next.m as number);
          const B = at(tg.next);
          pos = {
            x: lerp(P0.x, B.x, ease(f)),
            y: lerp(P0.y, B.y, ease(f)) - Math.sin(f * Math.PI) * 26,
          };
          text = tg.next.act;
          state = tg.next.fin && f > 0.9 ? "fin" : "run";
        }
      }
      let vis = 0;
      sp.vis.forEach((v) => {
        vis = Math.max(
          vis,
          smooth(v[0], v[0] + 0.015, p) * (v[1] > 1 ? 1 : 1 - smooth(v[1] - 0.012, v[1], p)),
        );
      });
      const onL = (w: Wp) => {
        const L = w.el?.closest(".acc-layer") as HTMLElement | null;
        return L ? lop[+(L.dataset.l ?? 0)] : 1;
      };
      if (tg.last) {
        const nx = tg.next;
        vis *=
          nx && p > nx.p - (nx.m as number)
            ? lerp(onL(tg.last), onL(nx), clamp((p - (nx.p - (nx.m as number))) / (nx.m as number)))
            : onL(tg.last);
      }
      const resting = state !== "run";
      const bob = live ? 1 : 0;
      pos = {
        x: pos.x + Math.sin(now / 700 + ai * 2) * (resting ? 4 : 1.2) * bob,
        y: pos.y + Math.cos(now / 830 + ai) * (resting ? 3 : 1) * bob + (1 - vis) * 14,
      };
      ag.place(pos.x, pos.y, vis.toFixed(3));
      ag.el.style.visibility = vis < 0.01 ? "hidden" : "";
      ag.say(state === "idle" ? "" : text, state);
      ag.fit(
        pos.x,
        mobile() ? 8 - ref.left : 0,
        ref.width + Math.max(0, window.innerWidth - ref.right - 14),
      );
      sp.wp.forEach((w) => {
        if (w.click && S.prev < w.p && p >= w.p) {
          ag.click();
          press(w.el?.tagName === "BUTTON" ? w.el : undefined);
        }
      });
    });
    S.segs.forEach((sg, i) =>
      sg.style.setProperty("--f", clamp((p - CH[i][0]) / (CH[i][1] - CH[i][0])).toFixed(3)),
    );
    S.prev = p;
  }

  /* un chapitre se clique pour y sauter */
  const onSeg = S.segs.map((b, i) => {
    const fn = () => {
      S.p = CH[i][0] + 0.002;
      S.hold = 0;
      if (S.p < S.ps) S.prev = S.p;
      S.playing = live;
      if (!live) {
        S.ps = S.p;
        draw(0, true);
      }
    };
    b.addEventListener("click", fn);
    return fn;
  });

  let raf = 0;
  let last = performance.now();
  let vis = false;
  function loop(tm: number) {
    raf = 0;
    const dt = Math.min(100, tm - last);
    last = tm;
    now = tm;
    if (!vis || document.hidden) return;
    draw(dt);
    raf = requestAnimationFrame(loop);
  }
  function kick() {
    if (!raf && vis && !document.hidden && live) {
      last = performance.now();
      raf = requestAnimationFrame(loop);
    }
  }
  const io = new IntersectionObserver(
    (es) => {
      vis = es[es.length - 1].isIntersecting;
      kick();
    },
    { threshold: 0.08 },
  );
  io.observe(root);
  const onResize = () => draw(0, true);
  document.addEventListener("visibilitychange", kick);
  window.addEventListener("resize", onResize);
  draw(0, true);
  return () => {
    io.disconnect();
    cancelAnimationFrame(raf);
    document.removeEventListener("visibilitychange", kick);
    window.removeEventListener("resize", onResize);
    S.segs.forEach((b, i) => b.removeEventListener("click", onSeg[i]));
    agents.forEach((ag) => ag.el.remove());
  };
}

function Demo({ t, still }: { t: Copy; still: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    return lancerDemo(ref.current, t, still);
  }, [t, still]);
  return (
    <div className="acc-pr1" ref={ref}>
      <div className="acc-pr1-side">
        <div className="acc-pr-head">
          <span className="acc-eb">{t.eb}</span>
          <h2 className="acc-h2" id="acc-pr-t">
            {t.h[0]}
            <br /> {t.h[1]}
          </h2>
          <p className="acc-lead">{t.lead}</p>
        </div>
        <div className="acc-player">
          <div className="acc-segs" role="group" aria-label={t.chapGroup}>
            {t.chapitres.map((c, i) => (
              <button key={i} type="button" aria-label={t.chap(i + 1, c)}>
                <i />
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="acc-pr1-stage" role="img" aria-label={t.stage}>
        <div className="acc-pr1-inner">
          <div className="acc-layer" data-l="0" style={{ ["--lc" as string]: "var(--acc-sky)" }}>
            <div className="acc-win">
              <div className="acc-wbar">
                <span className="ic" />
                <b>{t.l0.b}</b>
                <span className="cr">{t.l0.cr}</span>
              </div>
              <div className="acc-wbody">
                <div className="acc-tabs">
                  <span className="on">{t.l0.tabs[0]}</span>
                  <span>{t.l0.tabs[1]}</span>
                  <span>{t.l0.tabs[2]}</span>
                </div>
                <div className="acc-frm">
                  <label>{t.l0.label}</label>
                  <div className="fr">
                    <div className="acc-field" id="accd-nir">
                      <span className="acc-typed" data-text="1 84 •• •• ••• ••• ••" />
                    </div>
                    <button className="acc-b" id="accd-b-droits" type="button" tabIndex={-1}>
                      {t.l0.btn}
                    </button>
                  </div>
                </div>
                <div className="acc-res" id="accd-res-amo">
                  <span>{t.l0.amo}</span>
                  <span className="acc-st ok">{t.l0.amoSt}</span>
                </div>
                <div className="acc-res" id="accd-res-amc">
                  <span>{t.l0.amc}</span>
                  <span className="acc-st ok">{t.l0.amcSt}</span>
                </div>
              </div>
            </div>
            <span className="acc-home" id="accd-home1" style={{ left: "30%", top: -34 }} />
          </div>
          <div className="acc-layer" data-l="1" style={{ ["--lc" as string]: "var(--acc-mint)" }}>
            <div className="acc-win">
              <div className="acc-wbar">
                <span className="ic" />
                <b>{t.l1.b}</b>
                <span className="cr">{t.l1.cr}</span>
              </div>
              <div className="acc-wbody">
                <div className="acc-notes" id="accd-notes">
                  <span>{t.l1.notes}</span>
                  <i />
                  <i />
                  <i className="s" />
                </div>
                <div className="acc-line">
                  <span className="lbl">{t.l1.cot}</span>
                  <span className="acc-codes" id="accd-codes">
                    <em>{t.l1.a1}</em>
                    <em>{t.l1.a2}</em>
                  </span>
                  <button className="acc-b" id="accd-b-coter" type="button" tabIndex={-1}>
                    {t.l1.coter}
                  </button>
                </div>
                <div className="acc-line">
                  <span className="lbl" id="accd-l-fse">
                    {t.l1.fse}
                  </span>
                  <span className="acc-st" id="accd-st-fse">
                    {t.l1.fseSt}
                  </span>
                  <button className="acc-b" id="accd-b-tele" type="button" tabIndex={-1}>
                    {t.l1.tele}
                  </button>
                </div>
              </div>
            </div>
            <span className="acc-home" id="accd-home2" style={{ left: "56%", top: -34 }} />
          </div>
          <div className="acc-layer" data-l="2" style={{ ["--lc" as string]: "var(--acc-blush)" }}>
            <div className="acc-win">
              <div className="acc-wbar">
                <span className="ic" />
                <b>{t.l2.b}</b>
                <span className="cr">{t.l2.cr}</span>
              </div>
              <div className="acc-wbody">
                <div className="ph">{t.l2.ph}</div>
                <div className="acc-line">
                  <span className="lbl">{t.l2.pieces}</span>
                  <span className="acc-att" id="accd-att">
                    <em id="accd-att1">{t.l2.devis}</em>
                    <em id="accd-att2">{t.l2.ordo}</em>
                  </span>
                </div>
                <div className="acc-line">
                  <span className="lbl">{t.l2.montant}</span>
                  <div className="acc-field sm" id="accd-mt">
                    <span className="acc-typed" data-text={t.l2.typed} />
                  </div>
                  <button className="acc-b" id="accd-b-env" type="button" tabIndex={-1}>
                    {t.l2.env}
                  </button>
                </div>
                <div className="acc-res" id="accd-res-acc">
                  <span>{t.l2.rep}</span>
                  <span className="acc-st ok">{t.l2.repSt}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="acc-layer" data-l="3" style={{ ["--lc" as string]: "var(--acc-deep)" }}>
            <div className="acc-win">
              <div className="acc-wbar">
                <span className="ic" />
                <b>{t.l3.b}</b>
                <span className="cr">{t.l3.cr}</span>
              </div>
              <div className="acc-wbody">
                <div className="acc-tbl">
                  <div className="tr th">
                    <span>{t.l3.lib}</span>
                    <span>{t.l3.mt}</span>
                    <span />
                  </div>
                  {t.l3.rows.map((r, i) => (
                    <div className="tr" id={`accd-tr${i + 1}`} key={i}>
                      <span>{r[0]}</span>
                      <span>{r[1]}</span>
                      <span className="acc-st">{t.l3.aPointer}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <span className="acc-home" id="accd-home3" style={{ left: "62%", top: -34 }} />
          </div>
          <div className="acc-sum" id="accd-sum">
            <div className="sk">{t.sum.k}</div>
            <div className="sbig">
              {t.sum.big}
              <span>.</span>
            </div>
            <div className="ssub">{t.sum.sub}</div>
            <ol>
              {t.sum.li.map((l) => (
                <li key={l}>{l}</li>
              ))}
            </ol>
            <span className="sa" id="accd-sum1" style={{ left: -20, bottom: -30 }} />
            <span className="sa" id="accd-sum2" style={{ left: 118, bottom: -30 }} />
            <span className="sa" id="accd-sum3" style={{ left: 272, bottom: -30 }} />
          </div>
        </div>
        <div className="acc-pr1-over">
          {[t.l0.b, t.l1.b, t.l2.b, t.l3.b].map((b, i) => (
            <span className="acc-lyr" key={i}>
              0{i + 1} <b>{b}</b>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export function Produit() {
  const { lang } = useLanguage();
  const rm = useReducedMotion();
  return (
    <section className="acc-sec acc-light acc-pr" id="produit" aria-labelledby="acc-pr-t">
      <div className="acc-wrap">
        {/* key : la démo écrit dans son propre DOM (textes d'état, curseurs) ; on la refait à neuf si la langue ou le mouvement change */}
        <Demo key={`${lang}-${rm}`} t={copy[lang]} still={rm} />
      </div>
    </section>
  );
}
