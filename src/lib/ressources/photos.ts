// Photos des cartes et des en-têtes : un seul langage visuel, celui des métiers.
// - article du cocon : photo de son thème, variante a ou b tirée du slug (alterne dans une rangée) ;
// - fiche plateforme (portail-*) : fond « plateformes », le logo est posé en HTML par-dessus ;
// - ancien article hors cocon : photo de son métier ; transversal non rattaché : thème « gérer ».
import type { CategorySlug, Fiche } from "./types";
import { verticale } from "./verticales";

export type Photo = {
  /** Chemin sans la largeur ni l'extension : `${base}-800.jpg`, `${base}-1600.jpg`. */
  base: string;
  /** Texte alternatif ; vide quand la photo n'est qu'un décor de carte (le titre suit). */
  alt: string;
};

/** FNV-1a, comme l'ancienne graine des couvertures : même slug, même variante. */
function hash(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return h >>> 0;
}

const variante = (slug: string) => (hash(slug) % 2 === 0 ? "a" : "b");

export const estFichePlateforme = (f: Pick<Fiche, "slug" | "category">) =>
  f.category === "plateformes" && f.slug.startsWith("portail-");

export function photoTheme(category: CategorySlug, slug: string): Photo {
  return { base: `/ressources/themes/${category}-${variante(slug)}`, alt: "" };
}

export function photoFiche(f: Fiche): Photo {
  if (estFichePlateforme(f))
    return { base: `/ressources/themes/plateformes-${variante(f.slug)}`, alt: "" };
  if (f.ancien && !f.rattache) {
    // Hors cocon : la photo du métier ; un transversal prend le thème « gérer son tiers payant ».
    if (f.transversal || !f.verticales[0]) return photoTheme("gerer-son-tiers-payant", f.slug);
    return { base: `/ressources/metiers/${verticale(f.verticales[0])!.slug}`, alt: "" };
  }
  return photoTheme(f.category, f.slug);
}

export const src = (p: Photo, largeur: 800 | 1600) => `${p.base}-${largeur}.jpg`;
export const srcSet = (p: Photo) => `${src(p, 800)} 800w, ${src(p, 1600)} 1600w`;
