// Les noms de la rubrique et de la newsletter : un seul fichier, aucun nom codé en dur ailleurs.
// Pas d'import « @/… » : ce module est testé tel quel par node --test.

/** Nom de la rubrique, en majuscules initiales comme dans la manchette. */
export const NOM_RUBRIQUE = "Granité";

export const SOUS_TITRE = {
  fr: "La newsletter pour se tenir au courant de l’actualité santé.",
  en: "The newsletter to keep up with healthcare news.",
} as const;

/** Nom de la newsletter, le même que celui de la rubrique. */
export const NOM_NEWSLETTER = NOM_RUBRIQUE;

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
