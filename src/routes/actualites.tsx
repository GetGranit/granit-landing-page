import { createFileRoute, Outlet } from "@tanstack/react-router";
import { rubriqueOuverte } from "@/lib/actualites/ouverture";

// __root ne charge que la graisse 400 ; la manchette et les grands faits sont en 300 (DESIGN.md).
const POLICE_LEGERE =
  "https://fonts.googleapis.com/css2?family=Source+Serif+4:opsz,wght@8..60,300&display=swap";

export const Route = createFileRoute("/actualites")({
  head: () => (rubriqueOuverte ? { links: [{ rel: "stylesheet", href: POLICE_LEGERE }] } : {}),
  component: () => <Outlet />,
});
