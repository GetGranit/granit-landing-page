// Descripteur de l'outil B · Remboursement (cadre.md § 1). Sans aucune donnée : ce fichier part
// dans le bundle client (page /outils, pied de page, liens d'un outil à l'autre).

/** @type {import("../socle/types").OutilDescripteur} */
export const OUTIL = {
  id: "remboursement",
  chemin: "/outils/remboursement",
  nom: "Remboursement",
  titreCarte: "Combien rembourse la Sécu, et la mutuelle\u00a0?",
  description:
    "Base de remboursement, part Sécu, ticket modérateur et part mutuelle par code LPP, 100\u00a0% Santé compris, avec la date du tarif et sa source.",
  // + "dentaire" le jour où le dentaire ouvre (publication.mjs, METIERS).
  metiers: ["optique"],
  ordre: 3,
};
