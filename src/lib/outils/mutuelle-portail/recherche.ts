// Recherche du hub de l'outil C. Sans import « @/ » : lu aussi par les tests Node.
import { cleCode } from "../socle/texte.mjs";
import type { Filtres } from "../socle/types";

/**
 * Un numéro AMC a 10 chiffres ; tapé sans ses zéros de tête (« 45900442 »), on essaie aussi la forme
 * complète (« 0045900442 »).
 */
export const variantes = (q: string): string[] => {
  const k = cleCode(q);
  return /^\d{6,9}$/.test(k) ? [k.padStart(10, "0")] : [];
};

/** Valeur de la facette « couple » d'une ligne : un métier du site et un opérateur relevé pour lui. */
export const cleCouple = (metier: string, operateur: string) => `${metier}@${operateur}`;

/**
 * Les filtres que la liste applique. Métier et opérateur posés ensemble deviennent un seul filtre
 * « couple » : une ligne ne reste que si ce métier passe par cet opérateur, d'après un fait sûr
 * (« Optique » + « iSanté » écarte une mutuelle qui n'est chez iSanté que pour la pharmacie). Seul,
 * chaque filtre garde sa facette (faits sûrs et « à confirmer »). La même fonction sert au rendu
 * serveur, au navigateur et aux tests.
 */
export function filtresListe(filtres: Filtres): Filtres {
  const { metier, operateur, ...autres } = filtres;
  if (metier && operateur) return { ...autres, couple: cleCouple(metier, operateur) };
  return filtres;
}
