import { createFileRoute } from "@tanstack/react-router";
import { useLanguage } from "@/lib/i18n";
import { Hub } from "@/components/ressources/Hub";
import { HubEn } from "@/components/ressources/HubEn";
import { SITE_URL } from "@/lib/seo";
import { aLaUne } from "@/lib/ressources/contenu";

const TITLE = "Guide du tiers payant optique : portails et rejets - Granit AI";
const DESC =
  "Portails de tiers payant, prises en charge, rejets mutuelle, rapprochement des paiements : des réponses pratiques pour le comptoir des magasins d'optique.";

const breadcrumb = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Accueil", item: SITE_URL },
    { "@type": "ListItem", position: 2, name: "Ressources", item: `${SITE_URL}/ressources` },
  ],
};

export const Route = createFileRoute("/ressources/")({
  head: () => {
    const une = aLaUne();
    return {
      meta: [
        { title: TITLE },
        { name: "description", content: DESC },
        { property: "og:title", content: TITLE },
        { property: "og:description", content: DESC },
      ],
      // La grande couverture « À la une » est l'image principale de la page.
      links:
        une.length >= 3
          ? [{ rel: "preload", as: "image", href: `/covers/${une[0].slug}--une.svg` }]
          : [],
    };
  },
  component: RessourcesPage,
});

function RessourcesPage() {
  const { lang } = useLanguage();
  if (lang === "en") return <HubEn />;
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <Hub />
    </>
  );
}
