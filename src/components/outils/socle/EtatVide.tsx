import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { CONTACT_OUTILS } from "@/lib/outils/socle/reglages";

import type { SuggestionVide } from "@/lib/outils/socle/recherche";

export type { SuggestionVide };

/**
 * Ce que montre le hub quand la recherche ne trouve rien : la requête, le message propre à l'outil
 * (cadre.md), jusqu'à 3 suggestions, puis « Effacer la recherche ». Jamais de formulaire ; un lien
 * mailto « Signaler … » est permis (`signaler`).
 */
export function EtatVide({
  q,
  message,
  suggestions = [],
  conseils,
  liens = [],
  signaler,
  onEffacer,
}: {
  q: string;
  message: ReactNode;
  suggestions?: SuggestionVide[];
  conseils?: ReactNode;
  liens?: { nom: string; chemin: string }[];
  /** Lien mailto : texte du lien et objet du mail (« Code rejet manquant »). */
  signaler?: { texte: string; sujet: string };
  onEffacer: () => void;
}) {
  const requete = q.trim();
  return (
    <div
      role="status"
      className="mt-4 rounded-[14px] bg-papier p-5 text-[15px] md:p-6"
      style={{ border: "1px solid var(--filet)", lineHeight: 1.55 }}
    >
      <p className="break-words text-[16px]" style={{ fontWeight: 500 }}>
        {requete
          ? `Aucun résultat pour «\u00a0${requete}\u00a0»`
          : "Aucun résultat avec ces filtres"}
      </p>
      <div className="mt-2 break-words">{message}</div>
      {suggestions.length > 0 && (
        <div className="mt-4">
          <p className="text-[14px]" style={{ color: "var(--texte-secondaire)" }}>
            Vous cherchiez peut-être&nbsp;:
          </p>
          <ul className="mt-2 space-y-1">
            {suggestions.slice(0, 3).map((s) => (
              <li key={s.chemin ?? s.ancre ?? s.titre}>
                {s.chemin ? (
                  <Link
                    to={s.chemin}
                    className="inline-flex min-h-[44px] items-center gap-2 underline underline-offset-2 hover:no-underline"
                    style={{ color: "var(--profond)" }}
                  >
                    {s.code && <span className="num-tabular">{s.code}</span>}
                    <span className="break-words">{s.titre}</span>
                  </Link>
                ) : (
                  <a
                    href={`#${s.ancre}`}
                    onClick={onEffacer}
                    className="inline-flex min-h-[44px] items-center gap-2 underline underline-offset-2 hover:no-underline"
                    style={{ color: "var(--profond)" }}
                  >
                    {s.code && <span className="num-tabular">{s.code}</span>}
                    <span className="break-words">{s.titre}</span>
                  </a>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
      {conseils && <div className="mt-4">{conseils}</div>}
      {liens.length > 0 && (
        <ul className="mt-3 space-y-1">
          {liens.map((l) => (
            <li key={l.chemin}>
              <Link
                to={l.chemin}
                className="inline-flex min-h-[44px] items-center underline underline-offset-2 hover:no-underline"
                style={{ color: "var(--profond)" }}
              >
                {l.nom}
              </Link>
            </li>
          ))}
        </ul>
      )}
      <div className="mt-4 flex flex-col gap-2 md:flex-row md:items-center md:gap-6">
        <button type="button" onClick={onEffacer} className="btn-secondaire justify-center">
          Effacer la recherche
        </button>
        {signaler && (
          <a
            href={`mailto:${CONTACT_OUTILS}?subject=${encodeURIComponent(signaler.sujet)}`}
            className="inline-flex min-h-[44px] items-center text-[14px] underline underline-offset-2 hover:no-underline"
            style={{ color: "var(--profond)" }}
          >
            {signaler.texte}
          </a>
        )}
      </div>
    </div>
  );
}
