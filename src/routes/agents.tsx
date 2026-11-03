import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { Reveal } from "@/components/Reveal";
import { useLanguage } from "@/lib/i18n";
import { JsonLd } from "@/components/JsonLd";
import { Faq } from "@/components/ressources/article/Fin";
import { SITE_URL, faqPageLd, organizationRef } from "@/lib/seo";

export const Route = createFileRoute("/agents")({
  head: () => ({
    meta: [
      { title: "Agents IA tiers payant et back-office santé - Granit" },
      { name: "description", content: "Les agents IA Granit par verticale santé et par cas d'usage : tiers-payant, recouvrement, admissions, facturation, conformité." },
      { property: "og:title", content: "Agents IA tiers payant et back-office santé - Granit" },
      { property: "og:description", content: "Des agents opérationnels pour chaque verticale santé et chaque workflow administratif." },
    ],
  }),
  component: AgentsPage,
});

const content = {
  fr: {
    eyebrow: "Agents",
    title: "Un catalogue d'agents pour chaque verticale santé.",
    intro: "Granit déploie des agents spécialisés par métier et par cas d'usage. Ils opèrent sur vos outils existants, sans migration ni intégration API.",
    summaryLabel: "En bref :",
    summary:
      "Granit déploie des agents IA qui automatisent le back-office administratif des professionnels de santé : tiers payant, devis, facturation, traitement des rejets, rapprochement bancaire et recouvrement. Chaque agent est spécialisé par métier (optique, audio, dentaire, pharmacie, EHPAD, cliniques, laboratoires) et travaille sur vos outils existants, sans migration ni intégration API.",
    filtersTitle: "Les agents par métier et par cas d'usage",
    catalogTitle: "Le catalogue",
    faqTitle: "Questions fréquentes",
    faq: [
      {
        question: "Qu'est-ce qu'un agent IA Granit ?",
        answer:
          "Un agent spécialisé par métier et par cas d'usage, qui exécute une tâche administrative à votre place : demande de prise en charge, devis tiers payant, télétransmission, traitement des rejets, rapprochement bancaire ou relance des impayés.",
      },
      {
        question: "Faut-il changer de logiciel ou demander une API ?",
        answer:
          "Non. Les agents opèrent sur vos outils existants, sans migration ni intégration API : ils se branchent sur votre logiciel métier et sur les portails que vous utilisez déjà.",
      },
      {
        question: "Quelles plateformes de tiers payant sont couvertes ?",
        answer:
          "Granit travaille avec toutes les plateformes de tiers payant, par exemple Viamedis, Almerys, Santéclair, SP Santé, Itelis ou iSanté.",
      },
      {
        question: "Pour quels métiers de santé ?",
        answer:
          "Optique, audioprothèse, dentaire, orthodontie, pharmacie, EHPAD, cliniques, laboratoires de biologie et laboratoires pharmaceutiques.",
      },
      {
        question: "Peut-on contrôler ce que font les agents ?",
        answer:
          "Oui. Chaque action d'agent est journalisée, horodatée et exportable, et chaque décision reste révisable par un humain. Les données sont stockées chez un hébergeur certifié HDS.",
      },
      {
        question: "Combien coûte un agent ?",
        answer:
          "Granit se paie par centre : à partir de 199 € HT par mois pour un centre, plus un coût à l'usage par agent selon les workflows activés et le volume traité. Le détail est sur la page Tarifs.",
      },
    ],
    verticalLabel: "Verticales couvertes",
    useCaseLabel: "Cas d'usage",
    cta: "Demander une démo gratuite",
    verticals: ["Dentaire", "Optique", "Audio", "Clinique", "EHPAD", "Pharmacie", "Labo pharma", "Labo bio", "Orthodontie"],
    useCases: ["Tiers-payant", "Vérification", "Devis", "Recouvrement", "Admissions", "Facturation", "Conformité", "Suivi patient", "Stock & commandes", "Market access"],
    agents: [
      { vertical: "Dentaire", useCase: "Tiers-payant", name: "Gestion complète du tiers-payant dentaire", desc: "Vérification AMO/AMC avant chaque acte, télétransmission SESAM-Vitale, suivi NOEMIE, détection et correction des rejets.", stat: "99.1% first-pass" },
      { vertical: "Dentaire", useCase: "Recouvrement", name: "Relance automatique des impayés dentaires", desc: "Détection des factures à J+30, J+60 et J+90, relances email/SMS personnalisées et escalade vers le gestionnaire.", stat: "÷3 délai recouv." },
      { vertical: "Optique", useCase: "Devis", name: "Devis tiers-payant optique en 5 secondes", desc: "Lecture carte mutuelle, interrogation AMC, calcul du reste à charge 100% Santé, Classe A ou Classe B, puis envoi patient.", stat: "< 5s par devis" },
      { vertical: "Optique", useCase: "Tiers-payant", name: "Rapprochement bancaire des virements optiques", desc: "Matching automatique des virements AMO/AMC avec les factures, détection des écarts et virements non affectés.", stat: "-85% temps" },
      { vertical: "Optique", useCase: "Conformité", name: "Vérification panier 100% Santé", desc: "Contrôle monture, verres LPP et devis normalisé avant vente, avec alerte en cas de non-conformité.", stat: "100% conformité" },
      { vertical: "Audio", useCase: "Admissions", name: "Montage automatique des dossiers audioprothèse", desc: "Récupération prescription ORL, audiogramme, devis normalisé LPP, assemblage et envoi CPAM + mutuelle.", stat: "-75% montage" },
      { vertical: "Audio", useCase: "Suivi patient", name: "Suivi complet du parcours audioprothétique", desc: "Rappels période d'essai, réglages M+1/M+3/M+6, renouvellement à 4 ans et messages personnalisés.", stat: "+40% rétention" },
      { vertical: "Clinique", useCase: "Admissions", name: "Pré-admission digitalisée avec droits vérifiés", desc: "Collecte des pièces, vérification AMO/AMC en temps réel et pré-remplissage du dossier administratif avant admission.", stat: "-60% accueil" },
      { vertical: "Clinique", useCase: "Recouvrement", name: "Recouvrement des restes à charge hospitaliers", desc: "Identification des restes à charge, relances graduées, priorisation des créances et suivi par service.", stat: "-45% créances" },
      { vertical: "EHPAD", useCase: "Admissions", name: "Constitution automatique des dossiers APA", desc: "Collecte des pièces, pré-remplissage CERFA, envoi au Conseil Départemental et relance si délai dépassé.", stat: "-80% constitution" },
      { vertical: "EHPAD", useCase: "Facturation", name: "Facturation hébergement, dépendance et soins", desc: "Calcul des tarifs selon GIR et décisions APA, facturation différenciée aide sociale et reste à charge famille.", stat: "0 erreur facture" },
      { vertical: "Pharmacie", useCase: "Tiers-payant", name: "Traitement automatique des rejets SESAM-Vitale", desc: "Analyse des causes de rejet, correction des anomalies et re-soumission sans intervention humaine dans la majorité des cas.", stat: "-90% rejets" },
      { vertical: "Pharmacie", useCase: "Stock & commandes", name: "Alerte ruptures de stock et commandes dépannage", desc: "Surveillance des niveaux de stock, alerte sous seuil critique et commande dépannage chez le grossiste.", stat: "0 rupture" },
      { vertical: "Labo pharma", useCase: "Conformité", name: "Traitement des signalements d'effets indésirables", desc: "Collecte multi-sources, tri par gravité, pré-qualification MedDRA et génération des formulaires CIOMS I.", stat: "-65% traitement" },
      { vertical: "Labo pharma", useCase: "Market access", name: "Analyse comparative HAS/CEPS", desc: "Analyse des avis de transparence, comparaison ASMR concurrents et aide à la constitution du dossier médico-économique.", stat: "+25% efficacité" },
      { vertical: "Labo bio", useCase: "Facturation", name: "Cotation NABM automatique", desc: "Application des codes NABM, gestion des règles de cumul, plafonds quotidiens et dérogations.", stat: "0 erreur cotation" },
      { vertical: "Labo bio", useCase: "Conformité", name: "Non-conformités pré-analytiques", desc: "Détection tube incorrect, volume insuffisant ou délai dépassé, notification prescripteur et patient, traçabilité COFRAC.", stat: "-50% rappels" },
      { vertical: "Orthodontie", useCase: "Devis", name: "Devis orthodontique multi-semestres", desc: "Génération CCAM avec reste à charge par semestre, plafonds de prise en charge et envoi patient + mutuelle.", stat: "-60% temps devis" },
    ],
  },
  en: {
    eyebrow: "Agents",
    title: "A catalog of agents for every healthcare vertical.",
    intro: "Granit deploys agents specialized by trade and by use case. They work on your existing tools, with no migration and no API integration.",
    summaryLabel: "In short:",
    summary:
      "Granit deploys AI agents that automate the administrative back office of healthcare professionals: third-party payment (tiers payant: the patient pays nothing upfront, insurers pay the provider directly), quotes, billing, rejection handling, bank reconciliation and collections. Each agent is specialized by trade (optical, hearing care, dental, pharmacy, nursing homes, clinics, clinical labs) and works on your existing tools, with no migration and no API integration.",
    filtersTitle: "Agents by trade and use case",
    catalogTitle: "The catalog",
    faqTitle: "Frequently asked questions",
    faq: [
      {
        question: "What is a Granit AI agent?",
        answer:
          "An agent specialized by trade and by use case that carries out an administrative task for you: coverage request, third-party payment quote, e-transmission, rejection handling, bank reconciliation or follow-up on unpaid invoices.",
      },
      {
        question: "Do we need to change software or ask for an API?",
        answer:
          "No. The agents work on your existing tools, with no migration and no API integration: they connect to your practice management software and to the portals you already use.",
      },
      {
        question: "Which third-party payment platforms are covered?",
        answer:
          "Granit works with every third-party payment platform, for example Viamedis, Almerys, Santéclair, SP Santé, Itelis or iSanté.",
      },
      {
        question: "For which healthcare trades?",
        answer:
          "Optical, hearing care, dental, orthodontics, pharmacy, nursing homes (EHPAD), clinics, clinical labs and pharmaceutical companies.",
      },
      {
        question: "Can we control what the agents do?",
        answer:
          "Yes. Every agent action is logged, timestamped and exportable, and every decision can be reviewed by a human. Data is stored with an HDS-certified host.",
      },
      {
        question: "How much does an agent cost?",
        answer:
          "Granit is priced per center: from €199 excl. VAT per month for one center, plus a usage-based fee per agent depending on the workflows enabled and the volume processed. Details are on the Pricing page.",
      },
    ],
    verticalLabel: "Verticals covered",
    useCaseLabel: "Use cases",
    cta: "Book a free demo",
    verticals: ["Dental", "Optical", "Hearing care", "Clinic", "Nursing home", "Pharmacy", "Pharma company", "Clinical lab", "Orthodontics"],
    useCases: ["Third-party payment", "Eligibility", "Quotes", "Collections", "Admissions", "Billing", "Compliance", "Patient follow-up", "Stock & orders", "Market access"],
    agents: [
      { vertical: "Dental", useCase: "Third-party payment", name: "End-to-end dental third-party payment", desc: "Mandatory (AMO) and supplementary (AMC) eligibility checks before each procedure, SESAM-Vitale e-transmission, NOEMIE monitoring, rejection detection and correction.", stat: "99.1% first-pass" },
      { vertical: "Dental", useCase: "Collections", name: "Automatic follow-up on unpaid dental invoices", desc: "Flags invoices at D+30, D+60 and D+90, sends personalized email/SMS follow-ups and escalates to the manager.", stat: "÷3 collection time" },
      { vertical: "Optical", useCase: "Quotes", name: "Optical third-party payment quote in 5 seconds", desc: "Reads the supplementary insurance (mutuelle) card, queries the insurer, calculates the out-of-pocket amount for 100% Santé, Class A or Class B, then sends it to the patient.", stat: "< 5s per quote" },
      { vertical: "Optical", useCase: "Third-party payment", name: "Bank reconciliation of optical transfers", desc: "Automatically matches AMO/AMC bank transfers with invoices, flags discrepancies and unallocated transfers.", stat: "-85% time" },
      { vertical: "Optical", useCase: "Compliance", name: "100% Santé basket check", desc: "Checks frame, LPP-coded lenses and standard quote before the sale, with an alert on any non-compliance.", stat: "100% compliance" },
      { vertical: "Hearing care", useCase: "Admissions", name: "Automatic hearing aid file assembly", desc: "Retrieves the ENT prescription, audiogram and standard LPP quote, assembles the file and sends it to the local health insurance office (CPAM) and the supplementary insurer.", stat: "-75% file assembly" },
      { vertical: "Hearing care", useCase: "Patient follow-up", name: "End-to-end hearing aid patient follow-up", desc: "Trial period reminders, adjustments at M+1/M+3/M+6, renewal after 4 years and personalized messages.", stat: "+40% retention" },
      { vertical: "Clinic", useCase: "Admissions", name: "Digital pre-admission with verified eligibility", desc: "Collects documents, checks AMO/AMC coverage in real time and pre-fills the administrative file before admission.", stat: "-60% front desk" },
      { vertical: "Clinic", useCase: "Collections", name: "Collections on hospital out-of-pocket amounts", desc: "Identifies out-of-pocket amounts, runs graduated follow-ups, prioritizes receivables and tracks by department.", stat: "-45% receivables" },
      { vertical: "Nursing home", useCase: "Admissions", name: "Automatic APA file preparation", desc: "Collects documents, pre-fills CERFA forms, sends them to the département council and follows up when deadlines pass.", stat: "-80% file prep" },
      { vertical: "Nursing home", useCase: "Billing", name: "Billing for accommodation, dependency and care", desc: "Calculates rates by GIR and APA decisions, and bills social assistance and the family's out-of-pocket amount separately.", stat: "0 billing errors" },
      { vertical: "Pharmacy", useCase: "Third-party payment", name: "Automatic handling of SESAM-Vitale rejections", desc: "Analyzes rejection causes, corrects anomalies and resubmits without human intervention in most cases.", stat: "-90% rejections" },
      { vertical: "Pharmacy", useCase: "Stock & orders", name: "Stock-out alerts and emergency orders", desc: "Monitors stock levels, alerts below the critical threshold and places an emergency order with the wholesaler.", stat: "0 stock-outs" },
      { vertical: "Pharma company", useCase: "Compliance", name: "Adverse event report processing", desc: "Multi-source collection, triage by severity, MedDRA pre-coding and generation of CIOMS I forms.", stat: "-65% processing" },
      { vertical: "Pharma company", useCase: "Market access", name: "HAS/CEPS comparative analysis", desc: "Analyzes transparency opinions, compares competitors' ASMR ratings and helps build the health-economics dossier.", stat: "+25% efficiency" },
      { vertical: "Clinical lab", useCase: "Billing", name: "Automatic NABM coding", desc: "Applies NABM codes and handles combination rules, daily caps and exemptions.", stat: "0 coding errors" },
      { vertical: "Clinical lab", useCase: "Compliance", name: "Pre-analytical non-conformities", desc: "Detects wrong tubes, insufficient volume or exceeded delays, notifies prescriber and patient, with COFRAC traceability.", stat: "-50% recalls" },
      { vertical: "Orthodontics", useCase: "Quotes", name: "Multi-semester orthodontic quotes", desc: "Generates CCAM quotes with the out-of-pocket amount per semester and coverage caps, then sends them to the patient and the supplementary insurer.", stat: "-60% quote time" },
    ],
  },
};

/** Service + catalogue des agents de la page, + FAQPage. */
const agentsLd = [
  {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Agents IA Granit pour le back-office santé",
    url: `${SITE_URL}/agents`,
    serviceType: "Automatisation du back-office administratif de santé par agents IA",
    description: content.fr.summary,
    provider: organizationRef,
    areaServed: { "@type": "Country", name: "France" },
    audience: { "@type": "Audience", audienceType: content.fr.verticals.join(", ") },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Catalogue des agents Granit",
      itemListElement: content.fr.agents.map((a) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: a.name,
          description: a.desc,
          category: `${a.vertical} · ${a.useCase}`,
        },
      })),
    },
  },
  faqPageLd(content.fr.faq),
];

function AgentsPage() {
  const { lang } = useLanguage();
  const t = content[lang];

  return (
    <SiteLayout>
      <JsonLd data={agentsLd} />
      <section className="mx-auto max-w-[1280px] px-6 pt-24 pb-12">
        <Reveal>
          <div className="eyebrow mb-5">{t.eyebrow}</div>
          <h1 className="h1-hero max-w-4xl" style={{ fontSize: "clamp(38px,4.6vw,68px)" }}>{t.title}</h1>
          <p className="body-lg mt-8 max-w-2xl">{t.intro}</p>
          <p
            className="mt-6 max-w-2xl text-[14px] leading-[1.7]"
            style={{ color: "var(--text-soft)" }}
          >
            <strong style={{ color: "var(--text)", fontWeight: 600 }}>{t.summaryLabel}</strong>{" "}
            {t.summary}
          </p>
        </Reveal>
      </section>

      <section className="mx-auto max-w-[1280px] px-6 pb-8">
        <Reveal>
          <h2 className="eyebrow mb-4">{t.filtersTitle}</h2>
          <div className="grid gap-6 rounded-[12px] border bg-white/40 p-6 lg:grid-cols-2" style={{ borderColor: "var(--border)" }}>
            <FilterGroup label={t.verticalLabel} items={t.verticals} />
            <FilterGroup label={t.useCaseLabel} items={t.useCases} />
          </div>
        </Reveal>
      </section>

      <section className="mx-auto max-w-[1280px] px-6 pb-28">
        <h2 className="eyebrow mb-6 mt-4">{t.catalogTitle}</h2>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {t.agents.map((agent, i) => (
            <Reveal key={`${agent.vertical}-${agent.name}`} delay={i * 0.02}>
              <article className="card-hover flex h-full flex-col rounded-[8px] border bg-white/40 p-6" style={{ borderColor: "var(--border)" }}>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full px-2 py-1 text-[10px]" style={{ background: "var(--terra-light)", color: "var(--terra)", fontFamily: "var(--font-mono)" }}>{agent.vertical}</span>
                  <span className="rounded-full px-2 py-1 text-[10px]" style={{ background: "var(--bg3)", color: "var(--text-soft)", fontFamily: "var(--font-mono)" }}>{agent.useCase}</span>
                </div>
                <h3 className="mt-5 text-[20px] leading-[1.25]" style={{ fontWeight: 500 }}>
                  {agent.name}
                </h3>
                <p className="mt-3 flex-1 text-[14px] leading-[1.65]" style={{ color: "var(--text-soft)" }}>{agent.desc}</p>
                <div className="mt-6 text-[13px]" style={{ color: "var(--terra)", fontFamily: "var(--font-mono)" }}>{agent.stat}</div>
              </article>
            </Reveal>
          ))}
        </div>
        <div className="mx-auto mt-8 max-w-2xl">
          <Faq items={t.faq} titre={t.faqTitle} />
        </div>
        <div className="mt-16 text-center"><Link to="/" hash="demo" className="btn-primary">{t.cta} <span className="arrow">↗</span></Link></div>
      </section>
    </SiteLayout>
  );
}

function FilterGroup({ label, items }: { label: string; items: string[] }) {
  return (
    <div>
      <div className="eyebrow mb-4" style={{ color: "var(--text-muted)" }}>{label}</div>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => <span key={item} className="rounded-full border px-3 py-1.5 text-[12px]" style={{ borderColor: "var(--border)", color: "var(--text-soft)", fontFamily: "var(--font-mono)" }}>{item}</span>)}
      </div>
    </div>
  );
}