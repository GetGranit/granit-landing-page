// Outil C · Mutuelle → portail de tiers payant : le descripteur (sans donnée).
// Ce fichier part dans le bundle client : il nourrit /outils, le pied de page et les liens des autres
// outils (LienOutil). Les données restent dans donnees.json, lu seulement par serveur.ts et pages.mjs.

/** @type {import("../socle/types").OutilDescripteur} */
export const OUTIL = {
  id: "mutuelle-portail",
  chemin: "/outils/mutuelle-portail",
  nom: "Portail par mutuelle",
  titreCarte: "Quel portail pour cette mutuelle ?",
  description:
    "Pour chaque complémentaire, le portail ou l’opérateur de tiers payant métier par métier, le libellé relevé et la date du relevé.",
  metiers: ["optique", "dentaire", "centres", "pharmacie", "cliniques"],
  ordre: 2,
};
