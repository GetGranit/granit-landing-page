import { useState } from "react";

import { useLanguage } from "@/lib/i18n";
import { LOGICIELS, logicielLabel } from "@/lib/pec/essaiState";
import { ApercuBadge, Card, PopCheck, TextButton } from "./ui";
import { useIdleWhile } from "./useIdle";

type Props = {
  logiciel: string | null;
  onLogiciel: (l: string) => void;
  onIdle: () => void;
};

/** Seul logiciel où les PEC partent déjà des dossiers ; les autres arrivent. */
const BRANCHABLE = "Cosium";

const copy = {
  fr: {
    titre: "Logiciel métier · facultatif",
    branchable:
      "Vos PEC partiront de vos dossiers · en cours de branchement, on vous prévient par e-mail",
    bientot: "Bientôt — Paul vous dit ce qui est possible avec votre logiciel",
    groupe: "Votre logiciel",
    avec: (l: string) =>
      `Avec ${l}, vos PEC partent de vos dossiers. Les autres logiciels : bientôt.`,
    choisir: "Choisir",
  },
  en: {
    titre: "Practice management software · optional",
    branchable:
      "Your coverage requests will go out from your patient files · connection in progress, we will let you know by email",
    bientot: "Coming soon: Paul tells you what is possible with your software",
    groupe: "Your software",
    avec: (l: string) =>
      `With ${l}, your coverage requests go out from your patient files. Other software: coming soon.`,
    choisir: "Choose",
  },
};

/** Logiciel métier : bloc secondaire, optionnel et asynchrone. */
export function Logiciel({ logiciel, onLogiciel, onIdle }: Props) {
  const { lang } = useLanguage();
  const t = copy[lang];
  const [pick, setPick] = useState(false);
  useIdleWhile(pick, onIdle);

  return (
    <Card className="mt-4">
      <div className="mb-1 flex items-center justify-between gap-3">
        <p id="logiciel-titre" className="eyebrow" style={{ color: "var(--text-muted)" }}>
          {t.titre}
        </p>
        {logiciel && <ApercuBadge />}
      </div>
      {logiciel ? (
        <div className="flex items-start gap-3 py-2">
          <PopCheck done size={20} />
          <div>
            <p className="text-[15px]">{logicielLabel(logiciel, lang)}</p>
            {/* TODO(CTO) : connecteur logiciel métier */}
            <p className="text-[13px]" style={{ color: "var(--text-soft)" }}>
              {logiciel === BRANCHABLE ? t.branchable : t.bientot}
            </p>
          </div>
        </div>
      ) : pick ? (
        <div className="mt-2 flex flex-wrap gap-2" role="radiogroup" aria-label={t.groupe}>
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
              {logicielLabel(l, lang)}
            </button>
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-between gap-3 py-2">
          <p className="text-[14px] leading-[1.45]" style={{ color: "var(--text-soft)" }}>
            {t.avec(BRANCHABLE)}
          </p>
          <TextButton onClick={() => setPick(true)}>{t.choisir}</TextButton>
        </div>
      )}
    </Card>
  );
}
