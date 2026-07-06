import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { HomeSections } from "@/components/home/HomeSections";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Granit AI - Vos équipes soignent. Granit gère le reste." },
      {
        name: "description",
        content:
          "Granit déploie des agents IA qui automatisent les tâches administratives de vos équipes de santé. Branché sur vos outils existants. Opérationnel en 48h.",
      },
      { property: "og:title", content: "Granit AI - Plateforme d'agents IA santé" },
      { property: "og:description", content: "Vos équipes soignent. Granit gère le reste." },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  return (
    <SiteLayout>
      <HomeSections />
    </SiteLayout>
  );
}
