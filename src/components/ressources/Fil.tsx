import { Link } from "@tanstack/react-router";

type Item = { nom: string; to?: string; params?: Record<string, string> };

/** Fil d'Ariane visible : Accueil › … ; tous cliquables sauf le dernier. */
export function Fil({ items }: { items: Item[] }) {
  const tous: Item[] = [{ nom: "Accueil", to: "/" }, ...items];
  return (
    <nav aria-label="Fil d'Ariane">
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[14px] text-[var(--text-muted)]">
        {tous.map((it, i) => (
          <li key={i} className="flex items-center gap-2">
            {i > 0 && <span aria-hidden>›</span>}
            {it.to && i < tous.length - 1 ? (
              <Link
                to={it.to}
                params={it.params as never}
                className="hover:text-[var(--text)] hover:underline"
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
