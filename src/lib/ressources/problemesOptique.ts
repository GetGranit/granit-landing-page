// Page métier optique : les articles qui répondent à chaque problème du comptoir.
// Pas d'import « @/… » ici : le test le lit directement (tests/ressources/problemes-optique.test.ts).

/** Les problèmes, dans les mots du comptoir, et les articles qui y répondent (2 à 3 chacun). */
export const PROBLEMES_SLUGS: Record<string, string[]> = {
  refus: ["rejet-tiers-payant", "rejet-beneficiaire-inconnu", "checklist-prise-en-charge"],
  impaye: ["virement-mutuelle-inferieur", "quand-relancer-mutuelle", "codes-rejets-noemie"],
  portails: ["portails-tiers-payant", "almerys-prise-en-charge", "portail-actil"],
  devis: [
    "reste-a-charge-drees-expliquer-devis",
    "part-des-reseaux-de-soins-optique-tresorerie",
    "tiers-payant-opticien",
  ],
  annee: [
    "ticket-moderateur-2027-tiers-payant",
    "ordonnances-medecins-deconventionnes-2027",
    "reseau-optique-alan-candidature-2027",
  ],
  audio: ["audioprothese-renouvellement-tiers-payant", "sesam-vitale-evolutions-2025"],
};
