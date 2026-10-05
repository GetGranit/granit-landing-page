/**
 * Old static blog (legacy/blog, legacy/en/blog): file name -> /ressources slug
 * covering the same topic. Pages without an equivalent go to /ressources.
 */
const legacyArticles: Record<string, { fr: string; en: string }> = {
  "conformite-facturation-ehpad": {
    fr: "facturation-ehpad-controle-humain",
    en: "care-home-billing-automation",
  },
  "interconnexion-lgo-cpam": { fr: "reduire-rejets-cpam", en: "reduce-public-payer-rejections" },
  "ordonnancier-numerique-pharmacie": { fr: "trois-boucles-pharmacie", en: "pharmacy-three-loops" },
};

/** Slug to redirect an old /blog (or /en/blog) path to, if any. */
export function legacyBlogSlug(lang: "fr" | "en", splat: string | undefined): string | undefined {
  const name = (splat ?? "").replace(/\/+$/, "").replace(/\.html$/, "");
  return legacyArticles[name]?.[lang];
}
