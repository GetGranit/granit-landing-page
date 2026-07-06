import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { Reveal } from "@/components/Reveal";
import { useLanguage } from "@/lib/i18n";

export const Route = createFileRoute("/tarifs")({
  head: () => ({
    meta: [
      { title: "Tarifs - Granit AI" },
      { name: "description", content: "Tarification à l'usage : forfait plateforme par centre + un fee par agent selon les volumes traités." },
      { property: "og:title", content: "Tarifs - Granit AI" },
      { property: "og:description", content: "Tarification simple et à l'usage. Adapté à votre établissement." },
    ],
  }),
  component: TarifsPage,
});

const content = {
  fr: {
    eyebrow: "Tarifs",
    title: "Simple, lisible, à l'usage.",
    intro: "Un forfait plateforme mensuel par centre, puis un coût à l'usage par agent selon les workflows activés et le volume traité.",
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

function TarifsPage() {
  const { lang } = useLanguage();
  const t = content[lang];
  return (
    <SiteLayout>
      <section className="mx-auto max-w-[1280px] px-6 pt-24 pb-12 text-center">
        <Reveal>
          <div className="eyebrow mb-5">{t.eyebrow}</div>
          <h1 className="h1-hero mx-auto max-w-3xl" style={{ fontSize: "clamp(40px,5vw,76px)" }}>
            {t.title}
          </h1>
          <p className="body-lg mx-auto mt-8 max-w-xl">{t.intro}</p>
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
            <div className="eyebrow mb-4">{t.included}</div>
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
      </section>
    </SiteLayout>
  );
}
