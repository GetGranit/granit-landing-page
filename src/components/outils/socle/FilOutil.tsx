import { useRouterState } from "@tanstack/react-router";
import { JsonLd } from "@/components/JsonLd";
import { Fil } from "@/components/ressources/Fil";
import { filLd } from "@/lib/outils/socle/seo";

export type ItemFil = { nom: string; chemin?: string };

/**
 * Fil d'Ariane d'une page d'outil : Accueil › Outils › {items}, le dernier sans chemin.
 * À 375 px, seulement « ‹ niveau parent » ; dès 768 px, le fil complet (Fil des Ressources).
 * Pose aussi le BreadcrumbList JSON-LD.
 */
export function FilOutil({ items }: { items: ItemFil[] }) {
  const chemin = useRouterState({ select: (s) => s.location.pathname });
  return (
    <>
      <JsonLd data={[filLd(items, chemin)]} />
      <Fil
        items={[
          { nom: "Outils", to: "/outils" },
          ...items.map((it, i) => ({
            nom: it.nom,
            to: i < items.length - 1 ? it.chemin : undefined,
          })),
        ]}
      />
    </>
  );
}
