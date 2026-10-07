import { motion, useReducedMotion } from "framer-motion";

import { duree, euros, type PecSimulation } from "@/lib/pec/essaiState";
import { ApercuBadge, Card, PopCheck, Row } from "./ui";

type Props = {
  simulation: PecSimulation;
  portail: string | null;
  mutuelle: string | null;
  minutesManuelles?: number;
};

/**
 * La 1re PEC de l'opticien, celle simulée sur /pec : elle est déjà rangée
 * dans « son » espace. Rien n'est parti à la mutuelle.
 */
export function PremierePec({ simulation, portail, mutuelle, minutesManuelles }: Props) {
  const reduce = useReducedMotion();
  const s = simulation;
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <Card>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <PopCheck done size={26} />
            <div>
              <p className="text-[16px]" style={{ fontWeight: 600 }}>
                Votre 1re PEC
              </p>
              <p
                className="text-[12px]"
                style={{ color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}
              >
                Simulée sur {portail ?? "le portail"}
                {s.numero ? ` · n° ${s.numero}` : ""}
              </p>
            </div>
          </div>
          {s.apercu && <ApercuBadge />}
        </div>

        {s.dureeSec > 0 && (
          <div className="mt-5 flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <span
              className="num-tabular text-[38px] leading-none"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              {duree(s.dureeSec)}
            </span>
            {minutesManuelles ? (
              <span className="text-[14px]" style={{ color: "var(--text-soft)" }}>
                au lieu de{" "}
                <span className="accent-italic font-serif text-[17px]">
                  ~{minutesManuelles} min
                </span>{" "}
                à la main
              </span>
            ) : null}
          </div>
        )}

        <dl className="mt-5 space-y-2.5 text-[15px]">
          <Row label="Total de l'équipement" value={euros(s.total)} />
          <Row label="Sécurité sociale" value={euros(s.partSecu)} muted />
          <Row label={`Part ${mutuelle ?? "mutuelle"}`} value={euros(s.partMutuelle)} strong />
          <div className="border-t pt-2.5" style={{ borderColor: "var(--border)" }}>
            <Row label="Reste à charge patient" value={euros(s.resteACharge)} strong />
          </div>
        </dl>

        {s.captureUrl && (
          <a
            href={s.captureUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 block overflow-hidden rounded-[12px] border"
            style={{ borderColor: "var(--border)" }}
          >
            <img
              src={s.captureUrl}
              alt={`Capture de la simulation sur ${portail ?? "le portail"}`}
              className="max-h-[180px] w-full object-cover object-top"
            />
          </a>
        )}

        <p
          className="mt-4 rounded-[12px] px-3 py-2 text-[13px]"
          style={{ background: "var(--sage-light)", color: "var(--text-soft)" }}
        >
          Rien n'a été envoyé à la mutuelle.
          {s.apercu ? " Montants d'exemple pour l'aperçu." : ""}
        </p>
      </Card>
    </motion.div>
  );
}
