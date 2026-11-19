// Les groupes de l'outil B · Remboursement (cadre.md § 3, textes.md § 3) : ce qui se lit ensemble.
// Une page par groupe, jamais par code ; chaque code a sa ligne dans le tableau de la page (ancre
// `#lpp-<code>`) et reste trouvable par la recherche du hub.
//
// Les textes viennent de textes.md (copy-seo), mot pour mot. Aucun montant n'y est écrit en dur :
// chaque montant est un repère, remplacé au rendu par la valeur de donnees.json (contenu.mjs) :
//   {base:CODE} {plv:CODE} (prix limite) {secu:CODE} {tm:CODE} {compl:CODE} (prix limite − Sécu)
//   {plafond:CODE} (R871-2) {date:CODE} (tarif en vigueur depuis) {age:CODE} (âge maximal LPP)
//   {desig:CODE} (désignation LPP sans « OPTIQUE, VERRE … CLASSE x, ») {total:CODE+CODE+…} (somme
//   des prix limites) {taux} {secumin} {secumax} (sur les codes du groupe).
// Un texte qui contient un repère de la part Sécu ({secu}, {tm}, {compl}, {taux}, {secumin},
// {secumax}) a une variante `p2027` sans montant Sécu, affichée à partir du 01/01/2027 tant que le
// taux 2027 n'est pas publié (test). Chaque paragraphe porte ses sources (`source_ids`, test).
// ESM pur : lu par pages.mjs, vues.mjs et les tests ; aucun import de donnees.json.

/** Les catégories de donnees.json qui n'ont pas de groupe à page : lignes du hub seulement. */
export const HORS_GROUPE = [
  {
    id: "autres-actes-dentaires",
    nom: "Autres actes dentaires",
    metier: "dentaire",
    categories: ["mainteneur d'espace"],
  },
];

/** Phrase commune des réponses quand le taux 2027 n'est pas publié (textes.md § 3.2). */
export const PHRASE_2027 =
  "Depuis le 1er janvier 2027, le nouveau taux de la Sécurité sociale n'est pas encore publié : nous n'affichons pas sa part.";

/** « Ce que ce calcul ne couvre pas », commun à toutes les pages (textes.md § 3.4). */
export const LIMITES_CALCUL =
  "Ce calcul vaut pour le cas général. Il ne couvre pas les situations où le taux de la Sécurité sociale diffère : affection de longue durée, Complémentaire santé solidaire, accident du travail ou maladie professionnelle, maternité, régime local d'Alsace-Moselle, régime des Mines. Il ne dit pas non plus ce que rembourse un contrat donné au-delà des minimums du contrat responsable.";

const VERRES_A_VOISINS = [
  "verre-unifocal-classe-a",
  "verre-multifocal-classe-a",
  "verre-progressif-classe-a",
  "verres-classe-b",
  "montures",
];
const autres = (slug, liste) => liste.filter((s) => s !== slug);

/**
 * Les groupes, dans l'ordre du hub. Un groupe sans `titre` (freinateurs, dentaire, médicaments)
 * n'a jamais de page : ses codes sont des lignes du hub, ouvertes sur place.
 * `forme` : "verres" (réponse et paragraphe générés selon le panier) ou "mixte" (réponse écrite
 * dans `reponse`, « L'essentiel » par `parties`).
 */
export const GROUPES = [
  {
    slug: "verre-unifocal-classe-a",
    nom: "Verre unifocal classe A",
    metier: "optique",
    categories: ["verre unifocal classe A"],
    forme: "verres",
    titre: "Verre unifocal classe A : remboursement Sécu et mutuelle",
    description:
      "Les 30 codes LPP du verre unifocal classe A : base de remboursement, part Sécu, ticket modérateur, prix limite et part mutuelle, d'après la base LPP.",
    h1: "Verre unifocal classe A : base de remboursement et part mutuelle",
    surTitre: "Optique · 100 % Santé · code LPP",
    intertitres: {
      calcul: "Calculer le remboursement d'un verre",
      tableau: "Les {n} codes LPP du verre unifocal classe A",
      tranches: "D'une correction à l'autre",
      texte: "Un équipement complet en classe A",
    },
    texte: [
      {
        p: "Un équipement complet de classe A, soit une monture adulte de classe A (code 2222124, prix limite {plv:2222124}) et deux verres 2263287 (« {desig:2263287} », {plv:2263287} chacun), revient au plus à {total:2222124+2263287+2263287} : en contrat responsable, le patient ne paie rien.",
        source_ids: ["lpp-cnam-v910", "css-r871-2"],
      },
      {
        p: "Deux codes peuvent avoir les mêmes montants pour des sphères de signe opposé : 2263287 (« {desig:2263287} ») et 2229362 (« {desig:2229362} ») ont tous deux une base de {base:2263287} et un prix limite de {plv:2263287}. Le code dépend du signe de la sphère, pas seulement de sa valeur.",
        source_ids: ["lpp-cnam-v910"],
      },
    ],
    voisins: autres("verre-unifocal-classe-a", VERRES_A_VOISINS),
    articles: ["tiers-payant-opticien", "virement-mutuelle-inferieur"],
    outilsLies: ["mutuelle-portail", "codes-rejet"],
  },
  {
    slug: "verre-multifocal-classe-a",
    nom: "Verre multifocal classe A",
    metier: "optique",
    categories: ["verre multifocal classe A"],
    forme: "verres",
    titre: "Verre multifocal classe A : remboursement Sécu et mutuelle",
    description:
      "Les 30 codes LPP du verre multifocal classe A : base, part Sécu, ticket modérateur, prix limite et part de la mutuelle, lus dans la base LPP.",
    h1: "Verre multifocal classe A : base de remboursement et part mutuelle",
    surTitre: "Optique · 100 % Santé · code LPP",
    intertitres: {
      calcul: "Calculer le remboursement d'un verre",
      tableau: "Les {n} codes LPP du verre multifocal classe A",
      tranches: "D'une correction à l'autre",
      texte: "Multifocal ou progressif : deux codes",
    },
    texte: [
      {
        p: "Multifocal et progressif n'ont ni les mêmes codes ni les mêmes montants pour une même correction : pour « {desig:2245190} », le verre multifocal 2245190 a une base de {base:2245190} et un prix limite de {plv:2245190}, le verre progressif 2249229 une base de {base:2249229} et un prix limite de {plv:2249229}.",
        source_ids: ["lpp-cnam-v910"],
      },
      {
        p: "Avec une monture adulte de classe A ({plv:2222124}), un équipement de deux verres 2245190 revient au plus à {total:2222124+2245190+2245190} : en contrat responsable, le patient ne paie rien.",
        source_ids: ["lpp-cnam-v910", "css-r871-2"],
      },
    ],
    voisins: autres("verre-multifocal-classe-a", VERRES_A_VOISINS),
    articles: ["tiers-payant-opticien", "virement-mutuelle-inferieur"],
    outilsLies: ["mutuelle-portail", "codes-rejet"],
  },
  {
    slug: "verre-progressif-classe-a",
    nom: "Verre progressif classe A",
    metier: "optique",
    categories: ["verre progressif classe A"],
    forme: "verres",
    titre: "Verre progressif classe A : remboursement Sécu et mutuelle",
    description:
      "Verre progressif classe A : base de remboursement, part Sécu, prix limite et part mutuelle des 30 codes LPP, avec le calcul pour un code et sa date.",
    h1: "Verre progressif classe A : base de remboursement et part mutuelle",
    surTitre: "Optique · 100 % Santé · code LPP",
    intertitres: {
      calcul: "Calculer le remboursement d'un verre",
      tableau: "Les {n} codes LPP du verre progressif classe A",
      tranches: "D'une correction à l'autre",
      texte: "Un équipement complet en classe A",
    },
    texte: [
      {
        p: "Un équipement de classe A en verres progressifs « {desig:2249229} » (code 2249229, {plv:2249229} par verre) et une monture adulte de classe A ({plv:2222124}) revient au plus à {total:2222124+2249229+2249229} : en contrat responsable, le patient ne paie rien.",
        source_ids: ["lpp-cnam-v910", "css-r871-2"],
      },
      {
        p: "Le prix limite le plus élevé, {plv:2234334} par verre, vaut pour les fortes corrections avec un cylindre de plus de 4 (codes 2234334 et 2299196).",
        source_ids: ["lpp-cnam-v910"],
      },
    ],
    voisins: autres("verre-progressif-classe-a", VERRES_A_VOISINS),
    articles: ["tiers-payant-opticien", "virement-mutuelle-inferieur"],
    outilsLies: ["mutuelle-portail", "codes-rejet"],
  },
  {
    slug: "verres-classe-b",
    nom: "Verres classe B",
    metier: "optique",
    categories: [
      "verre unifocal classe B",
      "verre multifocal classe B",
      "verre progressif classe B",
    ],
    forme: "verres",
    titre: "Verres classe B : remboursement Sécu et mutuelle",
    description:
      "Verres classe B : 0,05 € de base pour les 90 codes LPP, ce que rembourse la Sécu et ce que doit au moins un contrat responsable. Tarif daté, source LPP.",
    h1: "Verres classe B : base de remboursement et part mutuelle",
    surTitre: "Optique · tarif libre · code LPP",
    intertitres: {
      calcul: "Calculer le remboursement d'un verre",
      tableau: "Les {n} codes LPP des verres classe B",
      tranches: "D'une correction à l'autre",
      texte: "Ce que doit le contrat responsable",
    },
    texte: [
      {
        p: "Le contrat responsable fixe, pour la complémentaire, des minimums et des maximums par équipement (deux verres et une monture), Sécurité sociale comprise, selon que les verres sont simples ou complexes (article R871-2 du Code de la sécurité sociale). Les textes lus ne disent pas à quel code LPP correspond chaque catégorie : l'outil n'affiche donc pas de plafond pour les verres.",
        source_ids: ["css-r871-2"],
      },
      {
        p: "Dans un équipement à tarif libre, la monture a son propre plafond : {plafond:2264861} au plus, Sécurité sociale comprise. Les deux verres doivent être de la même classe ; la monture peut être d'une autre classe.",
        source_ids: ["css-r871-2", "ameli-optique"],
      },
    ],
    voisins: [
      "verre-unifocal-classe-a",
      "verre-multifocal-classe-a",
      "verre-progressif-classe-a",
      "montures",
    ],
    articles: ["reste-a-charge-drees-expliquer-devis", "virement-mutuelle-inferieur"],
    outilsLies: ["mutuelle-portail"],
  },
  {
    slug: "montures",
    nom: "Monture de lunettes",
    metier: "optique",
    categories: [
      "monture adulte classe A",
      "monture enfant classe A",
      "monture adulte classe B",
      "monture enfant classe B",
      "supplément monture à coque (moins de 6 ans) (classe A)",
      "supplément monture à coque (moins de 6 ans) (classe B)",
    ],
    forme: "mixte",
    titre: "Monture de lunettes : remboursement Sécu et mutuelle",
    description:
      "Monture adulte ou enfant, classe A ou B : base de remboursement, part Sécu, prix limite de 30 € en 100 % Santé et plafond de 100 € en contrat responsable.",
    h1: "Monture classe A ou B : base de remboursement et part mutuelle",
    surTitre: "Optique · classes A et B · code LPP",
    intertitres: {
      calcul: "Calculer le remboursement d'une monture",
      tableau: "Les {n} codes LPP des montures",
      tranches: "Adulte, enfant, classe A ou B",
      texte: "Monture enfant et monture à coque",
    },
    reponse: {
      connu: [
        "Une monture de classe A, adulte ou enfant, a une base de {base:2222124} : la Sécurité sociale en rembourse {secu:2222124}, et un contrat responsable paie le reste jusqu'au prix limite de {plv:2222124}.",
        "En classe B, la base est de {base:2264861} ({secu:2264861} remboursés) et le prix est libre ; la prise en charge d'un contrat responsable est plafonnée à {plafond:2264861}, Sécurité sociale comprise.",
      ],
      nonPublie: [
        "Une monture de classe A, adulte ou enfant, a une base de {base:2222124} et un prix limite de {plv:2222124} ; en classe B, la base est de {base:2264861} et le prix est libre, avec un plafond de {plafond:2264861} pour un contrat responsable, Sécurité sociale comprise.",
      ],
    },
    parties: {
      base: [
        {
          libelle: "monture classe A",
          categories: ["monture adulte classe A", "monture enfant classe A"],
        },
        {
          libelle: "monture classe B",
          categories: ["monture adulte classe B", "monture enfant classe B"],
        },
        {
          libelle: "supplément à coque classe A",
          categories: ["supplément monture à coque (moins de 6 ans) (classe A)"],
        },
        {
          libelle: "supplément à coque classe B",
          categories: ["supplément monture à coque (moins de 6 ans) (classe B)"],
        },
      ],
      reste: [
        {
          libelle: "classe A",
          categories: [
            "monture adulte classe A",
            "monture enfant classe A",
            "supplément monture à coque (moins de 6 ans) (classe A)",
          ],
        },
        {
          libelle: "monture classe B",
          categories: ["monture adulte classe B", "monture enfant classe B"],
        },
        {
          libelle: "supplément à coque classe B",
          categories: ["supplément monture à coque (moins de 6 ans) (classe B)"],
        },
      ],
    },
    texte: [
      {
        p: "La monture enfant a son propre code jusqu'à {age:2254242} (âge maximal inscrit dans la base LPP), avec les mêmes montants que la monture adulte : base de {base:2254242} et prix limite de {plv:2254242} en classe A, base de {base:2276870} en classe B.",
        source_ids: ["lpp-cnam-v910"],
      },
      {
        p: "Avant 6 ans, un supplément pour monture à coque s'ajoute : base de {base:2264223} et prix limite de {plv:2264223} en classe A, base de {base:2221745} en classe B (âge maximal inscrit : {age:2264223}).",
        source_ids: ["lpp-cnam-v910"],
      },
    ],
    voisins: [
      "verre-unifocal-classe-a",
      "verre-progressif-classe-a",
      "verres-classe-b",
      "prestations-optique",
    ],
    articles: ["virement-mutuelle-inferieur", "tiers-payant-opticien"],
    outilsLies: ["mutuelle-portail"],
  },
  {
    slug: "prestations-optique",
    nom: "Prestations et suppléments optique",
    metier: "optique",
    categories: [
      "prestation d'adaptation des verres (classe A)",
      "prestation d'adaptation des verres (classe B)",
      "prestation d'appairage",
      "supplément d'accompagnement (classe A)",
      "supplément verres teintés",
      "verre neutre classe A",
      "verre neutre classe B",
    ],
    forme: "mixte",
    titre: "Adaptation, appairage, suppléments : remboursement LPP",
    description:
      "Adaptation des verres, appairage, supplément d'accompagnement, verres teintés : la base LPP, la part Sécu et le prix limite de chaque code, datés.",
    h1: "Adaptation, appairage et suppléments optique : base de remboursement",
    surTitre: "Optique · prestations · code LPP",
    intertitres: {
      calcul: "Calculer le remboursement d'une prestation",
      tableau: "Les {n} codes LPP des prestations et suppléments",
      tranches: "D'une prestation à l'autre",
      texte: "Adaptation, appairage, accompagnement",
    },
    reponse: {
      connu: [
        "Chaque prestation a son code LPP : adaptation des verres, appairage, supplément d'accompagnement, verres teintés, verre neutre.",
        "La Sécurité sociale rembourse {taux} % de leur base, de {secumin} à {secumax} selon le code ; le tableau donne le prix limite de chacun.",
      ],
      nonPublie: [
        "Chaque prestation a son code LPP : adaptation des verres, appairage, supplément d'accompagnement, verres teintés, verre neutre ; le tableau donne la base et le prix limite de chacun.",
      ],
    },
    parties: {
      reste: [
        {
          libelle: "classe A",
          categories: [
            "prestation d'adaptation des verres (classe A)",
            "supplément d'accompagnement (classe A)",
            "verre neutre classe A",
          ],
        },
        {
          libelle: "classe B",
          categories: ["prestation d'adaptation des verres (classe B)", "verre neutre classe B"],
        },
        {
          libelle: "appairage et verres teintés",
          categories: ["prestation d'appairage", "supplément verres teintés"],
        },
      ],
    },
    texte: [
      {
        p: "La prestation d'adaptation des verres de classe A a une base égale à son prix limite, {base:2226435} : la Sécurité sociale en rembourse {secu:2226435}, la complémentaire d'un contrat responsable {compl:2226435}. En classe B, sa base est de {base:2209738} pour le même prix limite de {plv:2209738}.",
        p2027:
          "La prestation d'adaptation des verres de classe A a une base égale à son prix limite, {base:2226435}. En classe B, sa base est de {base:2209738} pour le même prix limite de {plv:2209738}.",
        source_ids: ["lpp-cnam-v910", "css-r871-2"],
      },
      {
        p: "L'appairage a trois niveaux, de {plv:2232252} à {plv:2206987} de prix limite pour des bases de {base:2232252} à {base:2206987}. Le supplément d'accompagnement de classe A, en vigueur depuis le {date:2299799}, a une base et un prix limite de {base:2299799} : la Sécurité sociale en rembourse {secu:2299799}.",
        p2027:
          "L'appairage a trois niveaux, de {plv:2232252} à {plv:2206987} de prix limite pour des bases de {base:2232252} à {base:2206987}. Le supplément d'accompagnement de classe A, en vigueur depuis le {date:2299799}, a une base et un prix limite de {base:2299799}.",
        source_ids: ["lpp-cnam-v910"],
      },
      {
        p: "Pour l'appairage et le supplément pour verres teintés, la base LPP lue ne précise pas le panier : l'outil n'affiche pas de part de la complémentaire pour ces codes.",
        source_ids: ["lpp-cnam-v910"],
      },
    ],
    voisins: ["montures", "verre-unifocal-classe-a", "aides-auditives"],
    articles: ["tiers-payant-opticien", "checklist-prise-en-charge"],
    outilsLies: ["codes-rejet"],
  },
  {
    slug: "aides-auditives",
    nom: "Aide auditive",
    metier: "audio",
    categories: [
      "aide auditive classe I plus de 20 ans",
      "aide auditive classe I 20 ans et moins",
      "aide auditive classe II plus de 20 ans",
      "aide auditive classe II 20 ans et moins",
    ],
    forme: "mixte",
    titre: "Aide auditive classe I ou II : remboursement et mutuelle",
    description:
      "Aide auditive classe I ou II, avant ou après 20 ans : base de remboursement, part Sécu, prix limite, plafond de 1 700 € et calcul pour un code LPP.",
    h1: "Aide auditive classe I ou II : base de remboursement et part mutuelle",
    surTitre: "Audio · classes I et II · code LPP",
    intertitres: {
      calcul: "Calculer le remboursement d'une aide auditive",
      tableau: "Les {n} codes LPP des aides auditives",
      tranches: "Selon l'âge, la classe et l'oreille",
      texte: "Renouvellement et essai",
    },
    reponse: {
      connu: [
        "En classe I (100 % Santé), la base est de {base:2351057} pour les plus de 20 ans et de {base:2325120} pour les 20 ans et moins : la Sécurité sociale en rembourse {taux} %, et un contrat responsable paie le reste jusqu'au prix limite ({plv:2351057} ou {plv:2325120}).",
        "En classe II, la base est la même et le prix libre ; la prise en charge d'un contrat responsable est plafonnée à {plafond:2341840} par aide auditive, Sécurité sociale comprise.",
      ],
      nonPublie: [
        "Le décret ne change ni la base ({base:2351057} ou {base:2325120}) ni le prix limite de la classe I ; en classe I et en contrat responsable, le patient ne paie rien jusqu'à ce prix.",
      ],
    },
    parties: {
      base: [
        {
          libelle: "plus de 20 ans",
          categories: [
            "aide auditive classe I plus de 20 ans",
            "aide auditive classe II plus de 20 ans",
          ],
        },
        {
          libelle: "20 ans et moins",
          categories: [
            "aide auditive classe I 20 ans et moins",
            "aide auditive classe II 20 ans et moins",
          ],
        },
      ],
      prixLimite: [
        {
          libelle: "classe I, plus de 20 ans",
          categories: ["aide auditive classe I plus de 20 ans"],
        },
        {
          libelle: "classe I, 20 ans et moins",
          categories: ["aide auditive classe I 20 ans et moins"],
        },
        {
          libelle: "classe II",
          categories: [
            "aide auditive classe II plus de 20 ans",
            "aide auditive classe II 20 ans et moins",
          ],
        },
      ],
      reste: [
        {
          libelle: "classe I",
          categories: [
            "aide auditive classe I plus de 20 ans",
            "aide auditive classe I 20 ans et moins",
          ],
        },
        {
          libelle: "classe II",
          categories: [
            "aide auditive classe II plus de 20 ans",
            "aide auditive classe II 20 ans et moins",
          ],
        },
      ],
    },
    texte: [
      {
        p: "La LPP distingue chaque oreille : un code par côté, par classe et par âge (plus de 20 ans, 20 ans et moins). La base de {base:2325120} s'applique aussi, sans limite d'âge, aux personnes atteintes de cécité ou d'un handicap visuel.",
        source_ids: ["lpp-cnam-v910", "ameli-audio"],
      },
      {
        p: "Le renouvellement est pris en charge après 4 ans, comptés entre les dates de facturation de l'aide précédente et de la nouvelle. La facture suit un essai d'au moins 30 jours : la délivrance, et le tiers payant, interviennent à la fin de l'essai.",
        source_ids: ["ameli-audio"],
      },
    ],
    voisins: ["prestations-optique", "montures"],
    articles: ["reste-a-charge-drees-expliquer-devis"],
    outilsLies: ["mutuelle-portail"],
  },
  // Groupes sans page (lignes du hub seulement).
  {
    slug: "verres-freinateurs-myopie",
    nom: "Verres freinateurs de myopie",
    metier: "optique",
    categories: ["verre unifocal freinateur de myopie"],
  },
  {
    slug: "couronnes-dentaires",
    nom: "Couronnes dentaires",
    metier: "dentaire",
    categories: [
      "couronne 100 % Santé",
      "couronne à tarif maîtrisé",
      "couronne transitoire 100 % Santé",
      "couronne transitoire à tarif maîtrisé",
    ],
  },
  {
    slug: "bridges-dentaires",
    nom: "Bridges dentaires",
    metier: "dentaire",
    categories: ["bridge 100 % Santé", "bridge à tarif maîtrisé", "bridge"],
  },
  {
    slug: "inlay-core",
    nom: "Inlay-core et inlay-onlay",
    metier: "dentaire",
    categories: ["inlay-core 100 % Santé", "inlay-core à tarif maîtrisé", "inlay-onlay"],
  },
  {
    slug: "protheses-dentaires-amovibles",
    nom: "Prothèses dentaires amovibles",
    metier: "dentaire",
    categories: [
      "prothèse amovible résine",
      "prothèse amovible de transition",
      "prothèse amovible châssis métallique",
      "réparation de prothèse amovible",
    ],
  },
  {
    slug: "medicaments",
    nom: "Médicaments",
    metier: "pharmacie",
    categories: [
      "médicament remboursé à 100 %",
      "médicament remboursé à 65 %",
      "médicament remboursé à 30 %",
      "médicament remboursé à 15 %",
    ],
  },
];

/** Le groupe d'un slug. @param {string} slug */
export const groupe = (slug) => GROUPES.find((g) => g.slug === slug);

/** Le groupe (ou le groupe hors page) d'une catégorie de donnees.json, ou undefined. @param {string} categorie */
export function groupeDeCategorie(categorie) {
  return (
    GROUPES.find((g) => g.categories.includes(categorie)) ??
    HORS_GROUPE.find((g) => g.categories.includes(categorie))
  );
}

/** Un groupe peut-il avoir une page ? Il lui faut ses textes écrits (titre, description, H1, texte). */
export const groupeRedige = (g) => Boolean(g?.titre && g.description && g.h1 && g.texte?.length);
