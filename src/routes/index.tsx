import { createFileRoute } from "@tanstack/react-router";
import { Accueil } from "@/components/accueil/Accueil";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Granit - Vos équipes soignent. Nos agents encaissent." },
      {
        name: "description",
        content:
          "Droits, prises en charge, facturation, encaissement : nos agents IA font tourner votre tiers payant de bout en bout, dans vos logiciels actuels.",
      },
      { property: "og:title", content: "Granit - Vos équipes soignent. Nos agents encaissent." },
      {
        property: "og:description",
        content:
          "Nos agents IA font tourner votre tiers payant de bout en bout, dans vos logiciels actuels.",
      },
    ],
    links: [
      /* les polices de la marque (DESIGN.md), pour l'accueil tant que __root charge encore les anciennes */
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Source+Serif+4:opsz,wght@8..60,400;8..60,500&family=Geist:wght@400;500;600&display=swap",
      },
    ],
  }),
  component: Accueil,
});
