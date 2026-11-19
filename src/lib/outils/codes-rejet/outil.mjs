// Descripteur de l'outil A, codes rejet. Aucune donnée ici : ce fichier part dans le bundle client
// (page /outils, pied de page, liens d'un outil à l'autre).
// `nom` au pluriel (« Codes rejets ») comme la requête déjà visible en Search Console et l'article
// existant (textes.md § 1.1, écart avec cadre.md signalé dans la PR) ; l'identifiant ne change pas.

/** @type {import("../socle/types").OutilDescripteur} */
export const OUTIL = {
  id: "codes-rejet",
  chemin: "/outils/codes-rejet",
  nom: "Codes rejets",
  titreCarte: "Que veut dire ce code rejet\u00a0?",
  description:
    "Le sens d’un code rejet NOEMIE, sa cause probable et quoi corriger, avec le libellé publié par la caisse et sa date.",
  metiers: ["optique", "dentaire", "centres", "pharmacie", "cliniques"],
  ordre: 1,
};
