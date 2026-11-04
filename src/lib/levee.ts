/** L'annonce publique de la levée : jeudi 5 novembre 2026, 8 h 30 à Paris. Rien ne se montre avant. */
export const ANNONCE_LEVEE = "2026-11-05T08:30:00+01:00";

/** La levée est-elle visible ? `?levee=1` force l'affichage pour relire avant l'annonce. */
export function leveeVisible(recherche: string) {
  return (
    new URLSearchParams(recherche).get("levee") === "1" ||
    Date.now() >= new Date(ANNONCE_LEVEE).getTime()
  );
}
