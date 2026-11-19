// Page d'une complémentaire : /outils/mutuelle-portail/<slug>. Elle n'existe que pour une mutuelle
// sans fiche /ressources qui passe le seuil de contenu (pages.mjs). Une mutuelle à fiche part en 301
// vers sa fiche ; une autre entrée connue, vers sa ligne du hub ; un slug inconnu donne un 404 franc.
import { Link, createFileRoute, notFound, redirect, useParams } from "@tanstack/react-router";
import {
  BlocAvertissement,
  GabaritEntree,
  PageIntrouvableOutil,
  SectionOutil,
} from "@/components/outils/socle";
import { useSuiviOutil } from "@/components/outils/OutilShared";
import {
  AConfirmer,
  LiensSources,
  PhrasesReleve,
  SansSource,
  TableauPortails,
} from "@/components/outils/mutuelle-portail/Releve";
import {
  INTROUVABLE,
  OUTILS_LIES,
  RECHERCHE,
  TEXTE_PONT,
} from "@/components/outils/mutuelle-portail/textes";
import { OUTIL } from "@/lib/outils/mutuelle-portail/outil.mjs";
import { chargerEntree } from "@/lib/outils/mutuelle-portail/serveur";
import type { DonneesEntree } from "@/lib/outils/mutuelle-portail/types";
import { outilDisponible } from "@/lib/outils/socle/outils";
import { CONTACT_OUTILS } from "@/lib/outils/socle/reglages";
import { headIntrouvable, headOutil, webPageLd } from "@/lib/outils/socle/seo";

/** « mutuelle-xyz » → « mutuelle xyz » : la recherche de la page introuvable. */
const enMots = (slug: string) => slug.replace(/-+/g, " ").trim();

export const Route = createFileRoute("/outils/mutuelle-portail/$slug")({
  loader: async ({ params }) => {
    const r = await chargerEntree({ data: { slug: params.slug } });
    if (r.type === "redirection") throw redirect({ href: r.vers, statusCode: 301 });
    if (r.type === "introuvable") throw notFound();
    return r;
  },
  head: ({ loaderData, params }) =>
    loaderData?.type === "page"
      ? headOutil({ titre: loaderData.page.titre, description: loaderData.page.description })
      : headIntrouvable(enMots(params.slug), OUTIL.nom),
  component: Entree,
  notFoundComponent: Introuvable,
});

function Introuvable() {
  const { slug = "" } = useParams({ strict: false }) as { slug?: string };
  return (
    <PageIntrouvableOutil
      outil={OUTIL}
      slug={enMots(slug)}
      q={enMots(slug)}
      message={<p>{INTROUVABLE}</p>}
      recherche={RECHERCHE}
      textePont={TEXTE_PONT}
    />
  );
}

const lienTexte = "underline underline-offset-2 hover:no-underline";

function Entree() {
  const data = Route.useLoaderData() as DonneesEntree;
  const { page, releve } = data;
  const { suivre } = useSuiviOutil(OUTIL.id, { page: "entree", entree: page.slug });
  const noms = Object.fromEntries(data.audit.sources.map((s) => [s.id, s.editeur]));
  const codesRejet = outilDisponible("codes-rejet");
  const p = releve.phrases;
  return (
    <GabaritEntree
      slug={page.slug!}
      suivre={suivre}
      fil={[{ nom: OUTIL.nom, chemin: OUTIL.chemin }, { nom: releve.nom }]}
      entete={{
        surTitre: data.surTitre,
        h1: page.h1,
        reponse: data.reponse,
        metiers: data.metiers,
      }}
      essentiel={data.essentiel.map((l) => ({
        libelle: l.libelle,
        valeur:
          l.valeurs.length > 2 ? (
            <ul className="num-tabular space-y-0.5">
              {l.valeurs.map((v) => (
                <li key={v}>{v}</li>
              ))}
            </ul>
          ) : (
            <span className="num-tabular">{l.valeurs.join(" · ")}</span>
          ),
      }))}
      avertissement={<BlocAvertissement>{data.avertissement}</BlocAvertissement>}
      sources={data.audit.sources}
      verifieLe={page.lastmod}
      voisins={data.voisins}
      articles={data.audit.articles}
      outilsLies={OUTILS_LIES}
      pont={{
        outil: OUTIL.id,
        texte: TEXTE_PONT,
        metiers: data.metiers.length === 1 ? data.metiers : undefined,
      }}
      jsonLd={[
        webPageLd({
          chemin: page.chemin,
          titre: page.titre,
          description: page.description,
          dateModified: page.lastmod,
          sources: data.audit.sources,
        }),
      ]}
    >
      <SectionOutil
        id="portail-par-metier"
        titre={`${releve.nom}\u00a0: le portail relevé, métier par métier`}
      >
        <PhrasesReleve releve={releve} />
        <TableauPortails
          releve={releve}
          noms={noms}
          suivre={suivre}
          legende={`${releve.nom}\u00a0: opérateur, libellé relevé, numéro AMC et état, métier par métier`}
        />
        <AConfirmer releve={releve} />
        <SansSource releve={releve} />
      </SectionOutil>

      {p.fermes.length > 0 && (
        <SectionOutil id="segments-fermes" titre="Segments fermés">
          {p.fermes.map((t) => (
            <p key={t} className="mt-3 first:mt-0">
              {t}
            </p>
          ))}
          <p className="mt-3">Pour ces métiers, suivez la carte du patient.</p>
        </SectionOutil>
      )}

      {p.reseaux.length > 0 && (
        <SectionOutil id="reseau-de-soins" titre={`Réseau de soins de ${releve.nom}`}>
          {p.reseaux.map((t) => (
            <p key={t} className="mt-3 first:mt-0">
              {t}
            </p>
          ))}
        </SectionOutil>
      )}

      {data.verifications.map((v) => (
        <SectionOutil
          key={v.operateur}
          id={`verifier-${v.sourceId}`}
          titre={`Vérifier sur la carte ${v.operateur}`}
        >
          <p>
            {v.texte}{" "}
            <span className="text-[14px]" style={{ color: "var(--texte-secondaire)" }}>
              (source&nbsp;: <LiensSources ids={[v.sourceId]} noms={noms} />)
            </span>
          </p>
        </SectionOutil>
      ))}

      <SectionOutil id="si-la-carte-differe" titre="Si la carte dit autre chose">
        <p>
          Suivez la carte&nbsp;: un même organisme peut avoir des contrats gérés ailleurs. Si
          l’opérateur de la carte ne retrouve pas l’adhérent, voyez le{" "}
          <Link
            to="/ressources/$slug"
            params={{ slug: "rejet-beneficiaire-inconnu" }}
            className={lienTexte}
            style={{ color: "var(--profond)" }}
          >
            rejet «&nbsp;bénéficiaire inconnu&nbsp;»
          </Link>
          {codesRejet ? (
            <>
              &nbsp;; pour un rejet de la part Sécurité sociale,{" "}
              <Link
                to={codesRejet.chemin}
                className={lienTexte}
                style={{ color: "var(--profond)" }}
              >
                la liste des codes rejet
              </Link>
              .
            </>
          ) : (
            "."
          )}
        </p>
        <p className="mt-3">
          <a
            href={`mailto:${CONTACT_OUTILS}?subject=${encodeURIComponent(`Écart relevé : ${releve.nom}`)}`}
            className={`inline-flex min-h-[44px] items-center text-[15px] ${lienTexte}`}
            style={{ color: "var(--profond)" }}
          >
            Signaler un écart
          </a>
        </p>
      </SectionOutil>
    </GabaritEntree>
  );
}
