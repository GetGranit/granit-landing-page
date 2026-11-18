import { createFileRoute, redirect } from "@tanstack/react-router";
import { ANCIENS_SLUGS, estSlugMetier } from "@/components/agents/metiers";

/**
 * Ancienne adresse /agents : redirige en 301 vers /metiers.
 * /agents?metier=<slug> (la plus ancienne) va directement à la page du métier.
 */
export const Route = createFileRoute("/agents/")({
  validateSearch: (search: Record<string, unknown>): { metier?: string } =>
    typeof search.metier === "string" ? { metier: search.metier } : {},
  beforeLoad: ({ search }) => {
    const slug = search.metier ? (ANCIENS_SLUGS[search.metier] ?? search.metier) : undefined;
    if (estSlugMetier(slug))
      throw redirect({ to: "/metiers/$metier", params: { metier: slug }, statusCode: 301 });
    throw redirect({ to: "/metiers", statusCode: 301 });
  },
});
