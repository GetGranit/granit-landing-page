import { Link } from "@tanstack/react-router";
import type { Verticale } from "@/lib/ressources/verticales";

type Item = { nom: string; to?: string; params?: Record<string, string> };

/** Le niveau métier du fil d'Ariane (lien vers /ressources/metier/{v}). */
export const itemMetier = (v: Verticale): Item => ({
  nom: v.nom,
  to: "/ressources/metier/$verticale",
  params: { verticale: v.slug },
});

/** Fil d'Ariane visible : Accueil › … ; tous cliquables sauf le dernier. */
export function Fil({ items }: { items: Item[] }) {
  const tous: Item[] = [{ nom: "Accueil", to: "/" }, ...items];
  // Mobile : seulement un retour vers le dernier niveau cliquable.
  const retour = [...tous].reverse().find((it, i) => it.to && i > 0);
  return (
    <nav aria-label="Fil d'Ariane">
      {retour && (
        <Link
          to={retour.to}
          params={retour.params as never}
          className="rounded-[4px] text-[14px] text-[var(--text-muted)] hover:text-[var(--text)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--terra)] md:hidden"
        >
          ‹ {retour.nom}
        </Link>
      )}
      <ol className="hidden md:flex flex-wrap items-center gap-x-2 gap-y-1 text-[14px] text-[var(--text-muted)]">
        {tous.map((it, i) => (
          <li key={i} className="flex items-center gap-2">
            {i > 0 && <span aria-hidden>›</span>}
            {it.to && i < tous.length - 1 ? (
              <Link
                to={it.to}
                params={it.params as never}
                className="rounded-[4px] hover:text-[var(--text)] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--terra)]"
              >
                {it.nom}
              </Link>
            ) : (
              <span aria-current={i === tous.length - 1 ? "page" : undefined}>{it.nom}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
