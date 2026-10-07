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

export const ORDRE_VERTICALES = data.ordre as VerticaleSlug[];

export function verticale(slug: string): Verticale | undefined {
  const v = (data.verticales as Record<string, Omit<Verticale, "slug">>)[slug];
  return v ? { slug: slug as VerticaleSlug, ...v } : undefined;
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

/** Teinte de couverture d'un ancien article : sa catégorie s'il est rattaché, sinon celle de son métier. */
export function teinteAncien(slug: string): CategorySlug {
  const rattache = (anciensData.rattaches as Record<string, CategorySlug>)[slug];
  if (rattache) return rattache;
  const v = anciens[slug];
  return Array.isArray(v) && v[0] ? verticale(v[0])!.teinte : "glossaire";
}
