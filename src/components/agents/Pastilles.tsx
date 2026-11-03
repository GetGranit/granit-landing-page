import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState, useSyncExternalStore, type CSSProperties } from "react";
import { mouvementReduit } from "@/lib/motion";

// Les pastilles d'agent, en verre léger sur la photo : un arc tourne pendant que l'agent travaille,
// puis la coche menthe (motif du hero de la landing de référence).
//
// Hydratation (erreur React 418 de /affiliation) : le rendu serveur et le premier rendu client sont
// identiques. La préférence « animations réduites » est lue dans un effet, jamais pendant le rendu :
// elle change le point d'arrivée, pas les éléments affichés.

const abonner = () => () => {};
/** Faux au rendu serveur et pendant l'hydratation, vrai ensuite. */
export function useHydrate() {
  return useSyncExternalStore(abonner, () => true, () => false);
}

const EASE = [0.22, 1, 0.36, 1] as const;
const VERRE = {
  background: "rgba(31, 53, 48, 0.46)",
  borderColor: "rgba(250, 240, 242, 0.18)",
  color: "var(--rose)",
} as const;

type Etat = "attente" | "cours" | "fait";

function Rond({ etat }: { etat: Etat }) {
  return (
    <span
      className="relative grid size-[18px] flex-none place-items-center rounded-full transition-colors duration-300"
      style={{
        background: etat === "fait" ? "var(--menthe)" : "transparent",
        boxShadow: etat === "fait" ? "none" : "inset 0 0 0 1.5px rgba(250, 240, 242, 0.26)",
      }}
    >
      <span
        className="absolute inset-0 animate-spin rounded-full border-[1.5px] border-transparent transition-opacity duration-200"
        style={{ borderTopColor: "var(--menthe)", opacity: etat === "cours" ? 1 : 0, animationDuration: "0.8s" }}
      />
      <svg
        viewBox="0 0 12 12"
        className="size-[10px] transition-[opacity,transform] duration-300"
        style={{ opacity: etat === "fait" ? 1 : 0, transform: etat === "fait" ? "scale(1)" : "scale(0.3)" }}
        aria-hidden
      >
        <path d="M2.5 6.2l2.3 2.3 4.7-5" fill="none" stroke="var(--encre)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

export function Pastille({ enCours, fait, detail, etat }: { enCours: string; fait: string; detail?: string; etat: Etat }) {
  return (
    <div
      className="flex max-w-full items-center gap-3 rounded-[16px] border py-2.5 pr-4 pl-3 backdrop-blur-md transition-opacity duration-300"
      style={{ ...VERRE, opacity: etat === "attente" ? 0.62 : 1 }}
    >
      <Rond etat={etat} />
      <span className="grid min-w-0 gap-px">
        <span className="grid text-[14px] leading-[1.3] font-medium">
          <span
            className="col-start-1 row-start-1 truncate transition-[opacity,transform] duration-300"
            style={{ color: "var(--sur-encre-secondaire)", opacity: etat === "fait" ? 0 : 1, transform: etat === "fait" ? "translateY(-5px)" : "none" }}
          >
            {enCours}
          </span>
          <span
            className="col-start-1 row-start-1 truncate transition-[opacity,transform] duration-300"
            style={{ opacity: etat === "fait" ? 1 : 0, transform: etat === "fait" ? "none" : "translateY(5px)" }}
          >
            {fait}
          </span>
        </span>
        {detail && (
          <span className="truncate text-[12.5px] leading-[1.3]" style={{ color: "var(--sur-encre-secondaire)" }}>
            {detail}
          </span>
        )}
      </span>
    </div>
  );
}

export type EtapePastille = { enCours: string; fait: string; detail?: string; place: string };

/**
 * Hero : les pastilles se posent l'une après l'autre, se cochent et s'effacent ; la dernière reste.
 * Une seule fois, et seulement quand la photo est à l'écran. Animations réduites : la dernière, cochée.
 */
export function SequenceHero({ etapes }: { etapes: EtapePastille[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const visible = useInView(ref, { amount: 0.3 });
  const fin = 3 * (etapes.length - 1) + 2;
  const [pas, setPas] = useState(-1);

  useEffect(() => {
    if (mouvementReduit()) {
      setPas(fin);
      return;
    }
    if (!visible || pas >= fin) return;
    const t = setTimeout(() => setPas((p) => p + 1), pas < 0 ? 600 : 750);
    return () => clearTimeout(t);
  }, [visible, pas, fin]);

  return (
    <div ref={ref} className="pointer-events-none absolute inset-0" aria-hidden>
      {etapes.map((e, k) => {
        const derniere = k === etapes.length - 1;
        const montre = pas >= 3 * k && (derniere || pas < 3 * k + 4);
        const etat: Etat = pas >= 3 * k + 2 ? "fait" : "cours";
        return (
          <motion.div
            key={e.fait}
            className="absolute top-[var(--tm)] left-4 max-w-[calc(100%-32px)] md:top-[var(--t)] md:left-[var(--l)]"
            style={placeStyle(e.place, k)}
            initial={false}
            animate={montre ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: pas >= 3 * k + 4 ? -8 : 10, scale: 0.97 }}
            transition={{ duration: 0.7, ease: EASE }}
          >
            <Pastille enCours={e.enCours} fait={e.fait} detail={e.detail} etat={etat} />
          </motion.div>
        );
      })}
    </div>
  );
}

/** « gauche haut » sur ordinateur : « 8% 62% » → left 8 %, top 62 %. Sur mobile, à gauche, une
 * hauteur sur deux pour que deux pastilles qui se croisent ne se couvrent pas. */
function placeStyle(place: string, k: number) {
  const [l, t] = place.split(" ");
  return { "--l": l, "--t": t, "--tm": k % 2 ? "56%" : "34%" } as CSSProperties;
}

/**
 * Panneau d'un métier : les tâches de ses agents, en pile, se cochent dans l'ordre quand la photo
 * arrive à l'écran. Rendu serveur (lien direct vers un métier) : tout est déjà coché.
 */
export function SequenceMetier({ etapes }: { etapes: { enCours: string; fait: string }[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const visible = useInView(ref, { amount: 0.4, once: true });
  const hydrate = useHydrate();
  const n = etapes.length;
  // Monté après l'hydratation (clic sur un métier) : on part du début ; sinon tout est posé.
  const [pas, setPas] = useState(() => (hydrate ? 0 : n));

  useEffect(() => {
    if (mouvementReduit()) {
      setPas(n);
      return;
    }
    if (!visible || pas >= n) return;
    const t = setTimeout(() => setPas((p) => p + 1), pas === 0 ? 700 : 900);
    return () => clearTimeout(t);
  }, [visible, pas, n]);

  return (
    <div ref={ref} className="grid gap-2" aria-hidden>
      {etapes.map((e, k) => (
        <Pastille key={e.fait} enCours={e.enCours} fait={e.fait} etat={pas > k ? "fait" : pas === k ? "cours" : "attente"} />
      ))}
    </div>
  );
}
