// Suivi PostHog des outils référentiels : noms d'événements, provenance d'une visite d'entrée,
// observateur « vu une fois ». Le hook principal, useSuiviOutil, est dans
// src/components/outils/OutilShared.tsx (partagé avec les deux outils de campagne).
//
// Ce qu'on n'envoie jamais : un texte saisi ailleurs que dans la recherche, une requête non passée
// par nettoyerRequete (recherche.ts), un prix (B).
import { useEffect, useRef, type RefObject } from "react";

/** Le catalogue des événements (socle.md § 9.2). Les quatre premiers existaient déjà. */
export const EVENEMENTS = {
  pageVue: "lm_page_vue",
  commence: "lm_outil_commence",
  resultatVu: "lm_resultat_vu",
  rdvClic: "lm_rdv_clic",
  recherche: "lm_recherche",
  filtre: "lm_filtre",
  resultatClic: "lm_resultat_clic",
  entreeVue: "lm_entree_vue",
  voisinClic: "lm_voisin_clic",
  sourceClic: "lm_source_clic",
  pontVu: "lm_pont_vu",
  pontClic: "lm_pont_clic",
} as const;

/** `suivre` de useSuiviOutil : l'outil et le contexte de la page sont ajoutés à chaque événement. */
export type Suivre = (evenement: string, proprietes?: Record<string, unknown>) => void;

/** D'où vient la visite d'une entrée (propriété `depuis` de lm_entree_vue). */
export type Depuis =
  "recherche" | "voisin" | "article" | "autre-outil" | "site" | "externe" | "direct";

const CLE_DEPUIS = "outil_depuis";
const DEPUIS_MARQUES: readonly Depuis[] = ["recherche", "voisin", "article", "autre-outil"];

/** Au clic d'un lien interne vers une entrée : retient d'où l'on vient pour la page suivante. */
export function marquerDepuis(type: Depuis): void {
  try {
    window.sessionStorage.setItem(CLE_DEPUIS, type);
  } catch {
    // stockage bloqué (navigation privée) : la page suivante déduira du referrer
  }
}

/**
 * Au chargement d'une entrée : la marque laissée par marquerDepuis (lue puis effacée), sinon le
 * referrer (même domaine → « site », autre → « externe », vide → « direct »).
 */
export function lireDepuis(): Depuis {
  try {
    const marque = window.sessionStorage.getItem(CLE_DEPUIS);
    window.sessionStorage.removeItem(CLE_DEPUIS);
    if (marque && (DEPUIS_MARQUES as readonly string[]).includes(marque)) return marque as Depuis;
  } catch {
    // stockage bloqué : on passe au referrer
  }
  try {
    const ref = document.referrer;
    if (!ref) return "direct";
    return new URL(ref).host === window.location.host ? "site" : "externe";
  } catch {
    return "direct";
  }
}

/**
 * Appelle `rappel` une seule fois, quand l'élément entre dans l'écran à `seuil` (moitié par défaut).
 * Même observateur que lm_resultat_vu, pour les autres blocs (lm_pont_vu).
 */
export function useVuUneFois(
  ref: RefObject<Element | null>,
  rappel: () => void,
  seuil = 0.5,
): void {
  const dejaVu = useRef(false);
  const dernierRappel = useRef(rappel);
  dernierRappel.current = rappel;
  useEffect(() => {
    const cible = ref.current;
    if (!cible || dejaVu.current || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      ([entree]) => {
        if (!entree?.isIntersecting || dejaVu.current) return;
        dejaVu.current = true;
        dernierRappel.current();
        io.disconnect();
      },
      { threshold: seuil },
    );
    io.observe(cible);
    return () => io.disconnect();
  }, [ref, seuil]);
}
