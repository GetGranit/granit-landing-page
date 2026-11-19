import { useEffect } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { usePostHog } from "posthog-js/react";
import { JsonLd } from "@/components/JsonLd";
import { SiteLayout } from "@/components/SiteLayout";
import { Conteneur, FilOutil, PastillesMetier } from "@/components/outils/socle";
import { ACCUEIL_OUTILS } from "@/lib/outils/socle/accueil.mjs";
import { outilsDisponibles } from "@/lib/outils/socle/outils";
import { collectionPageLd, headOutil } from "@/lib/outils/socle/seo";

/**
 * /outils : une carte par outil référentiel fusionné (src/lib/outils/<id>/outil.mjs), dans l'ordre de
 * OUTIL.ordre. Les deux outils de campagne (tri-des-marques, heures-de-decembre) n'y sont pas.
 * Page de navigation : pas de carte Granit. Sans outil, la page n'existe pas (404, comme avant le
 * socle : même page introuvable, même head).
 */
export const Route = createFileRoute("/outils/")({
  loader: () => {
    if (!outilsDisponibles().length) throw notFound();
    return null;
  },
  head: () =>
    outilsDisponibles().length
      ? headOutil({ titre: ACCUEIL_OUTILS.titre, description: ACCUEIL_OUTILS.description })
      : {},
  component: PageOutils,
});

function PageOutils() {
  const outils = outilsDisponibles();
  // La page de tous les outils n'est celle d'aucun : `outil` vaut « outils ».
  const posthog = usePostHog();
  const suivre = (evenement: string, proprietes: Record<string, unknown> = {}) =>
    posthog?.capture(evenement, { outil: "outils", page: "index", ...proprietes });
  useEffect(() => {
    posthog?.capture("lm_page_vue", { outil: "outils", page: "index" });
  }, [posthog]);
  return (
    <SiteLayout>
      <JsonLd
        data={[
          collectionPageLd({
            chemin: ACCUEIL_OUTILS.chemin,
            titre: ACCUEIL_OUTILS.titre,
            description: ACCUEIL_OUTILS.description,
          }),
        ]}
      />
      <Conteneur className="pt-6 pb-16 md:pt-8">
        <FilOutil items={[]} />
        <h1
          className="mt-6 max-w-[1000px] font-serif text-balance"
          style={{
            fontSize: "clamp(30px, 3.6vw, 44px)",
            lineHeight: 1.08,
            letterSpacing: "-0.025em",
            fontWeight: 300,
          }}
        >
          {ACCUEIL_OUTILS.h1}
        </h1>
        <p className="mt-4 max-w-[60ch] text-[17px]" style={{ lineHeight: 1.55 }}>
          {ACCUEIL_OUTILS.description}
        </p>
        <ul className="mt-10 grid gap-4 md:grid-cols-2">
          {outils.map((o) => (
            <li
              key={o.id}
              className="card-hover relative flex min-w-0 flex-col rounded-[14px] bg-papier p-5 md:p-6"
              style={{ border: "1px solid var(--filet)" }}
            >
              <p className="eyebrow">{o.nom}</p>
              <h2
                className="mt-2 font-serif text-balance"
                style={{
                  fontSize: "clamp(22px, 2.4vw, 30px)",
                  lineHeight: 1.12,
                  letterSpacing: "-0.02em",
                  fontWeight: 400,
                }}
              >
                {/* Le lien couvre toute la carte (after:inset-0). */}
                <Link
                  to={o.chemin}
                  className="after:absolute after:inset-0 after:rounded-[14px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--profond)]"
                  onClick={() =>
                    suivre("lm_voisin_clic", { de: "outils", vers: o.chemin, bloc: "autre-outil" })
                  }
                >
                  {o.titreCarte}
                </Link>
              </h2>
              <p
                className="mt-3 text-[15px]"
                style={{ lineHeight: 1.55, color: "var(--texte-secondaire)" }}
              >
                {o.description}
              </p>
              <PastillesMetier metiers={o.metiers} className="mt-4" />
              <p
                aria-hidden
                className="mt-5 text-[15px]"
                style={{ color: "var(--profond)", fontWeight: 500 }}
              >
                Ouvrir l’outil ›
              </p>
            </li>
          ))}
        </ul>
      </Conteneur>
    </SiteLayout>
  );
}
