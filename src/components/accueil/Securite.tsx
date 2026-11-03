/* Accueil : la sécurité. Un globe centré sur l'Europe (canvas) qui se balance doucement de part et d'autre
   de l'Union européenne, l'arc « Hébergé en Europe. », puis trois engagements.
   « Mouvements réduits » : le globe est posé, immobile. */
import { useEffect, useRef } from "react";
import { useLanguage } from "@/lib/i18n";
import { GEO } from "./globe-geo";
import { IconCloud, IconEu, IconShield, useReducedMotion, useSeenOnce } from "./commun";

const copy = {
  fr: {
    eb: "Sécurité et confiance",
    h: "Vos données de santé restent en Europe",
    lead: "Granit s’appuie sur un hébergement HDS, garde vos données dans l’Union européenne et trace chaque action de ses agents.",
    globe: "Globe centré sur l’Europe, les 27 pays de l’Union européenne en surbrillance",
    arc: "Hébergé en Europe.",
    tipT: "Union européenne",
    tip: "Données, sauvegardes et journaux techniques.",
    cols: [
      [
        "Hébergement HDS",
        "Vos données sont hébergées chez un hébergeur de données de santé (HDS), comme l’exige la loi française.",
      ],
      [
        "Données dans l’UE, RGPD",
        "Les données de vos patients sont hébergées dans l’Union européenne et traitées selon le RGPD.",
      ],
      [
        "Chaque action tracée",
        "Chaque dossier est tracé : ce qui a été fait, quand, et pourquoi un dossier attend.",
      ],
    ],
  },
  en: {
    eb: "Security and trust",
    h: "Your health data stays in Europe",
    lead: "Granit relies on HDS hosting, keeps your data in the European Union and logs every action its agents take.",
    globe: "Globe centered on Europe, with the 27 European Union countries highlighted",
    arc: "Hosted in Europe.",
    tipT: "European Union",
    tip: "Data, backups and technical logs.",
    cols: [
      [
        "HDS hosting",
        "Your data is stored with a health data hosting (HDS) provider, as French law requires.",
      ],
      [
        "Data in the EU, GDPR",
        "Your patients’ data is hosted in the European Union and processed in line with the GDPR.",
      ],
      [
        "Every action logged",
        "Every file is logged: what was done, when, and why a file is on hold.",
      ],
    ],
  },
};

/* le globe : cadre de 760 × 760, centre (380, 400), rayon 300 */
const GLOBE = { S: 760, CX: 380, CY: 400, R: 300 };
const RT = GLOBE.R + 30;
const arcPt = (deg: number) => {
  const a = (deg * Math.PI) / 180;
  return `${(GLOBE.CX + RT * Math.cos(a)).toFixed(1)} ${(GLOBE.CY + RT * Math.sin(a)).toFixed(1)}`;
};
const ARC = `M ${arcPt(202)} A ${RT} ${RT} 0 0 1 ${arcPt(306)}`;

function lancerGlobe(cv: HTMLCanvasElement, fig: HTMLElement, still: boolean) {
  const ctx = cv.getContext("2d");
  if (!ctx) return () => {};
  const D = Math.PI / 180;
  const rings = (str: string) =>
    str.split("|").map((r) => r.split(" ").map((q) => q.split(",").map((n) => +n * D)));
  const LAND = rings(GEO.land);
  const EU = rings(GEO.eu);
  const BOR = rings(GEO.borders);
  const GRAT: number[][][] = [];
  for (let lo = -180; lo < 180; lo += 15) {
    const m: number[][] = [];
    for (let la = -90; la <= 90; la += 3) m.push([lo * D, la * D]);
    GRAT.push(m);
  }
  for (let la = -75; la <= 75; la += 15) {
    const pa: number[][] = [];
    for (let lo = -180; lo <= 180; lo += 3) pa.push([lo * D, la * D]);
    GRAT.push(pa);
  }
  const PHI = 44 * D;
  const sP = Math.sin(PHI);
  const cP = Math.cos(PHI);
  const LAM = 14 * D;
  const SWAY = 16 * D;
  const PERIOD = 32000;
  const cs = getComputedStyle(fig);
  const C = {
    mint: cs.getPropertyValue("--acc-mint-rgb").trim(),
    ink: cs.getPropertyValue("--acc-ink-rgb").trim(),
    ink2: cs.getPropertyValue("--acc-ink-2-rgb").trim(),
  };
  let lam = LAM;
  let euA = still ? 1 : 0;
  const px = [0, 0];
  const proj = (pt: number[]) => {
    const dl = pt[0] - lam;
    const cp = Math.cos(pt[1]);
    const sp = Math.sin(pt[1]);
    const cd = Math.cos(dl);
    px[0] = GLOBE.CX + GLOBE.R * cp * Math.sin(dl);
    px[1] = GLOBE.CY - GLOBE.R * (cP * sp - sP * cp * cd);
    return sP * sp + cP * cp * cd > 0;
  };
  const lines = (set: number[][][]) => {
    ctx.beginPath();
    set.forEach((r) => {
      let on = false;
      for (let i = 0; i < r.length; i++) {
        if (proj(r[i])) {
          if (on) ctx.lineTo(px[0], px[1]);
          else ctx.moveTo(px[0], px[1]);
          on = true;
        } else on = false;
      }
    });
    ctx.stroke();
  };
  const fill = (set: number[][][]) => {
    ctx.beginPath();
    set.forEach((r) => {
      const pts: number[] = [];
      for (let i = 0; i < r.length; i++) {
        if (!proj(r[i])) return;
        pts.push(px[0], px[1]);
      }
      ctx.moveTo(pts[0], pts[1]);
      for (let j = 2; j < pts.length; j += 2) ctx.lineTo(pts[j], pts[j + 1]);
      ctx.closePath();
    });
    ctx.fill();
  };
  let dpr = 1;
  let k = 1;
  const size = () => {
    const w = cv.clientWidth || 600;
    dpr = Math.min(2, window.devicePixelRatio || 1);
    k = w / GLOBE.S;
    const W = Math.round(w * dpr);
    if (cv.width !== W) {
      cv.width = W;
      cv.height = W;
    }
  };
  const draw = () => {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, cv.width, cv.height);
    ctx.setTransform(dpr * k, 0, 0, dpr * k, 0, 0);
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.arc(GLOBE.CX, GLOBE.CY, GLOBE.R, 0, 2 * Math.PI);
    ctx.fillStyle = `rgba(${C.ink2},.35)`;
    ctx.fill();
    ctx.lineWidth = 1.6;
    ctx.strokeStyle = `rgba(${C.mint},.62)`;
    ctx.stroke();
    ctx.lineWidth = 0.8;
    ctx.strokeStyle = `rgba(${C.mint},.2)`;
    lines(GRAT);
    ctx.lineWidth = 0.9;
    ctx.strokeStyle = `rgba(${C.mint},.5)`;
    lines(LAND);
    ctx.globalAlpha = euA;
    ctx.fillStyle = `rgba(${C.mint},.62)`;
    fill(EU);
    ctx.lineWidth = 0.7;
    ctx.strokeStyle = `rgba(${C.ink},.55)`;
    lines(BOR);
    ctx.globalAlpha = 1;
  };
  size();
  draw();
  const onResize = () => {
    size();
    draw();
  };
  window.addEventListener("resize", onResize);
  if (still) return () => window.removeEventListener("resize", onResize);

  let vis = false;
  let raf = 0;
  const t0 = performance.now();
  let last = 0;
  const loop = (t: number) => {
    raf = 0;
    if (!vis || document.hidden) return;
    raf = requestAnimationFrame(loop);
    if (t - last < 33) return; /* ~30 i/s suffisent pour un mouvement aussi lent */
    const dt = last ? t - last : 16;
    last = t;
    lam = LAM + SWAY * Math.sin(((t - t0) / PERIOD) * 2 * Math.PI);
    if (euA < 1 && fig.classList.contains("is-in")) euA = Math.min(1, euA + dt / 1100);
    draw();
  };
  const kick = () => {
    if (vis && !document.hidden && !raf) {
      last = 0;
      raf = requestAnimationFrame(loop);
    }
  };
  const io = new IntersectionObserver((es) => {
    vis = es[es.length - 1].isIntersecting;
    kick();
  });
  io.observe(fig);
  document.addEventListener("visibilitychange", kick);
  return () => {
    io.disconnect();
    cancelAnimationFrame(raf);
    window.removeEventListener("resize", onResize);
    document.removeEventListener("visibilitychange", kick);
  };
}

export function Securite() {
  const { lang } = useLanguage();
  const t = copy[lang];
  const rm = useReducedMotion();
  const figRef = useRef<HTMLElement>(null);
  const cvRef = useRef<HTMLCanvasElement>(null);
  const seen = useSeenOnce(figRef, 0.3);

  useEffect(() => {
    if (!cvRef.current || !figRef.current) return;
    return lancerGlobe(cvRef.current, figRef.current, rm);
  }, [rm]);

  return (
    <section className="acc-sec acc-dark acc-se" id="securite" aria-labelledby="acc-se-t">
      <div className="acc-wrap acc-se-top">
        <div className="acc-se-l" data-reveal-stagger="">
          <span className="acc-eb">{t.eb}</span>
          <h2 className="acc-h2" id="acc-se-t">
            {t.h}
          </h2>
          <p className="acc-lead">{t.lead}</p>
        </div>
        <figure className={"acc-se-globe" + (seen || rm ? " is-in" : "")} ref={figRef}>
          <canvas className="acc-globe-cv" ref={cvRef} role="img" aria-label={t.globe} />
          <svg viewBox={`0 0 ${GLOBE.S} ${GLOBE.S}`} aria-hidden="true">
            <defs>
              <path id="accArcPath" d={ARC} />
            </defs>
            <text className="arc">
              <textPath href="#accArcPath">{t.arc}</textPath>
            </text>
          </svg>
          <figcaption className="acc-se-tip">
            <b>{t.tipT}</b>
            <span>{t.tip}</span>
          </figcaption>
        </figure>
      </div>
      <div className="acc-wrap">
        <ul className="acc-se-cols" data-reveal-stagger="">
          {t.cols.map(([h, p], i) => (
            <li key={i}>
              {i === 0 ? <IconCloud /> : i === 1 ? <IconEu /> : <IconShield />}
              <h3>{h}</h3>
              <p>{p}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
