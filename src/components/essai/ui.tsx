import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";

/** Petits blocs visuels partagés par les écrans de l'espace d'essai. */

export function Kicker({ children }: { children: ReactNode }) {
  return <div className="eyebrow mb-3">{children}</div>;
}

/** H2 serif ; `accent` s'affiche en italique terracotta. */
export function Title({ lead, accent, tail }: { lead: string; accent: string; tail?: string }) {
  return (
    <h1
      className="font-serif text-text"
      style={{ fontSize: "clamp(30px, 7vw, 42px)", lineHeight: 1.08, letterSpacing: "-0.02em" }}
    >
      {lead} <span className="accent-italic">{accent}</span>
      {tail ? ` ${tail}` : null}
    </h1>
  );
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={`rounded-[22px] border bg-white p-5 sm:p-6 ${className}`}
      style={{ borderColor: "var(--border)", boxShadow: "var(--shadow-soft)" }}
    >
      {children}
    </div>
  );
}

const STEPS = ["Photo", "Lecture", "PEC préparée", "Portail", "Simulation"];

/** Barre de progression du parcours (étapes 1 à 5). */
export function Progress({ current }: { current: number }) {
  return (
    <div aria-label={`Étape ${current} sur ${STEPS.length}`} className="mb-7">
      <div
        className="mb-2 flex justify-between text-[11px]"
        style={{ fontFamily: "var(--font-mono)" }}
      >
        <span style={{ color: "var(--terra)" }}>
          {current}/{STEPS.length} · {STEPS[current - 1]}
        </span>
        <span style={{ color: "var(--text-muted)" }}>{current - 1} étapes faites</span>
      </div>
      <div className="flex gap-1.5">
        {STEPS.map((s, i) => (
          <div
            key={s}
            className="h-1.5 flex-1 rounded-full"
            style={{
              background:
                i < current - 1 ? "var(--sage)" : i === current - 1 ? "var(--terra)" : "var(--bg3)",
            }}
          />
        ))}
      </div>
    </div>
  );
}

/** Coche ronde qui « pop » à l'apparition (sauf mouvement réduit). */
export function PopCheck({ done, size = 22 }: { done: boolean; size?: number }) {
  const reduce = useReducedMotion();
  if (!done) {
    return (
      <span
        aria-hidden
        className="inline-block shrink-0 rounded-full border-2"
        style={{ width: size, height: size, borderColor: "var(--border2)" }}
      />
    );
  }
  return (
    <motion.span
      aria-hidden
      initial={reduce ? false : { scale: 0.3, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 520, damping: 16 }}
      className="inline-flex shrink-0 items-center justify-center rounded-full text-white"
      style={{ width: size, height: size, background: "var(--sage)" }}
    >
      <svg
        width={size * 0.55}
        height={size * 0.55}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M5 12l5 5L20 7" />
      </svg>
    </motion.span>
  );
}

/** Réassurance en petite coche verte. */
export function Reassure({ children }: { children: ReactNode }) {
  return (
    <li className="flex items-start gap-2 text-[13px]" style={{ color: "var(--text-soft)" }}>
      <span aria-hidden style={{ color: "var(--sage)", fontWeight: 700 }}>
        ✓
      </span>
      {children}
    </li>
  );
}

export const inputClass =
  "w-full rounded-[12px] border bg-white px-4 py-3 text-[16px] outline-none transition-colors focus:border-[color:var(--terra)]";

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="mb-3 block">
      <span
        className="mb-1.5 block text-[13px]"
        style={{ color: "var(--text-soft)", fontWeight: 500 }}
      >
        {label}
      </span>
      {children}
    </label>
  );
}

/** Lien discret en forme de texte (actions secondaires). */
export function TextButton({ onClick, children }: { onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-[14px] underline-offset-4 hover:underline"
      style={{ color: "var(--terra)" }}
    >
      {children}
    </button>
  );
}
