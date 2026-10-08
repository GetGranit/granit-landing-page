import { createFileRoute } from "@tanstack/react-router";
import { useLanguage } from "@/lib/i18n";
import { Hub } from "@/components/ressources/Hub";
import { HubEn } from "@/components/ressources/HubEn";
import { SITE_URL } from "@/lib/seo";
import { aLaUne } from "@/lib/ressources/contenu";
import { aCouvertureFenetre, photoFiche, src } from "@/lib/ressources/photos";

const TITLE = "Ressources pour les professionnels de santé : mutuelles, paiements - Granit AI";
const DESC =
  "Opticiens, audioprothésistes, pharmaciens, dentistes, centres de santé : des réponses pratiques sur les mutuelles, les remboursements, les paiements et la réglementation.";

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
      // La grande couverture « À la une » est l'image principale de la page
      // (une fiche plateformes n'a pas de photo : sa fenêtre est en CSS).
      links:
        une.length >= 3 && !aCouvertureFenetre(une[0])
          ? [{ rel: "preload", as: "image", href: src(photoFiche(une[0]), 1600) }]
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
