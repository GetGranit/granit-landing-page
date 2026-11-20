import type { PageMetier } from "../pages";

// Opticiens : réécrit le 18/11/2026 après l'échange du 9/11 avec un coach d'opticiens.
// Ses retours : trop technique (API, RGPD, sigles), on ne comprend pas ce que fait Granit ni pour qui,
// l'opticien veut n'avoir rien à faire, dans son logiciel, et être accompagné pas à pas. D'où : pas de
// sigle sans explication, une page 100 % opticiens, « ce que vous n'avez plus à faire » et « comment on démarre ».
export const opticiensFr: PageMetier = {
  titreSeo: "Granit pour les opticiens : le tiers payant fait à votre place",
  descriptionSeo:
    "Vous faites le devis dans Cosium ou Optimum, Granit fait le reste : la prise en charge revient en moins de 2 minutes, la facture part à la livraison, les rejets sont traités et les virements des mutuelles pointés.",
  etapesHero: [
    {
      enCours: "Vérification des droits",
      fait: "Droits vérifiés",
      detail: "Sur la plateforme de la mutuelle",
    },
    {
      enCours: "Demande de prise en charge",
      fait: "Prise en charge accordée",
      detail: "Pendant que le client est en boutique",
    },
    {
      enCours: "Envoi de la facture",
      fait: "Facture envoyée",
      detail: "Assurance Maladie et mutuelle",
    },
    { enCours: "Pointage du virement", fait: "Virement pointé", detail: "Rapproché de sa facture" },
  ],
  garanties: [
    {
      titre: "Rien ne change au comptoir",
      texte: "Vous faites le devis dans votre logiciel, comme d'habitude. Pas de nouveau logiciel.",
    },
    {
      titre: "La prise en charge en moins de 2 minutes",
      texte: "Elle revient pendant que le client est encore en boutique.",
    },
    { titre: "7 jours sur 7", texte: "Les dossiers avancent, même quand quelqu'un s'absente." },
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
        avant: "Ressaisir le devis sur le portail de chaque mutuelle.",
        apres: "La demande de prise en charge part depuis le devis de votre logiciel.",
      },
      {
        etape: "Prise en charge",
        cle: "en moins de 2 minutes",
        avant: "Attendre la réponse de la mutuelle, le client devant vous.",
        apres: "La prise en charge revient en moins de 2 minutes.",
      },
      {
        etape: "Facture",
        cle: "À la livraison",
        avant: "Envoyer les factures et vérifier qu'elles sont bien parties.",
        apres: "À la livraison, la facture part à l'Assurance Maladie et à la mutuelle.",
      },
      {
        etape: "Rejets",
        cle: "repéré, corrigé et renvoyé",
        avant: "Chercher pourquoi un dossier est rejeté, le corriger, le renvoyer.",
        apres: "Le rejet est repéré, corrigé et renvoyé. Les cas particuliers vous sont signalés.",
      },
      {
        etape: "Paiement",
        cle: "rapproché de sa facture",
        avant: "Pointer les virements des mutuelles sur le relevé, relancer les impayés.",
        apres: "Chaque virement est rapproché de sa facture. Les impayés sont relancés.",
      },
    ],
  },
  dossierTitre: ["Un dossier, du devis", "au virement de la mutuelle."],
  dossier: [
    {
      etape: "Devis",
      texte:
        "Vous faites le devis dans votre logiciel, comme d'habitude. Rien ne change au comptoir.",
    },
    {
      etape: "Droits",
      texte: "Granit vérifie les droits du client sur la plateforme de sa mutuelle.",
    },
    {
      etape: "Prise en charge",
      texte:
        "Granit fait la demande de prise en charge sur le portail. Elle revient en moins de 2 minutes, pendant que le client est encore en boutique.",
    },
    {
      etape: "Livraison",
      texte: "À la livraison, Granit envoie la facture à l'Assurance Maladie et à la mutuelle.",
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
          "En visio, sur vos propres dossiers et dans votre logiciel. Vous voyez ce que Granit prendrait en charge chez vous.",
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
  logiciels: ["Cosium", "Optimum"],
  plateformes: ["Almerys", "Viamédis", "Santéclair", "Kalixia", "Carte Blanche"],
  plateformesNote:
    "Granit travaille avec toutes les plateformes de tiers payant, et dans les logiciels que vos équipes utilisent déjà.",
  faq: [
    {
      question: "Qu'est-ce que je dois faire, moi ?",
      answer:
        "Votre devis, dans votre logiciel, comme aujourd'hui. Granit fait la suite : la prise en charge, la facture, les rejets et le pointage des virements.",
    },
    {
      question: "Faut-il changer de logiciel ?",
      answer:
        "Non. Granit travaille dans votre logiciel (Cosium, Optimum…) et sur les portails des mutuelles, comme le ferait une personne de l'équipe. Granit est branché sur vos portails en 48 h.",
    },
    {
      question: "Et si un dossier est rejeté, ou si quelque chose cloche ?",
      answer:
        "Le rejet est repéré, corrigé et renvoyé. Les cas particuliers sont suivis par un gestionnaire Granit, qui prévient l'équipe. Chaque dossier est tracé : vous voyez ce qui a été fait, quand, et pourquoi un dossier attend.",
    },
    {
      question: "Quelles mutuelles sont couvertes ?",
      answer:
        "Granit travaille avec toutes les plateformes de tiers payant, par exemple Almerys, Viamédis, Santéclair, Kalixia ou Carte Blanche.",
    },
    {
      question: "Et les données de mes clients ?",
      answer:
        "Elles restent dans l'Union européenne, chez un hébergeur certifié pour les données de santé (on dit « certifié HDS »). Granit respecte le règlement européen sur les données personnelles (RGPD).",
    },
    {
      question: "Combien coûte Granit ?",
      answer: "Granit ne facture que les dossiers traités avec succès.",
      rdv: "Prendre rendez-vous",
    },
  ],
  ressources: "optique",
};

export const opticiensEn: PageMetier = {
  titreSeo: "Granit for opticians: third-party payment done for you",
  descriptionSeo:
    "You make the quote in Cosium or Optimum, Granit does the rest: coverage comes back in under 2 minutes, the invoice goes out on delivery, rejections are handled and insurer transfers matched.",
  etapesHero: [
    {
      enCours: "Checking eligibility",
      fait: "Eligibility checked",
      detail: "On the insurer's platform",
    },
    {
      enCours: "Coverage request",
      fait: "Coverage approved",
      detail: "While the customer is in the store",
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
      titre: "Nothing changes at the counter",
      texte: "You make the quote in your software, as usual. No new software.",
    },
    {
      titre: "Coverage in under 2 minutes",
      texte: "It comes back while the customer is still in the store.",
    },
    { titre: "7 days a week", texte: "Files move forward, even when someone is away." },
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
        avant: "Re-entering the quote on each insurer's portal.",
        apres: "The coverage request goes out from the quote in your software.",
      },
      {
        etape: "Coverage",
        cle: "in under 2 minutes",
        avant: "Waiting for the insurer's answer, customer in front of you.",
        apres: "Coverage comes back in under 2 minutes.",
      },
      {
        etape: "Invoicing",
        cle: "On delivery",
        avant: "Sending invoices and checking they went through.",
        apres: "On delivery, the invoice goes to the national health insurance and the insurer.",
      },
      {
        etape: "Rejections",
        cle: "spotted, corrected and resubmitted",
        avant: "Finding out why a file was rejected, fixing it, resubmitting it.",
        apres:
          "The rejection is spotted, corrected and resubmitted. Special cases are flagged to you.",
      },
      {
        etape: "Payment",
        cle: "matched to its invoice",
        avant: "Matching insurer transfers on the bank statement, chasing unpaid ones.",
        apres: "Each transfer is matched to its invoice. Unpaid ones are followed up.",
      },
    ],
  },
  dossierTitre: ["One file, from the quote", "to the insurer's transfer."],
  dossier: [
    {
      etape: "Quote",
      texte: "You make the quote in your software, as usual. Nothing changes at the counter.",
    },
    {
      etape: "Eligibility",
      texte: "Granit checks the customer's eligibility on their insurer's platform.",
    },
    {
      etape: "Coverage",
      texte:
        "Granit files the coverage request on the portal. It comes back in under 2 minutes, while the customer is still in the store.",
    },
    {
      etape: "Delivery",
      texte:
        "On delivery, Granit sends the invoice to the national health insurance and the insurer.",
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
          "On a video call, on your own files and in your software. You see what Granit would take over for you.",
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
  logiciels: ["Cosium", "Optimum"],
  plateformes: ["Almerys", "Viamédis", "Santéclair", "Kalixia", "Carte Blanche"],
  plateformesNote:
    "Granit works with every third-party payment platform, in the software your teams already use.",
  faq: [
    {
      question: "What do I have to do?",
      answer:
        "Your quote, in your software, as today. Granit does the rest: coverage, invoice, rejections and transfer matching.",
    },
    {
      question: "Do we need to change software?",
      answer:
        "No. Granit works in your software (Cosium, Optimum…) and on insurer portals, as a team member would. Granit is connected to your portals in 48 h.",
    },
    {
      question: "What if a file is rejected, or something goes wrong?",
      answer:
        "The rejection is spotted, corrected and resubmitted. Special cases are followed by a Granit case manager, who alerts the team. Every file is traced: you see what was done, when, and why a file is waiting.",
    },
    {
      question: "Which insurers are covered?",
      answer:
        "Granit works with every third-party payment platform, for example Almerys, Viamédis, Santéclair, Kalixia or Carte Blanche.",
    },
    {
      question: "What about my customers' data?",
      answer:
        "It stays in the European Union, with a host certified for health data (HDS). Granit complies with the GDPR.",
    },
    {
      question: "How much does Granit cost?",
      answer: "Granit only charges for files processed successfully.",
      rdv: "Book a meeting",
    },
  ],
  ressources: "optique",
};
