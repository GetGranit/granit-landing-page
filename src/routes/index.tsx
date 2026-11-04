import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { HomeSections } from "@/components/home/HomeSections";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Granit - Agents IA santé. Vos équipes soignent. Granit gère le reste." },
      {
        name: "description",
        content:
          "Droits, prises en charge, facturation, encaissement : les agents IA de Granit font tourner votre tiers payant de bout en bout, dans vos logiciels actuels. Opérationnel en 48 h.",
      },
      { property: "og:title", content: "Granit - Agents IA santé" },
      { property: "og:description", content: "Vos équipes soignent. Granit gère le reste." },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  return (
    <SiteLayout piedColle>
      <HomeSections />
    </SiteLayout>
  );
}
