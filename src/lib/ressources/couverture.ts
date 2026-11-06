// Couverture dessinée d'un article : une scène de la fenêtre Granit, remplie avec les mots de l'article.
// Le bloc `couverture` est écrit par le moteur SEO (scripts/seo-engine/lib/couverture.mjs) ; le site le
// dessine dans CouvertureDessinee.tsx. Sans bloc valide : une scène générique, jamais de photo.
import type { Lang } from "@/lib/i18n";
import type { CategorySlug, Fiche } from "./types";

export const SCENES = [
  "statuts",
  "frise",
  "ecart",
  "paliers",
  "controles",
  "options",
  "agenda",
  "boucles",
] as const;
export type Scene = (typeof SCENES)[number];

export type Etat = "fait" | "attente" | "alerte";

export type Couverture = {
  scene: Scene;
  /** Barre de la fenêtre, à gauche ; le logo le remplace si `marque` est renseignée. */
  titre: string;
  /** Barre de la fenêtre, à droite. */
  repere: string;
  elements: { label: string; etat: Etat }[];
  /** Frise : statut de la ligne sous la frise. */
  badge?: string | null;
  /** Slug d'un fichier content/plateformes : le sujet de l'article, si on a son logo. */
  marque?: string | null;
  /** Image de partage : la phrase, la fin prend l'accent. */
  accroche?: { debut: string; fin: string };
  /** Mêmes textes en anglais, dans le même ordre. */
  en?: { titre: string; repere: string; labels: string[]; badge?: string | null };
};

/** Le bloc tel que le site le reçoit : `marque` résolue en nom et logo par le plugin Vite. */
export type CouvertureFiche = Omit<Couverture, "marque"> & {
  marque?: { nom: string; logo: string };
};

/** Scène de repli : aucune donnée de l'article, donc rien qui puisse être faux. */
const GENERIQUE: CouvertureFiche = {
  scene: "frise",
  titre: "Dossier",
  repere: "Tiers payant",
  elements: [
    { label: "Droits", etat: "fait" },
    { label: "PEC", etat: "fait" },
    { label: "Facture", etat: "fait" },
    { label: "Paiement", etat: "attente" },
  ],
  en: {
    titre: "Claim",
    repere: "Third-party payment",
    labels: ["Rights", "Approval", "Invoice", "Payment"],
  },
};

export const couvertureDe = (f: Pick<Fiche, "couverture">) => f.couverture ?? GENERIQUE;

/** Textes de la langue de l'écran ; sans traduction, le français. */
export function couvertureLangue(c: CouvertureFiche, lang: Lang): CouvertureFiche {
  if (lang !== "en" || !c.en) return c;
  const { titre, repere, labels, badge } = c.en;
  return {
    ...c,
    titre,
    repere,
    badge: badge ?? c.badge,
    elements: c.elements.map((e, i) => ({ ...e, label: labels[i] ?? e.label })),
  };
}

/** Le fond dit le thème ; le coin des points varie avec l'article. */
export const FONDS: Partial<Record<CategorySlug, "blush" | "ciel" | "encre">> = {
  rejets: "blush",
  conformite: "blush",
  paiements: "ciel",
  "gerer-son-tiers-payant": "encre",
};

const COINS = [
  ["90%", "100%"],
  ["10%", "100%"],
  ["100%", "10%"],
  ["0%", "60%"],
] as const;

/** FNV-1a : même slug, même coin, au serveur comme au navigateur. */
export function coinDesPoints(slug: string) {
  let h = 2166136261;
  for (let i = 0; i < slug.length; i++) h = Math.imul(h ^ slug.charCodeAt(i), 16777619);
  return COINS[(h >>> 0) % COINS.length];
}

export const estFichePlateforme = (f: Pick<Fiche, "slug" | "category">) =>
  f.category === "plateformes" && f.slug.startsWith("portail-");

/** La fiche d'introduction aux portails : sa couverture montre tous les portails. */
export const estFicheTousPortails = (f: Pick<Fiche, "slug">) => f.slug === "portails-tiers-payant";
