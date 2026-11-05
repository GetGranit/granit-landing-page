// Seul importeur de `virtual:actualites`. Non testable sous node (module virtuel).
// Ne se charge que par import() dans les loaders : un import statique ferait entrer la liste dans
// le morceau d'entrée, donc dans toutes les pages du site.
import { charger, fiches } from "virtual:actualites";
import type { Edition, FicheEdition } from "./types";

export { fiches };

/** Passe par la liste, jamais par `charger[slug]` : un slug comme « constructor » y trouverait une fonction. */
export function ficheEdition(slug: string): FicheEdition | undefined {
  return fiches.find((f) => f.slug === slug);
}

export async function chargerEdition(slug: string): Promise<Edition | null> {
  if (!ficheEdition(slug)) return null;
  return (await charger[slug]()).default;
}
