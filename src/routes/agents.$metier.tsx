import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import type { CSSProperties } from "react";
import { SiteLayout } from "@/components/SiteLayout";
import { Reveal } from "@/components/Reveal";
import { JsonLd } from "@/components/JsonLd";
import { AppelFinal, Dossier, FaqAgents } from "@/components/agents/Blocs";
import { SequenceHero } from "@/components/agents/Pastilles";
import { FondPage } from "@/components/agents/FondDegrade";
import {
  CADRAGES,
  METIERS,
  PHOTOS,
  PUBLIES,
  SLUGS_METIERS,
  TAILLES,
  estSlugMetier,
  type SlugMetier,
} from "@/components/agents/metiers";
import { PAGES } from "@/components/agents/pages";
import { useLanguage, type Lang } from "@/lib/i18n";
import { SITE_URL, faqPageLd, organizationRef } from "@/lib/seo";

/**
 * /agents/<slug> : une page par métier, toutes sur le même gabarit (hero photo, garanties, agents,
 * un dossier de bout en bout, logiciels et plateformes, témoignage s'il existe, FAQ, appel).
 * Un slug inconnu : 404. Un métier pas encore publié : une page « bientôt », en noindex.
 */
export const Route = createFileRoute("/agents/$metier")({
  loader: ({ params }) => {
    if (!estSlugMetier(params.metier)) throw notFound();
    return { slug: params.metier, publie: PUBLIES.includes(params.metier) };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return {};
    const m = METIERS.fr[loaderData.slug];
    const page = PAGES[loaderData.slug]?.fr;
    if (!loaderData.publie || !page)
      return {
        meta: [
          { title: `${m.nom} : bientôt chez Granit` },
          { name: "robots", content: "noindex, follow" },
          { name: "description", content: m.accroche },
        ],
      };
    return {
      meta: [
        { title: page.titreSeo },
        { name: "description", content: page.descriptionSeo },
        { property: "og:title", content: page.titreSeo },
        { property: "og:description", content: page.descriptionSeo },
      ],
    };
  },
  component: PageMetierRoute,
});

const ui = {
  fr: {
    demo: "Demander une démo",
    agents: "Comment ça marche",
    exemple: "Exemple",
    garantiesTitre: "Ce que Granit garantit",
    agentsTitre: ["Les agents", "de votre magasin."] as [string, string],
    dossierEyebrow: "Un dossier de bout en bout",
    outilsEyebrow: "Vos logiciels et plateformes",
    outilsTitre: ["Ils travaillent là où", "vous travaillez déjà."] as [string, string],
    logiciels: "Logiciels",
    plateformes: "Plateformes de tiers payant",
    etAutres: "et les autres",
    faqTitre: "Questions fréquentes",
    finTitre: ["Voyez les agents", "sur vos propres dossiers."] as [string, string],
    finTexte:
      "En visio, sur vos cas et dans vos logiciels. Vous repartez avec ce que Granit prendrait en charge chez vous.",
    ressources: "Lire nos guides pour votre métier",
    autres: "Les autres métiers",
    tous: "Tous les métiers",
    bientotEyebrow: "Bientôt",
    bientotTexte:
      "Cette page est en préparation. Les agents de votre métier, nous pouvons déjà vous les montrer sur vos dossiers.",
  },
  en: {
    demo: "Book a demo",
    agents: "How it works",
    exemple: "Example",
    garantiesTitre: "What Granit guarantees",
    agentsTitre: ["The agents", "for your store."] as [string, string],
    dossierEyebrow: "One file, end to end",
    outilsEyebrow: "Your software and platforms",
    outilsTitre: ["They work where", "you already work."] as [string, string],
    logiciels: "Software",
    plateformes: "Third-party payment platforms",
    etAutres: "and the others",
    faqTitre: "Frequently asked questions",
    finTitre: ["See the agents", "on your own files."] as [string, string],
    finTexte:
      "On a video call, on your cases and in your software. You leave knowing what Granit would take over for you.",
    ressources: "Read our guides for your trade",
    autres: "Other trades",
    tous: "All trades",
    bientotEyebrow: "Coming soon",
    bientotTexte:
      "This page is being prepared. We can already show you the agents of your trade on your own files.",
  },
};

/** Places des pastilles sur la photo du hero (ordinateur) : sous les visages, côté voile. */
const PLACES = ["5% 52%", "20% 64%", "6% 76%", "18% 86%"];

/** Cadrage de la photo du hero, [mobile, ordinateur] : les deux visages dans le cadre, hors du voile. */
const CADRAGES_HERO: Partial<Record<SlugMetier, [string, string]>> = {
  optique: ["45% 30%", "30% 30%"],
};

function PageMetierRoute() {
  const { slug, publie } = Route.useLoaderData();
  const { lang } = useLanguage();
  if (!publie || !PAGES[slug]) return <Bientot slug={slug} lang={lang} />;
  return <PageMetier slug={slug} lang={lang} />;
}

function PageMetier({ slug, lang }: { slug: SlugMetier; lang: Lang }) {
  const t = ui[lang];
  const m = METIERS[lang][slug];
  const p = PAGES[slug]![lang];
  const pFr = PAGES[slug]!.fr;
  const cadrage = CADRAGES_HERO[slug] ?? [CADRAGES[slug], CADRAGES[slug]];
  const etapes = p.etapesHero.map((e, k) => ({ ...e, place: PLACES[k % PLACES.length] }));
  const ld = [
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name: pFr.titreSeo,
      url: `${SITE_URL}/agents/${slug}`,
      description: pFr.descriptionSeo,
      provider: organizationRef,
      areaServed: { "@type": "Country", name: "France" },
      audience: { "@type": "Audience", audienceType: METIERS.fr[slug].nom },
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: `Les agents Granit : ${METIERS.fr[slug].nom}`,
        itemListElement: METIERS.fr[slug].agents.map((a) => ({
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: a.titre,
            description: a.texte,
            category: a.tache,
          },
        })),
      },
    },
    faqPageLd(pFr.faq),
  ];

  return (
    <SiteLayout fond="transparent">
      <FondPage />
      <JsonLd data={ld} />

      {/* 1 · Hero photo : titre à gauche sur un voile neutre, pastilles d'agent sur la photo.
          Mobile : photo en haut, titre dessous, une pastille à la fois sous le titre. */}
      <section className="px-3 pt-2 sm:px-6">
        <div className="section-sombre relative isolate mx-auto max-w-[1360px] overflow-hidden rounded-[24px] md:min-h-[640px]">
          <div className="relative h-[360px] md:absolute md:inset-y-0 md:right-0 md:h-auto md:w-[58%]">
            <img
              src={PHOTOS[slug]}
              alt={m.alt}
              width={TAILLES[slug][0]}
              height={TAILLES[slug][1]}
              className="absolute inset-0 size-full object-cover object-[var(--cm)] md:object-[var(--cd)]"
              style={{ "--cm": cadrage[0], "--cd": cadrage[1] } as CSSProperties}
            />
            <div
              className="absolute inset-0 hidden md:block"
              style={{
                background:
                  "linear-gradient(90deg, rgba(31, 53, 48, 1) 0%, rgba(31, 53, 48, 0.6) 20%, rgba(31, 53, 48, 0.1) 50%, rgba(31, 53, 48, 0) 70%)",
              }}
            />
            <div
              className="absolute inset-0 md:hidden"
              style={{
                background:
                  "linear-gradient(0deg, rgba(31, 53, 48, 1) 0%, rgba(31, 53, 48, 0.3) 28%, rgba(31, 53, 48, 0) 50%)",
              }}
            />
            <span
              className="absolute top-4 right-4 rounded-full border px-2.5 py-1 text-[11px] font-medium tracking-[0.06em] uppercase backdrop-blur-md"
              style={{
                background: "rgba(31, 53, 48, 0.46)",
                borderColor: "rgba(250, 240, 242, 0.18)",
                color: "var(--rose)",
              }}
            >
              {t.exemple}
            </span>
            <div className="hidden md:block">
              <SequenceHero etapes={etapes} />
            </div>
          </div>

          <div className="relative grid content-center gap-5 px-6 pt-1 pb-10 md:min-h-[640px] md:max-w-[52%] md:px-14 md:py-16 lg:px-16">
            <div className="eyebrow">{m.nom}</div>
            <h1
              className="h1-hero"
              style={{ fontSize: "clamp(40px, 5.2vw, 74px)", color: "var(--rose)" }}
            >
              {m.promesse[0]} <span className="accent-italic">{m.promesse[1]}</span>
            </h1>
            <p
              className="max-w-[44ch] text-[17px] leading-[1.55] md:text-[18px]"
              style={{ color: "var(--sur-encre-secondaire)" }}
            >
              {m.preuve}
            </p>
            <div className="min-h-[58px] md:hidden">
              <SequenceHero etapes={etapes} variante="ligne" />
            </div>
            <div className="mt-1 flex flex-wrap gap-3">
              <Link to="/" hash="demo" className="btn-clair">
                {t.demo} <span aria-hidden>↗</span>
              </Link>
              <a
                href="#agents"
                className="inline-flex items-center gap-2 rounded-full border px-5 py-[10px] text-[14px] font-medium transition-colors duration-200 hover:bg-[var(--encre-halo)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--menthe)]"
                style={{ borderColor: "rgba(250, 240, 242, 0.32)", color: "var(--rose)" }}
              >
                {t.agents} <span aria-hidden>↓</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 2 · Garanties */}
      <section
        className="mx-auto max-w-[1120px] px-4 pt-12 sm:px-6 md:pt-16"
        aria-label={t.garantiesTitre}
      >
        <Reveal>
          <ul
            className="grid gap-x-6 gap-y-6 rounded-[22px] border px-6 py-8 sm:grid-cols-2 md:px-10 lg:grid-cols-4"
            style={{ background: "var(--papier)", borderColor: "var(--filet)" }}
          >
            {p.garanties.map((g) => (
              <li key={g.titre}>
                <div className="flex items-start gap-2.5 text-[17px] leading-[1.3] font-medium">
                  <svg viewBox="0 0 12 12" className="mt-1 size-3.5 flex-none" aria-hidden>
                    <path
                      d="M2.5 6.2l2.3 2.3 4.7-5"
                      fill="none"
                      stroke="var(--profond)"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  {g.titre}
                </div>
                <p
                  className="mt-2 text-[15px] leading-[1.55]"
                  style={{ color: "var(--texte-secondaire)" }}
                >
                  {g.texte}
                </p>
              </li>
            ))}
          </ul>
        </Reveal>
      </section>

      {/* 3 · Les agents du métier (liste à valider par Corneille, voir metiers.ts) */}
      <section
        id="agents"
        className="mx-auto max-w-[1120px] scroll-mt-[88px] px-4 pt-16 sm:px-6 md:pt-24"
      >
        <Reveal>
          <h2 className="font-serif text-[clamp(30px,3.4vw,46px)] leading-[1.06] tracking-[-0.02em]">
            {t.agentsTitre[0]} <span className="accent-italic">{t.agentsTitre[1]}</span>
          </h2>
        </Reveal>
        <ul className="mt-9 grid gap-4 md:grid-cols-2">
          {m.agents.map((a, i) => (
            <li key={a.titre}>
              <Reveal delay={i * 0.05} className="h-full">
                <div
                  className="h-full rounded-[18px] border p-6 md:p-7"
                  style={{ background: "var(--papier)", borderColor: "var(--filet)" }}
                >
                  <span
                    className="inline-block rounded-[8px] px-2 py-0.5 text-[12px] font-medium"
                    style={{ background: "var(--succes-fond)", color: "var(--succes-texte)" }}
                  >
                    {a.tache}
                  </span>
                  <h3 className="mt-3 font-serif text-[24px] leading-[1.15]">{a.titre}</h3>
                  <p
                    className="mt-2 text-[15.5px] leading-[1.6]"
                    style={{ color: "var(--texte-secondaire)" }}
                  >
                    {a.texte}
                  </p>
                  {a.ou && (
                    <p
                      className="mt-4 border-t pt-3 text-[13.5px]"
                      style={{ borderColor: "var(--filet)", color: "var(--texte-secondaire)" }}
                    >
                      {a.ou}
                    </p>
                  )}
                </div>
              </Reveal>
            </li>
          ))}
        </ul>
      </section>

      {/* 4 · Un dossier de bout en bout */}
      <section className="mx-auto max-w-[1120px] px-4 pt-16 sm:px-6 md:pt-24">
        <div
          className="rounded-[22px] px-6 py-10 md:px-12 md:py-14"
          style={{ background: "var(--lavis)" }}
        >
          <div className="eyebrow">{t.dossierEyebrow}</div>
          <h2 className="mt-4 font-serif text-[clamp(28px,3.2vw,44px)] leading-[1.08] tracking-[-0.02em]">
            {p.dossierTitre[0]} <span className="accent-italic">{p.dossierTitre[1]}</span>
          </h2>
          <Dossier etapes={p.dossier} />
        </div>
      </section>

      {/* 5 · Logiciels et plateformes */}
      <section className="mx-auto max-w-[1120px] px-4 pt-16 sm:px-6 md:pt-24">
        <Reveal>
          <div
            className="rounded-[22px] border px-6 py-10 md:px-12 md:py-12"
            style={{ background: "var(--papier)", borderColor: "var(--filet)" }}
          >
            <div className="eyebrow">{t.outilsEyebrow}</div>
            <h2 className="mt-4 font-serif text-[clamp(28px,3.2vw,44px)] leading-[1.08] tracking-[-0.02em]">
              {t.outilsTitre[0]} <span className="accent-italic">{t.outilsTitre[1]}</span>
            </h2>
            <div className="mt-9 grid gap-8 md:grid-cols-[1fr_2fr]">
              <ListeNoms titre={t.logiciels} noms={p.logiciels} suite="…" />
              <ListeNoms titre={t.plateformes} noms={p.plateformes} suite={t.etAutres} />
            </div>
            <p
              className="mt-6 max-w-[60ch] text-[15px] leading-[1.55]"
              style={{ color: "var(--texte-secondaire)" }}
            >
              {p.plateformesNote}
            </p>
          </div>
        </Reveal>
      </section>

      {/* 6 · La preuve : seulement si un client du métier a donné son accord écrit */}
      {p.temoignage && (
        <section className="mx-auto max-w-[900px] px-4 pt-16 sm:px-6 md:pt-24">
          <figure>
            <blockquote className="font-serif text-[clamp(24px,2.6vw,34px)] leading-[1.25]">
              « {p.temoignage.citation} »
            </blockquote>
            <figcaption className="mt-4 text-[15px]" style={{ color: "var(--texte-secondaire)" }}>
              {p.temoignage.auteur}, {p.temoignage.role}
            </figcaption>
          </figure>
        </section>
      )}

      {/* 7 · FAQ du métier */}
      <div className="pt-16 md:pt-24">
        <FaqAgents titre={t.faqTitre} items={p.faq}>
          <p className="mt-6 text-[15px]">
            <Link
              to="/ressources/metier/$verticale"
              params={{ verticale: p.ressources }}
              className="font-medium underline underline-offset-4"
              style={{ color: "var(--profond)" }}
            >
              {t.ressources} →
            </Link>
          </p>
        </FaqAgents>
      </div>

      {/* 8 · Appel + autres métiers */}
      <AppelFinal titre={t.finTitre} texte={t.finTexte} bouton={t.demo}>
        <AutresMetiers slug={slug} lang={lang} />
      </AppelFinal>
    </SiteLayout>
  );
}

function ListeNoms({ titre, noms, suite }: { titre: string; noms: string[]; suite: string }) {
  return (
    <div>
      <h3 className="eyebrow">{titre}</h3>
      <ul className="mt-4 flex flex-wrap gap-2">
        {noms.map((n) => (
          <li
            key={n}
            className="rounded-full border px-4 py-2 text-[15px] font-medium"
            style={{ background: "var(--lavis)", borderColor: "var(--filet)" }}
          >
            {n}
          </li>
        ))}
        <li className="px-2 py-2 text-[15px]" style={{ color: "var(--texte-secondaire)" }}>
          {suite}
        </li>
      </ul>
    </div>
  );
}

function AutresMetiers({ slug, lang }: { slug: SlugMetier; lang: Lang }) {
  const t = ui[lang];
  return (
    <nav
      className="mt-9 border-t pt-6"
      style={{ borderColor: "rgba(250, 240, 242, 0.16)" }}
      aria-label={t.autres}
    >
      <div className="eyebrow">{t.autres}</div>
      <ul className="mt-4 flex flex-wrap gap-2">
        {SLUGS_METIERS.filter((s) => s !== slug).map((s) => (
          <li key={s}>
            <Link
              to="/agents/$metier"
              params={{ metier: s }}
              className="inline-block rounded-full border px-4 py-2 text-[14px] transition-colors hover:bg-[var(--encre-halo)]"
              style={{ borderColor: "rgba(250, 240, 242, 0.24)", color: "var(--rose)" }}
            >
              {METIERS[lang][s].nom}
            </Link>
          </li>
        ))}
        <li>
          <Link
            to="/agents"
            className="inline-block px-3 py-2 text-[14px] font-medium underline underline-offset-4"
            style={{ color: "var(--menthe)" }}
          >
            {t.tous}
          </Link>
        </li>
      </ul>
    </nav>
  );
}

/** Métier pas encore publié : une page courte, en noindex, avec l'appel démo. */
function Bientot({ slug, lang }: { slug: SlugMetier; lang: Lang }) {
  const t = ui[lang];
  const m = METIERS[lang][slug];
  return (
    <SiteLayout fond="transparent">
      <FondPage />
      <section className="mx-auto max-w-[1120px] px-4 pt-14 pb-6 sm:px-6 md:pt-20">
        <div className="eyebrow mb-5">{t.bientotEyebrow}</div>
        <h1 className="h1-hero max-w-[18ch]" style={{ fontSize: "clamp(38px, 4.6vw, 64px)" }}>
          {m.nom}
        </h1>
        <p
          className="mt-6 max-w-[56ch] text-[18px] leading-[1.55]"
          style={{ color: "var(--encre)" }}
        >
          {m.accroche}
        </p>
        <p className="mt-3 max-w-[56ch] text-[16px]" style={{ color: "var(--encre)" }}>
          {t.bientotTexte}
        </p>
        <img
          src={PHOTOS[slug]}
          alt={m.alt}
          width={TAILLES[slug][0]}
          height={TAILLES[slug][1]}
          className="mt-10 aspect-[4/3] w-full rounded-[22px] object-cover md:aspect-[16/7]"
          style={{ objectPosition: CADRAGES[slug] }}
        />
      </section>
      <AppelFinal titre={t.finTitre} texte={t.finTexte} bouton={t.demo}>
        <AutresMetiers slug={slug} lang={lang} />
      </AppelFinal>
    </SiteLayout>
  );
}
