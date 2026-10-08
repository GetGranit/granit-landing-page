import { useEffect, useRef, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import {
  GLOSSAIRE_SLUG,
  categorie,
  categoriesActives,
  glossaireEnLigne,
} from "@/lib/ressources/contenu";
import { VERTICALES } from "@/lib/ressources/verticales";
import type { VerticaleSlug } from "@/lib/ressources/types";

const onglet =
  "relative -mb-px snap-start whitespace-nowrap rounded-[4px] py-3 text-[14px] text-[var(--text-soft)] transition-colors duration-150 hover:text-[var(--text)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--terra)]";

/** Soulignement de l'onglet actif : un seul élément nommé, qui glisse d'une page à l'autre. */
function Souligne({ couleur }: { couleur: string }) {
  return (
    <span
      aria-hidden
      className="absolute inset-x-0 bottom-0 h-[2px]"
      style={{ background: couleur, viewTransitionName: "onglet-souligne" }}
    />
  );
}

function Onglet({
  actif,
  couleur,
  children,
  ...lien
}: {
  actif: boolean;
  couleur: string;
  children: ReactNode;
  to: string;
  params?: Record<string, string>;
}) {
  return (
    <Link
      to={lien.to}
      params={lien.params as never}
      viewTransition
      data-actif={actif ? "" : undefined}
      aria-current={actif ? "page" : undefined}
      className={`${onglet} ${actif ? "font-medium text-[var(--text)]" : ""}`}
    >
      {children}
      {actif && <Souligne couleur={couleur} />}
    </Link>
  );
}

/** Rangée d'onglets défilante ; l'onglet actif est ramené dans la vue sur mobile. */
function Rangee({
  actif,
  label,
  centre = false,
  children,
}: {
  actif: string;
  label: string;
  centre?: boolean;
  children: ReactNode;
}) {
  const nav = useRef<HTMLElement>(null);
  useEffect(() => {
    if (actif === "tout") return;
    nav.current
      ?.querySelector("[data-actif]")
      ?.scrollIntoView({ inline: "center", block: "nearest", behavior: "auto" });
  }, [actif]);
  return (
    <nav
      ref={nav}
      aria-label={label}
      className={`flex snap-x scroll-px-4 gap-5 overflow-x-auto border-b border-[var(--border)] [scrollbar-width:none] max-md:[mask-image:linear-gradient(to_right,black_82%,transparent)] md:gap-7 ${centre ? "md:justify-center" : ""}`}
    >
      {children}
    </nav>
  );
}

/**
 * Onglets des thèmes : de vrais liens vers les pages catégorie (rendus serveur), pas des filtres.
 * Section « Par thème » du hub.
 */
export function Onglets({ actif, centre = false }: { actif: string; centre?: boolean }) {
  const cats = categoriesActives();
  const glossaire = glossaireEnLigne();
  return (
    <Rangee actif={actif} label="Thèmes du guide" centre={centre}>
      <Onglet to="/ressources" actif={actif === "tout"} couleur="var(--text)">
        Tout le guide
      </Onglet>
      {cats.map((c) => (
        <Onglet
          key={c.slug}
          to="/ressources/categorie/$category"
          params={{ category: c.slug }}
          actif={actif === c.slug}
          couleur={c.ink}
        >
          {c.court}
        </Onglet>
      ))}
      {glossaire && (
        <Onglet
          to="/ressources/$slug"
          params={{ slug: GLOSSAIRE_SLUG }}
          actif={actif === "glossaire"}
          couleur="#5e574b"
        >
          Glossaire
        </Onglet>
      )}
    </Rangee>
  );
}

/** Onglets des métiers, dans l'ordre de verticales.json : la structure du guide. */
function OngletsMetiers({ actif }: { actif: VerticaleSlug | "tout" }) {
  return (
    <Rangee actif={actif} label="Métiers du guide">
      <Onglet to="/ressources" actif={actif === "tout"} couleur="var(--text)">
        Tout le guide
      </Onglet>
      {VERTICALES.map((v) => (
        <Onglet
          key={v.slug}
          to="/ressources/metier/$verticale"
          params={{ verticale: v.slug }}
          actif={actif === v.slug}
          couleur={categorie(v.teinte)!.ink}
        >
          {v.court}
        </Onglet>
      ))}
    </Rangee>
  );
}

/** Sous-navigation par métier (pages métier, catégorie et article), non collante. */
export function SousNav({ actif }: { actif: VerticaleSlug | "tout" }) {
  return (
    <div className="bg-[var(--bg2)]">
      <div className="mx-auto max-w-[1280px] px-4 md:px-6">
        <OngletsMetiers actif={actif} />
      </div>
    </div>
  );
}
