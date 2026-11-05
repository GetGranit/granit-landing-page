// Rangement de la rubrique : fonctions pures, testées par node --test et lues par le plugin Vite.
// Pas d'import « @/… » ni de module virtuel ici.
import type { VerticaleSlug } from "../ressources/types";
import type { Edition, FicheEdition } from "./types";

export type Repartition = {
  /** La grande carte. null seulement sous filtre, ou si seul un relevé existe. */
  une: FicheEdition | null;
  /** La deuxième édition, à droite de la une quand il n'y a pas de relevé. */
  cote: FicheEdition | null;
  releve: FicheEdition | null;
  grille: FicheEdition[];
};

const parNumero = (a: FicheEdition, b: FicheEdition) => b.numero - a.numero;

/**
 * Sans filtre : la dernière édition en une ; à côté, le relevé s'il existe, sinon la suivante.
 * Avec un filtre : ni une ni relevé, seulement la grille du métier.
 */
export function repartir(fiches: FicheEdition[], metier?: VerticaleSlug): Repartition {
  const triees = [...fiches].sort(parNumero);
  if (metier)
    return {
      une: null,
      cote: null,
      releve: null,
      grille: triees.filter((f) => f.metiers.includes(metier)),
    };
  const releve = triees.find((f) => f.format === "le-releve") ?? null;
  const [une = null, ...suite] = triees.filter((f) => f !== releve);
  const cote = releve ? null : (suite.shift() ?? null);
  return { une, cote, releve, grille: suite };
}

/** Les métiers qui ont au moins une édition, dans l'ordre donné (celui des verticales). */
export function metiersPresents(
  fiches: FicheEdition[],
  ordre: readonly VerticaleSlug[],
): VerticaleSlug[] {
  return ordre.filter((m) => fiches.some((f) => f.metiers.includes(m)));
}

const MOTS_PAR_MINUTE = 200;

/** Minutes de lecture, calculées sur le texte de l'édition. Une minute au moins. */
export function tempsLecture(
  e: Pick<Edition, "chapo" | "change" | "qui" | "gestes" | "inconnu">,
): number {
  const texte = [e.chapo, ...e.change, e.qui.texte, ...e.gestes, ...e.inconnu].join(" ");
  const mots = texte.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(mots / MOTS_PAR_MINUTE));
}
