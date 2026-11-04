/**
 * Old static blog (legacy/blog, legacy/en/blog): file name -> /ressources slug
 * covering the same topic. Pages without an equivalent go to /ressources.
 * English and French readers land on the same page: it switches language with the FR/EN toggle.
 */
const legacyArticles: Record<string, string> = {
  "conformite-facturation-ehpad": "facturation-ehpad-controle-humain",
  "interconnexion-lgo-cpam": "reduire-rejets-cpam",
  "ordonnancier-numerique-pharmacie": "trois-boucles-pharmacie",
};

/** Slug to redirect an old /blog (or /en/blog) path to, if any. */
export function legacyBlogSlug(_lang: "fr" | "en", splat: string | undefined): string | undefined {
  const name = (splat ?? "").replace(/\/+$/, "").replace(/\.html$/, "");
  return legacyArticles[name];
}

/**
 * Old English article slugs (articles.en in src/lib/articles.ts, once served at /ressources/{slug})
 * -> the French slug of the same article. Each article now has one URL for both languages.
 */
const anciensSlugsEn: Record<string, string> = {
  "pharmacy-aged-third-party-receivables": "officine-balance-agee-tiers-payant",
  "orthodontics-long-treatment-billing": "orthodontie-facturation-traitements-longs",
  "dental-zero-cost-basket-billing": "dentaire-paniers-100-sante-tiers-payant",
  "reduce-public-payer-rejections": "reduire-rejets-cpam",
  "insurer-portals-bottleneck": "portails-mutuelles-goulot",
  "care-home-billing-automation": "facturation-ehpad-controle-humain",
  "noemie-bank-reconciliation": "rapprochement-noemie",
  "pharmacy-three-loops": "trois-boucles-pharmacie",
  "healthcare-agent-logging": "logs-agent-sante",
  "generative-ai-healthcare-framework": "ia-generative-sante-cadre",
  "back-office-kpis-healthcare": "kpi-back-office-sante",
  "patient-collection-empathy": "recouvrement-patient-empathie",
  "integrate-doctolib-48h": "integration-doctolib-lgo",
  "optical-amc-control": "optique-tiers-payant-amc",
  "private-hospital-orchestration": "hopital-prive-ordonnancement",
  "sesam-vitale-2025": "sesam-vitale-evolutions-2025",
  "agentic-ai-vs-rpa": "ia-vs-rpa-sante",
  "multi-site-groups-console": "groupes-multi-sites-pilotage",
  "hearing-aid-renewal-billing": "audioprothese-renouvellement-tiers-payant",
};

/** French slug of an old English article slug, if it is one. */
export function slugFrDeAncienEn(slug: string): string | undefined {
  return anciensSlugsEn[slug];
}
