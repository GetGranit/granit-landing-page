import { Link, createFileRoute } from "@tanstack/react-router";
import { useSuiviOutil } from "@/components/outils/OutilShared";
import {
  BlocAvertissement,
  EtatVide,
  FiltreFacette,
  GabaritHub,
  ListeHub,
  RechercheOutil,
  SectionOutil,
  useRechercheHub,
} from "@/components/outils/socle";
import { Bandeau2027, DetailsCode, RenvoisSources } from "@/components/outils/remboursement/Blocs";
import { OUTIL } from "@/lib/outils/remboursement/outil.mjs";
import { chargerHub } from "@/lib/outils/remboursement/serveur";
import {
  HUB,
  RECHERCHE,
  TEXTE_PONT,
  formeRequete,
  lireRequeteUrl,
} from "@/lib/outils/remboursement/textesHub.mjs";
import { typo } from "@/lib/outils/remboursement/format.mjs";
import type { LigneRemboursement, VueHub } from "@/lib/outils/remboursement/vues.mjs";
import { suggestions, versSuggestion } from "@/lib/outils/socle/recherche";
import { headOutil } from "@/lib/outils/socle/seo";

/**
 * Hub de l'outil B · Remboursement (cadre.md § 5) : toutes les lignes (209 codes d'optique et
 * d'audio en V0) sont dans le HTML du serveur, groupe par groupe, repliées ; la recherche et les
 * filtres ne font que les masquer. Chaque ligne d'un groupe qui a sa page mène à
 * `/outils/remboursement/<groupe>#lpp-<code>` ; les autres s'ouvrent sur place.
 */
// `q` peut arriver en nombre : le routeur lit `?q=2263287` comme du JSON (lireRequeteUrl).
type Recherche = { q?: string | number; domaine?: string; panier?: string };

const DOMAINES = ["optique", "audio", "dentaire", "pharmacie"];
const PANIERS = ["100-sante", "libre", "modere"];

export const Route = createFileRoute("/outils/remboursement/")({
  validateSearch: (s: Record<string, unknown>): Recherche => ({
    q: lireRequeteUrl(s.q),
    domaine: typeof s.domaine === "string" && DOMAINES.includes(s.domaine) ? s.domaine : undefined,
    panier: typeof s.panier === "string" && PANIERS.includes(s.panier) ? s.panier : undefined,
  }),
  // Pas de loaderDeps : le filtre s'applique au rendu, côté serveur comme côté navigateur.
  loader: () => chargerHub(),
  head: ({ loaderData }) =>
    loaderData
      ? headOutil({ titre: loaderData.hub.titre, description: loaderData.hub.description })
      : {},
  component: Hub,
});

/** « LPP 2263287 », « lpp-2263287 » : la recherche essaie aussi le code seul. */
const variantes = (q: string) => {
  const sans = q.trim().replace(/^(?:lpp|ccam|cip)[\s:-]*/i, "");
  return sans && sans !== q.trim() ? [sans] : [];
};

function MessageVide({ q, data }: { q: string; data: VueHub }) {
  const v = data.etatVide;
  const lien = (href: string, texte: string) => (
    <a
      href={href}
      target="_blank"
      rel="noopener"
      className="underline underline-offset-2 hover:no-underline"
      style={{ color: "var(--profond)" }}
    >
      {texte}
    </a>
  );
  const forme = formeRequete(q);
  if (forme === "fabricant")
    return (
      <p>
        {v.messages.fabricant} {lien(v.lienLpp, "Base LPP de l’Assurance Maladie")}
      </p>
    );
  if (forme === "inconnu")
    return (
      <p>
        {v.messages.inconnu} {lien(v.lienLpp, "Base LPP de l’Assurance Maladie")}
      </p>
    );
  if (forme === "ccam" && !v.dentaireOuvert)
    return (
      <p>
        {v.messages.ccam}{" "}
        {v.articleDentaire && (
          <Link
            to="/ressources/$slug"
            params={{ slug: v.articleDentaire }}
            className="underline underline-offset-2 hover:no-underline"
            style={{ color: "var(--profond)" }}
          >
            Les paniers 100&nbsp;% Santé en dentaire
          </Link>
        )}
      </p>
    );
  if (forme === "cip" && !v.pharmacieOuverte)
    return (
      <p>
        {v.messages.cip} {lien(v.lienBdpm, "Base de données publique des médicaments")}
      </p>
    );
  return <p>{v.messages.texte.replace("{q}", q.trim())}</p>;
}

function Hub() {
  const data = Route.useLoaderData();
  const { q, domaine, panier } = Route.useSearch();
  const suivi = useSuiviOutil(OUTIL.id, { page: "hub" });
  const hub = useRechercheHub<LigneRemboursement>({
    lignes: data.lignes,
    chemin: OUTIL.chemin,
    q: q === undefined ? "" : String(q),
    filtres: { domaine: domaine ?? null, panier: panier ?? null },
    suivi,
    variantes,
  });

  return (
    <GabaritHub
      outil={OUTIL}
      suivre={suivi.suivre}
      titre={data.hub.titre}
      description={data.hub.description}
      dateModified={data.hub.lastmod}
      entete={{ titre: typo(HUB.titreH1), accent: typo(HUB.accent), chapeau: typo(HUB.chapeau) }}
      recherche={
        <>
          <RechercheOutil
            action={OUTIL.chemin}
            q={hub.q}
            onChange={hub.setQ}
            libelle={RECHERCHE.libelle}
            placeholder={RECHERCHE.placeholder}
            aide={RECHERCHE.aide}
            inputMode="search"
            total={hub.total}
            visibles={hub.visibles}
            unite={RECHERCHE.unite as [string, string]}
            filtres={hub.filtres}
            onSoumettre={() =>
              document.getElementById("liste-codes")?.scrollIntoView({ block: "start" })
            }
          />
          <div className="flex flex-wrap gap-x-8">
            <FiltreFacette
              id="domaine"
              libelle="Domaine"
              options={data.facettes.domaine}
              valeur={hub.filtres.domaine}
              onChange={(v) => hub.setFiltre("domaine", v)}
              hrefPour={hub.hrefPour("domaine")}
            />
            <FiltreFacette
              id="panier"
              libelle="Panier"
              options={data.facettes.panier}
              valeur={hub.filtres.panier}
              onChange={(v) => hub.setFiltre("panier", v)}
              hrefPour={hub.hrefPour("panier")}
            />
          </div>
        </>
      }
      avantListe={
        <div className="max-w-[680px]">
          <Bandeau2027 bandeau={data.bandeau} className="mt-8" />
          <p className="mt-4 text-[14px]" style={{ color: "var(--texte-secondaire)" }}>
            {data.datation}
          </p>
        </div>
      }
      liste={
        <div id="liste-codes" className="scroll-mt-24">
          <ListeHub
            lignes={data.lignes}
            groupes={data.groupes}
            q={hub.q}
            filtres={hub.filtres}
            variantes={variantes}
            replier
            unite={["code", "codes"]}
            suivre={suivi.suivre}
            refResultat={suivi.resultat}
            rendreDetails={(l) => (l.details ? <DetailsCode details={l.details} /> : null)}
            vide={(qq) => (
              <EtatVide
                q={qq}
                message={<MessageVide q={qq} data={data} />}
                // Un code par fabricant (7…), CCAM ou CIP n'a pas de voisin numérique utile.
                suggestions={
                  formeRequete(qq) === "texte" || formeRequete(qq) === "inconnu"
                    ? suggestions(data.lignes, qq, { variantes }).map(versSuggestion)
                    : []
                }
                conseils={
                  <a
                    href="#calcul"
                    className="inline-flex min-h-[44px] items-center underline underline-offset-2 hover:no-underline"
                    style={{ color: "var(--profond)" }}
                  >
                    Comment se calcule un remboursement
                  </a>
                }
                signaler={{ texte: "Signaler un code manquant", sujet: "Code LPP manquant" }}
                onEffacer={hub.effacer}
              />
            )}
          />
        </div>
      }
      methode={
        <>
          {data.methode.map((s) => (
            <SectionOutil key={s.id} id={s.id} titre={s.titre}>
              {s.paragraphes.map((p, i) => (
                <p key={i} className={i ? "mt-3" : ""}>
                  {p.texte}
                  <RenvoisSources ids={p.source_ids} sources={data.sources} />
                </p>
              ))}
            </SectionOutil>
          ))}
          <BlocAvertissement variante="fait-foi" className="mt-10">
            <p>{data.faitFoi}</p>
          </BlocAvertissement>
        </>
      }
      sources={{ sources: data.sources, verifieLe: data.hub.lastmod }}
      faq={data.faq}
      articles={data.articles}
      outilsLies={data.outilsLies.map((o) => ({
        id: o.id as "mutuelle-portail" | "codes-rejet",
        texte: o.texte,
      }))}
      pont={{ texte: typo(TEXTE_PONT), metiers: ["optique"] }}
    />
  );
}
