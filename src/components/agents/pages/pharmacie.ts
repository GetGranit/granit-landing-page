import type { PageMetier } from "../pages";

// pharmacie : copy écrite le 18/11/2026 par une équipe d'agents (réunions Granola + vocabulaire du web),
// relue contre TON.md. Points à valider avant publication : voir la PR.

export const pharmacieFr: PageMetier = {
  titreSeo: "Granit pour les pharmacies : les ordonnances des EHPAD suivies à votre place",
  descriptionSeo:
    "Vous servez des EHPAD en préparation des doses à administrer (PDA) ? Granit récupère chaque nouvelle ordonnance dans NETSoins, TitanLink ou vos mails, la compare au traitement en cours et vous signale les changements. Le pharmacien valide.",
  etapesHero: [
    {
      enCours: "Recherche des nouvelles ordonnances",
      fait: "Nouvelle ordonnance trouvée",
      detail: "Dans le logiciel de l'EHPAD",
    },
    {
      enCours: "Lecture des mails",
      fait: "Mails lus",
      detail: "Ordonnances envoyées par mail",
    },
    {
      enCours: "Comparaison au traitement",
      fait: "Traitement comparé",
      detail: "Ajouts, arrêts, posologies",
    },
    {
      enCours: "Envoi à la pharmacie",
      fait: "Changements envoyés",
      detail: "Avant la préparation des doses",
    },
  ],
  garanties: [
    {
      titre: "Rien ne change à la pharmacie",
      texte: "Vous gardez votre logiciel, les EHPAD gardent le leur. Pas de nouveau logiciel.",
    },
    {
      titre: "En place en quelques jours",
      texte: "Pas en mois. Granit travaille dans les logiciels que les EHPAD utilisent déjà.",
    },
    {
      titre: "Le pharmacien valide, toujours",
      texte: "Granit ne valide aucune ordonnance. Il vous montre ce qui a changé, vous décidez.",
    },
    {
      titre: "Chaque dossier est tracé",
      texte: "Ce qui a été fait, quand, et pourquoi un dossier attend.",
    },
  ],
  avantApres: {
    titre: ["Ce que vous n'avez", "plus à faire."],
    avant: "Aujourd'hui",
    apres: "Avec Granit",
    lignes: [
      {
        avant:
          "Ouvrir le logiciel de chaque EHPAD, plusieurs fois par jour, pour voir si une ordonnance est arrivée.",
        apres: "Chaque nouvelle ordonnance est récupérée dès que le médecin la met en ligne.",
      },
      {
        avant: "Chercher dans la boîte mail les ordonnances envoyées par certains EHPAD.",
        apres: "Les ordonnances reçues par mail sont récupérées avec les autres.",
      },
      {
        avant: "Comparer chaque nouvelle ordonnance à l'ancienne, ligne par ligne.",
        apres:
          "Chaque ordonnance est comparée au traitement en cours : ajouts, arrêts, changements de posologie.",
      },
      {
        avant: "Noter les changements à la main pour l'équipe de préparation.",
        apres:
          "La liste des changements arrive à la pharmacie, prête pour la préparation des doses.",
      },
      {
        avant: "Découvrir un changement de traitement après la préparation des doses.",
        apres: "Le changement est signalé le jour où l'ordonnance arrive. Le pharmacien valide.",
      },
    ],
  },
  dossierTitre: ["Une ordonnance, du médecin", "à la préparation des doses."],
  dossier: [
    {
      etape: "Prescription",
      texte:
        "Le médecin met l'ordonnance en ligne dans le logiciel de l'EHPAD, ou l'EHPAD vous l'envoie par mail. Rien ne change pour eux.",
    },
    {
      etape: "Récupération",
      texte:
        "Granit récupère la nouvelle ordonnance, dans le logiciel de l'EHPAD ou dans vos mails.",
    },
    {
      etape: "Comparaison",
      texte:
        "Granit la compare au traitement en cours du résident : médicament ajouté, arrêté, posologie modifiée.",
    },
    {
      etape: "Signalement",
      texte:
        "La pharmacie reçoit la liste des changements, pour la préparation des doses à administrer (PDA).",
    },
    {
      etape: "Validation",
      texte:
        "Le pharmacien valide, l'équipe prépare les doses, comme aujourd'hui. Chaque dossier est tracé.",
    },
  ],
  demarrage: {
    titre: ["Comment on démarre,", "avec vous."],
    etapes: [
      {
        titre: "On regarde vos EHPAD ensemble",
        texte:
          "En visio, sur les EHPAD que vous servez et leurs logiciels. Vous voyez ce que Granit prendrait en charge chez vous.",
      },
      {
        titre: "On se branche sur les logiciels des EHPAD",
        texte:
          "Granit est en place en quelques jours, pas en mois. Vous n'avez pas de nouveau logiciel à apprendre.",
      },
      {
        titre: "On suit les premiers changements avec vous",
        texte:
          "Les premiers jours, on regarde avec vous les changements signalés, EHPAD par EHPAD. Vous n'êtes pas laissé seul avec un outil.",
      },
      {
        titre: "Vous gardez la main",
        texte:
          "Le pharmacien valide chaque changement. Chaque dossier est tracé : ce qui a été fait, quand, et pourquoi un dossier attend.",
      },
    ],
  },
  logiciels: ["NETSoins", "TitanLink"],
  plateformes: [],
  plateformesNote:
    "Granit travaille dans les logiciels de soins des EHPAD que vous servez et lit les ordonnances reçues par mail, sans nouveau logiciel, ni pour vous ni pour l'EHPAD.",
  faq: [
    {
      question: "Qu'est-ce que je dois faire, moi ?",
      answer:
        "Valider les changements que Granit vous signale, et préparer les doses comme aujourd'hui. Au démarrage, on vous demande un accès au logiciel de chaque EHPAD que vous servez.",
    },
    {
      question: "Faut-il changer de logiciel ?",
      answer:
        "Non, ni vous, ni les EHPAD. Granit travaille dans leurs logiciels de soins (NETSoins, TitanLink…) et lit les ordonnances reçues par mail, comme le ferait une personne de l'équipe.",
    },
    {
      question: "Granit touche-t-il à l'ordonnance ou à la préparation ?",
      answer:
        "Non. Granit ne modifie aucune ordonnance, ne valide rien et ne prépare pas les doses. Il vous montre ce qui a changé : la validation pharmaceutique reste au pharmacien.",
    },
    {
      question: "Et si quelque chose cloche ?",
      answer:
        "Rien ne part sans la validation du pharmacien. Chaque dossier est tracé : vous voyez ce qui a été fait, quand, et pourquoi un dossier attend.",
    },
    {
      question: "Et les données des résidents ?",
      answer:
        "Elles restent dans l'Union européenne. Granit s'appuie sur une infrastructure certifiée pour l'hébergement des données de santé (on dit « certifiée HDS »). Granit respecte le règlement européen sur les données personnelles (RGPD).",
    },
    {
      question: "Combien coûte Granit ?",
      answer:
        "Le tarif dépend du nombre d'EHPAD que vous servez. On le fixe avec vous, sur vos chiffres.",
      rdv: "Prendre rendez-vous",
    },
  ],
  ressources: "pharmacie",
};

export const pharmacieEn: PageMetier = {
  titreSeo: "Granit for pharmacies: care home prescriptions followed for you",
  descriptionSeo:
    "Do you prepare doses for care homes (PDA)? Granit collects every new prescription in NETSoins, TitanLink or your emails, compares it with the current treatment and flags the changes. The pharmacist validates.",
  etapesHero: [
    {
      enCours: "Looking for new prescriptions",
      fait: "New prescription found",
      detail: "In the care home's software",
    },
    {
      enCours: "Reading emails",
      fait: "Emails read",
      detail: "Prescriptions sent by email",
    },
    {
      enCours: "Comparing with the treatment",
      fait: "Treatment compared",
      detail: "Additions, stops, dosages",
    },
    {
      enCours: "Sending to the pharmacy",
      fait: "Changes sent",
      detail: "Before dose preparation",
    },
  ],
  garanties: [
    {
      titre: "Nothing changes at the pharmacy",
      texte: "You keep your software, care homes keep theirs. No new software.",
    },
    {
      titre: "Up and running in days",
      texte: "Not months. Granit works in the software care homes already use.",
    },
    {
      titre: "The pharmacist always validates",
      texte: "Granit validates no prescription. It shows you what changed, you decide.",
    },
    {
      titre: "Every file is traced",
      texte: "What was done, when, and why a file is waiting.",
    },
  ],
  avantApres: {
    titre: ["What you no longer", "have to do."],
    avant: "Today",
    apres: "With Granit",
    lignes: [
      {
        avant:
          "Opening each care home's software, several times a day, to see if a prescription arrived.",
        apres: "Each new prescription is collected as soon as the doctor posts it.",
      },
      {
        avant: "Searching the inbox for prescriptions some care homes send by email.",
        apres: "Emailed prescriptions are collected with the others.",
      },
      {
        avant: "Comparing each new prescription with the previous one, line by line.",
        apres:
          "Each prescription is compared with the current treatment: additions, stops, dosage changes.",
      },
      {
        avant: "Writing down changes by hand for the preparation team.",
        apres: "The list of changes reaches the pharmacy, ready for dose preparation.",
      },
      {
        avant: "Finding out about a treatment change after the doses are prepared.",
        apres: "The change is flagged the day the prescription arrives. The pharmacist validates.",
      },
    ],
  },
  dossierTitre: ["One prescription, from the doctor", "to dose preparation."],
  dossier: [
    {
      etape: "Prescription",
      texte:
        "The doctor posts the prescription in the care home's software, or the care home emails it to you. Nothing changes for them.",
    },
    {
      etape: "Collection",
      texte: "Granit collects the new prescription, in the care home's software or in your emails.",
    },
    {
      etape: "Comparison",
      texte:
        "Granit compares it with the resident's current treatment: drug added, stopped, dosage changed.",
    },
    {
      etape: "Flagging",
      texte:
        "The pharmacy receives the list of changes, for dose preparation for care homes (PDA).",
    },
    {
      etape: "Validation",
      texte:
        "The pharmacist validates, the team prepares the doses, as today. Every file is traced.",
    },
  ],
  demarrage: {
    titre: ["How we get started,", "with you."],
    etapes: [
      {
        titre: "We look at your care homes together",
        texte:
          "On a video call, on the care homes you serve and their software. You see what Granit would take over for you.",
      },
      {
        titre: "We connect to the care homes' software",
        texte: "Granit is up and running in days, not months. No new software to learn.",
      },
      {
        titre: "We follow the first changes with you",
        texte:
          "For the first days, we review the flagged changes with you, care home by care home. You are not left alone with a tool.",
      },
      {
        titre: "You stay in control",
        texte:
          "The pharmacist validates every change. Every file is traced: what was done, when, and why a file is waiting.",
      },
    ],
  },
  logiciels: ["NETSoins", "TitanLink"],
  plateformes: [],
  plateformesNote:
    "Granit works in the care software of the care homes you serve and reads prescriptions sent by email, with no new software for you or for the care home.",
  faq: [
    {
      question: "What do I have to do?",
      answer:
        "Validate the changes Granit flags, and prepare the doses as today. To get started, we ask you for access to the software of each care home you serve.",
    },
    {
      question: "Do we need to change software?",
      answer:
        "No, neither you nor the care homes. Granit works in their care software (NETSoins, TitanLink…) and reads prescriptions sent by email, as a team member would.",
    },
    {
      question: "Does Granit touch the prescription or the preparation?",
      answer:
        "No. Granit does not change any prescription, validates nothing and does not prepare doses. It shows you what changed: pharmaceutical validation stays with the pharmacist.",
    },
    {
      question: "What if something goes wrong?",
      answer:
        "Nothing goes out without the pharmacist's validation. Every file is traced: you see what was done, when, and why a file is waiting.",
    },
    {
      question: "What about residents' data?",
      answer:
        "It stays in the European Union. Granit relies on infrastructure certified for health data hosting (HDS). Granit complies with the GDPR.",
    },
    {
      question: "How much does Granit cost?",
      answer:
        "The price depends on the number of care homes you serve. We set it with you, based on your numbers.",
      rdv: "Book a meeting",
    },
  ],
  ressources: "pharmacie",
};
