import { motion, useReducedMotion } from "framer-motion";
import { useSyncExternalStore, type ReactNode } from "react";

const subscribe = () => () => {};

/**
 * Fades its content in when scrolled into view. The server render and the
 * hydration pass start visible (`initial={false}`) so the HTML carries readable
 * content; only blocks mounted afterwards (client navigation) start hidden.
 */
export function Reveal({
  children,
  delay = 0,
  y = 16,
  className,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  const hydrated = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      initial={hydrated && !reduceMotion ? { opacity: 0, y } : false}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.5, ease: [0.22, 0.61, 0.36, 1], delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
