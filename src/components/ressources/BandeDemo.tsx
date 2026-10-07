import { Link } from "@tanstack/react-router";

const ETAPES = [
  "Carte + ordonnance postées dans Slack",
  "Plateforme reconnue, données extraites",
  "Demande déposée sur le portail",
  "Réponse dans le fil : ✓ accordée",
];

/** Bande démo sombre du hub et des pages catégorie. Pas de promesse de délai ici. */
export function BandeDemo({
  titre = "Vos prises en charge, déposées pendant que vous vendez.",
}: {
  titre?: string;
}) {
  return (
    <section className="mx-auto mb-20 mt-16 max-w-[1280px] px-4 md:px-6">
      <div className="grid items-center gap-7 rounded-[22px] bg-[#1c1108] p-7 text-[#f6efe4] md:p-10 lg:grid-cols-[1.4fr_1fr]">
        <div>
          <span className="eyebrow" style={{ color: "#f2a48f" }}>
            L'agent Demande de PEC
          </span>
          <h2 className="mt-3 font-serif text-[clamp(28px,3.4vw,42px)] font-normal leading-[1.1]">
            {titre}
          </h2>
          <p className="mt-3 max-w-[52ch] text-[#c9bfb0]">
            Le magasin poste la carte de tiers payant et l'ordonnance dans Slack. L'agent reconnaît la
            plateforme, remplit le portail et répond dans le fil : accordée, refusée ou en attente.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/demo" className="btn-primary">
              Demander une démo
            </Link>
            <Link
              to="/agents"
              className="inline-flex items-center rounded-full border border-white/25 px-5 py-2.5 text-[15px] font-semibold text-[#f6efe4] transition-colors hover:border-white/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--terra)]"
            >
              Voir l'agent
            </Link>
          </div>
        </div>
        <ol aria-label="Étapes de l'agent" className="flex flex-col gap-2 text-[15px]">
          {ETAPES.map((e, i) => (
            <li
              key={e}
              className="flex items-center gap-2.5 rounded-[10px] border border-white/10 bg-white/[0.06] px-3.5 py-2.5"
            >
              <span className="font-mono text-[12px] text-[#f2a48f]">0{i + 1}</span>
              {e}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
