import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { Reveal } from "@/components/Reveal";
import { useLanguage } from "@/lib/i18n";
import { SITE_URL, organizationLd } from "@/lib/seo";

// Faits sur les fondateurs : uniquement leurs profils LinkedIn (export PDF d'octobre 2026).
// Rien d'autre : pas de chiffre, pas de client, pas de date absente de ces profils.
// TODO Paul : date de création légale de Granit (immatriculation) introuvable dans le repo.
// Les profils donnent seulement « mars 2026 » comme début des postes chez Granit ;
// ajouter `foundingDate` dans les données structurées une fois la date confirmée.

const TITRE = "À propos de Granit : l'équipe et la mission - Granit";
const DESCRIPTION =
  "Granit conçoit des agents IA pour le tiers payant et l'administratif des magasins et cabinets de santé. Fondé par Jenny Mansour (CEO) et Corneille Marechal (CTO).";

export const Route = createFileRoute("/a-propos")({
  head: () => ({
    meta: [
      { title: TITRE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITRE },
      { property: "og:description", content: DESCRIPTION },
    ],
  }),
  component: AProposPage,
});

type Fondateur = {
  nom: string;
  initiales: string;
  linkedin: string;
  ecoles: string[];
  role: { fr: string; en: string };
  parcours: { fr: string[]; en: string[] };
};

// TODO Paul : vérifier les deux URL LinkedIn (coupées en fin de ligne dans les PDF).
const fondateurs: Fondateur[] = [
  {
    nom: "Jenny Mansour",
    initiales: "JM",
    linkedin: "https://www.linkedin.com/in/jenny-mansour-060016121",
    ecoles: ["École polytechnique", "HEC Paris"],
    role: { fr: "CEO et cofondatrice", en: "CEO and co-founder" },
    parcours: {
      fr: [
        "Directrice de BU Santé chez Galileo Global Education (2023-2025).",
        "Consultante au Boston Consulting Group (2020-2023), dont un détachement au ministère des Solidarités et de la Santé : cheffe du pôle synthèse et indicateurs de la taskforce vaccins.",
        "Avant cela : cabinet du ministre de la Santé et cellule de crise covid-19 de l'AP-HP en 2020 ; recherche en deep learning sur la rééducation de patients après un AVC (Singapour, 2018).",
        "École polytechnique, puis MSc X-HEC Entrepreneurs (HEC Paris).",
      ],
      en: [
        "Head of the Health business unit at Galileo Global Education (2023-2025).",
        "Consultant at Boston Consulting Group (2020-2023), including a secondment to the French Ministry of Health as head of the synthesis and indicators unit of the vaccine taskforce.",
        "Before that: French Health Minister's office and AP-HP covid-19 crisis unit in 2020; deep learning research on rehabilitation of stroke patients (Singapore, 2018).",
        "École polytechnique, then MSc X-HEC Entrepreneurs (HEC Paris).",
      ],
    },
  },
  {
    nom: "Corneille Marechal",
    initiales: "CM",
    linkedin: "https://www.linkedin.com/in/corneille-marechal-43a210199",
    ecoles: ["École polytechnique", "HEC Paris"],
    role: { fr: "CTO et cofondateur", en: "CTO and co-founder" },
    parcours: {
      fr: [
        "Premier salarié et founding engineer d'apiday (2021-2025), puis engineering manager.",
        "A dirigé une équipe chargée d'outiller les opérations internes avec l'IA, puis une squad tech qui mettait des fonctionnalités IA en production.",
        "École polytechnique (physique et informatique), puis MSc X-HEC Entrepreneurs (HEC Paris).",
      ],
      en: [
        "First employee and founding engineer at apiday (2021-2025), then engineering manager.",
        "Led a team that equipped internal operations with AI, then a tech squad shipping AI features to production.",
        "École polytechnique (physics and computer science), then MSc X-HEC Entrepreneurs (HEC Paris).",
      ],
    },
  },
];

const content = {
  fr: {
    eyebrow: "À propos",
    title: "Rendre du temps à ceux qui soignent.",
    // Réponse directe à « Qu'est-ce que Granit ? » (40 à 60 mots, citable tel quel).
    lead: "Granit est une entreprise basée à Paris qui conçoit des agents IA pour l'administratif des magasins et cabinets de santé. Les agents gèrent le tiers payant, les prises en charge, les rejets et les relances, dans les outils que les équipes utilisent déjà. Granit commence par l'optique, puis s'étend au dentaire, à l'audioprothèse et aux autres métiers de santé.",
    missionTitle: "Pourquoi Granit",
    belief: "Notre conviction",
    quote:
      "« L'IA en santé ne devrait pas remplacer les soignants. Elle devrait leur rendre du temps. »",
    paragraphs: [
      "Les équipes des magasins et cabinets de santé passent des heures chaque jour sur des tâches répétitives : vérification des droits, demandes de prise en charge, télétransmission, traitement des rejets, relances des impayés, rapprochement des paiements.",
      "Pendant ce temps, les patients attendent. Les remboursements aussi.",
      "Granit déploie des agents IA qui prennent ces tâches en charge. Ils travaillent dans le navigateur, sur les portails et logiciels déjà en place : pas de projet informatique, pas de changement d'outil pour l'équipe.",
      "Vous décrivez votre quotidien. Granit met en place les bons agents.",
    ],
    teamTitle: "L'équipe",
    teamIntro:
      "Granit a été cofondé par Jenny Mansour et Corneille Marechal, tous deux diplômés de l'École polytechnique et du MSc X-HEC Entrepreneurs.",
    linkedin: "Profil LinkedIn",
    faqTitle: "Questions fréquentes",
    faq: [
      {
        q: "Qui est derrière Granit ?",
        a: "Granit a été cofondé par Jenny Mansour, CEO, et Corneille Marechal, CTO. Jenny Mansour a travaillé au Boston Consulting Group, au ministère des Solidarités et de la Santé et chez Galileo Global Education. Corneille Marechal a été le premier salarié et founding engineer d'apiday.",
      },
      {
        q: "Où sont hébergées les données ?",
        a: "L'hébergement, le chiffrement, les accès et la réversibilité des données de santé sont décrits sur la page Sécurité.",
        lien: { to: "/securite" as const, label: "Voir la page Sécurité" },
      },
      {
        q: "Pour quels métiers de santé ?",
        a: "Granit commence par les magasins d'optique. Les agents s'étendent au dentaire, à l'audioprothèse et aux autres professionnels de santé qui gèrent du tiers payant.",
      },
      {
        q: "Depuis quand Granit existe-t-il ?",
        a: "Jenny Mansour et Corneille Marechal se consacrent à Granit depuis mars 2026.",
      },
    ],
  },
  en: {
    eyebrow: "About",
    title: "Giving time back to care teams.",
    lead: "Granit is a Paris-based company building AI agents for the administrative work of healthcare stores and practices. The agents handle third-party payment, coverage requests, rejections and follow-ups, directly inside the tools teams already use. Granit starts with optical stores, then expands to dental, hearing care and other healthcare professions.",
    missionTitle: "Why Granit",
    belief: "Our belief",
    quote: "“AI in healthcare should not replace care teams. It should give them time back.”",
    paragraphs: [
      "Teams in healthcare stores and practices spend hours every day on repetitive work: eligibility checks, coverage requests, claim transmission, rejections, unpaid follow-ups and payment reconciliation.",
      "Meanwhile, patients wait. Reimbursements wait too.",
      "Granit deploys AI agents that take over these tasks. They work in the browser, on the portals and software already in place: no IT project, no new tool for the team.",
      "You describe your daily operations. Granit sets up the right agents.",
    ],
    teamTitle: "The team",
    teamIntro:
      "Granit was co-founded by Jenny Mansour and Corneille Marechal, both graduates of École polytechnique and the MSc X-HEC Entrepreneurs.",
    linkedin: "LinkedIn profile",
    faqTitle: "Frequently asked questions",
    faq: [
      {
        q: "Who is behind Granit?",
        a: "Granit was co-founded by Jenny Mansour, CEO, and Corneille Marechal, CTO. Jenny Mansour worked at Boston Consulting Group, the French Ministry of Health and Galileo Global Education. Corneille Marechal was the first employee and founding engineer at apiday.",
      },
      {
        q: "Where is the data hosted?",
        a: "Hosting, encryption, access control and reversibility of health data are described on the Security page.",
        lien: { to: "/securite" as const, label: "See the Security page" },
      },
      {
        q: "Which healthcare professions?",
        a: "Granit starts with optical stores. The agents expand to dental, hearing care and other healthcare professionals who handle third-party payment.",
      },
      {
        q: "How long has Granit been around?",
        a: "Jenny Mansour and Corneille Marechal have been working on Granit since March 2026.",
      },
    ],
  },
};

// Données structurées : toujours en français (langue rendue côté serveur et indexée).
const URL_PAGE = `${SITE_URL}/a-propos`;
const ldPage = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  "@id": URL_PAGE,
  url: URL_PAGE,
  name: TITRE,
  description: DESCRIPTION,
  inLanguage: "fr-FR",
  mainEntity: {
    ...organizationLd,
    "@context": undefined,
    description: content.fr.lead,
    founder: fondateurs.map((f) => ({
      "@type": "Person",
      name: f.nom,
      jobTitle: f.role.fr.startsWith("CEO") ? "CEO" : "CTO",
      sameAs: [f.linkedin],
      alumniOf: f.ecoles.map((name) => ({ "@type": "CollegeOrUniversity", name })),
    })),
  },
};
const ldFaq = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: content.fr.faq.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

function AProposPage() {
  const { lang } = useLanguage();
  const t = content[lang];
  return (
    <SiteLayout>
      {[ldPage, ldFaq].map((ld, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
        />
      ))}

      <section className="mx-auto max-w-[1280px] px-6 pt-24 pb-16">
        <Reveal>
          <div className="eyebrow mb-5">{t.eyebrow}</div>
          <h1 className="h1-hero max-w-4xl" style={{ fontSize: "clamp(40px,5vw,76px)" }}>
            {t.title}
          </h1>
          <p className="body-lg mt-8 max-w-3xl">{t.lead}</p>
        </Reveal>
      </section>

      <section className="mx-auto max-w-[1280px] px-6 pb-20">
        <div className="grid gap-12 md:grid-cols-2">
          <Reveal>
            <h2 className="eyebrow mb-6">{t.missionTitle}</h2>
            <div
              className="space-y-5 text-[16px] leading-[1.75]"
              style={{ color: "var(--text-soft)" }}
            >
              {t.paragraphs.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div
              className="rounded-[12px] border p-8"
              style={{ borderColor: "var(--border)", background: "var(--bg2)" }}
            >
              <div className="eyebrow mb-5">{t.belief}</div>
              <p className="text-[18px] leading-[1.6]" style={{ fontFamily: "var(--font-serif)" }}>
                {t.quote}
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-[1280px] px-6 pb-20">
        <Reveal>
          <h2
            className="font-serif"
            style={{ fontSize: "clamp(28px,3vw,40px)", lineHeight: 1.15, fontWeight: 700 }}
          >
            {t.teamTitle}
          </h2>
          <p
            className="mt-4 max-w-3xl text-[15px] leading-[1.7]"
            style={{ color: "var(--text-soft)" }}
          >
            {t.teamIntro}
          </p>
        </Reveal>
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {fondateurs.map((f, i) => (
            <Reveal key={f.nom} delay={i * 0.05}>
              <CarteFondateur f={f} lang={lang} lienLabel={t.linkedin} />
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[1280px] px-6 pb-28">
        <Reveal>
          <h2
            className="font-serif"
            style={{ fontSize: "clamp(28px,3vw,40px)", lineHeight: 1.15, fontWeight: 700 }}
          >
            {t.faqTitle}
          </h2>
        </Reveal>
        {/* Réponses toujours visibles (pas d'accordéon) : lisibles par les moteurs dès le HTML serveur. */}
        <div className="mt-8 max-w-3xl">
          {t.faq.map((f) => (
            <div key={f.q} className="border-t py-6" style={{ borderColor: "var(--border)" }}>
              <h3 className="text-[17px]" style={{ fontWeight: 500 }}>
                {f.q}
              </h3>
              <p className="mt-2 text-[15px] leading-[1.7]" style={{ color: "var(--text-soft)" }}>
                {f.a}
                {"lien" in f && f.lien && (
                  <>
                    {" "}
                    <Link to={f.lien.to} className="underline" style={{ color: "var(--terra)" }}>
                      {f.lien.label} →
                    </Link>
                  </>
                )}
              </p>
            </div>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}

/** Carte d'un fondateur : pas de photo dans le repo, donc initiales en placeholder. */
function CarteFondateur({
  f,
  lang,
  lienLabel,
}: {
  f: Fondateur;
  lang: "fr" | "en";
  lienLabel: string;
}) {
  return (
    <div
      className="h-full rounded-[8px] border bg-white/40 p-6"
      style={{ borderColor: "var(--border)" }}
    >
      <div className="flex items-center gap-4">
        <div
          aria-hidden
          className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-[16px]"
          style={{
            background: "var(--bg2)",
            color: "var(--terra)",
            fontFamily: "var(--font-mono)",
            fontWeight: 600,
          }}
        >
          {f.initiales}
        </div>
        <div>
          <h3 className="text-[19px]" style={{ fontWeight: 500 }}>
            {f.nom}
          </h3>
          <div className="text-[13px]" style={{ color: "var(--text-muted)" }}>
            {f.role[lang]}, Granit
          </div>
        </div>
      </div>
      <ul className="mt-5 space-y-2">
        {f.parcours[lang].map((p) => (
          <li
            key={p}
            className="flex gap-3 text-[14px] leading-[1.65]"
            style={{ color: "var(--text-soft)" }}
          >
            <span style={{ color: "var(--terra)", fontFamily: "var(--font-mono)" }}>→</span>
            <span>{p}</span>
          </li>
        ))}
      </ul>
      <a
        href={f.linkedin}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-5 inline-flex text-[13px] underline"
        style={{ color: "var(--terra)" }}
      >
        {lienLabel} ↗
      </a>
    </div>
  );
}
