// Balises et données structurées de la rubrique. Fonctions pures, testées par node --test.
// Le canonical et og:url sont déjà rendus par <Seo /> dans __root ; og:image vient de la racine.
// BreadcrumbList : les routes appellent breadcrumbLd(@/lib/ressources/seo) avec filEdition / filRubrique.
import { SITE_URL } from "../seo.ts";
import { NOM_RUBRIQUE } from "./marque.ts";
import { DESCRIPTION_RUBRIQUE, LIBELLES } from "./textes.ts";
import type { Edition, FicheEdition } from "./types";

const CHEMIN = "/actualites";
const IMAGE = `${SITE_URL}/granit-partage-1200x630.png`;
const NOINDEX = { name: "robots", content: "noindex, nofollow" };

export const urlEdition = (slug: string) => `${SITE_URL}${CHEMIN}/${slug}`;

export const filRubrique = (): [string, string][] => [[LIBELLES.fr.rubrique, CHEMIN]];

export const filEdition = (e: Pick<Edition, "slug" | "titre">): [string, string][] => [
  ...filRubrique(),
  [e.titre, `${CHEMIN}/${e.slug}`],
];

export function newsArticleLd(e: Edition) {
  return {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: e.titre,
    description: e.metaDescription,
    inLanguage: "fr-FR",
    image: IMAGE,
    datePublished: e.datePublished,
    dateModified: e.dateModified,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": urlEdition(e.slug),
      reviewedBy: e.relecteur ? { "@type": "Person", name: e.relecteur.nom } : undefined,
    },
    author: { "@type": "Organization", name: "Granit" },
    publisher: {
      "@type": "Organization",
      name: "Granit",
      logo: { "@type": "ImageObject", url: `${SITE_URL}/granit-logo-1200.png` },
    },
    citation: e.sources.length ? e.sources.map((s) => s.url) : undefined,
  };
}

export function headEdition(e: Edition) {
  return {
    meta: [
      { title: e.seoTitle },
      { name: "description", content: e.metaDescription },
      { property: "og:title", content: e.seoTitle },
      { name: "twitter:title", content: e.seoTitle },
      { property: "og:description", content: e.metaDescription },
      { property: "og:type", content: "article" },
      { property: "article:published_time", content: e.datePublished },
      { property: "article:modified_time", content: e.dateModified },
      ...(e.statut === "publie" ? [] : [NOINDEX]),
    ],
  };
}

/** Noindex tant qu'aucune édition n'est publiée : l'aperçu ne doit pas être indexé. */
export function headRubrique(fiches: Pick<FicheEdition, "statut">[]) {
  const titre = `${NOM_RUBRIQUE} - Granit`;
  return {
    meta: [
      { title: titre },
      { name: "description", content: DESCRIPTION_RUBRIQUE },
      { property: "og:title", content: titre },
      { name: "twitter:title", content: titre },
      { property: "og:description", content: DESCRIPTION_RUBRIQUE },
      ...(fiches.some((f) => f.statut === "publie") ? [] : [NOINDEX]),
    ],
  };
}
