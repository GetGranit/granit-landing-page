import { useEffect, type ReactNode } from "react";
import { JsonLd } from "@/components/JsonLd";
import { SiteLayout } from "@/components/SiteLayout";
import { EVENEMENTS, lireDepuis, type Suivre } from "@/lib/outils/socle/suivi";
import type { SourceDonnee } from "@/lib/outils/socle/types";
import { ArticlesLies, type LienOutilProps } from "./ArticlesLies";
import {
  BlocEssentiel,
  EnTeteEntree,
  type EnTeteEntreeProps,
  type LigneEssentiel,
} from "./BlocEssentiel";
import { BlocSources } from "./BlocSources";
import { CartePont, type CartePontProps } from "./CartePont";
import { EntreesVoisines, type EntreesVoisinesProps } from "./EntreesVoisines";
import { FilOutil, type ItemFil } from "./FilOutil";
import { Colonne, Conteneur } from "./Mise";

export type GabaritEntreeProps = {
  /** Slug de l'entrée (lm_entree_vue, voisins, utm_term du pont). */
  slug: string;
  /** `suivre` de useSuiviOutil(outil, { page: "entree", entree: slug }). */
  suivre: Suivre;
  /** Niveaux après « Accueil › Outils » : l'outil (avec son chemin), puis l'entrée (sans chemin). */
  fil: ItemFil[];
  entete: EnTeteEntreeProps;
  /** « L'essentiel », 3 à 5 lignes. */
  essentiel: LigneEssentiel[];
  /** Le BlocAvertissement « fait-foi » de l'outil, juste sous « L'essentiel ». */
  avertissement: ReactNode;
  /** Les sections propres à l'outil (SectionOutil, TableauOutil…). */
  children: ReactNode;
  sources: SourceDonnee[];
  verifieLe: string;
  voisins: Omit<EntreesVoisinesProps, "suivre" | "de">;
  /** Slugs /ressources, 1 à 3. */
  articles: string[];
  /** Liens vers les autres outils (2 au plus), affichés seulement une fois ces outils fusionnés. */
  outilsLies?: Omit<LienOutilProps, "suivre" | "de">[];
  pont: Omit<CartePontProps, "suivre" | "page" | "slug">;
  /** webPageLd (le BreadcrumbList est posé par FilOutil). */
  jsonLd: object[];
};

/**
 * La page d'une entrée, dans l'ordre fixe du socle : fil d'Ariane, en-tête et réponse, l'essentiel,
 * l'avertissement « fait foi », les sections de l'outil, les sources, les voisins, les articles liés,
 * puis la carte Granit en dernier. Envoie lm_entree_vue (mode « page ») à chaque entrée affichée.
 */
export function GabaritEntree({
  slug,
  suivre,
  fil,
  entete,
  essentiel,
  avertissement,
  children,
  sources,
  verifieLe,
  voisins,
  articles,
  outilsLies,
  pont,
  jsonLd,
}: GabaritEntreeProps) {
  useEffect(() => {
    suivre(EVENEMENTS.entreeVue, { entree: slug, mode: "page", depuis: lireDepuis() });
  }, [slug, suivre]);

  return (
    <SiteLayout>
      <JsonLd data={jsonLd} />
      <Conteneur className="pt-6 md:pt-8">
        <FilOutil items={fil} />
      </Conteneur>
      <EnTeteEntree {...entete} />
      <Conteneur className="pb-16">
        <Colonne>
          <BlocEssentiel lignes={essentiel} />
          {avertissement}
          {children}
          <BlocSources sources={sources} verifieLe={verifieLe} suivre={suivre} />
        </Colonne>
        <EntreesVoisines {...voisins} de={slug} suivre={suivre} />
        <ArticlesLies
          slugs={articles}
          outils={outilsLies?.map((o) => ({ ...o, suivre, de: slug }))}
          suivre={suivre}
          de={slug}
        />
        <CartePont {...pont} page="entree" slug={slug} suivre={suivre} />
      </Conteneur>
    </SiteLayout>
  );
}
