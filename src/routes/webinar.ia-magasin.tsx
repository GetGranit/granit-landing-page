import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { AnimatePresence, motion } from "framer-motion";
import { usePostHog } from "posthog-js/react";

import { Reveal } from "@/components/Reveal";
import { logDemoRequestDelivered, logDemoRequestDeliveryFailed } from "@/lib/posthogLogs";
import { submitDemo } from "@/lib/submitDemo";
import { getAttribution } from "@/lib/attribution";
import logoMonogram from "@/assets/logo.svg";
import photoPaul from "@/assets/paul-pietra.jpg";

/**
 * Inscription au webinar « 5 usages de l'IA en magasin » du 26 novembre.
 * On y arrive par les liens de la campagne lemlist « Test 3 messages »
 * (approche Webinar IA, cohortes A et B, distinguées par `utm_content`).
 *
 * Même traitement que la page SILMO : page de campagne hors navigation,
 * hors sitemap et en noindex, dont la seule action est le formulaire.
 * L'inscription part dans le webhook des démos avec `source: "webinar-ia-2026-11"` :
 * c'est B11 qui range le lead dans Attio et l'invite à l'événement d'agenda.
 *
 * Page en français seulement : la campagne ne vise que des magasins français.
 */
export const Route = createFileRoute("/webinar/ia-magasin")({
  head: () => ({
    meta: [
      { title: "Webinar : 5 usages de l'IA en magasin - Granit" },
      { name: "robots", content: "noindex, nofollow" },
      {
        name: "description",
        content:
          "Jeudi 26 novembre, 13h15-14h : 5 cas d'usage concrets de l'IA pour gagner du temps en magasin. En ligne, gratuit, sans théorie.",
      },
      { property: "og:title", content: "5 usages concrets de l'IA en magasin" },
      {
        property: "og:description",
        content: "Webinar gratuit, jeudi 26 novembre à 13h15. 45 minutes, des exemples en direct.",
      },
    ],
  }),
  component: WebinarPage,
});

const SOURCE = "webinar-ia-2026-11";

const ENCRE = "var(--text)";
const CREME = "var(--bg2)";
const FILET = "var(--border2)";

const t = {
  badge: "Webinar gratuit",
  date: "Jeudi 26 novembre",
  heure: "13h15 – 14h",
  facts: ["45 min", "En ligne", "Gratuit", "Replay pour les inscrits"],
  titleLead: "5 usages concrets de l'IA",
  titleAccent: "pour gagner du temps en magasin.",
  intro:
    "Pointer un virement groupé, vérifier un dossier avant facturation, renvoyer à la mutuelle une pièce jointe déjà dans le dossier client… L'admin prend un temps fou en magasin. On vous montre ce que l'IA peut en faire, en direct.",
  cta: "Je réserve ma place",

  whatTitle: "Ce que vous verrez",
  cas: [
    "Analyser vos avis Google pour savoir ce que vos clients disent vraiment",
    "Créer vos modèles de mails : relance mutuelle, lunettes prêtes, devis non signé",
    "Construire un tableau de suivi de vos impayés mutuelles à partir d'un simple export Excel",
  ],
  surprise: "Gardés pour la fin : ce que l'IA peut faire à votre place, sans même ouvrir Excel.",

  whoTitle: "Pour qui",
  who: "Opticiens et équipes en magasin. Aucune connaissance technique nécessaire : si vous savez envoyer un mail, vous saurez refaire ce qu'on montre.",

  howTitle: "Comment ça se passe",
  deroule: [
    { h: "13h15", t: "Le constat : où part le temps en magasin" },
    { h: "13h20", t: "Les 3 premiers cas, en direct à l'écran" },
    { h: "13h45", t: "Les 2 derniers : quand l'IA fait le travail à votre place" },
    { h: "13h55", t: "Vos questions" },
  ],
  howNote:
    "Sur Google Meet, depuis votre ordinateur ou votre téléphone. Rien à installer, caméra pas nécessaire.",

  hostTitle: "Qui anime",
  hostName: "Paul Pietra",
  hostRole: "Granit",
  hostBio:
    "Je passe mes journées avec des opticiens à automatiser ce qui leur prend du temps au comptoir et en back-office. Je vous montre ce qui marche vraiment, pas ce qui fait joli en démo.",

  formTitle: "Réservez votre place",
  formIntro:
    "Vous recevez l'invitation avec le lien de connexion par mail. Vous ne pouvez pas venir ? Inscrivez-vous quand même, on vous envoie le replay.",
  fields: {
    name: "Prénom et nom",
    email: "Adresse e-mail",
    company: "Nom du magasin",
    stores: "Nombre de magasins",
  },
  placeholders: {
    name: "Marie Dupont",
    email: "marie@centre-vision.fr",
    company: "Centre Vision",
  },
  stores: ["1 magasin", "2 à 3 magasins", "4 à 15 magasins", "Plus de 15 magasins"],
  choose: "Choisir…",
  sending: "Envoi…",
  note: "Gratuit. Vos données restent chez nous, jamais revendues.",
  success: "C'est noté, votre place est réservée.",
  successSub:
    "L'invitation avec le lien de connexion arrive dans votre boîte mail. À jeudi 26 novembre, 13h15.",
  successContact: "Une question d'ici là ?",
  error: "Une erreur est survenue. Réessayez, ou écrivez-nous à contact@getgranit.ai.",

  faqTitle: "Questions fréquentes",
  faq: [
    { q: "C'est vraiment gratuit ?", a: "Oui. Pas de carte bancaire, pas d'engagement." },
    {
      q: "Je ne pourrai pas être là à 13h15.",
      a: "Inscrivez-vous quand même : tous les inscrits reçoivent le replay le lendemain.",
    },
    {
      q: "Je ne suis pas à l'aise avec l'informatique.",
      a: "C'est fait pour vous. Tout est montré pas à pas, avec des outils gratuits que vous avez sans doute déjà.",
    },
    {
      q: "Est-ce que vous allez me vendre quelque chose ?",
      a: "Le webinar porte sur des usages que vous pouvez refaire seul. On présente Granit en deux minutes à la fin, pour ceux que ça intéresse.",
    },
  ],
};

const eyebrowStyle = {
  fontFamily: "var(--font-mono)",
  letterSpacing: "0.12em",
  textTransform: "uppercase" as const,
  color: "var(--terra)",
};

function WebinarPage() {
  return (
    <div className="min-h-screen" style={{ background: CREME, color: ENCRE }}>
      <header
        className="sticky top-0 z-50"
        style={{ background: CREME, borderBottom: `1px solid ${ENCRE}` }}
      >
        <div className="mx-auto flex h-[62px] max-w-[640px] items-center justify-between px-5">
          <div className="flex items-center gap-2.5">
            <img src={logoMonogram} alt="Granit" className="h-[26px] w-auto" />
            <span className="font-serif text-[19px] tracking-tight" style={{ fontWeight: 700 }}>
              Granit
            </span>
          </div>
          <a
            href="#inscription"
            className="px-3.5 py-2 text-[11px]"
            style={{ ...eyebrowStyle, color: CREME, background: ENCRE }}
          >
            S'inscrire
          </a>
        </div>
      </header>

      <main className="mx-auto max-w-[640px] px-5 pb-14">
        <section className="pb-8 pt-9">
          <Reveal>
            <p className="text-[11px]" style={eyebrowStyle}>
              {t.badge}
            </p>
            <h1
              className="mt-4 font-serif"
              style={{
                fontSize: "clamp(26px, 7.4vw, 44px)",
                lineHeight: 1.1,
                letterSpacing: "-0.02em",
                fontWeight: 400,
              }}
            >
              {t.titleLead}
              <br />
              <span className="accent-italic">{t.titleAccent}</span>
            </h1>

            {/* La date est le premier renseignement cherché : en gros, avant le texte. */}
            <div
              className="mt-6 flex flex-wrap items-baseline gap-x-4 gap-y-1 py-4"
              style={{ borderTop: `1px solid ${ENCRE}`, borderBottom: `1px solid ${ENCRE}` }}
            >
              <span className="font-serif text-[24px]" style={{ fontWeight: 400 }}>
                {t.date}
              </span>
              <span
                className="num-tabular font-serif text-[24px]"
                style={{ color: "var(--terra)" }}
              >
                {t.heure}
              </span>
            </div>
            <ul className="mt-3 flex flex-wrap gap-2">
              {t.facts.map((f) => (
                <li
                  key={f}
                  className="px-3 py-1.5 text-[12px]"
                  style={{ border: `1px solid ${FILET}`, color: "var(--text-soft)" }}
                >
                  {f}
                </li>
              ))}
            </ul>

            <p
              className="mt-6 text-[15.5px]"
              style={{ lineHeight: 1.6, color: "var(--text-soft)" }}
            >
              {t.intro}
            </p>
            <a
              href="#inscription"
              className="mt-7 inline-block w-full px-5 py-4 text-center text-[13px] sm:w-auto"
              style={{ ...eyebrowStyle, color: CREME, background: ENCRE, letterSpacing: "0.08em" }}
            >
              {t.cta}
            </a>
          </Reveal>
        </section>

        <section className="pt-6">
          <Reveal>
            <SectionTitle>{t.whatTitle}</SectionTitle>
            <ol className="mt-5">
              {t.cas.map((c, i) => (
                <li
                  key={c}
                  className="grid grid-cols-[34px_1fr] items-baseline py-4"
                  style={{ borderTop: `1px solid ${FILET}` }}
                >
                  <span
                    className="num-tabular font-serif text-[20px]"
                    style={{ color: "var(--terra)" }}
                  >
                    {i + 1}
                  </span>
                  <span className="text-[15.5px]" style={{ lineHeight: 1.5 }}>
                    {c}
                  </span>
                </li>
              ))}
              {/* Les cas 4 et 5 restent cachés, comme dans le mail : c'est la raison de venir en direct. */}
              <li
                className="grid grid-cols-[34px_1fr] items-baseline py-4"
                style={{ borderTop: `1px solid ${FILET}`, borderBottom: `1px solid ${FILET}` }}
              >
                <span
                  className="num-tabular font-serif text-[20px]"
                  style={{ color: "var(--terra)" }}
                >
                  4·5
                </span>
                <span className="text-[15.5px]" style={{ lineHeight: 1.5 }}>
                  <span aria-hidden>🔒 </span>
                  <span style={{ color: "var(--text-soft)" }}>{t.surprise}</span>
                </span>
              </li>
            </ol>
          </Reveal>
        </section>

        <section className="grid gap-10 pt-12 sm:grid-cols-2">
          <Reveal>
            <SectionTitle>{t.whoTitle}</SectionTitle>
            <p
              className="mt-4 text-[14.5px]"
              style={{ lineHeight: 1.6, color: "var(--text-soft)" }}
            >
              {t.who}
            </p>
          </Reveal>
          <Reveal delay={0.05}>
            <SectionTitle>{t.howTitle}</SectionTitle>
            <ul className="mt-4 space-y-2.5">
              {t.deroule.map((d) => (
                <li
                  key={d.h}
                  className="grid grid-cols-[56px_1fr] text-[14px]"
                  style={{ lineHeight: 1.45 }}
                >
                  <span
                    className="num-tabular"
                    style={{ fontFamily: "var(--font-mono)", color: "var(--terra)" }}
                  >
                    {d.h}
                  </span>
                  <span>{d.t}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-[13px]" style={{ lineHeight: 1.5, color: "var(--text-muted)" }}>
              {t.howNote}
            </p>
          </Reveal>
        </section>

        <section className="pt-12">
          <Reveal>
            <SectionTitle>{t.hostTitle}</SectionTitle>
            <div
              className="mt-5 flex items-start gap-5 p-5"
              style={{ border: `1px solid ${FILET}`, background: "var(--surface)" }}
            >
              <img
                src={photoPaul}
                alt={t.hostName}
                width={88}
                height={88}
                className="h-[88px] w-[88px] shrink-0 rounded-full object-cover"
              />
              <div>
                <p className="font-serif text-[19px]" style={{ fontWeight: 400 }}>
                  {t.hostName}
                  <span className="ml-2 text-[11px]" style={eyebrowStyle}>
                    {t.hostRole}
                  </span>
                </p>
                <p
                  className="mt-2 text-[14px]"
                  style={{ lineHeight: 1.55, color: "var(--text-soft)" }}
                >
                  {t.hostBio}
                </p>
              </div>
            </div>
          </Reveal>
        </section>

        <section id="inscription" className="scroll-mt-20 pt-12">
          <Reveal>
            <WebinarForm />
          </Reveal>
        </section>

        <section className="pt-12">
          <Reveal>
            <SectionTitle>{t.faqTitle}</SectionTitle>
            <Faq />
          </Reveal>
        </section>
      </main>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2
      className="font-serif"
      style={{ fontSize: "clamp(21px, 5.2vw, 27px)", lineHeight: 1.15, fontWeight: 400 }}
    >
      {children}
    </h2>
  );
}

function Faq() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <ul className="mt-4">
      {t.faq.map((item, i) => (
        <li key={item.q} style={{ borderBottom: `1px solid ${FILET}` }}>
          <button
            type="button"
            className="flex w-full items-center justify-between gap-4 py-4 text-left text-[15px]"
            aria-expanded={open === i}
            onClick={() => setOpen(open === i ? null : i)}
          >
            {item.q}
            <motion.span
              aria-hidden
              animate={{ rotate: open === i ? 45 : 0 }}
              style={{ color: "var(--terra)", fontSize: 20, lineHeight: 1 }}
            >
              +
            </motion.span>
          </button>
          <AnimatePresence initial={false}>
            {open === i && (
              <motion.p
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden pb-4 text-[14px]"
                style={{ lineHeight: 1.6, color: "var(--text-soft)" }}
              >
                {item.a}
              </motion.p>
            )}
          </AnimatePresence>
        </li>
      ))}
    </ul>
  );
}

const labelStyle = {
  fontFamily: "var(--font-mono)",
  letterSpacing: "0.1em",
  textTransform: "uppercase" as const,
  color: "var(--text-soft)",
};
const inputClass =
  "w-full px-3.5 py-3 text-[16px] outline-none transition-colors focus:border-[color:var(--text)]";
const inputStyle = { background: CREME, border: `1px solid ${FILET}`, color: ENCRE };

function Label({ text, children }: { text: string; children: React.ReactNode }) {
  return (
    <label className="mb-4 block">
      <span className="mb-1.5 block text-[10.5px]" style={labelStyle}>
        {text}
      </span>
      {children}
    </label>
  );
}

function WebinarForm() {
  const submit = useServerFn(submitDemo);
  const posthog = usePostHog();
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

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
        <p
          className="mt-3 max-w-sm text-[13px]"
          style={{ color: "var(--text-muted)", lineHeight: 1.5 }}
        >
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
        const stores = String(fd.get("orgType") || "");
        setStatus("submitting");
        try {
          await submit({
            data: {
              name: String(fd.get("name") || ""),
              email: String(fd.get("email") || ""),
              company: String(fd.get("company") || ""),
              orgType: stores,
              source: SOURCE,
              utm: getAttribution(),
            },
          });
          posthog.capture("webinar_registration_submitted", {
            webinar: SOURCE,
            stores: stores || undefined,
          });
          logDemoRequestDelivered(posthog, "webinar_landing", stores || undefined);
          setStatus("success");
        } catch {
          logDemoRequestDeliveryFailed(posthog, "webinar_landing");
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

      <Label text={t.fields.name}>
        <input
          name="name"
          required
          autoComplete="name"
          placeholder={t.placeholders.name}
          className={inputClass}
          style={inputStyle}
        />
      </Label>
      <Label text={t.fields.email}>
        <input
          name="email"
          type="email"
          required
          autoComplete="email"
          inputMode="email"
          placeholder={t.placeholders.email}
          className={inputClass}
          style={inputStyle}
        />
      </Label>
      <div className="grid gap-x-4 sm:grid-cols-2">
        <Label text={t.fields.company}>
          <input
            name="company"
            autoComplete="organization"
            placeholder={t.placeholders.company}
            className={inputClass}
            style={inputStyle}
          />
        </Label>
        <Label text={t.fields.stores}>
          <select name="orgType" defaultValue="" className={inputClass} style={inputStyle}>
            <option value="" disabled>
              {t.choose}
            </option>
            {t.stores.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </Label>
      </div>

      <button
        type="submit"
        disabled={status === "submitting"}
        className="mt-1 w-full px-5 py-4 text-[13px] transition-opacity"
        style={{
          background: ENCRE,
          color: CREME,
          ...{
            fontFamily: "var(--font-mono)",
            letterSpacing: "0.08em",
            textTransform: "uppercase" as const,
          },
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
