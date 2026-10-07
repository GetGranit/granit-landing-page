import { createFileRoute, notFound } from "@tanstack/react-router";
import { PageMetier } from "@/components/ressources/PageMetier";
import { NotFoundRessource } from "@/components/ressources/Introuvable";
import { fichesVerticale } from "@/lib/ressources/contenu";
import { breadcrumbLd } from "@/lib/ressources/seo";
import { photoVerticale, verticale } from "@/lib/ressources/verticales";
import { SITE_URL } from "@/lib/seo";

export const Route = createFileRoute("/ressources/metier/$verticale")({
  loader: ({ params }) => {
    const v = verticale(params.verticale);
    // Un métier sans article propre n'a pas de page.
    if (!v || fichesVerticale(v.slug).length === 0) throw notFound();
    return { verticale: v.slug };
  },
  head: ({ loaderData }) => {
    const v = loaderData ? verticale(loaderData.verticale) : undefined;
    if (!v) return {};
    const propres = fichesVerticale(v.slug);
    // Indexée seulement à partir de 3 articles propres (aperçu exclu), comme dans le sitemap.
    const indexable = propres.filter((f) => !f.preview).length >= 3;
    const title = `${v.nom} : tiers payant et gestion administrative - Granit AI`;
    const image = SITE_URL + photoVerticale(v.slug, 1600);
    return {
      meta: [
        { title },
        { name: "description", content: v.description },
        { property: "og:title", content: title },
        { property: "og:description", content: v.description },
        { property: "og:image", content: image },
        { property: "og:image:width", content: "1600" },
        { property: "og:image:height", content: "900" },
        { property: "og:image:alt", content: v.alt },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:image", content: image },
        ...(indexable ? [] : [{ name: "robots", content: "noindex, follow" }]),
      ],
    };
  },
  component: MetierPage,
  notFoundComponent: NotFoundRessource,
});

function MetierPage() {
  const { verticale: slug } = Route.useLoaderData();
  const v = verticale(slug)!;
  const ld = breadcrumbLd([
    ["Ressources", "/ressources"],
    [v.nom, `/ressources/metier/${v.slug}`],
  ]);
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <PageMetier v={v} />
    </>
  );
}
