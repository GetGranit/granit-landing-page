import { Link } from "@tanstack/react-router";
import { GLOSSAIRE_SLUG, categoriesActives, glossaireEnLigne } from "@/lib/ressources/contenu";

const onglet =
  "-mb-px snap-start whitespace-nowrap rounded-[4px] border-b-2 border-transparent py-3 text-[14px] text-[var(--text-soft)] transition-colors hover:text-[var(--text)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--terra)]";
const actifCls = "font-medium text-[var(--text)]";

/**
 * Onglets du guide : de vrais liens vers les pages catégorie (rendus serveur), pas des filtres.
 * Sert d'en-tête au hub (centré) et de sous-navigation sur les pages catégorie et article.
 */
export function Onglets({ actif, centre = false }: { actif: string; centre?: boolean }) {
  const cats = categoriesActives();
  const glossaire = glossaireEnLigne();
  return (
    <nav
      aria-label="Thèmes du guide"
      className={`flex snap-x gap-5 overflow-x-auto border-b border-[var(--border)] [scrollbar-width:none] md:gap-7 ${centre ? "md:justify-center" : ""}`}
    >
      <Link
        to="/ressources"
        className={`${onglet} ${actif === "tout" ? actifCls : ""}`}
        style={actif === "tout" ? { borderColor: "var(--text)" } : undefined}
        aria-current={actif === "tout" ? "page" : undefined}
      >
        Tout le guide
      </Link>
      {cats.map((c) => (
        <Link
          key={c.slug}
          to="/ressources/categorie/$category"
          params={{ category: c.slug }}
          className={`${onglet} ${actif === c.slug ? actifCls : ""}`}
          style={actif === c.slug ? { borderColor: c.ink } : undefined}
          aria-current={actif === c.slug ? "page" : undefined}
        >
          {c.court}
        </Link>
      ))}
      {glossaire && (
        <Link
          to="/ressources/$slug"
          params={{ slug: GLOSSAIRE_SLUG }}
          className={`${onglet} ${actif === "glossaire" ? actifCls : ""}`}
          style={actif === "glossaire" ? { borderColor: "#5e574b" } : undefined}
        >
          Glossaire
        </Link>
      )}
    </nav>
  );
}

/** La rangée d'onglets en sous-navigation (pages catégorie et article), non collante. */
export function SousNav({ actif }: { actif: string }) {
  return (
    <div className="bg-[var(--bg2)]">
      <div className="mx-auto max-w-[1280px] px-4 md:px-6">
        <Onglets actif={actif} />
      </div>
    </div>
  );
}
