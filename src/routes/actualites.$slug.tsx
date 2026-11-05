import { createFileRoute, notFound } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { Introuvable } from "@/components/actualites/Introuvable";
import { JsonLd } from "@/components/actualites/JsonLd";
import { PageEdition } from "@/components/actualites/PageEdition";
import { chargerEdition } from "@/lib/actualites/contenu";
import { filEdition, headEdition, newsArticleLd } from "@/lib/actualites/seo";
import { breadcrumbLd } from "@/lib/ressources/seo";

export const Route = createFileRoute("/actualites/$slug")({
  loader: async ({ params }) => {
    const edition = await chargerEdition(params.slug);
    if (!edition) throw notFound();
    return edition;
  },
  head: ({ loaderData }) => (loaderData ? headEdition(loaderData) : {}),
  component: PageEditionRoute,
  notFoundComponent: Introuvable,
});

function PageEditionRoute() {
  const edition = Route.useLoaderData();
  return (
    <SiteLayout>
      <JsonLd donnees={newsArticleLd(edition)} />
      <JsonLd donnees={breadcrumbLd(filEdition(edition))} />
      <PageEdition edition={edition} />
    </SiteLayout>
  );
}
