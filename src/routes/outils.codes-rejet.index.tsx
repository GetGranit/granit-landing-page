// Hub de l'outil A : /outils/codes-rejet. La liste complète est dans le HTML serveur ; la recherche
// et le filtre métier ne font que masquer des lignes (`hidden`), côté serveur (?q=, ?metier=) comme
// côté client. Gabarit du socle (§ 7.1), mots de outils-nuit/A/textes.md.
import { createFileRoute } from "@tanstack/react-router";
import {
  BlocAvertissement,
  EtatVide,
  FiltreMetier,
  GabaritHub,
  LienOutil,
  ListeHub,
  RechercheOutil,
  useRechercheHub,
} from "@/components/outils/socle";
import { useSuiviOutil } from "@/components/outils/OutilShared";
import { DetailsCode } from "@/components/outils/codes-rejet/DetailsCode";
import { MethodeCodesRejet } from "@/components/outils/codes-rejet/MethodeCodesRejet";
import { OUTIL } from "@/lib/outils/codes-rejet/outil.mjs";
import { chargerHub } from "@/lib/outils/codes-rejet/serveur";
import {
  ARTICLES_HUB,
  ENTETE_HUB,
  FAQ_HUB,
  LIEN_MUTUELLE,
  RECHERCHE,
  TEXTE_PONT,
  formeRequete,
  messageVide,
  variantesCode,
} from "@/lib/outils/codes-rejet/textes";
import type { LigneCode } from "@/lib/outils/codes-rejet/types";
import { estMetierOutil } from "@/lib/outils/socle/metiers.mjs";
import { suggestions, versSuggestion } from "@/lib/outils/socle/recherche";
import { headOutil } from "@/lib/outils/socle/seo";
import type { MetierOutil } from "@/lib/outils/socle/types";

export const Route = createFileRoute("/outils/codes-rejet/")({
  // Le routeur lit les paramètres en JSON : « ?q=450054 » arrive en nombre. On garde la valeur telle
  // quelle (la renvoyer en chaîne changerait l'adresse et provoquerait une redirection) et on la
  // lit en texte au rendu.
  validateSearch: (s: Record<string, unknown>): { q?: string | number; metier?: MetierOutil } => ({
    q:
      (typeof s.q === "string" && s.q) || (typeof s.q === "number" && Number.isFinite(s.q))
        ? s.q
        : undefined,
    metier: estMetierOutil(s.metier) ? s.metier : undefined,
  }),
  // Pas de loaderDeps : le filtre s'applique au rendu, le loader ne repart pas à chaque frappe.
  loader: () => chargerHub(),
  head: ({ loaderData }) =>
    loaderData
      ? headOutil({ titre: loaderData.hub.titre, description: loaderData.hub.description })
      : {},
  component: Hub,
});

function Hub() {
  const data = Route.useLoaderData();
  const { q, metier } = Route.useSearch();
  const suivi = useSuiviOutil(OUTIL.id, { page: "hub" });
  const hub = useRechercheHub<LigneCode>({
    lignes: data.lignes,
    chemin: OUTIL.chemin,
    q: q === undefined ? "" : String(q),
    filtres: { metier: metier ?? null },
    suivi,
    variantes: variantesCode,
  });
  const [debut, fin] = data.infos.anneesMemos;
  const metierFiltre = hub.filtres.metier;

  return (
    <GabaritHub
      outil={OUTIL}
      suivre={suivi.suivre}
      titre={data.hub.titre}
      description={data.hub.description}
      dateModified={data.hub.lastmod}
      entete={ENTETE_HUB}
      recherche={
        <>
          <RechercheOutil
            action={OUTIL.chemin}
            q={hub.q}
            onChange={hub.setQ}
            libelle={RECHERCHE.libelle}
            placeholder={RECHERCHE.placeholder}
            aide={RECHERCHE.aide}
            unite={RECHERCHE.unite}
            total={hub.total}
            visibles={hub.visibles}
            filtres={hub.filtres}
            onSoumettre={() =>
              document.getElementById("liste-codes")?.scrollIntoView({ block: "start" })
            }
          />
          <FiltreMetier
            lignes={data.lignes}
            valeur={metierFiltre}
            onChange={(v) => hub.setFiltre("metier", v)}
            hrefPour={hub.hrefPour("metier")}
          />
        </>
      }
      avantListe={
        // textes.md § 1.3 ; sources.md, « Règles appliquées » et « Pièges relevés »
        <BlocAvertissement>
          Ces libellés viennent de mémos publiés par des caisses primaires entre {debut} et {fin} et
          de pages ameli.fr.
          {data.infos.gieListe &&
            ` Les ARL négatifs et les messages de service viennent du cahier des charges SESAM-Vitale (version du ${data.infos.dateGie}).`}{" "}
          Le libellé de votre propre retour fait foi&nbsp;: une autre caisse ou un autre régime
          (MSA, régimes spéciaux) peut écrire autre chose.
        </BlocAvertissement>
      }
      liste={
        <div id="liste-codes" className="scroll-mt-24">
          <ListeHub<LigneCode>
            lignes={data.lignes}
            groupes={data.groupes}
            q={hub.q}
            filtres={hub.filtres}
            variantes={variantesCode}
            suivre={suivi.suivre}
            refResultat={suivi.resultat}
            unite={RECHERCHE.unite}
            rendreDetails={(l) => (l.details ? <DetailsCode details={l.details} /> : null)}
            vide={(qq) => (
              <EtatVide
                q={qq}
                message={messageVide(qq, formeRequete(qq, data.infos.gieListe))}
                suggestions={suggestions(data.lignes, qq, { variantes: variantesCode }).map(
                  versSuggestion,
                )}
                conseils={
                  <LienOutil
                    id="mutuelle-portail"
                    texte={
                      "Rejet de la part mutuelle\u00a0? Le motif vient de la complémentaire ou de sa plateforme\u00a0: trouvez son portail."
                    }
                    suivre={suivi.suivre}
                    de="hub"
                  />
                }
                liens={[
                  {
                    nom: "Lire un retour NOEMIE, pas à pas",
                    chemin: "/ressources/codes-rejets-noemie",
                  },
                ]}
                signaler={{ texte: "Signaler un code manquant", sujet: "Code rejet manquant" }}
                onEffacer={hub.effacer}
              />
            )}
          />
        </div>
      }
      methode={<MethodeCodesRejet suivre={suivi.suivre} />}
      sources={{ groupes: data.sources, verifieLe: data.hub.lastmod }}
      faq={FAQ_HUB}
      articles={ARTICLES_HUB}
      outilsLies={[{ id: "mutuelle-portail", texte: LIEN_MUTUELLE }]}
      pont={{
        texte: TEXTE_PONT,
        metiers: metierFiltre && estMetierOutil(metierFiltre) ? [metierFiltre] : undefined,
      }}
    />
  );
}
