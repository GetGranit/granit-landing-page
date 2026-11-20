import type { PageMetier } from "../pages";

// dentaire : copy écrite le 18/11/2026 par une équipe d'agents (réunions Granola + vocabulaire du web),
// relue contre TON.md. Points à valider avant publication : voir la PR.

export const dentaireFr: PageMetier = {
  titreSeo: "Granit pour les centres dentaires : le tiers payant fait à votre place",
  descriptionSeo:
    "Vous faites le devis dans votre logiciel, Granit fait le reste : la demande de prise en charge à la mutuelle, la facture, les rejets et le pointage des virements. Sans nouveau logiciel.",
  etapesHero: [
    {
      enCours: "Vérification des droits",
      fait: "Droits vérifiés",
      detail: "Sur le portail de la mutuelle",
    },
    {
      enCours: "Demande de prise en charge",
      fait: "Prise en charge reçue",
      detail: "Depuis le devis de votre logiciel",
    },
    {
      enCours: "Envoi de la facture",
      fait: "Facture envoyée",
      detail: "Assurance Maladie et mutuelle",
    },
    {
      enCours: "Pointage du virement",
      fait: "Virement pointé",
      detail: "Rapproché de sa facture",
    },
  ],
  garanties: [
    {
      titre: "Rien ne change à l'accueil",
      texte: "Vous faites le devis dans votre logiciel, comme d'habitude. Pas de nouveau logiciel.",
    },
    {
      titre: "Branché sur vos portails en 48 h",
      texte:
        "Granit travaille sur les portails des mutuelles, comme le ferait une personne de l'équipe.",
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
        etape: "Devis",
        cle: "depuis le devis de votre logiciel",
        avant:
          "Envoyer chaque devis à la mutuelle du patient, par mail ou sur son portail, puis attendre l'accord.",
        apres:
          "La demande de prise en charge part depuis le devis de votre logiciel. Granit suit la réponse.",
      },
      {
        etape: "Reste à charge",
        cle: "dès que la mutuelle répond",
        avant:
          "Télécharger le tableau de garanties du patient et calculer son reste à charge à la main.",
        apres:
          "Granit vous donne le reste à charge dès que la mutuelle répond. Vous l'annoncez au patient.",
      },
      {
        etape: "Orthodontie",
        cle: "facturé et suivi",
        avant:
          "Remplir la demande d'accord préalable de l'orthodontie, puis facturer chaque semestre sans en oublier un.",
        apres:
          "La demande d'accord préalable est préparée. Chaque semestre de traitement est facturé et suivi.",
      },
      {
        etape: "Rejets",
        cle: "repéré, corrigé et renvoyé",
        avant:
          "Ouvrir les retours de l'Assurance Maladie et des mutuelles pour trouver les rejets, les corriger, les renvoyer.",
        apres: "Le rejet est repéré, corrigé et renvoyé. Les cas particuliers vous sont signalés.",
      },
      {
        etape: "Paiement",
        cle: "rapproché de sa facture",
        avant:
          "Pointer les virements des mutuelles sur le relevé, relancer les parts mutuelle impayées.",
        apres: "Chaque virement est rapproché de sa facture. Les impayés sont relancés.",
      },
    ],
  },
  dossierTitre: ["Un dossier, du devis", "au virement de la mutuelle."],
  dossier: [
    {
      etape: "Devis",
      texte:
        "Vous faites le devis dans votre logiciel, comme d'habitude. Rien ne change à l'accueil ni au fauteuil.",
    },
    {
      etape: "Droits",
      texte: "Granit vérifie les droits du patient sur le portail de sa mutuelle.",
    },
    {
      etape: "Prise en charge",
      texte:
        "Granit envoie le devis à la mutuelle et suit la réponse. Vous connaissez le reste à charge sans le calculer vous-même.",
    },
    {
      etape: "Facture",
      texte:
        "À la pose de la prothèse ou à la fin des soins, Granit envoie la facture à l'Assurance Maladie et à la mutuelle. Pour l'orthodontie, semestre après semestre.",
    },
    {
      etape: "Virement",
      texte:
        "Granit pointe le virement de la mutuelle, le rapproche de la facture et relance si le paiement tarde. Un rejet est corrigé et renvoyé.",
    },
  ],
  demarrage: {
    titre: ["Comment on démarre,", "avec vous."],
    etapes: [
      {
        titre: "On regarde vos dossiers ensemble",
        texte:
          "En visio, sur vos propres dossiers et dans votre logiciel. Vous voyez ce que Granit prendrait en charge au cabinet.",
      },
      {
        titre: "On se branche sur vos portails",
        texte:
          "Granit est branché sur vos portails en 48 h. Vous n'avez pas de nouveau logiciel à apprendre.",
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
  logiciels: [
    "Logos_w",
    "Orisha",
    "Veasy",
    "Xtrem Santé",
    "Weclever Dental",
    "Visiodent",
    "Julie",
    "Effigie",
  ],
  plateformes: ["Viamédis", "Almerys", "Santéclair", "Kalixia"],
  plateformesNote:
    "Granit travaille sur les portails des mutuelles, dans les logiciels que vos équipes utilisent déjà.",
  faq: [
    {
      question: "Qu'est-ce que je dois faire, moi ?",
      answer:
        "Votre devis, dans votre logiciel, comme aujourd'hui. Granit fait la suite : la demande de prise en charge, la facture, les rejets et le pointage des virements.",
    },
    {
      question: "Faut-il changer de logiciel ?",
      answer:
        "Non. Granit travaille dans le logiciel de votre cabinet et sur les portails des mutuelles, comme le ferait une personne de l'équipe. Granit est branché sur vos portails en 48 h.",
    },
    {
      question: "Et si un dossier est rejeté, ou si quelque chose cloche ?",
      answer:
        "Le rejet est repéré, corrigé et renvoyé. Les cas particuliers sont suivis par un gestionnaire Granit, qui prévient l'équipe. Chaque dossier est tracé : vous voyez ce qui a été fait, quand, et pourquoi un dossier attend.",
    },
    {
      question:
        "Nous ne faisons pas le tiers payant sur les prothèses, par peur des impayés. Granit peut-il aider ?",
      answer:
        "Oui. Chaque dossier est suivi jusqu'au virement de la mutuelle : la facture est rapprochée du devis, les rejets sont corrigés et renvoyés, les impayés relancés. Vous voyez à tout moment où en est chaque dossier.",
    },
    {
      question: "Et les données de mes patients ?",
      answer:
        "Elles restent dans l'Union européenne, chez un hébergeur certifié pour les données de santé (on dit « certifié HDS »). Granit respecte le règlement européen sur les données personnelles (RGPD).",
    },
    {
      question: "Combien coûte Granit ?",
      answer: "Granit ne facture que les dossiers traités avec succès.",
      rdv: "Prendre rendez-vous",
    },
  ],
  ressources: "dentaire",
};

export const dentaireEn: PageMetier = {
  titreSeo: "Granit for dental centers: third-party payment done for you",
  descriptionSeo:
    "You make the quote in your software, Granit does the rest: the coverage request to the insurer, the invoice, rejections and insurer transfer matching. No new software.",
  etapesHero: [
    {
      enCours: "Checking eligibility",
      fait: "Eligibility checked",
      detail: "On the insurer's portal",
    },
    {
      enCours: "Coverage request",
      fait: "Coverage received",
      detail: "From the quote in your software",
    },
    {
      enCours: "Sending the invoice",
      fait: "Invoice sent",
      detail: "National health insurance and insurer",
    },
    {
      enCours: "Matching the transfer",
      fait: "Transfer matched",
      detail: "Matched to its invoice",
    },
  ],
  garanties: [
    {
      titre: "Nothing changes at the front desk",
      texte: "You make the quote in your software, as usual. No new software.",
    },
    {
      titre: "Connected to your portals in 48 h",
      texte: "Granit works on insurer portals, as a team member would.",
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
        etape: "Quote",
        cle: "from the quote in your software",
        avant:
          "Sending each quote to the patient's insurer, by email or on its portal, then waiting for approval.",
        apres:
          "The coverage request goes out from the quote in your software. Granit follows the reply.",
      },
      {
        etape: "Patient balance",
        cle: "as soon as the insurer replies",
        avant: "Downloading the patient's benefits table and working out their balance by hand.",
        apres: "Granit gives you the balance as soon as the insurer replies. You tell the patient.",
      },
      {
        etape: "Orthodontics",
        cle: "billed and followed",
        avant:
          "Filling in the orthodontic prior approval request, then billing every semester without missing one.",
        apres:
          "The prior approval request is prepared. Each treatment semester is billed and followed.",
      },
      {
        etape: "Rejections",
        cle: "spotted, corrected and resubmitted",
        avant:
          "Going through national health insurance and insurer returns to find rejections, fix them, resubmit them.",
        apres:
          "The rejection is spotted, corrected and resubmitted. Special cases are flagged to you.",
      },
      {
        etape: "Payment",
        cle: "matched to its invoice",
        avant: "Matching insurer transfers on the bank statement, chasing unpaid insurer shares.",
        apres: "Each transfer is matched to its invoice. Unpaid ones are followed up.",
      },
    ],
  },
  dossierTitre: ["One file, from the quote", "to the insurer's transfer."],
  dossier: [
    {
      etape: "Quote",
      texte:
        "You make the quote in your software, as usual. Nothing changes at the front desk or the chair.",
    },
    {
      etape: "Eligibility",
      texte: "Granit checks the patient's coverage on their insurer's portal.",
    },
    {
      etape: "Coverage",
      texte:
        "Granit sends the quote to the insurer and follows the reply. You know the patient's balance without working it out yourself.",
    },
    {
      etape: "Invoice",
      texte:
        "When the prosthesis is fitted or treatment is done, Granit sends the invoice to the national health insurance and the insurer. For orthodontics, semester after semester.",
    },
    {
      etape: "Transfer",
      texte:
        "Granit matches the insurer's transfer to the invoice and follows up if payment is late. A rejection is corrected and resubmitted.",
    },
  ],
  demarrage: {
    titre: ["How we get started,", "with you."],
    etapes: [
      {
        titre: "We look at your files together",
        texte:
          "On a video call, on your own files and in your software. You see what Granit would take over at your practice.",
      },
      {
        titre: "We connect to your portals",
        texte: "Granit is connected to your portals in 48 h. No new software to learn.",
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
  logiciels: [
    "Logos_w",
    "Orisha",
    "Veasy",
    "Xtrem Santé",
    "Weclever Dental",
    "Visiodent",
    "Julie",
    "Effigie",
  ],
  plateformes: ["Viamédis", "Almerys", "Santéclair", "Kalixia"],
  plateformesNote: "Granit works on insurer portals, in the software your teams already use.",
  faq: [
    {
      question: "What do I have to do?",
      answer:
        "Your quote, in your software, as today. Granit does the rest: the coverage request, the invoice, rejections and transfer matching.",
    },
    {
      question: "Do we need to change software?",
      answer:
        "No. Granit works in your practice software and on insurer portals, as a team member would. Granit is connected to your portals in 48 h.",
    },
    {
      question: "What if a file is rejected, or something goes wrong?",
      answer:
        "The rejection is spotted, corrected and resubmitted. Special cases are followed by a Granit case manager, who alerts the team. Every file is traced: you see what was done, when, and why a file is waiting.",
    },
    {
      question:
        "We don't offer third-party payment on prosthetics, for fear of unpaid shares. Can Granit help?",
      answer:
        "Yes. Every file is followed until the insurer's transfer: the invoice is checked against the quote, rejections are corrected and resubmitted, unpaid ones followed up. You can see where each file stands at any time.",
    },
    {
      question: "What about my patients' data?",
      answer:
        "It stays in the European Union, with a host certified for health data (HDS). Granit complies with the GDPR.",
    },
    {
      question: "How much does Granit cost?",
      answer: "Granit only charges for files processed successfully.",
      rdv: "Book a meeting",
    },
  ],
  ressources: "dentaire",
};
