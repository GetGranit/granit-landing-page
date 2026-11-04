import { animate } from "framer-motion";
import { useEffect, useRef, type ReactNode, type RefObject } from "react";
import { SymboleGalets } from "./SymboleGalets";

// « Dérive lente » : le dégradé de la marque, et par-dessus trois nappes floues (blush, menthe,
// ciel) qui glissent l'une sur l'autre en 22 à 30 s, aller-retour.
//
// Seulement des transformations (translate, scale, rotate), animées sur le GPU : rien ne touche la
// mise en page. Hydratation : les éléments sont toujours rendus, immobiles ; l'animation démarre
// dans un effet si l'utilisateur n'a pas demandé de réduire les animations, et s'arrête s'il le
// demande en cours de route.

type Derive = { x: string; y: string; scale?: number; rotate?: number; duree: number };

const DERIVES: Derive[] = [
  { x: "18%", y: "10%", scale: 1.15, duree: 22 },
  { x: "-16%", y: "-12%", scale: 0.9, duree: 26 },
  { x: "-10%", y: "14%", scale: 1.2, duree: 30 },
];
const FLOTTE: Derive = { x: "-2%", y: "3%", rotate: -2, duree: 18 };

function useDerive(cibles: RefObject<(HTMLElement | null)[]>, derives: Derive[]) {
  useEffect(() => {
    const mq = matchMedia("(prefers-reduced-motion: reduce)");
    let controles: { stop: () => void }[] = [];
    const arreter = () => {
      controles.forEach((c) => c.stop());
      controles = [];
      cibles.current.forEach((el) => el && (el.style.transform = ""));
    };
    const demarrer = () => {
      arreter();
      if (mq.matches) return;
      controles = cibles.current.flatMap((el, i) => {
        const d = derives[i];
        if (!el || !d) return [];
        const { duree, ...valeurs } = d;
        return [
          animate(el, valeurs, {
            duration: duree,
            repeat: Infinity,
            repeatType: "mirror",
            ease: "easeInOut",
          }),
        ];
      });
    };
    demarrer();
    mq.addEventListener("change", demarrer);
    return () => {
      mq.removeEventListener("change", demarrer);
      arreter();
    };
  }, [cibles, derives]);
}

function Nappes({ opacite = 1, flou = 60 }: { opacite?: number; flou?: number }) {
  const refs = useRef<(HTMLDivElement | null)[]>([]);
  useDerive(refs, DERIVES);
  const nappes = [
    "radial-gradient(40% 45% at 30% 40%, var(--blush), transparent 70%)",
    "radial-gradient(38% 42% at 65% 45%, var(--menthe), transparent 70%)",
    "radial-gradient(42% 40% at 80% 70%, var(--ciel), transparent 70%)",
  ];
  return (
    <>
      {nappes.map((fond, i) => (
        <div
          key={fond}
          ref={(el) => {
            refs.current[i] = el;
          }}
          aria-hidden
          className="pointer-events-none absolute -inset-[30%] will-change-transform"
          style={{ background: fond, filter: `blur(${flou}px)`, opacity: opacite }}
        />
      ))}
    </>
  );
}

/** Hero de /agents : la dérive complète, et le symbole Galets agrandi, coupé par le bord droit. */
export function HeroDerive({ children }: { children: ReactNode }) {
  const sym = useRef<(HTMLElement | null)[]>([]);
  useDerive(sym, [FLOTTE]);
  return (
    <div
      className="relative isolate overflow-hidden rounded-[24px]"
      style={{ background: "var(--degrade-marque)" }}
    >
      <div aria-hidden className="absolute inset-0 -z-10 overflow-hidden">
        <Nappes />
      </div>
      <div
        aria-hidden
        className="pointer-events-none absolute -top-[6%] -right-[30%] -z-10 h-[70%] md:-top-[9%] md:-right-[8%] md:h-[118%]"
      >
        <SymbolePorte refs={sym} />
      </div>
      {children}
    </div>
  );
}

function SymbolePorte({ refs }: { refs: RefObject<(HTMLElement | null)[]> }) {
  return (
    <span
      ref={(el) => {
        refs.current[0] = el;
      }}
      className="block h-full will-change-transform"
    >
      <SymboleGalets className="h-full w-auto" style={{ color: "var(--papier)", opacity: 0.6 }} />
    </span>
  );
}

/**
 * Fond de page, derrière tout le contenu (position fixe) : la même dérive, plus calme, sur le
 * rosé. Les sections gardent leurs cartes papier ou lavis, le texte reste lisible.
 */
export function FondPage() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      style={{ background: "var(--rose)" }}
    >
      <Nappes opacite={0.8} flou={90} />
    </div>
  );
}
