// Les métiers (verticales) des Ressources : première porte du hub, pages /ressources/metier/{v}.
// Les URL d'articles ne changent pas ; un article peut concerner plusieurs métiers.
// Pas d'import « @/… » ici : le plugin Vite lit aussi ce fichier.
import anciensData from "./anciens.json";
import data from "./verticales.json";
import type { CategorySlug, VerticaleSlug } from "./types";

export type Verticale = {
  slug: VerticaleSlug;
  nom: string;
  court: string;
  description: string;
  /** Texte alternatif de la photo (ce qu'on y voit). */
  alt: string;
  /** Catégorie dont on reprend les couleurs. */
  teinte: CategorySlug;
  /** Titre de la bande démo : seulement une capacité réelle de Granit pour ce métier. */
  agent: string;
};

/**
 * Textes alternatifs des photos (public/ressources/metiers/{métier}-800.jpg et -1600.jpg) :
 * ce qu'on voit sur l'image. À mettre à jour ici quand une photo change.
 */
const ALTS: Record<VerticaleSlug, string> = {
  optique:
    "Lunettes en écaille posées sur un linge blanc, leur ombre projetée sur un mur terracotta",
  audio:
    "Deux appareils auditifs contour d'oreille posés sur un linge, à côté de leur boîtier de charge ouvert",
  pharmacie:
    "Pilulier, plaquette de comprimés et sachet blanc sur un comptoir de pharmacie, croix verte allumée au fond",
  dentaire:
    "Moulage de mâchoire dentaire sur un plateau blanc, avec un miroir et une sonde de dentiste",
  centres:
    "Stéthoscope posé sur un bureau de consultation en bois, à côté d'un agenda de rendez-vous",
  cliniques:
    "Lit de clinique au soleil, couverture grise pliée, pied à perfusion et dossier médical sur pince",
  ehpad:
    "Fauteuil vert près d'une fenêtre, plaid en laine, canne en bois, tasse de thé, lunettes et pilulier sur une petite table",
  laboratoires:
    "Paillasse de laboratoire avec un portoir de tubes de prélèvement à bouchons colorés, des gants et une centrifugeuse",
};

/** Le métier principal : sa page est toujours indexée, quel que soit le nombre d'articles. */
export const VERTICALE_PRINCIPALE: VerticaleSlug = "optique";

export const ORDRE_VERTICALES = data.ordre as VerticaleSlug[];

export function verticale(slug: string): Verticale | undefined {
  const v = (data.verticales as Record<string, Omit<Verticale, "slug" | "alt">>)[slug];
  return v ? { slug: slug as VerticaleSlug, ...v, alt: ALTS[slug as VerticaleSlug] } : undefined;
}

export const VERTICALES: Verticale[] = ORDRE_VERTICALES.map((v) => verticale(v)!);

/** Photo du métier : 800 ou 1600 px de large, 16:9. */
export const photoVerticale = (v: VerticaleSlug, largeur: 800 | 1600) =>
  `/ressources/metiers/${v}-${largeur}.jpg`;

const anciens = data.anciens as Record<string, VerticaleSlug[] | "tous">;

/** Métiers d'un ancien article ; `transversal` s'il vaut pour tous. */
export function verticalesAncien(slug: string): {
  verticales: VerticaleSlug[];
  transversal: boolean;
} {
  const v = anciens[slug];
  if (v === "tous") return { verticales: [...ORDRE_VERTICALES], transversal: true };
  return { verticales: v ?? [], transversal: false };
}

/** Teinte de la carte d'un ancien article (étiquette, fond d'attente) : sa catégorie s'il est rattaché, sinon celle de son métier. */
export function teinteAncien(slug: string): CategorySlug {
  const rattache = (anciensData.rattaches as Record<string, CategorySlug>)[slug];
  if (rattache) return rattache;
  const v = anciens[slug];
  return Array.isArray(v) && v[0] ? verticale(v[0])!.teinte : "glossaire";
}
