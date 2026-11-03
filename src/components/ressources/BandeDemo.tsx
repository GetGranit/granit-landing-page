import { useState } from "react";
import { calcomDemoUrl } from "@/lib/calcom";
import { useLanguage } from "@/lib/i18n";

// Une corvée par métier : chacun s'y reconnaît, puis la voit barrée (soulagement anticipé).
const copy = {
  fr: {
    avant: "Avec les agents Granit, vous arrêtez de",
    corvees: [
      "saisir les prises en charge",
      "relancer les mutuelles",
      "pointer les virements",
      "recopier les ordonnances",
      "tenir l'agenda à jour",
    ],
    bouton: "Je veux voir ça",
    rassure: "Démo personnalisée · sans engagement",
  },
  en: {
    avant: "With Granit agents, you stop",
    corvees: [
      "entering coverage requests",
      "following up with insurers",
      "reconciling bank transfers",
      "retyping prescriptions",
      "keeping the schedule up to date",
    ],
    bouton: "Show me",
    rassure: "Personalized demo · no commitment",
  },
};

/** Encart démo final du hub, des pages catégorie et métier : une phrase, un bouton. */
export function BandeDemo() {
  // La corvée suivante arrive à la fin de l'animation CSS : trait et texte restent synchrones,
  // et sans animation (prefers-reduced-motion) la première reste affichée, barrée.
  const [i, setI] = useState(0);
  const t = copy[useLanguage().lang];
  const CORVEES = t.corvees;

  return (
    <section className="mx-auto mb-20 mt-14 max-w-[1280px] px-4 md:px-6">
      <div className="bande-demo section-sombre relative overflow-hidden rounded-[22px] px-6 py-12 text-center md:py-16">
        <p className="eyebrow">
          {t.avant}
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
          <a
            href={calcomDemoUrl("bande-demo")}
            target="_blank"
            rel="noopener"
            className="btn-clair btn-demo text-[16px]"
          >
            {t.bouton} <span className="arrow">→</span>
          </a>
          <span className="text-[13px] text-sur-encre-secondaire">{t.rassure}</span>
        </div>
      </div>
    </section>
  );
}
