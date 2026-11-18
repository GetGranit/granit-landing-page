import type { ComponentProps, ReactNode } from "react";
import { JsonLd } from "@/components/JsonLd";
import { SiteLayout } from "@/components/SiteLayout";
import { EnTeteOutil } from "@/components/outils/OutilShared";
import { SURTITRE_HUB } from "@/lib/outils/socle/reglages";
import { collectionPageLd } from "@/lib/outils/socle/seo";
import type { Suivre } from "@/lib/outils/socle/suivi";
import type { MetierOutil, OutilDescripteur } from "@/lib/outils/socle/types";
import { ArticlesLies, type LienOutilProps } from "./ArticlesLies";
import { BlocSources } from "./BlocSources";
import { CartePont } from "./CartePont";
import { FaqOutil, type QuestionOutil } from "./FaqOutil";
import { FilOutil } from "./FilOutil";
import { Colonne, Conteneur } from "./Mise";

/**
 * La page d'un hub, dans l'ordre fixe du socle : fil d'Ariane ; en-tête compact avec la recherche
 * et les filtres ; ce qui précède la liste (B : bandeau 2027, C : changements récents) ; la liste
 * (ListeHub, qui porte le sommaire et l'état vide) ; la méthode (300 à 500 mots, h2) ; les sources ;
 * la FAQ (avec FAQPage) ; les articles liés ; la carte Granit en dernier.
 * JSON-LD : CollectionPage + BreadcrumbList (FilOutil) + FAQPage (FaqOutil).
 */
export function GabaritHub({
  outil,
  suivre,
  titre,
  description,
  dateModified,
  entete,
  recherche,
  avantListe,
  liste,
  methode,
  sources,
  faq,
  articles,
  outilsLies,
  pont,
}: {
  outil: OutilDescripteur;
  suivre: Suivre;
  /** <title> et meta description du hub (les mêmes que pages()[0]). */
  titre: string;
  description: string;
  /** lastmod du hub. */
  dateModified: string;
  /** Le H1 en deux temps et le chapeau. */
  entete: { titre: string; accent: string; chapeau: string };
  /** RechercheOutil et filtres, posés dans l'en-tête. */
  recherche: ReactNode;
  avantListe?: ReactNode;
  liste: ReactNode;
  methode: ReactNode;
  sources: Omit<ComponentProps<typeof BlocSources>, "suivre">;
  faq: QuestionOutil[];
  articles: string[];
  outilsLies?: Omit<LienOutilProps, "suivre" | "de">[];
  pont: { texte: string; metiers?: MetierOutil[] };
}) {
  return (
    <SiteLayout>
      <JsonLd
        data={[collectionPageLd({ chemin: outil.chemin, titre, description, dateModified })]}
      />
      <Conteneur className="pt-6 pb-4 md:pt-8">
        <FilOutil items={[{ nom: outil.nom }]} />
      </Conteneur>
      <EnTeteOutil compact surTitre={SURTITRE_HUB} {...entete}>
        {recherche}
      </EnTeteOutil>
      <Conteneur className="pb-16">
        {avantListe}
        {liste}
        <Colonne className="mt-16">{methode}</Colonne>
        <Colonne>
          <BlocSources {...sources} suivre={suivre} />
          <FaqOutil items={faq} jsonLd />
        </Colonne>
        <ArticlesLies
          slugs={articles}
          outils={outilsLies?.map((o) => ({ ...o, suivre, de: outil.id }))}
          suivre={suivre}
          de={outil.id}
        />
        <CartePont
          outil={outil.id}
          page="hub"
          texte={pont.texte}
          metiers={pont.metiers}
          suivre={suivre}
        />
      </Conteneur>
    </SiteLayout>
  );
}
