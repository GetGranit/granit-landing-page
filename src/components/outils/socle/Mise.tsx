// Mise en page commune des outils référentiels : conteneur, colonne de lecture, titres de section.
// Jetons de DESIGN.md seulement ; gouttière de 16 px (px-4) à 375 px.
import type { ReactNode } from "react";

/** Largeur du site (1120 px), gouttière de 16 px à 375 px. */
export function Conteneur({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={`mx-auto max-w-[1120px] px-4 md:px-8 ${className}`}>{children}</div>;
}

/** Colonne de lecture d'une entrée : 65 caractères au plus. */
export function Colonne({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`max-w-[680px] ${className}`}>{children}</div>;
}

/** Titre de section (h2) : Source Serif 4 400, 22 à 30 px (« sous-titre » de DESIGN.md). */
export function TitreSection({ id, children }: { id?: string; children: ReactNode }) {
  return (
    <h2
      id={id}
      className="font-serif text-balance"
      style={{
        fontSize: "clamp(22px, 2.4vw, 30px)",
        lineHeight: 1.12,
        letterSpacing: "-0.02em",
        fontWeight: 400,
      }}
    >
      {children}
    </h2>
  );
}

/**
 * Une section d'outil : son h2 et son contenu, espacés comme les autres blocs.
 * Les sections propres à un outil (« Causes probables », « Portail par métier »…) passent par ici.
 */
export function SectionOutil({
  id,
  titre,
  children,
  className = "",
}: {
  id: string;
  titre: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section aria-labelledby={id} className={`mt-12 ${className}`}>
      <TitreSection id={id}>{titre}</TitreSection>
      <div className="mt-4 text-[16px]" style={{ lineHeight: 1.55 }}>
        {children}
      </div>
    </section>
  );
}

/** Carte papier, filet encre à 12 %, rayon 14 px. */
export function CartePapier({
  children,
  className = "",
  as: Balise = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "section" | "aside";
}) {
  return (
    <Balise
      className={`rounded-[14px] bg-papier ${className}`}
      style={{ border: "1px solid var(--filet)" }}
    >
      {children}
    </Balise>
  );
}
