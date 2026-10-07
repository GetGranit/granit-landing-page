import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { motion, useReducedMotion } from "framer-motion";

import logoMonogram from "@/assets/logo.svg";

/** Cadre du parcours /pec : logo, barre de progression, une carte centrée. */
export function PecShell({ step, total, children }: { step: number; total: number; children: ReactNode }) {
  return (
    <div className="min-h-screen" style={{ background: "var(--bg2)", color: "var(--text-soft)" }}>
      <header className="mx-auto flex max-w-[620px] items-center justify-between gap-4 px-4 py-4">
        <Link to="/" className="flex items-center gap-2" style={{ color: "var(--text)" }}>
          <img src={logoMonogram} alt="" width={28} height={28} />
          <span className="font-serif text-[19px]" style={{ fontWeight: 700 }}>Granit</span>
        </Link>
        <Progress value={step / total} />
      </header>
      <main className="mx-auto grid max-w-[620px] px-4 pb-16">{children}</main>
    </div>
  );
}

function Progress({ value }: { value: number }) {
  return (
    <div className="h-1.5 flex-1 overflow-hidden rounded-full" style={{ maxWidth: 200, background: "var(--bg3)" }} aria-hidden>
      <div
        className="h-full rounded-full"
        style={{ width: `${Math.round(value * 100)}%`, background: "var(--gradient-terra)", transition: "width .6s cubic-bezier(.22,1,.36,1)" }}
      />
    </div>
  );
}

/** Une étape du parcours : apparaît en douceur, contenu centré. */
export function Screen({ id, children }: { id: string; children: ReactNode }) {
  const reduce = useReducedMotion();
  return (
    <motion.section
      key={id}
      initial={reduce ? false : { opacity: 0, y: 14, scale: 0.985 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="grid justify-items-center gap-5 rounded-[22px] border p-6 text-center sm:p-9"
      style={{ background: "var(--surface)", borderColor: "var(--border)", boxShadow: "0 1px 2px rgba(28,17,8,.04),0 8px 30px -10px rgba(28,17,8,.10)" }}
    >
      {children}
    </motion.section>
  );
}

export function Kicker({ children }: { children: ReactNode }) {
  return (
    <span className="text-[11px] uppercase" style={{ fontFamily: "var(--font-mono)", letterSpacing: ".14em", color: "var(--terra)" }}>
      {children}
    </span>
  );
}

/** Titre serif ; `em` = le mot en italique terracotta. */
export function Title({ children, em, after }: { children: ReactNode; em?: string; after?: ReactNode }) {
  return (
    <h1 className="font-serif text-[clamp(27px,6vw,38px)] leading-[1.08]" style={{ color: "var(--text)", letterSpacing: "-.02em", textWrap: "balance" }}>
      {children}
      {em && <span className="italic" style={{ color: "var(--terra)" }}>{em}</span>}
      {after}
    </h1>
  );
}

export function Muted({ children }: { children: ReactNode }) {
  return <p className="text-[15px]" style={{ color: "var(--text-muted)" }}>{children}</p>;
}

export function Reassure({ items }: { items: string[] }) {
  return (
    <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-[13px]" style={{ color: "var(--text-muted)" }}>
      {items.map((t) => (
        <span key={t}>
          <span style={{ color: "var(--sage)" }}>✓ </span>
          {t}
        </span>
      ))}
    </div>
  );
}

export function TextLink({ onClick, children }: { onClick: () => void; children: ReactNode }) {
  return (
    <button type="button" onClick={onClick} className="text-[15px] underline underline-offset-4" style={{ color: "var(--text-soft)" }}>
      {children}
    </button>
  );
}

export const bigBtn = "btn-primary justify-center !px-6 !py-4 !text-[16px]";
