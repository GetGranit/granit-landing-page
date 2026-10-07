import { useEffect, useRef } from "react";

const IDLE_MS = 60_000;

/** Appelle `onIdle` après 60 s sans action, tant que `active` (une seule fois). */
export function useIdleWhile(active: boolean, onIdle: () => void) {
  const fired = useRef(false);
  useEffect(() => {
    if (!active || fired.current) return;
    let timer = window.setTimeout(fire, IDLE_MS);
    function fire() {
      if (fired.current) return;
      fired.current = true;
      onIdle();
    }
    function reset() {
      window.clearTimeout(timer);
      timer = window.setTimeout(fire, IDLE_MS);
    }
    const events = ["pointerdown", "keydown", "input", "scroll"] as const;
    events.forEach((e) => window.addEventListener(e, reset, { passive: true }));
    return () => {
      window.clearTimeout(timer);
      events.forEach((e) => window.removeEventListener(e, reset));
    };
  }, [active, onIdle]);
}
