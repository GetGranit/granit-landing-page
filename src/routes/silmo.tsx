import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";

import { Reveal } from "@/components/Reveal";
import { useLanguage } from "@/lib/i18n";
import { submitDemo } from "@/lib/submitDemo";
import logoMonogram from "@/assets/logo.svg";
import silmoLogo from "@/assets/silmo-logo.png";

/**
 * Landing page du SILMO — accessible uniquement par le QR code des cartes de
 * visite distribuées dans les allées. Volontairement hors navigation, hors
 * sitemap et en noindex : c'est une page de campagne, pas une page du site.
 *
 * Traitement « bordereau » : crème, serif, angles droits, filets nets et zéro
 * ombre. Granit vend de la paperasse résolue, la page emprunte la rigueur d'un
 * imprimé administratif bien composé plutôt que la douceur du site.
 *
 * `?c=<initiales>` sur l'URL du QR code dit qui a donné la carte ; la valeur
 * repart dans le champ `source` du lead (ex. `silmo-2026:pp`).
 */
export const Route = createFileRoute("/silmo")({
  validateSearch: (search: Record<string, unknown>) => ({
    // Le routeur parse la query string en JSON quand il peut : des initiales
    // numériques arriveraient en nombre, donc on repasse en texte avant de valider.
    c: (search.c == null ? "" : String(search.c)).slice(0, 20) || undefined,
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
        content: "Les agents IA qui font la paperasse de votre magasin d'optique.",
      },
    ],
  }),
  component: SilmoPage,
});

const CAMPAIGN = "silmo-2026";

/* Filets et surfaces du traitement bordereau, repris des jetons du site. */
const ENCRE = "var(--text)";
const CREME = "var(--bg2)";
const FILET = "var(--border2)";

const copy = {
  fr: {
    badge: "SILMO 2026",
    eyebrow: "On s'est croisés dans les allées",
    titleLead: "Vous vendez des lunettes.",
    titleAccent: "Pas des dossiers.",
    intro:
      "Granit se branche sur vos logiciels et gère le tiers payant de bout en bout : prises en charge, télétransmission, rejets, rapprochement des virements. Rien à installer.",
    pills: ["Sans engagement", "Opérationnel en 48h", "HDS & RGPD", "Sans intégration"],
    formTitle: "Laissez-nous vos coordonnées",
    formIntro: "On vous rappelle sous 24h pour 15 minutes de démo, sur vos chiffres à vous.",
    fields: {
      name: "Prénom et nom",
      email: "Adresse e-mail professionnelle",
      phone: "Téléphone",
    },
    placeholders: {
      name: "Marie Dupont",
      email: "marie@centre-vision.fr",
      phone: "06 12 34 56 78",
    },
    cta: "Être recontacté",
    sending: "Envoi…",
    note: "Gratuit, sans engagement. Vos données restent chez nous, jamais revendues.",
    success: "C'est noté. On vous rappelle sous 24h.",
    successSub: "Quinze minutes au téléphone, sur vos chiffres à vous.",
    successContact: "Une question d'ici là ?",
    error: "Une erreur est survenue. Réessayez, ou écrivez-nous à contact@getgranit.ai.",
    whatTitle: "Ce que fait Granit, en 4 briques",
    brique: "Brique",
    what: [
      {
        name: "Demande PEC",
        desc: "Interrogation des plateformes AMC, calcul du reste à charge, envoi de la demande.",
        metric: "< 5s",
      },
      {
        name: "Facturation tiers-payant",
        desc: "Facturation AMO/AMC, télétransmission SESAM-Vitale, suivi des retours NOEMIE.",
        metric: "99% du 1er coup",
      },
      {
        name: "Traitement des rejets",
        desc: "Analyse de la cause, correction et re-soumission automatique du flux.",
        metric: "-90% rejets",
      },
      {
        name: "Rapprochement bancaire",
        desc: "Chaque virement AMO/AMC retrouve sa facture, et les impayés ressortent seuls.",
        metric: "-85% temps",
      },
    ],
    kpis: [
      { value: "250+", label: "structures de santé équipées" },
      { value: "97%", label: "de temps gagné sur l'administratif" },
      { value: "48h", label: "pour être opérationnel" },
    ],
    footerNote: "Granit AI · Paris",
  },
  en: {
    badge: "SILMO 2026",
    eyebrow: "We met in the aisles",
    titleLead: "You sell glasses.",
    titleAccent: "Not paperwork.",
    intro:
      "Granit plugs into your software and runs third-party payment end to end: coverage requests, claim submission, rejections, payment matching. Nothing to install.",
    pills: ["No commitment", "Live in 48h", "HDS & GDPR", "No integration"],
    formTitle: "Leave us your details",
    formIntro: "We call you back within 24h for a 15-minute demo, on your own numbers.",
    fields: {
      name: "Full name",
      email: "Work email",
      phone: "Phone",
    },
    placeholders: {
      name: "Marie Dupont",
      email: "marie@centre-vision.fr",
      phone: "+33 6 12 34 56 78",
    },
    cta: "Get a call back",
    sending: "Sending…",
    note: "Free, no commitment. Your data stays with us, never resold.",
    success: "Noted. We'll call you within 24h.",
    successSub: "Fifteen minutes on the phone, on your own numbers.",
    successContact: "A question before then?",
    error: "Something went wrong. Please retry, or email us at contact@getgranit.ai.",
    whatTitle: "What Granit does, in 4 steps",
    brique: "Step",
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
      { value: "48h", label: "to go live" },
    ],
    footerNote: "Granit AI · Paris",
  },
};

function SilmoPage() {
  const { lang } = useLanguage();
  const { c } = Route.useSearch();
  const t = copy[lang];

  return (
    <div className="min-h-screen" style={{ background: CREME, color: ENCRE }}>
      {/* Pas de lien vers le site : la seule action possible est le formulaire. */}
      <header
        className="sticky top-0 z-50"
        style={{ background: CREME, borderBottom: `1px solid ${ENCRE}` }}
      >
        <div className="mx-auto flex h-[62px] max-w-[600px] items-center justify-between px-5">
          <div className="flex items-center gap-2.5">
            <img src={logoMonogram} alt="Granit" className="h-[26px] w-auto" />
            <span className="font-serif text-[19px] tracking-tight" style={{ fontWeight: 700 }}>
              Granit
            </span>
          </div>
          <img
            src={silmoLogo}
            alt="SILMO Paris"
            className="h-[46px] w-[46px]"
            style={{ border: `1px solid ${FILET}` }}
          />
        </div>
      </header>

      <main className="mx-auto max-w-[600px] px-5 pb-10">
        <section className="pb-7 pt-8">
          <Reveal>
            <p
              className="text-[11px]"
              style={{
                fontFamily: "var(--font-mono)",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "var(--terra)",
              }}
            >
              {t.badge} · {t.eyebrow}
            </p>
            {/* Le titre tient toujours sur deux lignes, une par membre de
                phrase : le `clamp` descend assez bas pour qu'aucune des deux ne
                se coupe sur un écran de 320 px, le plus étroit encore en usage. */}
            <h1
              className="mt-4 font-serif"
              style={{
                fontSize: "clamp(22px, 7.2vw, 40px)",
                lineHeight: 1.12,
                letterSpacing: "-0.02em",
                fontWeight: 400,
              }}
            >
              {t.titleLead}
              <br />
              <span className="accent-italic">{t.titleAccent}</span>
            </h1>
            <p
              className="mt-4 text-[15.5px]"
              style={{ lineHeight: 1.55, color: "var(--text-soft)" }}
            >
              {t.intro}
            </p>
            <ul className="mt-5 flex flex-wrap justify-center gap-2">
              {t.pills.map((p) => (
                <li
                  key={p}
                  className="px-3 py-1.5 text-[12px]"
                  style={{ border: `1px solid ${FILET}`, color: "var(--text-soft)" }}
                >
                  {p}
                </li>
              ))}
            </ul>
          </Reveal>
        </section>

        <section id="contact">
          <Reveal delay={0.05}>
            <SilmoForm t={t} contact={c} />
          </Reveal>
        </section>

        <section className="pt-11">
          <Reveal>
            <h2
              className="font-serif"
              style={{ fontSize: "clamp(21px, 5.2vw, 27px)", lineHeight: 1.15, fontWeight: 400 }}
            >
              {t.whatTitle}
            </h2>
            <ul className="mt-5">
              {t.what.map((item, i) => (
                <li
                  key={item.name}
                  className="grid grid-cols-[1fr_auto] items-baseline gap-x-3 gap-y-1 py-4"
                  style={{
                    borderTop: `1px solid ${FILET}`,
                    borderBottom: i === t.what.length - 1 ? `1px solid ${FILET}` : undefined,
                  }}
                >
                  {/* Les quatre briques suivent le dossier dans l'ordre où il
                      avance : demande, facturation, rejet, encaissement. Le
                      numéro dit donc une chronologie, pas un simple décompte. */}
                  <span
                    className="col-span-2 text-[10.5px]"
                    style={{
                      fontFamily: "var(--font-mono)",
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      color: "var(--terra)",
                    }}
                  >
                    {t.brique} {i + 1}
                  </span>
                  <h3 className="font-serif text-[16px]" style={{ fontWeight: 400 }}>
                    {item.name}
                  </h3>
                  <span
                    className="num-tabular whitespace-nowrap text-[11px]"
                    style={{ fontFamily: "var(--font-mono)", color: "var(--terra)" }}
                  >
                    {item.metric}
                  </span>
                  <p
                    className="col-span-2 text-[13.5px]"
                    style={{ color: "var(--text-muted)", lineHeight: 1.5 }}
                  >
                    {item.desc}
                  </p>
                </li>
              ))}
            </ul>
          </Reveal>
        </section>

        <section className="pt-10">
          <Reveal>
            <dl
              className="grid grid-cols-3 gap-x-3 gap-y-4 py-6 text-center"
              style={{ borderTop: `1px solid ${ENCRE}`, borderBottom: `1px solid ${ENCRE}` }}
            >
              {t.kpis.map((k) => (
                <div key={k.label}>
                  <dt
                    className="num-tabular font-serif"
                    style={{ fontSize: "clamp(22px, 5.8vw, 30px)", lineHeight: 1, fontWeight: 400 }}
                  >
                    {k.value}
                  </dt>
                  <dd
                    className="mt-2 ml-0 text-[11.5px]"
                    style={{ color: "var(--text-muted)", lineHeight: 1.35 }}
                  >
                    {k.label}
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </section>
      </main>

      {/* Une seule ligne : l'éditeur du formulaire, comme l'exige la collecte
          de données personnelles. Aucun lien de navigation. */}
      <footer className="mx-auto max-w-[600px] px-5 pb-8">
        <p
          className="text-[11px]"
          style={{ fontFamily: "var(--font-mono)", color: "var(--text-muted)" }}
        >
          {t.footerNote} · contact@getgranit.ai
        </p>
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
      <span
        className="mb-1.5 block text-[10.5px]"
        style={{
          fontFamily: "var(--font-mono)",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: "var(--text-soft)",
        }}
      >
        {label}
      </span>
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
        autoComplete={autoComplete}
        inputMode={inputMode}
        className="w-full px-3.5 py-3 text-[16px] outline-none transition-colors"
        style={{ background: CREME, border: `1px solid ${FILET}`, color: ENCRE }}
        onFocus={(e) => (e.currentTarget.style.borderColor = "var(--text)")}
        onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border2)")}
      />
    </label>
  );
}

function SilmoForm({ t, contact }: { t: (typeof copy)["fr"]; contact?: string }) {
  const submit = useServerFn(submitDemo);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  // `silmo-2026`, puis qui a donné la carte : `silmo-2026:pp`.
  const source = CAMPAIGN + (contact ? `:${contact}` : "");

  if (status === "success") {
    return (
      <div
        className="flex flex-col items-center px-6 py-11 text-center"
        style={{ background: "var(--surface)", border: `1px solid ${ENCRE}` }}
      >
        <span
          className="flex h-11 w-11 items-center justify-center"
          style={{ border: `1px solid ${ENCRE}`, color: "var(--terra)" }}
        >
          <svg
            width="20"
            height="20"
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
          className="mt-5 max-w-xs font-serif text-[23px]"
          style={{ lineHeight: 1.2, fontWeight: 400 }}
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
      className="p-6"
      style={{ background: "var(--surface)", border: `1px solid ${ENCRE}` }}
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
              source,
            },
          });
          setStatus("success");
        } catch {
          setStatus("error");
        }
      }}
    >
      <h2 className="font-serif" style={{ fontSize: "clamp(21px, 5.2vw, 26px)", fontWeight: 400 }}>
        {t.formTitle}
      </h2>
      <p
        className="mb-6 mt-2 text-[13.5px]"
        style={{ color: "var(--text-muted)", lineHeight: 1.5 }}
      >
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
      <button
        type="submit"
        disabled={status === "submitting"}
        className="w-full px-5 py-4 text-[13px] transition-opacity"
        style={{
          background: ENCRE,
          color: CREME,
          fontFamily: "var(--font-mono)",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          opacity: status === "submitting" ? 0.7 : 1,
          cursor: status === "submitting" ? "wait" : "pointer",
        }}
      >
        {status === "submitting" ? t.sending : t.cta}
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
