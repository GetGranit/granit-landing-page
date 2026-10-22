import { createFileRoute } from "@tanstack/react-router";

import { PecPage, pecHead } from "./pec";

/**
 * Alias public du lead magnet PEC : /lead-magnet-pec sert exactement la même
 * page que /pec (même composant, même <head>). Les deux URLs coexistent — on
 * garde /pec et on expose /lead-magnet-pec pour les liens externes
 * (demo.getgranit.ai/lead-magnet-pec).
 */
export const Route = createFileRoute("/lead-magnet-pec")({
  head: pecHead,
  component: PecPage,
});
