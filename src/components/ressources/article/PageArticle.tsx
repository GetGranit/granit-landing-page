// Page d'un article JSON du moteur (gabarit §3, blocs 1 à 15).
import type { CSSProperties } from "react";
import { Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { categorie, dateFr, titreCourt } from "@/lib/ressources/contenu";
import type { Plateforme, RessourceJson } from "@/lib/ressources/types";
import { Annuaire } from "../Annuaire";
import { MarquePlateforme, TitreItalique } from "../Cartes";
import { Fil } from "../Fil";
import { SousNav } from "../Onglets";
import { FicheIdentite } from "./BlocsPlateforme";
import { Corps } from "./Corps";
import { ALireEnsuite, EncartFinal, Faq, Sources } from "./Fin";
import { Sommaire, SommaireMobile, type Entree } from "./Sommaire";

/** Bandeau des pages d'aperçu (content/apercu), jamais en production. */
function BandeauPreview() {
  return (
    <div className="bg-[#1c1108] px-4 py-2 text-center font-mono text-[12px] uppercase tracking-[0.12em] text-[#f2a48f]">
      Aperçu, non publié
    </div>
  );
}

function Signature({ a }: { a: RessourceJson }) {
  const nom = a.author?.name || "l'équipe Granit";
  return (
    <div className="mt-5 flex flex-wrap items-center gap-x-[18px] gap-y-2 text-[14px] text-[var(--text-soft)]">
      <span className="flex items-center gap-2">
        {a.author?.photo ? (
          <img src={a.author.photo} alt="" width={30} height={30} className="size-[30px] rounded-full object-cover" />
        ) : (
          <span aria-hidden className="grid size-[30px] place-items-center rounded-full border border-[var(--border)] bg-[var(--bg3)] text-[13px] font-semibold">
            {nom.slice(0, 1).toUpperCase()}
          </span>
        )}
        <span>
          Par {nom}
          {a.author?.jobTitle ? `, ${a.author.jobTitle}` : ""}
        </span>
      </span>
      {a.reviewer && (
        <span className="inline-flex items-center gap-1.5 font-semibold text-[#2e6b3c]">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden>
            <path d="M20 6 9 17l-5-5" />
          </svg>
          Relu par {a.reviewer}
        </span>
      )}
      <span>
        {a.type === "plateforme" && a.checkedOn
          ? `Informations relevées le ${dateFr(a.checkedOn, true)}`
          : `Mis à jour le ${dateFr(a.dateModified, true)}`}
      </span>
      <span>{a.readTime} min de lecture</span>
    </div>
  );
}

/** Titre de la carte agent ; « vos PEC {nom} » seulement si Granit a un connecteur pour ce portail. */
function titreAgent(a: RessourceJson, p: Plateforme | null): string {
  const connecteur = p && Object.keys(p.sources).some((k) => k.startsWith("granit"));
  if (a.type === "plateforme" && p && connecteur) return `L'agent dépose vos PEC ${p.nom}`;
  return categorie(a.category)!.agent;
}

export function PageArticle({ article: a, plateforme: p }: { article: RessourceJson; plateforme: Plateforme | null }) {
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

  return (
    <SiteLayout>
      {a.preview && <BandeauPreview />}
      <SousNav actif={a.category === "glossaire" ? "glossaire" : a.category} />
      <header className="relative overflow-hidden border-b border-[var(--border)]" style={{ background: cat.tint }}>
        {!estPlateforme && (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 right-0 hidden w-[38%] bg-cover bg-center min-[980px]:block"
            style={{
              backgroundImage: `url(/covers/${a.slug}.svg)`,
              maskImage: "linear-gradient(to right, transparent, black 60%)",
              WebkitMaskImage: "linear-gradient(to right, transparent, black 60%)",
            }}
          />
        )}
        <div className="relative mx-auto max-w-[1280px] px-4 pb-[30px] pt-[34px] md:px-6">
          <Fil
            items={[
              { nom: "Ressources", to: "/ressources" },
              { nom: cat.nom, to: "/ressources/categorie/$category", params: { category: cat.slug } },
              { nom: titreCourt(a.title) },
            ]}
          />
          <div className={estPlateforme ? "mt-4 flex items-center gap-[18px]" : "mt-4"}>
            {estPlateforme && <MarquePlateforme nom={p.nom} logo={p.logo} taille="xl" />}
            <h1 className="max-w-[22ch] font-serif text-[clamp(32px,4.4vw,54px)] font-normal leading-[1.08] tracking-[-0.015em] [text-wrap:balance]">
              <TitreItalique titre={a.title} ink={cat.ink} />
            </h1>
          </div>
          <Signature a={a} />
        </div>
      </header>

      <div
        className="mx-auto grid max-w-[1280px] gap-6 px-4 py-10 md:px-6 min-[980px]:grid-cols-[minmax(0,1fr)_300px] min-[980px]:gap-14"
        style={teinte}
      >
        <div className="ress-corps min-w-0">
          <SommaireMobile entrees={entrees} />
          <Corps html={a.contentHtml} plateforme={p} insertion={insertion} />
          <Faq items={a.faqItems} />
          <Sources article={a} plateforme={p} />
          <EncartFinal />
        </div>
        <aside className="hidden min-[980px]:block">
          <div className="sticky top-[88px] flex flex-col gap-4">
            <Sommaire entrees={entrees} />
            <div className="rounded-[14px] bg-[#1c1108] p-[18px] text-[#f6efe4]">
              <span className="eyebrow" style={{ color: "#f2a48f" }}>
                Ce que fait Granit
              </span>
              <h3 className="mt-2 font-serif text-[21px] font-normal leading-[1.2]">{titreAgent(a, p)}</h3>
              <p className="mt-2 text-[14.5px] text-[#c9bfb0]">
                20 minutes avec l'équipe, sur vos propres dossiers.
              </p>
              <Link to="/demo" className="btn-primary mt-3.5 flex w-full justify-center">
                Voir la démo
              </Link>
            </div>
          </div>
        </aside>
      </div>
      <ALireEnsuite article={a} />
    </SiteLayout>
  );
}
