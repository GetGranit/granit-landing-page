import { useRef } from "react";
import { Link } from "@tanstack/react-router";
import { cibleMetier, lienDemoOutil } from "@/lib/outils/socle/pont";
import { EVENEMENTS, useVuUneFois, type Suivre } from "@/lib/outils/socle/suivi";
import type { MetierOutil, OutilId } from "@/lib/outils/socle/types";

export type CartePontProps = {
  outil: OutilId;
  /** utm_content du lien de démo : outil-hub, outil-entree ou outil-introuvable. */
  page: "hub" | "entree" | "introuvable";
  /** Slug de l'entrée (utm_term du lien de démo). */
  slug?: string;
  /** La phrase de l'outil (cadre.md), formulations de TON.md. */
  texte: string;
  /** Un seul métier → la page de ce métier ; sinon /metiers. */
  metiers?: MetierOutil[];
  suivre: Suivre;
};

/**
 * La seule place de Granit sur une page d'outil : le dernier bloc, après la réponse, les voisins et
 * les articles. Jamais collante, sans formulaire ni animation.
 */
export function CartePont({ outil, page, slug, texte, metiers, suivre }: CartePontProps) {
  const ref = useRef<HTMLElement | null>(null);
  useVuUneFois(ref, () => suivre(EVENEMENTS.pontVu, { page }));
  return (
    <section
      ref={ref}
      aria-labelledby="pont-granit"
      className="mt-14 rounded-[14px] bg-papier p-5 md:p-6"
      style={{ border: "1px solid var(--filet)" }}
    >
      <h2
        id="pont-granit"
        className="font-serif text-balance"
        style={{ fontSize: 22, lineHeight: 1.2, letterSpacing: "-0.02em", fontWeight: 400 }}
      >
        Vos équipes soignent. <span className="accent-italic">Granit gère le reste.</span>
      </h2>
      <p
        className="mt-3 max-w-[60ch] text-[15px]"
        style={{ lineHeight: 1.55, color: "var(--texte-secondaire)" }}
      >
        {texte}
      </p>
      <div className="mt-5 flex flex-col gap-3 md:flex-row md:items-center md:gap-6">
        <Link
          to={cibleMetier(metiers)}
          className="btn-secondaire w-full justify-center md:w-auto"
          onClick={() => suivre(EVENEMENTS.pontClic, { cible: "metier" })}
        >
          Voir ce que font les agents
        </Link>
        <a
          href={lienDemoOutil(outil, page, slug)}
          target="_blank"
          rel="noopener"
          className="inline-flex min-h-[44px] items-center justify-center text-[15px] underline underline-offset-4 hover:no-underline md:justify-start"
          style={{ color: "var(--profond)", fontWeight: 500 }}
          onClick={() => suivre(EVENEMENTS.pontClic, { cible: "demo" })}
        >
          Demander une démo
        </a>
      </div>
    </section>
  );
}
