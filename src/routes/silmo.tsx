import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
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

/**
 * Démo filmée, affichée au-dessus du formulaire. Tant que `src` est vide, la
 * section entière disparaît : la page reste donc valable sans la vidéo.
 * Héberger le MP4 sur le bucket R2 du site plutôt que dans `public/`, pour ne
 * pas embarquer des dizaines de Mo dans le worker Cloudflare à chaque déploiement.
 */
const DEMO_VIDEO = {
  src: "",
  poster: "",
};

const copy = {
  fr: {
    badge: "SILMO 2026",
    eyebrow: "On s'est croisés dans les allées",
    title: "Le soir, vous fermez.",
    titleAccent: "Vos dossiers aussi.",
    intro:
      "Granit se branche sur votre logiciel d'optique et exécute la paperasse à votre place : prises en charge mutuelles, télétransmission, rejets, rapprochement des virements. Rien à installer.",
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
    choose: "Choisir…",
    options: [
      "Opticien gérant",
      "Directeur ou manager de magasin",
      "Groupe ou réseau d'optique",
      "Ophtalmologue",
      "Fournisseur ou industrie de l'optique",
      "Autre",
    ],
    cta: "Être recontacté",
    sending: "Envoi…",
    note: "Gratuit, sans engagement. Vos données restent chez nous, jamais revendues.",
    success: "C'est noté. On vous rappelle sous 24h.",
    successSub: "Quinze minutes au téléphone, sur vos chiffres à vous.",
    successContact: "Une question d'ici là ?",
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
    videoTitle: "La démo, en deux minutes",
    videoNote: "Le son n'est pas indispensable, tout est montré à l'écran.",
    footerNote: "Granit AI · Paris",
  },
  en: {
    badge: "SILMO 2026",
    eyebrow: "We met in the aisles",
    title: "You close for the night.",
    titleAccent: "So does your paperwork.",
    intro:
      "Granit plugs into your optical software and runs the paperwork for you: insurer coverage requests, claim submission, rejections, payment matching. Nothing to install.",
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
    choose: "Choose…",
    options: [
      "Optician, owner",
      "Store director or manager",
      "Optical group or chain",
      "Ophthalmologist",
      "Supplier or optical industry",
      "Other",
    ],
    cta: "Get a call back",
    sending: "Sending…",
    note: "Free, no commitment. Your data stays with us, never resold.",
    success: "Noted. We'll call you within 24h.",
    successSub: "Fifteen minutes on the phone, on your own numbers.",
    successContact: "A question before then?",
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
    videoTitle: "The demo, in two minutes",
    videoNote: "Sound is optional, everything is shown on screen.",
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
          {/* Pas de lien vers le site : sur cette page on ne veut aucune sortie
              avant que le formulaire soit rempli. Le logo reste décoratif. */}
          <div className="flex items-center gap-2">
            <img src={logoMonogram} alt="Granit" className="h-7 w-auto" />
            <span className="font-serif text-[19px] tracking-tight" style={{ fontWeight: 700 }}>
              Granit
            </span>
          </div>
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

        {DEMO_VIDEO.src && (
          <section className="pb-10">
            <Reveal>
              <h2
                className="mb-3 font-serif"
                style={{
                  fontSize: "clamp(20px, 5vw, 26px)",
                  lineHeight: 1.15,
                  letterSpacing: "-0.02em",
                }}
              >
                {t.videoTitle}
              </h2>
              {/* `<video>` et pas une iframe : le fichier est un MP4 servi
                  directement. `preload="metadata"` ne télécharge que l'entête,
                  pour ne pas manger le forfait data d'un visiteur en salon. */}
              <video
                className="w-full rounded-[14px] border"
                style={{ borderColor: "var(--border)", background: "var(--bg3)" }}
                src={DEMO_VIDEO.src}
                poster={DEMO_VIDEO.poster}
                controls
                playsInline
                preload="metadata"
              />
              <p className="mt-2 text-[12px]" style={{ color: "var(--text-muted)" }}>
                {t.videoNote}
              </p>
            </Reveal>
          </section>
        )}

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

      {/* Pied de page réduit à la signature et au mail : aucun lien de
          navigation, pour que la seule sortie possible soit le formulaire. */}
      <footer className="border-t" style={{ borderColor: "var(--border)" }}>
        <div
          className="mx-auto flex max-w-[620px] flex-wrap items-center justify-between gap-3 px-5 py-6 text-[12px]"
          style={{ color: "var(--text-muted)" }}
        >
          <span style={{ fontFamily: "var(--font-mono)" }}>{t.footerNote}</span>
          <a
            href="mailto:contact@getgranit.ai"
            className="transition-colors hover:text-[color:var(--terra)]"
          >
            contact@getgranit.ai
          </a>
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
  autoComplete,
  inputMode,
}: {
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  autoComplete?: string;
  inputMode?: "text" | "tel" | "email";
}) {
  return (
    <label className="mb-4 block">
      <div className="mb-1.5 text-[12px]" style={{ color: "var(--text-soft)", fontWeight: 500 }}>
        {label}
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
        <p className="mt-6 text-[12px]" style={{ color: "var(--text-muted)" }}>
          {t.successContact}{" "}
          <a
            href="mailto:contact@getgranit.ai"
            className="underline transition-colors hover:text-[color:var(--terra)]"
          >
            contact@getgranit.ai
          </a>
        </p>
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
        required
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
