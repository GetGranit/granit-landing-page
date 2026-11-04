// Le contenu propre à chaque page métier publiée (/agents/<slug>), en plus de metiers.ts.
// Seule l'optique est écrite : un métier s'ajoute ici quand ses textes et sa photo sont prêts.
// Garanties : seulement les affirmations de TON.md permises pour ce métier.

import type { SlugMetier } from "./metiers";

export type PageMetier = {
  titreSeo: string;
  descriptionSeo: string;
  /** Pastilles du hero, dans l'ordre. */
  etapesHero: { enCours: string; fait: string; detail: string }[];
  garanties: { titre: string; texte: string }[];
  dossierTitre: [string, string];
  dossier: { etape: string; texte: string }[];
  logiciels: string[];
  plateformes: string[];
  plateformesNote: string;
  /** Témoignage d'un client du métier, avec son accord écrit (TON.md). Sans lui, le bloc disparaît. */
  temoignage?: { citation: string; auteur: string; role: string };
  faq: { question: string; answer: string; rdv?: string }[];
  /** Slug de /ressources/metier/<slug>. */
  ressources: string;
};

const optiqueFr: PageMetier = {
  titreSeo: "Agents Granit pour opticiens et audioprothésistes : prise en charge, facturation, virements",
  descriptionSeo:
    "La prise en charge revient en moins de 2 minutes, pendant que le client est encore en boutique. Les agents Granit vérifient les droits, saisissent la PEC, facturent et pointent les virements, dans Cosium ou Optimum.",
  etapesHero: [
    { enCours: "Vérification des droits", fait: "Droits vérifiés", detail: "Sur la plateforme de la mutuelle" },
    { enCours: "Saisie de la prise en charge", fait: "Prise en charge accordée", detail: "Pendant que le client est en boutique" },
    { enCours: "Télétransmission", fait: "Facture télétransmise", detail: "Assurance Maladie et mutuelle" },
    { enCours: "Pointage du virement", fait: "Virement pointé", detail: "Rapproché de sa facture" },
  ],
  garanties: [
    { titre: "Prise en charge en moins de 2 minutes", texte: "Elle revient pendant que le client est encore en boutique." },
    { titre: "7 jours sur 7", texte: "Les dossiers avancent, même quand quelqu'un s'absente." },
    { titre: "Hébergeur certifié HDS", texte: "Les données de santé restent dans l'Union européenne. Conforme RGPD." },
    { titre: "Toutes les plateformes de tiers payant", texte: "Les agents travaillent sur les portails que vous utilisez déjà." },
  ],
  dossierTitre: ["Un dossier, du devis", "au virement de la mutuelle."],
  dossier: [
    { etape: "Devis", texte: "Vous faites le devis dans votre logiciel, comme d'habitude. Rien ne change au comptoir." },
    { etape: "Droits", texte: "L'agent vérifie les droits du client sur la plateforme de sa mutuelle." },
    { etape: "Prise en charge", texte: "Il saisit la demande de prise en charge (PEC) sur le portail. Elle revient en moins de 2 minutes, pendant que le client est encore en boutique." },
    { etape: "Livraison", texte: "À la livraison, il facture et télétransmet à l'Assurance Maladie et à la mutuelle." },
    { etape: "Virement", texte: "Il pointe le virement de la mutuelle, le rapproche de la facture et relance si le paiement tarde. Un rejet est corrigé et renvoyé." },
  ],
  logiciels: ["Cosium", "Optimum"],
  plateformes: ["Almerys", "Viamédis", "Santéclair", "Kalixia", "Carte Blanche"],
  plateformesNote: "Granit travaille avec toutes les plateformes de tiers payant. Les agents travaillent dans les logiciels que vos équipes utilisent déjà, sans API à demander.",
  faq: [
    { question: "Faut-il changer de logiciel ?", answer: "Non. Les agents travaillent dans votre logiciel (Cosium, Optimum…) et sur les portails des mutuelles, comme le ferait une personne de l'équipe. Granit est branché sur vos portails en 48 h." },
    { question: "Quelles plateformes de tiers payant sont couvertes ?", answer: "Granit travaille avec toutes les plateformes de tiers payant, par exemple Almerys, Viamédis, Santéclair, Kalixia ou Carte Blanche." },
    { question: "Que se passe-t-il quand un dossier est rejeté ?", answer: "L'agent repère le rejet, corrige le dossier et le renvoie. Les cas particuliers sont suivis par un gestionnaire Granit, qui prévient l'équipe." },
    { question: "Et pour les audioprothésistes ?", answer: "Ce sont les mêmes agents, pour les appareils auditifs : droits, prise en charge, facturation, pointage des virements." },
    { question: "Combien coûte Granit ?", answer: "Granit se facture à l'usage.", rdv: "Prendre rendez-vous" },
  ],
  ressources: "optique",
};

const optiqueEn: PageMetier = {
  titreSeo: "Granit agents for opticians and hearing care: coverage, billing, transfers",
  descriptionSeo:
    "The coverage approval comes back in under 2 minutes, while the customer is still in the store. Granit agents check eligibility, file coverage, bill and match transfers, in Cosium or Optimum.",
  etapesHero: [
    { enCours: "Checking eligibility", fait: "Eligibility checked", detail: "On the insurer's platform" },
    { enCours: "Filing the coverage request", fait: "Coverage approved", detail: "While the customer is in the store" },
    { enCours: "Transmitting", fait: "Invoice transmitted", detail: "National health insurance and insurer" },
    { enCours: "Matching the transfer", fait: "Transfer matched", detail: "Matched to its invoice" },
  ],
  garanties: [
    { titre: "Coverage approval in under 2 minutes", texte: "It comes back while the customer is still in the store." },
    { titre: "7 days a week", texte: "Files move forward, even when someone is away." },
    { titre: "HDS-certified host", texte: "Health data stays in the European Union. GDPR compliant." },
    { titre: "Every third-party payment platform", texte: "Agents work on the portals you already use." },
  ],
  dossierTitre: ["One file, from the quote", "to the insurer's transfer."],
  dossier: [
    { etape: "Quote", texte: "You make the quote in your software, as usual. Nothing changes at the counter." },
    { etape: "Eligibility", texte: "The agent checks the customer's eligibility on their insurer's platform." },
    { etape: "Coverage", texte: "It files the coverage request on the portal. It comes back in under 2 minutes, while the customer is still in the store." },
    { etape: "Delivery", texte: "On delivery, it bills and transmits to the national health insurance and the insurer." },
    { etape: "Transfer", texte: "It matches the insurer's transfer to the invoice and follows up if payment is late. A rejection is corrected and resubmitted." },
  ],
  logiciels: ["Cosium", "Optimum"],
  plateformes: ["Almerys", "Viamédis", "Santéclair", "Kalixia", "Carte Blanche"],
  plateformesNote: "Granit works with every third-party payment platform. Agents work in the software your teams already use, with no API to request.",
  faq: [
    { question: "Do we need to change software?", answer: "No. Agents work in your software (Cosium, Optimum…) and on insurer portals, as a team member would. Granit is connected to your portals in 48 h." },
    { question: "Which third-party payment platforms are covered?", answer: "Granit works with every third-party payment platform, for example Almerys, Viamédis, Santéclair, Kalixia or Carte Blanche." },
    { question: "What happens when a file is rejected?", answer: "The agent spots the rejection, corrects the file and resubmits it. Special cases are followed by a Granit case manager, who alerts the team." },
    { question: "What about hearing care?", answer: "The same agents, for hearing aids: eligibility, coverage, billing, transfer matching." },
    { question: "How much does Granit cost?", answer: "Granit is usage-based.", rdv: "Book a meeting" },
  ],
  ressources: "optique",
};

export const PAGES: Partial<Record<SlugMetier, { fr: PageMetier; en: PageMetier }>> = {
  optique: { fr: optiqueFr, en: optiqueEn },
};
