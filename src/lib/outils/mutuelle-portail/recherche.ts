// Recherche du hub de l'outil C : un numéro AMC a 10 chiffres ; tapé sans ses zéros de tête
// (« 45900442 »), on essaie aussi la forme complète (« 0045900442 »). Sans import « @/ » : lu aussi
// par les tests Node.
import { cleCode } from "../socle/texte.mjs";

export const variantes = (q: string): string[] => {
  const k = cleCode(q);
  return /^\d{6,9}$/.test(k) ? [k.padStart(10, "0")] : [];
};
