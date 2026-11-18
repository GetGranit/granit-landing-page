// Les textes fixes de l'outil C, repris de outils-nuit/C/textes.md (typographie déjà posée :
// espaces insécables avant « : ; ? ! » et dans « », apostrophe ’). Les textes propres à chaque
// mutuelle sont générés par src/lib/outils/mutuelle-portail/redaction.mjs, à partir des données.

/** En-tête du hub (textes.md § 1.1). */
export const ENTETE_HUB = {
  titre: "Quel portail de tiers payant",
  accent: "pour quelle mutuelle ?",
  chapeau:
    "Cherchez la complémentaire par son nom ou son numéro AMC (assurance maladie complémentaire) : vous voyez le portail relevé pour votre métier et la date du relevé. La carte de tiers payant du patient fait foi.",
};

/** Recherche et filtres (textes.md § 1.2). */
export const RECHERCHE = {
  libelle: "Nom de la mutuelle ou numéro AMC",
  placeholder: "Harmonie, MGEN, 0045900442…",
  aide: "Le numéro AMC est sur la carte de tiers payant.",
  unite: ["complémentaire", "complémentaires"] as [string, string],
};

/** L'encadré « Changements récents » du hub (textes.md § 1.3). À relire le 01/12/2026. */
export const CHANGEMENTS = {
  titre: "Changements récents · relevé du 18/11/2026",
  texte:
    "Oxantis a fermé le 26/10/2026 : Viamedis reprend l’optique et l’audioprothèse (Acuité, 16/09/2026). MGEN : optique et audio chez Viamedis depuis le 27/10/2026 ; iVoirNet annonce tout le tiers payant MGEN chez Viamedis à partir du 30/11/2026, à confirmer après cette date.",
  sourceIds: ["acuite-oxantis", "ivoirnet-mgen"],
};

/** La phrase de la carte Granit, sur le hub et les entrées (textes.md § 1.7). */
export const TEXTE_PONT =
  "Prises en charge saisies, factures suivies, relances faites : les agents Granit travaillent sur vos portails, comme le ferait une personne.";

/** Questions fréquentes du hub (textes.md § 2), avec FAQPage. */
export const FAQ = [
  {
    question: "Quelles mutuelles passent par iSanté ou SP santé ?",
    reponse:
      "Les deux opérateurs publient la liste des complémentaires ouvertes, métier par métier, avec leurs dates. L’annuaire les reprend : filtrez par opérateur et par métier. Les autres opérateurs, dont Viamedis et Almerys, ne publient pas de liste de leurs clients par métier ; pour eux, l’annuaire s’appuie sur les pages des complémentaires et la presse professionnelle.",
  },
  {
    question: "Pourquoi une même mutuelle a-t-elle deux portails ?",
    reponse:
      "Parce qu’elle peut confier chaque métier à un opérateur différent : la Mutuelle de Poitiers Assurances figure chez SP santé pour l’optique et chez iSanté pour les cliniques (listes publiques au 18/11/2026). La date compte aussi, quand une complémentaire change d’opérateur. La carte de tiers payant du patient désigne l’opérateur de chaque prestation.",
  },
  {
    question: "Le numéro AMC suffit-il à trouver le portail ?",
    reponse:
      "Il aide à retrouver la complémentaire dans les listes publiques, qui donnent un numéro AMC par libellé : vous pouvez le taper dans la recherche. Mais un même organisme peut avoir plusieurs libellés et plusieurs numéros (sept pour Mutualia chez iSanté), et c’est la carte qui désigne l’opérateur.",
  },
  {
    question: "Que faire si la mutuelle n’est pas dans l’annuaire ?",
    reponse:
      "Suivez la carte de tiers payant du patient : elle désigne l’opérateur de chaque prestation. Cherchez ensuite la complémentaire sur le portail de cet opérateur. Certaines complémentaires gèrent elles-mêmes une partie de leur tiers payant, comme Swiss Life pour l’hospitalisation.",
  },
  {
    question: "Ces données changent-elles ?",
    reponse:
      "Oui. Les listes de SP santé et d’iSanté sont mises à jour à chaque ouverture ou fermeture d’un segment, et des opérateurs ferment : Oxantis a cessé le 26/10/2026, Viamedis reprend l’optique et l’audioprothèse. Chaque ligne de l’annuaire porte la date de son relevé.",
  },
];

/** Articles liés du hub (textes.md § 4.2). */
export const ARTICLES_HUB = [
  "mutuelle-quel-portail",
  "portails-tiers-payant",
  "rejet-beneficiaire-inconnu",
];

/** Liens vers les deux autres outils (affichés seulement une fois ces outils fusionnés). */
export const OUTILS_LIES = [
  { id: "remboursement" as const, texte: "Combien la complémentaire prend en charge" },
  { id: "codes-rejet" as const, texte: "Un rejet de la part Sécurité sociale" },
];

/** États vides du hub (textes.md § 1.4). */
export const VIDE = {
  nom: (q: string) =>
    `«\u00a0${q}\u00a0» n’est pas dans notre relevé. Regardez la carte de tiers payant du patient\u00a0: elle désigne l’opérateur de chaque prestation, par son nom, son logo ou un code. Cherchez ensuite la mutuelle sur le portail de cet opérateur.`,
  numero: (date: string) =>
    `Ce numéro AMC n’est dans aucune des listes publiques relevées le ${date} (SP santé, iSanté). Regardez la carte de tiers payant\u00a0: elle désigne l’opérateur de chaque prestation.`,
  /** `complement` : « pour le dentaire », « chez Viamedis ». */
  masque: (noms: string, plusieurs: boolean, complement: string) =>
    `${noms} ${plusieurs ? "sont" : "est"} dans l’annuaire, sans portail relevé ${complement}.`,
  filtres: "Aucune complémentaire relevée avec ces deux filtres.",
  portails: "Les portails des opérateurs :",
  lireAmc: "Lire le numéro AMC sur la carte",
  signaler: { texte: "Signaler une mutuelle manquante", sujet: "Mutuelle manquante" },
};

/** Le métier du site dans une phrase (« sans portail relevé pour le dentaire »). */
export const METIER_PROSE: Record<string, string> = {
  optique: "l’optique et l’audio",
  dentaire: "le dentaire",
  centres: "les centres de santé",
  pharmacie: "la pharmacie",
  cliniques: "les cliniques et laboratoires",
};

/** Page introuvable (textes.md § 1.5). */
export const INTROUVABLE =
  "Nous n’avons pas de page pour cette complémentaire. Cherchez-la dans l’annuaire par son nom, un autre nom ou son numéro AMC.";
