import { useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";

import {
  DUREE_REELLE_S,
  MONTANTS,
  euros,
  type PecCase,
  type PecPlatform,
} from "@/lib/pec/essaiState";
import { PortalForm, buildFields } from "./PortalForm";
import { Card, Kicker, PopCheck, TextButton, Title } from "./ui";

type Props = {
  pecCase: PecCase;
  platform: PecPlatform;
  echec: boolean;
  onSendForReal: () => void;
  onNext: () => void;
};

function duree(s: number): string {
  return `${Math.floor(s / 60)} min ${String(s % 60).padStart(2, "0")}`;
}

/** E5-fin (PEC prête) et E5-échec (le portail résiste). */
export function ResultStep({ pecCase, platform, echec, onSendForReal, onNext }: Props) {
  const reduce = useReducedMotion();
  const fields = useMemo(() => buildFields(pecCase), [pecCase]);
  const manuel = pecCase.minutesManuelles ?? 12;

  if (echec) {
    return (
      <div>
        <span
          aria-hidden
          className="mb-5 flex h-12 w-12 items-center justify-center rounded-full"
          style={{ background: "var(--bg3)", color: "var(--text-soft)" }}
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <circle cx="12" cy="12" r="9" />
            <path d="M12 7v5l3 2" />
          </svg>
        </span>
        <Kicker>Simulation interrompue</Kicker>
        <Title lead="Ce portail nous résiste" accent="aujourd'hui." />
        <p className="mt-4 text-[16px] leading-[1.5]" style={{ color: "var(--text-soft)" }}>
          Paul reprend votre dossier et vous rappelle avant ce soir. Rien n'a été envoyé, et votre
          PEC reste prête :
        </p>
        <div className="mt-5">
          <PortalForm fields={fields} elapsed={Infinity} portal={platform.label} />
        </div>
        <div className="mt-6 text-center">
          <a
            href="/pec"
            className="text-[14px] underline-offset-4 hover:underline"
            style={{ color: "var(--terra)" }}
          >
            En faire une autre
          </a>
        </div>
      </div>
    );
  }

  return (
    <div>
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3 rounded-[22px] border p-4"
        style={{
          background: "var(--sage-light)",
          borderColor: "color-mix(in oklab, var(--sage) 35%, transparent)",
        }}
      >
        <PopCheck done size={28} />
        <p className="text-[16px]" style={{ fontWeight: 600 }}>
          PEC prête{" "}
          <span style={{ fontWeight: 400, color: "var(--text-soft)" }}>· rien n'a été envoyé</span>
        </p>
      </motion.div>

      <div className="mt-7">
        <Kicker>Une vraie PEC sur {platform.label}</Kicker>
        <p
          className="num-tabular text-[44px] leading-none"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          {duree(DUREE_REELLE_S)}
        </p>
        <p className="mt-2 text-[15px]" style={{ color: "var(--text-soft)" }}>
          au lieu de <span className="accent-italic font-serif text-[18px]">~{manuel} min</span> à
          la main
        </p>
      </div>

      <Card className="mt-6">
        <dl className="space-y-2.5 text-[15px]">
          <Row label="Monture + 2 verres progressifs" value={euros(MONTANTS.total)} />
          <Row label="Sécurité sociale" value={euros(MONTANTS.secu)} muted />
          <Row
            label={`Part ${pecCase.mutuelle ?? "mutuelle"}`}
            value={euros(MONTANTS.mutuelle)}
            strong
          />
          <div className="border-t pt-2.5" style={{ borderColor: "var(--border)" }}>
            <Row label="Reste à charge patient" value={euros(MONTANTS.resteACharge)} strong />
          </div>
        </dl>
        <p
          className="mt-3 text-[11px]"
          style={{ color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}
        >
          Montants d'exemple pour l'aperçu
        </p>
      </Card>

      <button
        type="button"
        onClick={onSendForReal}
        className="btn-primary mt-6 w-full justify-center py-3.5 text-[16px]"
      >
        L'envoyer pour de vrai <span className="arrow">→</span>
      </button>
      <div className="mt-4 flex items-center justify-center gap-5">
        <a
          href="/pec"
          className="text-[14px] underline-offset-4 hover:underline"
          style={{ color: "var(--terra)" }}
        >
          En faire une autre
        </a>
        <TextButton onClick={onNext}>Que les PEC partent toutes seules</TextButton>
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  strong,
  muted,
}: {
  label: string;
  value: string;
  strong?: boolean;
  muted?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <dt style={{ color: muted ? "var(--text-muted)" : "var(--text-soft)" }}>{label}</dt>
      <dd
        className="num-tabular"
        style={{ fontFamily: "var(--font-mono)", fontWeight: strong ? 600 : 400 }}
      >
        {value}
      </dd>
    </div>
  );
}
