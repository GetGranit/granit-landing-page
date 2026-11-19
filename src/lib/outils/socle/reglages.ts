// Réglages communs aux trois outils, que Paul renseigne d'une ligne.

/**
 * Qui relit les données des outils. Affiché sous « Vérifié le » dans chaque bloc Sources
 * (« par {nom}, {fonction} »). null tant que personne n'est désigné : rien n'est affiché.
 */
export const RELECTEUR_OUTILS: { nom: string; fonction: string } | null = null;

/** Adresse des liens « Signaler un code manquant » des états vides (mailto, jamais un formulaire). */
export const CONTACT_OUTILS = "contact@getgranit.ai";

/** Sur-titre de l'en-tête des hubs des trois outils référentiels. */
export const SURTITRE_HUB = "Outil gratuit · tiers payant";
