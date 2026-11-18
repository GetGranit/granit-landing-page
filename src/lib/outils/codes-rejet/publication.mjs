// Ce que Paul règle d'une ligne pour l'outil A (codes rejet). Chaque constante dit la décision
// attendue et son effet chiffré (comptes calculés par les tests de tests/outils/codes-rejet.test.ts).
// Les textes (libellés courts, résumés) viennent de outils-nuit/A/textes.md § 3.1, sans retouche.
import { SEUIL_DEFAUT } from "../socle/mots.mjs";

/**
 * Décision de Paul n° 1 : les ARL négatifs et les messages de service viennent du cahier des
 * charges du GIE SESAM-Vitale, qui demande son accord pour toute reproduction, même partielle.
 * Une seule constante pour les deux familles :
 *   { liste: false, pages: false }  fermé (défaut) : ni ligne du hub, ni page, ni redirection vers une page ;
 *   { liste: true,  pages: false }  la liste seulement (courte citation) : + 83 lignes (30 ARL, 53 messages) ;
 *   { liste: true,  pages: true  }  tout ouvert, après accord du GIE : + 83 lignes et + 1 page
 *                                   (arl-2004-certificat-vitale, seul ARL au-dessus du seuil).
 */
export const GIE_SESAM_VITALE = { liste: false, pages: false };

/** Familles de données : `liste` = lignes du hub, `pages` = pages d'entrée. */
export const FAMILLES = {
  noemie: { liste: true, pages: true },
  arl: GIE_SESAM_VITALE,
  "sesam-vitale": GIE_SESAM_VITALE,
  // amc-tiers-payant et autre : aucune entrée sûre (OCT Résopharma, 2013), jamais listées.
};

/**
 * Décision de Paul n° 2 : le seuil de contenu. 100 mots propres dédupliqués (défaut du socle) :
 * 20 pages NOEMIE (0650001 en a 99, 0480054 97). 120 : 12 pages. 150 (seo.md, compté de la même
 * façon) : 3 pages (0450054, 0450072, 0180051).
 */
export const SEUIL_MOTS_PROPRES = SEUIL_DEFAUT;

/** Taille de la vague publiée. */
export const PAGES_MAX = 25;

/**
 * Ordre de publication (fréquence dans les mémos des CPAM, questions.md) ; hors de cette liste,
 * jamais de page. noemie-2600650 reste dans la liste : passé « à vérifier » (sa seule source vise
 * les établissements publics), il aura sa page dès qu'une source le confirme pour un des 5 métiers.
 * Les ARL n'ont d'effet que si GIE_SESAM_VITALE.pages est vrai.
 */
export const PRIORITE = [
  "noemie-0450056",
  "noemie-0450054",
  "noemie-0250050",
  "noemie-0270051",
  "noemie-0700060",
  "noemie-0460051",
  "noemie-2900005",
  "noemie-0180051",
  "noemie-traitement-caisse",
  "noemie-0470049",
  "noemie-0460053",
  "noemie-0650001",
  "noemie-0450072",
  "noemie-0450082",
  "noemie-0730055",
  "noemie-0480054",
  "noemie-0600064",
  "noemie-0600069",
  "noemie-0450097",
  "noemie-2900230",
  "noemie-2600649",
  "noemie-2600650",
  "noemie-2600710",
  "noemie-4000057",
  "noemie-4000055",
  "noemie-4000067",
  "noemie-4000072",
  "noemie-0100052",
  "arl-2004",
  "arl-2004-certificat-vitale",
  "arl-2502",
  "arl-3001",
  "arl-4003",
  "arl-5001",
  "arl-5002",
];

/** Libellé court du <title> : 30 caractères au plus, fidèle au libellé officiel (textes.md § 3.1). */
export const LIBELLES_COURTS = {
  "noemie-0450054": "ETM non trouvée en BDO",
  "noemie-0450056": "ETM connue mais non transmise",
  "noemie-0450072": "exonération inconnue en BDO",
  "noemie-0450082": "ETM maternité non transmise",
  "noemie-0250050": "assuré absent de la BDO",
  "noemie-0270051": "bénéficiaire inconnu en BDO",
  "noemie-0700060": "écart taux demandé et calculé",
  "noemie-0460051": "prescripteur inconnu",
  "noemie-0460053": "prescripteur étab. inconnu",
  "noemie-0470049": "prescription interdite",
  "noemie-0730055": "exercice non valide à la date",
  "noemie-0480054": "type de contrat incompatible",
  "noemie-2900005": "facture déjà payée",
  "noemie-0180051": "facture déjà en traitement",
  "noemie-2900230": "facturations multiples",
  "noemie-0450097": "date d’examen non valide",
  "noemie-0600064": "bucco-dentaire absente",
  "noemie-0600069": "rubrique prévention absente",
  "noemie-2600710": "numéro de dent incompatible",
  "noemie-2600649": "code association différent",
  "noemie-2600650": "code association non renseigné",
  "noemie-0710060": "montant demandé supérieur",
  "noemie-0650001": "prix unitaire absent",
  "noemie-4000067": "prix au-dessus de l’opposable",
  "noemie-4000055": "prix supérieur à la base",
  "noemie-4000057": "quantité au-delà du seuil",
  "noemie-4000072": "vaccin grippe sans code 7",
  "noemie-0100052": "habilitation envoi de messages",
  // Ajoutés par dev-A (extraits du libellé officiel, pour que les deux ARL 2004 aient chacun leur
  // titre si la famille ARL ouvre) :
  "arl-2004": "FSE ou DRE non intègre",
  "arl-2004-certificat-vitale": "certificat vitale incorrect",
};

/** Ce que la caisse reproche, en une proposition tirée de `explication` (description, voisins). */
export const RESUMES = {
  "noemie-0450054": "la caisse ne retrouve pas l’exonération demandée",
  "noemie-0450056": "l’exonération connue de la caisse manque sur la facture",
  "noemie-0450072": "l’exonération de la carte Vitale est inconnue de la caisse",
  "noemie-0450082": "l’exonération maternité connue de la caisse manque",
  "noemie-0250050": "la caisse ne connaît pas l’assuré dans son fichier",
  "noemie-0270051": "l’assuré est connu, pas le bénéficiaire tel qu’il est saisi",
  "noemie-0700060": "le taux demandé n’est pas celui que calcule la caisse",
  "noemie-0460051": "le numéro du prescripteur est inconnu ou erroné",
  "noemie-0460053": "l’établissement prescripteur est inconnu du fichier national",
  "noemie-0470049": "le prescripteur ne pouvait pas prescrire à cette date",
  "noemie-0730055": "votre numéro n’est pas valide à la date des soins",
  "noemie-0480054": "le type de contrat complémentaire transmis diffère",
  "noemie-2900005": "une facture au même numéro a déjà été payée",
  "noemie-0180051": "une facture au même numéro est déjà en traitement",
  "noemie-2900230": "deux actes identiques le même jour pour le même patient",
  "noemie-0450097": "soins de suite M’T dents hors période ou avant l’examen",
  "noemie-0600064": "pas de prise en charge de prévention sous ce numéro",
  "noemie-0600069": "aucune prise en charge de prévention enregistrée",
  "noemie-2600710": "la dent indiquée ne correspond pas à l’acte CCAM",
  "noemie-2600649": "code association erroné ou actes non associables",
  "noemie-2600650": "le code association obligatoire n’a pas été transmis",
  "noemie-0710060": "le montant demandé dépasse le calcul de la caisse",
  "noemie-0650001": "le prix unitaire manque sur la facture",
  "noemie-4000067": "le prix transmis n’est plus celui en vigueur",
  "noemie-4000055": "le prix transmis dépasse celui de la base des médicaments",
  "noemie-4000057": "la quantité délivrée dépasse le seuil autorisé",
  "noemie-4000072": "vaccin antigrippal facturé sans le code prévention 7",
  "noemie-0100052": "vous n’êtes pas habilité à télétransmettre à cette caisse",
};

/**
 * Famille de rejet (classement de l'article codes-rejets-noemie). Ne sert qu'à choisir les
 * formulations (titres, intertitres, voisins, articles) : jamais affiché comme un fait.
 */
export const NATURES = {
  "noemie-0450054": "droits",
  "noemie-0450056": "droits",
  "noemie-0450072": "droits",
  "noemie-0450082": "droits",
  "noemie-0250050": "droits",
  "noemie-0270051": "droits",
  "noemie-0700060": "droits",
  "noemie-0480054": "droits",
  "noemie-0450097": "droits",
  "noemie-0600064": "droits",
  "noemie-0600069": "droits",
  "noemie-0460051": "identification",
  "noemie-0460053": "identification",
  "noemie-0470049": "identification",
  "noemie-0730055": "identification",
  "noemie-0100052": "identification",
  "noemie-0650001": "facture",
  "noemie-4000067": "facture",
  "noemie-4000055": "facture",
  "noemie-4000057": "facture",
  "noemie-4000072": "facture",
  "noemie-2600710": "facture",
  "noemie-2600649": "facture",
  "noemie-2600650": "facture",
  "noemie-0710060": "facture",
  "noemie-2900005": "transmission",
  "noemie-0180051": "transmission",
  "noemie-2900230": "transmission",
  "noemie-traitement-caisse": "attente",
};

/**
 * Articles liés d'une page (1 à 3 slugs /ressources), quand la règle de textes.md § 3.5 ne convient
 * pas. Vide : la règle s'applique partout (codes-rejets-noemie, puis selon la famille de rejet).
 */
export const ARTICLES = {};

/** Liens vers les autres outils (affichés seulement une fois l'outil visé fusionné). */
export const OUTILS_LIES = {
  "noemie-0650001": [
    { id: "remboursement", texte: "Vérifier la base et le prix limite d’un code LPP" },
  ],
};
