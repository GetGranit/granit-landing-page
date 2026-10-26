import { useEffect, useState } from "react";

import { DEBUT } from "@/lib/webinarIa";

/** Jours, heures, minutes, secondes avant le début, mis à jour chaque seconde ; null avant le montage ou une fois commencé. */
export function useCompteARebours() {
  const [reste, setReste] = useState<{ j: number; h: number; m: number; s: number } | null>(null);
  useEffect(() => {
    const tick = () => {
      const ms = DEBUT.getTime() - Date.now();
      if (ms <= 0) return setReste(null);
      const s = Math.floor(ms / 1000);
      setReste({
        j: Math.floor(s / 86_400),
        h: Math.floor((s % 86_400) / 3600),
        m: Math.floor((s % 3600) / 60),
        s: s % 60,
      });
    };
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);
  return reste;
}
