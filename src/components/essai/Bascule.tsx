import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

import { useLanguage } from "@/lib/i18n";
import type { PecPlatform } from "@/lib/pec/essaiState";
import { Confettis } from "./Confettis";
import { Card, PopCheck, TextButton } from "./ui";

const copy = {
  fr: {
    progression: (faits: number, total: number) =>
      `${faits} portail${faits > 1 ? "s" : ""} sur ${total} connecté${faits > 1 ? "s" : ""}`,
    tout: "Tout est ",
    branche: "branché.",
    connectes: (n: number) =>
      `${n} portail${n > 1 ? "s" : ""} connecté${n > 1 ? "s" : ""} · vos PEC peuvent partir.`,
    ajouter: "Ajouter un portail",
  },
  en: {
    progression: (faits: number, total: number) =>
      `${faits} of ${total} portal${total > 1 ? "s" : ""} connected`,
    tout: "Everything is ",
    branche: "connected.",
    connectes: (n: number) =>
      `${n} portal${n > 1 ? "s" : ""} connected · your coverage requests can go out.`,
    ajouter: "Add a portal",
  },
};

/** « 3 portails sur 4 connectés », avec la barre qui avance. */
export function Progression({ faits, total }: { faits: number; total: number }) {
  const reduce = useReducedMotion();
  const percent = total ? Math.round((faits / total) * 100) : 0;
  const label = copy[useLanguage().lang].progression(faits, total);
  return (
    <div className="mt-4">
      <p className="mb-2 text-[13px]" style={{ color: "var(--text-soft)" }} aria-live="polite">
        <span className="num-tabular" style={{ fontFamily: "var(--font-mono)", fontWeight: 600 }}>
          {label}
        </span>
      </p>
      <div
        className="h-2 overflow-hidden rounded-full"
        style={{ background: "var(--bg3)" }}
        role="progressbar"
        aria-valuenow={faits}
        aria-valuemin={0}
        aria-valuemax={total}
        aria-label={label}
      >
        <motion.div
          className="h-full rounded-full"
          style={{ background: "var(--sage)" }}
          initial={false}
          animate={{ width: `${percent}%` }}
          transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 120, damping: 20 }}
        />
      </div>
    </div>
  );
}

/** Le moment de bascule : tous les portails cochés sont connectés. */
export function Bascule({
  portails,
  celebrer,
  onAjouter,
}: {
  portails: PecPlatform[];
  /** Vrai juste après la dernière connexion : confettis une seule fois. */
  celebrer: boolean;
  onAjouter: () => void;
}) {
  const reduce = useReducedMotion();
  const t = copy[useLanguage().lang];
  const [burst, setBurst] = useState(0);
  // Les confettis partent après le montage (pas au rendu serveur).
  useEffect(() => setBurst(celebrer ? 1 : 0), [celebrer]);
  const n = portails.length;
  return (
    <motion.div
      initial={reduce || !celebrer ? false : { opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
    >
      <Card>
        <div className="flex items-center gap-4">
          <span className="relative inline-flex">
            <PopCheck done size={44} />
            <Confettis burst={burst} spread={1.6} />
          </span>
          <div>
            <h2 id="acces-titre" className="font-serif text-[28px] leading-[1.1]">
              {t.tout}
              <span className="accent-italic">{t.branche}</span>
            </h2>
            <p className="mt-1 text-[14px]" style={{ color: "var(--text-soft)" }}>
              {t.connectes(n)}
            </p>
          </div>
        </div>
        <ul className="mt-4 flex flex-wrap gap-2">
          {portails.map((p) => (
            <li
              key={p.id}
              className="rounded-full px-3 py-1 text-[12px]"
              style={{ background: "var(--sage-light)", color: "var(--text-soft)" }}
            >
              ✓ {p.label}
            </li>
          ))}
        </ul>
        <div className="mt-3">
          <TextButton onClick={onAjouter}>{t.ajouter}</TextButton>
        </div>
      </Card>
    </motion.div>
  );
}
