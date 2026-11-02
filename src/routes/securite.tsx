import { createFileRoute, Link } from "@tanstack/react-router";
import {
  AppWindow,
  Ban,
  Check,
  Clock3,
  Crosshair,
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
// (/privacy), de la FAQ de la PR #94 ou de marque/TON.md (dépôt GetGranit/internal).
// On n'en ajoute aucun qui n'y figure pas.

const TITLE = "Sécurité des données de santé (HDS, RGPD) - Granit";
const DESCRIPTION =
  "Granit est certifié HDS : données de santé hébergées dans l’UE, chiffrées, jamais utilisées pour entraîner des modèles tiers. RGPD, traçabilité, réversibilité.";
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
          "Certifié HDS, données dans l’Union européenne, RGPD : comment Granit héberge, protège et trace les données de santé de vos patients.",
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
  intro: string;
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
  accessEyebrow: string;
  accessTitle: string;
  accessIntro: string;
  accessLink: string;
  access: Item[];
  traceTitle: string;
  traceText: string;
  traceCta: string;
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
    title: "Les données de vos patients restent protégées, du dossier au paiement.",
    intro:
      "Les agents Granit font l’administratif de vos équipes, dans les logiciels qu’elles utilisent déjà. Voici comment les données qu’ils traitent sont hébergées, protégées et tracées.",
    summaryLabel: "En bref :",
    summary:
      "Granit est certifié HDS (hébergeur de données de santé). Les données sont hébergées dans l’Union européenne, chiffrées en transit et au repos, et ne servent jamais à entraîner des modèles tiers. Chaque action d’agent est journalisée. Vous récupérez vos données à tout moment, et elles sont supprimées dans les 30 jours qui suivent la fin du contrat.",
    heroCta: "Demander une démo",
    heroSecondary: "Politique de confidentialité",
    badgesLabel: "Garanties",
    badges: [
      { k: "HDS", v: "Granit certifié" },
      { k: "UE", v: "Hébergement dans l’Union européenne" },
      { k: "RGPD", v: "Données de santé, article 9" },
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
        t: "Certifié HDS",
        d: "Granit est certifié HDS (hébergeur de données de santé) : les données de vos patients, sauvegardes comprises, sont hébergées chez un hébergeur certifié.",
      },
      {
        t: "Hébergées dans l’Union européenne",
        d: "Sans transfert hors de l’UE. Si Granit change de prestataire technique, pour l’hébergement comme pour les modèles d’intelligence artificielle, nos conditions générales l’obligent à garder les données dans l’Union européenne.",
      },
      {
        t: "Chiffrées en transit et au repos",
        d: "Les données sont chiffrées en transit (TLS 1.3) et au repos (AES-256), tout comme les accès que les agents utilisent dans vos outils.",
      },
      {
        t: "Des accès au strict nécessaire",
        d: "Double authentification (MFA) obligatoire et rôles définis par établissement. Chacun, personne ou agent, n’accède qu’à ce dont il a besoin : c’est le principe du moindre privilège.",
      },
      {
        t: "Votre équipe garde la main",
        d: "Chaque action d’agent est journalisée, horodatée et attribuable, et chaque décision reste révisable par une personne de votre équipe.",
      },
      {
        t: "Ni revendues, ni utilisées pour entraîner des modèles",
        d: "Aucune donnée patient ne sert à entraîner des modèles tiers. Granit ne cède, ne revend ni n’exploite vos données à des fins propres, et les modèles utilisés sont hébergés en Europe.",
      },
    ],
    accessEyebrow: "Accès à vos outils",
    accessTitle: "Les agents travaillent dans vos logiciels, avec les accès que vous leur donnez.",
    accessIntro:
      "Sans API à demander ni nouveau logiciel : les agents se connectent pour votre compte aux outils que vous avez autorisés, comme le ferait une personne de votre équipe.",
    accessLink: "Le détail dans notre politique de confidentialité",
    access: [
      {
        t: "Seulement les outils que vous autorisez",
        d: "Logiciel métier, plateformes de tiers payant, banque, messagerie (Gmail, Outlook, IMAP) : les agents ne se connectent qu’aux outils que vous avez autorisés.",
      },
      {
        t: "Seulement ce que demande la tâche",
        d: "Ils ne lisent que les informations nécessaires à la tâche configurée, et n’y font que les actions que vous avez configurées ou validées.",
      },
      {
        t: "Des accès chiffrés et révocables",
        d: "Identifiants et autorisations OAuth sont conservés chiffrés. Vous les révoquez à tout moment depuis la page Accès de l’application Granit, ou chez l’éditeur de l’outil.",
      },
      {
        t: "La messagerie, au strict nécessaire",
        d: "Les agents lisent les e-mails utiles à la tâche, comme les codes de double authentification des plateformes ou les factures reçues. Un e-mail n’est conservé que s’il fait partie du résultat demandé.",
      },
    ],
    traceTitle:
      "Chaque dossier est tracé : ce qui a été fait, quand, et pourquoi un dossier attend.",
    traceText:
      "Le journal est exportable : aucune action d’agent dans vos outils ne passe sans laisser de trace.",
    traceCta: "Voir le cadre RGPD et contractuel",
    complianceEyebrow: "RGPD et contrat",
    complianceTitle: "Le cadre RGPD et contractuel, point par point.",
    complianceIntro:
      "Chaque ligne renvoie au texte qui nous engage : nos conditions générales de vente ou notre politique de confidentialité.",
    sources: { cgv: "Conditions générales de vente", privacy: "Politique de confidentialité" },
    compliance: [
      {
        k: "Rôles",
        v: "Pour les données que vous confiez à Granit, vous êtes responsable de traitement et Granit est sous-traitant (article 28 du RGPD).",
        src: "cgv",
        ref: "CGV, article 9",
      },
      {
        k: "Accord de traitement",
        v: "Intégré au contrat de service, comme l’exige l’article 28 du RGPD.",
        src: "cgv",
        ref: "CGV, article 9",
      },
      {
        k: "Données de santé",
        v: "Traitées pour votre compte dans le cadre de l’article 9 du RGPD et du Code de la santé publique.",
        src: "privacy",
        ref: "Confidentialité, section 4",
      },
      {
        k: "Prestataires techniques",
        v: "Pour l’hébergement comme pour les modèles d’intelligence artificielle, l’hébergement reste dans l’Union européenne et le niveau de sécurité est maintenu. Granit reste seul responsable envers vous.",
        src: "cgv",
        ref: "CGV, article 5",
      },
      {
        k: "Incident",
        v: "Notification à la CNIL sous 72 h et information des établissements concernés.",
        src: "privacy",
        ref: "Confidentialité, section 8",
      },
      {
        k: "Restitution",
        v: "Vos données dans un format standard (CSV ou JSON), à tout moment sur demande et au plus tard 30 jours après la fin du contrat, puis supprimées définitivement.",
        src: "cgv",
        ref: "CGV, article 10",
      },
      {
        k: "Résiliation",
        v: "À tout moment, par e-mail, avec un préavis de 30 jours, sans pénalité ni frais.",
        src: "cgv",
        ref: "CGV, article 14",
      },
      {
        k: "Droits des personnes",
        v: "Accès, rectification, effacement, limitation, opposition et portabilité, à exercer auprès de contact@getgranit.ai. Réclamation possible auprès de la CNIL.",
        src: "privacy",
        ref: "Confidentialité, section 8",
      },
    ],
    faqTitle: "Questions fréquentes",
    faq: [
      {
        question: "Granit est-il certifié HDS ?",
        answer:
          "Oui. Granit est certifié HDS (hébergeur de données de santé). Les données sont hébergées dans l’Union européenne, sauvegardes comprises, sans transfert hors de l’Union européenne.",
      },
      {
        question: "Les données des patients servent-elles à entraîner des modèles d’IA ?",
        answer:
          "Non. Aucune donnée patient n’est utilisée pour entraîner des modèles tiers, et Granit ne cède, ne revend ni n’exploite vos données à des fins propres. Les modèles utilisés sont déployés dans des environnements isolés, hébergés en Europe.",
      },
      {
        question: "Comment les données sont-elles protégées ?",
        answer:
          "Elles sont chiffrées en transit (TLS 1.3) et au repos (AES-256). La double authentification (MFA) est obligatoire, les rôles sont définis par établissement, et chacun, personne ou agent, n’accède qu’à ce dont il a besoin (principe du moindre privilège).",
      },
      {
        question: "À quels outils les agents accèdent-ils ?",
        answer:
          "Seulement à ceux que vous avez autorisés (logiciel métier, plateformes de tiers payant, banque, messagerie), et seulement aux informations nécessaires à la tâche. Les accès sont conservés chiffrés, et vous pouvez les révoquer à tout moment depuis la page Accès de l’application.",
      },
      {
        question: "Peut-on contrôler ce que font les agents ?",
        answer:
          "Oui. Les agents ne font que les actions que vous avez configurées ou validées. Chaque action est journalisée, horodatée, attribuable et exportable : ce qui a été fait, quand, et pourquoi un dossier attend. Chaque décision reste révisable par une personne de votre équipe.",
      },
      {
        question: "Qui est responsable de traitement au sens du RGPD ?",
        answer:
          "Pour les données que vous confiez à Granit, vous êtes responsable de traitement et Granit agit comme sous-traitant (article 28 du RGPD). L’accord de traitement des données est intégré au contrat de service.",
      },
      {
        question: "Que deviennent nos données si nous arrêtons Granit ?",
        answer:
          "Le contrat se résilie à tout moment par e-mail, avec un préavis de 30 jours, sans pénalité ni frais. Vos données vous sont remises dans un format standard (CSV ou JSON) au plus tard 30 jours après la fin du contrat, puis supprimées définitivement. Vous pouvez aussi en demander l’export à tout moment.",
      },
      {
        question: "Que se passe-t-il en cas d’incident de sécurité ?",
        answer:
          "Granit suit la procédure prévue par le RGPD : notification à la CNIL sous 72 h et information des établissements concernés.",
      },
    ],
    asideTitle: "Un questionnaire sécurité à remplir ?",
    asideText:
      "Envoyez-le-nous : l’équipe Granit répond aux questionnaires HDS et à ceux de votre responsable de la sécurité.",
    asideCta: "Écrire à l’équipe",
    ctaTitle: "Voyez les agents travailler dans vos logiciels.",
    ctaText:
      "En démo, nous vous montrons ce que font les agents dans vos outils et comment chaque dossier est tracé.",
    ctaBtn: "Demander une démo",
    ctaSecondary: "Découvrir les agents",
    guarantees: "Certifié HDS · Données dans l’UE · RGPD",
  },
  en: {
    eyebrow: "Security and compliance",
    title: "Your patients' data stays protected, from record to payment.",
    intro:
      "Granit's agents handle your teams' admin work, inside the software they already use. Here is how the data they process is hosted, protected and traced.",
    summaryLabel: "In short:",
    summary:
      "Granit is HDS certified (French certification for health data hosting). Data is hosted in the European Union, encrypted in transit and at rest, and never used to train third-party models. Every agent action is logged. You can retrieve your data at any time, and it is deleted within 30 days after the contract ends.",
    heroCta: "Book a demo",
    heroSecondary: "Privacy policy",
    badgesLabel: "Guarantees",
    badges: [
      { k: "HDS", v: "Granit certified" },
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
        t: "HDS certified",
        d: "Granit is HDS certified (health data hosting): your patients' data, backups included, is hosted with a certified provider.",
      },
      {
        t: "Hosted in the European Union",
        d: "No transfer outside the EU. If Granit changes technical provider, for hosting or for artificial intelligence models, our terms require it to keep the data in the European Union.",
      },
      {
        t: "Encrypted in transit and at rest",
        d: "Data is encrypted in transit (TLS 1.3) and at rest (AES-256), as are the credentials agents use in your tools.",
      },
      {
        t: "Access limited to what is needed",
        d: "Mandatory two-factor authentication (MFA) and roles defined per organization. Everyone, person or agent, only accesses what they need: the least-privilege principle.",
      },
      {
        t: "Your team stays in control",
        d: "Every agent action is logged, timestamped and attributable, and every decision can be reviewed by a person on your team.",
      },
      {
        t: "Never sold, never used to train models",
        d: "No patient data is used to train third-party models. Granit does not transfer, resell or exploit your data for its own purposes, and the models used are hosted in Europe.",
      },
    ],
    accessEyebrow: "Access to your tools",
    accessTitle: "Agents work inside your software, with the access you give them.",
    accessIntro:
      "No API to request, no new software: agents connect on your behalf to the tools you have authorized, just as a person on your team would.",
    accessLink: "Full details in our privacy policy",
    access: [
      {
        t: "Only the tools you authorize",
        d: "Practice software, third-party payer platforms, bank, mailbox (Gmail, Outlook, IMAP): agents only connect to the tools you have authorized.",
      },
      {
        t: "Only what the task requires",
        d: "They only read the information needed for the configured task, and only perform the actions you have configured or approved.",
      },
      {
        t: "Encrypted, revocable access",
        d: "Credentials and OAuth authorizations are stored encrypted. You can revoke them at any time from the Access page of the Granit application, or with the tool's provider.",
      },
      {
        t: "Mailbox access kept to the minimum",
        d: "Agents read the emails relevant to the task, such as two-factor authentication codes from platforms or received invoices. An email is kept only if it is part of the requested output.",
      },
    ],
    traceTitle: "Every case is traced: what was done, when, and why a case is waiting.",
    traceText: "The log can be exported: no agent action in your tools goes untraced.",
    traceCta: "See the GDPR and contractual framework",
    complianceEyebrow: "GDPR and contract",
    complianceTitle: "The GDPR and contractual framework, point by point.",
    complianceIntro:
      "Each line points to the document that binds us: our general terms and conditions or our privacy policy.",
    sources: { cgv: "General terms and conditions", privacy: "Privacy policy" },
    compliance: [
      {
        k: "Roles",
        v: "For the data you entrust to Granit, you are the controller and Granit is the processor (article 28 GDPR).",
        src: "cgv",
        ref: "Terms, article 9",
      },
      {
        k: "Data processing agreement",
        v: "Included in the service contract, as required by article 28 GDPR.",
        src: "cgv",
        ref: "Terms, article 9",
      },
      {
        k: "Health data",
        v: "Processed on your behalf under article 9 GDPR and the French Public Health Code.",
        src: "privacy",
        ref: "Privacy policy, section 4",
      },
      {
        k: "Technical providers",
        v: "For hosting as for artificial intelligence models, hosting stays in the European Union and the security level is maintained. Granit remains solely responsible to you.",
        src: "cgv",
        ref: "Terms, article 5",
      },
      {
        k: "Incident",
        v: "Notification to the CNIL within 72 hours and notification of the organizations concerned.",
        src: "privacy",
        ref: "Privacy policy, section 8",
      },
      {
        k: "Data return",
        v: "Your data in a standard format (CSV or JSON), at any time on request and no later than 30 days after the contract ends, then permanently deleted.",
        src: "cgv",
        ref: "Terms, article 10",
      },
      {
        k: "Termination",
        v: "At any time, by email, with 30 days' notice, with no penalty or fee.",
        src: "cgv",
        ref: "Terms, article 14",
      },
      {
        k: "Data subject rights",
        v: "Access, rectification, erasure, restriction, objection and portability, by writing to contact@getgranit.ai. A complaint may be lodged with the CNIL.",
        src: "privacy",
        ref: "Privacy policy, section 8",
      },
    ],
    faqTitle: "Frequently asked questions",
    faq: [
      {
        question: "Is Granit HDS certified?",
        answer:
          "Yes. Granit is HDS certified (health data hosting). Data is hosted in the European Union, backups included, with no transfer outside the European Union.",
      },
      {
        question: "Is patient data used to train AI models?",
        answer:
          "No. No patient data is used to train third-party models, and Granit does not transfer, resell or exploit your data for its own purposes. The models used run in isolated environments hosted in Europe.",
      },
      {
        question: "How is data protected?",
        answer:
          "It is encrypted in transit (TLS 1.3) and at rest (AES-256). Two-factor authentication (MFA) is mandatory, roles are defined per organization, and everyone, person or agent, only accesses what they need (least privilege).",
      },
      {
        question: "Which tools do the agents access?",
        answer:
          "Only those you have authorized (practice software, third-party payer platforms, bank, mailbox), and only the information the task needs. Access is stored encrypted, and you can revoke it at any time from the Access page of the application.",
      },
      {
        question: "Can we control what the agents do?",
        answer:
          "Yes. Agents only perform the actions you have configured or approved. Every action is logged, timestamped, attributable and exportable: what was done, when, and why a case is waiting. Every decision can be reviewed by a person on your team.",
      },
      {
        question: "Who is the data controller under GDPR?",
        answer:
          "For the data you entrust to Granit, you are the controller and Granit acts as processor (article 28 GDPR). The data processing agreement is included in the service contract.",
      },
      {
        question: "What happens to our data if we stop using Granit?",
        answer:
          "The contract can be cancelled at any time by email, with 30 days' notice, with no penalty or fee. Your data is returned in a standard format (CSV or JSON) no later than 30 days after the contract ends, then permanently deleted. You can also request an export at any time.",
      },
      {
        question: "What happens in case of a security incident?",
        answer:
          "Granit follows the GDPR procedure: notification to the CNIL within 72 hours and notification of the organizations concerned.",
      },
    ],
    asideTitle: "A security questionnaire to fill in?",
    asideText:
      "Send it to us: the Granit team answers HDS questionnaires and those from your security officer.",
    asideCta: "Email the team",
    ctaTitle: "See the agents work inside your software.",
    ctaText:
      "In a demo, we show you what the agents do in your tools and how every case is traced.",
    ctaBtn: "Book a demo",
    ctaSecondary: "Discover the agents",
    guarantees: "HDS certified · Data in the EU · GDPR",
  },
};

const ENGAGEMENT_ICONS: LucideIcon[] = [ShieldCheck, Globe, Lock, KeyRound, UserCheck, Ban];
const ACCESS_ICONS: LucideIcon[] = [AppWindow, Crosshair, KeyRound, Mail];
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
            <p className="body-lg mt-8 max-w-2xl">{t.intro}</p>
            <p
              className="mt-6 max-w-2xl text-[14px] leading-[1.7]"
              style={{ color: "var(--text-soft)" }}
            >
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

      {/* Accès : dans les logiciels que vos équipes utilisent déjà */}
      <section
        className="border-y py-20 sm:py-24"
        style={{ borderColor: "var(--border)", background: "var(--bg2)" }}
      >
        <div className="mx-auto grid max-w-[1280px] gap-10 px-6 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <Reveal className="lg:sticky lg:top-28 lg:self-start">
            <p className="eyebrow">{t.accessEyebrow}</p>
            <h2 className="h2-section mt-4" style={sectionTitle}>
              {t.accessTitle}
            </h2>
            <p className="body-lg mt-6">{t.accessIntro}</p>
            <Link
              to="/privacy"
              className="mt-6 inline-flex items-center gap-1.5 text-[14px] underline underline-offset-[3px]"
              style={{ color: "var(--terra-hover)", fontWeight: 500 }}
            >
              {t.accessLink} <span aria-hidden>→</span>
            </Link>
          </Reveal>
          <div className="grid gap-4 sm:grid-cols-2">
            {t.access.map((a, i) => (
              <Reveal key={a.t} delay={i * 0.05}>
                <div
                  className="card-hover h-full rounded-[14px] border p-6"
                  style={{ borderColor: "var(--border)", background: "var(--surface)" }}
                >
                  <IconTile icon={ACCESS_ICONS[i]} />
                  <h3 className="mt-5 text-[16.5px] leading-snug" style={{ fontWeight: 600 }}>
                    {a.t}
                  </h3>
                  <p
                    className="mt-2 text-[14.5px] leading-[1.65]"
                    style={{ color: "var(--text-soft)" }}
                  >
                    {a.d}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Traçabilité : la phrase de TON.md, en bandeau */}
      <section className="mx-auto max-w-[1280px] px-6 py-16 sm:py-24">
        <Reveal>
          <div
            className="rounded-[18px] border px-6 py-16 text-center sm:px-12 sm:py-20"
            style={{
              borderColor: "var(--border)",
              backgroundColor: "var(--bg2)",
              backgroundImage: "var(--gradient-mesh)",
            }}
          >
            <h2
              className="h2-section mx-auto max-w-4xl"
              style={{ fontSize: "clamp(26px,3vw,42px)" }}
            >
              {t.traceTitle}
            </h2>
            <p className="body-lg mx-auto mt-5 max-w-xl">{t.traceText}</p>
            <a href="#conformite" className="btn-ghost mt-8">
              {t.traceCta} <span aria-hidden>↓</span>
            </a>
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
