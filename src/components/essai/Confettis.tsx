import { motion, useReducedMotion } from "framer-motion";

const COULEURS = ["var(--terra)", "var(--sage)", "var(--terra-soft)", "var(--sage-light)"];
const N = 22;

/**
 * Petite gerbe de confettis (~1 s), posée sur un parent `relative`.
 * Change `burst` pour en relancer une. Rien si mouvement réduit.
 */
export function Confettis({ burst, spread = 1 }: { burst: number; spread?: number }) {
  const reduce = useReducedMotion();
  if (reduce || burst === 0) return null;
  return (
    <span
      key={burst}
      aria-hidden
      className="pointer-events-none absolute left-1/2 top-1/2 z-10 h-0 w-0"
    >
      {Array.from({ length: N }, (_, i) => {
        // Pseudo-aléatoire stable : même dessin pour un même `burst`.
        const r = (k: number) => {
          const x = Math.sin((i + 1) * 12.9898 + burst * 78.233 + k * 37.719) * 43758.5453;
          return x - Math.floor(x);
        };
        const angle = (i / N) * Math.PI * 2 + r(1) * 0.5;
        const dist = (60 + r(2) * 70) * spread;
        return (
          <motion.span
            key={i}
            className="absolute block rounded-[2px]"
            style={{
              width: 6 + r(3) * 4,
              height: 4 + r(4) * 6,
              background: COULEURS[i % COULEURS.length],
            }}
            initial={{ x: 0, y: 0, opacity: 1, rotate: 0, scale: 0.6 }}
            animate={{
              x: Math.cos(angle) * dist,
              y: Math.sin(angle) * dist + 40 * spread,
              opacity: 0,
              rotate: (r(5) - 0.5) * 540,
              scale: 1,
            }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          />
        );
      })}
    </span>
  );
}
