import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { Reveal } from "@/components/Reveal";
import { JsonLd } from "@/components/JsonLd";
import { AppelFinal, FaqAgents } from "@/components/agents/Blocs";
import { CADRAGES, METIERS, PHOTOS, SLUGS_METIERS, estSlugMetier } from "@/components/agents/metiers";
import { useLanguage } from "@/lib/i18n";
import { SITE_URL, faqPageLd, organizationRef } from "@/lib/seo";

/**
 * /agents : l'aiguillage. Un hero court, les cinq métiers en grandes cartes photo (chacune mène à
 * sa page /agents/<slug>), ce que font tous les agents, la sécurité, la FAQ commune.
 * L'ancienne adresse /agents?metier=<slug> redirige (301) vers la page du métier.
 */
export const Route = createFileRoute("/agents/")({
  validateSearch: (search: Record<string, unknown>): { metier?: string } =>
    estSlugMetier(search.metier) ? { metier: search.metier } : {},
  beforeLoad: ({ search }) => {
    if (estSlugMetier(search.metier))
      throw redirect({ to: "/agents/$metier", params: { metier: search.metier }, statusCode: 301 });
  },
  head: () => ({
    meta: [
      { title: "Les agents Granit, métier par métier" },
      { name: "description", content: content.fr.chapo },
      { property: "og:title", content: "Les agents Granit, métier par métier" },
      { property: "og:description", content: content.fr.chapo },
    ],
  }),
  component: AgentsPage,
});

const content = {
  fr: {
    eyebrow: "Agents",
    titre: ["Des agents pour le tiers payant", "de votre métier."],
    chapo: "Droits, prises en charge, facturation, encaissement : les agents font l'administratif, dans les logiciels que vos équipes utilisent déjà.",
    demo: "Demander une démo",
    metiersTitre: "Choisissez votre métier.",
    voir: "Voir les agents",
    tachesEyebrow: "Dans chaque métier",
    tachesTitre: ["Ce que font", "tous les agents."],
    taches: [
      { titre: "Droits", texte: "Ils vérifient les droits AMO et AMC avant le devis, la consultation ou l'admission." },
      { titre: "Prise en charge", texte: "Ils saisissent les demandes sur les portails des mutuelles et suivent les réponses." },
      { titre: "Facturation", texte: "Ils facturent et télétransmettent à l'Assurance Maladie et aux mutuelles." },
      { titre: "Encaissement", texte: "Ils pointent les virements, traitent les rejets et relancent les impayés." },
    ],
    securite: ["Hébergeur certifié HDS", "Conforme RGPD", "Chaque dossier tracé"],
    securiteLien: "Voir la sécurité",
    faqTitre: "Questions fréquentes",
    faq: [
      { question: "Qu'est-ce qu'un agent Granit ?", answer: "Un agent fait une tâche administrative précise à la place de votre équipe : vérifier les droits, saisir une prise en charge, facturer, traiter un rejet, pointer un virement, relancer un impayé. Un gestionnaire Granit suit les cas particuliers et prévient l'équipe." },
      { question: "Faut-il changer de logiciel ou demander une API ?", answer: "Non. Les agents travaillent dans les logiciels que vos équipes utilisent déjà et sur les portails des mutuelles, comme le ferait une personne. Granit est branché sur vos portails en 48 h." },
      { question: "Peut-on contrôler ce que font les agents ?", answer: "Oui. Chaque dossier est tracé : ce qui a été fait, quand, et pourquoi un dossier attend. Les données de santé sont confiées à un hébergeur certifié HDS, dans l'Union européenne, conformément au RGPD." },
      { question: "Combien coûte Granit ?", answer: "Granit ne facture que les dossiers traités avec succès. Le tarif standard est détaillé sur la page Tarifs.", tarifs: "Voir les tarifs" },
    ],
    finTitre: ["Voyez les agents", "sur vos propres dossiers."] as [string, string],
    finTexte: "En visio, sur vos cas et dans vos logiciels. Vous repartez avec ce que Granit prendrait en charge chez vous.",
  },
  en: {
    eyebrow: "Agents",
    titre: ["Agents for the third-party payment", "of your trade."],
    chapo: "Eligibility, coverage, billing, payments: agents run the administrative work, in the software your teams already use.",
    demo: "Book a demo",
    metiersTitre: "Pick your trade.",
    voir: "See the agents",
    tachesEyebrow: "In every trade",
    tachesTitre: ["What every agent", "does."],
    taches: [
      { titre: "Eligibility", texte: "They check public and private coverage before the quote, the visit or the admission." },
      { titre: "Coverage", texte: "They file requests on insurer portals and follow the answers." },
      { titre: "Billing", texte: "They bill and transmit to the public scheme and insurers." },
      { titre: "Payments", texte: "They match transfers, handle rejections and follow up on unpaid ones." },
    ],
    securite: ["HDS-certified host", "GDPR compliant", "Every file traced"],
    securiteLien: "See security",
    faqTitre: "Frequently asked questions",
    faq: [
      { question: "What is a Granit agent?", answer: "An agent runs one precise administrative task for your team: checking eligibility, filing coverage, billing, handling a rejection, matching a transfer, following up on an unpaid invoice. A Granit case manager follows special cases and alerts the team." },
      { question: "Do we need to change software or request an API?", answer: "No. Agents work in the software your teams already use and on insurer portals, as a person would. Granit is connected to your portals in 48 h." },
      { question: "Can we control what the agents do?", answer: "Yes. Every file is traced: what was done, when, and why a file is waiting. Health data is entrusted to an HDS-certified host in the European Union, in line with GDPR." },
      { question: "How much does Granit cost?", answer: "Granit only bills files processed successfully. The standard pricing is detailed on the Pricing page.", tarifs: "See pricing" },
    ],
    finTitre: ["See the agents", "on your own files."] as [string, string],
    finTexte: "On a video call, on your cases and in your software. You leave knowing what Granit would take over for you.",
  },
};

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
  },
  faqPageLd(content.fr.faq),
];

function AgentsPage() {
  const { lang } = useLanguage();
  const t = content[lang];

  return (
    <SiteLayout>
      <JsonLd data={agentsLd} />

      <section className="mx-auto max-w-[1120px] px-4 pt-14 pb-10 sm:px-6 md:pt-20">
        <Reveal>
          <div className="eyebrow mb-5">{t.eyebrow}</div>
          <h1 className="h1-hero max-w-[16ch]" style={{ fontSize: "clamp(40px, 5.4vw, 76px)" }}>
            {t.titre[0]} <span className="accent-italic">{t.titre[1]}</span>
          </h1>
          <p className="body-lg mt-6 max-w-[60ch]">{t.chapo}</p>
          <Link to="/" hash="demo" className="btn-primary mt-8">
            {t.demo} <span className="arrow">↗</span>
          </Link>
        </Reveal>
      </section>

      <section id="metiers" className="mx-auto max-w-[1120px] px-4 pb-12 sm:px-6" aria-label={t.metiersTitre}>
        <ul className="grid gap-4 md:grid-cols-6">
          {SLUGS_METIERS.map((slug, i) => {
            const m = METIERS[lang][slug];
            return (
              <li key={slug} className={i < 2 ? "md:col-span-3" : "md:col-span-2"}>
                <Reveal delay={i * 0.05}>
                  <Link
                    to="/agents/$metier"
                    params={{ metier: slug }}
                    className="group relative isolate block overflow-hidden rounded-[18px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--profond)]"
                    style={{ background: "var(--encre)" }}
                  >
                    <img
                      src={PHOTOS[slug]}
                      alt=""
                      width={520}
                      height={780}
                      loading={i < 2 ? "eager" : "lazy"}
                      className={`w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.045] ${i < 2 ? "aspect-[4/5] md:aspect-[5/4]" : "aspect-[4/5]"}`}
                      style={{ objectPosition: CADRAGES[slug] }}
                    />
                    <span
                      aria-hidden
                      className="absolute inset-0"
                      style={{ background: "linear-gradient(0deg, rgba(16, 33, 29, 0.86) 0%, rgba(16, 33, 29, 0.45) 38%, rgba(16, 33, 29, 0) 65%)" }}
                    />
                    <span className="absolute inset-x-0 bottom-0 grid gap-2 p-5 md:p-6" style={{ color: "var(--rose)" }}>
                      <span className="font-serif text-[24px] leading-[1.1] md:text-[26px]">{m.nom}</span>
                      <span className="max-w-[40ch] text-[14.5px] leading-[1.5]" style={{ color: "var(--sur-encre-secondaire)" }}>
                        {m.accroche}
                      </span>
                      <span className="mt-1 inline-flex items-center gap-2 text-[14px] font-medium" style={{ color: "var(--menthe)" }}>
                        {t.voir} <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                      </span>
                    </span>
                  </Link>
                </Reveal>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="mx-auto max-w-[1120px] px-4 py-10 sm:px-6 md:py-14">
        <Reveal>
          <div className="eyebrow">{t.tachesEyebrow}</div>
          <h2 className="mt-4 font-serif text-[clamp(28px,3.2vw,44px)] leading-[1.08] tracking-[-0.02em]">
            {t.tachesTitre[0]} <span className="accent-italic">{t.tachesTitre[1]}</span>
          </h2>
          <ul className="mt-9 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {t.taches.map((c) => (
              <li key={c.titre} className="border-t pt-5" style={{ borderColor: "var(--filet)" }}>
                <div className="text-[17px] font-medium">{c.titre}</div>
                <p className="mt-2 text-[15px] leading-[1.55]" style={{ color: "var(--texte-secondaire)" }}>
                  {c.texte}
                </p>
              </li>
            ))}
          </ul>
        </Reveal>
      </section>

      <section className="mx-auto max-w-[1120px] px-4 pb-14 sm:px-6">
        <Reveal>
          <div className="section-sombre flex flex-col gap-5 rounded-[18px] px-6 py-6 md:flex-row md:items-center md:justify-between md:px-10">
            <ul className="flex flex-wrap gap-x-6 gap-y-2 text-[15px]">
              {t.securite.map((s) => (
                <li key={s} className="flex items-center gap-2">
                  <svg viewBox="0 0 12 12" className="size-3" aria-hidden>
                    <path d="M2.5 6.2l2.3 2.3 4.7-5" fill="none" stroke="var(--menthe)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {s}
                </li>
              ))}
            </ul>
            <Link to="/securite" className="text-[14px] font-medium underline underline-offset-4" style={{ color: "var(--menthe)" }}>
              {t.securiteLien}
            </Link>
          </div>
        </Reveal>
      </section>

      <FaqAgents titre={t.faqTitre} items={t.faq} />
      <AppelFinal titre={t.finTitre} texte={t.finTexte} bouton={t.demo} />
    </SiteLayout>
  );
}
