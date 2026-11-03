/* Nouvelle home : outils partagés par les sections (portage de la maquette « Last mile »).
   Chaque section vit dans son fichier (Hero, Produit, Connecteurs, Metiers, Securite, Levee, CtaFin)
   et prend ses textes en fr et en en, selon useLanguage(). */
import { useEffect, useState, useSyncExternalStore, type RefObject } from "react";
import { useLanguage, type Lang } from "@/lib/i18n";

export type { Lang };
export { useLanguage };

/* ---------- prise de rendez-vous : Cal.com de Paul, UTM par emplacement ---------- */
const CALCOM_DEMO_URL = "https://cal.com/paul-pietra-granit/decouvrir-granit/";
export function calcomDemoUrl(placement: string) {
  const params = new URLSearchParams({
    utm_source: "getgranit.ai",
    utm_medium: "site",
    utm_campaign: "homepage",
    utm_content: placement,
  });
  return `${CALCOM_DEMO_URL}?${params.toString()}`;
}

/* ---------- la levée : rien ne se montre avant l'annonce publique du 5 novembre 2026 ----------
   Le rendu serveur et le premier rendu client cachent toujours (pas d'écart d'hydratation) ;
   après le montage, on compare à l'heure de Paris. ?levee=1 dans l'URL force l'affichage pour relire. */
export const ANNONCE_LEVEE = "2026-11-05T00:00:00+01:00";
export function useLeveeAnnoncee() {
  const [annoncee, setAnnoncee] = useState(false);
  useEffect(() => {
    const force = new URLSearchParams(window.location.search).get("levee") === "1";
    setAnnoncee(force || Date.now() >= new Date(ANNONCE_LEVEE).getTime());
  }, []);
  return annoncee;
}

/* ---------- vrai une fois hydraté (les animations ne partent qu'après) ---------- */
const subscribe = () => () => {};
export function useHydrated() {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}

/* ---------- « mouvements réduits » du système ---------- */
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

/* ---------- apparitions : pose .is-in sur chaque [data-reveal] du bloc quand il entre à l'écran ---------- */
export function useReveal(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const els = Array.from(root.querySelectorAll<HTMLElement>("[data-reveal]"));
    if (!("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("is-in"));
      return;
    }
    const io = new IntersectionObserver(
      (es) =>
        es.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        }),
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [ref]);
}

/* ---------- le symbole Galets, en motif décoratif (filigrane du CTA, carte de la levée) ----------
   Les mêmes vecteurs que internal/marque/sources/logo.cjs (logo du 2 novembre) : on ne le redessine pas. */
const GALETS = {
  viewBox: "10.462 -1.145 154.093 190",
  stroke: 15.67,
  pieces: [
    { x: 67.7999, y: 14.8335, d: "M0 0 L62.423 15.9125 L30.8734 52.5949 L2.8634 51.9975 Z" },
    { x: 118.4916, y: 44.2009, d: "M34.5175 0 L0.101 39.9213 L0 70.2643 L38.2286 66.5335 Z" },
    { x: 71.125, y: 90.875, d: "M0 0 L23.75 0 L23.75 23.75 L0 23.75 Z" },
    {
      x: 25.6218,
      y: 137.0117,
      d: "M67.5487 1.4661 L0.8551 0 L0 30.9357 L22.7217 35.8653 L63.9536 30.9357 Z",
    },
    {
      x: 18.2973,
      y: 16.946,
      d: "M28.5979 95.7061 L7.6005 91.5595 L0 46.0841 L3.2973 8.2147 L26.0407 0 L29.5992 37.6614 Z",
    },
    {
      x: 113.3655,
      y: 137.2606,
      d: "M0.3845 3.3926 L40.2526 0 L37.3038 21.1524 L1.6599 24.9536 L0 19.0657 Z",
    },
  ],
};
export const GALETS_PIECES = GALETS.pieces;
export const GALETS_VIEWBOX = GALETS.viewBox;
export function GaletsSymbol({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox={GALETS.viewBox} aria-hidden="true">
      <g
        fill="currentColor"
        stroke="currentColor"
        strokeWidth={GALETS.stroke}
        strokeLinejoin="round"
      >
        {GALETS.pieces.map((p, i) => (
          <path key={i} transform={`translate(${p.x} ${p.y})`} d={p.d} />
        ))}
      </g>
    </svg>
  );
}
