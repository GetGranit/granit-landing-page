import { useEffect, useState } from "react";

import { DEBUT } from "@/lib/webinarIa";

/**
 * « J-31 », « Aujourd'hui », ou rien une fois le webinar commencé. Compté en
 * jours de calendrier à Paris, et calculé dans le navigateur pour ne pas figer
 * la valeur au rendu serveur.
 */
export function useJoursRestants() {
  const [label, setLabel] = useState<string | null>(null);
  useEffect(() => {
    if (Date.now() >= DEBUT.getTime()) return;
    const aujourdhui = new Date().toLocaleDateString("en-CA", { timeZone: "Europe/Paris" });
    const jours = Math.round((Date.parse("2026-11-26") - Date.parse(aujourdhui)) / 86_400_000);
    setLabel(jours > 0 ? `J-${jours}` : "Aujourd'hui");
  }, []);
  return label;
}

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
