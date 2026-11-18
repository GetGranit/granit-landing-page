// Les textes du hub /outils/remboursement et des blocs communs (textes.md § 1 et § 2), avec leurs
// sources. Les montants sont des repères (voir groupes.mjs), remplacés par les valeurs de
// donnees.json au rendu : rien n'est écrit en dur, et rien de la part Sécu n'est affiché à partir du
// 01/01/2027 tant que le taux 2027 n'est pas publié (variantes `p2027`).
// ESM pur, sans import de donnees.json.

/** En-tête et balises du hub (textes.md § 1.1). */
export const HUB = {
  titre: "Remboursement par code LPP : base Sécu et part mutuelle",
  description:
    "Pour chaque code LPP d'optique et d'audio : base de remboursement, part Sécu, ticket modérateur et part de la mutuelle en 100 % Santé, au tarif daté.",
  titreH1: "Base de remboursement et part mutuelle,",
  accent: "code par code",
  chapeau:
    "Tapez un code de la liste des produits et prestations (LPP) ou cherchez un équipement : verre, monture, aide auditive. Vous lisez la base de remboursement, la part de la Sécurité sociale, le ticket modérateur et ce qui revient à la complémentaire, d'après la base LPP de l'Assurance Maladie.",
};

/** Recherche du hub (textes.md § 1.2). */
export const RECHERCHE = {
  libelle: "Code LPP ou équipement",
  placeholder: "2263287, verre progressif…",
  aide: "Le code à 7 chiffres du devis ou de la facture.",
  unite: ["code", "codes"],
};

/** Phrase « fait foi » (textes.md § 1.3) : la version et la date viennent de la source LPP. */
export const FAIT_FOI =
  "Ces montants viennent de la base LPP de l'Assurance Maladie (version {version} du {datelpp}), qui fait foi. Un code par fabricant reprend en général les montants de son code générique.";

/** Fourchette du décret n° 2026-810 pour la part Sécu de la LPP au 01/01/2027 (formules.md § 5). */
export const FOURCHETTE_LPP_2027 = "entre 40 et 50 %";

/** Code d'exemple des textes (verre unifocal classe A, sphère ]0 ; −2,00]). */
export const CODE_EXEMPLE = "2263287";
/** Monture de l'exemple de la FAQ (monture adulte classe A). */
export const MONTURE_EXEMPLE = "2222124";

/**
 * Le bandeau « 2027 » (textes.md § 1.3), selon le régime du taux LPP. Sources : décret n° 2026-810,
 * R160-5 au 01/01/2027, R871-2 (+ la source du taux 2027 quand il est publié).
 */
export const BANDEAU_2027 = {
  avant: {
    titre: "Au 1er janvier 2027",
    texte:
      "La part de la Sécurité sociale sur les produits de la LPP (optique, aides auditives) va baisser : le taux, aujourd'hui de {taux:2263287} %, sera compris " +
      FOURCHETTE_LPP_2027 +
      " (décret n° 2026-810 du 21 août 2026). Le taux exact n'était pas publié au {verifie}. Le décret ne change ni la base ni le prix limite ; en 100 % Santé, le reste à charge reste nul en contrat responsable : c'est la part de la complémentaire qui augmente.",
  },
  nonPublie: {
    titre: "Depuis le 1er janvier 2027",
    texte:
      "Depuis le 1er janvier 2027, la part de la Sécurité sociale sur la LPP est comprise " +
      FOURCHETTE_LPP_2027 +
      " (décret n° 2026-810). Le taux exact n'est pas encore publié : nous n'affichons pas de montant Sécu.",
  },
  publie: {
    titre: "Depuis le 1er janvier 2027",
    texte:
      "Depuis le 1er janvier 2027, la part de la Sécurité sociale sur les produits de la LPP (optique, aides auditives) est de {taux:2263287} % de la base (décret n° 2026-810). Le décret ne change ni la base ni le prix limite ; en 100 % Santé, le reste à charge reste nul en contrat responsable.",
  },
  source_ids: ["decret-2026-810", "css-r160-5-2027", "css-r871-2"],
};

/** Texte de méthode du hub (textes.md § 1.6) : un <h2> par section. */
export const METHODE = [
  {
    id: "calcul",
    titre: "Comment se calcule un remboursement",
    p: [
      {
        p: "La Sécurité sociale rembourse un pourcentage de la base de remboursement : {taux:2263287} % pour l'optique et les aides auditives {datetaux:2263287}. Le reste de la base est le ticket modérateur. Exemple lu dans la base LPP : le verre unifocal de classe A « {desig:2263287} » (code 2263287) a une base de {base:2263287} ; la Sécurité sociale rembourse {secu:2263287}, le ticket modérateur est de {tm:2263287}.",
        p2027:
          "La Sécurité sociale rembourse un pourcentage de la base de remboursement ; le reste de la base est le ticket modérateur. Depuis le 1er janvier 2027, ce pourcentage est compris " +
          FOURCHETTE_LPP_2027 +
          " pour l'optique et les aides auditives (décret n° 2026-810), et le taux exact n'est pas encore publié : nous n'affichons pas de montant Sécu. Exemple lu dans la base LPP : le verre unifocal de classe A « {desig:2263287} » (code 2263287) a une base de {base:2263287}.",
        source_ids: ["ameli-taux", "lpp-cnam-v910"],
      },
    ],
  },
  {
    id: "cent-pour-cent-sante",
    titre: "100 % Santé et prix limite de vente",
    p: [
      {
        p: "En classe A (optique) et en classe I (aides auditives), le prix ne peut pas dépasser le prix limite de vente fixé par la LPP. Jusqu'à ce prix, un contrat responsable prend en charge le ticket modérateur et tout ce qui dépasse la base : le patient ne paie rien. Pour le verre 2263287 facturé {plv:2263287}, la complémentaire paie {compl:2263287}. Sans complémentaire, ou avec un contrat non responsable, ce reste à charge nul n'est pas garanti.",
        p2027:
          "En classe A (optique) et en classe I (aides auditives), le prix ne peut pas dépasser le prix limite de vente fixé par la LPP. Jusqu'à ce prix, un contrat responsable prend en charge le ticket modérateur et tout ce qui dépasse la base : le patient ne paie rien. Sans complémentaire, ou avec un contrat non responsable, ce reste à charge nul n'est pas garanti.",
        source_ids: ["lpp-cnam-v910", "css-r871-2", "ameli-optique"],
      },
    ],
  },
  {
    id: "hors-100-sante",
    titre: "Hors 100 % Santé",
    p: [
      {
        p: "En classe B et en classe II, le prix est libre. Un contrat responsable doit couvrir au moins le ticket modérateur ; au-delà, tout dépend du contrat, dans des plafonds fixés par l'article R871-2 du Code de la sécurité sociale : {plafond:2264861} pour une monture, {plafond:2341840} par aide auditive, Sécurité sociale comprise. Pour les verres, les plafonds dépendent de catégories (verres simples, complexes) que les textes lus ne relient pas aux codes LPP : l'outil n'en affiche pas.",
        source_ids: ["css-r871-2"],
      },
    ],
  },
  {
    id: "codes-fabricant",
    titre: "Codes génériques et codes par fabricant",
    p: [
      {
        p: "Les montants de l'outil sont ceux des codes génériques de la LPP, qui commencent par 2. Un code par fabricant, qui commence par 7, reprend, souvent en abrégé, la désignation d'un code générique suivie du nom du fabricant, en général avec les mêmes montants : cherchez sa désignation pour les retrouver.",
        source_ids: ["lpp-cnam-v910"],
      },
    ],
  },
  {
    id: "limites",
    titre: "Ce que l'outil ne calcule pas",
    p: [
      {
        p: "Les cas où le taux de la Sécurité sociale diffère : affection de longue durée, Complémentaire santé solidaire, accident du travail ou maladie professionnelle, maternité, régime local d'Alsace-Moselle, régime des Mines. Ni la part réelle d'un contrat au-delà de ces minimums : elle dépend du contrat.",
        source_ids: ["ameli-taux", "css-r871-2"],
      },
    ],
  },
];

/** FAQ du hub (textes.md § 2), avec FAQPage (hub seulement). */
export const FAQ = [
  {
    question: "Combien rembourse la Sécurité sociale pour une monture de classe A ?",
    p: "{secu:2222124} : la base de remboursement d'une monture de classe A, adulte ou enfant, est de {base:2222124}, remboursée à {taux:2222124} % (taux {datetaux:2222124}). Le prix limite de vente est de {plv:2222124} ; en contrat responsable, la complémentaire paie les {compl:2222124} restants et le patient ne paie rien.",
    p2027:
      "Depuis le 1er janvier 2027, le nouveau taux de la Sécurité sociale n'est pas encore publié : nous n'affichons pas sa part. La base de remboursement d'une monture de classe A, adulte ou enfant, est de {base:2222124} et le prix limite de vente de {plv:2222124} ; en contrat responsable, le patient ne paie rien jusqu'à ce prix.",
    source_ids: ["lpp-cnam-v910", "ameli-taux", "css-r871-2"],
  },
  {
    question: "Qu'est-ce que le prix limite de vente ?",
    p: "C'est le prix maximal qu'un professionnel peut facturer pour un produit du 100 % Santé, fixé par la LPP : classe A en optique, classe I en audio. Jusqu'à ce prix, un contrat responsable prend en charge tout ce que la Sécurité sociale ne rembourse pas. Sans complémentaire, ou avec un contrat non responsable, le reste à charge nul n'est pas garanti.",
    source_ids: ["lpp-cnam-v910", "css-r871-2"],
  },
  {
    question: "Peut-on associer des verres de classe A et une monture de classe B ?",
    p: "Oui. La monture et les verres peuvent être de classes différentes. Les deux verres, eux, doivent être de la même classe.",
    source_ids: ["ameli-optique"],
  },
  {
    question: "La part de la Sécurité sociale sur les lunettes change-t-elle en 2027 ?",
    // Avant le 01/01/2027 ; les deux variantes suivantes s'appliquent après (selon que le taux est publié).
    p:
      "Oui. Le décret n° 2026-810 du 21 août 2026 fait passer la participation de l'assuré sur les produits de la LPP (optique, aides auditives) de 40 à 50 % à 50 à 60 % au 1er janvier 2027 : la part de la Sécurité sociale sera comprise " +
      FOURCHETTE_LPP_2027 +
      ", au lieu de {taux:2263287} %. Le taux exact n'était pas publié au {verifie}. Le décret ne change ni la base ni le prix limite ; en 100 % Santé, la complémentaire d'un contrat responsable prend la différence.",
    apres: {
      nonPublie:
        "Oui. Depuis le 1er janvier 2027, le décret n° 2026-810 du 21 août 2026 fait passer la participation de l'assuré sur les produits de la LPP (optique, aides auditives) à 50 à 60 % : la part de la Sécurité sociale est comprise " +
        FOURCHETTE_LPP_2027 +
        ". Le taux exact n'est pas encore publié. Le décret ne change ni la base ni le prix limite ; en 100 % Santé, la complémentaire d'un contrat responsable prend la différence.",
      publie:
        "Oui. Depuis le 1er janvier 2027 (décret n° 2026-810 du 21 août 2026), la part de la Sécurité sociale sur les produits de la LPP (optique, aides auditives) est de {taux:2263287} % de la base. Le décret ne change ni la base ni le prix limite ; en 100 % Santé, la complémentaire d'un contrat responsable prend la différence.",
    },
    source_ids: ["decret-2026-810", "css-r160-5-2027", "css-r871-2"],
  },
  {
    question: "Pourquoi le code LPP du devis commence-t-il par 7 ?",
    p: "C'est un code par fabricant. Il reprend, souvent en abrégé, la désignation d'un code générique, qui commence par 2, suivie du nom du fabricant, en général avec les mêmes montants. Cherchez la désignation (« verre unifocal classe A ») pour retrouver la base et le prix limite.",
    source_ids: ["lpp-cnam-v910"],
  },
];

/** La carte Granit (textes.md § 1.7), verbes de la colonne « on dit » de TON.md. */
export const TEXTE_PONT =
  "La prise en charge saisie, la facture envoyée, le virement de la mutuelle pointé : les agents Granit s'en chargent, dans les logiciels que vos équipes utilisent déjà.";

/** Articles liés du hub (textes.md § 4.2) et liens vers les autres outils. */
export const ARTICLES_HUB = [
  "tiers-payant-opticien",
  "virement-mutuelle-inferieur",
  "reste-a-charge-drees-expliquer-devis",
];
export const OUTILS_LIES = {
  "mutuelle-portail": "Où faire la prise en charge de la part mutuelle",
  "codes-rejet": "Un rejet de taux ou de prix unitaire",
};

/**
 * Messages de l'état vide et de la page introuvable (textes.md § 1.4 et § 1.5), selon la forme de
 * la requête. `lien` : la source ou l'article vers lequel orienter.
 */
export const ETAT_VIDE = {
  fabricant:
    "Les codes qui commencent par 7 sont des codes par fabricant : ils reprennent en général la désignation et les montants d'un code générique, qui commence par 2. Cherchez la désignation (« verre unifocal classe A ») ou retrouvez le code générique dans la base LPP.",
  inconnu:
    "Ce code n'est pas un code générique d'optique ou d'audio de la base LPP du {datelpp}. Vérifiez-le dans la base LPP de l'Assurance Maladie.",
  ccam: "Le dentaire n'est pas encore dans l'outil. Les honoraires limites des prothèses sont publiés par l'Assurance Maladie.",
  cip: "Les médicaments ne sont pas dans l'outil. La base de données publique des médicaments donne le prix et le taux de chaque boîte.",
  texte:
    "Aucun équipement ne correspond à « {q} ». Essayez « verre », « monture », « progressif », « aide auditive » ou le code à 7 chiffres.",
  page: "Cette page n'existe pas. Les pages de l'outil portent sur un groupe d'équipements : verres unifocaux, multifocaux ou progressifs de classe A, verres de classe B, montures, prestations, aides auditives.",
};

/**
 * La forme d'une requête (ou d'un slug inconnu), pour choisir le message.
 * @param {string} q
 * @returns {"fabricant" | "inconnu" | "ccam" | "cip" | "texte"}
 */
export function formeRequete(q) {
  const t = String(q ?? "")
    .trim()
    .replace(/^(?:lpp|ccam|cip)[\s:-]*/i, "")
    .replace(/[\s.-]/g, "");
  if (/^7\d{6}$/.test(t)) return "fabricant";
  if (/^\d{7}$/.test(t)) return "inconnu";
  if (/^[a-z]{4}\d{3}$/i.test(t)) return "ccam";
  if (/^34\d{11}$/.test(t)) return "cip";
  return "texte";
}

/**
 * Le code à préremplir dans la recherche de la page introuvable, tiré du slug :
 * « lpp-7227824-verre » → « 7227824 », « ccam-hbld634 » → « HBLD634 », sinon le slug en mots.
 * @param {string} slug
 */
export function requeteDuSlug(slug) {
  const s = String(slug ?? "");
  const lpp = s.match(/(?:^|-)(\d{7})(?:-|$)/);
  if (lpp) return lpp[1];
  const ccam = s.match(/^ccam-([a-z]{4}\d{3})/i);
  if (ccam) return ccam[1].toUpperCase();
  return s.replace(/-/g, " ").trim();
}

/**
 * Le paramètre `?q=` du hub tel que le routeur le donne : il lit les valeurs comme du JSON, donc
 * `?q=2263287` arrive en nombre. On garde le nombre tel quel (le réécrire en texte changerait l'URL
 * et provoquerait une redirection 307 vers le hub sans filtre) ; la page le convertit en texte.
 * @param {unknown} v
 * @returns {string | number | undefined}
 */
export function lireRequeteUrl(v) {
  if (typeof v === "string") return v || undefined;
  if (typeof v === "number" && Number.isFinite(v)) return v;
  return undefined;
}
