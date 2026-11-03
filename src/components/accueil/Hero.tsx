/* Accueil : le hero vidéo plein cadre. Le film (trois plans de 4 s : radiothérapie, biologiste, équipe soignante)
   tourne en boucle, muet ; autour des praticiens, des pastilles d'agent se posent au temps de la vidéo,
   se cochent et s'effacent : on voit le soin, Granit fait l'administratif en fond.
   Sur mobile (860 px et moins) : la version 9:16, les pastilles une à une sous le texte.
   « Mouvements réduits » : la vidéo reste sur son affiche, une seule pastille cochée, immobile. */
import { useEffect, useRef, useState } from "react";
import { usePostHog } from "posthog-js/react";
import { useLanguage } from "@/lib/i18n";
import { IconShieldSmall, IconStars, calUrl, useReducedMotion } from "./commun";

type Tache = { r: string; t: string; u: string; k: number };
/* t en secondes dans le film ; x, y de 0 à 1 dans l'image 16:9, hors visages et mains ; side « l » : la pastille
   s'étend à gauche du point ; d, run : durée et moment de la coche ; m: false : pas montrée sur mobile */
type Repere = { t: number; x: number; y: number; side?: "l"; d?: number; run?: number; m?: false };
const REPERES: Repere[] = [
  { t: 0.25, x: 0.58, y: 0.17 },
  { t: 1.25, d: 2.5, run: 1, x: 0.97, y: 0.93, side: "l", m: false },
  { t: 4.25, x: 0.97, y: 0.16, side: "l" },
  { t: 5.25, d: 2.5, run: 1, x: 0.97, y: 0.64, side: "l", m: false },
  { t: 8.25, x: 0.97, y: 0.14, side: "l" },
  { t: 9.25, d: 2.5, run: 1, x: 0.97, y: 0.9, side: "l", m: false },
];

const copy = {
  fr: {
    l1: "Vos équipes soignent.",
    l2: "Nos agents encaissent.",
    lead: "Droits, prises en charge, facturation, encaissement : nos agents IA font tourner votre tiers payant de bout en bout, dans vos logiciels actuels.",
    cta: "Voir Granit sur mes dossiers",
    metiers: "Trouver mon métier",
    trustLabel: "Garanties",
    hds: ["Infrastructure", "HDS"],
    ue: ["Données", "dans l’UE"],
    rgpd: "RGPD",
    rgpdTxt: ["Conforme", "RGPD"],
    /* les six pastilles, dans l'ordre des repères (k : l'étape du métier, sur trois) */
    taches: [
      {
        r: "Vérification de l’ALD…",
        t: "Prise en charge à 100 % confirmée",
        u: "AmeliPro · ALD en cours de validité",
        k: 0,
      },
      {
        r: "Télétransmission de la séance…",
        t: "Séance facturée",
        u: "Feuille de soins · séance 12 sur 25",
        k: 1,
      },
      {
        r: "Vérification des droits…",
        t: "Droits vérifiés · 24 sur 24",
        u: "AmeliPro · patients du jour",
        k: 0,
      },
      {
        r: "Télétransmission du lot…",
        t: "Feuilles de soins télétransmises",
        u: "Lot du 22 oct. · AmeliPro",
        k: 1,
      },
      {
        r: "Vérification des droits du jour…",
        t: "Droits de la matinée vérifiés",
        u: "Agenda du jour · Assurance Maladie et mutuelle",
        k: 0,
      },
      {
        r: "Pointage des virements…",
        t: "Virements pointés",
        u: "18 virements · relevé du jour",
        k: 2,
      },
    ] as Tache[],
  },
  en: {
    l1: "Your teams care for patients.",
    l2: "Our agents get you paid.",
    lead: "Eligibility, coverage approvals, billing, collection: our AI agents run your third-party payment (tiers payant) end to end, inside the software you already use.",
    cta: "See Granit on my own claims",
    metiers: "Find my profession",
    trustLabel: "Commitments",
    hds: ["HDS", "infrastructure"],
    ue: ["Data stays", "in the EU"],
    rgpd: "GDPR",
    rgpdTxt: ["GDPR", "compliant"],
    taches: [
      {
        r: "Checking ALD status…",
        t: "100% coverage confirmed",
        u: "AmeliPro · long-term condition (ALD) still valid",
        k: 0,
      },
      {
        r: "E-transmitting the session…",
        t: "Session billed",
        u: "Claim form · session 12 of 25",
        k: 1,
      },
      {
        r: "Checking eligibility…",
        t: "Eligibility verified · 24 of 24",
        u: "AmeliPro · today’s patients",
        k: 0,
      },
      {
        r: "E-transmitting the batch…",
        t: "Claim forms e-transmitted",
        u: "Batch of Oct 22 · AmeliPro",
        k: 1,
      },
      {
        r: "Checking today’s eligibility…",
        t: "Morning eligibility verified",
        u: "Today’s schedule · national health insurance and mutuelle",
        k: 0,
      },
      {
        r: "Reconciling transfers…",
        t: "Transfers reconciled",
        u: "18 transfers · today’s statement",
        k: 2,
      },
    ] as Tache[],
  },
};

const FILM = {
  src: "/accueil/hero-16x9.mp4",
  poster: "/accueil/hero-affiche.webp",
  srcM: "/accueil/hero-9x16.mp4",
  posterM: "/accueil/hero-affiche-9x16.webp",
};
const AG = { d: 3.5, run: 1.3, out: 0.45, dock: 56 };
const CHECK_SVG =
  '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3.4 8.5l2.9 2.9 6.3-6.6" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>';

/* Les pastilles : posées à la main dans le calque (React n'y rend rien), au point du repère suivi à travers
   le recadrage de la vidéo (object-fit: cover), sans mordre sur le texte ni passer sous la navigation. */
function lancerPastilles(
  layer: HTMLDivElement,
  stage: HTMLElement,
  video: HTMLVideoElement,
  avoid: HTMLElement,
  taches: Tache[],
  still: boolean,
) {
  const mq = window.matchMedia("(max-width: 860px)");
  type P = {
    el: HTMLDivElement;
    cue: Repere;
    task: Tache;
    st: number;
    off?: boolean;
    box?: { L: number; T: number; w: number; h: number } | null;
  };
  const pills: P[] = REPERES.map((cue, i) => {
    const el = document.createElement("div");
    el.className = "acc-ag";
    el.innerHTML =
      '<span class="acc-ag-ok">' +
      CHECK_SVG +
      '</span><span class="acc-ag-txt"><span class="acc-ag-t"><b class="r"></b><b class="d"></b></span><span class="acc-ag-u"></span></span><span class="acc-steps"><i></i><i></i><i></i></span>';
    const task = taches[i];
    (el.querySelector(".r") as HTMLElement).textContent = task.r;
    (el.querySelector(".d") as HTMLElement).textContent = task.t;
    (el.querySelector(".acc-ag-u") as HTMLElement).textContent = task.u;
    el.querySelectorAll(".acc-steps i").forEach(
      (s, j) => (s.className = j < task.k ? "on" : j === task.k ? "cur" : ""),
    );
    layer.appendChild(el);
    return { el, cue, task, st: 0 };
  });
  const px = (el: Element, prop: "paddingLeft" | "paddingRight") =>
    parseFloat(getComputedStyle(el)[prop]) || 0;

  function geo() {
    const W = stage.clientWidth;
    const H = stage.clientHeight;
    const vw = video.videoWidth || 1600;
    const vh = video.videoHeight || 900;
    const s = Math.max(W / vw, H / vh);
    const rw = vw * s;
    const rh = vh * s;
    const op = getComputedStyle(video)
      .objectPosition.split(" ")
      .map((a) => parseFloat(a) / 100);
    const sr = stage.getBoundingClientRect();
    const nav = document.querySelector(".acc-nav");
    const mob = mq.matches;
    const g = {
      mob,
      H,
      rw,
      rh,
      ox: (W - rw) * (isNaN(op[0]) ? 0.5 : op[0]),
      oy: (H - rh) * (isNaN(op[1]) ? 0.5 : op[1]),
      minX: px(avoid, "paddingLeft"),
      maxX: W - px(avoid, "paddingRight"),
      minY: (nav ? nav.getBoundingClientRect().bottom - (sr.top + window.scrollY) : 100) + 14,
      maxY: H - 24,
    };
    let r: { l: number; t: number; r: number; b: number } | null = null;
    Array.from(avoid.children).forEach((c) => {
      const b = c.getBoundingClientRect();
      if (!b.width) return;
      r = r
        ? {
            l: Math.min(r.l, b.left),
            t: Math.min(r.t, b.top),
            r: Math.max(r.r, b.right),
            b: Math.max(r.b, b.bottom),
          }
        : { l: b.left, t: b.top, r: b.right, b: b.bottom };
    });
    if (r) {
      const rr = r as { l: number; t: number; r: number; b: number };
      if (mob) g.maxY = rr.t - sr.top - 16;
      else g.minX = Math.max(g.minX, rr.r - sr.left + 40);
    }
    return g;
  }
  type G = ReturnType<typeof geo>;
  function place(p: P, g: G) {
    p.box = null;
    p.off = g.mob && p.cue.m === false;
    if (p.off) return;
    const w = p.el.offsetWidth;
    const h = p.el.offsetHeight;
    let L: number;
    let T: number;
    let maxX = g.maxX;
    let maxY = g.maxY;
    const minX = g.minX;
    if (g.mob) {
      L = g.minX;
      T = g.H - AG.dock - h;
      maxY = g.H;
    } else {
      const x = g.ox + p.cue.x * g.rw;
      const y = g.oy + p.cue.y * g.rh;
      L = (p.cue.side ?? "r") === "l" ? x - w : x;
      T = y - h / 2;
      L = Math.min(Math.max(L, g.minX), g.maxX - w);
      T = Math.min(Math.max(T, g.minY), g.maxY - h);
    }
    pills.forEach((q) => {
      if (q === p || !q.st || !q.box) return;
      const b = q.box;
      if (L < b.L + b.w && L + w > b.L && T < b.T + b.h && T + h > b.T) T = b.T + b.h + 10;
    });
    maxX = Math.max(maxX, minX);
    p.off = maxX - w < minX - 1 || T + h > maxY + 1;
    if (!p.off) p.box = { L, T, w, h };
    p.el.style.transform = `translate(${L.toFixed(1)}px,${T.toFixed(1)}px)`;
  }
  function set(p: P, st: number) {
    p.st = st;
    p.el.classList.toggle("is-on", !p.off && (st === 1 || st === 2));
    p.el.classList.toggle("is-done", st >= 2);
    p.el.classList.toggle("is-out", st === 3);
    if (!st) p.box = null;
  }

  if (still) {
    const p0 = pills[0];
    p0.el.classList.add("is-still");
    const poser = () => {
      place(p0, geo());
      set(p0, 2);
    };
    poser();
    window.addEventListener("resize", poser);
    video.addEventListener("loadedmetadata", poser);
    return () => {
      window.removeEventListener("resize", poser);
      video.removeEventListener("loadedmetadata", poser);
      layer.innerHTML = "";
    };
  }

  let visible = true;
  let raf = 0;
  let clock = 0;
  let last = 0;
  let prev = 0;
  let looped = false;
  function frame(now: number) {
    raf = 0;
    if (!visible || document.hidden) return;
    const dur = video.duration || 0;
    const dt = last ? (now - last) / 1000 : 0;
    last = now;
    let t: number;
    /* lecture bloquée (économie d'énergie) : une horloge prend le relais sur l'affiche */
    if (!video.paused && video.readyState >= 2) t = clock = video.currentTime;
    else t = clock = dur ? (clock + dt) % dur : clock + dt;
    if (t < prev - 0.5) looped = true;
    prev = t;
    let g: G | null = null;
    pills.forEach((p) => {
      let lt = t - p.cue.t;
      if (lt < 0 && dur && looped) lt += dur;
      const d = p.cue.d ?? AG.d;
      const st = lt < 0 || lt > d ? 0 : lt < (p.cue.run ?? AG.run) ? 1 : lt < d - AG.out ? 2 : 3;
      if (st === p.st) return;
      if (!p.st) {
        if (st === 3) return;
        g = g ?? geo();
        place(p, g);
      }
      set(p, st);
    });
    raf = requestAnimationFrame(frame);
  }
  function go() {
    if (!raf && visible && !document.hidden) {
      last = 0;
      raf = requestAnimationFrame(frame);
    }
  }
  const io = new IntersectionObserver(
    (es) => {
      visible = es[0].isIntersecting;
      go();
    },
    { threshold: 0.05 },
  );
  io.observe(stage);
  const onResize = () => {
    let g: G | null = null;
    pills.forEach((p) => {
      if (p.st) {
        g = g ?? geo();
        place(p, g);
        set(p, p.st);
      }
    });
  };
  document.addEventListener("visibilitychange", go);
  window.addEventListener("resize", onResize);
  go();
  return () => {
    io.disconnect();
    cancelAnimationFrame(raf);
    document.removeEventListener("visibilitychange", go);
    window.removeEventListener("resize", onResize);
    layer.innerHTML = "";
  };
}

export function Hero() {
  const { lang } = useLanguage();
  const posthog = usePostHog();
  const t = copy[lang];
  const rm = useReducedMotion();
  const stageRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const layerRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  /* la version 9:16 se choisit au montage (le serveur ne connaît pas l'écran) */
  const [mob, setMob] = useState<boolean | null>(null);

  useEffect(() => {
    setMob(window.matchMedia("(max-width: 860px)").matches);
  }, []);

  /* lecture : en pause hors écran ; « mouvements réduits » laisse l'affiche */
  useEffect(() => {
    const v = videoRef.current;
    const stage = stageRef.current;
    if (!v || !stage || mob === null) return;
    const play = () => {
      v.play()?.catch(() => {});
    };
    if (rm) {
      v.pause();
      return;
    }
    play();
    const io = new IntersectionObserver(
      (es) => {
        if (es[0].isIntersecting) play();
        else v.pause();
      },
      { threshold: 0.05 },
    );
    io.observe(stage);
    /* lecture refusée sans geste (économie d'énergie) : on relance au premier geste */
    const nudge = () => {
      if (v.paused) play();
    };
    window.addEventListener("pointerdown", nudge, { once: true, passive: true });
    window.addEventListener("keydown", nudge, { once: true });
    window.addEventListener("touchstart", nudge, { once: true, passive: true });
    return () => {
      io.disconnect();
      window.removeEventListener("pointerdown", nudge);
      window.removeEventListener("keydown", nudge);
      window.removeEventListener("touchstart", nudge);
    };
  }, [mob, rm]);

  /* les pastilles : refaites à chaque changement de langue */
  useEffect(() => {
    const layer = layerRef.current;
    const stage = stageRef.current;
    const v = videoRef.current;
    const body = bodyRef.current;
    if (!layer || !stage || !v || !body || mob === null) return;
    return lancerPastilles(layer, stage, v, body, copy[lang].taches, rm);
  }, [lang, mob, rm]);

  let k = 0;
  const lettres = (s: string) =>
    s.split(" ").map((w, i, all) => (
      <span key={i}>
        <span className="acc-w">
          {Array.from(w).map((ch, j) => (
            <span key={j} className="acc-c" style={{ ["--k" as string]: k++ }}>
              {ch}
            </span>
          ))}
        </span>
        {i < all.length - 1 ? " " : null}
      </span>
    ));

  return (
    <section className="acc-hero" id="top" aria-labelledby="acc-hero-t">
      <div className="acc-stage" ref={stageRef}>
        <div className="acc-media" aria-hidden="true">
          {mob !== null && (
            <video
              ref={videoRef}
              key={mob ? "m" : "d"}
              src={mob ? FILM.srcM : FILM.src}
              poster={mob ? FILM.posterM : FILM.poster}
              muted
              loop
              playsInline
              preload="auto"
              aria-hidden="true"
            />
          )}
        </div>
        <div className="acc-veil" />
        <div className="acc-agents" ref={layerRef} aria-hidden="true" />
        <div className="acc-wrap acc-hero-body" ref={bodyRef}>
          {/* key : les lettres rejouent leur entrée quand la langue change */}
          <h1 className="acc-h1" id="acc-hero-t" key={lang}>
            <span className="acc-sr">
              {t.l1} {t.l2}
            </span>
            <span className="acc-hl" aria-hidden="true">
              {lettres(t.l1)}
            </span>{" "}
            <span className="acc-hl acc-accent" aria-hidden="true">
              {lettres(t.l2)}
            </span>
          </h1>
          <p className="acc-hero-lead acc-in" style={{ ["--i" as string]: 0 }}>
            {t.lead}
          </p>
          <div className="acc-ctas acc-in" style={{ ["--i" as string]: 1 }}>
            <a
              className="acc-btn acc-btn-light"
              href={calUrl("hero")}
              target="_blank"
              rel="noopener"
              onClick={() => posthog?.capture("demo_booking_clicked", { placement: "hero" })}
            >
              {t.cta}
            </a>
            <a className="acc-btn acc-btn-line" href="#metiers">
              {t.metiers}
            </a>
          </div>
          <ul
            className="acc-trust acc-in"
            style={{ ["--i" as string]: 2 }}
            aria-label={t.trustLabel}
          >
            <li>
              <IconShieldSmall />
              <span>
                {t.hds[0]}
                <br />
                {t.hds[1]}
              </span>
            </li>
            <li>
              <IconStars />
              <span>
                {t.ue[0]}
                <br />
                {t.ue[1]}
              </span>
            </li>
            <li>
              <b className="acc-rgpd">{t.rgpd}</b>
              <span>
                {t.rgpdTxt[0]}
                <br />
                {t.rgpdTxt[1]}
              </span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
