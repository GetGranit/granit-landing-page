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
  {
    valeur: null,
    libelle: { fr: "tâches traitées par les agents", en: "tasks handled by the agents" },
  },
  { valeur: null, libelle: { fr: "établissements équipés", en: "sites equipped" } },
  {
    valeur: null,
    libelle: { fr: "outils et portails connectés", en: "tools and portals connected" },
  },
  { valeur: null, libelle: { fr: "métiers de santé", en: "healthcare professions" } },
];

export const content = {
  fr: {
    eyebrow: "À propos de Granit",
    title: "Les agents IA qui prennent en charge l'administratif des professionnels de santé.",
    // Phrase « façon Vocca » : la date de création est un TODO (affichée à part).
    heroAvant: "Fondée en",
    heroApres:
      "par Jenny Mansour et Corneille Marechal, Granit conçoit des agents IA qui gèrent le back-office des professionnels de santé, directement dans leurs outils du quotidien.",
    heroDateTodo: "date",
    photoAlt: "L'équipe Granit dans ses bureaux à Paris",
    // Réponse citable à « Qu'est-ce que Granit ? » (40-60 mots) : sert aux données structurées.
    lead: "Granit est une entreprise basée à Paris qui conçoit des agents IA pour le back-office des professionnels de santé. Les agents prennent en charge les tâches administratives du quotidien : tiers payant, facturation, commandes fournisseurs, relances, rapprochement des paiements. Ils travaillent dans les outils déjà en place. Granit a commencé par l'optique et s'étend aux autres métiers de santé.",
    chiffresTitre: "Granit en chiffres",
    problemeTitre: "Pourquoi Granit",
    probleme: [
      "Les professionnels de santé passent des heures chaque jour sur l'administratif : prises en charge, facturation, commandes aux fournisseurs, rejets, relances, rapprochement des paiements. Ce temps, ils ne le passent pas avec leurs patients.",
      "Granit déploie des agents IA qui prennent ces tâches en charge, depuis les outils que les équipes utilisent déjà : logiciel métier, portails, navigateur. Pas de projet informatique, pas de nouvel outil à apprendre.",
    ],
    convictionsTitre: "Nos convictions",
    convictions: [
      {
        t: "Dans vos outils, pas à côté",
        d: "Les agents travaillent là où l'équipe travaille déjà : logiciel métier, portails, navigateur. Pas de projet d'intégration, pas de nouvel outil à apprendre.",
      },
      {
        t: "Spécialisés métier",
        d: "Chaque métier a ses règles, ses interlocuteurs et ses outils. Les agents sont construits pour ces règles, métier par métier, en commençant par l'optique.",
      },
      {
        t: "L'agent prépare, l'humain valide",
        d: "Les agents font le travail répétitif et préparent les dossiers. L'équipe garde la main et valide ce qui part.",
      },
    ],
    equipeTitre: "L'équipe",
    equipeIntro:
      "Granit a été cofondé par Jenny Mansour et Corneille Marechal, tous deux diplômés de l'École polytechnique et du MSc X-HEC Entrepreneurs.",
    linkedin: "LinkedIn",
    faqTitle: "Questions fréquentes",
    faq: [
      {
        q: "Que font les agents Granit ?",
        a: "Ils prennent en charge les tâches administratives répétitives des professionnels de santé : tiers payant et prises en charge, facturation, commandes fournisseurs, traitement des rejets, relances et rapprochement des paiements. L'équipe garde la main et valide ce qui part.",
      },
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
        a: "Granit a commencé par les magasins d'optique. Les agents s'étendent aux autres professionnels de santé qui veulent alléger leur back-office.",
      },
      {
        q: "Depuis quand Granit existe-t-il ?",
        a: "Jenny Mansour et Corneille Marechal se consacrent à Granit depuis mars 2026.",
      },
    ],
    ctaTitre: "Parlons de votre back-office",
    ctaTexte: "15 minutes en visio : on vous montre les agents Granit au travail, sur vos cas.",
    ctaBouton: "Voir une démo du produit",
  },
  en: {
    eyebrow: "About Granit",
    title: "AI agents that take over the admin work of healthcare professionals.",
    heroAvant: "Founded in",
    heroApres:
      "by Jenny Mansour and Corneille Marechal, Granit builds AI agents that run the back office of healthcare professionals, directly inside their everyday tools.",
    heroDateTodo: "date",
    photoAlt: "The Granit team in its Paris office",
    lead: "Granit is a Paris-based company building AI agents for the back office of healthcare professionals. The agents take over everyday admin work: third-party payment, billing, supplier orders, follow-ups, payment reconciliation. They work inside the tools already in place. Granit started with optical stores and is expanding to other healthcare professions.",
    chiffresTitre: "Granit in numbers",
    problemeTitre: "Why Granit",
    probleme: [
      "Healthcare professionals spend hours every day on admin: coverage requests, billing, supplier orders, rejections, follow-ups, payment reconciliation. That is time they don't spend with patients.",
      "Granit deploys AI agents that take over these tasks, from the tools teams already use: business software, portals, browser. No IT project, no new tool to learn.",
    ],
    convictionsTitre: "What we believe",
    convictions: [
      {
        t: "Inside your tools, not next to them",
        d: "The agents work where the team already works: business software, portals, browser. No integration project, no new tool to learn.",
      },
      {
        t: "Built for each profession",
        d: "Every profession has its own rules, counterparts and tools. The agents are built for those rules, profession by profession, starting with optical.",
      },
      {
        t: "The agent prepares, people approve",
        d: "The agents do the repetitive work and prepare the files. The team stays in control and approves what goes out.",
      },
    ],
    equipeTitre: "The team",
    equipeIntro:
      "Granit was co-founded by Jenny Mansour and Corneille Marechal, both graduates of École polytechnique and the MSc X-HEC Entrepreneurs.",
    linkedin: "LinkedIn",
    faqTitle: "Frequently asked questions",
    faq: [
      {
        q: "What do Granit agents do?",
        a: "They take over the repetitive admin work of healthcare professionals: third-party payment and coverage requests, billing, supplier orders, rejections, follow-ups and payment reconciliation. The team stays in control and approves what goes out.",
      },
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
        a: "Granit started with optical stores. The agents are expanding to other healthcare professionals who want a lighter back office.",
      },
      {
        q: "How long has Granit been around?",
        a: "Jenny Mansour and Corneille Marechal have been working on Granit since March 2026.",
      },
    ],
    ctaTitre: "Let's talk about your back office",
    ctaTexte: "15-minute video call: we show you Granit agents at work, on your cases.",
    ctaBouton: "See a product demo",
  },
};
