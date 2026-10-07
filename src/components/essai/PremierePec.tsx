import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

import { duree, euros, type PecSimulation } from "@/lib/pec/essaiState";
import { ApercuBadge, Card, PopCheck, Row, TextButton } from "./ui";

type Props = {
  simulation: PecSimulation;
  portail: string | null;
  mutuelle: string | null;
  minutesManuelles?: number;
};

/**
 * La 1re PEC de l'opticien, celle simulée sur /pec, en version compacte :
 * l'essentiel sur une ligne, le détail à la demande. Rien n'est parti à la mutuelle.
 */
export function PremierePec({ simulation, portail, mutuelle, minutesManuelles }: Props) {
  const reduce = useReducedMotion();
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
                Votre 1re PEC
              </p>
              <p
                className="truncate text-[12px]"
                style={{ color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}
              >
                Simulée sur {portail ?? "le portail"}
                {s.numero ? ` · n° ${s.numero}` : ""}
              </p>
            </div>
          </div>
          {s.apercu && <ApercuBadge />}
        </div>

        <p className="mt-3 text-[14px] leading-[1.5]" style={{ color: "var(--text-soft)" }}>
          {s.dureeSec > 0 && (
            <>
              <span className="num-tabular" style={{ fontFamily: "var(--font-mono)" }}>
                {duree(s.dureeSec)}
              </span>
              {minutesManuelles ? ` au lieu de ~${minutesManuelles} min` : ""} ·{" "}
            </>
          )}
          Part {mutuelle ?? "mutuelle"}{" "}
          <span className="num-tabular" style={{ fontFamily: "var(--font-mono)", fontWeight: 600 }}>
            {euros(s.partMutuelle)}
          </span>
        </p>

        {detail && (
          <div className="mt-4 space-y-2.5 text-[15px]">
            <dl className="space-y-2.5">
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
                className="block overflow-hidden rounded-[12px] border"
                style={{ borderColor: "var(--border)" }}
              >
                <img
                  src={s.captureUrl}
                  alt={`Capture de la simulation sur ${portail ?? "le portail"}`}
                  className="max-h-[180px] w-full object-cover object-top"
                />
              </a>
            )}
            <p className="text-[12px]" style={{ color: "var(--text-muted)" }}>
              Rien n'a été envoyé à la mutuelle.
              {s.apercu ? " Montants d'exemple pour l'aperçu." : ""}
            </p>
          </div>
        )}
        <div className="mt-2">
          <TextButton onClick={() => setDetail((d) => !d)}>
            {detail ? "Masquer le détail" : "Voir le détail"}
          </TextButton>
        </div>
      </Card>
    </motion.div>
  );
}
