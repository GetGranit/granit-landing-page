import { useState } from "react";
import { Link } from "@tanstack/react-router";

// Une corvée par métier : chacun s'y reconnaît, puis la voit barrée (soulagement anticipé).
const CORVEES = [
  "saisir les prises en charge",
  "relancer les mutuelles",
  "pointer les virements",
  "recopier les ordonnances",
  "tenir l'agenda à jour",
];

/** Encart démo final du hub, des pages catégorie et métier : une phrase, un bouton. */
export function BandeDemo() {
  // La corvée suivante arrive à la fin de l'animation CSS : trait et texte restent synchrones,
  // et sans animation (prefers-reduced-motion) la première reste affichée, barrée.
  const [i, setI] = useState(0);

  return (
    <section className="mx-auto mb-20 mt-14 max-w-[1280px] px-4 md:px-6">
      <div className="bande-demo relative overflow-hidden rounded-[22px] bg-[#1c1108] px-6 py-12 text-center text-[#f6efe4] md:py-16">
        <p className="font-mono text-[12px] uppercase tracking-[0.14em] text-[#f2a48f]">
          Avec les agents Granit, vous arrêtez de
        </p>
        <h2 className="mt-4 font-serif text-[clamp(30px,4.4vw,54px)] font-normal leading-[1.1]">
          <span className="sr-only">{CORVEES.join(", ")}.</span>
          <span aria-hidden className="corvee-cadre">
            <span
              key={i}
              className="corvee"
              onAnimationEnd={(e) => {
                if (e.animationName === "corvee-vie") setI((n) => (n + 1) % CORVEES.length);
              }}
            >
              {CORVEES[i]}
            </span>
          </span>
        </h2>
        <div className="mt-9 flex flex-col items-center gap-3">
          <Link to="/demo" className="btn-primary btn-demo text-[16px]">
            Je veux voir ça <span className="arrow">→</span>
          </Link>
          <span className="text-[13px] text-[#a99d8c]">Démo personnalisée · sans engagement</span>
        </div>
      </div>
    </section>
  );
}
