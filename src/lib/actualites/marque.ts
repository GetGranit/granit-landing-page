// Les noms de la rubrique et de la newsletter : un seul fichier, aucun nom codé en dur ailleurs.
// Pas d'import « @/… » : ce module est testé tel quel par node --test.

/** Nom de la rubrique, en majuscules initiales comme dans la manchette. */
export const NOM_RUBRIQUE = "Le Reste";

export const SOUS_TITRE = {
  fr: "Ce qui change pour vos équipes, hors du soin.",
  en: "What changes for your teams, outside of care.",
} as const;

/** Nom de la newsletter, distinct de la rubrique. Valeur provisoire : Paul la change ici. */
export const NOM_NEWSLETTER = "Le Reste";

/** Fermée : le composant d'abonnement ne s'affiche pas et la fonction serveur refuse tout envoi. */
export const NEWSLETTER_OUVERTE: boolean = false;

/**
 * Rythme de parution, affiché seulement une fois décidé : null tant que Paul n'a pas tranché.
 * À renseigner en { fr, en }, par exemple { fr: "Toutes les deux semaines", en: "Every two weeks" }.
 */
export const RYTHME: { fr: string; en: string } | null = null;

/** Sépare le dernier mot, celui qui prend l'accent dans la manchette. */
export function decouperNom(nom: string = NOM_RUBRIQUE): { debut: string; accent: string } {
  const mots = nom.trim().split(/\s+/);
  const accent = mots.pop() ?? "";
  return { debut: mots.join(" "), accent };
}
