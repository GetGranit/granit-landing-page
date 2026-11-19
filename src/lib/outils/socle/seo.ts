// SEO des pages d'outil : balises du `head` et données structurées.
// Les hubs et les entrées sont indexables (pas de robots) ; seule la page introuvable est en noindex.
// Pas de suffixe « - Granit » dans le titre. Le canonical vient de src/components/Seo.tsx (chemin sans
// requête) : /outils/codes-rejet?q=0450054 a pour canonical le hub.
import { breadcrumbLd } from "@/lib/ressources/seo";
import { SITE_URL, organizationRef, websiteLd } from "@/lib/seo";
import type { SourceDonnee } from "./types";

export function headOutil({
  titre,
  description,
  robots,
}: {
  titre: string;
  description: string;
  robots?: string;
}) {
  return {
    meta: [
      { title: titre },
      { name: "description", content: description },
      { property: "og:title", content: titre },
      { name: "twitter:title", content: titre },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      ...(robots ? [{ name: "robots", content: robots }] : []),
    ],
  };
}

/**
 * `head` d'une page introuvable (404) : un titre lisible. Le noindex est posé par
 * PageIntrouvableOutil elle-même (balise placée dans le <head> par React), pour ne jamais manquer.
 */
export function headIntrouvable(slug: string, nomOutil: string) {
  return headOutil({
    titre: `${slug}\u00a0: introuvable`,
    description: `Cette adresse ne correspond à aucune page de l'outil ${nomOutil}.`,
  });
}

const urlDe = (chemin: string) => SITE_URL + (chemin === "/" ? "" : chemin);
const isPartOf = { "@id": websiteLd["@id"] };

/** WebPage d'une entrée (§ 7.2) : `citation` = les URL de ses sources. */
export function webPageLd(p: {
  chemin: string;
  titre: string;
  description: string;
  dateModified: string;
  sources?: SourceDonnee[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: p.titre,
    description: p.description,
    url: urlDe(p.chemin),
    inLanguage: "fr-FR",
    dateModified: p.dateModified,
    isPartOf,
    publisher: organizationRef,
    citation: p.sources?.length ? [...new Set(p.sources.map((s) => s.url))] : undefined,
  };
}

/** CollectionPage d'un hub (§ 7.1) ou de la page /outils. */
export function collectionPageLd(p: {
  chemin: string;
  titre: string;
  description: string;
  dateModified?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: p.titre,
    description: p.description,
    url: urlDe(p.chemin),
    inLanguage: "fr-FR",
    dateModified: p.dateModified,
    isPartOf,
    publisher: organizationRef,
  };
}

/**
 * BreadcrumbList : Accueil › Outils › {items}. Le dernier niveau sans chemin prend `cheminCourant`.
 * @param items les niveaux après « Outils », comme pour FilOutil
 */
export function filLd(items: { nom: string; chemin?: string }[], cheminCourant: string) {
  return breadcrumbLd([
    ["Outils", "/outils"],
    ...items.map((it) => [it.nom, it.chemin ?? cheminCourant] as [string, string]),
  ]);
}
