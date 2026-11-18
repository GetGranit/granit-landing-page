import type { PageMetier } from "../pages";

// centres-sante : copy écrite le 18/11/2026 par une équipe d'agents (réunions Granola + vocabulaire du web),
// relue contre TON.md. Points à valider avant publication : voir la PR.

export const centresSanteFr: PageMetier = {
  titreSeo:
    "Granit pour les centres de santé et l'ophtalmologie : l'administratif fait à votre place",
  descriptionSeo:
    "Le médecin valide sa consultation, Granit fait le reste : les droits vérifiés avant la consultation, la facture prête pour l'accueil, les rejets corrigés et les virements de l'Assurance Maladie et des mutuelles pointés, dans les logiciels que vos équipes utilisent déjà.",
  etapesHero: [
    {
      enCours: "Vérification des droits",
      fait: "Droits vérifiés",
      detail: "Avant la consultation",
    },
    {
      enCours: "Préparation de la facture",
      fait: "Facture prête",
      detail: "Dès la fin de la consultation",
    },
    {
      enCours: "Lecture des retours de paiement",
      fait: "Rejet corrigé et renvoyé",
      detail: "Assurance Maladie et mutuelle",
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
        "Vous accueillez le patient et passez sa carte Vitale, comme d'habitude. Pas de nouveau logiciel.",
    },
    {
      titre: "Branché en 48 h",
      texte:
        "Granit est branché sur vos portails en 48 h, dans les logiciels que vos équipes utilisent déjà.",
    },
    {
      titre: "Une personne suit vos dossiers",
      texte: "Un gestionnaire Granit suit les cas particuliers et prévient l'équipe.",
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
          "Recopier les actes et la cotation de chaque consultation dans le logiciel de facturation.",
        apres:
          "La facture est préparée dès que le médecin valide sa consultation. L'accueil n'a plus qu'à passer la carte Vitale.",
      },
      {
        avant:
          "Vérifier les droits au moment où le patient arrive, quand la salle d'attente est pleine.",
        apres:
          "Les droits des patients du jour sont vérifiés avant leur consultation, auprès de l'Assurance Maladie et, si besoin, de la mutuelle.",
      },
      {
        avant:
          "Chercher pourquoi une facture est rejetée, appeler la caisse, refaire la feuille de soins.",
        apres: "Le rejet est repéré, corrigé et renvoyé. Les cas particuliers vous sont signalés.",
      },
      {
        avant:
          "Noter les feuilles de soins papier dans un fichier, puis vérifier un mois plus tard qu'elles ont été payées.",
        apres: "Chaque feuille de soins papier est suivie jusqu'à son paiement.",
      },
      {
        avant:
          "Pointer les virements de l'Assurance Maladie et des mutuelles sur le relevé, relancer les impayés.",
        apres: "Chaque virement est rapproché de ses factures. Les impayés sont relancés.",
      },
    ],
  },
  dossierTitre: ["Un dossier, du rendez-vous", "au virement de l'Assurance Maladie."],
  dossier: [
    {
      etape: "Rendez-vous",
      texte:
        "Le patient prend rendez-vous comme d'habitude. Granit vérifie ses droits auprès de l'Assurance Maladie, et de sa mutuelle si besoin, avant sa consultation.",
    },
    {
      etape: "Consultation",
      texte:
        "Le médecin ou l'orthoptiste travaille dans son logiciel, comme d'habitude. Dès que la consultation est validée, Granit prépare la facture.",
    },
    {
      etape: "Accueil",
      texte:
        "Le patient repasse à l'accueil : la facture est prête. La secrétaire passe la carte Vitale, le patient repart.",
    },
    {
      etape: "Retours",
      texte:
        "Granit lit chaque jour les retours de l'Assurance Maladie et des mutuelles. Un rejet est corrigé et renvoyé, une feuille de soins papier est suivie jusqu'à son paiement.",
    },
    {
      etape: "Virement",
      texte:
        "Granit pointe le virement de l'Assurance Maladie ou de la mutuelle, le rapproche de ses factures et relance si le paiement tarde.",
    },
  ],
  demarrage: {
    titre: ["Comment on démarre,", "avec vous."],
    etapes: [
      {
        titre: "On regarde vos dossiers ensemble",
        texte:
          "En visio, sur vos propres dossiers et dans vos logiciels. Vous voyez ce que Granit prendrait en charge dans votre centre.",
      },
      {
        titre: "On se branche sur vos portails",
        texte:
          "Granit est branché sur vos portails en 48 h. Votre équipe n'a pas de nouveau logiciel à apprendre.",
      },
      {
        titre: "On suit les premiers dossiers avec vous",
        texte:
          "Un gestionnaire Granit suit les cas particuliers et prévient l'équipe. Vous n'êtes pas laissé seul avec un outil.",
      },
      {
        titre: "Vous gardez la main",
        texte:
          "Chaque dossier est tracé : ce qui a été fait, quand, et pourquoi un dossier attend.",
      },
    ],
  },
  logiciels: ["Desmos", "Doctolib"],
  plateformes: ["amelipro"],
  plateformesNote:
    "Granit travaille sur amelipro, le portail de l'Assurance Maladie pour les professionnels, et sur les portails des mutuelles, dans les logiciels que vos équipes utilisent déjà.",
  faq: [
    {
      question: "Qu'est-ce que l'accueil doit faire, lui ?",
      answer:
        "Accueillir le patient et passer sa carte Vitale, comme aujourd'hui. Granit fait le reste : les droits, la facture préparée, les rejets, les feuilles de soins papier et le pointage des virements.",
    },
    {
      question: "Faut-il changer de logiciel ?",
      answer:
        "Non. Granit travaille dans vos logiciels (Desmos, Doctolib…) et sur les portails de l'Assurance Maladie et des mutuelles, comme le ferait une personne de l'équipe. Granit est branché sur vos portails en 48 h.",
    },
    {
      question: "Nous ne faisons le tiers payant que sur la part Sécu. Granit nous sert-il ?",
      answer:
        "Oui. Les rejets de l'Assurance Maladie, les feuilles de soins papier et les virements de l'Assurance Maladie demandent du temps, même sans la part mutuelle. Si vous faites aussi le tiers payant sur la part mutuelle, Granit suit aussi les mutuelles.",
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
  ressources: "centres",
};

export const centresSanteEn: PageMetier = {
  titreSeo: "Granit for health centers and ophthalmology: the paperwork done for you",
  descriptionSeo:
    "The doctor validates the visit, Granit does the rest: eligibility checked before the visit, the invoice ready for the front desk, rejections corrected and transfers from the national health insurance and insurers matched, in the software your teams already use.",
  etapesHero: [
    {
      enCours: "Checking eligibility",
      fait: "Eligibility checked",
      detail: "Before the visit",
    },
    {
      enCours: "Preparing the invoice",
      fait: "Invoice ready",
      detail: "As soon as the visit ends",
    },
    {
      enCours: "Reading payment remittances",
      fait: "Rejection corrected and resubmitted",
      detail: "National health insurance and insurer",
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
      texte: "You welcome the patient and insert their Carte Vitale, as usual. No new software.",
    },
    {
      titre: "Connected in 48 h",
      texte: "Granit is connected to your portals in 48 h, in the software your teams already use.",
    },
    {
      titre: "A person follows your files",
      texte: "A Granit case manager follows special cases and alerts the team.",
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
        avant: "Re-entering each visit's procedures and billing codes in the billing software.",
        apres:
          "The invoice is prepared as soon as the doctor validates the visit. The front desk only has to insert the Carte Vitale.",
      },
      {
        avant: "Checking eligibility when the patient arrives, with a full waiting room.",
        apres:
          "Today's patients' eligibility is checked before their visit, with the national health insurance and, if needed, their insurer.",
      },
      {
        avant:
          "Finding out why an invoice was rejected, calling the health insurance fund, redoing the claim form.",
        apres:
          "The rejection is spotted, corrected and resubmitted. Special cases are flagged to you.",
      },
      {
        avant:
          "Logging paper claim forms in a file, then checking a month later that they were paid.",
        apres: "Every paper claim form is followed until it is paid.",
      },
      {
        avant:
          "Matching national health insurance and insurer transfers on the bank statement, chasing unpaid ones.",
        apres: "Each transfer is matched to its invoices. Unpaid ones are followed up.",
      },
    ],
  },
  dossierTitre: ["One file, from the appointment", "to the national health insurance transfer."],
  dossier: [
    {
      etape: "Appointment",
      texte:
        "The patient books as usual. Granit checks their eligibility with the national health insurance, and with their insurer if needed, before the visit.",
    },
    {
      etape: "Visit",
      texte:
        "The doctor or orthoptist works in their software, as usual. As soon as the visit is validated, Granit prepares the invoice.",
    },
    {
      etape: "Front desk",
      texte:
        "The patient comes back to the front desk: the invoice is ready. The receptionist inserts the Carte Vitale, and the patient leaves.",
    },
    {
      etape: "Remittances",
      texte:
        "Granit reads the national health insurance and insurer remittances every day. A rejection is corrected and resubmitted, a paper claim form is followed until it is paid.",
    },
    {
      etape: "Transfer",
      texte:
        "Granit matches the national health insurance or insurer transfer to its invoices and follows up if payment is late.",
    },
  ],
  demarrage: {
    titre: ["How we get started,", "with you."],
    etapes: [
      {
        titre: "We look at your files together",
        texte:
          "On a video call, on your own files and in your software. You see what Granit would take over in your center.",
      },
      {
        titre: "We connect to your portals",
        texte:
          "Granit is connected to your portals in 48 h. Your team has no new software to learn.",
      },
      {
        titre: "We follow the first files with you",
        texte:
          "A Granit case manager follows special cases and alerts the team. You are not left alone with a tool.",
      },
      {
        titre: "You stay in control",
        texte: "Every file is traced: what was done, when, and why a file is waiting.",
      },
    ],
  },
  logiciels: ["Desmos", "Doctolib"],
  plateformes: ["amelipro"],
  plateformesNote:
    "Granit works on amelipro, the national health insurance portal for professionals, and on insurer portals, in the software your teams already use.",
  faq: [
    {
      question: "What does the front desk have to do?",
      answer:
        "Welcome the patient and insert their Carte Vitale, as today. Granit does the rest: eligibility, the prepared invoice, rejections, paper claim forms and transfer matching.",
    },
    {
      question: "Do we need to change software?",
      answer:
        "No. Granit works in your software (Desmos, Doctolib…) and on national health insurance and insurer portals, as a team member would. Granit is connected to your portals in 48 h.",
    },
    {
      question:
        "We only use third-party payment for the national health insurance share. Is Granit useful to us?",
      answer:
        "Yes. National health insurance rejections, paper claim forms and national health insurance transfers take time, even without the insurer share. If you also use third-party payment for the insurer share, Granit follows insurers too.",
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
  ressources: "centres",
};
