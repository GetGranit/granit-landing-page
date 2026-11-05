import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

import { useLanguage } from "@/lib/i18n";
import { duree, euros, type PecSimulation } from "@/lib/pec/essaiState";
import { ApercuBadge, Card, PopCheck, Row, TextButton } from "./ui";

const copy = {
  fr: {
    premiere: "Votre 1re simulation",
    simulee: (p: string | null) => `Simulée sur ${p ?? "le portail"}`,
    numero: (n: string) => ` · n° ${n}`,
    auLieuDe: (m: number) => ` au lieu de ~${m} min`,
    part: (m: string | null) => `Part ${m ?? "mutuelle"}`,
    total: "Total de l'équipement",
    secu: "Sécurité sociale",
    rac: "Reste à charge patient",
    capture: (p: string | null) => `Capture de la simulation sur ${p ?? "le portail"}`,
    rien: "Rien n'a été envoyé à la mutuelle.",
    exemple: " Montants d'exemple pour l'aperçu.",
    masquer: "Masquer le détail",
    voir: "Voir le détail",
  },
  en: {
    premiere: "Your 1st simulation",
    simulee: (p: string | null) => `Simulated on ${p ?? "the portal"}`,
    numero: (n: string) => ` · no. ${n}`,
    auLieuDe: (m: number) => ` instead of ~${m} min`,
    part: (m: string | null) => `${m ?? "Insurer"} share`,
    total: "Equipment total",
    secu: "National health insurance",
    rac: "Patient out-of-pocket amount",
    capture: (p: string | null) => `Screenshot of the simulation on ${p ?? "the portal"}`,
    rien: "Nothing was sent to the insurer.",
    exemple: " Sample amounts for the preview.",
    masquer: "Hide details",
    voir: "Show details",
  },
};

type Props = {
  simulation: PecSimulation;
  portail: string | null;
  mutuelle: string | null;
  minutesManuelles?: number;
};

/**
 * La 1re simulation de l'opticien, celle faite sur /pec, en version compacte :
 * l'essentiel sur une ligne, le détail à la demande. Rien n'est parti à la mutuelle.
 */
export function PremierePec({ simulation, portail, mutuelle, minutesManuelles }: Props) {
  const reduce = useReducedMotion();
  const { lang } = useLanguage();
  const t = copy[lang];
  const [detail, setDetail] = useState(false);
  const s = simulation;
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <Card>
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <PopCheck done size={24} />
            <div className="min-w-0">
              <p className="text-[15px]" style={{ fontWeight: 600 }}>
                {t.premiere}
              </p>
              <p
                className="truncate text-[12px]"
                style={{ color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}
              >
                {t.simulee(portail)}
                {s.numero ? t.numero(s.numero) : ""}
              </p>
            </div>
          </div>
          {s.apercu && <ApercuBadge />}
        </div>

        <p className="mt-3 text-[14px] leading-[1.5]" style={{ color: "var(--text-soft)" }}>
          {s.dureeSec > 0 && (
            <>
              <span className="num-tabular" style={{ fontFamily: "var(--font-mono)" }}>
                {duree(s.dureeSec, lang)}
              </span>
              {minutesManuelles ? t.auLieuDe(minutesManuelles) : ""} ·{" "}
            </>
          )}
          {t.part(mutuelle)}{" "}
          <span className="num-tabular" style={{ fontFamily: "var(--font-mono)", fontWeight: 600 }}>
            {euros(s.partMutuelle, lang)}
          </span>
        </p>

        {detail && (
          <div className="mt-4 space-y-2.5 text-[15px]">
            <dl className="space-y-2.5">
              <Row label={t.total} value={euros(s.total, lang)} />
              <Row label={t.secu} value={euros(s.partSecu, lang)} muted />
              <Row label={t.part(mutuelle)} value={euros(s.partMutuelle, lang)} strong />
              <div className="border-t pt-2.5" style={{ borderColor: "var(--border)" }}>
                <Row label={t.rac} value={euros(s.resteACharge, lang)} strong />
              </div>
            </dl>
            {s.captureUrl && (
              <a
                href={s.captureUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="ph-no-capture block overflow-hidden rounded-[12px] border"
                style={{ borderColor: "var(--border)" }}
              >
                <img
                  src={s.captureUrl}
                  alt={t.capture(portail)}
                  className="max-h-[180px] w-full object-cover object-top"
                />
              </a>
            )}
            <p className="text-[12px]" style={{ color: "var(--text-muted)" }}>
              {t.rien}
              {s.apercu ? t.exemple : ""}
            </p>
          </div>
        )}
        <div className="mt-2">
          <TextButton onClick={() => setDetail((d) => !d)}>
            {detail ? t.masquer : t.voir}
          </TextButton>
        </div>
      </Card>
    </motion.div>
  );
}
