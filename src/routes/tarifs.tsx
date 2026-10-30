import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { Reveal } from "@/components/Reveal";
import { useLanguage } from "@/lib/i18n";
import { JsonLd } from "@/components/JsonLd";
import { Faq } from "@/components/ressources/article/Fin";
import { SITE_URL, faqPageLd, organizationRef } from "@/lib/seo";

export const Route = createFileRoute("/tarifs")({
  head: () => ({
    meta: [
      { title: "Tarifs des agents IA pour la santé - Granit" },
      {
        name: "description",
        content:
          "À partir de 199 € HT par mois et par centre, 149 € HT de 5 à 10 centres, plus un coût à l'usage par agent. Hébergement HDS inclus, résiliable avec 30 jours de préavis.",
      },
      { property: "og:title", content: "Tarifs des agents IA pour la santé - Granit" },
      {
        property: "og:description",
        content:
          "À partir de 199 € HT par mois et par centre, plus un coût à l'usage par agent. Hébergement HDS inclus.",
      },
    ],
  }),
  component: TarifsPage,
});

const content = {
  fr: {
    eyebrow: "Tarifs",
    title: "Simple, lisible, à l'usage.",
    intro: "Un forfait plateforme mensuel par centre, puis un coût à l'usage par agent selon les workflows activés et le volume traité.",
    summaryLabel: "En bref",
    summary:
      "Granit se paie par centre et par mois : à partir de 199 € HT pour un centre, à partir de 149 € HT par centre de 5 à 10 centres, sur devis au-delà de 10 centres. S'ajoute un coût à l'usage par agent, selon les workflows activés et le volume traité. L'hébergement HDS, les connecteurs et le support sont inclus, et le contrat se résilie à tout moment avec 30 jours de préavis.",
    tiersTitle: "Prix par centre",
    faqTitle: "Questions fréquentes",
    faq: [
      {
        question: "Combien coûte Granit ?",
        answer:
          "Un forfait plateforme mensuel par centre : à partir de 199 € HT par mois pour un centre, à partir de 149 € HT par mois et par centre de 5 à 10 centres, sur devis au-delà de 10 centres. S'y ajoute un coût à l'usage par agent. Le prix exact figure dans le devis.",
      },
      {
        question: "Y a-t-il un engagement de durée ?",
        answer:
          "Nos conditions générales de vente ne prévoient pas de durée minimale : le client peut résilier à tout moment, par email, avec un préavis de 30 jours, sans pénalité ni frais.",
      },
      {
        question: "Comment est calculé le coût à l'usage ?",
        answer:
          "Il dépend des agents activés, des workflows qu'ils prennent en charge et du volume qu'ils traitent. Il s'ajoute au forfait plateforme et il est détaillé dans le devis.",
      },
      {
        question: "Qu'est-ce qui est compris dans le forfait ?",
        answer:
          "L'accès à la plateforme Granit, des agents IA configurés sur mesure, plus de 50 connecteurs natifs (AMC, RO, SESAM-Vitale, NOEMIE, SIH, LGO), la mise en production, l'hébergement HDS, un support dédié et la réversibilité totale de vos données.",
      },
      {
        question: "Quelles plateformes de tiers payant sont couvertes ?",
        answer:
          "Granit travaille avec toutes les plateformes de tiers payant. Les agents se branchent aussi sur votre logiciel métier, sans migration ni intégration API.",
      },
      {
        question: "Nos données de santé sont-elles protégées ?",
        answer:
          "Oui. Granit est certifié HDS et l'hébergement HDS est inclus dans tous les plans. Les données sont hébergées en France ; le détail des garanties est sur la page Sécurité.",
      },
    ],
    tiers: [
      { label: "1 centre", price: "À partir de 199€", suffix: "/ mois HT par centre", desc: "Pour lancer Granit sur un point de vente." },
      { label: "5 à 10 centres", price: "À partir de 149€", suffix: "/ mois HT par centre", desc: "Tarif dégressif pour les groupes en développement.", featured: true, save: "−25%" },
      { label: "Plus de 10 centres", price: "Sur devis", suffix: "déploiement, support et volumes adaptés", desc: "Tarification réseau, support dédié et SLA renforcés." },
    ],
    usage: "+ un coût à l'usage par agent",
    included: "Inclus dans tous les plans",
    cta: "Demander une démo gratuite",
    includes: [
      "Accès à la plateforme Granit",
      "Agents IA configurés sur mesure",
      "Connecteurs natifs (50+) : AMC, RO, SESAM-Vitale, NOEMIE, SIH, LGO",
      "Mise en production rapide",
      "Hébergement HDS inclus",
      "Support dédié",
      "Réversibilité totale",
    ],
  },
  en: {
    eyebrow: "Pricing",
    title: "Simple, clear, usage-based.",
    intro: "A monthly platform fee per center, then a usage fee per agent based on enabled workflows and processed volume.",
    summaryLabel: "In short",
    summary:
      "Granit is billed per center and per month: from €199 excl. VAT for one center, from €149 per center for 5 to 10 centers, custom pricing above 10 centers. A usage fee per agent is added, based on enabled workflows and processed volume. HDS hosting, connectors and support are included, and the contract can be cancelled at any time with 30 days' notice.",
    tiersTitle: "Price per center",
    faqTitle: "Frequently asked questions",
    faq: [
      {
        question: "How much does Granit cost?",
        answer:
          "A monthly platform fee per center: from €199 excl. VAT per month for one center, from €149 per center for 5 to 10 centers, custom pricing above 10 centers. A usage fee per agent is added. The exact price is set in the quote.",
      },
      {
        question: "Is there a minimum commitment?",
        answer:
          "Our terms of sale set no minimum term: the client can cancel at any time by email with 30 days' notice, with no penalty or fee.",
      },
      {
        question: "How is the usage fee calculated?",
        answer:
          "It depends on the agents enabled, the workflows they handle and the volume they process. It comes on top of the platform fee and is detailed in the quote.",
      },
      {
        question: "What is included in the platform fee?",
        answer:
          "Access to the Granit platform, custom-configured AI agents, 50+ native connectors, production rollout, HDS hosting, dedicated support and full data reversibility.",
      },
      {
        question: "Which third-party payment platforms are covered?",
        answer:
          "Granit works with every third-party payment platform. Agents also plug into your practice software, with no migration or API integration.",
      },
      {
        question: "Is our health data protected?",
        answer:
          "Yes. Granit is HDS certified and HDS hosting is included in every plan. Data is hosted in France; see the Security page for details.",
      },
    ],
    tiers: [
      { label: "1 center", price: "From €199", suffix: "/ month excl. VAT per center", desc: "To launch Granit on a single point of sale." },
      { label: "5 to 10 centers", price: "From €149", suffix: "/ month excl. VAT per center", desc: "Degressive pricing for growing groups.", featured: true, save: "−25%" },
      { label: "More than 10 centers", price: "Custom", suffix: "deployment, support and volumes adapted", desc: "Network pricing, dedicated support and stronger SLAs." },
    ],
    usage: "+ a usage fee per agent",
    included: "Included in every plan",
    cta: "Book a free demo",
    includes: [
      "Access to the Granit platform",
      "Custom-configured AI agents",
      "50+ native connectors: insurers, public payer, SESAM-Vitale, NOEMIE, hospital systems, ERPs",
      "Fast production deployment",
      "HDS hosting included",
      "Dedicated support",
      "Full reversibility",
    ],
  },
};

/** SoftwareApplication avec les prix publics de la page (HT, « à partir de »), + FAQPage. */
const tarifsLd = [
  {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Granit",
    url: `${SITE_URL}/tarifs`,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    description:
      "Agents IA qui automatisent le back-office administratif des professionnels de santé : tiers payant, facturation, traitement des rejets, recouvrement.",
    publisher: organizationRef,
    offers: [
      {
        "@type": "Offer",
        name: "1 centre",
        price: "199",
        priceCurrency: "EUR",
        priceSpecification: {
          "@type": "UnitPriceSpecification",
          minPrice: 199,
          priceCurrency: "EUR",
          valueAddedTaxIncluded: false,
          unitText: "par mois et par centre, hors coût à l'usage par agent",
        },
        url: `${SITE_URL}/tarifs`,
      },
      {
        "@type": "Offer",
        name: "5 à 10 centres",
        price: "149",
        priceCurrency: "EUR",
        eligibleQuantity: {
          "@type": "QuantitativeValue",
          minValue: 5,
          maxValue: 10,
          unitText: "centres",
        },
        priceSpecification: {
          "@type": "UnitPriceSpecification",
          minPrice: 149,
          priceCurrency: "EUR",
          valueAddedTaxIncluded: false,
          unitText: "par mois et par centre, hors coût à l'usage par agent",
        },
        url: `${SITE_URL}/tarifs`,
      },
    ],
  },
  faqPageLd(content.fr.faq),
];

function TarifsPage() {
  const { lang } = useLanguage();
  const t = content[lang];
  return (
    <SiteLayout>
      <JsonLd data={tarifsLd} />
      <section className="mx-auto max-w-[1280px] px-6 pt-24 pb-12 text-center">
        <Reveal>
          <div className="eyebrow mb-5">{t.eyebrow}</div>
          <h1 className="h1-hero mx-auto max-w-3xl" style={{ fontSize: "clamp(40px,5vw,76px)" }}>
            {t.title}
          </h1>
          <p className="body-lg mx-auto mt-8 max-w-xl">{t.intro}</p>
          <p
            className="mx-auto mt-6 max-w-2xl text-[14px] leading-[1.7]"
            style={{ color: "var(--text-soft)" }}
          >
            <strong style={{ color: "var(--text)", fontWeight: 600 }}>{t.summaryLabel} :</strong>{" "}
            {t.summary}
          </p>
        </Reveal>
      </section>

      <section className="relative mx-auto max-w-[1280px] px-6 pb-16">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 -z-10 mx-auto h-[420px] max-w-[900px] opacity-60"
          style={{
            background:
              "radial-gradient(ellipse at center, color-mix(in oklab, var(--terra) 14%, transparent), transparent 70%)",
          }}
        />
        <Reveal>
          <h2 className="eyebrow mb-6 text-center">{t.tiersTitle}</h2>
          <div className="grid gap-5 md:grid-cols-3">
            {t.tiers.map((tier) => {
              const featured = (tier as { featured?: boolean }).featured;
              const save = (tier as { save?: string }).save;
              return (
                <div
                  key={tier.label}
                  className="card-hover relative flex flex-col rounded-[18px] p-8"
                  style={{
                    background: featured
                      ? "linear-gradient(180deg, rgba(255,255,255,0.95), rgba(255,255,255,0.75))"
                      : "rgba(255,255,255,0.55)",
                    backdropFilter: "blur(14px)",
                    WebkitBackdropFilter: "blur(14px)",
                    border: featured
                      ? "1px solid color-mix(in oklab, var(--terra) 45%, transparent)"
                      : "1px solid color-mix(in oklab, var(--border) 70%, transparent)",
                    boxShadow: featured ? "0 30px 70px -30px color-mix(in oklab, var(--terra) 35%, transparent)" : undefined,
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div
                      className="text-[11px] uppercase tracking-[0.06em]"
                      style={{ fontFamily: "var(--font-mono)", color: "var(--text-muted)" }}
                    >
                      {tier.label}
                    </div>
                    {save && (
                      <span
                        className="rounded-full px-2 py-0.5 text-[10.5px]"
                        style={{
                          background: "color-mix(in oklab, var(--terra) 12%, transparent)",
                          color: "var(--terra)",
                          fontFamily: "var(--font-mono)",
                          fontWeight: 600,
                        }}
                      >
                        {save}
                      </span>
                    )}
                  </div>
                  <div className="mt-7 font-serif leading-none" style={{ fontSize: "clamp(34px,3.4vw,44px)", letterSpacing: "-0.025em", color: featured ? "var(--terra)" : "var(--text)" }}>
                    {tier.price}
                  </div>
                  <div className="mt-3 text-[12.5px]" style={{ color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
                    {tier.suffix}
                  </div>
                  <p className="mt-5 flex-1 text-[14px] leading-[1.6]" style={{ color: "var(--text-soft)" }}>
                    {tier.desc}
                  </p>
                </div>
              );
            })}
          </div>
          <p
            className="mt-8 text-center text-[13px]"
            style={{ color: "var(--terra)", fontFamily: "var(--font-mono)" }}
          >
            {t.usage}
          </p>
        </Reveal>
      </section>

      <section className="mx-auto max-w-[1280px] px-6 pb-28">
        <Reveal>
          <div className="mx-auto max-w-2xl rounded-[12px] border p-10" style={{ borderColor: "var(--border)", background: "var(--bg2)" }}>
            <h2 className="eyebrow mb-4">{t.included}</h2>
            <ul className="space-y-2.5">
              {t.includes.map((f) => (
                <li key={f} className="flex items-start gap-2 text-[14px]" style={{ color: "var(--text-soft)" }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mt-1 shrink-0" style={{ color: "var(--terra)" }}>
                    <path d="M5 12l5 5L20 7" />
                  </svg>
                  {f}
                </li>
              ))}
            </ul>
            <div className="mt-10">
              <Link to="/" hash="demo" className="btn-primary w-full justify-center">
                {t.cta} <span className="arrow">↗</span>
              </Link>
            </div>
          </div>
        </Reveal>
        <div className="mx-auto max-w-2xl">
          <Faq items={t.faq} titre={t.faqTitle} />
        </div>
      </section>
    </SiteLayout>
  );
}
