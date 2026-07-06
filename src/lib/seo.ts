export const SITE_URL = "https://www.getgranit.ai";

/** Sitewide Organization structured data (rich results / knowledge panel). */
export const organizationLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Granit",
  legalName: "Granit AI",
  url: SITE_URL,
  logo: `${SITE_URL}/favicon.svg`,
  description:
    "Granit déploie des agents IA qui automatisent le back-office administratif des établissements de santé — tiers-payant, facturation, traitement des rejets, recouvrement.",
  email: "contact@getgranit.ai",
  areaServed: "FR",
};

/** Absolute canonical URL for a given pathname (trailing slash stripped). */
export function canonicalFor(pathname: string): string {
  const clean = pathname.replace(/\/+$/, "");
  return SITE_URL + (clean || "/");
}

/** Article + BreadcrumbList structured data for a resource page. */
export function articleLd(opts: { title: string; description: string; slug: string; image?: string }) {
  const url = `${SITE_URL}/ressources/${opts.slug}`;
  const article = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: opts.title,
    description: opts.description,
    inLanguage: "fr-FR",
    image: opts.image ? [opts.image] : undefined,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    author: { "@type": "Organization", name: "Granit" },
    publisher: {
      "@type": "Organization",
      name: "Granit",
      logo: { "@type": "ImageObject", url: `${SITE_URL}/favicon.svg` },
    },
  };
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Accueil", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Ressources", item: `${SITE_URL}/ressources` },
      { "@type": "ListItem", position: 3, name: opts.title, item: url },
    ],
  };
  return { article, breadcrumb };
}
