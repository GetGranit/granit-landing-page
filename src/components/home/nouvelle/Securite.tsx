/* Nouvelle home : 3. SÉCURITÉ (portage de lm/sections.js, bloc « 3. SÉCURITÉ »).
   Le globe est un canvas qui tourne doucement, en continu, en se balançant de part et d'autre de l'Europe
   pour qu'elle reste face à nous ; l'arc « Hébergé en Europe. » est en SVG par-dessus. Les pays de l'UE
   s'allument quand le globe entre à l'écran, puis la bulle. En pause hors écran et onglet caché.
   « Mouvements réduits » : le globe est dessiné une fois, immobile, tout est posé. (Le N3 « suit le curseur » n'est pas porté.) */
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { useLanguage, useReveal } from "./socle";
import { LM_GEO } from "./globeDonnees";
import "./securite.css";

const copy = {
  fr: {
    eb: "Sécurité et confiance",
    titre: "Vos données de santé restent en Europe",
    lead: "Granit s’appuie sur un hébergement certifié HDS, garde vos données dans l’Union européenne et trace chaque action de ses agents.",
    globe: "Globe centré sur l’Europe, les 27 pays de l’Union européenne en surbrillance",
    arc: "Hébergé en Europe.",
    bulleT: "Union européenne",
    bulleS: "Vos données de santé.",
    cartes: [
      {
        t: "Hébergement certifié HDS",
        p: "Vos données sont hébergées chez un hébergeur certifié pour les données de santé, comme l’exige la loi française.",
      },
      {
        t: "Données dans l’UE, RGPD",
        p: "Les données de vos patients sont hébergées dans l’Union européenne et traitées selon le RGPD.",
      },
      {
        t: "Agents sous contrôle",
        p: "Vos identifiants de portails sont conservés dans un coffre-fort chiffré, et chaque action de nos agents est enregistrée et vérifiable.",
      },
    ],
  },
  en: {
    eb: "Security and trust",
    titre: "Your health data stays in Europe",
    lead: "Granit runs on HDS-certified hosting, keeps your data in the EU and logs every action its agents take.",
    globe: "Globe centred on Europe, with the 27 European Union countries highlighted",
    arc: "Hosted in Europe.",
    bulleT: "European Union",
    bulleS: "Your health data.",
    cartes: [
      {
        t: "HDS-certified hosting",
        p: "Your data sits with a provider certified for health data, as French law requires.",
      },
      {
        t: "EU data, GDPR compliant",
        p: "Your patients’ data is hosted in the EU and processed under GDPR.",
      },
      {
        t: "Agents under control",
        p: "Your portal credentials are kept in an encrypted vault, and every action our agents take is logged and can be checked.",
      },
    ],
  },
};

/* le globe : cadre de 760 × 760, centre (380, 400), rayon 300 */
const GLOBE = { S: 760, CX: 380, CY: 400, R: 300 };
/* l'arc de texte, au-dessus du globe, de 202° à 306° */
const ARC = (() => {
  const rt = GLOBE.R + 30;
  const p = (deg: number) => {
    const a = (deg * Math.PI) / 180;
    return `${(GLOBE.CX + rt * Math.cos(a)).toFixed(1)} ${(GLOBE.CY + rt * Math.sin(a)).toFixed(1)}`;
  };
  return `M ${p(202)} A ${rt} ${rt} 0 0 1 ${p(306)}`;
})();

/* les icônes des trois engagements (mêmes tracés que la maquette) */
const EU_ETOILES = Array.from({ length: 12 }, (_, i) => {
  const a = (i / 12) * Math.PI * 2;
  const x = 28 + 22 * Math.cos(a);
  const y = 28 + 22 * Math.sin(a);
  return `M${x.toFixed(1)} ${(y - 2.2).toFixed(1)}l.7 1.5 1.6.2-1.2 1.1.3 1.6-1.4-.8-1.4.8.3-1.6-1.2-1.1 1.6-.2z`;
});
const icone = {
  viewBox: "0 0 56 56",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;
const ICONES = [
  <svg key="nuage" {...icone} aria-hidden="true">
    <path d="M17 41h24a9 9 0 0 0 1.4-17.9A12.5 12.5 0 0 0 18.6 20 10.5 10.5 0 0 0 17 41z" />
    <path d="M22.5 31.5l4 4 8-8.5" />
  </svg>,
  <svg key="ue" {...icone} aria-hidden="true">
    {EU_ETOILES.map((d, i) => (
      <path key={i} d={d} fill="currentColor" stroke="none" />
    ))}
    <rect x="21" y="27" width="14" height="11" rx="2.2" fill="currentColor" stroke="none" />
    <path d="M24 27v-3.2a4 4 0 0 1 8 0V27" />
  </svg>,
  <svg key="bouclier" {...icone} aria-hidden="true">
    <path d="M28 8l16 6v12c0 10-6.8 18-16 22-9.2-4-16-12-16-22V14z" />
    <path d="M21.5 28.5l4.5 4.5 8.5-9" />
  </svg>,
];

type Pt = [number, number];
const D = Math.PI / 180;
function anneaux(str: string): Pt[][] {
  return str.split("|").map((r) =>
    r.split(" ").map((q) => {
      const a = q.split(",");
      return [+a[0] * D, +a[1] * D] as Pt;
    }),
  );
}

export function SecuriteNouvelle() {
  const { lang } = useLanguage();
  const t = copy[lang];
  const secRef = useRef<HTMLElement>(null);
  const figRef = useRef<HTMLElement>(null);
  const cvRef = useRef<HTMLCanvasElement>(null);
  const [entre, setEntre] = useState(false);
  const entreRef = useRef(false);
  useReveal(secRef);

  /* l'entrée : la grille, puis l'Europe, puis la bulle (dès que 30 % du globe est à l'écran) */
  useEffect(() => {
    const fig = figRef.current;
    if (!fig) return;
    const poser = () => {
      entreRef.current = true;
      setEntre(true);
    };
    if (
      !("IntersectionObserver" in window) ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      poser();
      return;
    }
    const io = new IntersectionObserver(
      (es) => {
        if (es[0].isIntersecting) {
          poser();
          io.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    io.observe(fig);
    /* filet : si le globe est déjà à l'écran sans que l'observateur l'ait dit */
    const filet = window.setTimeout(() => {
      const r = fig.getBoundingClientRect();
      if (r.top < window.innerHeight && r.bottom > 0) poser();
    }, 1500);
    return () => {
      io.disconnect();
      window.clearTimeout(filet);
    };
  }, []);

  /* le globe : projection orthographique, dessinée en canvas, ~30 images/s */
  useEffect(() => {
    const fig = figRef.current;
    const cv = cvRef.current;
    const ctx = cv?.getContext("2d");
    if (!fig || !cv || !ctx) return;
    const rm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const LAND = anneaux(LM_GEO.land);
    const EU = anneaux(LM_GEO.eu);
    const BOR = anneaux(LM_GEO.borders);
    const GRAT: Pt[][] = [];
    for (let lo = -180; lo < 180; lo += 15) {
      const m: Pt[] = [];
      for (let la = -90; la <= 90; la += 3) m.push([lo * D, la * D]);
      GRAT.push(m);
    }
    for (let la = -75; la <= 75; la += 15) {
      const pa: Pt[] = [];
      for (let lo = -180; lo <= 180; lo += 3) pa.push([lo * D, la * D]);
      GRAT.push(pa);
    }
    const PHI = 44 * D,
      sP = Math.sin(PHI),
      cP = Math.cos(PHI),
      LAM = 14 * D,
      SWAY = 16 * D,
      PERIOD = 32000;

    /* les couleurs viennent des jetons (triplets --*-rgb du socle), lues sur la section */
    const st = getComputedStyle(fig);
    const rgb = (n: string, repli: string) => st.getPropertyValue(n).trim() || repli;
    const C = {
      mint: rgb("--mint-rgb", "168, 220, 203"),
      ink: rgb("--ink-rgb", "31, 53, 48"),
      ink2: rgb("--ink-2-rgb", "31, 53, 48"),
    };

    let lam = LAM;
    let euA = rm ? 1 : 0;
    const px = new Float32Array(2);
    const proj = (pt: Pt) => {
      const dl = pt[0] - lam,
        cp = Math.cos(pt[1]),
        sp = Math.sin(pt[1]),
        cd = Math.cos(dl);
      px[0] = GLOBE.CX + GLOBE.R * cp * Math.sin(dl);
      px[1] = GLOBE.CY - GLOBE.R * (cP * sp - sP * cp * cd);
      return sP * sp + cP * cp * cd > 0;
    };
    const lignes = (set: Pt[][]) => {
      ctx.beginPath();
      for (const r of set) {
        let on = false;
        for (const p of r) {
          if (proj(p)) {
            if (on) ctx.lineTo(px[0], px[1]);
            else ctx.moveTo(px[0], px[1]);
            on = true;
          } else on = false;
        }
      }
      ctx.stroke();
    };
    const remplir = (set: Pt[][]) => {
      ctx.beginPath();
      for (const r of set) {
        const pts: number[] = [];
        let ok = true;
        for (const p of r) {
          if (!proj(p)) {
            ok = false;
            break;
          }
          pts.push(px[0], px[1]);
        }
        if (!ok) continue;
        ctx.moveTo(pts[0], pts[1]);
        for (let j = 2; j < pts.length; j += 2) ctx.lineTo(pts[j], pts[j + 1]);
        ctx.closePath();
      }
      ctx.fill();
    };

    let dpr = 1,
      k = 1;
    const taille = () => {
      const w = cv.clientWidth || 600;
      dpr = Math.min(2, window.devicePixelRatio || 1);
      k = w / GLOBE.S;
      const W = Math.round(w * dpr);
      if (cv.width !== W) {
        cv.width = W;
        cv.height = W;
      }
    };
    const dessiner = () => {
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, cv.width, cv.height);
      ctx.setTransform(dpr * k, 0, 0, dpr * k, 0, 0);
      ctx.lineJoin = "round";
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.arc(GLOBE.CX, GLOBE.CY, GLOBE.R, 0, 2 * Math.PI);
      ctx.fillStyle = `rgba(${C.ink2}, .35)`;
      ctx.fill();
      ctx.lineWidth = 1.6;
      ctx.strokeStyle = `rgba(${C.mint}, .62)`;
      ctx.stroke();
      ctx.lineWidth = 0.8;
      ctx.strokeStyle = `rgba(${C.mint}, .2)`;
      lignes(GRAT);
      ctx.lineWidth = 0.9;
      ctx.strokeStyle = `rgba(${C.mint}, .5)`;
      lignes(LAND);
      ctx.globalAlpha = euA;
      ctx.fillStyle = `rgba(${C.mint}, .62)`;
      remplir(EU);
      ctx.lineWidth = 0.7;
      ctx.strokeStyle = `rgba(${C.ink}, .55)`;
      lignes(BOR);
      ctx.globalAlpha = 1;
    };
    const auRedim = () => {
      taille();
      dessiner();
    };
    taille();
    dessiner();
    window.addEventListener("resize", auRedim);
    if (rm) return () => window.removeEventListener("resize", auRedim);

    let vis = false,
      raf = 0,
      last = 0;
    const t0 = performance.now();
    const boucle = (tt: number) => {
      raf = 0;
      if (!vis || document.hidden) return;
      raf = requestAnimationFrame(boucle);
      if (tt - last < 33) return; /* ~30 i/s suffisent pour un mouvement aussi lent */
      const dt = last ? tt - last : 16;
      last = tt;
      lam = LAM + SWAY * Math.sin(((tt - t0) / PERIOD) * 2 * Math.PI);
      if (euA < 1 && entreRef.current) euA = Math.min(1, euA + dt / 1100);
      dessiner();
    };
    const relancer = () => {
      if (vis && !document.hidden && !raf) {
        last = 0;
        raf = requestAnimationFrame(boucle);
      }
    };
    let io: IntersectionObserver | null = null;
    if ("IntersectionObserver" in window) {
      io = new IntersectionObserver(
        (es) => {
          vis = es[es.length - 1].isIntersecting;
          relancer();
        },
        { threshold: 0 },
      );
      io.observe(fig);
    } else {
      vis = true;
      relancer();
    }
    document.addEventListener("visibilitychange", relancer);
    return () => {
      window.removeEventListener("resize", auRedim);
      document.removeEventListener("visibilitychange", relancer);
      io?.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section ref={secRef} className="lm-sec lm-dark lm-se" id="securite" aria-labelledby="lm-se-t">
      <div className="lm-wrap lm-se-top">
        <div className="lm-se-l">
          <span className="lm-eb" data-reveal="" style={{ "--i": 0 } as CSSProperties}>
            {t.eb}
          </span>
          <h2 className="lm-h2" id="lm-se-t" data-reveal="" style={{ "--i": 1 } as CSSProperties}>
            {t.titre}
          </h2>
          <p className="lm-lead" data-reveal="" style={{ "--i": 2 } as CSSProperties}>
            {t.lead}
          </p>
        </div>
        <figure ref={figRef} className={`lm-se-globe${entre ? " is-in" : ""}`}>
          <canvas ref={cvRef} className="lm-globe-cv" role="img" aria-label={t.globe} />
          <svg viewBox={`0 0 ${GLOBE.S} ${GLOBE.S}`} aria-hidden="true">
            <defs>
              <path id="nh-se-arc" d={ARC} />
            </defs>
            <text className="arc">
              <textPath href="#nh-se-arc">{t.arc}</textPath>
            </text>
          </svg>
          <figcaption className="lm-se-tip">
            <b>{t.bulleT}</b>
            <span>{t.bulleS}</span>
          </figcaption>
        </figure>
      </div>
      <div className="lm-wrap">
        <ul className="lm-se-cols">
          {t.cartes.map((c, i) => (
            <li key={i} data-reveal="" style={{ "--i": i } as CSSProperties}>
              {ICONES[i]}
              <h3>{c.t}</h3>
              <p>{c.p}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
