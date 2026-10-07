import { useState } from "react";

import { LOGICIELS } from "@/lib/pec/essaiState";
import { ApercuBadge, Card, PopCheck, TextButton } from "./ui";
import { useIdleWhile } from "./useIdle";

type Props = {
  logiciel: string | null;
  onLogiciel: (l: string) => void;
  onIdle: () => void;
};

/** Logiciel métier : bloc secondaire, optionnel et asynchrone. */
export function Logiciel({ logiciel, onLogiciel, onIdle }: Props) {
  const [pick, setPick] = useState(false);
  useIdleWhile(pick, onIdle);

  return (
    <Card className="mt-4">
      <div className="mb-1 flex items-center justify-between gap-3">
        <p id="logiciel-titre" className="eyebrow" style={{ color: "var(--text-muted)" }}>
          Logiciel métier · facultatif
        </p>
        {logiciel && <ApercuBadge />}
      </div>
      {logiciel ? (
        <div className="flex items-start gap-3 py-2">
          <PopCheck done size={20} />
          <div>
            <p className="text-[15px]">{logiciel}</p>
            {/* TODO(CTO) : connecteur logiciel métier */}
            <p className="text-[13px]" style={{ color: "var(--text-soft)" }}>
              En cours de branchement · on vous prévient par e-mail
            </p>
          </div>
        </div>
      ) : pick ? (
        <div className="mt-2 flex flex-wrap gap-2" role="radiogroup" aria-label="Votre logiciel">
          {LOGICIELS.map((l) => (
            <button
              key={l}
              type="button"
              role="radio"
              aria-checked={false}
              onClick={() => {
                onLogiciel(l);
                setPick(false);
              }}
              className="rounded-full border bg-white px-4 py-2 text-[14px] transition-colors hover:border-[color:var(--terra)]"
              style={{ borderColor: "var(--border2)" }}
            >
              {l}
            </button>
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-between gap-3 py-2">
          <p className="text-[14px] leading-[1.45]" style={{ color: "var(--text-soft)" }}>
            Branchez votre logiciel pour que les PEC partent de vos dossiers.
          </p>
          <TextButton onClick={() => setPick(true)}>Choisir</TextButton>
        </div>
      )}
    </Card>
  );
}
