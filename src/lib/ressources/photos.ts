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

/**
 * Variante a/b : dans une liste, elle alterne avec la position (deux cartes voisines n'ont
 * jamais la même photo) ; hors liste (en-tête d'article, og:image), elle est tirée du slug.
 */
const variante = (slug: string, rang?: number) => ((rang ?? hash(slug)) % 2 === 0 ? "a" : "b");

export const estFichePlateforme = (f: Pick<Fiche, "slug" | "category">) =>
  f.category === "plateformes" && f.slug.startsWith("portail-");

/**
 * Fiche de la catégorie plateformes sans plateforme propre (l'introduction aux portails) : sa
 * couverture est la fenêtre « tous portails ». Un ancien article non rattaché n'a qu'une teinte.
 */
export const estFicheTousPortails = (f: Fiche) =>
  f.category === "plateformes" && !estFichePlateforme(f) && (!f.ancien || Boolean(f.rattache));

/** Couverture dessinée en CSS (FenetrePlateforme) : pas de photo à précharger. */
export const aCouvertureFenetre = (f: Fiche) => estFichePlateforme(f) || estFicheTousPortails(f);

export function photoTheme(category: CategorySlug, slug: string, rang?: number): Photo {
  return { base: `/ressources/themes/${category}-${variante(slug, rang)}`, alt: "" };
}

/** Photo d'une fiche ; `rang` = position dans la liste affichée, s'il y en a une. */
export function photoFiche(f: Fiche, rang?: number): Photo {
  // Fiche plateforme : la photo ne sert plus qu'à og:image, la carte dessine sa fenêtre en CSS.
  if (estFichePlateforme(f))
    return { base: `/ressources/themes/plateformes-${variante(f.slug, rang)}`, alt: "" };
  if (f.ancien && !f.rattache) {
    // Hors cocon : la photo du métier ; un transversal prend le thème « gérer son tiers payant ».
    if (f.transversal || !f.verticales[0])
      return photoTheme("gerer-son-tiers-payant", f.slug, rang);
    return { base: `/ressources/metiers/${verticale(f.verticales[0])!.slug}`, alt: "" };
  }
  return photoTheme(f.category, f.slug, rang);
}

export const src = (p: Photo, largeur: 800 | 1600) => `${p.base}-${largeur}.jpg`;
export const srcSet = (p: Photo) => `${src(p, 800)} 800w, ${src(p, 1600)} 1600w`;
