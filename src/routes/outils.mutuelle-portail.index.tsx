// Hub de l'outil C : /outils/mutuelle-portail. L'annuaire est l'outil : les 54 complémentaires sont
// dans le HTML serveur, chacune avec son relevé ; la recherche (nom, autre nom, numéro AMC) et les
// filtres (métier, opérateur) ne font que masquer des lignes. Sans JavaScript, ?q=, ?metier= et
// ?operateur= filtrent côté serveur.
import { useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  BlocAvertissement,
  EtatVide,
  FiltreFacette,
  FiltreMetier,
  GabaritHub,
  ListeHub,
  RechercheOutil,
  useRechercheHub,
} from "@/components/outils/socle";
import { useSuiviOutil } from "@/components/outils/OutilShared";
import { ApercuLigne } from "@/components/outils/mutuelle-portail/ApercuLigne";
import { MethodeHub } from "@/components/outils/mutuelle-portail/MethodeHub";
import { ReleveLigne } from "@/components/outils/mutuelle-portail/Releve";
import {
  ARTICLES_HUB,
  CHANGEMENTS,
  ENTETE_HUB,
  FAQ,
  METIER_PROSE,
  OUTILS_LIES,
  RECHERCHE,
  TEXTE_PONT,
  VIDE,
} from "@/components/outils/mutuelle-portail/textes";
import { OUTIL } from "@/lib/outils/mutuelle-portail/outil.mjs";
import { variantes } from "@/lib/outils/mutuelle-portail/recherche";
import { chargerHub } from "@/lib/outils/mutuelle-portail/serveur";
import type { LigneMutuelle } from "@/lib/outils/mutuelle-portail/types";
import { estMetierOutil } from "@/lib/outils/socle/metiers.mjs";
import { filtrerLignes, suggestions, versSuggestion } from "@/lib/outils/socle/recherche";
import { headOutil } from "@/lib/outils/socle/seo";
import { cleCode } from "@/lib/outils/socle/texte.mjs";
import type { MetierOutil } from "@/lib/outils/socle/types";

type Recherche = { q?: string | number; metier?: MetierOutil; operateur?: string };

export const Route = createFileRoute("/outils/mutuelle-portail/")({
  // Le routeur lit un ?q= tout en chiffres (numéro AMC tapé sans ses zéros) comme un nombre. On garde
  // la valeur telle quelle (nombre ou chaîne) : la convertir ici ferait réécrire l'URL (307) ; elle
  // devient du texte au rendu.
  validateSearch: (s: Record<string, unknown>): Recherche => ({
    q:
      (typeof s.q === "string" && s.q) || (typeof s.q === "number" && Number.isFinite(s.q))
        ? s.q
        : undefined,
    metier: estMetierOutil(s.metier) ? (s.metier as MetierOutil) : undefined,
    operateur: typeof s.operateur === "string" && s.operateur ? s.operateur : undefined,
  }),
  // Pas de loaderDeps : le filtre s'applique au rendu, côté serveur comme côté client.
  loader: () => chargerHub(),
  head: ({ loaderData }) =>
    loaderData
      ? headOutil({ titre: loaderData.hub.titre, description: loaderData.hub.description })
      : {},
  component: Hub,
});

function Hub() {
  const data = Route.useLoaderData();
  const { q, metier, operateur } = Route.useSearch();
  const suivi = useSuiviOutil(OUTIL.id, { page: "hub" });
  const operateurValide = data.operateurs.some((o) => o.valeur === operateur)
    ? (operateur ?? null)
    : null;
  const hub = useRechercheHub<LigneMutuelle>({
    lignes: data.lignes,
    chemin: OUTIL.chemin,
    q: q === undefined ? "" : String(q),
    filtres: { metier: metier ?? null, operateur: operateurValide },
    suivi,
    variantes,
  });
  const metierFiltre = (hub.filtres.metier as MetierOutil | null) ?? null;

  // Noms courts des sources (colonne « Source » des relevés dépliés).
  const noms = useMemo(
    () =>
      Object.fromEntries(
        data.groupesSources.flatMap((g) => g.sources.map((s) => [s.id, s.editeur])),
      ),
    [data.groupesSources],
  );

  const vide = (qq: string) => {
    const requete = qq.trim();
    const filtres = hub.filtres;
    const sansFiltre = requete ? filtrerLignes(data.lignes, qq, {}, { variantes }).visibles : [];
    // La mutuelle existe, mais un filtre la masque.
    if (sansFiltre.length && (filtres.metier || filtres.operateur)) {
      const noms = sansFiltre.slice(0, 3).map((l) => l.nom);
      const facette = filtres.metier ? "metier" : "operateur";
      const complement = filtres.metier
        ? `pour ${METIER_PROSE[filtres.metier] ?? filtres.metier}`
        : `chez ${data.operateurs.find((o) => o.valeur === filtres.operateur)?.libelle ?? ""}`;
      return (
        <EtatVide
          q={qq}
          message={VIDE.masque(
            noms.length > 1 ? `${noms.slice(0, -1).join(", ")} et ${noms.at(-1)}` : noms[0],
            noms.length > 1,
            complement,
          )}
          conseils={
            <button
              type="button"
              className="btn-secondaire justify-center"
              onClick={() => hub.setFiltre(facette, null)}
            >
              {facette === "metier" ? "Voir tous les métiers" : "Voir tous les opérateurs"}
            </button>
          }
          signaler={VIDE.signaler}
          onEffacer={hub.effacer}
        />
      );
    }
    // Aucune ligne avec ces deux filtres, sans recherche.
    if (!requete)
      return (
        <EtatVide
          q=""
          message={VIDE.filtres}
          conseils={
            <button
              type="button"
              className="btn-secondaire justify-center"
              onClick={() => hub.setFiltre(filtres.operateur ? "operateur" : "metier", null)}
            >
              {filtres.operateur ? "Voir tous les opérateurs" : "Voir tous les métiers"}
            </button>
          }
          onEffacer={hub.effacer}
        />
      );
    // Nom ou numéro absent du relevé.
    const numero = /^\d{8,10}$/.test(cleCode(qq));
    return (
      <EtatVide
        q={qq}
        message={numero ? VIDE.numero(data.releveListes) : VIDE.nom(requete)}
        suggestions={suggestions(data.lignes, qq, { variantes }).map(versSuggestion)}
        conseils={<p className="text-[14px]">{VIDE.portails}</p>}
        liens={[
          ...data.fichesOperateurs,
          ...(numero ? [{ nom: VIDE.lireAmc, chemin: "/ressources/mutuelle-quel-portail" }] : []),
        ]}
        signaler={VIDE.signaler}
        onEffacer={hub.effacer}
      />
    );
  };

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
            total={hub.total}
            visibles={hub.visibles}
            unite={RECHERCHE.unite}
            filtres={hub.filtres}
            onSoumettre={() =>
              document.getElementById("liste-mutuelles")?.scrollIntoView({ block: "start" })
            }
          />
          <FiltreMetier
            lignes={data.lignes}
            valeur={hub.filtres.metier}
            onChange={(v) => hub.setFiltre("metier", v)}
            hrefPour={hub.hrefPour("metier")}
          />
          <FiltreFacette
            id="operateur"
            libelle="Opérateur"
            tous="Tous les opérateurs"
            options={data.operateurs}
            valeur={hub.filtres.operateur}
            onChange={(v) => hub.setFiltre("operateur", v)}
            hrefPour={hub.hrefPour("operateur")}
          />
        </>
      }
      avantListe={
        <BlocAvertissement
          variante="a-venir"
          titre={CHANGEMENTS.titre}
          sourceIds={CHANGEMENTS.sourceIds}
          className="mt-8"
        >
          {CHANGEMENTS.texte}
        </BlocAvertissement>
      }
      liste={
        <div id="liste-mutuelles" className="scroll-mt-24">
          <ListeHub<LigneMutuelle>
            lignes={data.lignes}
            groupes={data.groupes}
            q={hub.q}
            filtres={hub.filtres}
            variantes={variantes}
            suivre={suivi.suivre}
            refResultat={suivi.resultat}
            unite={RECHERCHE.unite}
            rendreResume={(l) => <ApercuLigne ligne={l} metier={metierFiltre} />}
            rendreDetails={(l) =>
              l.details ? (
                <ReleveLigne releve={l.details} noms={noms} suivre={suivi.suivre} />
              ) : null
            }
            vide={vide}
          />
        </div>
      }
      methode={<MethodeHub />}
      sources={{
        groupes: data.groupesSources,
        verifieLe: data.hub.lastmod,
        mention: (s) => data.mentions[s.id],
      }}
      faq={FAQ}
      articles={ARTICLES_HUB}
      outilsLies={OUTILS_LIES}
      pont={{ texte: TEXTE_PONT, metiers: metierFiltre ? [metierFiltre] : undefined }}
    />
  );
}
