import { createFileRoute, notFound } from "@tanstack/react-router";
import { PageCategorie } from "@/components/ressources/PageCategorie";
import { NotFoundRessource } from "@/components/ressources/Introuvable";
import {
  categorie,
  descriptionCategorie,
  fichesCategorie,
  toutCategorie,
} from "@/lib/ressources/contenu";
import { breadcrumbLd } from "@/lib/ressources/seo";

export const Route = createFileRoute("/ressources/categorie/$category")({
  loader: ({ params }) => {
    const cat = categorie(params.category);
    // Une catégorie sans article en ligne n'existe pas : 404.
    if (!cat || toutCategorie(cat.slug).length === 0) throw notFound();
    return { category: cat.slug };
  },
  head: ({ loaderData }) => {
    const cat = loaderData ? categorie(loaderData.category) : undefined;
    if (!cat) return {};
    const title = `${cat.nom} : tiers payant optique - Granit AI`;
    const desc = descriptionCategorie(cat);
    // Une catégorie qui n'existe que par l'aperçu ne doit pas être indexée.
    const preview = toutCategorie(cat.slug).every((f) => f.preview);
    const pilier = fichesCategorie(cat.slug).find((f) => f.pillar);
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        ...(preview ? [{ name: "robots", content: "noindex, nofollow" }] : []),
      ],
      links: pilier ? [{ rel: "preload", as: "image", href: `/covers/${pilier.slug}--une.svg` }] : [],
    };
  },
  component: CategoriePage,
  notFoundComponent: NotFoundRessource,
});

function CategoriePage() {
  const { category } = Route.useLoaderData();
  const cat = categorie(category)!;
  const ld = breadcrumbLd([
    ["Ressources", "/ressources"],
    [cat.nom, `/ressources/categorie/${cat.slug}`],
  ]);
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <PageCategorie cat={cat} />
    </>
  );
}
