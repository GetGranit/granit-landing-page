export const HUB: {
  titre: string;
  description: string;
  titreH1: string;
  accent: string;
  chapeau: string;
};
export const RECHERCHE: {
  libelle: string;
  placeholder: string;
  aide: string;
  unite: [string, string];
};
export const FAIT_FOI: string;
export const TEXTE_PONT: string;
export const OUTILS_LIES: Record<string, string>;
export const ETAT_VIDE: Record<"fabricant" | "inconnu" | "ccam" | "cip" | "texte" | "page", string>;
export function formeRequete(q: string): "fabricant" | "inconnu" | "ccam" | "cip" | "texte";
export function requeteDuSlug(slug: string): string;
export function lireRequeteUrl(v: unknown): string | number | undefined;
