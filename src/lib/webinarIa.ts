/**
 * Texte et réglages du webinar « 5 usages de l'IA en magasin » du 26 novembre,
 * séparés de la mise en page de /webinar/ia-magasin.
 */

/** Valeur `source` du lead dans B11 et Attio. */
export const SOURCE = "webinar-ia-2026-11";
/** Début du webinar, heure de Paris (heure d'hiver). */
export const DEBUT = new Date("2026-11-26T13:15:00+01:00");
/** Fin du webinar, heure de Paris. */
export const FIN = new Date("2026-11-26T14:00:00+01:00");
/** Lien de connexion Google Meet, mis dans le mail de confirmation et l'invitation agenda. */
export const MEET_URL = "https://meet.google.com/qph-ugvk-sro";
/** Accès par téléphone au même Meet, pour ceux qui n'ont pas d'ordinateur sous la main. */
export const MEET_TEL = "+33 1 87 40 12 67, code 271 624 200#";

/** Textes de la page, en français et en anglais (le bouton FR/EN du site). */
export const copy = {
  fr: {
    badge: "Webinar gratuit · en ligne",
    titleLead: "5 usages concrets de\u00a0l'IA",
    titleAccent: "pour gagner du temps en magasin.",
    constat:
      "Pointer un virement groupé, vérifier un dossier avant facturation, renvoyer à la mutuelle une pièce jointe déjà dans le dossier client… L'admin prend un temps fou en magasin. On vous montre, en direct, ce que l'IA peut en faire.",
    date: "Jeudi 26 novembre",
    heure: "13h15 – 14h",
    cta: "Je réserve ma place",
    replay: "Replay envoyé à tous les inscrits",
    format: "45 min · en ligne",
    hostTitle: "Votre animateur",
    learnTitle: "Vous apprendrez…",
    countdown: "Le webinar commence dans",
    formHeading: "On a hâte de vous voir ! 👋",
    units: { j: "jours", h: "heures", m: "min", s: "sec" },
    /** Entre le titre d'un cas et son texte (espace avant le deux-points en français). */
    colon: " : ",

    hostRole: "Granit",
    hostLine:
      "Je passe mes journées avec des opticiens. Je vous montre ce qui marche vraiment en magasin.",
    cas: [
      {
        titre: "Vos avis Google",
        texte:
          "Les analyser pour savoir ce que vos clients disent vraiment de l'accueil, des délais, des prix.",
      },
      {
        titre: "Vos modèles de mails",
        texte:
          "Relance mutuelle, lunettes prêtes, devis non signé : écrits une fois, réutilisés tous les jours.",
      },
      {
        titre: "Vos impayés mutuelles",
        texte: "Un tableau de suivi construit à partir d'un simple export Excel de votre logiciel.",
      },
    ],
    surprise:
      "Ce que l'IA peut faire à votre place, sans même ouvrir Excel. On les garde pour la fin",

    formTitle: "Réservez votre place",
    formIntro: "L'invitation avec le lien de connexion arrive par mail.",
    fields: {
      name: "Prénom et nom",
      email: "Adresse e-mail",
      phone: "Téléphone",
      company: "Nom du magasin",
      stores: "Nombre de magasins",
    },
    placeholders: {
      name: "Marie Dupont",
      email: "marie@centre-vision.fr",
      phone: "06 12 34 56 78",
      company: "Centre Vision",
    },
    phoneHint: "Un numéro à 10 chiffres, par exemple 06 12 34 56 78.",
    stores: ["1 magasin", "2 à 3 magasins", "4 à 15 magasins", "Plus de 15 magasins"],
    choose: "Choisir…",
    sending: "Envoi…",
    note: "Gratuit. Vos données restent chez nous, jamais revendues.",
    success: "C'est noté, votre place est réservée 🎉",
    successSub:
      "Vous allez recevoir un mail de confirmation avec le lien de connexion. Bloquez le créneau dès maintenant :",
    agendaTitre: "Webinar Granit : 5 usages concrets de l'IA en magasin",
    successContact: "Une question d'ici là ?",
    error: "Une erreur est survenue. Réessayez, ou écrivez-nous à contact@getgranit.ai.",

    faqTitle: "Questions fréquentes",
    faq: [
      { q: "C'est vraiment gratuit ?", a: "Oui. Pas de carte bancaire, pas d'engagement." },
      {
        q: "Je ne pourrai pas être là à 13h15.",
        a: "Inscrivez-vous quand même : tous les inscrits reçoivent le replay le lendemain.",
      },
      {
        q: "Je ne suis pas à l'aise avec l'informatique.",
        a: "C'est fait pour vous. Tout est montré pas à pas, avec des outils gratuits que vous avez sans doute déjà.",
      },
      {
        q: "Est-ce que vous allez me vendre quelque chose ?",
        a: "Le webinar porte sur des usages que vous pouvez refaire seul. On présente Granit en deux minutes à la fin, pour ceux que ça intéresse.",
      },
    ],
  },
  en: {
    badge: "Free webinar · online",
    titleLead: "5 practical uses of AI",
    titleAccent: "to save time in your store.",
    constat:
      "Reconciling a grouped bank transfer, checking a file before billing, sending the supplementary insurer (mutuelle) an attachment that is already in the customer file… Admin work takes a huge amount of time in the store. We show you, live, what AI can do with it.",
    date: "Thursday, November 26",
    heure: "1:15 – 2:00 p.m. (Paris time)",
    cta: "Save my spot",
    replay: "Replay sent to everyone who registers",
    format: "45 min · online",
    hostTitle: "Your host",
    learnTitle: "You will learn…",
    countdown: "The webinar starts in",
    formHeading: "We look forward to seeing you!",
    units: { j: "days", h: "hours", m: "min", s: "sec" },
    colon: ": ",

    hostRole: "Granit",
    hostLine:
      "I spend my days with opticians. I'll show you what really works in the store.",
    cas: [
      {
        titre: "Your Google reviews",
        texte:
          "Analyze them to find out what your customers really say about your welcome, wait times and prices.",
      },
      {
        titre: "Your email templates",
        texte:
          "Insurer follow-up, glasses ready, unsigned quote: written once, reused every day.",
      },
      {
        titre: "Your unpaid insurer claims",
        texte: "A tracking table built from a simple Excel export from your software.",
      },
    ],
    surprise:
      "What AI can do for you, without even opening Excel. We're saving those for the end.",

    formTitle: "Save your spot",
    formIntro: "The invitation with the login link arrives by email.",
    fields: {
      name: "First and last name",
      email: "Email address",
      phone: "Phone",
      company: "Store name",
      stores: "Number of stores",
    },
    placeholders: {
      name: "Marie Dupont",
      email: "marie@centre-vision.fr",
      phone: "06 12 34 56 78",
      company: "Centre Vision",
    },
    phoneHint: "A 10-digit number, for example 06 12 34 56 78.",
    stores: ["1 store", "2 to 3 stores", "4 to 15 stores", "More than 15 stores"],
    choose: "Choose…",
    sending: "Sending…",
    note: "Free. Your data stays with us and is never resold.",
    success: "Done, your spot is saved.",
    successSub:
      "You will receive a confirmation email with the login link. Block the time slot now:",
    agendaTitre: "Granit webinar: 5 practical uses of AI in the store",
    successContact: "A question in the meantime?",
    error: "Something went wrong. Please try again, or email us at contact@getgranit.ai.",

    faqTitle: "Frequently asked questions",
    faq: [
      { q: "Is it really free?", a: "Yes. No credit card, no commitment." },
      {
        q: "I can't make it at 1:15 p.m.",
        a: "Register anyway: everyone who registers receives the replay the next day.",
      },
      {
        q: "I'm not comfortable with computers.",
        a: "It's made for you. Everything is shown step by step, with free tools you probably already have.",
      },
      {
        q: "Are you going to sell me something?",
        a: "The webinar covers uses you can repeat on your own. We present Granit for two minutes at the end, for those who are interested.",
      },
    ],
  },
};

/** Texte français : celui du mail de confirmation et de l'invitation agenda, qui partent en français. */
export const t = copy.fr;
