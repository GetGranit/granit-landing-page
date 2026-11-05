// Seul importeur de `virtual:actualites`. Non testable sous node (module virtuel).
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

/** Le relevé le plus récent, ou null : sans relevé, le bloc n'apparaît pas. */
export function dernierReleve(): FicheEdition | null {
  return fiches.find((f) => f.format === "le-releve") ?? null;
}
