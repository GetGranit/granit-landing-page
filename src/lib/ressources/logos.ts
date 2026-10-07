// Logos des plateformes tels que le site les affiche. Le fichier de faits donne `logo` ;
// on l'adapte ici à l'usage, sans toucher aux fichiers du moteur.

/**
 * Logos trop petits pour être affichés proprement : on montre l'initiale à la place.
 * isante.png fait 32 px et itelis.png 53 px (fichiers absents de public/logos).
 */
const TROP_PETITS = new Set(["/logos/isante.png", "/logos/itelis.png"]);

/**
 * Sur l'écran du portable, le logotype large se lit mieux que le symbole carré.
 * Le symbole reste pour les tuiles et l'en-tête (et pour l'accueil du site, qui l'utilise).
 */
const LOGOTYPES: Record<string, string> = {
  "/logos/viamedis.png": "/logos/viamedis-logotype.png",
};

export function logoPlateforme(
  logo: string | undefined,
  usage: "ecran" | "carre",
): string | undefined {
  if (!logo || TROP_PETITS.has(logo)) return undefined;
  return usage === "ecran" ? (LOGOTYPES[logo] ?? logo) : logo;
}
