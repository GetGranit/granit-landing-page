import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";

import { Card, Kicker, Reassure, TextButton } from "./ui";
import { MINUTES_PAR_DEFAUT, QUOTA, QUOTA_RAPPEL, enHeures, tempsGagne } from "./quotaStore";

/** « 3 / 20 PEC offertes » : une case par PEC, remplie à chaque demande. */
export function Compteur({ n }: { n: number }) {
  const reduce = useReducedMotion();
  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between gap-3 text-[13px]">
        <span style={{ color: "var(--text-soft)" }}>Vos PEC offertes</span>
        <span
          className="num-tabular"
          style={{ fontFamily: "var(--font-mono)", fontWeight: 600 }}
          aria-live="polite"
        >
          {n} / {QUOTA}
        </span>
      </div>
      <div
        className="grid gap-[3px]"
        style={{ gridTemplateColumns: `repeat(${QUOTA}, minmax(0, 1fr))` }}
        role="progressbar"
        aria-valuenow={n}
        aria-valuemin={0}
        aria-valuemax={QUOTA}
        aria-label={`${n} PEC faites sur ${QUOTA} offertes`}
      >
        {Array.from({ length: QUOTA }, (_, i) => (
          <motion.span
            key={i}
            className="h-2 rounded-full"
            initial={false}
            animate={{ background: i < n ? "var(--sage)" : "var(--bg3)" }}
            transition={reduce ? { duration: 0 } : { duration: 0.3 }}
          />
        ))}
      </div>
    </div>
  );
}

/** À partir de 15 : on dit simplement combien il en reste. */
export function RappelDoux({ n, onPaul }: { n: number; onPaul: () => void }) {
  if (n < QUOTA_RAPPEL || n >= QUOTA) return null;
  const reste = QUOTA - n;
  return (
    <p className="mt-3 text-[13px] leading-[1.45]" style={{ color: "var(--text-soft)" }}>
      Il vous reste {reste} PEC offerte{reste > 1 ? "s" : ""}. Ensuite, Paul vous propose l'offre
      adaptée à votre magasin. <TextButton onClick={onPaul}>En parler maintenant</TextButton>
    </p>
  );
}

type UpsellProps = {
  n: number;
  minutesManuelles?: number;
  dureeSec: number;
  onContinuer: () => void;
  onRappel: () => void;
};

/** 20 / 20 : bilan chiffré et suite avec Paul. Aucun prix ici. */
export function Upsell({ n, minutesManuelles, dureeSec, onContinuer, onRappel }: UpsellProps) {
  const reduce = useReducedMotion();
  const gagne = tempsGagne(n, minutesManuelles, dureeSec);
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <Card>
        <Kicker>Vos PEC offertes</Kicker>
        <h2 className="font-serif text-[28px] leading-[1.15]">
          Vous avez fait vos {QUOTA} PEC <span className="accent-italic">offertes.</span>
        </h2>
        <dl className="mt-5 grid grid-cols-2 gap-3">
          <Chiffre label="PEC faites avec Granit" value={String(n)} />
          <Chiffre label="Temps gagné, estimé" value={`≈ ${enHeures(gagne)}`} />
        </dl>
        <p className="mt-2 text-[12px]" style={{ color: "var(--text-muted)" }}>
          Sur la base de ~{minutesManuelles ?? MINUTES_PAR_DEFAUT} min par PEC faite à la main.
        </p>
        <p className="mt-4 text-[15px] leading-[1.5]" style={{ color: "var(--text-soft)" }}>
          Vos portails restent branchés. Paul vous propose l'offre adaptée à votre magasin.
        </p>
        <button
          type="button"
          onClick={onContinuer}
          className="btn-primary mt-5 w-full justify-center py-3.5 text-[16px]"
        >
          Continuer avec Granit <span className="arrow">→</span>
        </button>
        <div className="mt-3 text-center">
          <TextButton onClick={onRappel}>Je préfère être rappelé</TextButton>
        </div>
        <ul className="mt-4 space-y-1.5">
          <Reassure>Aucune carte bancaire demandée pour l'essai</Reassure>
          <Reassure>Vos demandes restent consultables ici</Reassure>
        </ul>
      </Card>
    </motion.div>
  );
}

function Chiffre({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[14px] p-3" style={{ background: "var(--bg2)" }}>
      <dt className="text-[12px]" style={{ color: "var(--text-muted)" }}>
        {label}
      </dt>
      <dd
        className="num-tabular mt-1 text-[24px] leading-none"
        style={{ fontFamily: "var(--font-mono)" }}
      >
        {value}
      </dd>
    </div>
  );
}

type EtapeProps = {
  faites: number;
  toutBranche: boolean;
  choixFait: boolean;
  restants: number;
  minutesManuelles?: number;
  dureeSec: number;
  onDemande: () => void;
  onPaul: (mode: "creneau" | "rappel") => void;
  children?: ReactNode;
};

/**
 * Étape 2 : le compteur, puis « Faire une demande de PEC » (grisé avec le
 * pourquoi tant que les portails cochés ne sont pas tous connectés), ou le
 * bilan une fois les 20 PEC faites.
 */
export function EtapePec(props: EtapeProps) {
  const { faites, toutBranche, choixFait, restants, onPaul } = props;
  const reduce = useReducedMotion();
  return (
    <section id="pec" aria-labelledby="pec-titre" className="mt-10 scroll-mt-6">
      <Kicker>Étape 2 · vos PEC</Kicker>
      <h2 id="pec-titre" className="mb-4 font-serif text-[28px] leading-[1.15]">
        {QUOTA} PEC <span className="accent-italic">offertes.</span>
      </h2>
      <Compteur n={faites} />
      {faites >= QUOTA ? (
        <div className="mt-5">
          <Upsell
            n={faites}
            minutesManuelles={props.minutesManuelles}
            dureeSec={props.dureeSec}
            onContinuer={() => onPaul("creneau")}
            onRappel={() => onPaul("rappel")}
          />
        </div>
      ) : (
        <>
          <motion.button
            key={toutBranche ? "ouvert" : "ferme"}
            type="button"
            disabled={!toutBranche}
            onClick={props.onDemande}
            initial={toutBranche && !reduce ? { scale: 0.94 } : false}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 380, damping: 14 }}
            className="btn-primary mt-5 w-full justify-center py-3.5 text-[16px]"
            style={toutBranche ? undefined : { opacity: 0.45, cursor: "not-allowed" }}
          >
            Faire une demande de PEC <span className="arrow">→</span>
          </motion.button>
          {!toutBranche && (
            <p className="mt-2 text-center text-[13px]" style={{ color: "var(--text-muted)" }}>
              {!choixFait
                ? "Indiquez d'abord vos portails, juste au-dessus."
                : restants === 1
                  ? "Connectez d'abord votre dernier portail : vos PEC partiront de là."
                  : `Connectez d'abord vos ${restants} portails cochés : vos PEC partiront de là.`}
            </p>
          )}
          <RappelDoux n={faites} onPaul={() => onPaul("creneau")} />
        </>
      )}
      {props.children}
    </section>
  );
}
