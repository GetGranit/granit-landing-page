import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";

import { useLanguage } from "@/lib/i18n";
import { Card, Kicker, Reassure, TextButton } from "./ui";
import { MINUTES_PAR_DEFAUT, QUOTA, QUOTA_RAPPEL, enHeures, tempsGagne } from "./quotaStore";

const copy = {
  fr: {
    vos: "Vos simulations offertes",
    progress: (n: number, q: number) => `${n} simulations faites sur ${q} offertes`,
    reste: (r: number) =>
      `Il vous reste ${r > 1 ? `${r} simulations offertes` : "1 simulation offerte"}. `,
    ensuite: "Ensuite, Paul vous propose l'offre adaptée à votre magasin. ",
    parler: "En parler maintenant",
    faitTitre: (q: number) => `Vous avez fait vos ${q} simulations `,
    offertes: "offertes.",
    faites: "Simulations faites",
    gagne: "Temps gagné, estimé",
    base: (m: number) => `Sur la base de ~${m} min par PEC faite à la main.`,
    restent: "Vos portails restent branchés. Paul vous propose l'offre adaptée à votre magasin.",
    continuer: "Continuer avec Granit",
    rappele: "Je préfère être rappelé",
    sansCarte: "Aucune carte bancaire demandée pour l'essai",
    consultables: "Vos demandes restent consultables ici",
    etape: "Étape 2 · vos PEC",
    nSimulations: (q: number) => `${q} simulations `,
    faire: "Faire une demande de PEC",
    indiquez: "Indiquez d'abord vos portails, juste au-dessus.",
    dernier: "Connectez d'abord votre dernier portail : vos PEC partiront de là.",
    restants: (n: number) =>
      `Connectez d'abord vos ${n} portails cochés : vos PEC partiront de là.`,
  },
  en: {
    vos: "Your free simulations",
    progress: (n: number, q: number) => `${n} of ${q} free simulations done`,
    reste: (r: number) =>
      `You have ${r > 1 ? `${r} free simulations` : "1 free simulation"} left. `,
    ensuite: "After that, Paul suggests the right plan for your store. ",
    parler: "Talk about it now",
    faitTitre: (q: number) => `You have used your ${q} `,
    offertes: "free simulations.",
    faites: "Simulations done",
    gagne: "Time saved, estimated",
    base: (m: number) => `Based on ~${m} min per coverage request done by hand.`,
    restent: "Your portals stay connected. Paul suggests the right plan for your store.",
    continuer: "Continue with Granit",
    rappele: "I’d rather get a callback",
    sansCarte: "No credit card required for the trial",
    consultables: "Your requests stay available here",
    etape: "Step 2 · your coverage requests",
    nSimulations: (q: number) => `${q} `,
    faire: "Submit a coverage request",
    indiquez: "First select your portals, just above.",
    dernier: "First connect your last portal: your coverage requests will go out from there.",
    restants: (n: number) =>
      `First connect your ${n} selected portals: your coverage requests will go out from there.`,
  },
};

/** « 3 / 20 simulations offertes » : une case par PEC, remplie à chaque demande. */
export function Compteur({ n }: { n: number }) {
  const reduce = useReducedMotion();
  const t = copy[useLanguage().lang];
  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between gap-3 text-[13px]">
        <span style={{ color: "var(--text-soft)" }}>{t.vos}</span>
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
        aria-label={t.progress(n, QUOTA)}
      >
        {Array.from({ length: QUOTA }, (_, i) => (
          <motion.span
            key={i}
            className="h-2 rounded-full"
            initial={false}
            animate={{ background: i < n ? "var(--succes)" : "var(--filet)" }}
            transition={reduce ? { duration: 0 } : { duration: 0.3 }}
          />
        ))}
      </div>
    </div>
  );
}

/** À partir de 15 : on dit simplement combien il en reste. */
export function RappelDoux({ n, onPaul }: { n: number; onPaul: () => void }) {
  const t = copy[useLanguage().lang];
  if (n < QUOTA_RAPPEL || n >= QUOTA) return null;
  const reste = QUOTA - n;
  return (
    <p className="mt-3 text-[13px] leading-[1.45]" style={{ color: "var(--text-soft)" }}>
      {t.reste(reste)}
      {t.ensuite}
      <TextButton onClick={onPaul}>{t.parler}</TextButton>
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
  const { lang } = useLanguage();
  const t = copy[lang];
  const gagne = tempsGagne(n, minutesManuelles, dureeSec);
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <Card>
        <Kicker>{t.vos}</Kicker>
        <h2 className="font-serif text-[28px] leading-[1.15]">
          {t.faitTitre(QUOTA)}
          <span className="accent-italic">{t.offertes}</span>
        </h2>
        <dl className="mt-5 grid grid-cols-2 gap-3">
          <Chiffre label={t.faites} value={String(n)} />
          <Chiffre label={t.gagne} value={`≈ ${enHeures(gagne, lang)}`} />
        </dl>
        <p className="mt-2 text-[12px]" style={{ color: "var(--text-muted)" }}>
          {t.base(minutesManuelles ?? MINUTES_PAR_DEFAUT)}
        </p>
        <p className="mt-4 text-[15px] leading-[1.5]" style={{ color: "var(--text-soft)" }}>
          {t.restent}
        </p>
        <button
          type="button"
          onClick={onContinuer}
          className="btn-primary mt-5 w-full justify-center py-3.5 text-[16px]"
        >
          {t.continuer} <span className="arrow">→</span>
        </button>
        <div className="mt-3 text-center">
          <TextButton onClick={onRappel}>{t.rappele}</TextButton>
        </div>
        <ul className="mt-4 space-y-1.5">
          <Reassure>{t.sansCarte}</Reassure>
          <Reassure>{t.consultables}</Reassure>
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
  const t = copy[useLanguage().lang];
  return (
    <section id="pec" aria-labelledby="pec-titre" className="mt-10 scroll-mt-6">
      <Kicker>{t.etape}</Kicker>
      <h2 id="pec-titre" className="mb-4 font-serif text-[28px] leading-[1.15]">
        {t.nSimulations(QUOTA)}
        <span className="accent-italic">{t.offertes}</span>
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
            {t.faire} <span className="arrow">→</span>
          </motion.button>
          {!toutBranche && (
            <p className="mt-2 text-center text-[13px]" style={{ color: "var(--text-muted)" }}>
              {!choixFait ? t.indiquez : restants === 1 ? t.dernier : t.restants(restants)}
            </p>
          )}
          <RappelDoux n={faites} onPaul={() => onPaul("creneau")} />
        </>
      )}
      {props.children}
    </section>
  );
}
