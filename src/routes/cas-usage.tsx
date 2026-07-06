import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/cas-usage")({
  beforeLoad: () => {
    throw redirect({ to: "/agents" });
  },
  head: () => ({
    meta: [
      { title: "Secteurs - Granit AI" },
      { name: "description", content: "Granit s'adapte à chaque secteur de santé : optique, audio, pharmacie, EHPAD, cliniques, laboratoires, cabinets, centres dentaires." },
      { property: "og:title", content: "Secteurs - Granit AI" },
      { property: "og:description", content: "Quel que soit votre établissement, Granit s'adapte." },
    ],
  }),
});
