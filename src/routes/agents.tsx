import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { Reveal } from "@/components/Reveal";
import { useLanguage } from "@/lib/i18n";

export const Route = createFileRoute("/agents")({
  head: () => ({
    meta: [
      { title: "Agents IA santé - Granit AI" },
      { name: "description", content: "Les agents IA Granit par verticale santé et par cas d'usage : tiers-payant, recouvrement, admissions, facturation, conformité." },
      { property: "og:title", content: "Agents IA santé - Granit AI" },
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
    intro: "Granit deploys specialized agents by business vertical and use case. They operate on your existing tools, with no migration or API integration.",
    verticalLabel: "Covered verticals",
    useCaseLabel: "Use cases",
    cta: "Book a free demo",
    verticals: ["Dental", "Optical", "Hearing care", "Clinic", "Care homes", "Pharmacy", "Pharma lab", "Bio lab", "Orthodontics"],
    useCases: ["Third-party billing", "Eligibility", "Quotes", "Collections", "Admissions", "Invoicing", "Compliance", "Patient follow-up", "Stock & orders", "Market access"],
    agents: [
      { vertical: "Dental", useCase: "Third-party billing", name: "Complete dental third-party billing", desc: "AMO/AMC eligibility checks, SESAM-Vitale transmission, NOEMIE monitoring, rejection detection and correction.", stat: "99.1% first-pass" },
      { vertical: "Dental", useCase: "Collections", name: "Automatic dental unpaid follow-ups", desc: "Detects invoices at D+30, D+60 and D+90, sends email/SMS reminders and escalates unresolved cases.", stat: "÷3 collection time" },
      { vertical: "Optical", useCase: "Quotes", name: "Optical third-party quote in 5 seconds", desc: "Reads insurance card, checks coverage, calculates remaining balance and sends the quote to the patient.", stat: "< 5s per quote" },
      { vertical: "Optical", useCase: "Third-party billing", name: "Automated optical bank reconciliation", desc: "Matches public/private payer transfers with invoices, detects gaps and flags unassigned payments.", stat: "-85% time" },
      { vertical: "Optical", useCase: "Compliance", name: "100% Santé basket checks", desc: "Checks frame, LPP lenses and normalized quote before sale, with alerts on non-compliance.", stat: "100% compliant" },
      { vertical: "Hearing care", useCase: "Admissions", name: "Automatic hearing-aid file assembly", desc: "Collects ENT prescription, audiogram and normalized LPP quote, then sends the complete file to payers.", stat: "-75% assembly" },
      { vertical: "Hearing care", useCase: "Patient follow-up", name: "Complete hearing-care pathway follow-up", desc: "Trial period reminders, fitting visits, four-year renewal and personalized patient messages.", stat: "+40% retention" },
      { vertical: "Clinic", useCase: "Admissions", name: "Digital pre-admission with eligibility checks", desc: "Collects documents, verifies coverage in real time and pre-fills the administrative file before admission.", stat: "-60% intake" },
      { vertical: "Clinic", useCase: "Collections", name: "Hospital remaining-balance collections", desc: "Identifies patient balances, runs graduated reminders, prioritizes receivables and tracks by department.", stat: "-45% receivables" },
      { vertical: "Care homes", useCase: "Admissions", name: "Automatic APA and social-aid files", desc: "Collects documents, pre-fills forms, sends them to local authorities and follows up on delays.", stat: "-80% file prep" },
      { vertical: "Care homes", useCase: "Invoicing", name: "Accommodation, dependency and care invoicing", desc: "Calculates fees by GIR and APA decision, then separates social aid from family remaining balance.", stat: "0 invoice error" },
      { vertical: "Pharmacy", useCase: "Third-party billing", name: "Automatic SESAM-Vitale rejection handling", desc: "Analyzes rejection causes, corrects anomalies and resubmits most cases without human intervention.", stat: "-90% rejections" },
      { vertical: "Pharmacy", useCase: "Stock & orders", name: "Stock shortage alerts and emergency orders", desc: "Monitors stock levels, alerts under critical thresholds and prepares emergency wholesaler orders.", stat: "0 shortage" },
      { vertical: "Pharma lab", useCase: "Compliance", name: "Adverse event signal processing", desc: "Collects multi-source signals, triages by severity, pre-qualifies MedDRA and generates CIOMS I forms.", stat: "-65% processing" },
      { vertical: "Pharma lab", useCase: "Market access", name: "HAS/CEPS comparative analysis", desc: "Analyzes transparency opinions, compares competitor ASMR results and supports medico-economic dossiers.", stat: "+25% efficiency" },
      { vertical: "Bio lab", useCase: "Invoicing", name: "Automatic NABM coding", desc: "Applies NABM codes, manages accumulation rules, daily caps and derogations.", stat: "0 coding error" },
      { vertical: "Bio lab", useCase: "Compliance", name: "Pre-analytical non-compliance detection", desc: "Flags wrong tubes, insufficient volume or late transport, then notifies prescriber and patient with audit traceability.", stat: "-50% recalls" },
      { vertical: "Orthodontics", useCase: "Quotes", name: "Multi-semester orthodontic quotes", desc: "Generates CCAM-compliant quotes with remaining balance by semester, reimbursement caps and patient + payer sending.", stat: "-60% quote time" },
    ],
  },
};

function AgentsPage() {
  const { lang } = useLanguage();
  const t = content[lang];

  return (
    <SiteLayout>
      <section className="mx-auto max-w-[1280px] px-6 pt-24 pb-12">
        <Reveal>
          <div className="eyebrow mb-5">{t.eyebrow}</div>
          <h1 className="h1-hero max-w-4xl" style={{ fontSize: "clamp(38px,4.6vw,68px)" }}>{t.title}</h1>
          <p className="body-lg mt-8 max-w-2xl">{t.intro}</p>
        </Reveal>
      </section>

      <section className="mx-auto max-w-[1280px] px-6 pb-8">
        <Reveal>
          <div className="grid gap-6 rounded-[12px] border bg-white/40 p-6 lg:grid-cols-2" style={{ borderColor: "var(--border)" }}>
            <FilterGroup label={t.verticalLabel} items={t.verticals} />
            <FilterGroup label={t.useCaseLabel} items={t.useCases} />
          </div>
        </Reveal>
      </section>

      <section className="mx-auto max-w-[1280px] px-6 pb-28">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {t.agents.map((agent, i) => (
            <Reveal key={`${agent.vertical}-${agent.name}`} delay={i * 0.02}>
              <article className="card-hover flex h-full flex-col rounded-[8px] border bg-white/40 p-6" style={{ borderColor: "var(--border)" }}>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full px-2 py-1 text-[10px]" style={{ background: "var(--terra-light)", color: "var(--terra)", fontFamily: "var(--font-mono)" }}>{agent.vertical}</span>
                  <span className="rounded-full px-2 py-1 text-[10px]" style={{ background: "var(--bg3)", color: "var(--text-soft)", fontFamily: "var(--font-mono)" }}>{agent.useCase}</span>
                </div>
                <h2 className="mt-5 text-[20px] leading-[1.25]" style={{ fontWeight: 500 }}>{agent.name}</h2>
                <p className="mt-3 flex-1 text-[14px] leading-[1.65]" style={{ color: "var(--text-soft)" }}>{agent.desc}</p>
                <div className="mt-6 text-[13px]" style={{ color: "var(--terra)", fontFamily: "var(--font-mono)" }}>{agent.stat}</div>
              </article>
            </Reveal>
          ))}
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