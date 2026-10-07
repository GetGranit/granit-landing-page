// Données structurées des pages Ressources (gabarit §4).
import { SITE_URL } from "@/lib/seo";
import type { Personne, Plateforme, RessourceJson } from "./types";

/** BreadcrumbList à partir de [nom, chemin] ; Accueil est ajouté en tête. */
export function breadcrumbLd(items: [string, string][]) {
  const tous: [string, string][] = [["Accueil", "/"], ...items];
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: tous.map(([name, path], i) => ({
      "@type": "ListItem",
      position: i + 1,
      name,
      item: SITE_URL + (path === "/" ? "" : path),
    })),
  };
}

const personneLd = (p: Personne) => ({
  "@type": "Person",
  name: p.name,
  jobTitle: p.jobTitle || undefined,
  image: p.photo ? SITE_URL + p.photo : undefined,
  url: p.url || undefined,
  sameAs: p.url ? [p.url] : undefined,
});

export function blogPostingLd(a: RessourceJson, p: Plateforme | null) {
  const url = `${SITE_URL}/ressources/${a.slug}`;
  const site = p ? Object.values(p.sources).find((s) => s.url)?.url : undefined;
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: a.title,
    description: a.metaDescription,
    inLanguage: "fr-FR",
    datePublished: a.datePublished,
    dateModified: a.dateModified,
    wordCount: a.wordCount,
    keywords: [a.primaryKeyword, ...(a.keywordCluster ?? [])].join(", "),
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
      reviewedBy: a.reviewer?.name ? personneLd(a.reviewer) : undefined,
    },
    author: a.author?.name ? personneLd(a.author) : { "@type": "Organization", name: "Granit" },
    publisher: {
      "@type": "Organization",
      name: "Granit",
      logo: { "@type": "ImageObject", url: `${SITE_URL}/favicon.svg` },
    },
    citation: a.sources?.length ? a.sources.map((s) => s.url) : undefined,
    about: p
      ? { "@type": "Organization", name: p.nom, url: site ? new URL(site).origin : undefined }
      : undefined,
  };
}

export function faqLd(a: RessourceJson) {
  if (!a.faqItems?.length) return undefined;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: a.faqItems.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}

/** title + « - Granit AI » si le total tient en 65 caractères, sinon le titre seul. */
export function titrePage(title: string): string {
  const long = `${title} - Granit AI`;
  return long.length <= 65 ? long : title;
}
