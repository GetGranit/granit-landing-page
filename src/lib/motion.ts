// Mouvement des pages Ressources : le CSS fait l'essentiel (src/ressources.css).

/** Vrai si l'utilisateur a demandé de réduire les animations. */
export const mouvementReduit = () =>
  typeof matchMedia !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches;
