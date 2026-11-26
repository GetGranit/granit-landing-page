// Les métiers de la page /metiers et les agents de chacun, dans les mots du métier (TON.md).
//
// À VALIDER PAR CORNEILLE : la liste des agents par métier. TON.md interdit d'affirmer un flux
// qu'on ne sait pas encore opérer ; les textes viennent de l'ancien catalogue et de la landing,
// réécrits par tâche (droits, prise en charge, facturation, encaissement, rejets).
//
// Aucun chiffre ici, sauf ceux que TON.md valide (PEC en moins de 2 minutes, en optique seulement).
// Les catalogues de HomeSections.tsx et de lib/mcp/tools/list-agents.ts ne lisent pas ce fichier.

import centreSante from "@/assets/metiers/centre-sante.jpg";
import dentaire from "@/assets/metiers/dentaire.jpg";
import laboratoire from "@/assets/metiers/laboratoire.jpg";
import opticien from "@/assets/metiers/opticien.jpg";
import pharmacien from "@/assets/metiers/pharmacien.jpg";

/** Slugs des pages `/metiers/<slug>`, dans l'ordre de /metiers. */
export const SLUGS_METIERS = [
  "optique-audio",
  "dentaire",
  "centres-sante",
  "pharmacie",
  "cliniques-laboratoires",
] as const;
export type SlugMetier = (typeof SLUGS_METIERS)[number];

/** Les pages métier en ligne ; les autres affichent « bientôt » (noindex). */
export const PUBLIES: readonly SlugMetier[] = SLUGS_METIERS;

/** Anciens slugs, redirigés en 301 vers le nouveau (voir routes/agents.$metier.tsx). */
export const ANCIENS_SLUGS: Record<string, SlugMetier> = {
  optique: "optique-audio",
  opticiens: "optique-audio",
};

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
  /** Une phrase pour la carte du métier sur /metiers. */
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
  "optique-audio": opticien,
  dentaire,
  "centres-sante": centreSante,
  pharmacie: pharmacien,
  "cliniques-laboratoires": laboratoire,
};

/** Taille des photos : 1376 × 768 (paysage) pour les trois nouvelles, 520 × 780 pour les autres. */
export const TAILLES: Record<SlugMetier, [number, number]> = {
  "optique-audio": [1376, 768],
  dentaire: [1376, 768],
  "centres-sante": [1376, 768],
  pharmacie: [520, 780],
  "cliniques-laboratoires": [520, 780],
};

/** Position de la photo dans une carte (object-position) : les visages en haut, hors du texte. */
export const CADRAGES: Record<SlugMetier, string> = {
  "optique-audio": "55% 30%",
  dentaire: "60% 30%",
  "centres-sante": "50% 30%",
  pharmacie: "45% 40%",
  "cliniques-laboratoires": "70% 40%",
};

const fr: Record<SlugMetier, Metier> = {
  "optique-audio": {
    nom: "Optique et Audition",
    accroche:
      "La prise en charge, la facture et le suivi des virements, faits à votre place, sans changer de logiciel.",
    promesse: ["Vos opticiens conseillent.", "Granit gère le reste."],
    preuve:
      "Vous faites le devis dans votre logiciel, comme d'habitude. Granit s'occupe du tiers payant : la prise en charge, la facture, les rejets et les virements des mutuelles.",
    agents: [
      {
        tache: "Droits",
        titre: "Vérifie les droits",
        texte: "Il vérifie les droits du client sur la plateforme de sa mutuelle, avant le devis.",
        ou: "Sur la plateforme de la mutuelle",
        enCours: "Vérification des droits",
        fait: "Droits vérifiés",
      },
      {
        tache: "Prise en charge",
        titre: "Fait la demande de prise en charge",
        texte:
          "Il reprend le devis de votre logiciel et fait la demande de prise en charge (PEC) sur le portail de la mutuelle. Vous ne ressaisissez rien.",
        ou: "Depuis Cosium ou Optimum, sur le portail de la mutuelle",
        enCours: "Demande de prise en charge",
        fait: "Prise en charge accordée",
      },
      {
        tache: "Facturation",
        titre: "Envoie la facture",
        texte:
          "À la livraison, il envoie la facture à l'Assurance Maladie et à la mutuelle, puis suit chaque retour.",
        ou: "Depuis votre logiciel",
        enCours: "Envoi de la facture",
        fait: "Facture envoyée",
      },
      {
        tache: "Rejets et virements",
        titre: "Traite les rejets, pointe les virements",
        texte:
          "Il corrige et renvoie les dossiers rejetés, rapproche chaque virement de sa facture et relance les impayés.",
        ou: "Sur vos relevés bancaires et dans votre logiciel",
        enCours: "Pointage des virements",
        fait: "Virements pointés",
      },
    ],
    outils:
      "Dans Cosium, Optimum et vos autres logiciels, sur toutes les plateformes de tiers payant : Almerys, Viamédis, Santéclair, Kalixia, Carte Blanche…",
    alt: "Une opticienne ajuste les lunettes d'une cliente en magasin.",
  },
  dentaire: {
    nom: "Centres dentaires",
    accroche:
      "La prise en charge des devis, la facture et le suivi des virements des mutuelles, faits à votre place, sans changer de logiciel.",
    promesse: ["Vos équipes soignent.", "Granit gère le reste."],
    preuve:
      "Vous faites le devis dans votre logiciel, comme d'habitude. Granit s'occupe de la suite : la demande de prise en charge à la mutuelle, la facture, les rejets et les virements. Le dossier ne bloque plus la trésorerie du mois.",
    agents: [
      {
        tache: "Droits",
        titre: "Vérifie les droits",
        texte:
          "Il vérifie les droits du patient sur le portail de sa mutuelle, avant le plan de traitement.",
        ou: "Sur le portail de la mutuelle",
        enCours: "Vérification des droits",
        fait: "Droits vérifiés",
      },
      {
        tache: "Prise en charge",
        titre: "Fait la demande de prise en charge",
        texte:
          "Il reprend le devis de votre logiciel et l'envoie à la mutuelle du patient. Vous ne ressaisissez rien. Il suit la réponse et vous donne le reste à charge à annoncer au patient.",
        ou: "Depuis votre logiciel, sur le portail de la mutuelle",
        enCours: "Demande de prise en charge",
        fait: "Prise en charge reçue",
      },
      {
        tache: "Facturation",
        titre: "Envoie la facture",
        texte:
          "À la pose de la prothèse ou à la fin des soins, il envoie la facture à l'Assurance Maladie et à la mutuelle, puis suit chaque retour. Pour l'orthodontie, semestre après semestre.",
        ou: "Depuis votre logiciel",
        enCours: "Envoi de la facture",
        fait: "Facture envoyée",
      },
      {
        tache: "Rejets et virements",
        titre: "Traite les rejets, pointe les virements",
        texte:
          "Il corrige et renvoie les dossiers rejetés, rapproche chaque virement de sa facture et relance les parts mutuelle impayées.",
        ou: "Sur vos relevés bancaires et dans votre logiciel",
        enCours: "Pointage des virements",
        fait: "Virements pointés",
      },
    ],
    outils:
      "Dans le logiciel de votre cabinet, sur les portails des mutuelles : Viamédis, Almerys, Santéclair, Kalixia…",
    alt: "Au cabinet dentaire, une assistante parle à une patiente, tablette en main, à côté du praticien.",
  },
  "centres-sante": {
    nom: "Centres de santé et ophtalmologie",
    accroche:
      "Les droits, les factures, les rejets et les virements, faits à votre place, sans changer de logiciel.",
    promesse: ["Vos équipes accueillent.", "Granit gère le reste."],
    preuve:
      "Le médecin valide sa consultation, la facture est déjà prête quand le patient repasse à l'accueil. Granit suit ensuite chaque dossier : les rejets de l'Assurance Maladie, les feuilles de soins papier, les virements de l'Assurance Maladie et des mutuelles.",
    agents: [
      {
        tache: "Droits",
        titre: "Vérifie les droits",
        texte:
          "Il vérifie les droits des patients du jour auprès de l'Assurance Maladie, et de leur mutuelle quand vous faites le tiers payant sur sa part, avant leur consultation.",
        ou: "Sur amelipro et, si besoin, sur le portail de la mutuelle",
        enCours: "Droits des patients du jour",
        fait: "Droits vérifiés",
      },
      {
        tache: "Facturation",
        titre: "Prépare la facture",
        texte:
          "Dès que le médecin valide sa consultation, il reprend les actes et leur cotation, et prépare la facture dans votre logiciel de facturation. À l'accueil, il ne reste qu'à passer la carte Vitale. Vous ne recopiez rien.",
        ou: "Depuis votre logiciel médical, dans votre logiciel de facturation",
        enCours: "Préparation de la facture",
        fait: "Facture prête",
      },
      {
        tache: "Rejets",
        titre: "Traite les rejets",
        texte:
          "Il lit chaque jour les retours de l'Assurance Maladie et des mutuelles, trouve le motif du rejet, corrige la facture et la renvoie. Il suit aussi les feuilles de soins papier jusqu'au paiement.",
        ou: "Dans vos retours de paiement et sur amelipro",
        enCours: "Traitement des rejets",
        fait: "Rejet corrigé et renvoyé",
      },
      {
        tache: "Virements",
        titre: "Pointe les virements, relance les impayés",
        texte:
          "Il rapproche chaque virement de l'Assurance Maladie et des mutuelles de ses factures, et relance ce qui n'est pas payé.",
        ou: "Sur vos relevés bancaires et dans votre logiciel de facturation",
        enCours: "Pointage des virements",
        fait: "Virements pointés",
      },
    ],
    outils:
      "Dans Desmos, Doctolib et vos autres logiciels, sur amelipro et les portails des mutuelles.",
    alt: "À l'accueil d'un centre de santé, une secrétaire reçoit une patiente.",
  },
  pharmacie: {
    nom: "Pharmacies",
    accroche:
      "Les nouvelles ordonnances des EHPAD que vous servez, récupérées et comparées au traitement en cours, sans changer de logiciel.",
    promesse: ["Vos pharmaciens conseillent.", "Granit gère le reste."],
    preuve:
      "Vous validez et préparez les doses, comme d'habitude. Granit s'occupe du reste : il va chercher les nouvelles ordonnances dans le logiciel de chaque EHPAD et dans vos mails, les compare au traitement en cours et vous signale ce qui change.",
    agents: [
      {
        tache: "Ordonnances",
        titre: "Récupère les nouvelles ordonnances",
        texte:
          "Il passe dans le logiciel de soins de chaque EHPAD que vous servez et récupère chaque nouvelle ordonnance dès que le médecin la met en ligne. Vous n'ouvrez plus un logiciel par EHPAD.",
        ou: "Dans NETSoins, TitanLink et les autres logiciels des EHPAD",
        enCours: "Recherche des nouvelles ordonnances",
        fait: "Ordonnances récupérées",
      },
      {
        tache: "Mails",
        titre: "Lit les ordonnances reçues par mail",
        texte:
          "Certains EHPAD envoient leurs ordonnances par mail. Il les récupère aussi, et elles rejoignent les autres.",
        ou: "Dans vos mails",
        enCours: "Lecture des mails",
        fait: "Ordonnances du mail récupérées",
      },
      {
        tache: "Comparaison",
        titre: "Compare au traitement en cours",
        texte:
          "Il compare chaque nouvelle ordonnance au traitement en cours du résident : un médicament ajouté, un médicament arrêté, une posologie modifiée.",
        ou: "Avec le traitement en cours du résident",
        enCours: "Comparaison des ordonnances",
        fait: "Changements repérés",
      },
      {
        tache: "Préparation des doses",
        titre: "Vous envoie les changements du jour",
        texte:
          "Il envoie à la pharmacie la liste des changements, pour la préparation des doses à administrer (PDA). Le pharmacien valide, toujours.",
        ou: "Pour votre équipe de préparation",
        enCours: "Envoi des changements",
        fait: "Changements envoyés",
      },
    ],
    outils:
      "Dans les logiciels de soins des EHPAD que vous servez (NETSoins, TitanLink…) et dans vos mails, sans nouveau logiciel, ni pour vous ni pour l'EHPAD.",
    alt: "Un pharmacien consulte un document devant les rayonnages de l'officine.",
  },
  "cliniques-laboratoires": {
    nom: "Cliniques et laboratoires",
    accroche:
      "Le dossier du patient, les prises en charge, les rejets et le pointage des virements, faits à votre place, sans changer de logiciel.",
    promesse: ["Vos équipes soignent.", "Granit gère le reste."],
    preuve:
      "Votre bureau des entrées ou votre secrétariat travaille dans son logiciel, comme d'habitude. Granit fait le reste : le dossier complet, la prise en charge, les rejets et le pointage des virements. Vos gestionnaires gardent leur temps pour les dossiers qui demandent un appel.",
    agents: [
      {
        tache: "Dossier patient",
        titre: "Complète le dossier du patient",
        texte:
          "Au bureau des entrées ou à l'accueil du laboratoire, il reprend l'ordonnance, la carte Vitale et la carte de mutuelle, vérifie les droits du patient et complète le dossier dans votre logiciel. Votre secrétariat vérifie et valide.",
        ou: "Dans votre logiciel de gestion des patients ou de laboratoire",
        enCours: "Complétude du dossier",
        fait: "Dossier complet",
      },
      {
        tache: "Prise en charge",
        titre: "Fait les demandes de prise en charge",
        texte:
          "Quand le séjour ou l'examen le demande, il fait la demande de prise en charge à la mutuelle, suit la réponse et la range dans le dossier du patient.",
        ou: "Sur les portails des mutuelles",
        enCours: "Demande de prise en charge",
        fait: "Prise en charge reçue",
      },
      {
        tache: "Facturation et rejets",
        titre: "Contrôle avant l'envoi, traite les rejets",
        texte:
          "Avant l'envoi de la feuille de soins électronique (FSE), il repère ce qui manque : ordonnance, prescripteur, mutuelle. Après l'envoi, il corrige et renvoie les rejets simples. Les cas particuliers vous sont signalés.",
        ou: "Dans votre logiciel, avant l'envoi à l'Assurance Maladie et aux mutuelles",
        enCours: "Traitement des rejets",
        fait: "Rejet corrigé et renvoyé",
      },
      {
        tache: "Virements",
        titre: "Pointe les virements, relance les impayés",
        texte:
          "Quand une mutuelle paie plusieurs dossiers en un seul virement, il retrouve le détail, rapproche chaque paiement de sa facture et relance les impayés.",
        ou: "Sur vos relevés bancaires, sur amelipro et sur les sites des mutuelles",
        enCours: "Pointage des virements",
        fait: "Virements pointés",
      },
    ],
    outils:
      "Dans votre logiciel de gestion des patients (Hopital Manager…) ou de laboratoire (Hexalis, KaliSil…), sur amelipro et les portails des mutuelles, sans nouveau logiciel.",
    alt: "Une biologiste pipette un échantillon au laboratoire.",
  },
};

const en: Record<SlugMetier, Metier> = {
  "optique-audio": {
    nom: "Optics and Hearing",
    accroche:
      "Coverage requests, billing and transfer matching, done for you, without changing software.",
    promesse: ["Your opticians advise.", "Granit handles the rest."],
    preuve:
      "You make the quote in your software, as usual. Granit handles third-party payment: coverage requests, invoices, rejections and insurer transfers.",
    agents: [
      {
        tache: "Eligibility",
        titre: "Checks eligibility",
        texte: "Checks the customer's eligibility on their insurer's platform, before the quote.",
        ou: "On the insurer's platform",
        enCours: "Checking eligibility",
        fait: "Eligibility checked",
      },
      {
        tache: "Coverage",
        titre: "Files the coverage request",
        texte:
          "Takes the quote from your software and files the coverage request on the insurer's portal. You re-enter nothing.",
        ou: "From Cosium or Optimum, on the insurer's portal",
        enCours: "Coverage request",
        fait: "Coverage approved",
      },
      {
        tache: "Billing",
        titre: "Sends the invoice",
        texte:
          "On delivery, sends the invoice to the national health insurance and the insurer, then follows every reply.",
        ou: "From your software",
        enCours: "Sending the invoice",
        fait: "Invoice sent",
      },
      {
        tache: "Rejections and transfers",
        titre: "Handles rejections, matches transfers",
        texte:
          "Corrects and resubmits rejected files, matches each transfer to its invoice and follows up on unpaid ones.",
        ou: "On your bank statements and in your software",
        enCours: "Matching transfers",
        fait: "Transfers matched",
      },
    ],
    outils:
      "In Cosium, Optimum and your other software, on every third-party payment platform: Almerys, Viamédis, Santéclair, Kalixia, Carte Blanche…",
    alt: "An optician fits a customer's glasses in the store.",
  },
  dentaire: {
    nom: "Dental centers",
    accroche:
      "Coverage requests on quotes, billing and insurer transfer matching, done for you, without changing software.",
    promesse: ["Your teams care.", "Granit handles the rest."],
    preuve:
      "You make the quote in your software, as usual. Granit handles the rest: the coverage request to the insurer, the invoice, rejections and transfers. Files no longer hold up the month's cash.",
    agents: [
      {
        tache: "Eligibility",
        titre: "Checks eligibility",
        texte:
          "Checks the patient's coverage on their insurer's portal, before the treatment plan.",
        ou: "On the insurer's portal",
        enCours: "Checking eligibility",
        fait: "Eligibility checked",
      },
      {
        tache: "Coverage",
        titre: "Files the coverage request",
        texte:
          "Takes the quote from your software and sends it to the patient's insurer. You re-enter nothing. Follows the reply and gives you the balance to tell the patient.",
        ou: "From your software, on the insurer's portal",
        enCours: "Coverage request",
        fait: "Coverage received",
      },
      {
        tache: "Billing",
        titre: "Sends the invoice",
        texte:
          "When the prosthesis is fitted or treatment is done, sends the invoice to the national health insurance and the insurer, then follows every reply. For orthodontics, semester after semester.",
        ou: "From your software",
        enCours: "Sending the invoice",
        fait: "Invoice sent",
      },
      {
        tache: "Rejections and transfers",
        titre: "Handles rejections, matches transfers",
        texte:
          "Corrects and resubmits rejected files, matches each transfer to its invoice and follows up on unpaid insurer shares.",
        ou: "On your bank statements and in your software",
        enCours: "Matching transfers",
        fait: "Transfers matched",
      },
    ],
    outils:
      "In your practice software, on insurer portals: Viamédis, Almerys, Santéclair, Kalixia…",
    alt: "At a dental practice, an assistant talks to a patient, tablet in hand, next to the dentist.",
  },
  "centres-sante": {
    nom: "Health centers and ophthalmology",
    accroche:
      "Eligibility, invoices, rejections and transfers, done for you, without changing software.",
    promesse: ["Your teams welcome patients.", "Granit handles the rest."],
    preuve:
      "The doctor validates the visit, and the invoice is ready when the patient comes back to the front desk. Granit then follows every file: national health insurance rejections, paper claim forms, transfers from the national health insurance and insurers.",
    agents: [
      {
        tache: "Eligibility",
        titre: "Checks eligibility",
        texte:
          "Checks today's patients' coverage with the national health insurance, and with their insurer when you use third-party payment for its share, before their visit.",
        ou: "On amelipro and, if needed, on the insurer's portal",
        enCours: "Checking today's patients",
        fait: "Eligibility checked",
      },
      {
        tache: "Billing",
        titre: "Prepares the invoice",
        texte:
          "As soon as the doctor validates the visit, takes the procedures and their billing codes and prepares the invoice in your billing software. At the front desk, all that is left is to insert the Carte Vitale. You re-enter nothing.",
        ou: "From your medical software, in your billing software",
        enCours: "Preparing the invoice",
        fait: "Invoice ready",
      },
      {
        tache: "Rejections",
        titre: "Handles rejections",
        texte:
          "Reads the national health insurance and insurer remittances every day, finds the reason for each rejection, corrects the invoice and resubmits it. Also follows paper claim forms until they are paid.",
        ou: "In your payment remittances and on amelipro",
        enCours: "Handling rejections",
        fait: "Rejection corrected and resubmitted",
      },
      {
        tache: "Transfers",
        titre: "Matches transfers, follows up unpaid ones",
        texte:
          "Matches each transfer from the national health insurance and insurers to its invoices, and follows up on what is unpaid.",
        ou: "On your bank statements and in your billing software",
        enCours: "Matching transfers",
        fait: "Transfers matched",
      },
    ],
    outils: "In Desmos, Doctolib and your other software, on amelipro and insurer portals.",
    alt: "At a health center front desk, a receptionist welcomes a patient.",
  },
  pharmacie: {
    nom: "Pharmacies",
    accroche:
      "New prescriptions from the care homes you serve, collected and compared with the current treatment, without changing software.",
    promesse: ["Your pharmacists advise.", "Granit handles the rest."],
    preuve:
      "You validate and prepare the doses, as usual. Granit handles the rest: it collects new prescriptions from each care home's software and from your emails, compares them with the current treatment and flags what changed.",
    agents: [
      {
        tache: "Prescriptions",
        titre: "Collects new prescriptions",
        texte:
          "Goes into the care software of each care home you serve and collects every new prescription as soon as the doctor posts it. You no longer open one software per care home.",
        ou: "In NETSoins, TitanLink and other care home software",
        enCours: "Looking for new prescriptions",
        fait: "Prescriptions collected",
      },
      {
        tache: "Emails",
        titre: "Reads prescriptions sent by email",
        texte:
          "Some care homes send their prescriptions by email. It collects those too, alongside the others.",
        ou: "In your emails",
        enCours: "Reading emails",
        fait: "Emailed prescriptions collected",
      },
      {
        tache: "Comparison",
        titre: "Compares with the current treatment",
        texte:
          "Compares each new prescription with the resident's current treatment: a drug added, a drug stopped, a dosage changed.",
        ou: "Against the resident's current treatment",
        enCours: "Comparing prescriptions",
        fait: "Changes spotted",
      },
      {
        tache: "Dose preparation",
        titre: "Sends you the day's changes",
        texte:
          "Sends the pharmacy the list of changes, for dose preparation for care homes (PDA). The pharmacist always validates.",
        ou: "For your preparation team",
        enCours: "Sending the changes",
        fait: "Changes sent",
      },
    ],
    outils:
      "In the care software of the care homes you serve (NETSoins, TitanLink…) and in your emails, with no new software for you or for the care home.",
    alt: "A pharmacist reads a document in front of the pharmacy shelves.",
  },
  "cliniques-laboratoires": {
    nom: "Clinics and laboratories",
    accroche:
      "Patient files, coverage requests, rejections and transfer matching, done for you, without changing software.",
    promesse: ["Your teams care.", "Granit handles the rest."],
    preuve:
      "Your admissions office or front desk works in its software, as usual. Granit does the rest: complete files, coverage requests, rejections and transfer matching. Your billing staff keep their time for the files that need a phone call.",
    agents: [
      {
        tache: "Patient file",
        titre: "Completes the patient file",
        texte:
          "At the admissions office or the lab's front desk, takes the prescription, the Carte Vitale and the insurer card, checks the patient's eligibility and completes the file in your software. Your front desk checks and approves.",
        ou: "In your patient management or laboratory software",
        enCours: "Checking the file",
        fait: "File complete",
      },
      {
        tache: "Coverage",
        titre: "Files coverage requests",
        texte:
          "When the stay or the test requires it, files the coverage request with the insurer, follows the answer and stores it in the patient's file.",
        ou: "On insurer portals",
        enCours: "Coverage request",
        fait: "Coverage received",
      },
      {
        tache: "Billing and rejections",
        titre: "Checks before sending, handles rejections",
        texte:
          "Before the electronic claim (FSE) goes out, spots what is missing: prescription, prescriber, insurer. Afterwards, corrects and resubmits simple rejections. Special cases are flagged to you.",
        ou: "In your software, before sending to the national health insurance and insurers",
        enCours: "Handling rejections",
        fait: "Rejection resubmitted",
      },
      {
        tache: "Transfers",
        titre: "Matches transfers, follows up unpaid ones",
        texte:
          "When an insurer pays several files in one transfer, finds the breakdown, matches each payment to its invoice and follows up on unpaid ones.",
        ou: "On your bank statements, amelipro and insurer websites",
        enCours: "Matching transfers",
        fait: "Transfers matched",
      },
    ],
    outils:
      "In your patient management software (Hopital Manager…) or laboratory software (Hexalis, KaliSil…), on amelipro and insurer portals, with no new software.",
    alt: "A biologist pipettes a sample in the laboratory.",
  },
};

export const METIERS = { fr, en };
