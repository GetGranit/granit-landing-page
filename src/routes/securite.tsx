import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Ban,
  Check,
  Clock3,
  Globe,
  Hourglass,
  KeyRound,
  Lock,
  Mail,
  ShieldCheck,
  UserCheck,
  type LucideIcon,
} from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { Reveal } from "@/components/Reveal";
import { useLanguage } from "@/lib/i18n";
import { JsonLd } from "@/components/JsonLd";
import { Faq } from "@/components/ressources/article/Fin";
import { SITE_URL, faqPageLd, organizationRef } from "@/lib/seo";

// Chaque fait de sécurité de cette page vient des CGV (/cgv), de la politique de confidentialité
// (/privacy), de la FAQ de la PR #94, de marque/TON.md (dépôt GetGranit/internal) ou des textes validés
// en revue de la PR #96 (hébergeur certifié HDS, coffre-fort des identifiants).
// On n'en ajoute aucun qui n'y figure pas.

const TITLE = "Sécurité des données de santé (HDS, RGPD) - Granit";
const DESCRIPTION =
  "Données de santé stockées chez un hébergeur certifié HDS, en Europe, chiffrées, jamais utilisées pour entraîner des modèles tiers. RGPD, traçabilité, réversibilité.";
const CONTACT_EMAIL = "contact@getgranit.ai";

export const Route = createFileRoute("/securite")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      {
        property: "og:description",
        content:
          "Hébergeur certifié HDS, datacenters en Europe, RGPD : comment Granit héberge, protège et trace les données de santé de vos patients.",
      },
    ],
  }),
  component: SecuritePage,
});

type Item = { t: string; d: string };
type Source = "cgv" | "privacy";
type Content = {
  eyebrow: string;
  title: string;
  summaryLabel: string;
  summary: string;
  heroCta: string;
  heroSecondary: string;
  badgesLabel: string;
  badges: { k: string; v: string }[];
  visual: { title: string; rows: string[]; lock: string; eu: string };
  engagementsEyebrow: string;
  engagementsTitle: string;
  engagements: Item[];
  complianceEyebrow: string;
  complianceTitle: string;
  complianceIntro: string;
  sources: Record<Source, string>;
  compliance: { k: string; v: string; src: Source; ref: string }[];
  faqTitle: string;
  faq: { question: string; answer: string }[];
  asideTitle: string;
  asideText: string;
  asideCta: string;
  ctaTitle: string;
  ctaText: string;
  ctaBtn: string;
  ctaSecondary: string;
  guarantees: string;
};

const content: Record<"fr" | "en", Content> = {
  fr: {
    eyebrow: "Sécurité et conformité",
    title: "Les données de vos patients restent protégées.",
    summaryLabel: "En bref :",
    summary:
      "Vos données de santé sont stockées chez un hébergeur certifié HDS, dans des datacenters situés en Europe. Elles sont chiffrées et ne servent jamais à entraîner des modèles. Chaque action des agents est enregistrée, et vos données vous sont rendues à tout moment.",
    heroCta: "Demander une démo",
    heroSecondary: "Politique de confidentialité",
    badgesLabel: "Garanties",
    badges: [
      { k: "HDS", v: "Hébergeur certifié" },
      { k: "UE", v: "Hébergement dans l’Union européenne" },
      { k: "RGPD", v: "Données de santé, article 9" },
    ],
    visual: {
      title: "Dossier tracé",
      rows: ["Ce qui a été fait", "Quand", "Pourquoi il attend"],
      lock: "Chiffré en transit et au repos",
      eu: "Hébergé dans l’Union européenne",
    },
    engagementsEyebrow: "Nos engagements",
    engagementsTitle: "Six garanties pour les données de vos patients.",
    engagements: [
      {
        t: "Hébergement certifié HDS",
        d: "Vos données de santé sont stockées chez un hébergeur certifié HDS, dans des datacenters situés en Europe.",
      },
      {
        t: "Respect du RGPD",
        d: "Une approche de la confidentialité conçue autour des exigences européennes et du RGPD.",
      },
      {
        t: "Chiffrées",
        d: "En transit (TLS 1.3) et au repos (AES-256), accès des agents compris.",
      },
      {
        t: "Des accès au strict nécessaire",
        d: "Les agents n’ouvrent que les outils que vous autorisez, avec double authentification. Vous révoquez un accès à tout moment.",
      },
      {
        t: "Agents sous contrôle",
        d: "Vos identifiants de portails sont conservés dans un coffre-fort chiffré, et chaque action de nos agents est enregistrée et vérifiable.",
      },
      {
        t: "Jamais pour entraîner des modèles",
        d: "Vos données ne sont ni revendues, ni utilisées pour entraîner des modèles tiers.",
      },
    ],
    complianceEyebrow: "RGPD et contrat",
    complianceTitle: "Le cadre RGPD, point par point.",
    complianceIntro: "Chaque point renvoie à nos CGV ou à notre politique de confidentialité.",
    sources: { cgv: "Conditions générales de vente", privacy: "Politique de confidentialité" },
    compliance: [
      {
        k: "Rôles",
        v: "Vous êtes responsable de traitement, Granit est sous-traitant (article 28 du RGPD).",
        src: "cgv",
        ref: "CGV, article 9",
      },
      {
        k: "Incident",
        v: "Notification à la CNIL sous 72 h et information des établissements concernés.",
        src: "privacy",
        ref: "Confidentialité, section 8",
      },
      {
        k: "Restitution",
        v: "Vos données en CSV ou JSON, sur demande et au plus tard 30 jours après la fin du contrat, puis supprimées.",
        src: "cgv",
        ref: "CGV, article 10",
      },
      {
        k: "Vos droits",
        v: "Accès, rectification, effacement et portabilité, auprès de contact@getgranit.ai.",
        src: "privacy",
        ref: "Confidentialité, section 8",
      },
    ],
    faqTitle: "Questions fréquentes",
    faq: [
      {
        question: "Où sont hébergées les données de santé ?",
        answer: "Chez un hébergeur certifié HDS, dans des datacenters situés en Europe.",
      },
      {
        question: "Les données des patients servent-elles à entraîner des modèles d’IA ?",
        answer:
          "Non. Aucune donnée patient n’entraîne de modèles tiers, et Granit ne revend pas vos données.",
      },
      {
        question: "Comment les données sont-elles protégées ?",
        answer:
          "Chiffrement en transit (TLS 1.3) et au repos (AES-256), double authentification obligatoire, et des accès limités au strict nécessaire.",
      },
      {
        question: "Peut-on contrôler ce que font les agents ?",
        answer:
          "Oui. Ils ne font que les actions que vous avez configurées ou validées, et chaque action est tracée et exportable.",
      },
      {
        question: "Que deviennent nos données si nous arrêtons Granit ?",
        answer:
          "Elles vous sont remises en CSV ou JSON au plus tard 30 jours après la fin du contrat, puis supprimées.",
      },
    ],
    asideTitle: "Un questionnaire sécurité à remplir ?",
    asideText: "Envoyez-le-nous, l’équipe Granit y répond.",
    asideCta: "Écrire à l’équipe",
    ctaTitle: "Voyez les agents travailler dans vos logiciels.",
    ctaText: "En démo, nous vous montrons comment chaque dossier est tracé.",
    ctaBtn: "Demander une démo",
    ctaSecondary: "Découvrir les agents",
    guarantees: "Hébergeur certifié HDS · Données en Europe · RGPD",
  },
  en: {
    eyebrow: "Security and compliance",
    title: "Your patients' data stays protected.",
    summaryLabel: "In short:",
    summary:
      "Your health data is stored with an HDS-certified host (French certification for health data hosting), in data centers located in Europe. It is encrypted and never used to train models. Every agent action is recorded, and your data is returned to you at any time.",
    heroCta: "Book a demo",
    heroSecondary: "Privacy policy",
    badgesLabel: "Guarantees",
    badges: [
      { k: "HDS", v: "Certified host" },
      { k: "EU", v: "Hosted in the European Union" },
      { k: "GDPR", v: "Health data, article 9" },
    ],
    visual: {
      title: "Traced case",
      rows: ["What was done", "When", "Why it is waiting"],
      lock: "Encrypted in transit and at rest",
      eu: "Hosted in the European Union",
    },
    engagementsEyebrow: "Our commitments",
    engagementsTitle: "Six guarantees for your patients' data.",
    engagements: [
      {
        t: "HDS-certified hosting",
        d: "Your health data is stored with an HDS-certified host, in data centers located in Europe.",
      },
      {
        t: "GDPR compliance",
        d: "A privacy approach designed around European requirements and the GDPR.",
      },
      {
        t: "Encrypted",
        d: "In transit (TLS 1.3) and at rest (AES-256), agent credentials included.",
      },
      {
        t: "Access limited to what is needed",
        d: "Agents only open the tools you authorize, with two-factor authentication. You revoke access at any time.",
      },
      {
        t: "Agents under control",
        d: "Your portal credentials are kept in an encrypted vault, and every action of our agents is recorded and verifiable.",
      },
      {
        t: "Never used to train models",
        d: "Your data is neither resold nor used to train third-party models.",
      },
    ],
    complianceEyebrow: "GDPR and contract",
    complianceTitle: "The GDPR framework, point by point.",
    complianceIntro: "Each point links to our terms of sale or our privacy policy.",
    sources: { cgv: "Terms of sale", privacy: "Privacy policy" },
    compliance: [
      {
        k: "Roles",
        v: "You are the data controller, Granit is the processor (GDPR article 28).",
        src: "cgv",
        ref: "Terms, article 9",
      },
      {
        k: "Incident",
        v: "Notification to the CNIL within 72 hours and to the organizations concerned.",
        src: "privacy",
        ref: "Privacy, section 8",
      },
      {
        k: "Return",
        v: "Your data in CSV or JSON, on request and no later than 30 days after the contract ends, then deleted.",
        src: "cgv",
        ref: "Terms, article 10",
      },
      {
        k: "Your rights",
        v: "Access, rectification, erasure and portability, via contact@getgranit.ai.",
        src: "privacy",
        ref: "Privacy, section 8",
      },
    ],
    faqTitle: "Frequently asked questions",
    faq: [
      {
        question: "Where is the health data hosted?",
        answer: "With an HDS-certified host, in data centers located in Europe.",
      },
      {
        question: "Is patient data used to train AI models?",
        answer:
          "No. No patient data trains third-party models, and Granit does not resell your data.",
      },
      {
        question: "How is the data protected?",
        answer:
          "Encryption in transit (TLS 1.3) and at rest (AES-256), mandatory two-factor authentication, and access limited to what is needed.",
      },
      {
        question: "Can we control what the agents do?",
        answer:
          "Yes. They only perform the actions you have configured or approved, and every action is traced and exportable.",
      },
      {
        question: "What happens to our data if we stop using Granit?",
        answer:
          "It is returned to you in CSV or JSON no later than 30 days after the contract ends, then deleted.",
      },
    ],
    asideTitle: "A security questionnaire to fill in?",
    asideText: "Send it to us, the Granit team answers it.",
    asideCta: "Email the team",
    ctaTitle: "See the agents work inside your software.",
    ctaText: "In a demo, we show you how every case is traced.",
    ctaBtn: "Book a demo",
    ctaSecondary: "Discover the agents",
    guarantees: "HDS-certified host · Data in Europe · GDPR",
  },
};

const ENGAGEMENT_ICONS: LucideIcon[] = [ShieldCheck, Globe, Lock, KeyRound, UserCheck, Ban];
const VISUAL_ICONS: LucideIcon[] = [Check, Clock3, Hourglass];
const VISUAL_BARS = ["42%", "24%", "34%"];
const SOURCE_PATHS = { cgv: "/cgv", privacy: "/privacy" } as const;

const securiteLd = [
  {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${SITE_URL}/securite#webpage`,
    url: `${SITE_URL}/securite`,
    name: TITLE,
    description: DESCRIPTION,
    inLanguage: "fr-FR",
    about: organizationRef,
    publisher: organizationRef,
  },
  faqPageLd(content.fr.faq),
];

const sectionTitle = { fontSize: "clamp(28px,3.2vw,46px)" };

function IconTile({ icon: Icon }: { icon: LucideIcon }) {
  return (
    <span
      className="grid size-10 shrink-0 place-items-center rounded-[10px] border"
      style={{ borderColor: "var(--border)", background: "var(--bg2)", color: "var(--terra)" }}
    >
      <Icon size={18} strokeWidth={1.75} aria-hidden />
    </span>
  );
}

/** Le dossier tracé, en abstrait : pas de donnée, pas de chiffre, seulement la promesse. */
function HeroVisual({ visual }: { visual: Content["visual"] }) {
  return (
    <div
      aria-hidden
      className="relative overflow-hidden rounded-[18px] border p-5 sm:p-10"
      style={{
        borderColor: "var(--border)",
        backgroundColor: "var(--bg2)",
        backgroundImage: "var(--gradient-mesh)",
      }}
    >
      <div
        className="rounded-[14px] border p-5 sm:p-6"
        style={{
          borderColor: "var(--border)",
          background: "var(--surface)",
          boxShadow: "var(--shadow-glass)",
        }}
      >
        <div className="flex items-center justify-between gap-3">
          <span
            className="flex items-center gap-2.5 text-[13.5px]"
            style={{ color: "var(--text)", fontWeight: 600 }}
          >
            <span className="status-dot" />
            {visual.title}
          </span>
          <span
            className="rounded-full border px-2.5 py-0.5 text-[11px]"
            style={{
              borderColor: "var(--border)",
              background: "var(--bg2)",
              color: "var(--terra-hover)",
              fontFamily: "var(--font-mono)",
              fontWeight: 600,
            }}
          >
            HDS
          </span>
        </div>
        <ul className="mt-5 space-y-2.5">
          {visual.rows.map((row, i) => {
            const Icon = VISUAL_ICONS[i];
            return (
              <li
                key={row}
                className="flex items-center gap-3 rounded-[10px] border px-3 py-2.5"
                style={{ borderColor: "var(--border)" }}
              >
                <span
                  className="grid size-8 shrink-0 place-items-center rounded-[8px]"
                  style={{ background: "var(--bg2)", color: "var(--terra)" }}
                >
                  <Icon size={16} strokeWidth={1.75} />
                </span>
                <span className="whitespace-nowrap text-[13.5px]" style={{ color: "var(--text)" }}>
                  {row}
                </span>
                <span
                  className="ml-auto h-2 min-w-6 flex-1 rounded-full"
                  style={{ maxWidth: VISUAL_BARS[i], background: "var(--bg3)" }}
                />
              </li>
            );
          })}
        </ul>
      </div>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        {[
          { Icon: Lock, label: visual.lock },
          { Icon: Globe, label: visual.eu },
        ].map(({ Icon, label }) => (
          <div
            key={label}
            className="flex items-center gap-3 rounded-[12px] border px-4 py-3"
            style={{
              borderColor: "var(--border)",
              background: "var(--surface)",
              boxShadow: "var(--shadow-soft)",
            }}
          >
            <Icon size={16} strokeWidth={1.75} style={{ color: "var(--terra)" }} />
            <span className="text-[13px] leading-snug" style={{ color: "var(--text-soft)" }}>
              {label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function SecuritePage() {
  const { lang } = useLanguage();
  const t = content[lang];
  return (
    <SiteLayout>
      <JsonLd data={securiteLd} />

      {/* Hero : promesse, en bref, bouton et garanties juste en dessous */}
      <section className="mx-auto max-w-[1280px] px-6 pt-24 pb-20">
        <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_1fr]">
          <Reveal>
            <p className="eyebrow mb-5">{t.eyebrow}</p>
            <h1 className="h1-hero" style={{ fontSize: "clamp(36px,4.4vw,64px)" }}>
              {t.title}
            </h1>
            <p className="body-lg mt-8 max-w-2xl">
              <strong style={{ color: "var(--text)", fontWeight: 600 }}>{t.summaryLabel}</strong>{" "}
              {t.summary}
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Link to="/" hash="demo" className="btn-primary">
                {t.heroCta} <span className="arrow">↗</span>
              </Link>
              <Link to="/privacy" className="btn-ghost">
                {t.heroSecondary}
              </Link>
            </div>
            <ul className="mt-8 flex flex-wrap gap-2.5" aria-label={t.badgesLabel}>
              {t.badges.map((b) => (
                <li
                  key={b.k}
                  className="flex items-center gap-2 rounded-full border px-3.5 py-1.5"
                  style={{ borderColor: "var(--border)", background: "var(--bg2)" }}
                >
                  <span
                    className="text-[12px]"
                    style={{
                      fontFamily: "var(--font-mono)",
                      color: "var(--terra-hover)",
                      fontWeight: 600,
                    }}
                  >
                    {b.k}
                  </span>
                  <span className="text-[12.5px]" style={{ color: "var(--text-soft)" }}>
                    {b.v}
                  </span>
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={0.15}>
            <HeroVisual visual={t.visual} />
          </Reveal>
        </div>
      </section>

      {/* Engagements : grille de six garanties */}
      <section className="mx-auto max-w-[1280px] px-6 pb-24">
        <Reveal>
          <p className="eyebrow">{t.engagementsEyebrow}</p>
          <h2 className="h2-section mt-4 max-w-3xl" style={sectionTitle}>
            {t.engagementsTitle}
          </h2>
        </Reveal>
        <Reveal delay={0.05}>
          <div
            className="mt-10 grid gap-px overflow-hidden rounded-[18px] border sm:grid-cols-2 lg:grid-cols-3"
            style={{ borderColor: "var(--border)", background: "var(--border)" }}
          >
            {t.engagements.map((e, i) => (
              <div
                key={e.t}
                className="flex flex-col p-7 sm:p-8"
                style={{ background: "var(--bg)" }}
              >
                <div className="flex items-start justify-between gap-4">
                  <IconTile icon={ENGAGEMENT_ICONS[i]} />
                  <span
                    className="text-[11px]"
                    style={{ fontFamily: "var(--font-mono)", color: "var(--text-muted)" }}
                  >
                    0{i + 1}
                  </span>
                </div>
                <h3
                  className="mt-6 font-serif text-[21px] leading-snug sm:mt-10"
                  style={{ fontWeight: 400, letterSpacing: "-0.01em" }}
                >
                  {e.t}
                </h3>
                <p
                  className="mt-2.5 text-[14.5px] leading-[1.65]"
                  style={{ color: "var(--text-soft)" }}
                >
                  {e.d}
                </p>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* Conformité : chaque ligne renvoie aux CGV ou à la politique de confidentialité */}
      <section id="conformite" className="mx-auto max-w-[1280px] scroll-mt-[96px] px-6 pb-12">
        <Reveal>
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between lg:gap-12">
            <div className="max-w-3xl">
              <p className="eyebrow">{t.complianceEyebrow}</p>
              <h2 className="h2-section mt-4" style={sectionTitle}>
                {t.complianceTitle}
              </h2>
              <p className="body-lg mt-5">{t.complianceIntro}</p>
            </div>
            <div className="flex shrink-0 flex-wrap gap-3">
              <Link to="/cgv" className="btn-ghost">
                {t.sources.cgv}
              </Link>
              <Link to="/privacy" className="btn-ghost">
                {t.sources.privacy}
              </Link>
            </div>
          </div>
        </Reveal>
        <Reveal delay={0.05}>
          <dl className="mt-10 border-t" style={{ borderColor: "var(--border)" }}>
            {t.compliance.map((c) => (
              <div
                key={c.k}
                className="grid gap-1.5 border-b py-5 md:grid-cols-[200px_1fr_180px] md:items-baseline md:gap-8"
                style={{ borderColor: "var(--border)" }}
              >
                <dt
                  className="text-[11px] uppercase tracking-[0.12em]"
                  style={{
                    fontFamily: "var(--font-mono)",
                    color: "var(--text-muted)",
                    fontWeight: 500,
                  }}
                >
                  {c.k}
                </dt>
                <dd className="text-[15.5px] leading-[1.6]" style={{ color: "var(--text)" }}>
                  {c.v}
                </dd>
                <dd className="text-[12.5px] md:text-right">
                  <Link
                    to={SOURCE_PATHS[c.src]}
                    className="underline underline-offset-[3px]"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {c.ref}
                  </Link>
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </section>

      {/* FAQ (même texte que le FAQPage) et contact pour les questionnaires */}
      <section className="mx-auto max-w-[1280px] px-6 pb-24">
        <div className="grid gap-10 lg:grid-cols-[1.6fr_1fr] lg:gap-16">
          <div className="min-w-0">
            <Faq items={t.faq} titre={t.faqTitle} />
          </div>
          <aside className="lg:sticky lg:top-28 lg:mt-12 lg:self-start">
            <div
              className="rounded-[14px] border p-7"
              style={{ borderColor: "var(--border)", background: "var(--bg2)" }}
            >
              <IconTile icon={Mail} />
              <h3 className="mt-5 font-serif text-[22px] leading-snug" style={{ fontWeight: 400 }}>
                {t.asideTitle}
              </h3>
              <p
                className="mt-3 text-[14.5px] leading-[1.65]"
                style={{ color: "var(--text-soft)" }}
              >
                {t.asideText}
              </p>
              <a href={`mailto:${CONTACT_EMAIL}`} className="btn-ghost mt-6">
                {t.asideCta} <span aria-hidden>→</span>
              </a>
              <p
                className="mt-3 text-[12.5px]"
                style={{ color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}
              >
                {CONTACT_EMAIL}
              </p>
            </div>
          </aside>
        </div>
      </section>

      {/* Appel final : bouton, garanties visibles à côté */}
      <section className="mx-auto max-w-[1280px] px-6 pb-28">
        <Reveal>
          <div
            className="grid gap-8 rounded-[18px] border p-8 sm:p-12 lg:grid-cols-[1.2fr_1fr] lg:items-center"
            style={{ borderColor: "var(--border)", background: "var(--bg2)" }}
          >
            <div>
              <h2 className="h2-section" style={{ fontSize: "clamp(28px,3vw,42px)" }}>
                {t.ctaTitle}
              </h2>
              <p className="body-lg mt-4 max-w-xl">{t.ctaText}</p>
            </div>
            <div className="lg:justify-self-end">
              <div className="flex flex-wrap gap-3">
                <Link to="/" hash="demo" className="btn-primary">
                  {t.ctaBtn} <span className="arrow">↗</span>
                </Link>
                <Link to="/agents" className="btn-ghost">
                  {t.ctaSecondary}
                </Link>
              </div>
              <p
                className="mt-4 text-[12.5px]"
                style={{ color: "var(--text-soft)", fontFamily: "var(--font-mono)" }}
              >
                {t.guarantees}
              </p>
            </div>
          </div>
        </Reveal>
      </section>
    </SiteLayout>
  );
}
