import { createFileRoute, notFound, redirect } from "@tanstack/react-router";
import { ANCIENS_SLUGS, estSlugMetier } from "@/components/agents/metiers";

/**
 * Ancienne adresse /agents/<slug> : redirige en 301 vers /metiers/<slug>.
 * /agents/optique devient /metiers/opticiens (ANCIENS_SLUGS). Un slug inconnu : 404.
 */
export const Route = createFileRoute("/agents/$metier")({
  beforeLoad: ({ params }) => {
    const slug = ANCIENS_SLUGS[params.metier] ?? params.metier;
    if (!estSlugMetier(slug)) throw notFound();
    throw redirect({ to: "/metiers/$metier", params: { metier: slug }, statusCode: 301 });
  },
});
