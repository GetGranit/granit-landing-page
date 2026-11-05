import { createFileRoute, notFound } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { Introuvable } from "@/components/actualites/Introuvable";
import { JsonLd } from "@/components/actualites/JsonLd";
import { Rubrique } from "@/components/actualites/Rubrique";
import { rubriqueOuverte } from "@/lib/actualites/ouverture";
import { filRubrique, headRubrique } from "@/lib/actualites/seo";
import { breadcrumbLd } from "@/lib/ressources/seo";
import type { VerticaleSlug } from "@/lib/ressources/types";
import { ORDRE_VERTICALES } from "@/lib/ressources/verticales";

export const Route = createFileRoute("/actualites/")({
  validateSearch: (recherche: Record<string, unknown>): { metier?: VerticaleSlug } => {
    const metier = ORDRE_VERTICALES.find((m) => m === recherche.metier);
    return metier ? { metier } : {};
  },
  // Rien de publié en production : 404, et aucune balise de la rubrique sur cette page.
  loader: async () => {
    if (!rubriqueOuverte) throw notFound();
    const { fiches } = await import("@/lib/actualites/contenu");
    return fiches;
  },
  head: ({ loaderData }) => (loaderData ? headRubrique(loaderData) : {}),
  component: PageRubrique,
  notFoundComponent: Introuvable,
});

function PageRubrique() {
  const fiches = Route.useLoaderData();
  const { metier } = Route.useSearch();
  return (
    <SiteLayout>
      <JsonLd donnees={breadcrumbLd(filRubrique())} />
      <Rubrique fiches={fiches} metier={metier} />
    </SiteLayout>
  );
}
