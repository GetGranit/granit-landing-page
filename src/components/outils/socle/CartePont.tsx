import { useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { cibleMetier, lienDemoOutil } from "@/lib/outils/socle/pont";
import { EVENEMENTS, useVuUneFois, type Suivre } from "@/lib/outils/socle/suivi";
import type { MetierOutil, OutilId } from "@/lib/outils/socle/types";
import { ScenePont } from "./ScenePont";

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
  "codes-rejet": ["Un rejet, c'est une facture qui attend.", "Nos agents la débloquent."],
  remboursement: ["Ces montants, vos équipes les ressaisissent.", "Nos agents s'en chargent."],
  "mutuelle-portail": ["Le bon portail, puis la saisie.", "Nos agents s'en chargent."],
};
const ACCROCHE_DEFAUT: [string, string] = ["Vos équipes soignent.", "Granit gère le reste."];

/**
 * La seule place de Granit sur une page d'outil : le dernier bloc, après la réponse, les voisins et
 * les articles. Bloc sombre, jamais collant, sans formulaire. Leviers assumés, sans rien d'inventé :
 * - la question ouverte (« Vous avez votre réponse. Et la suite ? ») qui appelle l'étape suivante ;
 * - l'aversion à la perte dans l'accroche (le coût de ne rien faire : une facture qui attend) ;
 * - la preuve concrète : une scène animée où un agent fait la tâche que l'outil vient d'expliquer ;
 * - l'effort minimal et le risque levé sous le bouton (15 minutes, sans engagement) ;
 * - l'autorité : les garanties (HDS, Europe, RGPD) près du bouton (TON.md).
 * Pas de fausse urgence ni de faux chiffres. Le lien de démo porte utm_medium=lead-magnet (pont.ts).
 */
export function CartePont({ outil, page, slug, texte, metiers, suivre }: CartePontProps) {
  const ref = useRef<HTMLElement | null>(null);
  const reduit = useReducedMotion();
  useVuUneFois(ref, () => suivre(EVENEMENTS.pontVu, { page }));
  const [accroche, accent] = ACCROCHES[outil] ?? ACCROCHE_DEFAUT;
  return (
    <motion.section
      ref={ref}
      aria-labelledby="pont-granit"
      className="section-sombre mt-14 grid gap-8 rounded-[14px] p-6 md:grid-cols-[1.25fr_1fr] md:items-center md:p-9 [&_p]:text-left"
      style={{ boxShadow: "var(--ombre-carte)" }}
      initial={reduit ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <div>
        <p className="eyebrow">Vous avez votre réponse. Et la suite ?</p>
        <h2
          id="pont-granit"
          className="mt-3 font-serif text-balance"
          style={{
            fontSize: "clamp(22px, 2.3vw, 29px)",
            lineHeight: 1.12,
            letterSpacing: "-0.02em",
            fontWeight: 300,
          }}
        >
          {accroche} <span className="accent-italic">{accent}</span>
        </h2>
        <p
          className="mt-4 max-w-[56ch] text-[16px]"
          style={{ lineHeight: 1.55, color: "var(--sur-encre-secondaire)" }}
        >
          {texte}
        </p>
        <div className="mt-6 flex flex-col gap-3 md:flex-row md:items-center md:gap-6">
          <motion.a
            href={lienDemoOutil(outil, page, slug)}
            target="_blank"
            rel="noopener"
            className="btn-clair group w-full justify-center md:w-auto"
            onClick={() => suivre(EVENEMENTS.pontClic, { cible: "demo" })}
            initial={reduit ? false : { scale: 1 }}
            whileInView={reduit ? undefined : { scale: [1, 1.04, 1] }}
            viewport={{ once: true, amount: 0.8 }}
            transition={{ delay: 0.9, duration: 0.6 }}
          >
            Demander une démo
            <motion.span
              aria-hidden
              className="ml-1 inline-block"
              animate={reduit ? undefined : { x: [0, 4, 0] }}
              transition={{ duration: 1.2, repeat: Infinity, repeatDelay: 2.4, ease: "easeInOut" }}
            >
              →
            </motion.span>
          </motion.a>
          <Link
            to={cibleMetier(metiers)}
            className="inline-flex min-h-[44px] items-center justify-center text-[15px] underline underline-offset-4 hover:no-underline md:justify-start"
            style={{ fontWeight: 500 }}
            onClick={() => suivre(EVENEMENTS.pontClic, { cible: "metier" })}
          >
            Voir ce que font les agents
          </Link>
        </div>
        <p className="mt-3 text-[13px]" style={{ color: "var(--sur-encre-secondaire)" }}>
          15 minutes avec Paul, sur votre cas, sans engagement.
        </p>
        <p className="mt-1 text-[12px]" style={{ color: "var(--sur-encre-secondaire)" }}>
          Infrastructure certifiée HDS · Données en Europe · RGPD
        </p>
      </div>
      <ScenePont outil={outil} />
    </motion.section>
  );
}
