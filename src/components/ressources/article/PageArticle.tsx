// Page d'un article JSON du moteur (gabarit §3, blocs 1 à 15).
import { useRef, type CSSProperties } from "react";
import { Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { categorie, dateFr, ficheJson, metierDe, titreCourt } from "@/lib/ressources/contenu";
import { verticale } from "@/lib/ressources/verticales";
import type { Concurrent, Plateforme, RessourceJson } from "@/lib/ressources/types";
import { Annuaire } from "../Annuaire";
import { FenetrePlateforme, MarquePlateforme, PhotoCarte, TitreItalique } from "../Cartes";
import { estFicheTousPortails, photoFiche } from "@/lib/ressources/photos";
import { logoPlateforme, statutsCarte } from "@/lib/ressources/logos";
import { FIGURE_CSS } from "@/lib/ressources/figures";
import { Fil, itemMetier } from "../Fil";
import { SousNav } from "../Onglets";
import { FicheIdentite } from "./BlocsPlateforme";
import { Corps } from "./Corps";
import { Ancres } from "./Ancres";
import { CarteAgent, EncartAgent } from "./CtaAgent";
import { ALireEnsuite, EtapeSuivante, Faq, Sources, Utile } from "./Fin";
import { Sommaire, SommaireMobile, type Entree } from "./Sommaire";

/** Bandeau des pages d'aperçu (content/apercu), jamais en production. */
function BandeauPreview() {
  return (
    <div className="bg-[#1c1108] px-4 py-2 text-center font-mono text-[12px] uppercase tracking-[0.12em] text-[#f2a48f]">
      Aperçu, non publié
    </div>
  );
}

function Signature({ a, nbSources }: { a: RessourceJson; nbSources: number }) {
  const nom = a.author?.name || "l'équipe Granit";
  return (
    <div className="mt-5 flex flex-wrap items-center gap-x-[18px] gap-y-2 text-[14px] text-[var(--text-soft)]">
      <span className="flex items-center gap-2">
        {a.author?.photo ? (
          <img
            src={a.author.photo}
            alt=""
            width={30}
            height={30}
            className="size-[30px] rounded-full object-cover"
          />
        ) : (
          <span
            aria-hidden
            className="grid size-[30px] place-items-center rounded-full border border-[var(--border)] bg-[var(--bg3)] text-[13px] font-semibold"
          >
            {nom.slice(0, 1).toUpperCase()}
          </span>
        )}
        <span>
          Par{" "}
          {a.author?.url ? (
            <a
              href={a.author.url}
              rel="author noopener"
              className="font-semibold text-[var(--text)] underline-offset-[3px] hover:underline"
            >
              {nom}
            </a>
          ) : (
            <span className="font-semibold text-[var(--text)]">{nom}</span>
          )}
          {a.author?.jobTitle ? `, ${a.author.jobTitle}` : ""}
        </span>
      </span>
      {a.reviewer && (
        <span className="inline-flex items-center gap-1.5 font-semibold text-[#2e6b3c]">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.4"
            aria-hidden
          >
            <path d="M20 6 9 17l-5-5" />
          </svg>
          <span>
            Relu par{" "}
            {a.reviewer.url ? (
              <a
                href={a.reviewer.url}
                rel="noopener"
                className="underline-offset-[3px] hover:underline"
              >
                {a.reviewer.name}
              </a>
            ) : (
              a.reviewer.name
            )}
            {a.reviewer.jobTitle ? `, ${a.reviewer.jobTitle}` : ""}
          </span>
        </span>
      )}
      <span>
        {(a.type === "plateforme" || a.type === "vs" || a.type === "grille") && a.checkedOn
          ? `Informations relevées le ${dateFr(a.checkedOn, true)}`
          : `Mis à jour le ${dateFr(a.dateModified, true)}`}
      </span>
      <span>{a.readTime} min de lecture</span>
      <Metiers slug={a.slug} />
      {nbSources > 0 && (
        <a href="#sources" className="underline underline-offset-[3px] hover:text-[var(--text)]">
          {nbSources} source{nbSources > 1 ? "s" : ""}
        </a>
      )}
    </div>
  );
}

/** Les métiers de l'article, en liens discrets vers leurs pages. */
function Metiers({ slug }: { slug: string }) {
  const vs = (ficheJson(slug)?.verticales ?? []).map((v) => verticale(v)!).filter(Boolean);
  if (!vs.length) return null;
  return (
    <span>
      {vs.map((v, i) => (
        <span key={v.slug}>
          {i > 0 && " · "}
          <Link
            to="/ressources/metier/$verticale"
            params={{ verticale: v.slug }}
            className="underline-offset-[3px] hover:text-[var(--text)] hover:underline"
          >
            {v.court}
          </Link>
        </span>
      ))}
    </span>
  );
}

export function PageArticle({
  article: a,
  plateforme: p,
  concurrents = {},
}: {
  article: RessourceJson;
  plateforme: Plateforme | null;
  /** Page comparative : fichiers content/concurrents/{slug}.json (sans « exclus »). */
  concurrents?: Record<string, Concurrent>;
}) {
  const acteurs = (a.concurrents ?? []).map((s) => concurrents[s]).filter(Boolean);
  const cat = categorie(a.category)!;
  const estPlateforme = a.type === "plateforme" && p;
  const entrees: Entree[] = [
    ...(a.tocItems ?? []),
    ...(a.faqItems?.length ? [{ id: "faq", label: "Questions fréquentes" }] : []),
    ...(a.sources?.length || estPlateforme ? [{ id: "sources", label: "Sources" }] : []),
  ];
  const insertion = estPlateforme ? (
    <FicheIdentite p={p} />
  ) : a.slug === "portails-tiers-payant" ? (
    <div className="mb-8">
      <Annuaire />
    </div>
  ) : undefined;
  const teinte = { "--ink": cat.ink, "--tint": cat.tint } as CSSProperties;
  const corps = useRef<HTMLDivElement>(null);
  const fiche = ficheJson(a.slug);
  const metier = metierDe(a.slug);
  const nbSources =
    (a.sources?.length ?? 0) + (p ? Object.values(p.sources).filter((s) => !s.url).length : 0);

  return (
    <SiteLayout fond="var(--bg2)">
      <div className="ress">
        {a.preview && <BandeauPreview />}
        {a.readTime >= 3 && <div className="lecture-barre" aria-hidden style={teinte} />}
        <SousNav actif={metier?.slug ?? "tout"} />
        <header
          className="relative overflow-hidden border-b border-[var(--border)]"
          style={{ background: cat.tint }}
        >
          <div className="relative mx-auto grid max-w-[1160px] items-center gap-10 px-4 pb-[30px] pt-[34px] md:px-6 min-[980px]:grid-cols-[minmax(0,1fr)_380px]">
            <div>
              <Fil
                items={[
                  { nom: "Ressources", to: "/ressources" },
                  ...(metier ? [itemMetier(metier)] : []),
                  { nom: titreCourt(a.title) },
                ]}
              />
              <div className="mt-4">
                {/* Mobile : la photo d'en-tête est masquée, le logo passe au-dessus du H1. */}
                {estPlateforme && (
                  <div className="mb-4 min-[980px]:hidden">
                    <MarquePlateforme
                      nom={p.nom}
                      logo={logoPlateforme(p.logo, "carre")}
                      taille="xl"
                    />
                  </div>
                )}
                <h1 className="max-w-[22ch] font-serif text-[clamp(32px,4.4vw,54px)] font-normal leading-[1.08] tracking-[-0.015em] [text-wrap:balance]">
                  <TitreItalique titre={a.title} ink={cat.ink} />
                </h1>
              </div>
              <Signature a={a} nbSources={nbSources} />
            </div>
            {/* Photo du thème à droite, sur grand écran seulement : la réponse reste visible sans défiler. */}
            {fiche && (
              <div
                className={`group relative hidden aspect-[4/3] overflow-hidden rounded-[16px] min-[980px]:block ${estPlateforme || estFicheTousPortails(fiche) ? "ress-fenetre-entete" : ""}`}
              >
                {estPlateforme ? (
                  // Fiche plateforme : la même fenêtre de prise en charge que sur les cartes.
                  <FenetrePlateforme
                    plateforme={{
                      nom: p.nom,
                      logo: logoPlateforme(p.logo, "fenetre"),
                      statuts: statutsCarte(p.statuts),
                    }}
                  />
                ) : estFicheTousPortails(fiche) ? (
                  <FenetrePlateforme />
                ) : (
                  <PhotoCarte photo={photoFiche(fiche)} tailles="380px" chargement="haute" />
                )}
              </div>
            )}
          </div>
        </header>

        <div className="bg-white">
          <div
            className="mx-auto grid max-w-[1160px] gap-6 px-4 py-10 md:px-6 min-[980px]:grid-cols-[minmax(0,68ch)_300px] min-[980px]:justify-between min-[980px]:gap-10"
            style={teinte}
          >
            <div ref={corps} className="ress-corps min-w-0">
              {a.figures?.length ? (
                <style dangerouslySetInnerHTML={{ __html: FIGURE_CSS }} />
              ) : null}
              <SommaireMobile entrees={entrees} />
              <Corps
                html={a.contentHtml}
                plateforme={p}
                figures={a.figures}
                insertion={insertion}
                acteurs={acteurs}
              />
              <EtapeSuivante article={a} />
              <Faq items={a.faqItems} />
              <Sources article={a} plateforme={p} acteurs={acteurs} />
              <Utile slug={a.slug} />
              <Ancres racine={corps} />
            </div>
            {/* Sommaire et carte de l'agent collent ensemble ; la colonne s'arrête avant l'encart de fin. */}
            <aside className="hidden min-[980px]:block">
              <div className="sticky top-[88px] flex flex-col gap-4">
                <Sommaire entrees={entrees} />
                <CarteAgent article={a} plateforme={p} />
              </div>
            </aside>
          </div>
        </div>
        <EncartAgent article={a} plateforme={p} />
        <ALireEnsuite article={a} />
      </div>
    </SiteLayout>
  );
}
