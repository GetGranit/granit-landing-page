// Page d'un code rejet : /outils/codes-rejet/<slug>. Rendue par le serveur (gabarit d'entrée du
// socle, § 7.2), seulement pour une entrée publiée par pages.mjs. Une autre écriture du code
// (0450-054, 450054…) ou une entrée connue sans page : 301 ; une écriture partagée par deux codes :
// 302 vers la recherche du hub ; une adresse inconnue : 404 franc (noindex).
import { createFileRoute, notFound, redirect, useParams } from "@tanstack/react-router";
import { BlocAvertissement, GabaritEntree, PageIntrouvableOutil } from "@/components/outils/socle";
import { useSuiviOutil } from "@/components/outils/OutilShared";
import { SectionsCode } from "@/components/outils/codes-rejet/SectionsCode";
import { OUTIL } from "@/lib/outils/codes-rejet/outil.mjs";
import { GIE_SESAM_VITALE } from "@/lib/outils/codes-rejet/publication.mjs";
import { chargerEntree } from "@/lib/outils/codes-rejet/serveur";
import {
  RECHERCHE,
  TEXTE_PONT,
  codeDuSlug,
  formeRequete,
  messageVide,
} from "@/lib/outils/codes-rejet/textes";
import { headIntrouvable, headOutil, webPageLd } from "@/lib/outils/socle/seo";

export const Route = createFileRoute("/outils/codes-rejet/$slug")({
  loader: async ({ params }) => {
    const r = await chargerEntree({ data: { slug: params.slug } });
    if (r.type === "redirection") throw redirect({ href: r.vers, statusCode: 301 });
    if (r.type === "recherche") throw redirect({ href: r.vers, statusCode: 302 });
    if (r.type === "introuvable") throw notFound();
    return r;
  },
  head: ({ loaderData, params }) =>
    loaderData?.type === "page"
      ? headOutil({ titre: loaderData.page.titre, description: loaderData.page.description })
      : headIntrouvable(codeDuSlug(params.slug), OUTIL.nom),
  component: Entree,
  notFoundComponent: Introuvable,
});

function Entree() {
  const data = Route.useLoaderData();
  const { page, modele: m } = data;
  const { suivre } = useSuiviOutil(OUTIL.id, { page: "entree", entree: m.slug });
  return (
    <GabaritEntree
      slug={m.slug}
      suivre={suivre}
      fil={[{ nom: OUTIL.nom, chemin: OUTIL.chemin }, { nom: m.code }]}
      entete={{ surTitre: m.surTitre, h1: page.h1, reponse: m.reponse, metiers: m.metiers }}
      essentiel={m.essentiel}
      avertissement={
        <BlocAvertissement sourceIds={m.avertissement.sourceIds}>
          {m.avertissement.texte}
        </BlocAvertissement>
      }
      sources={m.sources}
      verifieLe={page.lastmod}
      voisins={{ titre: m.voisins.titre, entrees: m.voisins.entrees }}
      articles={m.articles}
      outilsLies={m.outilsLies}
      pont={{ outil: OUTIL.id, texte: TEXTE_PONT, metiers: m.metiers }}
      jsonLd={[
        webPageLd({
          chemin: page.chemin,
          titre: page.titre,
          description: page.description,
          dateModified: page.lastmod,
          sources: m.sources,
        }),
      ]}
    >
      <SectionsCode m={m} />
    </GabaritEntree>
  );
}

/** 404 : le code tiré de l'adresse, le message de sa forme (textes.md § 1.5), la recherche préremplie. */
function Introuvable() {
  const { slug = "" } = useParams({ strict: false }) as { slug?: string };
  const code = codeDuSlug(slug);
  return (
    <PageIntrouvableOutil
      outil={OUTIL}
      slug={code}
      q={code}
      message={`Ce code n’a pas de page. ${messageVide(code, formeRequete(code, GIE_SESAM_VITALE.liste))}`}
      recherche={{
        libelle: RECHERCHE.libelle,
        placeholder: RECHERCHE.placeholder,
        aide: RECHERCHE.aide,
        unite: RECHERCHE.unite,
      }}
      textePont={TEXTE_PONT}
    />
  );
}
