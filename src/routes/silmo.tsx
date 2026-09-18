import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";

import { Reveal } from "@/components/Reveal";
import { useLanguage } from "@/lib/i18n";
import { submitDemo } from "@/lib/submitDemo";
import logoMonogram from "@/assets/logo.svg";

/**
 * Landing page du SILMO — accessible uniquement par le QR code des cartes de
 * visite distribuées dans les allées. Volontairement hors navigation, hors
 * sitemap et en noindex : c'est une page de campagne, pas une page du site.
 *
 * `?c=<initiales>` sur l'URL du QR code permet de savoir qui a donné la carte ;
 * la valeur repart dans le champ `source` du lead (ex. `silmo-2026:pp`).
 */
export const Route = createFileRoute("/silmo")({
  validateSearch: (search: Record<string, unknown>) => ({
    c: typeof search.c === "string" ? search.c.slice(0, 20) : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Granit au SILMO - Être recontacté" },
      { name: "robots", content: "noindex, nofollow" },
      {
        name: "description",
        content:
          "Nous nous sommes croisés au SILMO. Laissez vos coordonnées, nous revenons vers vous sous 24h.",
      },
      { property: "og:title", content: "Granit au SILMO" },
      {
        property: "og:description",
        content: "Les agents IA qui gèrent le back-office de votre magasin d'optique.",
      },
    ],
  }),
  component: SilmoPage,
});

const CAMPAIGN = "silmo-2026";

const copy = {
  fr: {
    badge: "SILMO 2026",
    eyebrow: "On s'est croisés dans les allées",
    title: "Le back-office de votre magasin,",
    titleAccent: "fait tout seul.",
    intro:
      "Granit branche des agents IA sur votre logiciel d'optique et exécute ce qui vous prend vos soirées : prises en charge, télétransmission, rejets, réconciliation bancaire. Rien à installer.",
    pills: ["Déployé en 5 jours", "HDS & RGPD", "Sans intégration"],
    formTitle: "Laissez-nous vos coordonnées",
    formIntro: "On vous rappelle sous 24h pour 15 minutes de démo, sur vos chiffres à vous.",
    fields: {
      name: "Prénom et nom",
      email: "Email professionnel",
      phone: "Téléphone",
      company: "Votre enseigne",
      orgType: "Vous êtes",
    },
    placeholders: {
      name: "Marie Dupont",
      email: "marie@centre-vision.fr",
      phone: "06 12 34 56 78",
      company: "Centre Vision Paris",
    },
    optional: "facultatif",
    choose: "Choisir…",
    options: [
      "Opticien indépendant",
      "Groupe ou réseau d'optique",
      "Centre de santé",
      "Audioprothésiste",
      "Autre",
    ],
    cta: "Être recontacté",
    sending: "Envoi…",
    note: "Gratuit, sans engagement. Vos données restent chez nous, jamais revendues.",
    success: "C'est noté. On vous rappelle sous 24h.",
    successSub: "En attendant, vous pouvez parcourir le site.",
    error: "Une erreur est survenue. Réessayez, ou écrivez-nous à contact@getgranit.ai.",
    whatTitle: "Ce que Granit fait, concrètement",
    what: [
      {
        name: "Demande de prise en charge",
        desc: "Interrogation des plateformes AMC, calcul du reste à charge, envoi de la demande.",
        metric: "< 5s",
      },
      {
        name: "Facturation tiers-payant",
        desc: "Facturation AMO/AMC, télétransmission SESAM-Vitale, suivi des retours NOEMIE.",
        metric: "99% first-pass",
      },
      {
        name: "Traitement des rejets",
        desc: "Analyse de la cause, correction et re-soumission automatique du flux.",
        metric: "-90% rejets",
      },
      {
        name: "Réconciliation bancaire",
        desc: "Matching des virements AMO/AMC avec vos factures, détection des impayés.",
        metric: "-85% temps",
      },
    ],
    kpis: [
      { value: "250+", label: "structures de santé équipées" },
      { value: "97%", label: "de temps gagné sur l'administratif" },
      { value: "5 jours", label: "pour être opérationnel" },
    ],
    visitSite: "Voir le site",
    footerNote: "Granit AI · Paris",
  },
  en: {
    badge: "SILMO 2026",
    eyebrow: "We met in the aisles",
    title: "Your store's back-office,",
    titleAccent: "handled for you.",
    intro:
      "Granit plugs AI agents into your optical software and runs what eats your evenings: coverage requests, claim submission, rejections, bank reconciliation. Nothing to install.",
    pills: ["Live in 5 days", "HDS & GDPR", "No integration"],
    formTitle: "Leave us your details",
    formIntro: "We call you back within 24h for a 15-minute demo, on your own numbers.",
    fields: {
      name: "Full name",
      email: "Work email",
      phone: "Phone",
      company: "Your store",
      orgType: "You are",
    },
    placeholders: {
      name: "Marie Dupont",
      email: "marie@centre-vision.fr",
      phone: "+33 6 12 34 56 78",
      company: "Centre Vision Paris",
    },
    optional: "optional",
    choose: "Choose…",
    options: [
      "Independent optician",
      "Optical group or chain",
      "Health centre",
      "Hearing care professional",
      "Other",
    ],
    cta: "Get a call back",
    sending: "Sending…",
    note: "Free, no commitment. Your data stays with us, never resold.",
    success: "Noted. We'll call you within 24h.",
    successSub: "In the meantime, feel free to browse the site.",
    error: "Something went wrong. Please retry, or email us at contact@getgranit.ai.",
    whatTitle: "What Granit actually does",
    what: [
      {
        name: "Coverage requests",
        desc: "Queries insurer platforms, computes the out-of-pocket amount, sends the request.",
        metric: "< 5s",
      },
      {
        name: "Third-party billing",
        desc: "AMO/AMC billing, SESAM-Vitale submission, NOEMIE return tracking.",
        metric: "99% first-pass",
      },
      {
        name: "Rejection handling",
        desc: "Root-cause analysis, correction and automatic resubmission.",
        metric: "-90% rejections",
      },
      {
        name: "Bank reconciliation",
        desc: "Matches insurer transfers with your invoices, flags what is missing.",
        metric: "-85% time",
      },
    ],
    kpis: [
      { value: "250+", label: "healthcare organisations equipped" },
      { value: "97%", label: "of admin time saved" },
      { value: "5 days", label: "to go live" },
    ],
    visitSite: "Visit the site",
    footerNote: "Granit AI · Paris",
  },
};

function SilmoPage() {
  const { lang } = useLanguage();
  const { c } = Route.useSearch();
  const t = copy[lang];

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      <header
        className="sticky top-0 z-50 border-b"
        style={{
          background: "rgba(255,255,255,0.88)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          borderColor: "var(--border)",
        }}
      >
        <div className="mx-auto flex h-14 max-w-[620px] items-center justify-between px-5">
          <Link to="/" className="flex items-center gap-2">
            <img src={logoMonogram} alt="Granit" className="h-7 w-auto" />
            <span className="font-serif text-[19px] tracking-tight" style={{ fontWeight: 700 }}>
              Granit
            </span>
          </Link>
          <span
            className="rounded-full px-3 py-1 text-[10px]"
            style={{
              background: "var(--terra-light)",
              color: "var(--terra)",
              fontFamily: "var(--font-mono)",
              letterSpacing: "0.1em",
            }}
          >
            {t.badge}
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-[620px] px-5 pb-16">
        <section className="pt-10 pb-8">
          <Reveal>
            <p className="eyebrow">{t.eyebrow}</p>
            <h1
              className="mt-3 font-serif"
              style={{
                fontSize: "clamp(34px, 8.5vw, 52px)",
                lineHeight: 1.05,
                letterSpacing: "-0.025em",
                fontWeight: 400,
              }}
            >
              {t.title}
              <br />
              <span className="accent-italic">{t.titleAccent}</span>
            </h1>
            <p className="mt-5 text-[16px]" style={{ lineHeight: 1.55, color: "var(--text-soft)" }}>
              {t.intro}
            </p>
            <ul className="mt-6 flex flex-wrap gap-2">
              {t.pills.map((p) => (
                <li
                  key={p}
                  className="rounded-full border px-3 py-1.5 text-[12px]"
                  style={{
                    borderColor: "var(--border)",
                    background: "var(--bg2)",
                    color: "var(--text-soft)",
                  }}
                >
                  {p}
                </li>
              ))}
            </ul>
          </Reveal>
        </section>

        <section id="contact" className="scroll-mt-20">
          <Reveal delay={0.05}>
            <SilmoForm t={t} contact={c} />
          </Reveal>
        </section>

        <section className="pt-14">
          <Reveal>
            <h2
              className="font-serif"
              style={{
                fontSize: "clamp(24px, 6vw, 32px)",
                lineHeight: 1.1,
                letterSpacing: "-0.02em",
              }}
            >
              {t.whatTitle}
            </h2>
            <ul className="mt-6 space-y-3">
              {t.what.map((item) => (
                <li
                  key={item.name}
                  className="card-hover rounded-[14px] border bg-white p-5"
                  style={{ borderColor: "var(--border)" }}
                >
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="text-[15px]" style={{ fontWeight: 600 }}>
                      {item.name}
                    </h3>
                    <span
                      className="num-tabular shrink-0 rounded-full px-2.5 py-1 text-[11px]"
                      style={{
                        background: "var(--terra-light)",
                        color: "var(--terra)",
                        fontFamily: "var(--font-mono)",
                      }}
                    >
                      {item.metric}
                    </span>
                  </div>
                  <p
                    className="mt-2 text-[14px]"
                    style={{ color: "var(--text-muted)", lineHeight: 1.5 }}
                  >
                    {item.desc}
                  </p>
                </li>
              ))}
            </ul>
          </Reveal>
        </section>

        <section className="pt-12">
          <Reveal>
            <div
              className="grid grid-cols-3 gap-3 rounded-[14px] border p-5"
              style={{ borderColor: "var(--border)", background: "var(--bg2)" }}
            >
              {t.kpis.map((k) => (
                <div key={k.label}>
                  <div
                    className="num-tabular font-serif"
                    style={{
                      fontSize: "clamp(22px, 6vw, 30px)",
                      color: "var(--terra)",
                      lineHeight: 1.1,
                    }}
                  >
                    {k.value}
                  </div>
                  <p
                    className="mt-1.5 text-[11px]"
                    style={{ color: "var(--text-muted)", lineHeight: 1.35 }}
                  >
                    {k.label}
                  </p>
                </div>
              ))}
            </div>
          </Reveal>
        </section>
      </main>

      <footer className="border-t" style={{ borderColor: "var(--border)" }}>
        <div
          className="mx-auto flex max-w-[620px] flex-wrap items-center justify-between gap-3 px-5 py-6 text-[12px]"
          style={{ color: "var(--text-muted)" }}
        >
          <span style={{ fontFamily: "var(--font-mono)" }}>{t.footerNote}</span>
          <div className="flex items-center gap-4">
            <a
              href="mailto:contact@getgranit.ai"
              className="transition-colors hover:text-[color:var(--terra)]"
            >
              contact@getgranit.ai
            </a>
            <Link to="/" className="transition-colors hover:text-[color:var(--terra)]">
              {t.visitSite}
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

function Field({
  name,
  label,
  type = "text",
  placeholder,
  required,
  hint,
  autoComplete,
  inputMode,
}: {
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  hint?: string;
  autoComplete?: string;
  inputMode?: "text" | "tel" | "email";
}) {
  return (
    <label className="mb-4 block">
      <div className="mb-1.5 flex items-baseline gap-2">
        <span className="text-[12px]" style={{ color: "var(--text-soft)", fontWeight: 500 }}>
          {label}
        </span>
        {hint && (
          <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>
            {hint}
          </span>
        )}
      </div>
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
        autoComplete={autoComplete}
        inputMode={inputMode}
        className="w-full rounded-[8px] border bg-transparent px-3.5 py-3 text-[16px] outline-none transition-colors focus:border-[color:var(--terra)]"
        style={{ borderColor: "var(--border)" }}
      />
    </label>
  );
}

function SilmoForm({ t, contact }: { t: (typeof copy)["fr"]; contact?: string }) {
  const submit = useServerFn(submitDemo);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  if (status === "success") {
    return (
      <div
        className="flex flex-col items-center rounded-[14px] border bg-white px-6 py-12 text-center"
        style={{ borderColor: "var(--border)", boxShadow: "var(--shadow-soft)" }}
      >
        <span
          className="flex h-12 w-12 items-center justify-center rounded-full"
          style={{ background: "var(--terra-light)", color: "var(--terra)" }}
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 12l5 5L20 7" />
          </svg>
        </span>
        <p
          className="mt-5 max-w-xs font-serif text-[24px]"
          style={{ letterSpacing: "-0.01em", lineHeight: 1.2 }}
        >
          {t.success}
        </p>
        <p className="mt-3 text-[13px]" style={{ color: "var(--text-muted)" }}>
          {t.successSub}
        </p>
        <Link to="/" className="btn-ghost mt-6">
          {t.visitSite} <span className="arrow">↗</span>
        </Link>
      </div>
    );
  }

  return (
    <form
      className="rounded-[14px] border bg-white p-6 md:p-7"
      style={{ borderColor: "var(--border)", boxShadow: "var(--shadow-soft)" }}
      onSubmit={async (e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        setStatus("submitting");
        try {
          await submit({
            data: {
              name: String(fd.get("name") || ""),
              email: String(fd.get("email") || ""),
              phone: String(fd.get("phone") || ""),
              company: String(fd.get("company") || ""),
              orgType: String(fd.get("orgType") || ""),
              source: contact ? `${CAMPAIGN}:${contact}` : CAMPAIGN,
            },
          });
          setStatus("success");
        } catch {
          setStatus("error");
        }
      }}
    >
      <h2
        className="font-serif"
        style={{ fontSize: "clamp(22px, 5.5vw, 28px)", lineHeight: 1.15, letterSpacing: "-0.02em" }}
      >
        {t.formTitle}
      </h2>
      <p className="mb-6 mt-2 text-[14px]" style={{ color: "var(--text-muted)", lineHeight: 1.5 }}>
        {t.formIntro}
      </p>

      <Field
        name="name"
        label={t.fields.name}
        placeholder={t.placeholders.name}
        required
        autoComplete="name"
      />
      <Field
        name="email"
        label={t.fields.email}
        type="email"
        placeholder={t.placeholders.email}
        required
        autoComplete="email"
        inputMode="email"
      />
      <Field
        name="phone"
        label={t.fields.phone}
        type="tel"
        placeholder={t.placeholders.phone}
        hint={t.optional}
        autoComplete="tel"
        inputMode="tel"
      />
      <Field
        name="company"
        label={t.fields.company}
        placeholder={t.placeholders.company}
        required
        autoComplete="organization"
      />

      <label className="mb-5 block">
        <div className="mb-1.5 text-[12px]" style={{ color: "var(--text-soft)", fontWeight: 500 }}>
          {t.fields.orgType}
        </div>
        <select
          name="orgType"
          defaultValue=""
          className="w-full rounded-[8px] border bg-white px-3.5 py-3 text-[16px] outline-none transition-colors focus:border-[color:var(--terra)]"
          style={{ borderColor: "var(--border)" }}
        >
          <option value="" disabled>
            {t.choose}
          </option>
          {t.options.map((o) => (
            <option key={o}>{o}</option>
          ))}
        </select>
      </label>

      <button
        type="submit"
        disabled={status === "submitting"}
        className="btn-primary w-full justify-center"
        style={
          status === "submitting"
            ? { opacity: 0.7, cursor: "wait", padding: "14px 20px" }
            : { padding: "14px 20px" }
        }
      >
        {status === "submitting" ? t.sending : t.cta} <span className="arrow">↗</span>
      </button>

      {status === "error" && (
        <p className="mt-3 text-center text-[12px]" style={{ color: "#c0392b" }}>
          {t.error}
        </p>
      )}
      <p
        className="mt-4 text-center text-[11px]"
        style={{ color: "var(--text-muted)", lineHeight: 1.45 }}
      >
        {t.note}
      </p>
    </form>
  );
}
