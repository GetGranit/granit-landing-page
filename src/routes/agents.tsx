import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { Reveal } from "@/components/Reveal";
import { JsonLd } from "@/components/JsonLd";
import { SelecteurMetier } from "@/components/agents/SelecteurMetier";
import { SequenceHero, type EtapePastille } from "@/components/agents/Pastilles";
import { METIERS, SLUGS_METIERS, estSlugMetier, type SlugMetier } from "@/components/agents/metiers";
import photoHero from "@/assets/metiers/infirmiere.jpg";
import { useLanguage } from "@/lib/i18n";
import { SITE_URL, faqPageLd, organizationRef } from "@/lib/seo";

/**
 * /agents : les agents Granit par métier. Le sélecteur ouvre un métier sans recharger la page, et
 * chaque métier a son adresse (`/agents?metier=dentaire`) pour l'accueil et les campagnes.
 * Sans paramètre, aucun métier n'est choisi.
 */
export const Route = createFileRoute("/agents")({
  validateSearch: (search: Record<string, unknown>): { metier?: SlugMetier } =>
    estSlugMetier(search.metier) ? { metier: search.metier } : {},
  head: ({ match }) => {
    const m = match.search.metier ? METIERS.fr[match.search.metier] : undefined;
    const title = m ? `${m.nom} : les agents Granit` : "Les agents Granit, métier par métier";
    const description = m
      ? `${m.preuve} Ce que font les agents Granit pour les ${m.nom.toLowerCase()}, dans vos logiciels.`
      : content.fr.chapo;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
      ],
    };
  },
  component: AgentsPage,
});

const content = {
  fr: {
    eyebrow: "Agents",
    titre: ["Un agent pour chaque dossier.", "Dans la langue de votre métier."],
    chapo:
      "Droits, prises en charge, facturation, rejets, encaissement : les agents Granit font l'administratif de votre métier, dans les logiciels que vos équipes utilisent déjà.",
    demo: "Demander une démo",
    trouver: "Trouver mon métier",
    garanties: ["Conforme RGPD · HDS", "Branché sur vos portails en 48 h", "Les dossiers avancent 7 jours sur 7"],
    exemple: "Exemple",
    etapes: [
      { enCours: "Vérification des droits", fait: "Droits vérifiés", detail: "Sur la plateforme de la mutuelle", place: "9% 16%" },
      { enCours: "Saisie de la prise en charge", fait: "Prise en charge accordée", detail: "Depuis le devis du logiciel", place: "30% 44%" },
      { enCours: "Télétransmission", fait: "Facture télétransmise", detail: "Assurance Maladie et mutuelle", place: "12% 64%" },
      { enCours: "Pointage du virement", fait: "Virement pointé", detail: "Rapproché de sa facture", place: "26% 80%" },
    ] satisfies EtapePastille[],
    communEyebrow: "Dans chaque métier",
    communTitre: ["Les mêmes garanties,", "quel que soit le métier."],
    commun: [
      { titre: "Dans vos logiciels", texte: "Les agents travaillent dans les logiciels que vos équipes utilisent déjà, sur vos portails, sans API à demander." },
      { titre: "En quelques jours", texte: "Granit est branché sur vos portails en 48 h. Ensuite, les dossiers avancent 7 jours sur 7." },
      { titre: "Chaque dossier tracé", texte: "Ce qui a été fait, quand, et pourquoi un dossier attend : tout se voit, tout se vérifie." },
      { titre: "Un gestionnaire Granit", texte: "Il suit les cas particuliers et prévient l'équipe. Vous gardez la main." },
    ],
    hds: "Les données de santé sont confiées à un hébergeur certifié HDS, dans l'Union européenne. Conforme RGPD.",
    faqTitre: "Questions fréquentes",
    faq: [
      {
        question: "Qu'est-ce qu'un agent Granit ?",
        answer:
          "Un agent fait une tâche administrative précise à la place de votre équipe : vérifier les droits, saisir une prise en charge, facturer, traiter un rejet, pointer un virement, relancer un impayé. Un gestionnaire Granit suit les cas particuliers et prévient l'équipe.",
      },
      {
        question: "Faut-il changer de logiciel ou demander une API ?",
        answer:
          "Non. Les agents travaillent dans les logiciels que vos équipes utilisent déjà et sur les portails des mutuelles, comme le ferait une personne. Granit est branché sur vos portails en 48 h.",
      },
      {
        question: "Quelles plateformes de tiers payant sont couvertes ?",
        answer:
          "Granit travaille avec toutes les plateformes de tiers payant, par exemple Almerys, Viamédis, Santéclair, Kalixia ou Carte Blanche.",
      },
      {
        question: "Pour quels métiers ?",
        answer: `${SLUGS_METIERS.map((s) => METIERS.fr[s].nom).join(", ")}.`,
      },
      {
        question: "Peut-on contrôler ce que font les agents ?",
        answer:
          "Oui. Chaque dossier est tracé : ce qui a été fait, quand, et pourquoi un dossier attend. Les données de santé sont confiées à un hébergeur certifié HDS, dans l'Union européenne, conformément au RGPD.",
      },
      {
        question: "Combien coûte Granit ?",
        answer: "Granit ne facture que les dossiers traités avec succès. Le tarif standard est détaillé sur la page Tarifs.",
        tarifs: "Voir les tarifs",
      },
    ],
    finTitre: ["Voyez les agents", "sur vos propres dossiers."],
    finTexte: "En visio, sur vos cas et dans vos logiciels. Vous repartez avec ce que Granit prendrait en charge chez vous.",
  },
  en: {
    eyebrow: "Agents",
    titre: ["An agent for every file.", "In the language of your trade."],
    chapo:
      "Eligibility, coverage, billing, rejections, payments: Granit agents run the administrative work of your trade, in the software your teams already use.",
    demo: "Book a demo",
    trouver: "Find my trade",
    garanties: ["GDPR · HDS compliant", "Connected to your portals in 48 h", "Files move forward 7 days a week"],
    exemple: "Example",
    etapes: [
      { enCours: "Checking eligibility", fait: "Eligibility checked", detail: "On the insurer's platform", place: "9% 16%" },
      { enCours: "Filing the coverage request", fait: "Coverage approved", detail: "From the quote in your software", place: "30% 44%" },
      { enCours: "Transmitting", fait: "Invoice transmitted", detail: "Public scheme and insurer", place: "12% 64%" },
      { enCours: "Matching the transfer", fait: "Transfer matched", detail: "Matched to its invoice", place: "26% 80%" },
    ] satisfies EtapePastille[],
    communEyebrow: "In every trade",
    communTitre: ["The same guarantees,", "whatever your trade."],
    commun: [
      { titre: "In your software", texte: "Agents work in the software your teams already use, on your portals, with no API to request." },
      { titre: "In a few days", texte: "Granit is connected to your portals in 48 h. Then files move forward 7 days a week." },
      { titre: "Every file traced", texte: "What was done, when, and why a file is waiting: everything is visible and verifiable." },
      { titre: "A Granit case manager", texte: "Follows special cases and alerts your team. You stay in control." },
    ],
    hds: "Health data is entrusted to an HDS-certified host, in the European Union. GDPR compliant.",
    faqTitre: "Frequently asked questions",
    faq: [
      { question: "What is a Granit agent?", answer: "An agent runs one precise administrative task for your team: checking eligibility, filing coverage, billing, handling a rejection, matching a transfer, following up on an unpaid invoice. A Granit case manager follows special cases and alerts the team." },
      { question: "Do we need to change software or request an API?", answer: "No. Agents work in the software your teams already use and on insurer portals, as a person would. Granit is connected to your portals in 48 h." },
      { question: "Which third-party payment platforms are covered?", answer: "Granit works with every third-party payment platform, for example Almerys, Viamédis, Santéclair, Kalixia or Carte Blanche." },
      { question: "Which trades?", answer: `${SLUGS_METIERS.map((s) => METIERS.en[s].nom).join(", ")}.` },
      { question: "Can we control what the agents do?", answer: "Yes. Every file is traced: what was done, when, and why a file is waiting. Health data is entrusted to an HDS-certified host in the European Union, in line with GDPR." },
      { question: "How much does Granit cost?", answer: "Granit only bills files processed successfully. The standard pricing is detailed on the Pricing page.", tarifs: "See pricing" },
    ],
    finTitre: ["See the agents", "on your own files."],
    finTexte: "On a video call, on your cases and in your software. You leave knowing what Granit would take over for you.",
  },
};

/** Service + agents par métier, + FAQPage. */
const agentsLd = [
  {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Agents Granit pour l'administratif des professionnels de santé",
    url: `${SITE_URL}/agents`,
    serviceType: "Back-office administratif de santé opéré par des agents IA",
    description: content.fr.chapo,
    provider: organizationRef,
    areaServed: { "@type": "Country", name: "France" },
    audience: { "@type": "Audience", audienceType: SLUGS_METIERS.map((s) => METIERS.fr[s].nom).join(", ") },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Les agents Granit par métier",
      itemListElement: SLUGS_METIERS.flatMap((s) =>
        METIERS.fr[s].agents.map((a) => ({
          "@type": "Offer",
          url: `${SITE_URL}/agents?metier=${s}`,
          itemOffered: { "@type": "Service", name: a.titre, description: a.texte, category: `${METIERS.fr[s].nom} · ${a.tache}` },
        })),
      ),
    },
  },
  faqPageLd(content.fr.faq),
];

function AgentsPage() {
  const { lang } = useLanguage();
  const t = content[lang];
  const { metier } = Route.useSearch();

  return (
    <SiteLayout>
      <JsonLd data={agentsLd} />

      {/* Hero : la photo à droite (en haut sur mobile), un voile neutre côté texte, les pastilles d'agent. */}
      <section className="px-3 pt-2 sm:px-6">
        <div className="section-sombre relative isolate mx-auto max-w-[1360px] overflow-hidden rounded-[24px] md:min-h-[620px]">
          <div className="relative h-[400px] md:absolute md:inset-y-0 md:right-0 md:h-auto md:w-[54%]">
            <img src={photoHero} alt="" width={520} height={780} className="absolute inset-0 size-full object-cover" style={{ objectPosition: "50% 30%" }} />
            <div
              className="absolute inset-0 hidden md:block"
              style={{ background: "linear-gradient(90deg, rgba(31, 53, 48, 1) 0%, rgba(31, 53, 48, 0.55) 22%, rgba(31, 53, 48, 0.08) 55%, rgba(31, 53, 48, 0) 75%)" }}
            />
            <div
              className="absolute inset-0 md:hidden"
              style={{ background: "linear-gradient(0deg, rgba(31, 53, 48, 1) 0%, rgba(31, 53, 48, 0.4) 30%, rgba(31, 53, 48, 0) 55%)" }}
            />
            <span
              className="absolute top-4 right-4 rounded-full border px-2.5 py-1 text-[11px] font-medium tracking-[0.06em] uppercase backdrop-blur-md"
              style={{ background: "rgba(31, 53, 48, 0.46)", borderColor: "rgba(250, 240, 242, 0.18)", color: "var(--rose)" }}
            >
              {t.exemple}
            </span>
            <SequenceHero etapes={t.etapes} />
          </div>

          <div className="relative grid content-center gap-5 px-6 pt-2 pb-10 md:min-h-[620px] md:max-w-[58%] md:px-14 md:py-16 lg:px-16">
            <div className="eyebrow">{t.eyebrow}</div>
            <h1 className="h1-hero" style={{ fontSize: "clamp(40px, 5.2vw, 74px)", color: "var(--rose)" }}>
              {t.titre[0]} <span className="accent-italic">{t.titre[1]}</span>
            </h1>
            <p className="max-w-[44ch] text-[17px] leading-[1.55] md:text-[18px]" style={{ color: "var(--sur-encre-secondaire)" }}>
              {t.chapo}
            </p>
            <div className="mt-1 flex flex-wrap gap-3">
              <Link to="/" hash="demo" className="btn-clair">
                {t.demo} <span aria-hidden>↗</span>
              </Link>
              <a
                href="#metiers"
                className="inline-flex items-center gap-2 rounded-full border px-5 py-[10px] text-[14px] font-medium transition-colors duration-200 hover:bg-[var(--encre-halo)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--menthe)]"
                style={{ borderColor: "rgba(250, 240, 242, 0.32)", color: "var(--rose)" }}
              >
                {t.trouver} <span aria-hidden>↓</span>
              </a>
            </div>
            <ul className="mt-1 flex flex-wrap gap-x-5 gap-y-2 text-[13px]" style={{ color: "var(--sur-encre-secondaire)" }}>
              {t.garanties.map((g) => (
                <li key={g} className="flex items-center gap-2">
                  <svg viewBox="0 0 12 12" className="size-3" aria-hidden>
                    <path d="M2.5 6.2l2.3 2.3 4.7-5" fill="none" stroke="var(--menthe)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {g}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <SelecteurMetier lang={lang} metier={metier} />

      <section className="mx-auto max-w-[1120px] px-4 py-12 sm:px-6 md:py-16">
        <Reveal>
          <div className="section-sombre rounded-[22px] px-6 py-10 md:px-12 md:py-14">
            <div className="eyebrow">{t.communEyebrow}</div>
            <h2 className="mt-4 font-serif text-[clamp(28px,3.2vw,44px)] leading-[1.08] tracking-[-0.02em]">
              {t.communTitre[0]} <span className="accent-italic">{t.communTitre[1]}</span>
            </h2>
            <ul className="mt-9 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {t.commun.map((c) => (
                <li key={c.titre} className="border-t pt-5" style={{ borderColor: "rgba(250, 240, 242, 0.16)" }}>
                  <div className="text-[17px] font-medium">{c.titre}</div>
                  <p className="mt-2 text-[15px] leading-[1.55]" style={{ color: "var(--sur-encre-secondaire)" }}>
                    {c.texte}
                  </p>
                </li>
              ))}
            </ul>
            <p className="mt-9 text-[14px]" style={{ color: "var(--sur-encre-secondaire)" }}>
              {t.hds}
            </p>
          </div>
        </Reveal>
      </section>

      <section className="mx-auto max-w-[760px] px-4 pb-8 sm:px-6">
        <Reveal>
          <div className="ress-faq">
            <h2 className="font-serif text-[clamp(26px,2.6vw,34px)] leading-[1.1] tracking-[-0.015em]">{t.faqTitre}</h2>
            <div className="mt-6">
              {t.faq.map((f, i) => (
                <details key={f.question} open={i === 0} className="border-t py-1 last:border-b" style={{ borderColor: "var(--filet)" }}>
                  <summary className="flex cursor-pointer list-none justify-between gap-4 rounded-[4px] py-3.5 font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--profond)] [&::-webkit-details-marker]:hidden">
                    {f.question}
                    <span aria-hidden className="plus grid size-6 shrink-0 place-items-center text-[22px] leading-none font-normal" style={{ color: "var(--texte-secondaire)" }}>
                      +
                    </span>
                  </summary>
                  <p className="pb-3.5 text-[16px] leading-[1.6]" style={{ color: "var(--texte-secondaire)" }}>
                    {f.answer}
                    {"tarifs" in f && (
                      <>
                        {" "}
                        <Link to="/tarifs" className="font-medium underline underline-offset-4" style={{ color: "var(--profond)" }}>
                          {f.tarifs}
                        </Link>
                      </>
                    )}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </Reveal>
      </section>

      <section className="mx-auto max-w-[1120px] px-4 pt-10 pb-24 sm:px-6">
        <Reveal>
          <div className="section-sombre flex flex-col items-start justify-between gap-6 rounded-[22px] px-6 py-10 md:flex-row md:items-center md:px-12 md:py-12">
            <div>
              <h2 className="font-serif text-[clamp(28px,3vw,40px)] leading-[1.08] tracking-[-0.02em]">
                {t.finTitre[0]} <span className="accent-italic">{t.finTitre[1]}</span>
              </h2>
              <p className="mt-3 max-w-[52ch] text-[16px] leading-[1.55]" style={{ color: "var(--sur-encre-secondaire)" }}>
                {t.finTexte}
              </p>
            </div>
            <Link to="/" hash="demo" className="btn-clair flex-none">
              {t.demo} <span aria-hidden>↗</span>
            </Link>
          </div>
        </Reveal>
      </section>
    </SiteLayout>
  );
}
