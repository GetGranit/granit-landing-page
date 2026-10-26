/**
 * Texte et réglages du webinar « 5 usages de l'IA en magasin » du 26 novembre,
 * partagés par les deux variantes de la page (/webinar/ia-magasin et
 * /webinar/ia-magasin-b) pour qu'elles disent et envoient exactement la même chose.
 */

/** Valeur `source` du lead dans B11 et Attio, la même pour les deux variantes. */
export const SOURCE = "webinar-ia-2026-11";
/** Début du webinar, heure de Paris (heure d'hiver). */
export const DEBUT = new Date("2026-11-26T13:15:00+01:00");

export const t = {
  badge: "Webinar gratuit · en ligne",
  titleLead: "5 usages concrets de\u00a0l'IA",
  titleAccent: "pour gagner du temps en magasin.",
  intro:
    "45 minutes d'exemples en direct, pas de théorie. Vous repartez avec des choses à refaire dès le lendemain.",
  constat:
    "Pointer un virement groupé, vérifier un dossier avant facturation, renvoyer à la mutuelle une pièce jointe déjà dans le dossier client… L'admin prend un temps fou en magasin. On vous montre, en direct, ce que l'IA peut en faire.",
  date: "Jeudi 26 novembre",
  heure: "13h15 – 14h",
  cta: "Je réserve ma place",
  replay: "Replay envoyé à tous les inscrits",

  host: "Animé par Paul Pietra",
  hostRole: "Granit",
  hostLine:
    "Je passe mes journées avec des opticiens. Je vous montre ce qui marche vraiment en magasin.",
  programme: "Au programme",

  whatEyebrow: "Ce que vous verrez",
  whatTitle: "Trois cas montrés pas à pas,",
  whatAccent: "deux gardés pour la fin.",
  cas: [
    {
      emoji: "⭐",
      titre: "Vos avis Google",
      texte:
        "Les analyser pour savoir ce que vos clients disent vraiment de l'accueil, des délais, des prix.",
    },
    {
      emoji: "✉️",
      titre: "Vos modèles de mails",
      texte:
        "Relance mutuelle, lunettes prêtes, devis non signé : écrits une fois, réutilisés tous les jours.",
    },
    {
      emoji: "📊",
      titre: "Vos impayés mutuelles",
      texte: "Un tableau de suivi construit à partir d'un simple export Excel de votre logiciel.",
    },
  ],
  surpriseTitre: "Les cas 4 et 5",
  surprise:
    "Ce que l'IA peut faire à votre place, sans même ouvrir Excel. On les garde pour la fin 😉",

  infos: [
    {
      emoji: "👓",
      titre: "Pour qui",
      texte: "Opticiens et équipes en magasin. Aucune connaissance technique nécessaire.",
    },
    {
      emoji: "💻",
      titre: "Où",
      texte:
        "Sur Google Meet, depuis un ordinateur ou un téléphone. Rien à installer, caméra pas nécessaire.",
    },
    {
      emoji: "🎬",
      titre: "Pas dispo ?",
      texte: "Inscrivez-vous quand même : le replay part à tous les inscrits le lendemain.",
    },
  ],

  derouleEyebrow: "Le déroulé",
  deroule: [
    { h: "13h15", t: "Où part le temps en magasin" },
    { h: "13h20", t: "Les 3 premiers cas, en direct" },
    { h: "13h45", t: "Les 2 derniers, la surprise" },
    { h: "13h55", t: "Vos questions" },
  ],

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
    "L'invitation avec le lien de connexion arrive dans votre boîte mail. À jeudi 26 novembre, 13h15.",
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
};
