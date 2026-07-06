import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/produit")({
  beforeLoad: () => {
    throw redirect({ to: "/agents" });
  },
  head: () => ({
    meta: [
      { title: "Produit - Granit AI" },
      { name: "description", content: "Des agents IA sur mesure pour automatiser tiers-payant, rejets CPAM, recouvrement, rapprochement bancaire." },
      { property: "og:title", content: "Produit - Granit AI" },
      { property: "og:description", content: "Des agents IA sur mesure. Branchés sur vos outils." },
    ],
  }),
});
