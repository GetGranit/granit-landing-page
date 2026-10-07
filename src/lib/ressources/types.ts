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
  author: { name: string; jobTitle?: string; photo?: string };
  reviewer: string | null;
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
  internalLinks: LienInterne[];
  liensEntrants: LienInterne[];
  /** Vague de la file (ajoutée à la lecture, sert au tri). */
  wave?: number;
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
  plateforme?: { nom: string; logo?: string; checkedOn: string };
};
