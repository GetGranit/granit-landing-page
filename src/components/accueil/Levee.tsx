/* Accueil : l'annonce de la levée de fonds. Une tuile de granit pâle peinte une fois (canvas),
   le symbole posé dessus pierre par pierre quand la tuile entre à l'écran (une fois, jamais en boucle).
   « Mouvements réduits » : le symbole est posé d'emblée. */
import { useEffect, useRef, useState } from "react";
import { usePostHog } from "posthog-js/react";
import { useLanguage } from "@/lib/i18n";
import { IconArrow, LOGO, linkedinUrl, useReducedMotion, useSeenOnce, useSymbole } from "./commun";

const copy = {
  fr: {
    nouveau: "Nouveau",
    h: "Granit annonce sa levée de fonds",
    lead: "Avec Seedcamp, Granit accélère : plus de métiers couverts, plus d’établissements accompagnés, plus de temps rendu au soin.",
    more: "Lire l’annonce",
    tile: "Le logo Granit posé sur du granit",
  },
  en: {
    nouveau: "New",
    h: "Granit announces its funding round",
    lead: "With Seedcamp, Granit is speeding up: more professions covered, more facilities supported, more time given back to care.",
    more: "Read the announcement",
    tile: "The Granit logo set on granite",
  },
};

/* un bruit doux en trois teintes (rosé assombri → rosé → papier), quelques grains d'encre et de menthe */
function peindreGranit(tile: HTMLElement) {
  const cs = getComputedStyle(tile);
  const rgb = (n: string) =>
    (cs.getPropertyValue(n).match(/[\d.]+/g) ?? ["240", "236", "236"]).slice(0, 3).map(Number);
  const rng = (seed: number) => () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const mix = (a: number[], b: number[], t: number) => [
    a[0] + (b[0] - a[0]) * t,
    a[1] + (b[1] - a[1]) * t,
    a[2] + (b[2] - a[2]) * t,
  ];
  const b = tile.getBoundingClientRect();
  const sc = Math.min(1.5, window.devicePixelRatio || 1);
  const w = Math.max(320, Math.min(1400, Math.round(b.width * sc)));
  const h = Math.max(240, Math.min(1100, Math.round(b.height * sc)));
  const r = rng(5);
  const cv = document.createElement("canvas");
  cv.width = w;
  cv.height = h;
  const x = cv.getContext("2d");
  const f = document.createElement("canvas");
  f.width = w;
  f.height = h;
  const fx = f.getContext("2d");
  if (!x || !fx) return;
  fx.imageSmoothingQuality = "high";
  [
    [5, 1],
    [11, 0.55],
    [26, 0.34],
    [60, 0.18],
  ].forEach(([sw, a]) => {
    const s = document.createElement("canvas");
    const sh = Math.max(2, Math.round((sw * h) / w));
    s.width = sw;
    s.height = sh;
    const sx = s.getContext("2d");
    if (!sx) return;
    const im = sx.createImageData(sw, sh);
    for (let i = 0; i < im.data.length; i += 4) {
      const v = r() * 255;
      im.data[i] = im.data[i + 1] = im.data[i + 2] = v;
      im.data[i + 3] = 255;
    }
    sx.putImageData(im, 0, 0);
    fx.globalAlpha = a;
    fx.drawImage(s, -w / sw / 2, -h / sh / 2, w + w / sw, h + h / sh);
  });
  const fd = fx.getImageData(0, 0, w, h).data;
  let lo = 255;
  let hi = 0;
  for (let i = 0; i < fd.length; i += 4) {
    if (fd[i] < lo) lo = fd[i];
    if (fd[i] > hi) hi = fd[i];
  }
  const ink = rgb("--acc-ink-rgb");
  const rose = rgb("--acc-rose-rgb");
  const paper = rgb("--acc-paper-rgb");
  const a0 = mix(rose, ink, 0.16);
  const span = hi - lo || 1;
  const im2 = x.createImageData(w, h);
  const o = im2.data;
  for (let i = 0; i < fd.length; i += 4) {
    let t = (fd[i] - lo) / span;
    t = Math.min(1, Math.max(0, (t - 0.22) / 0.6));
    t = t * t * (3 - 2 * t);
    const p0 = t < 0.5 ? a0 : rose;
    const p1 = t < 0.5 ? rose : paper;
    const u = t < 0.5 ? t * 2 : (t - 0.5) * 2;
    const g = (r() - 0.5) * 14;
    o[i] = p0[0] + (p1[0] - p0[0]) * u + g;
    o[i + 1] = p0[1] + (p1[1] - p0[1]) * u + g;
    o[i + 2] = p0[2] + (p1[2] - p0[2]) * u + g;
    o[i + 3] = 255;
  }
  x.putImageData(im2, 0, 0);
  (
    [
      [ink, (w * h) / 420, 0.32],
      [rgb("--acc-mint-rgb"), (w * h) / 900, 0.4],
    ] as [number[], number, number][]
  ).forEach(([c, n, a]) => {
    x.fillStyle = `rgb(${c.map(Math.round).join(",")})`;
    for (let q = 0; q < n; q++) {
      x.globalAlpha = a * (0.4 + r() * 0.6);
      x.beginPath();
      x.arc(r() * w, r() * h, 0.5 + r() * 1.3, 0, 6.283);
      x.fill();
    }
  });
  cv.toBlob(
    (bl) => {
      if (bl) tile.style.setProperty("--gr", `url("${URL.createObjectURL(bl)}")`);
    },
    "image/jpeg",
    0.9,
  );
}

export function Levee() {
  const { lang } = useLanguage();
  const posthog = usePostHog();
  const t = copy[lang];
  const rm = useReducedMotion();
  const tileRef = useRef<HTMLElement>(null);
  const symbole = useSymbole(LOGO.symbole);
  const vu = useSeenOnce(tileRef, 0.25);
  const [peint, setPeint] = useState(false);

  useEffect(() => {
    if (vu && !peint && tileRef.current) {
      setPeint(true);
      peindreGranit(tileRef.current);
    }
  }, [vu, peint]);

  const pose = vu || rm;
  return (
    <section className="acc-sec acc-light acc-lv" id="levee" aria-labelledby="acc-lv-t">
      <div className="acc-wrap acc-lv-g">
        <div className="acc-lv-txt" data-reveal-stagger="">
          <span className="acc-lv-new">{t.nouveau}</span>
          <h2 className="acc-h2" id="acc-lv-t">
            {t.h}
          </h2>
          <p className="acc-lead">{t.lead}</p>
          <a
            className="acc-lv-more"
            href={linkedinUrl("levee")}
            target="_blank"
            rel="noopener"
            onClick={() => posthog?.capture("linkedin_clicked", { placement: "levee" })}
          >
            {t.more}
            <IconArrow />
          </a>
        </div>
        <figure
          className={"acc-lv-tile" + (pose ? " is-pose" : "") + (rm ? " is-still" : "")}
          ref={tileRef}
          aria-label={t.tile}
        >
          {symbole && (
            <svg viewBox={symbole.viewBox} aria-hidden="true">
              {symbole.pieces.map((p, i) => {
                /* chaque pierre arrive de son côté, en tournant un peu */
                const a = i * 2.39996 + 0.6;
                const dist = 70 + (i % 3) * 22;
                return (
                  <g key={i} transform={p.transform}>
                    <path
                      d={p.d}
                      strokeWidth={p.stroke || undefined}
                      style={{
                        ["--dx" as string]: (Math.cos(a) * dist).toFixed(1) + "px",
                        ["--dy" as string]: (Math.sin(a) * dist - 20).toFixed(1) + "px",
                        ["--r" as string]: ((i % 2 ? 1 : -1) * (14 + i * 5)).toFixed(1) + "deg",
                        ["--k" as string]: i,
                      }}
                    />
                  </g>
                );
              })}
            </svg>
          )}
        </figure>
      </div>
    </section>
  );
}
