/* Accueil : ce que les sections partagent (liens suivis, icônes, mouvement, logos).
   Niveau d'animation : celui de la maquette par défaut (N2 : entrées, démo qui tourne, pastilles qui se posent).
   « Mouvements réduits » : l'état final, immobile. Rien ne touche window au chargement du module (SSR). */
import { useEffect, useState, type RefObject } from "react";

/* Prise de rendez-vous : le Cal.com de Paul, utm_content dit quel bouton (hero, nav, bandeau_bas, footer) */
const CAL = "https://cal.com/paul-pietra-granit/decouvrir-granit/";
export function calUrl(placement: string) {
  const p = new URLSearchParams({
    utm_source: "getgranit.ai",
    utm_medium: "site",
    utm_campaign: "homepage",
    utm_content: placement,
  });
  return `${CAL}?${p.toString()}`;
}

/* La page LinkedIn de Granit (la même que src/lib/seo.ts), suivie comme la prise de rendez-vous */
const LINKEDIN = "https://www.linkedin.com/company/getgranit-ai/";
export function linkedinUrl(placement: string) {
  const p = new URLSearchParams({
    utm_source: "getgranit.ai",
    utm_medium: "site",
    utm_campaign: "homepage",
    utm_content: placement,
  });
  return `${LINKEDIN}?${p.toString()}`;
}

/* Les fichiers du logo, tels que fabriqués par internal/marque/sources/fabriquer.cjs (jamais retouchés ici) */
export const LOGO = {
  horizontal: "/marque/granit-logo.svg",
  horizontalRose: "/marque/granit-logo-rose.svg",
  symbole: "/marque/granit-symbole.svg",
  symboleRose: "/marque/granit-symbole-rose.svg",
};
/* La clé de voûte (l'encaissement) est la 3e pierre du symbole */
export const CLE_DE_VOUTE = 2;

/** « Mouvements réduits » du système, lu après le montage (false côté serveur). */
export function useReducedMotion() {
  const [rm, setRm] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const on = () => setRm(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return rm;
}

/** Vrai tant que l'élément est à l'écran (seuil en fraction visible). */
export function useInView(ref: RefObject<Element | null>, threshold = 0) {
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!("IntersectionObserver" in window)) {
      setVis(true);
      return;
    }
    const io = new IntersectionObserver((es) => setVis(es[es.length - 1].isIntersecting), {
      threshold,
    });
    io.observe(el);
    return () => io.disconnect();
  }, [ref, threshold]);
  return vis;
}

/** Vrai dès que l'élément a été vu une fois (entrées qui ne rejouent pas). */
export function useSeenOnce(ref: RefObject<Element | null>, threshold = 0.25) {
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || seen) return;
    if (!("IntersectionObserver" in window)) {
      setSeen(true);
      return;
    }
    const io = new IntersectionObserver(
      (es) => {
        if (es[0].isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      },
      { threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref, threshold, seen]);
  return seen;
}

export type Piece = { transform: string; d: string; stroke: number };
export type Symbole = { viewBox: string; pieces: Piece[] };

/** Les tracés d'un SVG du logo pris dans public/, pour animer les pierres une à une sans les redessiner.
    Chaque tracé garde la chaîne de transformations de ses parents ; stroke > 0 : une pierre (contour arrondi),
    0 : une lettre du nom. */
export function useSymbole(url: string) {
  const [s, setS] = useState<Symbole | null>(null);
  useEffect(() => {
    let off = false;
    fetch(url)
      .then((r) => (r.ok ? r.text() : Promise.reject(new Error(String(r.status)))))
      .then((txt) => {
        const root = new DOMParser().parseFromString(txt, "image/svg+xml").documentElement;
        const pieces = Array.from(root.querySelectorAll("path")).map((p) => {
          const tr: string[] = [];
          let stroke = 0;
          for (let el: Element | null = p; el && el !== root; el = el.parentElement) {
            const t = el.getAttribute("transform");
            if (t) tr.unshift(t);
            const sw = el.getAttribute("stroke-width");
            if (!stroke && sw && el.getAttribute("stroke") !== "none") stroke = parseFloat(sw) || 0;
          }
          return { transform: tr.join(" "), d: p.getAttribute("d") ?? "", stroke };
        });
        if (!off) setS({ viewBox: root.getAttribute("viewBox") ?? "0 0 100 100", pieces });
      })
      .catch(() => {});
    return () => {
      off = true;
    };
  }, [url]);
  return s;
}

/* ---------- icônes ---------- */
export function IconArrow() {
  return (
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
  );
}
export function IconOut() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <path
        d="M5 11l6-6M6 4.6h5.4V10"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
export function IconCheck({ w = 1.9 }: { w?: number }) {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <path
        d="M3.4 8.5l2.9 2.9 6.3-6.6"
        fill="none"
        stroke="currentColor"
        strokeWidth={w}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
export function IconAlert() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <path
        d="M8 3.6v5.6"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="8" cy="12.3" r="1.2" fill="currentColor" />
    </svg>
  );
}
export function IconShieldSmall() {
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
/* les douze étoiles de l'Union européenne, en points */
const ETOILES = Array.from({ length: 12 }, (_, i) => {
  const a = (i / 12) * Math.PI * 2;
  return { cx: (12 + 9 * Math.cos(a)).toFixed(2), cy: (12 + 9 * Math.sin(a)).toFixed(2) };
});
export function IconStars() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
      {ETOILES.map((e, i) => (
        <circle key={i} cx={e.cx} cy={e.cy} r="1.25" />
      ))}
    </svg>
  );
}
export function IconCloud() {
  return (
    <svg
      viewBox="0 0 56 56"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M17 41h24a9 9 0 0 0 1.4-17.9A12.5 12.5 0 0 0 18.6 20 10.5 10.5 0 0 0 17 41z" />
      <path d="M22.5 31.5l4 4 8-8.5" />
    </svg>
  );
}
const ETOILES_UE = Array.from({ length: 12 }, (_, i) => {
  const a = (i / 12) * Math.PI * 2;
  const x = 28 + 22 * Math.cos(a);
  const y = 28 + 22 * Math.sin(a);
  return `M${x.toFixed(1)} ${(y - 2.2).toFixed(1)}l.7 1.5 1.6.2-1.2 1.1.3 1.6-1.4-.8-1.4.8.3-1.6-1.2-1.1 1.6-.2z`;
});
export function IconEu() {
  return (
    <svg
      viewBox="0 0 56 56"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {ETOILES_UE.map((d, i) => (
        <path key={i} d={d} fill="currentColor" stroke="none" />
      ))}
      <rect x="21" y="27" width="14" height="11" rx="2.2" fill="currentColor" stroke="none" />
      <path d="M24 27v-3.2a4 4 0 0 1 8 0V27" />
    </svg>
  );
}
export function IconShield() {
  return (
    <svg
      viewBox="0 0 56 56"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M28 8l16 6v12c0 10-6.8 18-16 22-9.2-4-16-12-16-22V14z" />
      <path d="M21.5 28.5l4.5 4.5 8.5-9" />
    </svg>
  );
}
export function IconLinkedin() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.36V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z"
      />
    </svg>
  );
}
