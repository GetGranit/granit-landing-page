/**
 * Données et textes de la page /a-propos, FR et EN.
 *
 * Règle : faits sur les personnes = uniquement leurs profils LinkedIn (export PDF d'octobre 2026).
 * Aucun chiffre, aucun client, aucune date absents des sources. Tout manque est une valeur
 * `null` (affichée comme un TODO visible sur la page) ou un commentaire « TODO Paul : ».
 */

export type Lang = "fr" | "en";
type Txt = { fr: string; en: string };

/* ============================================================
   ÉQUIPE : ajouter un membre = ajouter une ligne ici.
   `photo` : chemin sous /public (ex. "/equipe/jenny.jpg"), sinon initiales.
   `fondateur: true` : repris dans les données structurées (Organization.founder).
   ============================================================ */
export type Membre = {
  nom: string;
  initiales: string;
  role: Txt;
  /** Intitulé court pour schema.org (jobTitle). */
  poste: string;
  fondateur: boolean;
  photo?: string;
  linkedin?: string;
  /** Écoles citées dans le profil (schema.org alumniOf). */
  ecoles?: string[];
  /** 1 à 2 lignes de parcours, factuelles (preuve d'expérience). */
  parcours: { fr: string[]; en: string[] };
};

// TODO Paul : vérifier les deux URL LinkedIn (coupées en fin de ligne dans les PDF).
export const equipe: Membre[] = [
  {
    nom: "Jenny Mansour",
    initiales: "JM",
    role: { fr: "CEO et cofondatrice", en: "CEO and co-founder" },
    poste: "CEO",
    fondateur: true,
    photo: "/equipe/jenny-mansour.jpg",
    linkedin: "https://www.linkedin.com/in/jenny-mansour-060016121",
    ecoles: ["École polytechnique", "HEC Paris"],
    parcours: {
      fr: [
        "Ex-Boston Consulting Group, détachée au ministère de la Santé (taskforce vaccins), puis directrice de BU Santé chez Galileo Global Education.",
        "École polytechnique, MSc X-HEC Entrepreneurs.",
      ],
      en: [
        "Former Boston Consulting Group, seconded to the French Ministry of Health (vaccine taskforce), then head of the Health business unit at Galileo Global Education.",
        "École polytechnique, MSc X-HEC Entrepreneurs.",
      ],
    },
  },
  {
    nom: "Corneille Marechal",
    initiales: "CM",
    role: { fr: "CTO et cofondateur", en: "CTO and co-founder" },
    poste: "CTO",
    fondateur: true,
    photo: "/equipe/corneille-marechal.jpg",
    linkedin: "https://www.linkedin.com/in/corneille-marechal-43a210199",
    ecoles: ["École polytechnique", "HEC Paris"],
    parcours: {
      fr: [
        "Premier salarié et founding engineer d'apiday, puis engineering manager d'une squad qui mettait des fonctionnalités IA en production.",
        "École polytechnique, MSc X-HEC Entrepreneurs.",
      ],
      en: [
        "First employee and founding engineer at apiday, then engineering manager of a squad shipping AI features to production.",
        "École polytechnique, MSc X-HEC Entrepreneurs.",
      ],
    },
  },
];

/* ============================================================
   CHIFFRES : `valeur: null` = TODO visible sur la page. Aucun chiffre sans source.
   ============================================================ */
// TODO Paul : remplir les 4 chiffres (et leur source) ou retirer la ligne.
export const chiffres: { valeur: string | null; libelle: Txt }[] = [
  { valeur: null, libelle: { fr: "PEC déposées", en: "Coverage requests filed" } },
  { valeur: null, libelle: { fr: "magasins équipés", en: "stores equipped" } },
  { valeur: null, libelle: { fr: "portails mutuelles couverts", en: "insurer portals covered" } },
  { valeur: null, libelle: { fr: "métiers de santé", en: "healthcare professions" } },
];

/* ============================================================
   HISTOIRE : seule l'étape 2026 est sourcée (début des postes chez Granit : mars 2026).
   `annee: null` ou `todo: true` = étape à compléter, affichée comme TODO.
   ============================================================ */
// TODO Paul : date exacte de création (immatriculation), premiers magasins, étapes suivantes.
export const histoire: { annee: string | null; titre: Txt; texte: Txt; todo?: boolean }[] = [
  {
    annee: "2026",
    titre: { fr: "Les débuts de Granit", en: "Granit begins" },
    texte: {
      fr: "Jenny Mansour et Corneille Marechal se consacrent à Granit depuis mars 2026.",
      en: "Jenny Mansour and Corneille Marechal have been working on Granit since March 2026.",
    },
  },
  {
    annee: null,
    todo: true,
    titre: { fr: "Premiers magasins d'optique équipés", en: "First optical stores equipped" },
    texte: { fr: "Date et détail à compléter.", en: "Date and details to complete." },
  },
  {
    annee: null,
    todo: true,
    titre: { fr: "Étape suivante", en: "Next milestone" },
    texte: { fr: "À compléter.", en: "To complete." },
  },
];

export const content = {
  fr: {
    eyebrow: "À propos de Granit",
    title: "Les agents IA qui gèrent le tiers payant des magasins et cabinets de santé.",
    // Phrase « façon Vocca » : la date de création est un TODO (affichée à part).
    heroAvant: "Fondée en",
    heroApres:
      "par Jenny Mansour et Corneille Marechal, Granit conçoit des agents IA qui gèrent le tiers payant, les prises en charge, les rejets et les relances, directement dans les outils des équipes.",
    heroDateTodo: "date",
    photoAlt: "L'équipe Granit dans ses bureaux à Paris",
    // Réponse citable à « Qu'est-ce que Granit ? » (40-60 mots) : sert aux données structurées.
    lead: "Granit est une entreprise basée à Paris qui conçoit des agents IA pour l'administratif des magasins et cabinets de santé. Les agents gèrent le tiers payant, les prises en charge, les rejets et les relances, dans les outils que les équipes utilisent déjà. Granit commence par l'optique, puis s'étend au dentaire, à l'audioprothèse et aux autres métiers de santé.",
    chiffresTitre: "Granit en chiffres",
    problemeTitre: "Pourquoi Granit",
    probleme: [
      "Les équipes des magasins et cabinets de santé passent des heures chaque jour sur des tâches répétitives : vérification des droits, demandes de prise en charge, télétransmission, traitement des rejets, relances des impayés. Pendant ce temps, les patients attendent. Les remboursements aussi.",
      "Granit déploie des agents IA qui prennent ces tâches en charge. Ils travaillent dans le navigateur, sur les portails et logiciels déjà en place : pas de projet informatique, pas de changement d'outil pour l'équipe.",
    ],
    convictionsTitre: "Nos convictions",
    convictions: [
      {
        t: "Dans vos outils, pas à côté",
        d: "Les agents travaillent dans le navigateur, sur les portails mutuelles et les logiciels déjà en place. Pas de projet d'intégration, pas de nouvel outil à apprendre.",
      },
      {
        t: "Spécialisés métier",
        d: "Chaque mutuelle et chaque portail a ses règles, ses pièces et ses motifs de rejet. Les agents sont construits pour ces règles, métier par métier, en commençant par l'optique.",
      },
      {
        t: "L'agent prépare, l'humain valide",
        d: "Les agents font le travail répétitif et préparent les dossiers. L'équipe garde la main et valide ce qui part.",
      },
    ],
    histoireTitre: "Notre histoire",
    equipeTitre: "L'équipe",
    equipeIntro:
      "Granit a été cofondé par Jenny Mansour et Corneille Marechal, tous deux diplômés de l'École polytechnique et du MSc X-HEC Entrepreneurs.",
    linkedin: "LinkedIn",
    capTitre: "Notre cap",
    cap: [
      {
        t: "Plus de métiers",
        d: "Après l'optique : le dentaire, l'audioprothèse et les autres professionnels de santé qui gèrent du tiers payant.",
        todo: false,
      },
      {
        t: "Plus de portails et de logiciels",
        d: "Chaque portail mutuelle ou logiciel métier couvert élargit ce que les agents peuvent faire.",
        // TODO Paul : priorités / prochains portails si on veut les afficher.
        todo: true,
      },
      {
        t: "Tout ce qui ne soigne pas",
        d: "Au-delà du tiers payant : recouvrement, relances et le reste de l'administratif.",
        todo: false,
      },
    ],
    faqTitle: "Questions fréquentes",
    faq: [
      {
        q: "Qui est derrière Granit ?",
        a: "Granit a été cofondé par Jenny Mansour, CEO, et Corneille Marechal, CTO. Jenny Mansour a travaillé au Boston Consulting Group, au ministère des Solidarités et de la Santé et chez Galileo Global Education. Corneille Marechal a été le premier salarié et founding engineer d'apiday.",
      },
      {
        q: "Où sont hébergées les données ?",
        a: "L'hébergement, le chiffrement, les accès et la réversibilité des données de santé sont décrits sur la page Sécurité.",
        lien: { to: "/securite" as const, label: "Voir la page Sécurité" },
      },
      {
        q: "Pour quels métiers de santé ?",
        a: "Granit commence par les magasins d'optique. Les agents s'étendent au dentaire, à l'audioprothèse et aux autres professionnels de santé qui gèrent du tiers payant.",
      },
      {
        q: "Depuis quand Granit existe-t-il ?",
        a: "Jenny Mansour et Corneille Marechal se consacrent à Granit depuis mars 2026.",
      },
    ],
    ctaTitre: "Parlons de votre tiers payant",
    ctaTexte: "15 minutes en visio : on vous montre les agents Granit au travail, sur vos cas.",
    ctaBouton: "Voir une démo du produit",
  },
  en: {
    eyebrow: "About Granit",
    title: "AI agents that handle third-party payment for healthcare stores and practices.",
    heroAvant: "Founded in",
    heroApres:
      "by Jenny Mansour and Corneille Marechal, Granit builds AI agents that handle third-party payment, coverage requests, rejections and follow-ups, directly inside the teams' tools.",
    heroDateTodo: "date",
    photoAlt: "The Granit team in its Paris office",
    lead: "Granit is a Paris-based company building AI agents for the administrative work of healthcare stores and practices. The agents handle third-party payment, coverage requests, rejections and follow-ups, directly inside the tools teams already use. Granit starts with optical stores, then expands to dental, hearing care and other healthcare professions.",
    chiffresTitre: "Granit in numbers",
    problemeTitre: "Why Granit",
    probleme: [
      "Teams in healthcare stores and practices spend hours every day on repetitive work: eligibility checks, coverage requests, claim transmission, rejections, unpaid follow-ups. Meanwhile, patients wait. Reimbursements wait too.",
      "Granit deploys AI agents that take over these tasks. They work in the browser, on the portals and software already in place: no IT project, no new tool for the team.",
    ],
    convictionsTitre: "What we believe",
    convictions: [
      {
        t: "Inside your tools, not next to them",
        d: "The agents work in the browser, on the insurer portals and software already in place. No integration project, no new tool to learn.",
      },
      {
        t: "Built for each profession",
        d: "Every insurer and every portal has its own rules, documents and rejection reasons. The agents are built for those rules, profession by profession, starting with optical.",
      },
      {
        t: "The agent prepares, people approve",
        d: "The agents do the repetitive work and prepare the files. The team stays in control and approves what goes out.",
      },
    ],
    histoireTitre: "Our story",
    equipeTitre: "The team",
    equipeIntro:
      "Granit was co-founded by Jenny Mansour and Corneille Marechal, both graduates of École polytechnique and the MSc X-HEC Entrepreneurs.",
    linkedin: "LinkedIn",
    capTitre: "Where we're heading",
    cap: [
      {
        t: "More professions",
        d: "After optical: dental, hearing care and other healthcare professionals who handle third-party payment.",
        todo: false,
      },
      {
        t: "More portals and software",
        d: "Every insurer portal or business software covered expands what the agents can do.",
        todo: true,
      },
      {
        t: "Everything that isn't care",
        d: "Beyond third-party payment: collections, follow-ups and the rest of the admin work.",
        todo: false,
      },
    ],
    faqTitle: "Frequently asked questions",
    faq: [
      {
        q: "Who is behind Granit?",
        a: "Granit was co-founded by Jenny Mansour, CEO, and Corneille Marechal, CTO. Jenny Mansour worked at Boston Consulting Group, the French Ministry of Health and Galileo Global Education. Corneille Marechal was the first employee and founding engineer at apiday.",
      },
      {
        q: "Where is the data hosted?",
        a: "Hosting, encryption, access control and reversibility of health data are described on the Security page.",
        lien: { to: "/securite" as const, label: "See the Security page" },
      },
      {
        q: "Which healthcare professions?",
        a: "Granit starts with optical stores. The agents expand to dental, hearing care and other healthcare professionals who handle third-party payment.",
      },
      {
        q: "How long has Granit been around?",
        a: "Jenny Mansour and Corneille Marechal have been working on Granit since March 2026.",
      },
    ],
    ctaTitre: "Let's talk about your third-party payment",
    ctaTexte: "15-minute video call: we show you Granit agents at work, on your cases.",
    ctaBouton: "See a product demo",
  },
};
