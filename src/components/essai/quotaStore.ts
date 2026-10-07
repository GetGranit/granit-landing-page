/**
 * Les 20 PEC offertes de l'espace freemium (maquette).
 * Seul un nombre est stocké, dans sessionStorage : rien du patient ni des accès.
 * `?pec=19` dans l'URL fixe le compteur, pour tester l'upsell sans 20 demandes.
 */

export const QUOTA = 20;
/** À partir de là, on dit honnêtement combien il en reste. */
export const QUOTA_RAPPEL = 15;
/** Temps d'une PEC faite à la main quand l'opticien ne l'a pas dit. */
export const MINUTES_PAR_DEFAUT = 12;

const QUOTA_KEY = "granit.pec.quota";

const clamp = (n: number) => Math.min(QUOTA, Math.max(0, Math.trunc(n)));

export function readQuota(): number {
  try {
    const fromUrl = new URLSearchParams(window.location.search).get("pec");
    if (fromUrl !== null && /^\d+$/.test(fromUrl)) {
      const n = clamp(Number(fromUrl));
      writeQuota(n);
      return n;
    }
    const n = Number(window.sessionStorage.getItem(QUOTA_KEY));
    return Number.isFinite(n) ? clamp(n) : 0;
  } catch {
    return 0;
  }
}

export function writeQuota(n: number): void {
  try {
    window.sessionStorage.setItem(QUOTA_KEY, String(clamp(n)));
  } catch {
    /* stockage indisponible : le compteur vit dans la page */
  }
}

/** Temps gagné estimé, en minutes : n × (temps à la main − temps Granit). */
export function tempsGagne(n: number, minutesManuelles: number | undefined, dureeSec: number) {
  const parPec = (minutesManuelles ?? MINUTES_PAR_DEFAUT) - dureeSec / 60;
  return Math.max(0, Math.round(n * parPec));
}

export function enHeures(min: number): string {
  if (min < 60) return `${min} min`;
  return `${Math.floor(min / 60)} h ${String(min % 60).padStart(2, "0")}`;
}
