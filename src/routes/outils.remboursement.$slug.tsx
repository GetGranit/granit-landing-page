import { createFileRoute, notFound, redirect, useParams } from "@tanstack/react-router";
import { useSuiviOutil } from "@/components/outils/OutilShared";
import {
  BlocAvertissement,
  GabaritEntree,
  PageIntrouvableOutil,
  SectionOutil,
} from "@/components/outils/socle";
import { Bandeau2027, RenvoisSources } from "@/components/outils/remboursement/Blocs";
import { CalculRemboursement } from "@/components/outils/remboursement/CalculRemboursement";
import { TableauCodes } from "@/components/outils/remboursement/TableauCodes";
import { OUTIL } from "@/lib/outils/remboursement/outil.mjs";
import { METIERS } from "@/lib/outils/remboursement/publication.mjs";
import { chargerEntree } from "@/lib/outils/remboursement/serveur";
import {
  ETAT_VIDE,
  RECHERCHE,
  TEXTE_PONT,
  formeRequete,
  requeteDuSlug,
} from "@/lib/outils/remboursement/textesHub.mjs";
import { capitale, typo } from "@/lib/outils/remboursement/format.mjs";
import type { VueEntreePage } from "@/lib/outils/remboursement/vues.mjs";
import { headIntrouvable, headOutil, webPageLd } from "@/lib/outils/socle/seo";

/**
 * Une page de groupe de l'outil B · Remboursement (cadre.md § 6), dans l'ordre fixe du socle :
 * réponse chiffrée, l'essentiel, « fait foi », bandeau 2027, calcul, tableau des codes, paragraphes,
 * conditions, sources, voisins, articles, carte Granit. Un code connu (`lpp-2263287`, `2263287`,
 * ancien slug de donnees.json) redirige en 301 vers la ligne de son groupe ; le reste est un 404.
 */
export const Route = createFileRoute("/outils/remboursement/$slug")({
  loader: async ({ params }) => {
    const r = await chargerEntree({ data: { slug: params.slug } });
    if (r.type === "redirection") throw redirect({ href: r.vers, statusCode: 301 });
    if (r.type === "introuvable") throw notFound();
    return r;
  },
  head: ({ loaderData, params }) =>
    loaderData?.type === "page"
      ? headOutil({ titre: loaderData.page.titre, description: loaderData.page.description })
      : headIntrouvable(params.slug, OUTIL.nom),
  component: Entree,
  notFoundComponent: Introuvable,
});

/** Le message d'une adresse inconnue, selon la forme du slug (textes.md § 1.5). */
function Introuvable() {
  const { slug = "" } = useParams({ strict: false }) as { slug?: string };
  const forme = formeRequete(requeteDuSlug(slug));
  const message =
    forme === "fabricant"
      ? ETAT_VIDE.fabricant
      : forme === "ccam" && !METIERS.dentaire.liste
        ? ETAT_VIDE.ccam
        : ETAT_VIDE.page;
  return (
    <PageIntrouvableOutil
      outil={OUTIL}
      slug={slug}
      q={requeteDuSlug(slug)}
      message={<p>{typo(message)}</p>}
      recherche={{
        libelle: RECHERCHE.libelle,
        placeholder: RECHERCHE.placeholder,
        aide: RECHERCHE.aide,
        unite: RECHERCHE.unite,
        inputMode: "search",
      }}
      textePont={typo(TEXTE_PONT)}
      metiers={["optique"]}
    />
  );
}

function Entree() {
  const data = Route.useLoaderData() as VueEntreePage;
  const { suivre, commence } = useSuiviOutil(OUTIL.id, { page: "entree", entree: data.page.slug });
  const { page, intertitres } = data;
  const metiers = ["optique" as const];

  return (
    <GabaritEntree
      slug={page.slug!}
      suivre={suivre}
      fil={[{ nom: OUTIL.nom, chemin: OUTIL.chemin }, { nom: data.groupe.nom }]}
      entete={{ surTitre: data.groupe.surTitre, h1: page.h1, reponse: data.reponse, metiers }}
      essentiel={data.essentiel.map((l) => ({ libelle: l.libelle, valeur: l.valeur }))}
      avertissement={
        <>
          <BlocAvertissement variante="fait-foi" sourceIds={["lpp-cnam-v910"]}>
            <p>{data.faitFoi}</p>
          </BlocAvertissement>
          <Bandeau2027 bandeau={data.bandeau} />
        </>
      }
      sources={data.sources}
      verifieLe={page.lastmod}
      voisins={{ titre: "Dans la même famille", entrees: data.voisins }}
      articles={data.articles}
      outilsLies={data.outilsLies.map((o) => ({
        id: o.id as "mutuelle-portail" | "codes-rejet",
        texte: o.texte,
      }))}
      pont={{ outil: OUTIL.id, texte: typo(TEXTE_PONT), metiers }}
      jsonLd={[
        webPageLd({
          chemin: page.chemin,
          titre: page.titre,
          description: page.description,
          dateModified: page.lastmod,
          sources: data.sources,
        }),
      ]}
    >
      <SectionOutil id="calcul" titre={intertitres.calcul}>
        <CalculRemboursement
          groupe={data.groupe.slug}
          codes={data.codes}
          jour={data.jour}
          regle={data.regle}
          suivre={suivre}
          commence={commence}
        />
      </SectionOutil>

      <SectionOutil id="codes" titre={intertitres.tableau}>
        <TableauCodes
          codes={data.codes}
          jour={data.jour}
          regle={data.regle}
          legende={intertitres.tableau}
          datation={data.datation}
        />
      </SectionOutil>

      <SectionOutil id="tranches" titre={intertitres.tranches}>
        <p>
          {data.tranches}
          <RenvoisSources ids={["lpp-cnam-v910"]} sources={data.sources} />
        </p>
      </SectionOutil>

      <SectionOutil id="a-savoir" titre={intertitres.texte}>
        {data.paragraphes.map((p, i) => (
          <p key={i} className={i ? "mt-3" : ""}>
            {p.texte}
            <RenvoisSources ids={p.source_ids} sources={data.sources} />
          </p>
        ))}
      </SectionOutil>

      {(data.conditions.communes.length > 0 || data.conditions.particulieres.length > 0) && (
        <SectionOutil id="conditions" titre="Conditions de prise en charge">
          {data.conditions.communes.length > 0 && <p>{data.conditions.communes.join(" ")}</p>}
          {data.conditions.particulieres.length > 0 && (
            <ul className="mt-3 space-y-2">
              {data.conditions.particulieres.map((c) => (
                <li key={c.categories.join("|")}>
                  <span style={{ fontWeight: 500 }}>
                    {typo(capitale(c.categories.join(", ")))}&nbsp;:
                  </span>{" "}
                  {c.textes.join(" ")}
                </li>
              ))}
            </ul>
          )}
        </SectionOutil>
      )}

      <SectionOutil id="limites" titre="Ce que ce calcul ne couvre pas">
        <p>{data.limites}</p>
      </SectionOutil>
    </GabaritEntree>
  );
}
