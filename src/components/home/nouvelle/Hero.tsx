/* Nouvelle home : bandeau de la levée et hero vidéo (portage de landing/index.html et lm/tandem.js).
   La vidéo plein cadre tourne en boucle, en pause hors écran ; des pastilles d'agent se posent autour du
   praticien au temps de la vidéo, se cochent et s'effacent. Sous « mouvements réduits » : l'affiche seule
   et une pastille cochée, immobile. Le CSS est dans hero.css. */
import { useEffect, useRef, type CSSProperties } from "react";
import { usePostHog } from "posthog-js/react";
import { calcomDemoUrl, useLanguage } from "./socle";
import "./hero.css";

/* ---------- le film : 16:9 sur ordinateur, 9:16 pour les écrans de 860 px et moins (choisi au montage) ---------- */
const FILM = {
  src: "/home/hero-16x9.mp4",
  poster: "/home/hero-affiche.webp",
  srcM: "/home/hero-9x16.mp4",
  posterM: "/home/hero-affiche-9x16.webp",
};
const MOBILE = "(max-width: 860px)";

/* ---------- les repères des pastilles d'agent ----------
   t en secondes dans le film ; x, y de 0 à 1 dans l'image 16:9, hors visages et mains ; side "l" : la pastille
   s'étend à gauche du point. d, run : durée de la pastille et moment de la coche. m: false : pas montrée sur mobile,
   où les pastilles se posent l'une après l'autre sous le texte. k : l'étape du métier montrée (sur 3).
   Les textes de chaque repère sont dans copy[lang].cues, dans le même ordre. */
type Cue = {
  t: number;
  x: number;
  y: number;
  k: number;
  d?: number;
  run?: number;
  side?: "l" | "r";
  m?: false;
};
const CUES: Cue[] = [
  /* 0 à 4 s : la radiothérapie, entre les deux visages puis au pied de la table */
  { t: 0.25, x: 0.58, y: 0.17, k: 0 },
  { t: 1.25, d: 2.5, run: 1, x: 0.97, y: 0.93, side: "l", m: false, k: 1 },
  /* 4 à 8 s : la biologiste */
  { t: 4.25, x: 0.97, y: 0.16, side: "l", k: 0 },
  { t: 5.25, d: 2.5, run: 1, x: 0.97, y: 0.64, side: "l", m: false, k: 1 },
  /* 8 à 12 s : l'équipe soignante dans le couloir (la caméra bouge : pastilles au plafond et au sol) */
  { t: 8.25, x: 0.97, y: 0.14, side: "l", k: 0 },
  { t: 9.25, d: 2.5, run: 1, x: 0.97, y: 0.9, side: "l", m: false, k: 2 },
];
const STEPS = 3;
const AG = { d: 3.5, run: 1.3, out: 0.45, dock: 56 };

/* r : la tâche en cours (avant la coche), t : la tâche faite, u : où, et sur quoi */
type Task = { r: string; t: string; u: string };

const copy = {
  fr: {
    bar: "Granit lève 5\u00a0M€ pour rendre du temps au soin",
    barMore: "Lire l’annonce",
    title: ["Vos équipes soignent.", "Granit gère le reste."],
    lead: "Droits, prises en charge, facturation, encaissement : nos agents IA font tourner votre tiers payant de bout en bout, dans vos logiciels actuels.",
    cta: "Demander une démo",
    ctaSecond: "On me rappelle",
    trustLabel: "Garanties",
    trust: {
      hds: ["Infrastructure", "certifiée HDS"],
      ue: ["Données", "dans l’UE"],
      badge: "RGPD",
      rgpd: ["Conforme", "RGPD"],
    },
    cues: [
      {
        r: "Vérification de l’ALD…",
        t: "Prise en charge à 100 % confirmée",
        u: "AmeliPro · ALD en cours de validité",
      },
      {
        r: "Télétransmission de la séance…",
        t: "Séance facturée",
        u: "Feuille de soins · séance 12 sur 25",
      },
      {
        r: "Vérification des droits…",
        t: "Droits vérifiés · 24 sur 24",
        u: "AmeliPro · patients du jour",
      },
      {
        r: "Télétransmission du lot…",
        t: "Feuilles de soins télétransmises",
        u: "Lot du 22 oct. · AmeliPro",
      },
      {
        r: "Vérification des droits du jour…",
        t: "Droits de la matinée vérifiés",
        u: "Agenda du jour · Assurance Maladie et mutuelle",
      },
      { r: "Pointage des virements…", t: "Virements pointés", u: "18 virements · relevé du jour" },
    ] as Task[],
  },
  en: {
    bar: "Granit raises $6M to give time back to care",
    barMore: "Read the announcement",
    title: ["Your teams care.", "Granit handles the rest."],
    lead: "Eligibility, pre-approvals, claims, payments: our AI agents run your entire billing cycle inside the software you already use.",
    cta: "Book a demo",
    ctaSecond: "Call me back",
    trustLabel: "Guarantees",
    trust: {
      hds: ["HDS-certified", "infrastructure"],
      ue: ["EU", "data"],
      badge: "GDPR",
      rgpd: ["GDPR", "compliant"],
    },
    cues: [
      {
        r: "Checking long-term condition status…",
        t: "Full coverage confirmed",
        u: "AmeliPro · long-term condition still valid",
      },
      {
        r: "Submitting the session claim…",
        t: "Session billed",
        u: "Claim form · session 12 of 25",
      },
      {
        r: "Checking eligibility…",
        t: "Eligibility verified · 24 of 24",
        u: "AmeliPro · today’s patients",
      },
      { r: "Submitting the batch…", t: "Claims submitted", u: "Batch of Oct 22 · AmeliPro" },
      {
        r: "Checking today’s eligibility…",
        t: "Morning patients verified",
        u: "Today’s schedule · public and private insurers",
      },
      {
        r: "Reconciling payments…",
        t: "Payments reconciled",
        u: "18 transfers · today’s statement",
      },
    ] as Task[],
  },
};

/* ---------- icônes ---------- */
function Check() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <path
        d="M3.4 8.5l2.9 2.9 6.3-6.6"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function Arrow() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <path
        d="M2.8 8h10M9 4l4 4-4 4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function Shield() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 2.8l7.2 2.7v5.6c0 4.6-3 8.2-7.2 10.1-4.2-1.9-7.2-5.5-7.2-10.1V5.5z" />
      <path d="M8.8 12.2l2.2 2.2 4.2-4.4" />
    </svg>
  );
}
/* les douze étoiles de l'UE (arrondies au centième : même balisage au serveur et au client) */
const STARS = Array.from({ length: 12 }, (_, i) => {
  const a = (i / 12) * Math.PI * 2;
  return { cx: (12 + 9 * Math.cos(a)).toFixed(2), cy: (12 + 9 * Math.sin(a)).toFixed(2) };
});
function Stars() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
      {STARS.map((s, i) => (
        <circle key={i} cx={s.cx} cy={s.cy} r="1.25" />
      ))}
    </svg>
  );
}
function TwoLines({ l }: { l: string[] }) {
  return (
    <span>
      {l[0]}
      <br />
      {l[1]}
    </span>
  );
}

/* ---------- bandeau de la levée ---------- */
export function BandeauLevee() {
  const { lang } = useLanguage();
  const c = copy[lang];
  return (
    <div className="tv-bar">
      <a href="/levee-de-fonds">
        <span>{c.bar}</span>
        <b className="tv-bar-more">
          {c.barMore}
          <Arrow />
        </b>
      </a>
    </div>
  );
}

/* ---------- titre lettre à lettre : le texte entier est lu une fois par les lecteurs d'écran ---------- */
function Letters({ lines }: { lines: string[] }) {
  let k = 0;
  return (
    <>
      <span className="tv-sr">{lines.join(" ")}</span>
      {lines.map((line, li) => (
        <span key={li}>
          {li > 0 && " "}
          <span className={li === 1 ? "tv-l tv-accent" : "tv-l"} aria-hidden="true">
            {line.split(/\s+/).map((w, wi) => (
              <span key={wi}>
                {wi > 0 && " "}
                <span className="tv-w">
                  {Array.from(w).map((ch, ci) => (
                    <span key={ci} className="tv-c" style={{ "--k": k++ } as CSSProperties}>
                      {ch}
                    </span>
                  ))}
                </span>
              </span>
            ))}
          </span>
        </span>
      ))}
    </>
  );
}

/* ---------- pastilles d'agent : géométrie et horloge (port de TV.agents) ---------- */
type Box = { L: number; T: number; w: number; h: number };
type Pill = { el: HTMLElement; cue: Cue; st: number; box: Box | null; off: boolean };
type Geo = {
  mob: boolean;
  H: number;
  rw: number;
  rh: number;
  ox: number;
  oy: number;
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
};

function startAgents(
  layer: HTMLElement,
  v: HTMLVideoElement,
  stage: HTMLElement,
  avoid: HTMLElement,
  rm: boolean,
) {
  const mq = window.matchMedia(MOBILE);
  const pills: Pill[] = Array.from(layer.children, (el, i) => ({
    el: el as HTMLElement,
    cue: CUES[i],
    st: 0,
    box: null,
    off: false,
  }));
  if (!pills.length) return () => {};
  const px = (el: Element, prop: "paddingLeft" | "paddingRight") =>
    parseFloat(getComputedStyle(el)[prop]) || 0;

  /* le cadre de la vidéo dans la scène (object-fit: cover), et la zone libre pour les pastilles :
     sous le haut du hero, à droite du bloc texte (sur mobile : au-dessus du bas de la scène) */
  function geo(): Geo {
    const W = stage.clientWidth,
      H = stage.clientHeight,
      vw = v.videoWidth || 1600,
      vh = v.videoHeight || 900;
    const s = Math.max(W / vw, H / vh),
      rw = vw * s,
      rh = vh * s;
    const op = getComputedStyle(v)
      .objectPosition.split(" ")
      .map((a) => parseFloat(a) / 100);
    const sr = stage.getBoundingClientRect(),
      mob = mq.matches;
    const g: Geo = {
      mob,
      H,
      rw,
      rh,
      ox: (W - rw) * (isNaN(op[0]) ? 0.5 : op[0]),
      oy: (H - rh) * (isNaN(op[1]) ? 0.5 : op[1]),
      minX: px(avoid, "paddingLeft"),
      maxX: W - px(avoid, "paddingRight"),
      minY: 20,
      maxY: H - 24,
    };
    let r: { l: number; t: number; r: number; b: number } | null = null;
    for (const c of Array.from(avoid.children)) {
      const b = c.getBoundingClientRect();
      if (!b.width) continue;
      r = r
        ? {
            l: Math.min(r.l, b.left),
            t: Math.min(r.t, b.top),
            r: Math.max(r.r, b.right),
            b: Math.max(r.b, b.bottom),
          }
        : { l: b.left, t: b.top, r: b.right, b: b.bottom };
    }
    if (r) {
      if (mob) g.maxY = r.t - sr.top - 16;
      else g.minX = Math.max(g.minX, r.r - sr.left + 40);
    }
    return g;
  }
  function place(p: Pill, g: Geo) {
    p.box = null;
    p.off = g.mob && p.cue.m === false;
    if (p.off) return;
    const el = p.el,
      w = el.offsetWidth,
      h = el.offsetHeight;
    let L: number,
      T: number,
      maxY = g.maxY;
    if (g.mob) {
      /* sous le texte, à gauche */
      L = g.minX;
      T = g.H - AG.dock - h;
      maxY = g.H;
    } else {
      const x = g.ox + p.cue.x * g.rw,
        y = g.oy + p.cue.y * g.rh;
      L = (p.cue.side || "r") === "l" ? x - w : x;
      T = y - h / 2;
      L = Math.min(Math.max(L, g.minX), g.maxX - w);
      T = Math.min(Math.max(T, g.minY), g.maxY - h);
    }
    /* pas de chevauchement avec une pastille déjà posée : on glisse dessous */
    for (const q of pills) {
      if (q === p || !q.st || !q.box) continue;
      const b = q.box;
      if (L < b.L + b.w && L + w > b.L && T < b.T + b.h && T + h > b.T) T = b.T + b.h + 10;
    }
    p.off = g.maxX - w < g.minX - 1 || T + h > maxY + 1;
    if (!p.off) p.box = { L, T, w, h };
    el.style.transform = `translate(${L.toFixed(1)}px,${T.toFixed(1)}px)`;
  }
  function set(p: Pill, st: number) {
    p.st = st;
    p.el.classList.toggle("is-on", !p.off && (st === 1 || st === 2));
    p.el.classList.toggle("is-done", st >= 2);
    p.el.classList.toggle("is-out", st === 3);
    if (!st) p.box = null;
  }

  /* « mouvements réduits » : une seule pastille, cochée, immobile */
  if (rm) {
    const p0 = pills[0];
    p0.el.classList.add("is-still");
    const still = () => {
      place(p0, geo());
      set(p0, 2);
    };
    still();
    window.addEventListener("resize", still);
    v.addEventListener("loadedmetadata", still);
    return () => {
      window.removeEventListener("resize", still);
      v.removeEventListener("loadedmetadata", still);
    };
  }

  let visible = true,
    raf = 0,
    clock = 0,
    last = 0,
    prev = 0,
    looped = false;
  function frame(now: number) {
    raf = 0;
    if (!visible || document.hidden) return;
    const dur = v.duration || 0,
      dt = last ? (now - last) / 1000 : 0;
    let g: Geo | null = null;
    last = now;
    /* lecture bloquée (économie d'énergie) : une horloge prend le relais sur l'affiche */
    if (!v.paused && v.readyState >= 2) clock = v.currentTime;
    else clock = dur ? (clock + dt) % dur : clock + dt;
    const t = clock;
    /* une pastille posée juste avant la fin du film déborde sur le tour suivant, mais pas au tout premier tour */
    if (t < prev - 0.5) looped = true;
    prev = t;
    for (const p of pills) {
      let lt = t - p.cue.t;
      if (lt < 0 && dur && looped) lt += dur;
      const d = p.cue.d || AG.d;
      const st = lt < 0 || lt > d ? 0 : lt < (p.cue.run || AG.run) ? 1 : lt < d - AG.out ? 2 : 3;
      if (st === p.st) continue;
      if (!p.st) {
        if (st === 3) continue;
        place(p, g || (g = geo()));
      }
      set(p, st);
    }
    raf = requestAnimationFrame(frame);
  }
  const go = () => {
    if (!raf && visible && !document.hidden) {
      last = 0;
      raf = requestAnimationFrame(frame);
    }
  };
  const io =
    "IntersectionObserver" in window
      ? new IntersectionObserver(
          (es) => {
            visible = es[0].isIntersecting;
            go();
          },
          { threshold: 0.05 },
        )
      : null;
  io?.observe(stage);
  const onResize = () => {
    let g: Geo | null = null;
    for (const p of pills)
      if (p.st) {
        place(p, g || (g = geo()));
        set(p, p.st);
      }
  };
  document.addEventListener("visibilitychange", go);
  window.addEventListener("resize", onResize);
  go();
  return () => {
    if (raf) cancelAnimationFrame(raf);
    io?.disconnect();
    document.removeEventListener("visibilitychange", go);
    window.removeEventListener("resize", onResize);
  };
}

/* ---------- le hero ---------- */
export function HeroNouvelle() {
  const { lang } = useLanguage();
  const c = copy[lang];
  const posthog = usePostHog();
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const agentsRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current,
      stage = stageRef.current,
      v = videoRef.current,
      layer = agentsRef.current,
      body = bodyRef.current;
    if (!section || !stage || !v || !layer || !body) return;
    const rm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mob = window.matchMedia(MOBILE).matches;

    /* les entrées (lettres, chapô, boutons) ne partent que si l'hydratation est rapide : sinon le texte,
       déjà lu, disparaîtrait pour rentrer */
    if (!rm && performance.now() < 4000) section.classList.add("tva-anim");

    /* le lecteur : la version 9:16 se choisit ici ; « mouvements réduits » laisse l'affiche seule */
    if (mob) v.poster = FILM.posterM;
    let visible = true;
    const play = () => {
      if (rm || !visible || document.hidden) return;
      v.play()?.catch(() => {});
    };
    const cleanups: (() => void)[] = [];
    if (!rm) {
      v.muted = true;
      v.defaultMuted = true;
      v.preload = "auto";
      v.src = mob ? FILM.srcM : FILM.src;
      play();
      /* lecture automatique refusée (économie d'énergie) : on relance au premier geste */
      const kick = () => {
        if (v.paused) play();
      };
      for (const ev of ["pointerdown", "keydown", "touchstart"] as const) {
        window.addEventListener(ev, kick, { once: true, passive: true });
        cleanups.push(() => window.removeEventListener(ev, kick));
      }
      /* en pause hors écran et quand l'onglet est caché */
      if ("IntersectionObserver" in window) {
        const io = new IntersectionObserver(
          (es) => {
            visible = es[0].isIntersecting;
            if (visible) play();
            else v.pause();
          },
          { threshold: 0.05 },
        );
        io.observe(stage);
        cleanups.push(() => io.disconnect());
      }
      const onVis = () => {
        if (document.hidden) v.pause();
        else play();
      };
      document.addEventListener("visibilitychange", onVis);
      cleanups.push(() => document.removeEventListener("visibilitychange", onVis));
    }
    cleanups.push(startAgents(layer, v, stage, body, rm));

    return () => {
      cleanups.forEach((f) => f());
      section.classList.remove("tva-anim");
      v.pause();
    };
  }, []);

  const i = (n: number) => ({ "--i": n }) as CSSProperties;

  return (
    <section className="tva" id="top" aria-labelledby="tva-t" ref={sectionRef}>
      <div className="tva-stage" ref={stageRef}>
        <div className="tva-media" aria-hidden="true">
          {/* pas de src au rendu serveur : le film (16:9 ou 9:16) est choisi au montage */}
          <video
            ref={videoRef}
            poster={FILM.poster}
            muted
            loop
            playsInline
            preload="none"
            aria-hidden="true"
          />
        </div>
        <div className="tva-veil" />
        <div className="tva-agents" ref={agentsRef} aria-hidden="true">
          {CUES.map((cue, ci) => {
            const task = c.cues[ci];
            return (
              <div className="tva-ag" key={ci}>
                <span className="tva-ag-ok">
                  <Check />
                </span>
                <span className="tva-ag-txt">
                  <span className="tva-ag-t">
                    <b className="r">{task.r}</b>
                    <b className="d">{task.t}</b>
                  </span>
                  <span className="tva-ag-u">{task.u}</span>
                </span>
                <span className="tva-steps">
                  {Array.from({ length: STEPS }, (_, s) => (
                    <i key={s} className={s < cue.k ? "on" : s === cue.k ? "cur" : undefined} />
                  ))}
                </span>
              </div>
            );
          })}
        </div>
        <div className="lm-wrap tva-body" ref={bodyRef}>
          <h1 className="tv-h1" id="tva-t">
            <Letters lines={c.title} />
          </h1>
          <p className="tv-lead tva-lead tv-in" style={i(0)}>
            {c.lead}
          </p>
          <div className="tv-ctas tv-in" style={i(1)}>
            <a
              className="tv-btn tv-btn-light"
              href={calcomDemoUrl("hero")}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => posthog.capture("demo_booking_clicked", { placement: "hero" })}
            >
              {c.cta}
            </a>
            <a
              className="tv-btn tv-btn-line"
              href="#rappel"
              onClick={() => posthog.capture("demo_callback_clicked", { placement: "hero" })}
            >
              {c.ctaSecond}
            </a>
          </div>
          <ul className="tv-trust tv-in" style={i(2)} aria-label={c.trustLabel}>
            <li>
              <Shield />
              <TwoLines l={c.trust.hds} />
            </li>
            <li>
              <Stars />
              <TwoLines l={c.trust.ue} />
            </li>
            <li>
              <b className="tv-rgpd">{c.trust.badge}</b>
              <TwoLines l={c.trust.rgpd} />
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
