// Page d'un article JSON du moteur (gabarit §3, blocs 1 à 15).
import { useRef, type CSSProperties } from "react";
import { Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { categorie, dateFr, ficheJson, titreCourt } from "@/lib/ressources/contenu";
import { verticale } from "@/lib/ressources/verticales";
import type { Concurrent, Plateforme, RessourceJson } from "@/lib/ressources/types";
import { Annuaire } from "../Annuaire";
import { EcranPlateforme, MarquePlateforme, PhotoCarte, TitreItalique } from "../Cartes";
import { photoFiche } from "@/lib/ressources/photos";
import { logoPlateforme } from "@/lib/ressources/logos";
import { FIGURE_CSS } from "@/lib/ressources/figures";
import { Fil } from "../Fil";
import { SousNav } from "../Onglets";
import { FicheIdentite } from "./BlocsPlateforme";
import { Corps } from "./Corps";
import { Ancres } from "./Ancres";
import { ALireEnsuite, EncartFinal, EtapeSuivante, Faq, Sources, Utile } from "./Fin";
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

/** Titre de la carte agent ; « vos PEC {nom} » seulement si Granit a un connecteur pour ce portail. */
function titreAgent(a: RessourceJson, p: Plateforme | null): string {
  const connecteur = p && Object.keys(p.sources).some((k) => k.startsWith("granit"));
  if (a.type === "plateforme" && p && connecteur) return `L'agent dépose vos PEC ${p.nom}`;
  return categorie(a.category)!.agent;
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
  const nbSources =
    (a.sources?.length ?? 0) + (p ? Object.values(p.sources).filter((s) => !s.url).length : 0);

  return (
    <SiteLayout fond="var(--bg2)">
      <div className="ress">
        {a.preview && <BandeauPreview />}
        {a.readTime >= 3 && <div className="lecture-barre" aria-hidden style={teinte} />}
        <SousNav actif={a.category === "glossaire" ? "glossaire" : a.category} />
        <header
          className="relative overflow-hidden border-b border-[var(--border)]"
          style={{ background: cat.tint }}
        >
          <div className="relative mx-auto grid max-w-[1160px] items-center gap-10 px-4 pb-[30px] pt-[34px] md:px-6 min-[980px]:grid-cols-[minmax(0,1fr)_380px]">
            <div>
              <Fil
                items={[
                  { nom: "Ressources", to: "/ressources" },
                  {
                    nom: cat.nom,
                    to: "/ressources/categorie/$category",
                    params: { category: cat.slug },
                  },
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
              <div className="group relative hidden aspect-[4/3] overflow-hidden rounded-[16px] min-[980px]:block">
                {estPlateforme ? (
                  // Fiche plateforme : le logo s'affiche sur l'écran du portable, comme sur les cartes.
                  <EcranPlateforme
                    photo={photoFiche(fiche)}
                    nom={p.nom}
                    logo={logoPlateforme(p.logo, "ecran")}
                    tailles="380px"
                    chargement="haute"
                  />
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
              <EncartFinal />
              <Ancres racine={corps} />
            </div>
            {/* Seul le sommaire est collant ; la carte agent, claire, reste en tête de colonne. */}
            <aside className="hidden flex-col gap-4 min-[980px]:flex">
              <div className="rounded-[14px] border border-[var(--border)] bg-white p-[18px]">
                <span className="eyebrow" style={{ color: "var(--ink)" }}>
                  Ce que fait Granit
                </span>
                <h3 className="mt-2 font-serif text-[21px] font-normal leading-[1.2] text-[var(--text)]">
                  {titreAgent(a, p)}
                </h3>
                <p className="mt-2 text-[14.5px] text-[var(--text-soft)]">
                  20 minutes avec l'équipe, sur vos propres dossiers.
                </p>
                <Link to="/demo" className="btn-primary mt-3.5 flex w-full justify-center">
                  Voir la démo
                </Link>
              </div>
              <div className="sticky top-[88px]">
                <Sommaire entrees={entrees} />
              </div>
            </aside>
          </div>
        </div>
        <ALireEnsuite article={a} />
      </div>
    </SiteLayout>
  );
}
