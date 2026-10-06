import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { usePostHog } from "posthog-js/react";

import { SiteLayout } from "@/components/SiteLayout";
import { Reveal } from "@/components/Reveal";
import { useLanguage } from "@/lib/i18n";
import { logDemoRequestDelivered, logDemoRequestDeliveryFailed } from "@/lib/posthogLogs";
import { submitDemo } from "@/lib/submitDemo";
import { copy, type AffiliationCopy as Copy } from "@/lib/affiliationCopy";

/**
 * Programme d'apporteurs d'affaires : les gens qui accompagnent déjà des
 * professionnels de santé (gestionnaires TP, consultants, formateurs,
 * experts-comptables, réseaux) recommandent Granit et touchent une commission
 * par établissement signé, dans toutes les verticales de la page /agents.
 *
 * Les montants ne sont pas affichés : ils dépendent du profil (prime par client
 * ou pourcentage) et se fixent à l'appel. La candidature passe par le même
 * webhook que les demandes de démo, avec `source: "affiliation"` pour la trier.
 */
export const Route = createFileRoute("/affiliation")({
  head: () => ({
    meta: [
      { title: "Devenir partenaire - Granit AI" },
      {
        name: "description",
        content:
          "Vous accompagnez des professionnels de santé ? Recommandez Granit et touchez une commission sur chaque établissement qui démarre.",
      },
      { property: "og:title", content: "Programme partenaires - Granit AI" },
      {
        property: "og:description",
        content: "Recommandez Granit aux professionnels de santé que vous accompagnez, on s'occupe du reste.",
      },
    ],
  }),
  component: AffiliationPage,
});

const SOURCE = "affiliation";


function AffiliationPage() {
  const { lang } = useLanguage();
  const t = copy[lang];

  return (
    <SiteLayout>
      <section className="relative mx-auto grid max-w-[1240px] items-center gap-12 px-6 pb-20 pt-20 md:grid-cols-[1.15fr_1fr] md:pt-28">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 -z-10 mx-auto h-[460px] max-w-[1000px] opacity-60"
          style={{
            background:
              "radial-gradient(ellipse at center, color-mix(in oklab, var(--terra) 14%, transparent), transparent 70%)",
          }}
        />
        <Reveal>
          <div className="eyebrow mb-5">{t.eyebrow}</div>
          <h1 className="h1-hero" style={{ fontSize: "clamp(34px,3.9vw,56px)" }}>
            {t.titleLead}
            <br />
            <span className="accent-italic">{t.titleAccent}</span>
          </h1>
          <p className="body-lg mt-7 max-w-xl">{t.intro}</p>
          <a href="#candidature" className="btn-primary mt-9">
            {t.cta} <span className="arrow">↗</span>
          </a>
        </Reveal>
        <Reveal delay={0.15}>
          <ReferralFlow steps={t.flow} />
        </Reveal>
      </section>

      <section className="mx-auto max-w-[1240px] px-6 py-16">
        <Reveal>
          <div className="eyebrow mb-4">{t.whyEyebrow}</div>
          <h2 className="h2-section max-w-2xl">
            {t.whyTitle} <span className="accent-italic">{t.whyAccent}</span>
          </h2>
        </Reveal>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {t.why.map((item, i) => (
            <Reveal key={item.title} delay={i * 0.08}>
              <div
                className="card-hover h-full rounded-[18px] border p-8"
                style={{ borderColor: "var(--border)", background: "var(--bg2)" }}
              >
                <div
                  className="text-[12px]"
                  style={{ fontFamily: "var(--font-mono)", color: "var(--terra)" }}
                >
                  0{i + 1}
                </div>
                <h3 className="mt-5 font-serif text-[22px] leading-[1.2]">{item.title}</h3>
                <p className="mt-4 text-[14px] leading-[1.6]" style={{ color: "var(--text-soft)" }}>
                  {item.text}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal>
          <div className="mt-12 flex flex-wrap items-center gap-2">
            <span className="eyebrow mr-2">{t.sectorsEyebrow}</span>
            {t.sectors.map((s) => (
              <span
                key={s}
                className="rounded-full px-3.5 py-1.5 text-[13px]"
                style={{ background: "var(--terra-light)", color: "var(--terra-hover)" }}
              >
                {s}
              </span>
            ))}
            <Link
              to="/agents"
              className="ml-1 text-[13px] underline-offset-4 hover:underline"
              style={{ color: "var(--terra)", fontFamily: "var(--font-mono)" }}
            >
              {t.sectorsLink} →
            </Link>
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="eyebrow mr-2">{t.whoEyebrow}</span>
            {t.who.map((w) => (
              <span
                key={w}
                className="rounded-full border px-3.5 py-1.5 text-[13px]"
                style={{ borderColor: "var(--border2)", color: "var(--text-soft)" }}
              >
                {w}
              </span>
            ))}
          </div>
        </Reveal>
      </section>

      <section className="mx-auto max-w-[1240px] px-6 py-16">
        <Reveal>
          <div className="eyebrow mb-4">{t.stepsEyebrow}</div>
          <h2 className="h2-section">
            {t.stepsTitle} <span className="accent-italic">{t.stepsAccent}</span>
          </h2>
        </Reveal>
        <ol className="mt-12 grid gap-8 md:grid-cols-3">
          {t.steps.map((s, i) => (
            <Reveal key={s.n} delay={i * 0.1}>
              <li className="border-t pt-6" style={{ borderColor: "var(--text)" }}>
                <div
                  className="font-serif text-[44px] leading-none"
                  style={{ color: "var(--terra)" }}
                >
                  {s.n}
                </div>
                <h3 className="mt-5 text-[18px]" style={{ fontWeight: 600 }}>
                  {s.title}
                </h3>
                <p className="mt-2 text-[14px] leading-[1.6]" style={{ color: "var(--text-soft)" }}>
                  {s.text}
                </p>
              </li>
            </Reveal>
          ))}
        </ol>
      </section>

      <section
        id="candidature"
        className="mx-auto grid max-w-[1240px] scroll-mt-24 gap-12 px-6 py-16 md:grid-cols-[1fr_1.1fr]"
      >
        <Reveal>
          <div className="eyebrow mb-4">{t.formEyebrow}</div>
          <h2 className="h2-section">{t.formTitle}</h2>
          <p className="body-lg mt-5 max-w-md">{t.formIntro}</p>
          <div className="mt-12">
            <h3 className="mb-2 font-serif text-[22px]">{t.faqTitle}</h3>
            <Faq items={t.faq} />
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <AffiliationForm t={t} />
        </Reveal>
      </section>
    </SiteLayout>
  );
}

/** Le parcours d'une recommandation, avec un point qui le descend en boucle. */
function ReferralFlow({ steps }: { steps: Copy["flow"] }) {
  const reduce = useReducedMotion();
  return (
    <div
      className="relative rounded-[18px] border bg-white p-7 md:p-9"
      style={{ borderColor: "var(--border)", boxShadow: "var(--shadow-soft)" }}
    >
      <div
        aria-hidden
        className="absolute bottom-12 left-[43px] top-12 w-px md:left-[51px]"
        style={{ background: "var(--border2)" }}
      >
        {!reduce && (
          <motion.span
            className="absolute -left-[3px] h-[7px] w-[7px] rounded-full"
            style={{ background: "var(--terra)", boxShadow: "0 0 12px var(--terra-glow)" }}
            animate={{ top: ["0%", "100%"], opacity: [0, 1, 1, 0] }}
            transition={{ duration: 3.2, ease: "easeInOut", repeat: Infinity, repeatDelay: 0.6 }}
          />
        )}
      </div>
      <ul className="relative space-y-9">
        {steps.map((s, i) => {
          const last = i === steps.length - 1;
          return (
            <motion.li
              key={i}
              className="flex items-center gap-4"
              initial={{ opacity: 0, x: 12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: 0.25 + i * 0.15 }}
            >
              <span
                className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-[11px]"
                style={{
                  fontFamily: "var(--font-mono)",
                  borderColor: last ? "var(--terra)" : "var(--border2)",
                  background: last ? "var(--terra)" : "white",
                  color: last ? "white" : "var(--text-muted)",
                }}
              >
                {last ? "€" : i + 1}
              </span>
              <p className="text-[16px] leading-[1.4]">
                <span style={{ fontWeight: 600 }}>{s.k}</span>{" "}
                <span style={{ color: "var(--text-soft)" }}>{s.v}</span>
              </p>
            </motion.li>
          );
        })}
      </ul>
    </div>
  );
}

function Faq({ items }: { items: Copy["faq"] }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <ul>
      {items.map((item, i) => (
        <li key={item.q} className="border-b" style={{ borderColor: "var(--border)" }}>
          <button
            type="button"
            className="flex w-full items-center justify-between gap-4 py-4 text-left text-[15px]"
            style={{ fontWeight: 500 }}
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
                className="overflow-hidden pb-4 text-[14px] leading-[1.6]"
                style={{ color: "var(--text-soft)" }}
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

const inputClass =
  "w-full rounded-[8px] border bg-transparent px-3.5 py-2.5 text-[14px] outline-none transition-colors focus:border-[color:var(--terra)]";

function Label({ text, children }: { text: string; children: React.ReactNode }) {
  return (
    <label className="mb-4 block">
      <div className="mb-1.5 text-[12px]" style={{ color: "var(--text-soft)", fontWeight: 500 }}>
        {text}
      </div>
      {children}
    </label>
  );
}

function AffiliationForm({ t }: { t: Copy }) {
  const submit = useServerFn(submitDemo);
  const posthog = usePostHog();
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const border = { borderColor: "var(--border)" };

  if (status === "success") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex h-full flex-col items-center justify-center rounded-[14px] border bg-white p-10 text-center"
        style={{ ...border, boxShadow: "var(--shadow-soft)" }}
      >
        <span
          className="flex h-12 w-12 items-center justify-center rounded-full"
          style={{ background: "var(--terra-light)", color: "var(--terra)" }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12l5 5L20 7" />
          </svg>
        </span>
        <p className="mt-5 font-serif text-[22px]" style={{ lineHeight: 1.25 }}>
          {t.success}
        </p>
        <p className="mt-2 text-[14px]" style={{ color: "var(--text-muted)" }}>
          {t.successSub}
        </p>
      </motion.div>
    );
  }

  return (
    <form
      className="rounded-[14px] border bg-white p-7 md:p-8"
      style={{ ...border, boxShadow: "var(--shadow-soft)" }}
      onSubmit={async (e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        const profile = String(fd.get("orgType") || "");
        setStatus("submitting");
        try {
          await submit({
            data: {
              name: String(fd.get("name") || ""),
              email: String(fd.get("email") || ""),
              phone: String(fd.get("phone") || ""),
              company: String(fd.get("company") || ""),
              orgType: profile,
              challenge: String(fd.get("challenge") || ""),
              source: SOURCE,
            },
          });
          posthog.capture("affiliate_application_submitted", { profile: profile || undefined });
          logDemoRequestDelivered(posthog, "affiliation_landing", profile || undefined);
          setStatus("success");
        } catch {
          logDemoRequestDeliveryFailed(posthog, "affiliation_landing");
          setStatus("error");
        }
      }}
    >
      <Label text={t.fields.name}>
        <input name="name" required autoComplete="name" placeholder={t.placeholders.name} className={inputClass} style={border} />
      </Label>
      <div className="grid gap-x-4 sm:grid-cols-2">
        <Label text={t.fields.email}>
          <input name="email" type="email" required autoComplete="email" placeholder={t.placeholders.email} className={inputClass} style={border} />
        </Label>
        <Label text={t.fields.phone}>
          <input name="phone" type="tel" autoComplete="tel" placeholder={t.placeholders.phone} className={inputClass} style={border} />
        </Label>
      </div>
      <div className="grid gap-x-4 sm:grid-cols-2">
        <Label text={t.fields.company}>
          <input name="company" autoComplete="organization" placeholder={t.placeholders.company} className={inputClass} style={border} />
        </Label>
        <Label text={t.fields.profile}>
          <select name="orgType" required defaultValue="" className={`${inputClass} bg-white`} style={border}>
            <option value="" disabled>
              {t.choose}
            </option>
            {t.profiles.map((p) => (
              <option key={p}>{p}</option>
            ))}
          </select>
        </Label>
      </div>
      <Label text={t.fields.message}>
        <textarea name="challenge" rows={3} placeholder={t.placeholders.message} className={inputClass} style={border} />
      </Label>
      <button
        type="submit"
        disabled={status === "submitting"}
        className="btn-primary mt-2 w-full justify-center"
        style={status === "submitting" ? { opacity: 0.7, cursor: "wait" } : undefined}
      >
        {status === "submitting" ? t.sending : t.submit} <span className="arrow">↗</span>
      </button>
      {status === "error" && (
        <p className="mt-3 text-center text-[12px]" style={{ color: "#c0392b" }}>
          {t.error}
        </p>
      )}
      <p className="mt-4 text-center text-[11px]" style={{ color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
        {t.note}
      </p>
    </form>
  );
}
