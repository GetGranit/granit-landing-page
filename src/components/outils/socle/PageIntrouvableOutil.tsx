import { useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { useSuiviOutil } from "@/components/outils/OutilShared";
import type { MetierOutil, OutilDescripteur } from "@/lib/outils/socle/types";
import { CartePont } from "./CartePont";
import { FilOutil } from "./FilOutil";
import { Conteneur } from "./Mise";
import { RechercheOutil, type RechercheOutilProps } from "./RechercheOutil";

/**
 * La page d'une adresse /outils/<id>/<slug> qui n'a jamais existé : statut 404 (notFound() dans le
 * loader), noindex, fil d'Ariane jusqu'au hub, le message de l'outil, la recherche préremplie (son
 * formulaire envoie vers le hub), un lien vers le hub et la carte Granit. Aucune redirection
 * automatique : un 404 franc.
 *
 * Usage : `notFoundComponent: () => <PageIntrouvableOutil outil={OUTIL} slug={…} … />` dans la route
 * de l'entrée, et `head` qui renvoie headIntrouvable(slug, OUTIL.nom) quand il n'y a pas de loaderData.
 */
export function PageIntrouvableOutil({
  outil,
  slug,
  message,
  q,
  recherche,
  textePont,
  metiers,
}: {
  outil: OutilDescripteur;
  slug: string;
  message: ReactNode;
  /** Tiré du slug (cadre.md) : `noemie-0999999` → « 0999999 ». */
  q: string;
  /** Libellé, placeholder, aide et unité de la recherche du hub. */
  recherche: Pick<RechercheOutilProps, "libelle" | "placeholder" | "aide" | "unite" | "inputMode">;
  /** La phrase de la carte Granit de l'outil. */
  textePont: string;
  metiers?: MetierOutil[];
}) {
  const { suivre } = useSuiviOutil(outil.id, { page: "introuvable", entree: slug });
  const [requete, setRequete] = useState(q);
  return (
    <SiteLayout>
      {/* React place cette balise dans le <head> : la page n'est jamais indexée. */}
      <meta name="robots" content="noindex" />
      <Conteneur className="pt-6 pb-16 md:pt-8">
        <FilOutil items={[{ nom: outil.nom, chemin: outil.chemin }, { nom: slug }]} />
        <h1
          className="mt-6 max-w-[24ch] break-words font-serif text-balance"
          style={{
            fontSize: "clamp(28px, 3.6vw, 44px)",
            lineHeight: 1.08,
            letterSpacing: "-0.025em",
            fontWeight: 300,
          }}
        >
          {`${slug}\u00a0: introuvable`}
        </h1>
        <div className="mt-4 max-w-[680px] text-[17px]" style={{ lineHeight: 1.55 }}>
          {message}
        </div>
        <div className="mt-8 max-w-[680px]">
          <RechercheOutil action={outil.chemin} q={requete} onChange={setRequete} {...recherche} />
        </div>
        <p className="mt-6">
          <Link
            to={outil.chemin}
            className="inline-flex min-h-[44px] items-center text-[15px] underline underline-offset-2 hover:no-underline"
            style={{ color: "var(--profond)", fontWeight: 500 }}
          >
            Voir toute la liste · {outil.nom}
          </Link>
        </p>
        <CartePont
          outil={outil.id}
          page="introuvable"
          texte={textePont}
          metiers={metiers}
          suivre={suivre}
        />
      </Conteneur>
    </SiteLayout>
  );
}
