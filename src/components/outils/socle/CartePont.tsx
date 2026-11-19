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

/** Accroche propre à chaque outil : le problème que l'outil vient de montrer, puis ce que Granit en fait. */
const ACCROCHES: Record<string, [string, string]> = {
  "codes-rejet": ["Un rejet à décoder, c'est une facture qui attend.", "Les agents Granit les traitent pour vous."],
  remboursement: ["Ces montants, vos équipes les ressaisissent chaque jour.", "Les agents Granit s'en chargent."],
  "mutuelle-portail": ["Le bon portail, puis la bonne saisie.", "Les agents Granit s'y connectent pour vous."],
};
const ACCROCHE_DEFAUT: [string, string] = ["Vos équipes soignent.", "Granit gère le reste."];

/**
 * La seule place de Granit sur une page d'outil : le dernier bloc, après la réponse, les voisins et
 * les articles. Bloc sombre pour qu'on le voie, jamais collant, sans formulaire ni animation.
 * Le lien de démo porte utm_medium=lead-magnet (voir pont.ts).
 */
export function CartePont({ outil, page, slug, texte, metiers, suivre }: CartePontProps) {
  const ref = useRef<HTMLElement | null>(null);
  useVuUneFois(ref, () => suivre(EVENEMENTS.pontVu, { page }));
  const [accroche, accent] = ACCROCHES[outil] ?? ACCROCHE_DEFAUT;
  return (
    <section
      ref={ref}
      aria-labelledby="pont-granit"
      className="section-sombre mt-14 rounded-[14px] p-6 md:p-9 [&_p]:text-left"
      style={{ boxShadow: "var(--ombre-carte)" }}
    >
      <p className="eyebrow">Ce que Granit fait à votre place</p>
      <h2
        id="pont-granit"
        className="mt-3 max-w-[40ch] font-serif text-balance"
        style={{
          fontSize: "clamp(24px, 3vw, 34px)",
          lineHeight: 1.12,
          letterSpacing: "-0.02em",
          fontWeight: 300,
        }}
      >
        {accroche} <span className="accent-italic">{accent}</span>
      </h2>
      <p
        className="mt-4 max-w-[60ch] text-[16px]"
        style={{ lineHeight: 1.55, color: "var(--sur-encre-secondaire)" }}
      >
        {texte}
      </p>
      <div className="mt-6 flex flex-col gap-3 md:flex-row md:items-center md:gap-6">
        <a
          href={lienDemoOutil(outil, page, slug)}
          target="_blank"
          rel="noopener"
          className="btn-clair w-full justify-center md:w-auto"
          onClick={() => suivre(EVENEMENTS.pontClic, { cible: "demo" })}
        >
          Demander une démo
        </a>
        <Link
          to={cibleMetier(metiers)}
          className="inline-flex min-h-[44px] items-center justify-center text-[15px] underline underline-offset-4 hover:no-underline md:justify-start"
          style={{ fontWeight: 500 }}
          onClick={() => suivre(EVENEMENTS.pontClic, { cible: "metier" })}
        >
          Voir ce que font les agents
        </Link>
      </div>
      <p className="mt-4 text-[13px]" style={{ color: "var(--sur-encre-secondaire)" }}>
        15 minutes avec Paul, sur votre cas · Infrastructure certifiée HDS · Données en Europe · RGPD
      </p>
    </section>
  );
}
