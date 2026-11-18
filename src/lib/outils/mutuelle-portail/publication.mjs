// Ce que Paul règle d'une ligne pour l'outil C (mutuelle → portail de tiers payant).
// Chaque constante dit la décision attendue (cadre.md § 13) et son effet, compté le 18/11/2026.
import { SEUIL_DEFAUT } from "../socle/mots.mjs";

/**
 * Décision n° 1 : où vit la page d'une mutuelle. Par défaut, une mutuelle qui a déjà une fiche
 * `/ressources/portail-<x>` n'a jamais de page d'outil : sa ligne du hub mène à la fiche et
 * `/outils/mutuelle-portail/<slug>` part en 301 vers elle. La fiche est trouvée seule dans le contexte du
 * site (`portail-<slug>`) ; cette table ne sert qu'aux slugs qui diffèrent de celui de la fiche.
 * 22 mutuelles ont une fiche aujourd'hui (21 slugs identiques + celle-ci).
 */
export const ALIAS_FICHES = { "la-mutuelle-familiale": "mutuelle-familiale" };

/**
 * Décision n° 2 : le seuil. 100 mots propres dédupliqués (défaut du socle) : le hub et 2 pages
 * (Mutualia, SMABTP). Les candidates relevées dans une seule liste tiennent en 45 à 65 mots propres :
 * descendre à 50 donnerait une vingtaine de pages presque identiques (déconseillé).
 */
export const SEUIL_MOTS_PROPRES = SEUIL_DEFAUT;

/** Taille de la vague publiée. */
export const PAGES_MAX = 25;

/**
 * Ordre de publication ; hors de cette liste, jamais de page. Les 26 complémentaires sûres sans fiche,
 * de la plus riche à la plus mince (cadre.md § 6). Une page n'existe que si l'entrée passe aussi le
 * seuil et a 2 voisins : allonger cette liste ne publie rien de plus tant que le relevé est mince.
 */
export const PRIORITE = [
  "mutualia",
  "smabtp",
  "abeille-assurances",
  "mutuelle-de-poitiers",
  "axa",
  "henner",
  "sigmage",
  "uneo",
  "mnh",
  "mutuelle-sg",
  "mutuelle-ratp",
  "gan",
  "gmf",
  "acm",
  "mcdef",
  "la-banque-postale-prevoyance",
  "ircem",
  "mutuelles-du-soleil",
  "mutuelle-sapeurs-pompiers",
  "territoria-mutuelle",
  "entis",
  "harmonie-fonction-publique",
  "cpcea-agrica",
  "apgis",
  "areas",
  "mapa",
];

/**
 * Décision n° 3 : les faits « à vérifier ». true : le hub montre les opérateurs `a_verifier` avec
 * « à confirmer sur la carte » et la raison (ex. MNT → Viamedis, déduit de la fermeture d'Oxantis),
 * jamais sur une page comme acquis. false : ces métiers n'affichent que « pas de source publique datée »
 * (44 couples mutuelle et métier, dans 19 entrées dont les 12 entièrement « à vérifier »).
 */
export const A_CONFIRMER_VISIBLE = true;

/** Noms courts, essayés dans les titres quand le nom complet dépasse 60 caractères (textes.md § 3.1). */
export const NOMS_COURTS = {
  "mutuelle-de-poitiers": "Mutuelle de Poitiers",
  "la-banque-postale-prevoyance": "La Banque Postale",
  "mutuelle-sapeurs-pompiers": "Mutuelle des Sapeurs-Pompiers",
  "harmonie-fonction-publique": "Harmonie Fonction Publique",
};

/** Le nom en milieu de phrase quand il prend un article, et s'il est pluriel (textes.md § 3.2). */
export const SUJETS = {
  "mutuelle-sg": ["la Mutuelle SG", false],
  "mutuelle-ratp": ["la Mutuelle RATP", false],
  "mutuelle-de-poitiers": ["la Mutuelle de Poitiers Assurances", false],
  "mutuelle-sapeurs-pompiers": ["la Mutuelle des Sapeurs-Pompiers de France", false],
  "mutuelles-du-soleil": ["les Mutuelles du Soleil", true],
  entis: ["Entis Mutuelles", true],
};

/**
 * La fiche /ressources de chaque opérateur (articles liés des pages, état vide du hub). Une fiche hors
 * ligne n'est jamais liée (le contexte du site le vérifie).
 */
export const FICHES_OPERATEURS = {
  viamedis: "portail-viamedis",
  almerys: "portail-almerys",
  "sp-sante": "portail-sp-sante",
  isante: "portail-isante",
  santeclair: "portail-santeclair",
  "carte-blanche": "portail-carte-blanche",
  actil: "portail-actil",
};

/** Le filtre « opérateur » du hub, dans cet ordre (textes.md § 1.2) : identifiant → libellé. */
export const OPERATEURS_FILTRE = [
  ["sp-sante", "SP santé"],
  ["isante", "iSanté"],
  ["viamedis", "Viamedis"],
  ["almerys", "Almerys"],
  ["carte-blanche", "Carte Blanche Partenaires"],
  ["santeclair", "Santéclair"],
  ["actil", "Actil"],
  ["korelio", "Korelio"],
  ["groupama-tpg", "GIE Groupama TPG"],
];
