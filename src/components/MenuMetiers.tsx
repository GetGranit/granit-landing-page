import { Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { METIERS, PUBLIES, SLUGS_METIERS } from "@/components/agents/metiers";
import type { Lang } from "@/lib/i18n";

const textes = {
  fr: { metiers: "Métiers", tous: "Tous les métiers", bientot: "Bientôt" },
  en: { metiers: "Trades", tous: "All trades", bientot: "Soon" },
};

/**
 * Entrée « Métiers » du menu : les cinq pages métier, seules les pages publiées sont des liens,
 * puis « Tous les métiers » (/agents). S'ouvre au survol et au clic, se ferme avec Échap ou en
 * cliquant ailleurs. Fermé au rendu serveur.
 */
export function MenuMetiers({ lang }: { lang: Lang }) {
  const t = textes[lang];
  const [ouvert, setOuvert] = useState(false);
  const boite = useRef<HTMLDivElement>(null);
  const fermeture = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    if (!ouvert) return;
    const clic = (e: MouseEvent) => {
      if (!boite.current?.contains(e.target as Node)) setOuvert(false);
    };
    const touche = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOuvert(false);
    };
    document.addEventListener("mousedown", clic);
    document.addEventListener("keydown", touche);
    return () => {
      document.removeEventListener("mousedown", clic);
      document.removeEventListener("keydown", touche);
    };
  }, [ouvert]);

  const entrer = () => {
    clearTimeout(fermeture.current);
    setOuvert(true);
  };
  const sortir = () => {
    fermeture.current = setTimeout(() => setOuvert(false), 160);
  };

  return (
    <div ref={boite} className="relative" onMouseEnter={entrer} onMouseLeave={sortir}>
      <button
        type="button"
        aria-expanded={ouvert}
        aria-controls="menu-metiers"
        onClick={() => setOuvert((o) => !o)}
        className="inline-flex items-center gap-1 text-[13.5px] transition-colors"
        style={{ color: ouvert ? "var(--text)" : "var(--text-soft)" }}
      >
        {t.metiers}
        <svg viewBox="0 0 12 12" className="size-3 transition-transform duration-200" style={{ transform: ouvert ? "rotate(180deg)" : "none" }} aria-hidden>
          <path d="M3 4.5l3 3 3-3" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <div
        id="menu-metiers"
        hidden={!ouvert}
        className="absolute top-full left-1/2 w-[300px] -translate-x-1/2 pt-3"
      >
        <ul className="rounded-[14px] border p-2" style={{ background: "var(--papier)", borderColor: "var(--filet)", boxShadow: "var(--ombre-carte)" }}>
          {SLUGS_METIERS.map((slug) => {
            const nom = METIERS[lang][slug].nom;
            return (
              <li key={slug}>
                {PUBLIES.includes(slug) ? (
                  <Link
                    to="/agents/$metier"
                    params={{ metier: slug }}
                    onClick={() => setOuvert(false)}
                    className="block rounded-[10px] px-3 py-2.5 text-[14px] font-medium transition-colors hover:bg-[var(--lavis)]"
                  >
                    {nom}
                  </Link>
                ) : (
                  <span className="flex items-center justify-between gap-3 px-3 py-2.5 text-[14px]" style={{ color: "var(--texte-secondaire)" }}>
                    {nom}
                    <span className="rounded-full px-2 py-0.5 text-[11px]" style={{ background: "var(--lavis)" }}>
                      {t.bientot}
                    </span>
                  </span>
                )}
              </li>
            );
          })}
          <li className="mt-1 border-t pt-1" style={{ borderColor: "var(--filet)" }}>
            <Link
              to="/agents"
              onClick={() => setOuvert(false)}
              className="block rounded-[10px] px-3 py-2.5 text-[14px] font-medium transition-colors hover:bg-[var(--lavis)]"
              style={{ color: "var(--profond)" }}
            >
              {t.tous} →
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
