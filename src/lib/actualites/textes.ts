// Libellés d'interface de la rubrique, en français et en anglais. Le contenu des éditions reste
// en français au lancement. Fonctions pures, testées par node --test : en « @/… », seulement des types.
import type { Lang } from "@/lib/i18n";
import type { VerticaleSlug } from "../ressources/types";
import type { Format } from "./types";

export const LIBELLES_FORMAT: Record<Lang, Record<Format, string>> = {
  fr: {
    "ce-qui-change": "Ce qui change",
    "le-reflexe": "Le réflexe",
    "le-controle": "Le contrôle",
    "le-releve": "Le relevé",
  },
  en: {
    "ce-qui-change": "What changes",
    "le-reflexe": "The reflex",
    "le-controle": "The check",
    "le-releve": "The readout",
  },
};

/** Libellés de la rubrique et des pages d'édition. */
export const LIBELLES = {
  fr: {
    rubrique: "Actualités",
    edition: "Édition",
    numero: "N°",
    votreMetier: "Votre métier",
    tous: "Tous",
    aucuneEdition: "Aucune édition pour ce métier pour le moment.",
    releve: "Le relevé",
    releveTitre: "Ce que nos agents voient passer",
    nouvellesGranit: "Les nouvelles de Granit",
    change: "Ce qui change",
    qui: "Qui est concerné",
    gestes: "Ce que vous faites",
    inconnu: "Ce qu’on ne sait pas encore",
    sources: "Sources",
    metier: "Métier",
    lecture: "Lecture",
    minutes: "min",
    relu: "Relu par",
    relecturePrevue: "Relecture à venir",
    autresEditions: "Autres éditions",
    signature: "Préparé par nos agents, vérifié par l’équipe Granit.",
    demo: "Demander une démo",
    retour: "Toutes les éditions",
    introuvable: "Cette édition n’existe pas.",
    brouillon: "Brouillon, non publié",
    recevoir: "Recevoir",
    accroche: "Ce qui change, et ce que vous faites.",
    courriel: "Votre e-mail professionnel",
    abonner: "Je m’abonne",
    abonnementOk: "C’est noté, merci.",
    abonnementErreur: "L’envoi a échoué. Réessayez dans un instant.",
    consentement:
      "En vous abonnant, vous acceptez que Granit utilise votre adresse pour vous envoyer cette newsletter par e-mail. Vous pouvez vous désabonner à tout moment.",
    confidentialite: "Confidentialité",
    garanties: "Infrastructure certifiée HDS · Données dans l’UE · RGPD",
  },
  en: {
    rubrique: "News",
    edition: "Issue",
    numero: "No.",
    votreMetier: "Your profession",
    tous: "All",
    aucuneEdition: "No issue for this profession yet.",
    releve: "The readout",
    releveTitre: "What our agents see",
    nouvellesGranit: "Granit news",
    change: "What changes",
    qui: "Who is affected",
    gestes: "What you do",
    inconnu: "What we don't know yet",
    sources: "Sources",
    metier: "Profession",
    lecture: "Reading time",
    minutes: "min",
    relu: "Reviewed by",
    relecturePrevue: "Review pending",
    autresEditions: "Other issues",
    signature: "Prepared by our agents, checked by the Granit team.",
    demo: "Book a demo",
    retour: "All issues",
    introuvable: "This issue does not exist.",
    brouillon: "Draft, not published",
    recevoir: "Get",
    accroche: "What changes, and what you do.",
    courriel: "Your work email",
    abonner: "Subscribe",
    abonnementOk: "Thank you, you are on the list.",
    abonnementErreur: "Sending failed. Please try again shortly.",
    consentement:
      "By subscribing, you agree that Granit may use your address to send you this newsletter by email. You can unsubscribe at any time.",
    confidentialite: "Privacy",
    garanties: "HDS-certified infrastructure · Data in the EU · GDPR",
  },
} as const;

/** Description de la rubrique pour les moteurs de recherche, 120 à 160 caractères. */
export const DESCRIPTION_RUBRIQUE =
  "Ce qui change pour vos équipes, hors du soin : règles, contrôles et réflexes de l’administratif santé, avec les sources et ce qu’il faut faire.";

/** Fin d'édition : déclinaisons de TON.md. La seconde moitié ne change jamais. */
const FIN_PAR_METIER: Record<Lang, Partial<Record<VerticaleSlug, string>>> = {
  fr: {
    optique: "Vos opticiens conseillent.",
    cliniques: "Vos soignants soignent.",
    centres: "Vos équipes accueillent.",
  },
  en: {
    optique: "Your opticians advise.",
  },
};

const FIN_PAR_DEFAUT: Record<Lang, string> = {
  fr: "Vos équipes soignent.",
  en: "Your teams care.",
};

export const SUITE_FIN: Record<Lang, string> = {
  fr: "Granit gère le reste.",
  en: "Granit handles the rest.",
};

/** Première moitié de la promesse, selon le premier métier de l'édition. */
export function finDe(metiers: readonly VerticaleSlug[], lang: Lang = "fr"): string {
  return FIN_PAR_METIER[lang][metiers[0]] ?? FIN_PAR_DEFAUT[lang];
}

const LOCALE: Record<Lang, string> = { fr: "fr-FR", en: "en-GB" };

/** « 5 novembre 2026 », en UTC : même rendu au serveur et au client. */
export function dateLongue(iso: string, lang: Lang = "fr"): string {
  return new Intl.DateTimeFormat(LOCALE[lang], {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${iso}T00:00:00Z`));
}

/** « Novembre 2026 », pour le folio de la manchette. */
export function moisAnnee(iso: string, lang: Lang = "fr"): string {
  const texte = new Intl.DateTimeFormat(LOCALE[lang], {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${iso}T00:00:00Z`));
  return texte.charAt(0).toUpperCase() + texte.slice(1);
}
