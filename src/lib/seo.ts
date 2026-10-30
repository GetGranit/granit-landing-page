export const SITE_URL = "https://www.getgranit.ai";

/** Sitewide Organization structured data (rich results / knowledge panel). */
export const organizationLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${SITE_URL}/#organization`,
  name: "Granit",
  alternateName: "getgranit",
  url: SITE_URL,
  logo: `${SITE_URL}/favicon.svg`,
  description:
    "Granit déploie des agents IA qui automatisent le back-office administratif des établissements de santé — tiers-payant, facturation, traitement des rejets, recouvrement.",
  email: "contact@getgranit.ai",
  areaServed: "FR",
  sameAs: ["https://www.linkedin.com/company/getgranit-ai/"],
};

/** Référence à l'Organization du site, pour les autres blocs JSON-LD (provider, publisher). */
export const organizationRef = { "@id": `${SITE_URL}/#organization` };

/** FAQPage : mêmes questions et réponses que la FAQ visible de la page. */
export function faqPageLd(items: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}

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
