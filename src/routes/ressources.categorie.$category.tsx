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
import { VERTICALE_PRINCIPALE, verticale } from "@/lib/ressources/verticales";
import { aCouvertureFenetre, photoFiche, src } from "@/lib/ressources/photos";

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
      links:
        pilier && !aCouvertureFenetre(pilier)
          ? [{ rel: "preload", as: "image", href: src(photoFiche(pilier), 1600) }]
          : [],
    };
  },
  component: CategoriePage,
  notFoundComponent: NotFoundRessource,
});

function CategoriePage() {
  const { category } = Route.useLoaderData();
  const cat = categorie(category)!;
  const principale = verticale(VERTICALE_PRINCIPALE)!;
  const ld = breadcrumbLd([
    ["Ressources", "/ressources"],
    [principale.nom, `/ressources/metier/${principale.slug}`],
    [cat.nom, `/ressources/categorie/${cat.slug}`],
  ]);
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <PageCategorie cat={cat} />
    </>
  );
}
