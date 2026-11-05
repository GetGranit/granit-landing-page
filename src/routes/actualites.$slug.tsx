import { createFileRoute, notFound } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { Introuvable } from "@/components/actualites/Introuvable";
import { JsonLd } from "@/components/actualites/JsonLd";
import { PageEdition } from "@/components/actualites/PageEdition";
import { filEdition, headEdition, newsArticleLd } from "@/lib/actualites/seo";
import { breadcrumbLd } from "@/lib/ressources/seo";

export const Route = createFileRoute("/actualites/$slug")({
  loader: async ({ params }) => {
    const { chargerEdition, fiches } = await import("@/lib/actualites/contenu");
    const edition = await chargerEdition(params.slug);
    if (!edition) throw notFound();
    return { edition, autres: fiches.filter((f) => f.slug !== edition.slug) };
  },
  head: ({ loaderData }) => (loaderData ? headEdition(loaderData.edition) : {}),
  component: PageEditionRoute,
  notFoundComponent: Introuvable,
});

function PageEditionRoute() {
  const { edition, autres } = Route.useLoaderData();
  return (
    <SiteLayout>
      <JsonLd donnees={newsArticleLd(edition)} />
      <JsonLd donnees={breadcrumbLd(filEdition(edition))} />
      <PageEdition edition={edition} autres={autres} />
    </SiteLayout>
  );
}
