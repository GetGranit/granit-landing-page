// Les métiers de la page /agents et les agents de chacun, dans les mots du métier (TON.md).
//
// À VALIDER PAR CORNEILLE : la liste des agents par métier. TON.md interdit d'affirmer un flux
// qu'on ne sait pas encore opérer ; les textes viennent de l'ancien catalogue et de la landing,
// réécrits par tâche (droits, prise en charge, facturation, encaissement, rejets).
//
// Aucun chiffre ici, sauf ceux que TON.md valide (PEC en moins de 2 minutes, en optique seulement).
// Les catalogues de HomeSections.tsx et de lib/mcp/tools/list-agents.ts ne lisent pas ce fichier.

import audioprothesiste from "@/assets/metiers/audioprothesiste.jpg";
import equipeSoignante from "@/assets/metiers/equipe-soignante.jpg";
import laboratoire from "@/assets/metiers/laboratoire.jpg";
import ophtalmologie from "@/assets/metiers/ophtalmologie.jpg";
import pharmacien from "@/assets/metiers/pharmacien.jpg";

/** Slugs des pages `/agents/<slug>`, dans l'ordre de /agents. */
export const SLUGS_METIERS = [
  "optique",
  "dentaire",
  "centres-sante",
  "pharmacie",
  "cliniques-laboratoires",
] as const;
export type SlugMetier = (typeof SLUGS_METIERS)[number];

/** Les pages métier en ligne ; les autres affichent « bientôt » (noindex). */
export const PUBLIES: readonly SlugMetier[] = ["optique"];

export const estSlugMetier = (v: unknown): v is SlugMetier =>
  typeof v === "string" && (SLUGS_METIERS as readonly string[]).includes(v);

export type Agent = {
  /** La tâche, en un ou deux mots (pastille). */
  tache: string;
  /** Ce que fait l'agent, verbe d'action. */
  titre: string;
  texte: string;
  /** Où il travaille (logiciel, portail), affiché sous la tâche. */
  ou?: string;
  /** Pastille sur la photo : pendant le travail, puis une fois fait. */
  enCours: string;
  fait: string;
};

export type Metier = {
  nom: string;
  /** Une phrase pour la carte du métier sur /agents. */
  accroche: string;
  /** La promesse déclinée au métier ; la seconde moitié prend l'accent. */
  promesse: [string, string];
  /** Ce qui compte pour ce métier (TON.md, colonne « la preuve qui compte »). */
  preuve: string;
  agents: Agent[];
  outils: string;
  alt: string;
};

export const PHOTOS: Record<SlugMetier, string> = {
  optique: audioprothesiste,
  // TODO photo dentaire : aucune photo de cabinet dentaire, l'équipe soignante tient la place.
  dentaire: equipeSoignante,
  "centres-sante": ophtalmologie,
  pharmacie: pharmacien,
  "cliniques-laboratoires": laboratoire,
};

/** Position de la photo dans son cadre (object-position), pour garder le visage. */
export const CADRAGES: Record<SlugMetier, string> = {
  optique: "70% 40%",
  dentaire: "55% 50%",
  "centres-sante": "40% 35%",
  pharmacie: "45% 40%",
  "cliniques-laboratoires": "70% 40%",
};

const fr: Record<SlugMetier, Metier> = {
  optique: {
    nom: "Opticiens et audioprothésistes",
    accroche: "Prise en charge, facturation et pointage des virements, pour les lunettes comme pour les appareils auditifs.",
    promesse: ["Vos opticiens conseillent.", "Granit gère le reste."],
    preuve:
      "La prise en charge revient en moins de 2 minutes, pendant que le client est encore en boutique.",
    agents: [
      {
        tache: "Droits",
        titre: "Vérifie les droits",
        texte: "Il lit la carte de tiers payant et vérifie les droits du client sur la plateforme de sa mutuelle, avant le devis.",
        ou: "Sur la plateforme de la mutuelle",
        enCours: "Vérification des droits",
        fait: "Droits vérifiés",
      },
      {
        tache: "Prise en charge",
        titre: "Saisit la prise en charge",
        texte: "Depuis le devis de votre logiciel, il saisit la demande de prise en charge (PEC) sur le portail, pour des lunettes comme pour des appareils auditifs.",
        ou: "Depuis Cosium ou Optimum, sur le portail de la mutuelle",
        enCours: "Saisie de la prise en charge",
        fait: "Prise en charge accordée",
      },
      {
        tache: "Facturation",
        titre: "Facture et télétransmet",
        texte: "À la livraison, il envoie la facture à l'Assurance Maladie et à la mutuelle, puis suit chaque retour.",
        ou: "Depuis votre logiciel, vers l'Assurance Maladie et la mutuelle",
        enCours: "Télétransmission",
        fait: "Facture télétransmise",
      },
      {
        tache: "Rejets et encaissement",
        titre: "Traite les rejets, pointe les virements",
        texte: "Il corrige et renvoie les dossiers rejetés, rapproche chaque virement de sa facture et relance les impayés.",
        ou: "Sur vos relevés bancaires et dans votre logiciel",
        enCours: "Pointage des virements",
        fait: "Virements pointés",
      },
    ],
    outils: "Dans Cosium, Optimum et vos autres logiciels, sur toutes les plateformes de tiers payant : Almerys, Viamédis, Santéclair, Kalixia, Carte Blanche…",
    alt: "Une audioprothésiste examine l'oreille d'un patient.",
  },
  dentaire: {
    nom: "Centres dentaires",
    accroche: "Droits, accord préalable, télétransmission et restes à charge.",
    promesse: ["Vos équipes soignent.", "Granit gère le reste."],
    preuve: "Le devis prothétique et l'accord préalable avancent sans bloquer la trésorerie du mois.",
    agents: [
      {
        tache: "Droits",
        titre: "Vérifie les droits",
        texte: "Il vérifie les droits AMO et AMC du patient avant le rendez-vous.",
        enCours: "Vérification des droits",
        fait: "Droits vérifiés",
      },
      {
        tache: "Prise en charge",
        titre: "Prépare l'accord préalable",
        texte: "Depuis le devis prothétique de votre logiciel, il prépare la demande d'accord préalable (DAP) et la demande de prise en charge à la mutuelle.",
        enCours: "Demande d'accord préalable",
        fait: "Accord préalable envoyé",
      },
      {
        tache: "Facturation",
        titre: "Facture et télétransmet",
        texte: "Il télétransmet les actes à l'Assurance Maladie et à la mutuelle, semestre par semestre pour l'orthodontie.",
        enCours: "Télétransmission",
        fait: "Actes télétransmis",
      },
      {
        tache: "Rejets et relances",
        titre: "Traite les rejets, relance les restes à charge",
        texte: "Il repère les rejets, corrige et renvoie le dossier, pointe les virements et relance les montants dus.",
        enCours: "Traitement des rejets",
        fait: "Rejet corrigé et renvoyé",
      },
    ],
    outils: "Dans le logiciel de votre cabinet et sur les portails des mutuelles, sans API à demander.",
    alt: "Une équipe soignante marche dans un couloir de centre de santé.",
  },
  "centres-sante": {
    nom: "Centres de santé et ophtalmologie",
    accroche: "Droits du jour, prises en charge, feuilles de soins et paiements.",
    promesse: ["Vos équipes accueillent.", "Granit gère le reste."],
    preuve: "Les dossiers avancent 7 jours sur 7, et l'accueil se consacre aux patients.",
    agents: [
      {
        tache: "Droits",
        titre: "Vérifie les droits du jour",
        texte: "À partir de l'agenda, il vérifie les droits AMO et AMC de chaque patient avant la consultation.",
        enCours: "Droits des patients du jour",
        fait: "Droits du jour vérifiés",
      },
      {
        tache: "Prise en charge",
        titre: "Demande les prises en charge",
        texte: "Quand l'acte ou l'équipement le demande, il saisit la demande de prise en charge auprès de la mutuelle et suit la réponse.",
        enCours: "Demande de prise en charge",
        fait: "Prise en charge accordée",
      },
      {
        tache: "Facturation",
        titre: "Facture le tiers payant",
        texte: "Il télétransmet les feuilles de soins à l'Assurance Maladie et aux mutuelles, puis lit les retours Noémie.",
        enCours: "Télétransmission du lot",
        fait: "Lot télétransmis",
      },
      {
        tache: "Encaissement",
        titre: "Pointe les paiements, traite les rejets",
        texte: "Il rapproche chaque paiement de sa facture, corrige les rejets et relance les impayés.",
        enCours: "Pointage des paiements",
        fait: "Paiements pointés",
      },
    ],
    outils: "Dans votre logiciel médical et sur les portails de l'Assurance Maladie et des mutuelles.",
    alt: "Un ophtalmologiste examine le fond d'œil d'une patiente.",
  },
  pharmacie: {
    nom: "Pharmacies",
    accroche: "Retours Noémie, rejets et paiements des organismes.",
    promesse: ["Vos équipes conseillent.", "Granit gère le reste."],
    preuve: "Les rejets sont traités, sans y passer la soirée.",
    agents: [
      {
        tache: "Droits",
        titre: "Vérifie les droits",
        texte: "Il contrôle les droits AMO et AMC liés à l'ordonnance avant la facturation.",
        enCours: "Vérification des droits",
        fait: "Droits vérifiés",
      },
      {
        tache: "Facturation",
        titre: "Suit la télétransmission",
        texte: "Il suit les lots envoyés à l'Assurance Maladie et aux mutuelles, et lit chaque retour Noémie.",
        enCours: "Lecture des retours Noémie",
        fait: "Retours Noémie lus",
      },
      {
        tache: "Rejets",
        titre: "Traite les rejets Noémie",
        texte: "Il analyse chaque rejet, corrige le dossier et le renvoie. Les cas particuliers remontent à un gestionnaire Granit.",
        enCours: "Correction des rejets",
        fait: "Rejets corrigés",
      },
      {
        tache: "Encaissement",
        titre: "Pointe les paiements",
        texte: "Il rapproche les paiements des organismes de vos factures et relance les impayés.",
        enCours: "Rapprochement des paiements",
        fait: "Paiements rapprochés",
      },
    ],
    outils: "Dans votre logiciel d'officine et sur les portails des organismes, sans nouveau logiciel.",
    alt: "Un pharmacien consulte un document devant les rayonnages de l'officine.",
  },
  "cliniques-laboratoires": {
    nom: "Cliniques et laboratoires",
    accroche: "Dossiers d'admission, prises en charge, facturation et relances.",
    promesse: ["Vos soignants soignent.", "Granit gère le reste."],
    preuve: "Le temps des gestionnaires revient aux dossiers qui en ont besoin.",
    agents: [
      {
        tache: "Droits",
        titre: "Complète le dossier d'admission",
        texte: "Il vérifie les droits du patient et la complétude du dossier avant l'admission ou le prélèvement.",
        enCours: "Complétude du dossier",
        fait: "Dossier complet",
      },
      {
        tache: "Prise en charge",
        titre: "Demande les prises en charge",
        texte: "Il saisit les demandes de prise en charge auprès des mutuelles et suit les réponses.",
        enCours: "Demande de prise en charge",
        fait: "Prise en charge reçue",
      },
      {
        tache: "Facturation",
        titre: "Facture et télétransmet",
        texte: "Il télétransmet les factures à l'Assurance Maladie et aux mutuelles, puis suit les retours.",
        enCours: "Télétransmission",
        fait: "Factures télétransmises",
      },
      {
        tache: "Rejets et relances",
        titre: "Traite les rejets, relance les restes à charge",
        texte: "Il corrige les rejets, pointe les paiements et relance les restes à charge des patients.",
        enCours: "Relance des restes à charge",
        fait: "Relances envoyées",
      },
    ],
    outils: "Dans votre logiciel de gestion et sur les portails des organismes, sans intégration.",
    alt: "Une biologiste pipette un échantillon au laboratoire.",
  },
};

const en: Record<SlugMetier, Metier> = {
  optique: {
    nom: "Opticians and hearing care",
    accroche: "Coverage, billing and transfer matching, for glasses and hearing aids alike.",
    promesse: ["Your opticians advise.", "Granit handles the rest."],
    preuve: "The coverage approval comes back in under 2 minutes, while the customer is still in the store.",
    agents: [
      { tache: "Eligibility", titre: "Checks eligibility", texte: "Reads the insurance card and checks the customer's rights on their insurer's platform, before the quote.", ou: "On the insurer's platform", enCours: "Checking eligibility", fait: "Eligibility checked" },
      { tache: "Coverage", titre: "Files the coverage request", texte: "From the quote in your software, files the coverage request on the portal, for glasses and hearing aids alike.", ou: "From Cosium or Optimum, on the insurer's portal", enCours: "Filing the coverage request", fait: "Coverage approved" },
      { tache: "Billing", titre: "Bills and transmits", texte: "On delivery, sends the invoice to the public scheme and the insurer, then follows every reply.", ou: "From your software, to the public scheme and the insurer", enCours: "Transmitting", fait: "Invoice transmitted" },
      { tache: "Rejections and payments", titre: "Handles rejections, matches transfers", texte: "Corrects and resubmits rejected files, matches each transfer to its invoice and follows up on unpaid ones.", ou: "On your bank statements and in your software", enCours: "Matching transfers", fait: "Transfers matched" },
    ],
    outils: "In Cosium, Optimum and your other software, on every third-party payment platform: Almerys, Viamédis, Santéclair, Kalixia, Carte Blanche…",
    alt: "A hearing care professional examines a patient's ear.",
  },
  dentaire: {
    nom: "Dental centers",
    accroche: "Eligibility, prior approval, transmission and patient balances.",
    promesse: ["Your teams care.", "Granit handles the rest."],
    preuve: "Prosthetic quotes and prior approvals move forward without holding up the month's cash.",
    agents: [
      { tache: "Eligibility", titre: "Checks eligibility", texte: "Checks the patient's public and private coverage before the appointment.", enCours: "Checking eligibility", fait: "Eligibility checked" },
      { tache: "Coverage", titre: "Prepares prior approval", texte: "From the prosthetic quote in your software, prepares the prior approval request and the insurer coverage request.", enCours: "Prior approval request", fait: "Prior approval sent" },
      { tache: "Billing", titre: "Bills and transmits", texte: "Transmits procedures to the public scheme and the insurer, semester by semester for orthodontics.", enCours: "Transmitting", fait: "Procedures transmitted" },
      { tache: "Rejections and follow-ups", titre: "Handles rejections, follows up balances", texte: "Spots rejections, corrects and resubmits, matches transfers and follows up on amounts due.", enCours: "Handling rejections", fait: "Rejection resubmitted" },
    ],
    outils: "In your practice software and on insurer portals, with no API to request.",
    alt: "A care team walks down a health center corridor.",
  },
  "centres-sante": {
    nom: "Health centers and ophthalmology",
    accroche: "Today's eligibility, coverage, claims and payments.",
    promesse: ["Your teams welcome patients.", "Granit handles the rest."],
    preuve: "Files move forward 7 days a week, and the front desk focuses on patients.",
    agents: [
      { tache: "Eligibility", titre: "Checks the day's eligibility", texte: "From the schedule, checks each patient's public and private coverage before the visit.", enCours: "Today's patients", fait: "Today's eligibility checked" },
      { tache: "Coverage", titre: "Requests coverage", texte: "When the procedure or device requires it, files the coverage request with the insurer and follows the answer.", enCours: "Coverage request", fait: "Coverage approved" },
      { tache: "Billing", titre: "Bills third-party payment", texte: "Transmits claims to the public scheme and insurers, then reads the returns.", enCours: "Transmitting the batch", fait: "Batch transmitted" },
      { tache: "Payments", titre: "Matches payments, handles rejections", texte: "Matches each payment to its invoice, corrects rejections and follows up on unpaid ones.", enCours: "Matching payments", fait: "Payments matched" },
    ],
    outils: "In your medical software and on public scheme and insurer portals.",
    alt: "An ophthalmologist examines a patient's eye.",
  },
  pharmacie: {
    nom: "Pharmacies",
    accroche: "Returns, rejections and payer payments.",
    promesse: ["Your teams advise.", "Granit handles the rest."],
    preuve: "Rejections get handled without spending the evening on them.",
    agents: [
      { tache: "Eligibility", titre: "Checks eligibility", texte: "Checks the public and private coverage tied to the prescription before billing.", enCours: "Checking eligibility", fait: "Eligibility checked" },
      { tache: "Billing", titre: "Follows transmission", texte: "Follows the batches sent to the public scheme and insurers, and reads every return.", enCours: "Reading returns", fait: "Returns read" },
      { tache: "Rejections", titre: "Handles rejections", texte: "Analyzes each rejection, corrects the file and resubmits it. Special cases go to a Granit case manager.", enCours: "Correcting rejections", fait: "Rejections corrected" },
      { tache: "Payments", titre: "Matches payments", texte: "Matches payer payments to your invoices and follows up on unpaid ones.", enCours: "Matching payments", fait: "Payments matched" },
    ],
    outils: "In your pharmacy software and on payer portals, with no new software.",
    alt: "A pharmacist reads a document in front of the pharmacy shelves.",
  },
  "cliniques-laboratoires": {
    nom: "Clinics and laboratories",
    accroche: "Admission files, coverage, billing and follow-ups.",
    promesse: ["Your caregivers care.", "Granit handles the rest."],
    preuve: "Administrative staff get their time back for the files that need it.",
    agents: [
      { tache: "Eligibility", titre: "Completes the admission file", texte: "Checks the patient's rights and that the file is complete before admission or sampling.", enCours: "Checking the file", fait: "File complete" },
      { tache: "Coverage", titre: "Requests coverage", texte: "Files coverage requests with insurers and follows the answers.", enCours: "Coverage request", fait: "Coverage received" },
      { tache: "Billing", titre: "Bills and transmits", texte: "Transmits invoices to the public scheme and insurers, then follows the returns.", enCours: "Transmitting", fait: "Invoices transmitted" },
      { tache: "Rejections and follow-ups", titre: "Handles rejections, follows up balances", texte: "Corrects rejections, matches payments and follows up on patient balances.", enCours: "Following up balances", fait: "Follow-ups sent" },
    ],
    outils: "In your management software and on payer portals, with no integration.",
    alt: "A biologist pipettes a sample in the laboratory.",
  },
};

export const METIERS = { fr, en };
