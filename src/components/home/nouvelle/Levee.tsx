/* Nouvelle home : 4. LEVÉE (portage de lm/sections.js, bloc « 4. LEVÉE »).
   Granit pâle peint une fois en canvas (quand la tuile arrive à l'écran), puis le logo Galets s'y pose pièce par pièce
   dès qu'un quart de la tuile est visible (niveau N2). Rien ne s'affiche avant l'annonce publique (useLeveeAnnoncee).
   « Mouvements réduits » : le logo est posé d'emblée. */
import { useEffect, useRef, type CSSProperties } from "react";
import { usePostHog } from "posthog-js/react";
import { GALETS_PIECES, GALETS_VIEWBOX, useLanguage, useLeveeAnnoncee, useReveal } from "./socle";
import "./levee.css";

const copy = {
  fr: {
    nouveau: "Nouveau",
    titre: "Granit annonce sa levée de fonds",
    lead: "Avec Seedcamp, Granit accélère : plus de métiers couverts, plus d’établissements accompagnés, plus de temps rendu au soin.",
    lien: "Lire l’annonce",
    tuile: "Le logo Granit posé sur du granit",
  },
  en: {
    nouveau: "New",
    titre: "Granit announces its funding round",
    lead: "Backed by Seedcamp, Granit is speeding up: more specialties, more providers, more time given back to care.",
    lien: "Read the announcement",
    tuile: "The Granit logo set on granite",
  },
};

/* la page LinkedIn de Granit (celle de src/lib/seo.ts), suivie comme la prise de rendez-vous */
const LINKEDIN_LEVEE =
  "https://www.linkedin.com/company/getgranit-ai/?utm_source=getgranit.ai&utm_medium=site&utm_campaign=homepage&utm_content=levee";
/* la 3e pierre, au centre, est la clé de voûte (en profond) ; même trait que GaletsSymbol du socle */
const CLE = 2;
const TRAIT = 15.67;

/* pseudo-hasard à graine fixe : le même granit à chaque visite */
function hasard(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
type Rgb = [number, number, number];
/* une couleur de jeton (hex ou rgb()) lue en triplet */
function triplet(c: string, repli: Rgb): Rgb {
  c = c.trim();
  if (c[0] === "#" && c.length >= 7)
    return [parseInt(c.slice(1, 3), 16), parseInt(c.slice(3, 5), 16), parseInt(c.slice(5, 7), 16)];
  const m = c.match(/[\d.]+/g);
  return m && m.length >= 3 ? [+m[0], +m[1], +m[2]] : repli;
}
const melange = (a: Rgb, b: Rgb, t: number): Rgb => [
  a[0] + (b[0] - a[0]) * t,
  a[1] + (b[1] - a[1]) * t,
  a[2] + (b[2] - a[2]) * t,
];

/* le granit pâle : quelques couches de bruit agrandi, trois teintes (gris rosé → rosé → papier), puis des grains d'encre et de menthe */
function peindre(tile: HTMLElement, poser: (url: string) => void) {
  const b = tile.getBoundingClientRect();
  const sc = Math.min(1.5, window.devicePixelRatio || 1);
  const w = Math.max(320, Math.min(1400, Math.round(b.width * sc)));
  const h = Math.max(240, Math.min(1100, Math.round(b.height * sc)));
  const r = hasard(5);
  const cv = document.createElement("canvas");
  cv.width = w;
  cv.height = h;
  const x = cv.getContext("2d");
  const f = document.createElement("canvas");
  f.width = w;
  f.height = h;
  const fx = f.getContext("2d", { willReadFrequently: true });
  if (!x || !fx) return;
  fx.imageSmoothingQuality = "high";
  for (const [sw, alpha] of [
    [5, 1],
    [11, 0.55],
    [26, 0.34],
    [60, 0.18],
  ]) {
    const s = document.createElement("canvas");
    const sh = Math.max(2, Math.round((sw * h) / w));
    s.width = sw;
    s.height = sh;
    const sx = s.getContext("2d");
    if (!sx) continue;
    const im = sx.createImageData(sw, sh);
    for (let i = 0; i < im.data.length; i += 4) {
      const v = r() * 255;
      im.data[i] = im.data[i + 1] = im.data[i + 2] = v;
      im.data[i + 3] = 255;
    }
    sx.putImageData(im, 0, 0);
    fx.globalAlpha = alpha;
    fx.drawImage(s, -w / sw / 2, -h / sh / 2, w + w / sw, h + h / sh);
  }
  const fd = fx.getImageData(0, 0, w, h).data;
  let lo = 255,
    hi = 0;
  for (let i = 0; i < fd.length; i += 4) {
    if (fd[i] < lo) lo = fd[i];
    if (fd[i] > hi) hi = fd[i];
  }
  const st = getComputedStyle(tile);
  const C = (n: string, repli: Rgb) => triplet(st.getPropertyValue(n), repli);
  const ink = C("--ink", [31, 53, 48]),
    rose = C("--rose", [250, 240, 242]),
    paper = C("--paper", [255, 253, 253]),
    mint = C("--mint", [168, 220, 203]);
  const a0 = melange(rose, ink, 0.16),
    span = hi - lo || 1;
  const im2 = x.createImageData(w, h),
    o = im2.data;
  for (let i = 0; i < fd.length; i += 4) {
    let t = (fd[i] - lo) / span;
    t = Math.min(1, Math.max(0, (t - 0.22) / 0.6));
    t = t * t * (3 - 2 * t);
    const p0 = t < 0.5 ? a0 : rose,
      p1 = t < 0.5 ? rose : paper,
      u = t < 0.5 ? t * 2 : (t - 0.5) * 2,
      g = (r() - 0.5) * 14;
    o[i] = p0[0] + (p1[0] - p0[0]) * u + g;
    o[i + 1] = p0[1] + (p1[1] - p0[1]) * u + g;
    o[i + 2] = p0[2] + (p1[2] - p0[2]) * u + g;
    o[i + 3] = 255;
  }
  x.putImageData(im2, 0, 0);
  for (const [col, n, a] of [
    [ink, (w * h) / 420, 0.32],
    [mint, (w * h) / 900, 0.4],
  ] as [Rgb, number, number][]) {
    x.fillStyle = `rgb(${col.map(Math.round).join(",")})`;
    for (let q = 0; q < n; q++) {
      x.globalAlpha = a * (0.4 + r() * 0.6);
      x.beginPath();
      x.arc(r() * w, r() * h, 0.5 + r() * 1.3, 0, 6.283);
      x.fill();
    }
  }
  try {
    cv.toBlob(
      (bl) => {
        if (bl) poser(URL.createObjectURL(bl));
      },
      "image/jpeg",
      0.9,
    );
  } catch {
    poser(cv.toDataURL("image/jpeg", 0.9));
  }
}

/* d'où vient chaque pierre avant de se poser (angle d'or, distances et rotations alternées) */
const ECARTS = GALETS_PIECES.map((_, i) => {
  const a = i * 2.39996 + 0.6,
    dist = 70 + (i % 3) * 22;
  return {
    dx: Math.cos(a) * dist,
    dy: Math.sin(a) * dist - 20,
    r: (i % 2 ? 1 : -1) * (14 + i * 5),
  };
});

export function LeveeNouvelle() {
  const annoncee = useLeveeAnnoncee();
  if (!annoncee) return null;
  return <Levee />;
}

function Levee() {
  const { lang } = useLanguage();
  const t = copy[lang];
  const posthog = usePostHog();
  const secRef = useRef<HTMLElement>(null);
  const tileRef = useRef<HTMLElement>(null);
  const logoRef = useRef<SVGSVGElement>(null);
  useReveal(secRef);

  /* le granit : peint une fois, quand la tuile arrive à l'écran */
  useEffect(() => {
    const tile = tileRef.current;
    if (!tile) return;
    let url = "",
      fini = false,
      minuterie = 0;
    const poser = (u: string) => {
      if (fini) {
        if (u.startsWith("blob:")) URL.revokeObjectURL(u);
        return;
      }
      url = u;
      tile.style.setProperty("--gr", `url("${u}")`);
    };
    const lancer = () => {
      minuterie = window.setTimeout(() => peindre(tile, poser), 30);
    };
    let io: IntersectionObserver | null = null;
    if ("IntersectionObserver" in window) {
      io = new IntersectionObserver((es) => {
        if (es[es.length - 1].isIntersecting) {
          io?.disconnect();
          lancer();
        }
      });
      io.observe(tile);
    } else lancer();
    return () => {
      fini = true;
      io?.disconnect();
      window.clearTimeout(minuterie);
      if (url.startsWith("blob:")) URL.revokeObjectURL(url);
    };
  }, []);

  /* le logo : rendu posé (serveur, mouvements réduits) ; sinon écarté au montage, il se pose quand un quart de la tuile est visible */
  useEffect(() => {
    const tile = tileRef.current,
      svg = logoRef.current;
    if (!tile || !svg) return;
    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      !("IntersectionObserver" in window)
    )
      return;
    const pieces = Array.from(svg.querySelectorAll<SVGPathElement>("path"));
    const placer = (q: number, transition: boolean) => {
      pieces.forEach((el, i) => {
        const p = ECARTS[i],
          u = 1 - q;
        el.style.transition = transition
          ? `transform .9s var(--lm-ease) ${i * 0.06}s, opacity .6s ease ${i * 0.06}s`
          : "none";
        el.style.transform =
          u < 0.001
            ? "none"
            : `translate(${(p.dx * u).toFixed(1)}px,${(p.dy * u).toFixed(1)}px) rotate(${(p.r * u).toFixed(1)}deg) scale(${(1 - 0.1 * u).toFixed(3)})`;
        el.style.opacity = q > 0 ? "1" : "0";
      });
    };
    placer(0, false);
    const io = new IntersectionObserver(
      (es) => {
        if (es[0].isIntersecting) {
          io.disconnect();
          placer(1, true);
        }
      },
      { threshold: 0.25 },
    );
    io.observe(tile);
    return () => {
      io.disconnect();
      placer(1, false);
    };
  }, []);

  return (
    <section ref={secRef} className="lm-sec lm-light lm-lv" id="levee" aria-labelledby="lm-lv-t">
      <div className="lm-wrap lm-lv-g">
        <div className="lm-lv-txt">
          <span className="lm-lv-new" data-reveal="" style={{ "--i": 0 } as CSSProperties}>
            {t.nouveau}
          </span>
          <h2 className="lm-h2" id="lm-lv-t" data-reveal="" style={{ "--i": 1 } as CSSProperties}>
            {t.titre}
          </h2>
          <p className="lm-lead" data-reveal="" style={{ "--i": 2 } as CSSProperties}>
            {t.lead}
          </p>
          <a
            className="lm-lv-more"
            href={LINKEDIN_LEVEE}
            target="_blank"
            rel="noopener noreferrer"
            data-reveal=""
            style={{ "--i": 3 } as CSSProperties}
            onClick={() => posthog?.capture("linkedin_clicked", { placement: "levee" })}
          >
            {t.lien}
            <svg viewBox="0 0 16 16" aria-hidden="true">
              <path
                d="M2.8 8h10M9 4l4 4-4 4"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        </div>
        <figure ref={tileRef} className="lm-lv-tile" aria-label={t.tuile}>
          <svg ref={logoRef} viewBox={GALETS_VIEWBOX} aria-hidden="true">
            <g fill="currentColor" stroke="currentColor" strokeWidth={TRAIT} strokeLinejoin="round">
              {GALETS_PIECES.map((p, i) => (
                <g
                  key={i}
                  transform={`translate(${p.x} ${p.y})`}
                  className={i === CLE ? "lm-lv-cle" : undefined}
                >
                  <path d={p.d} />
                </g>
              ))}
            </g>
          </svg>
        </figure>
      </div>
    </section>
  );
}
