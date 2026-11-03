/* L'accueil de getgranit.ai (maquette validée par Paul le 3 novembre 2026) : barre d'annonce et navigation propres,
   hero vidéo, produit, connecteurs, métiers, sécurité, levée de fonds, CTA de fin, pied de page.
   Les apparitions ([data-reveal], [data-reveal-stagger]) sont posées ici, après le montage : rendu serveur
   et « mouvements réduits » montrent tout, tout de suite. */
import { useEffect, useRef } from "react";
import "./accueil.css";
import { BarreNav } from "./BarreNav";
import { Hero } from "./Hero";
import { Produit } from "./Produit";
import { Connecteurs } from "./Connecteurs";
import { Metiers } from "./Metiers";
import { Securite } from "./Securite";
import { Levee } from "./Levee";
import { CtaFin } from "./CtaFin";
import { PiedDePage } from "./PiedDePage";

function useApparitions(ref: React.RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    root.querySelectorAll("[data-reveal-stagger]").forEach((p) => {
      Array.from(p.children).forEach((c, i) => {
        if (!c.hasAttribute("data-reveal")) c.setAttribute("data-reveal", "");
        (c as HTMLElement).style.setProperty("--i", String(i));
      });
    });
    const els = Array.from(root.querySelectorAll<HTMLElement>("[data-reveal]"));
    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      !("IntersectionObserver" in window)
    ) {
      els.forEach((el) => el.classList.add("is-in"));
      return;
    }
    root.classList.add("acc-js");
    const io = new IntersectionObserver(
      (es) =>
        es.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        }),
      { rootMargin: "0px 0px -8% 0px", threshold: 0.01 },
    );
    els.forEach((el) => io.observe(el));
    /* filet : rien ne reste caché si l'observateur ne répond pas (captures, aperçus) */
    const tm = window.setTimeout(() => {
      els.forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.top < window.innerHeight && r.bottom > 0) el.classList.add("is-in");
      });
    }, 1200);
    return () => {
      io.disconnect();
      window.clearTimeout(tm);
    };
  }, [ref]);
}

export function Accueil() {
  const ref = useRef<HTMLDivElement>(null);
  useApparitions(ref);
  return (
    <div className="acc" ref={ref}>
      <BarreNav />
      <main id="main">
        <Hero />
        <Produit />
        <Connecteurs />
        <Metiers />
        <Securite />
        <Levee />
        <CtaFin />
      </main>
      <PiedDePage />
    </div>
  );
}
