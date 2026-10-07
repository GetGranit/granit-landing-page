import { useEffect, useMemo, useRef, useState } from "react";

import type { PecCase, PecPlatform } from "@/lib/pec/essaiState";
import { PortalForm, buildFields, fieldsEnd } from "./PortalForm";
import { Kicker, PopCheck, Progress, TextButton, Title } from "./ui";

type Props = {
  pecCase: PecCase;
  platform: PecPlatform;
  /** Fin de la simulation (≈ 30 s). */
  onEnd: () => void;
};

const FORM_START = 10.5;

export function formatClock(s: number): string {
  const m = Math.floor(s / 60);
  const r = Math.floor(s % 60);
  return `${String(m).padStart(2, "0")}:${String(r).padStart(2, "0")}`;
}

/**
 * E5 « Simulation en cours ». Accélérée (~30 s) : la vraie prend 2-3 min.
 * Rien n'est envoyé au portail.
 */
export function SimulationStep({ pecCase, platform, onEnd }: Props) {
  const fields = useMemo(() => buildFields(pecCase, FORM_START), [pecCase]);
  const formDone = fieldsEnd(fields) + 1.5;
  const steps = useMemo(
    () => [
      { label: `Connexion au portail ${platform.label}`, at: 5 },
      { label: "Droits du patient", at: 10 },
      { label: "Formulaire rempli", at: formDone },
      { label: "Vérification des causes de refus", at: formDone + 8 },
    ],
    [platform.label, formDone],
  );
  const total = steps[steps.length - 1].at + 1.2;

  const [elapsed, setElapsed] = useState(0);
  const ended = useRef(false);
  const onEndRef = useRef(onEnd);
  onEndRef.current = onEnd;

  useEffect(() => {
    const t0 = performance.now();
    const id = window.setInterval(() => {
      const s = (performance.now() - t0) / 1000;
      setElapsed(s);
      if (s >= total && !ended.current) {
        ended.current = true;
        window.clearInterval(id);
        onEndRef.current();
      }
    }, 100);
    return () => window.clearInterval(id);
  }, [total]);

  const current = steps.findIndex((s) => elapsed < s.at);

  return (
    <div>
      <Progress current={5} />
      <div className="mb-4 flex items-center justify-between">
        <Kicker>Simulation en cours</Kicker>
        <span
          className="num-tabular rounded-full px-3 py-1 text-[15px]"
          style={{ fontFamily: "var(--font-mono)", background: "var(--bg2)" }}
          aria-label="Temps écoulé"
        >
          {formatClock(elapsed)}
        </span>
      </div>
      <Title lead="Granit prépare la PEC sur" accent={platform.label} />

      <ol className="mt-6 space-y-3" aria-live="polite">
        {steps.map((s, i) => {
          const done = elapsed >= s.at;
          const active = i === current;
          return (
            <li key={s.label} className="flex items-center gap-3 text-[15px]">
              <PopCheck done={done} />
              <span
                style={{
                  color: done ? "var(--text)" : active ? "var(--text-soft)" : "var(--text-muted)",
                  fontWeight: active ? 600 : 400,
                }}
              >
                {s.label}
                {active && <span style={{ color: "var(--text-muted)" }}>…</span>}
              </span>
            </li>
          );
        })}
      </ol>

      <div className="mt-6">
        <PortalForm fields={fields} elapsed={elapsed} portal={platform.label} />
      </div>

      <p className="mt-4 text-center text-[12px]" style={{ color: "var(--text-muted)" }}>
        Ici c'est accéléré. En vrai, comptez 2-3 min : on vous prévient par SMS.
      </p>
      <div className="mt-3 text-center">
        <TextButton
          onClick={() => {
            if (ended.current) return;
            ended.current = true;
            onEnd();
          }}
        >
          Voir le résultat
        </TextButton>
      </div>
    </div>
  );
}
