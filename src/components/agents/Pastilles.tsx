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

export type EtapePastille = { enCours: string; fait: string; detail?: string; place?: string };

/**
 * Hero : les pastilles se posent l'une après l'autre, se cochent et s'effacent ; la dernière reste.
 * Une seule fois, et seulement quand le hero est à l'écran. Animations réduites : la dernière, cochée.
 * « photo » : posées sur la photo (ordinateur). « ligne » : une à la fois, sous le titre (mobile),
 * pour ne pas couvrir les visages.
 */
export function SequenceHero({ etapes, variante = "photo" }: { etapes: EtapePastille[]; variante?: "photo" | "ligne" }) {
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
    <div ref={ref} className={variante === "photo" ? "pointer-events-none absolute inset-0" : "pointer-events-none grid"} aria-hidden>
      {etapes.map((e, k) => {
        const derniere = k === etapes.length - 1;
        const montre = pas >= 3 * k && (derniere || pas < 3 * k + 4);
        const etat: Etat = pas >= 3 * k + 2 ? "fait" : "cours";
        return (
          <motion.div
            key={e.fait}
            className={variante === "photo" ? "absolute top-[var(--t)] left-[var(--l)] max-w-[calc(100%-32px)]" : "col-start-1 row-start-1 max-w-full justify-self-start"}
            style={variante === "photo" ? placeStyle(e.place) : undefined}
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

/** « gauche haut » en pourcentages : « 8% 62% » → left 8 %, top 62 %. */
function placeStyle(place?: string) {
  const [l, t] = (place ?? "10% 50%").split(" ");
  return { "--l": l, "--t": t } as CSSProperties;
}
