/* La demande de démo de l'accueil (formulaire et lien Cal.com), reprise telle quelle de l'ancien accueil :
   le pied de page (« Contact », « Demander une démo ») et la page /demo pointent vers /#demo. */
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { usePostHog } from "posthog-js/react";

import { Reveal } from "@/components/Reveal";
import { useLanguage } from "@/lib/i18n";
import { logDemoRequestDelivered, logDemoRequestDeliveryFailed } from "@/lib/posthogLogs";
import { submitDemo } from "@/lib/submitDemo";
import { getAttribution } from "@/lib/attribution";
import { calcomDemoUrl } from "./nouvelle/socle";

const copy = {
  fr: {
    eyebrow: "Démo gratuite",
    title: "Nos experts sont là pour vous.",
    intro:
      "En 15 minutes, nous vous ferons découvrir comment gagner de nombreuses heures de productivité grâce aux agents Granit.",
    bullets: ["Réponse sous 24h", "Sans engagement", "100% gratuit"],
    book: "Choisir un créneau de démo",
    bookOr: "Ou laissez-nous vos coordonnées, on vous rappelle :",
    contact: { email: "contact@getgranit.ai", site: "getgranit.ai", city: "Paris, France" },
    labels: ["Email", "Site", "Adresse"],
    fields: [
      "Prénom et nom",
      "Email professionnel",
      "Téléphone",
      "Nom de l'établissement",
      "Type d'établissement",
      "Quel est votre principal défi administratif ?",
    ],
    placeholders: [
      "Marie Dupont",
      "marie@centre-vision.fr",
      "06 12 34 56 78",
      "Centre Vision Paris",
      "Tiers-payant, rejets CPAM, recouvrement, rapprochement…",
    ],
    choose: "Choisir…",
    cta: "Demander une démo gratuite",
    note: "Gratuit. Sans engagement. Réponse sous 24h.",
    sending: "Envoi…",
    success: "Merci ! Votre demande est bien reçue — nous vous recontactons sous 24h.",
    error: "Une erreur est survenue. Réessayez, ou écrivez-nous à contact@getgranit.ai.",
    options: [
      "Centre dentaire",
      "Centre optique",
      "Audioprothésiste",
      "Pharmacie",
      "EHPAD",
      "Hôpital / Clinique",
      "Laboratoire",
      "Orthodontie",
      "Autre",
    ],
  },
  en: {
    eyebrow: "Free demo",
    title: "Our experts are here for you.",
    intro: "In 15 minutes, we'll show you how to save hours of productivity with Granit agents.",
    bullets: ["Reply within 24h", "No commitment", "100% free"],
    book: "Pick a demo slot",
    bookOr: "Or leave your details and we'll call you back:",
    contact: { email: "contact@getgranit.ai", site: "getgranit.ai", city: "Paris, France" },
    labels: ["Email", "Website", "Address"],
    fields: [
      "Full name",
      "Work email",
      "Phone",
      "Organization name",
      "Organization type",
      "What is your main administrative challenge?",
    ],
    placeholders: [
      "Marie Dupont",
      "marie@clinic.com",
      "+33 6 12 34 56 78",
      "Paris Health Center",
      "Billing, payer rejections, collections, reconciliation…",
    ],
    choose: "Choose…",
    cta: "Book a free demo",
    note: "Free. No commitment. Response within 24h.",
    sending: "Sending…",
    success: "Thank you! Your request is in — we'll get back to you within 24h.",
    error: "Something went wrong. Please try again, or email us at contact@getgranit.ai.",
    options: [
      "Dental center",
      "Optical center",
      "Hearing care",
      "Pharmacy",
      "Care home",
      "Hospital / Clinic",
      "Laboratory",
      "Orthodontics",
      "Other",
    ],
  },
};
type Copie = (typeof copy)["fr"];

export function DemandeDemo() {
  const { lang } = useLanguage();
  const t = copy[lang];
  const posthog = usePostHog();
  return (
    <section id="demo" className="relative scroll-mt-24 py-24" style={{ background: "var(--bg)" }}>
      <div className="mx-auto max-w-[1240px] px-6">
        <div className="grid gap-12 lg:grid-cols-2">
          <Reveal>
            <div>
              <div className="eyebrow mb-5">{t.eyebrow}</div>
              <h2
                className="font-serif"
                style={{
                  fontSize: "clamp(34px,4vw,56px)",
                  lineHeight: 1.05,
                  letterSpacing: "-0.02em",
                  fontWeight: 400,
                }}
              >
                {t.title}
              </h2>
              <p className="body-lg mt-7 max-w-md">{t.intro}</p>
              <ul className="mt-8 space-y-2.5 text-[14px]" style={{ color: "var(--text-soft)" }}>
                {t.bullets.map((b) => (
                  <li key={b} className="flex items-center gap-2.5">
                    <span
                      className="flex h-5 w-5 items-center justify-center rounded-full"
                      style={{ background: "var(--succes-fond)", color: "var(--succes-texte)" }}
                    >
                      <svg
                        width="11"
                        height="11"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M5 12l5 5L20 7" />
                      </svg>
                    </span>
                    {b}
                  </li>
                ))}
              </ul>
              <a
                href={calcomDemoUrl("section_demo")}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary mt-9"
                onClick={() =>
                  posthog.capture("demo_booking_clicked", { placement: "section_demo" })
                }
              >
                {t.book} <span className="arrow">↗</span>
              </a>
              <p className="mt-6 text-[13px]" style={{ color: "var(--text-muted)" }}>
                {t.bookOr}
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <DemoForm t={t} />
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function DemoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline gap-4">
      <div
        className="w-20 shrink-0 text-[11px] uppercase tracking-[0.12em]"
        style={{ fontFamily: "var(--font-mono)", color: "var(--text-muted)" }}
      >
        {label}
      </div>
      <div>{value}</div>
    </div>
  );
}
function DemoField({
  label,
  type = "text",
  placeholder,
  name,
  required,
}: {
  label: string;
  type?: string;
  placeholder?: string;
  name: string;
  required?: boolean;
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
        className="w-full rounded-[8px] border bg-transparent px-3.5 py-2.5 text-[14px] outline-none transition-colors focus:border-[color:var(--profond)]"
        style={{ borderColor: "var(--filet-champ)" }}
      />
    </label>
  );
}
function DemoSelect({
  label,
  options,
  choose,
  name,
}: {
  label: string;
  options: string[];
  choose: string;
  name: string;
}) {
  return (
    <label className="mb-4 block">
      <div className="mb-1.5 text-[12px]" style={{ color: "var(--text-soft)", fontWeight: 500 }}>
        {label}
      </div>
      <select
        name={name}
        className="w-full rounded-[8px] border bg-papier px-3.5 py-2.5 text-[14px] outline-none transition-colors focus:border-[color:var(--profond)]"
        style={{ borderColor: "var(--filet-champ)" }}
        defaultValue=""
      >
        <option value="" disabled>
          {choose}
        </option>
        {options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
    </label>
  );
}
function DemoArea({
  label,
  placeholder,
  name,
}: {
  label: string;
  placeholder?: string;
  name: string;
}) {
  return (
    <label className="mb-5 block">
      <div className="mb-1.5 text-[12px]" style={{ color: "var(--text-soft)", fontWeight: 500 }}>
        {label}
      </div>
      <textarea
        name={name}
        rows={4}
        placeholder={placeholder}
        className="w-full rounded-[8px] border bg-transparent px-3.5 py-2.5 text-[14px] outline-none transition-colors focus:border-[color:var(--profond)]"
        style={{ borderColor: "var(--filet-champ)" }}
      />
    </label>
  );
}

function DemoForm({ t }: { t: Copie }) {
  const submit = useServerFn(submitDemo);
  const posthog = usePostHog();
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  if (status === "success") {
    return (
      <div
        className="flex h-full flex-col items-center justify-center rounded-[14px] border bg-papier p-10 text-center"
        style={{ borderColor: "var(--border)", boxShadow: "var(--ombre-douce)" }}
      >
        <span
          className="flex h-12 w-12 items-center justify-center rounded-full"
          style={{ background: "var(--succes-fond)", color: "var(--succes-texte)" }}
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
          className="mt-5 max-w-xs font-serif text-[22px]"
          style={{ letterSpacing: "-0.01em", lineHeight: 1.25 }}
        >
          {t.success}
        </p>
      </div>
    );
  }

  return (
    <form
      className="rounded-[14px] border bg-papier p-7 md:p-8"
      style={{ borderColor: "var(--border)", boxShadow: "var(--ombre-douce)" }}
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
              challenge: String(fd.get("challenge") || ""),
              utm: getAttribution(),
            },
          });
          const organizationType = String(fd.get("orgType") || "") || undefined;
          posthog.capture("demo_request_submitted", {
            form_location: "homepage",
            organization_type: organizationType,
          });
          logDemoRequestDelivered(posthog, "homepage", organizationType);
          setStatus("success");
        } catch {
          logDemoRequestDeliveryFailed(posthog, "homepage");
          setStatus("error");
        }
      }}
    >
      <DemoField name="name" required label={t.fields[0]} placeholder={t.placeholders[0]} />
      <DemoField
        name="email"
        type="email"
        required
        label={t.fields[1]}
        placeholder={t.placeholders[1]}
      />
      <DemoField name="phone" type="tel" label={t.fields[2]} placeholder={t.placeholders[2]} />
      <DemoField name="company" label={t.fields[3]} placeholder={t.placeholders[3]} />
      <DemoSelect name="orgType" label={t.fields[4]} options={t.options} choose={t.choose} />
      <DemoArea name="challenge" label={t.fields[5]} placeholder={t.placeholders[4]} />
      <button
        type="submit"
        disabled={status === "submitting"}
        className="btn-primary mt-2 w-full justify-center"
        style={status === "submitting" ? { opacity: 0.7, cursor: "wait" } : undefined}
      >
        {status === "submitting" ? t.sending : t.cta} <span className="arrow">↗</span>
      </button>
      {status === "error" && (
        <p className="mt-3 text-center text-[12px]" style={{ color: "var(--alerte-texte)" }}>
          {t.error}
        </p>
      )}
      <p
        className="mt-4 text-center text-[11px]"
        style={{ color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}
      >
        {t.note}
      </p>
    </form>
  );
}
