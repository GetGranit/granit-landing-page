// Outil factice : la fixture des tests du socle (tests/outils/socle.test.ts). Jamais publié.
// Il montre le contrat d'un outil en petit : outil.mjs, publication.mjs, pages.mjs, donnees.json.

/** @type {import("../../../../../../../src/lib/outils/socle/types").OutilDescripteur} */
export const OUTIL = {
  id: "factice",
  chemin: "/outils/factice",
  nom: "Outil factice",
  titreCarte: "Un outil de démonstration\u00a0?",
  description:
    "Un outil de démonstration du socle, avec trois entrées publiées et leurs sources datées.",
  metiers: ["optique", "dentaire"],
  ordre: 9,
};
