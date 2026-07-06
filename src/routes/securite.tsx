import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { Reveal } from "@/components/Reveal";
import { useLanguage } from "@/lib/i18n";
import securiteHero from "@/assets/securite-hero.jpg";
import securiteTrust from "@/assets/securite-trust.jpg";

export const Route = createFileRoute("/securite")({
  head: () => ({
    meta: [
      { title: "Sécurité & conformité santé - Granit AI" },
      { name: "description", content: "HDS, RGPD, secret médical, chiffrement, MFA, journalisation et réversibilité. Conçu pour les données de santé." },
      { property: "og:title", content: "Sécurité & conformité santé - Granit AI" },
      { property: "og:description", content: "Le standard le plus strict du secteur santé français et européen." },
    ],
  }),
  component: SecuritePage,
});

const content = {
  fr: {
    eyebrow: "Sécurité & conformité santé",
    title: "Vos données de santé méritent le plus haut niveau d'exigence.",
    intro:
      "Granit est conçu dès l'origine pour les contraintes réglementaires des établissements de santé : HDS, RGPD, secret médical, référentiels ANS. Aucune donnée patient ne sort jamais du périmètre de confiance.",
    badges: [
      { k: "HDS", v: "Hébergeur certifié" },
      { k: "RGPD", v: "Conforme art. 9" },
      { k: "ANSSI", v: "Bonnes pratiques" },
      { k: "🇫🇷", v: "Données en France" },
      { k: "PGSSI-S", v: "Référentiel ANS" },
    ],
    pillarsTitle: "Six garanties non négociables",
    items: [
      {
        t: "Hébergement HDS en France",
        d: "Données patients hébergées exclusivement chez un hébergeur certifié HDS (Health Data Hosting), avec résidence et sauvegardes en France. Aucun transfert hors UE.",
      },
      {
        t: "RGPD & secret médical",
        d: "Traitement conforme au RGPD article 9 (données sensibles) et au Code de la santé publique. DPO dédié, registre des traitements, AIPD, contrats sous-traitants (DPA) et respect du secret professionnel.",
      },
      {
        t: "Chiffrement de bout en bout",
        d: "Données chiffrées en transit (TLS 1.3) et au repos (AES-256). Clés gérées via KMS dédié, rotation automatique, isolation par établissement.",
      },
      {
        t: "Contrôle d'accès strict",
        d: "SSO (SAML, OIDC), MFA obligatoire, rôles fins par établissement, service et périmètre métier. Principe du moindre privilège appliqué côté humains et agents.",
      },
      {
        t: "Traçabilité & auditabilité",
        d: "Chaque action d'agent est journalisée, horodatée, attribuable et exportable. Logs immuables conservés selon les durées légales du secteur santé.",
      },
      {
        t: "Réversibilité totale",
        d: "Export complet, suppression certifiée et restitution des données à tout moment. Aucun verrou propriétaire, aucune captation. Plan de continuité et de réversibilité contractualisé.",
      },
    ],
    governanceTitle: "Gouvernance & opérations",
    governance: [
      { t: "DPO et RSSI dédiés", d: "Une équipe sécurité responsable des audits, de la veille réglementaire et de la réponse à incident." },
      { t: "Tests de pénétration", d: "Pentests réguliers menés par des cabinets indépendants spécialisés santé." },
      { t: "Sauvegardes & PRA", d: "Sauvegardes chiffrées multi-zones, plan de reprise testé, RTO et RPO contractualisés." },
      { t: "Notification d'incident", d: "Procédure conforme RGPD : notification CNIL sous 72 h et information des établissements concernés." },
    ],
    aiTitle: "IA responsable & souveraine",
    aiPoints: [
      "Aucune donnée patient n'est utilisée pour entraîner des modèles tiers.",
      "Modèles déployés dans des environnements isolés, hébergés en Europe.",
      "Chaque décision d'agent est explicable, traçable et révisable par un humain.",
      "Validation médicale et opérationnelle requise avant tout déploiement en production.",
    ],
    ctaTitle: "Besoin du dossier sécurité complet ?",
    ctaText: "DPA, plan d'assurance sécurité, certifications, architecture technique : nos équipes répondent à vos questionnaires HDS et RSSI.",
    ctaBtn: "Contacter notre DPO",
  },
  en: {
    eyebrow: "Healthcare security & compliance",
    title: "Your health data deserves the highest level of rigor.",
    intro:
      "Granit is built from day one for healthcare regulatory constraints: HDS, GDPR, medical confidentiality and ANS frameworks. Patient data never leaves the trust perimeter.",
    badges: [
      { k: "HDS", v: "Certified hosting" },
      { k: "GDPR", v: "Article 9 compliant" },
      { k: "ANSSI", v: "Best practices" },
      { k: "🇫🇷", v: "Data in France" },
      { k: "PGSSI-S", v: "ANS framework" },
    ],
    pillarsTitle: "Six non-negotiable guarantees",
    items: [
      {
        t: "HDS hosting in France",
        d: "Patient data hosted exclusively with HDS-certified providers, with data residency and backups in France. No transfer outside the EU.",
      },
      {
        t: "GDPR & medical confidentiality",
        d: "Processing compliant with GDPR Article 9 (sensitive data) and the French Public Health Code. Dedicated DPO, processing register, DPIAs, DPAs and medical confidentiality.",
      },
      {
        t: "End-to-end encryption",
        d: "Data encrypted in transit (TLS 1.3) and at rest (AES-256). Keys managed via dedicated KMS, automatic rotation, per-organization isolation.",
      },
      {
        t: "Strict access control",
        d: "SSO (SAML, OIDC), mandatory MFA, fine-grained roles per organization, department and business scope. Least-privilege applied to humans and agents alike.",
      },
      {
        t: "Traceability & auditability",
        d: "Every agent action is logged, timestamped, attributable and exportable. Immutable logs kept per healthcare retention requirements.",
      },
      {
        t: "Full reversibility",
        d: "Full export, certified deletion and data return at any time. No proprietary lock-in. Contractual continuity and reversibility plan.",
      },
    ],
    governanceTitle: "Governance & operations",
    governance: [
      { t: "Dedicated DPO & CISO", d: "A security team owning audits, regulatory watch and incident response." },
      { t: "Penetration testing", d: "Regular pentests by independent firms specialized in healthcare." },
      { t: "Backups & DRP", d: "Encrypted multi-zone backups, tested recovery plan, contractual RTO and RPO." },
      { t: "Incident notification", d: "GDPR-compliant: CNIL notification within 72h and notification of impacted organizations." },
    ],
    aiTitle: "Responsible & sovereign AI",
    aiPoints: [
      "No patient data is used to train third-party models.",
      "Models deployed in isolated environments hosted in Europe.",
      "Every agent decision is explainable, traceable and reviewable by a human.",
      "Medical and operational validation required before any production rollout.",
    ],
    ctaTitle: "Need the full security pack?",
    ctaText: "DPA, security assurance plan, certifications, technical architecture: our team answers your HDS and CISO questionnaires.",
    ctaBtn: "Contact our DPO",
  },
};

function SecuritePage() {
  const { lang } = useLanguage();
  const t = content[lang];
  return (
    <SiteLayout>
      <section className="mx-auto max-w-[1280px] px-6 pt-24 pb-10">
        <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_1fr]">
          <div>
            <Reveal>
              <div className="eyebrow mb-5">{t.eyebrow}</div>
              <h1 className="h1-hero" style={{ fontSize: "clamp(36px,4.4vw,64px)" }}>
                {t.title}
              </h1>
              <p className="body-lg mt-8 max-w-2xl">{t.intro}</p>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="mt-10 flex flex-wrap gap-3">
                {t.badges.map((b) => (
                  <div
                    key={b.k}
                    className="flex items-center gap-2 rounded-full border px-4 py-2"
                    style={{ borderColor: "var(--border)", background: "var(--bg2)" }}
                  >
                    <span className="text-[12px]" style={{ fontFamily: "var(--font-mono)", color: "var(--terra)", fontWeight: 600 }}>
                      {b.k}
                    </span>
                    <span className="text-[12px]" style={{ color: "var(--text-muted)" }}>
                      {b.v}
                    </span>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.15}>
            <div
              className="relative overflow-hidden rounded-[16px] border"
              style={{ borderColor: "var(--border)", boxShadow: "0 30px 60px -30px color-mix(in oklab, var(--terra) 35%, transparent)" }}
            >
              <img
                src={securiteHero}
                alt={lang === "fr" ? "Datacenter HDS en France" : "HDS data center in France"}
                width={1280}
                height={960}
                className="h-full w-full object-cover"
              />
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0"
                style={{ background: "linear-gradient(180deg, transparent 55%, color-mix(in oklab, var(--bg) 75%, transparent) 100%)" }}
              />
              <div className="absolute bottom-5 left-5 right-5 flex flex-wrap items-center gap-2">
                <span
                  className="rounded-full px-3 py-1 text-[11px]"
                  style={{ background: "rgba(255,255,255,0.92)", fontFamily: "var(--font-mono)", color: "var(--terra)", fontWeight: 600 }}
                >
                  HDS
                </span>
                <span
                  className="rounded-full px-3 py-1 text-[11px]"
                  style={{ background: "rgba(255,255,255,0.92)", color: "var(--text)", fontWeight: 500 }}
                >
                  {lang === "fr" ? "Données hébergées en France" : "Data hosted in France"}
                </span>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-[1280px] px-6 pb-20">
        <Reveal>
          <div className="eyebrow mb-6">{t.pillarsTitle}</div>
        </Reveal>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {t.items.map((it, i) => (
            <Reveal key={it.t} delay={i * 0.04}>
              <div className="card-hover h-full rounded-[8px] border bg-white/40 p-6" style={{ borderColor: "var(--border)" }}>
                <div
                  className="text-[11px] uppercase tracking-[0.04em]"
                  style={{ fontFamily: "var(--font-mono)", color: "var(--terra)" }}
                >
                  0{i + 1}
                </div>
                <div className="mt-3 text-[17px]" style={{ fontWeight: 500 }}>
                  {it.t}
                </div>
                <p className="mt-2 text-[14px] leading-[1.65]" style={{ color: "var(--text-soft)" }}>
                  {it.d}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[1280px] px-6 pb-20">
        <div className="grid gap-10 lg:grid-cols-2">
          <Reveal>
            <div>
              <div className="eyebrow mb-6">{t.governanceTitle}</div>
              <div className="space-y-4">
                {t.governance.map((g) => (
                  <div key={g.t} className="border-t pt-4" style={{ borderColor: "var(--border)" }}>
                    <div className="text-[15px]" style={{ fontWeight: 500 }}>
                      {g.t}
                    </div>
                    <p className="mt-1 text-[14px] leading-[1.65]" style={{ color: "var(--text-soft)" }}>
                      {g.d}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div
              className="overflow-hidden rounded-[12px] border"
              style={{ borderColor: "var(--border)", background: "var(--bg2)" }}
            >
              <div className="relative h-[180px] w-full overflow-hidden">
                <img
                  src={securiteTrust}
                  alt={lang === "fr" ? "Confiance et identité" : "Trust and identity"}
                  width={1024}
                  height={1024}
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
                <div
                  aria-hidden
                  className="absolute inset-0"
                  style={{ background: "linear-gradient(180deg, transparent 40%, var(--bg2) 100%)" }}
                />
              </div>
              <div className="p-8 pt-6">
                <div className="eyebrow mb-5">{t.aiTitle}</div>
                <ul className="space-y-4">
                  {t.aiPoints.map((p) => (
                    <li key={p} className="flex gap-3 text-[14px] leading-[1.65]" style={{ color: "var(--text-soft)" }}>
                      <span style={{ color: "var(--terra)", fontFamily: "var(--font-mono)" }}>→</span>
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-[1280px] px-6 pb-28">
        <Reveal>
          <div
            className="rounded-[12px] border p-10 text-center"
            style={{ borderColor: "var(--border)", background: "var(--bg2)" }}
          >
            <h2 className="font-serif" style={{ fontSize: "clamp(28px,3vw,40px)", lineHeight: 1.15, fontWeight: 700 }}>
              {t.ctaTitle}
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-[15px] leading-[1.7]" style={{ color: "var(--text-soft)" }}>
              {t.ctaText}
            </p>
            <Link to="/" hash="demo" className="btn-primary mt-8 inline-flex">
              {t.ctaBtn} <span className="arrow">↗</span>
            </Link>
          </div>
        </Reveal>
      </section>
    </SiteLayout>
  );
}
