import type { Figure } from "./figures";

// Contrat du fichier content/ressources/{slug}.json écrit par le moteur SEO
// (scripts/seo-engine/README.md, « Contrat du fichier article »).

export type CategorySlug =
  | "guide-tiers-payant"
  | "plateformes"
  | "rejets"
  | "paiements"
  | "gerer-son-tiers-payant"
  | "conformite"
  | "glossaire";

export type VerticaleSlug =
  | "optique"
  | "dentaire"
  | "cliniques"
  | "ehpad"
  | "centres"
  | "laboratoires"
  | "audio"
  | "pharmacie";

/** Auteur ou relecteur (config.json du moteur) ; `url` = profil LinkedIn, peut être null. */
export type Personne = { name: string; jobTitle?: string; photo?: string; url?: string | null };

export type LienInterne = { id?: string; slug: string; anchor: string; type: string };

export type RessourceJson = {
  slug: string;
  id: string;
  category: CategorySlug;
  categoryName: string;
  type: "standard" | "resolution" | "plateforme";
  plateforme: string | null;
  title: string;
  primaryKeyword: string;
  keywordCluster: string[];
  parentSlug: string | null;
  level: string;
  author: Personne;
  /** Renseigné seulement après une vraie relecture humaine (PR) ; sinon null. */
  reviewer: Personne | null;
  datePublished: string;
  dateModified: string;
  checkedOn: string | null;
  wordCount: number;
  readTime: number;
  metaDescription: string;
  contentHtml: string;
  tocItems: { id: string; label: string }[];
  faqItems: { question: string; answer: string }[];
  sources: { label: string; url: string }[];
  /** Schémas, placés dans contentHtml par <div data-figure="{id}"></div>. */
  figures?: Figure[];
  internalLinks: LienInterne[];
  liensEntrants: LienInterne[];
  /** Anciens articles (articles.ts) que celui-ci remplace : ils redirigent vers lui (301). */
  remplace?: string[];
  /** Réécriture d'un ancien article de articles.ts, à la même adresse : remplace l'ancien. */
  refonte?: boolean;
  /** Vague de la file (ajoutée à la lecture, sert au tri). */
  wave?: number;
  /** Métiers concernés (facultatif ; par défaut l'optique). */
  verticales?: VerticaleSlug[];
  /** Fichier de content/apercu, jamais en production. */
  preview?: boolean;
};

/** Fichier de faits content/plateformes/{nom}.json. */
export type Plateforme = {
  slug: string;
  nom: string;
  logo?: string;
  checkedOn: string;
  identite: { label: string; valeur: string; source: string }[];
  chiffres: { valeur: string; label: string; source: string }[];
  statuts: { libelle: string; sens: string; action: string }[];
  statutsSource?: string;
  contacts: { label: string; valeur: string; detail?: string; url?: string; source: string }[];
  organismes?: { source: string; note?: string; liste: string[] };
  sources: Record<string, { label: string; url: string; consulte?: string }>;
};

/** Ce que le hub et les pages catégorie savent d'un article, sans son corps. */
export type Fiche = {
  slug: string;
  category: CategorySlug;
  title: string;
  /** Minutes (article JSON) ou texte déjà formaté (« 9 min », ancien article). */
  readTime: number | string;
  author?: string;
  /** dateModified, ou checkedOn pour une fiche plateforme. */
  date?: string;
  metaDescription?: string;
  pillar: boolean;
  wave: number;
  ancien: boolean;
  preview: boolean;
  /** Image d'aperçu dessinée (public/ressources/og/{slug}.jpg), si elle existe. */
  og?: string;
  plateforme?: {
    nom: string;
    logo?: string;
    checkedOn: string;
    /** Accord et attente, dans les mots du portail (couverture des cartes). */
    statuts: { accord: string; attente: string };
  };
  /** Métiers de l'article ; tous les métiers si `transversal`. */
  verticales: VerticaleSlug[];
  transversal: boolean;
  /** Étiquette de la carte quand elle n'est pas le nom court de la catégorie (anciens articles). */
  etiquette?: string;
  /** Ancien article rattaché à une catégorie du cocon (les autres n'ont qu'une teinte). */
  rattache?: boolean;
};
