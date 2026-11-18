import type { PageMetier } from "../pages";

// cliniques-laboratoires : copy écrite le 18/11/2026 par une équipe d'agents (réunions Granola + vocabulaire du web),
// relue contre TON.md. Points à valider avant publication : voir la PR.

export const cliniquesLaboratoiresFr: PageMetier = {
  titreSeo: "Granit pour les cliniques et les laboratoires : l'administratif fait à votre place",
  descriptionSeo:
    "Vos équipes travaillent dans leur logiciel, Granit fait le reste : le dossier du patient complet, les prises en charge, les rejets corrigés et les virements des mutuelles pointés, dossier par dossier.",
  etapesHero: [
    {
      enCours: "Complétude du dossier",
      fait: "Dossier complet",
      detail: "Ordonnance, carte Vitale, mutuelle",
    },
    {
      enCours: "Vérification des droits",
      fait: "Droits vérifiés",
      detail: "Assurance Maladie et mutuelle",
    },
    {
      enCours: "Traitement du rejet",
      fait: "Rejet corrigé",
      detail: "Renvoyé à la caisse ou à la mutuelle",
    },
    {
      enCours: "Pointage du virement",
      fait: "Virement pointé",
      detail: "Rapproché de ses factures",
    },
  ],
  garanties: [
    {
      titre: "Rien ne change à l'accueil",
      texte:
        "Vos équipes travaillent dans votre logiciel, comme d'habitude. Pas de nouveau logiciel.",
    },
    {
      titre: "Branché sur vos portails en 48 h",
      texte: "En quelques jours, pas en mois. Vous n'avez rien à installer.",
    },
    {
      titre: "Chaque dossier est tracé",
      texte: "Ce qui a été fait, quand, et pourquoi un dossier attend.",
    },
    {
      titre: "Une personne suit vos dossiers",
      texte: "Un gestionnaire Granit suit les cas particuliers et prévient l'équipe.",
    },
  ],
  avantApres: {
    titre: ["Ce que vous n'avez", "plus à faire."],
    avant: "Aujourd'hui",
    apres: "Avec Granit",
    lignes: [
      {
        avant:
          "Ressaisir l'ordonnance et la mutuelle à la main, pendant que la file s'allonge à l'accueil.",
        apres: "Le dossier est complété dans votre logiciel. Votre secrétariat vérifie et valide.",
      },
      {
        avant:
          "Faire les demandes de prise en charge une par une sur le portail de chaque mutuelle.",
        apres:
          "La demande part depuis le dossier du patient. La réponse est rangée dans le dossier.",
      },
      {
        avant:
          "Bloquer à la main les feuilles de soins sans ordonnance ou avec un prescripteur inconnu.",
        apres:
          "Chaque dossier est contrôlé avant l'envoi. Ce qui manque vous est signalé avant qu'il parte.",
      },
      {
        avant: "Chaque matin, reprendre les rejets de la veille et appeler les mutuelles.",
        apres:
          "Les rejets simples sont corrigés et renvoyés. Vos équipes ne gardent que les dossiers qui demandent un appel.",
      },
      {
        avant:
          "Aller sur le site de chaque mutuelle pour savoir quels dossiers un virement a payés.",
        apres:
          "Chaque virement est rapproché de ses factures, dossier par dossier. Les impayés sont relancés.",
      },
    ],
  },
  dossierTitre: ["Un dossier, de l'admission", "au virement de la mutuelle."],
  dossier: [
    {
      etape: "Admission",
      texte:
        "Vos équipes accueillent le patient dans votre logiciel, comme d'habitude. Granit complète le dossier : ordonnance, carte Vitale, carte de mutuelle.",
    },
    {
      etape: "Droits",
      texte:
        "Granit vérifie les droits du patient auprès de l'Assurance Maladie et de sa mutuelle.",
    },
    {
      etape: "Prise en charge",
      texte:
        "Quand le séjour ou l'examen le demande, Granit fait la demande de prise en charge à la mutuelle et range la réponse dans le dossier.",
    },
    {
      etape: "Facture",
      texte:
        "Avant l'envoi de la feuille de soins électronique (FSE), Granit contrôle le dossier. Après l'envoi, un rejet est corrigé et renvoyé.",
    },
    {
      etape: "Virement",
      texte:
        "Granit pointe le virement de la mutuelle, le rapproche de chaque facture qu'il paie et relance si le paiement tarde.",
    },
  ],
  demarrage: {
    titre: ["Comment on démarre,", "avec vous."],
    etapes: [
      {
        titre: "On regarde vos dossiers ensemble",
        texte:
          "En visio, sur vos propres dossiers et dans votre logiciel. Vous voyez ce que Granit prendrait en charge chez vous, et on choisit ensemble la première tâche à lui confier.",
      },
      {
        titre: "On se branche sur vos portails",
        texte:
          "Granit est branché sur vos portails en 48 h. Vous n'avez pas de nouveau logiciel à apprendre.",
      },
      {
        titre: "On suit les premiers dossiers avec vous",
        texte:
          "Au début, Granit vous montre son travail et vous le vérifiez avant qu'il saisisse dans votre logiciel. Un gestionnaire Granit suit les cas particuliers et prévient l'équipe.",
      },
      {
        titre: "Vous gardez la main",
        texte:
          "Chaque dossier est tracé : ce qui a été fait, quand, et pourquoi un dossier attend.",
      },
    ],
  },
  logiciels: ["Hopital Manager", "Hexalis", "KaliSil"],
  plateformes: ["amelipro", "4AXES", "Almerys", "Viamédis"],
  plateformesNote:
    "Granit travaille dans les logiciels que vos équipes utilisent déjà, et sur les portails de l'Assurance Maladie et des mutuelles.",
  faq: [
    {
      question: "Qu'est-ce que nos équipes doivent faire ?",
      answer:
        "Accueillir le patient dans votre logiciel, comme aujourd'hui. Granit fait la suite : le dossier complet, la prise en charge, le contrôle avant l'envoi, les rejets et le pointage des virements.",
    },
    {
      question: "Faut-il changer de logiciel ?",
      answer:
        "Non. Granit travaille dans votre logiciel de gestion des patients ou dans le logiciel du laboratoire (on dit le SIL), et sur les portails des mutuelles, comme le ferait une personne de l'équipe. Granit est branché sur vos portails en 48 h.",
    },
    {
      question:
        "Notre logiciel est installé sur nos propres serveurs. Faut-il ouvrir quelque chose ?",
      answer:
        "Granit travaille comme une personne de l'équipe, par les mêmes écrans que votre secrétariat. Les accès sont vus avec votre service informatique avant le premier dossier.",
    },
    {
      question: "Et si un dossier est rejeté, ou si quelque chose cloche ?",
      answer:
        "Le rejet est repéré, corrigé et renvoyé. Les cas particuliers sont suivis par un gestionnaire Granit, qui prévient l'équipe. Chaque dossier est tracé : vous voyez ce qui a été fait, quand, et pourquoi un dossier attend.",
    },
    {
      question: "Et les données de nos patients ?",
      answer:
        "Elles restent dans l'Union européenne, chez un hébergeur certifié pour les données de santé (on dit « certifié HDS »). Granit respecte le règlement européen sur les données personnelles (RGPD).",
    },
    {
      question: "Combien coûte Granit ?",
      answer: "Granit ne facture que les dossiers traités avec succès.",
      rdv: "Prendre rendez-vous",
    },
  ],
  ressources: "cliniques",
};

export const cliniquesLaboratoiresEn: PageMetier = {
  titreSeo: "Granit for clinics and laboratories: the paperwork done for you",
  descriptionSeo:
    "Your teams work in their software, Granit does the rest: complete patient files, coverage requests, rejections corrected and insurer transfers matched, file by file.",
  etapesHero: [
    {
      enCours: "Checking the file",
      fait: "File complete",
      detail: "Prescription, Carte Vitale, insurer",
    },
    {
      enCours: "Checking eligibility",
      fait: "Eligibility checked",
      detail: "National health insurance and insurer",
    },
    {
      enCours: "Handling the rejection",
      fait: "Rejection corrected",
      detail: "Resubmitted to the health insurance fund or insurer",
    },
    {
      enCours: "Matching the transfer",
      fait: "Transfer matched",
      detail: "Matched to its invoices",
    },
  ],
  garanties: [
    {
      titre: "Nothing changes at the front desk",
      texte: "Your teams work in your software, as usual. No new software.",
    },
    {
      titre: "Connected to your portals in 48 h",
      texte: "In days, not months. Nothing to install.",
    },
    {
      titre: "Every file is traced",
      texte: "What was done, when, and why a file is waiting.",
    },
    {
      titre: "A person follows your files",
      texte: "A Granit case manager follows special cases and alerts the team.",
    },
  ],
  avantApres: {
    titre: ["What you no longer", "have to do."],
    avant: "Today",
    apres: "With Granit",
    lignes: [
      {
        avant:
          "Re-entering the prescription and insurer details by hand while the queue grows at the front desk.",
        apres: "The file is completed in your software. Your front desk checks and approves.",
      },
      {
        avant: "Filing coverage requests one by one on each insurer's portal.",
        apres: "The request goes out from the patient's file. The answer is stored in the file.",
      },
      {
        avant: "Manually holding claims with no prescription or an unknown prescriber.",
        apres:
          "Every file is checked before sending. What is missing is flagged before it goes out.",
      },
      {
        avant: "Every morning, picking up the previous day's rejections and calling insurers.",
        apres:
          "Simple rejections are corrected and resubmitted. Your teams keep only the files that need a call.",
      },
      {
        avant: "Going to each insurer's website to see which files a transfer paid.",
        apres:
          "Each transfer is matched to its invoices, file by file. Unpaid ones are followed up.",
      },
    ],
  },
  dossierTitre: ["One file, from admission", "to the insurer's transfer."],
  dossier: [
    {
      etape: "Admission",
      texte:
        "Your teams welcome the patient in your software, as usual. Granit completes the file: prescription, Carte Vitale, insurer card.",
    },
    {
      etape: "Eligibility",
      texte:
        "Granit checks the patient's eligibility with the national health insurance and their insurer.",
    },
    {
      etape: "Coverage",
      texte:
        "When the stay or test requires it, Granit files the coverage request with the insurer and stores the answer in the file.",
    },
    {
      etape: "Invoice",
      texte:
        "Before the electronic claim (FSE) goes out, Granit checks the file. After sending, a rejection is corrected and resubmitted.",
    },
    {
      etape: "Transfer",
      texte:
        "Granit matches the insurer's transfer to each invoice it pays and follows up if payment is late.",
    },
  ],
  demarrage: {
    titre: ["How we get started,", "with you."],
    etapes: [
      {
        titre: "We look at your files together",
        texte:
          "On a video call, on your own files and in your software. You see what Granit would take over for you, and together we pick the first task to hand over.",
      },
      {
        titre: "We connect to your portals",
        texte: "Granit is connected to your portals in 48 h. No new software to learn.",
      },
      {
        titre: "We follow the first files with you",
        texte:
          "At first, Granit shows you its work and you check it before it enters anything in your software. A Granit case manager follows special cases and alerts the team.",
      },
      {
        titre: "You stay in control",
        texte: "Every file is traced: what was done, when, and why a file is waiting.",
      },
    ],
  },
  logiciels: ["Hopital Manager", "Hexalis", "KaliSil"],
  plateformes: ["amelipro", "4AXES", "Almerys", "Viamédis"],
  plateformesNote:
    "Granit works in the software your teams already use, and on national health insurance and insurer portals.",
  faq: [
    {
      question: "What do our teams have to do?",
      answer:
        "Welcome the patient in your software, as today. Granit does the rest: complete file, coverage request, checks before sending, rejections and transfer matching.",
    },
    {
      question: "Do we need to change software?",
      answer:
        "No. Granit works in your patient management software or your laboratory information system (LIS), and on insurer portals, as a team member would. Granit is connected to your portals in 48 h.",
    },
    {
      question: "Our software runs on our own servers. Do we need to open anything?",
      answer:
        "Granit works like a team member, through the same screens as your front desk. Access is reviewed with your IT team before the first file.",
    },
    {
      question: "What if a file is rejected, or something goes wrong?",
      answer:
        "The rejection is spotted, corrected and resubmitted. Special cases are followed by a Granit case manager, who alerts the team. Every file is traced: you see what was done, when, and why a file is waiting.",
    },
    {
      question: "What about our patients' data?",
      answer:
        "It stays in the European Union, with a host certified for health data (HDS). Granit complies with the GDPR.",
    },
    {
      question: "How much does Granit cost?",
      answer: "Granit only charges for files processed successfully.",
      rdv: "Book a meeting",
    },
  ],
  ressources: "cliniques",
};
