// Schémas des articles (champ `figures`, marqueurs <div data-figure="id"></div>) :
// on réutilise tel quel le rendu de référence du moteur, pur et sans dépendance.
// @ts-expect-error -- module JS du moteur, sans déclaration de types
import * as moteur from "../../../scripts/seo-engine/lib/figures.mjs";

export type Figure = {
  id: string;
  type: "flux" | "etapes" | "comparaison";
  titre: string;
  legende: string;
  colonnes: string[];
  elements: { label: string; detail: string; valeurs: string[]; focus: boolean }[];
};

/** <figure> complète (titre, schéma SVG, légende), en HTML. */
export const figureHtml: (f: Figure) => string = moteur.figureHtml;

/** Styles des figures, à poser une fois dans la page. */
export const FIGURE_CSS: string = moteur.FIGURE_CSS;
