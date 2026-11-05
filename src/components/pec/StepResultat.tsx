import { useEffect, useRef, useState } from "react";
import { animate, motion, useReducedMotion } from "framer-motion";

import { useLanguage } from "@/lib/i18n";
import { Invitation } from "./Invitation";
import { duree, type SimResultat } from "./StepSimFin";
import { Title, euros } from "./ui";

/**
 * Ordre de grandeur d'une PEC tapée à la main sur un portail (connexion,
 * recherche du patient, saisie de l'équipement). Non mesuré : affiché « ~12 min
 * (hypothèse) », et seulement en aperçu, face au chrono réel du mock.
 */
const MINUTES_A_LA_MAIN = 12;
/** Fin du count-up : l'invitation apparaît après. */
const COUNT_MS = 1100;

const copy = {
  fr: {
    total: "Total",
    secu: "Part Sécurité sociale",
    mutuelle: "Part mutuelle",
    rac: "Reste à charge",
    faite: "✓ Simulation faite — rien n'a été envoyé à la mutuelle",
    title: "Votre PEC ",
    after: " est chiffrée.",
    numero: "Simulation n°",
    auLieuDe: " au lieu de ",
    hypothese: (m: number) => `~${m} min (hypothèse)`,
    aLaMain: " à la main",
    barreMain: "À la main",
    minutes: (m: number) => `~${m} min`,
    capture: (portail: string) => `Capture du portail ${portail} après la simulation`,
  },
  en: {
    total: "Total",
    secu: "National health insurance share",
    mutuelle: "Insurer share",
    rac: "Out-of-pocket amount",
    faite: "✓ Simulation done: nothing was sent to the insurer",
    title: "Your ",
    after: " coverage request is priced.",
    numero: "Simulation no.",
    auLieuDe: " instead of ",
    hypothese: (m: number) => `~${m} min (estimate)`,
    aLaMain: " by hand",
    barreMain: "By hand",
    minutes: (m: number) => `~${m} min`,
    capture: (portail: string) => `Screenshot of the ${portail} portal after the simulation`,
  },
};

type Track = (e: string, p?: Record<string, unknown>) => void;

/** Montant qui « compte » de 0 jusqu'à sa valeur (valeur exacte d'emblée si mouvement réduit). */
function CountUp({ value, delay }: { value: number; delay: number }) {
  const reduce = useReducedMotion();
  const { lang } = useLanguage();
  const [v, setV] = useState(reduce ? value : 0);
  useEffect(() => {
    if (reduce) return setV(value);
    const c = animate(0, value, {
      duration: COUNT_MS / 1000,
      delay,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: setV,
    });
    // Filet : sans images (onglet en arrière-plan), la valeur exacte s'affiche quand même.
    const t = setTimeout(() => setV(value), (delay + COUNT_MS / 1000) * 1000 + 300);
    return () => {
      c.stop();
      clearTimeout(t);
    };
  }, [value, delay, reduce]);
  return <>{euros(v === value ? value : Math.round(v * 100) / 100, lang)}</>;
}

/**
 * E8 · le pic du parcours : la PEC est simulée, les montants se posent, le
 * temps réel face au temps à la main. Juste dessous, l'invitation à créer le
 * compte. On mesure la vue, le temps passé sur l'écran et les clics.
 */
export function StepSimDone({
  portail,
  platformId,
  r,
  apercu,
  track,
  onCreer,
}: {
  portail: string;
  platformId: string;
  r: SimResultat;
  /** Simulation factice (DEV, démo) : seul cas où l'on montre le chrono face aux ~12 min. */
  apercu: boolean;
  track: Track;
  onCreer: () => void;
}) {
  const reduce = useReducedMotion();
  const { lang } = useLanguage();
  const t = copy[lang];
  const vuA = useRef(0);
  const parti = useRef(false);
  const leave = useRef<(action: string) => void>(() => {});
  leave.current = (action) => {
    if (parti.current) return;
    parti.current = true;
    track("pec_resultat_quitte", {
      platform: platformId,
      action,
      secondes: Math.round((Date.now() - vuA.current) / 1000),
    });
  };

  useEffect(() => {
    vuA.current = Date.now();
    parti.current = false;
    track("pec_resultat_vu", { platform: platformId, dureeSec: r.dureeSec });
    const onHide = () => leave.current("fermeture");
    window.addEventListener("pagehide", onHide);
    return () => {
      window.removeEventListener("pagehide", onHide);
      leave.current("autre");
    };
    // Une seule vue par écran affiché.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const clic = (cible: string) => track("pec_resultat_clic", { platform: platformId, cible });
  const lignes: [string, number, boolean?][] = [
    [t.total, r.total],
    [t.secu, r.partSecu],
    [t.mutuelle, r.partMutuelle, true],
    [t.rac, r.resteACharge],
  ];
  const ratio = Math.min(1, r.dureeSec / (MINUTES_A_LA_MAIN * 60));

  return (
    <motion.section
      initial={reduce ? false : { opacity: 0, y: 14, scale: 0.985 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="grid justify-items-center gap-5 rounded-[22px] border p-6 text-center sm:p-9"
      style={{
        background: "var(--surface)",
        borderColor: "var(--border)",
        boxShadow: "var(--ombre-douce)",
      }}
      data-screen="sim-done"
    >
      <motion.span
        initial={reduce ? false : { opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 380, damping: 22, delay: 0.15 }}
        className="rounded-full px-3 py-1 text-[12px]"
        style={{
          background: "var(--succes-fond)",
          color: "var(--succes-texte)",
          fontFamily: "var(--font-mono)",
        }}
      >
        {t.faite}
      </motion.span>
      <Title em={portail} after={t.after}>
        {t.title}
      </Title>

      <dl
        className="grid w-full gap-2 rounded-xl border p-4 text-left text-[15px]"
        style={{ borderColor: "var(--border2)" }}
        aria-live="off"
      >
        {lignes.map(([k, v, fort], i) => (
          <div key={k} className="flex justify-between gap-3">
            <dt style={{ color: "var(--text-muted)" }}>{k}</dt>
            <dd
              style={{
                fontFamily: "var(--font-mono)",
                fontVariantNumeric: "tabular-nums",
                color: fort ? "var(--profond)" : "var(--text)",
                fontWeight: fort ? 600 : 400,
              }}
            >
              <CountUp value={v} delay={0.3 + i * 0.08} />
            </dd>
          </div>
        ))}
        {r.numero && (
          <p
            className="pt-1 text-[12px]"
            style={{ color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}
          >
            {t.numero} {r.numero}
          </p>
        )}
      </dl>

      {apercu && (
        <div className="grid w-full gap-2 text-left" id="pec-ancrage">
          <p className="text-[15px]" style={{ color: "var(--text)" }}>
            <strong style={{ fontFamily: "var(--font-mono)" }}>{duree(r.dureeSec, lang)}</strong>
            {t.auLieuDe}
            <span style={{ color: "var(--text-muted)" }}>{t.hypothese(MINUTES_A_LA_MAIN)}</span>
            {t.aLaMain}
          </p>
          <Barre
            label="Granit"
            texte={duree(r.dureeSec, lang)}
            ratio={ratio}
            couleur="var(--succes)"
          />
          <Barre
            label={t.barreMain}
            texte={t.minutes(MINUTES_A_LA_MAIN)}
            ratio={1}
            couleur="var(--filet)"
            lent
          />
        </div>
      )}

      {r.captureUrl && (
        <img
          src={r.captureUrl}
          alt={t.capture(portail)}
          className="ph-no-capture w-full rounded-xl border"
          style={{ borderColor: "var(--border2)" }}
        />
      )}

      <Invitation
        portail={portail}
        platformId={platformId}
        delay={reduce ? 0 : (COUNT_MS + 500) / 1000}
        onCreer={(apresPlusTard) => {
          clic(apresPlusTard ? "creer_compte_apres_plus_tard" : "creer_compte");
          leave.current("creer_compte");
          onCreer();
        }}
        onPlusTard={() => clic("plus_tard")}
      />
    </motion.section>
  );
}

/** Barre de temps : Granit se remplit vite, « à la main » prend son temps. */
function Barre({
  label,
  texte,
  ratio,
  couleur,
  lent,
}: {
  label: string;
  texte: string;
  ratio: number;
  couleur: string;
  lent?: boolean;
}) {
  const reduce = useReducedMotion();
  return (
    <div className="grid grid-cols-[84px_1fr_64px] items-center gap-2 text-[13px]">
      <span style={{ color: "var(--text-muted)" }}>{label}</span>
      <div className="h-2.5 overflow-hidden rounded-full" style={{ background: "var(--bg2)" }}>
        <motion.div
          className="h-full rounded-full"
          style={{ background: couleur, border: lent ? "1px solid var(--border2)" : undefined }}
          initial={reduce ? false : { width: 0 }}
          animate={{ width: `${Math.max(3, Math.round(ratio * 100))}%` }}
          transition={{ duration: lent ? 1.4 : 0.5, delay: 0.4, ease: "easeOut" }}
        />
      </div>
      <span className="text-right" style={{ fontFamily: "var(--font-mono)", color: "var(--text)" }}>
        {texte}
      </span>
    </div>
  );
}
