import { useState, type CSSProperties, type ReactNode } from "react";
import { useServerFn } from "@tanstack/react-start";
import { AnimatePresence, motion } from "framer-motion";
import { usePostHog } from "posthog-js/react";

import { logDemoRequestDelivered, logDemoRequestDeliveryFailed } from "@/lib/posthogLogs";
import { submitDemo } from "@/lib/submitDemo";
import { getAttribution } from "@/lib/attribution";
import { SOURCE, t } from "@/lib/webinarIa";

/**
 * FAQ et formulaire d'inscription de la page webinar, séparés de la mise en
 * page pour pouvoir en essayer d'autres sans toucher à ce qui part dans B11.
 */

const FILET = "var(--border2)";

export function Faq() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <ul className="mt-2">
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
  "w-full rounded-[10px] px-3.5 py-3 text-[16px] outline-none transition-colors focus:border-[color:var(--terra)]";

function Label({ text, children }: { text: string; children: ReactNode }) {
  return (
    <label className="mb-4 block">
      <span className="mb-1.5 block text-[10.5px]" style={labelStyle}>
        {text}
      </span>
      {children}
    </label>
  );
}

type FormProps = {
  /** Titre et chapeau du formulaire ; `null` quand la page les affiche déjà. */
  heading?: ReactNode | null;
  /** Sans cadre, quand le formulaire est déjà posé dans une carte. */
  bare?: boolean;
  /** Un champ par ligne, pour une colonne étroite. */
  stacked?: boolean;
  /** Fond des champs. */
  inputBackground?: string;
  /** Fond du bouton d'envoi. */
  buttonBackground?: string;
};

export function WebinarForm({
  heading,
  bare = false,
  stacked = false,
  inputBackground = "var(--bg2)",
  buttonBackground = "var(--terra)",
}: FormProps) {
  const submit = useServerFn(submitDemo);
  const posthog = usePostHog();
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const card: CSSProperties = bare
    ? {}
    : {
        background: "var(--surface)",
        border: "1px solid var(--border)",
        boxShadow: "var(--shadow-soft)",
      };
  const inputStyle = {
    background: inputBackground,
    border: `1px solid ${FILET}`,
    color: "var(--text)",
  };
  const row = stacked ? "" : "grid gap-x-4 sm:grid-cols-2";

  if (status === "success") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`flex h-full flex-col items-center justify-center text-center ${bare ? "py-8" : "rounded-[20px] px-6 py-12"}`}
        style={card}
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
          className="mt-5 max-w-xs font-serif text-[23px]"
          style={{ lineHeight: 1.2, fontWeight: 400 }}
        >
          {t.success}
        </p>
        <p
          className="mt-3 max-w-sm text-[13.5px]"
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
      </motion.div>
    );
  }

  return (
    <form
      className={bare ? "" : "rounded-[20px] p-6 md:p-8"}
      style={card}
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
              phone: String(fd.get("phone") || ""),
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
      {heading === undefined ? (
        <>
          <h2
            className="font-serif"
            style={{ fontSize: "clamp(22px, 3vw, 28px)", fontWeight: 400 }}
          >
            {t.formTitle}
          </h2>
          <p
            className="mb-6 mt-2 text-[13.5px]"
            style={{ color: "var(--text-muted)", lineHeight: 1.5 }}
          >
            {t.formIntro}
          </p>
        </>
      ) : (
        heading
      )}

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
      <div className={row}>
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
        <Label text={t.fields.phone}>
          <input
            name="phone"
            type="tel"
            required
            autoComplete="tel"
            inputMode="tel"
            pattern="[0-9 .+\-\(\)]{10,20}"
            title={t.phoneHint}
            placeholder={t.placeholders.phone}
            className={inputClass}
            style={inputStyle}
          />
        </Label>
      </div>
      <div className={row}>
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
        className="mt-1 w-full rounded-full px-5 py-4 text-[14px] text-white transition-transform hover:scale-[1.01]"
        style={{
          background: buttonBackground,
          fontWeight: 600,
          opacity: status === "submitting" ? 0.7 : 1,
          cursor: status === "submitting" ? "wait" : "pointer",
        }}
      >
        {status === "submitting" ? t.sending : `${t.cta} →`}
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
