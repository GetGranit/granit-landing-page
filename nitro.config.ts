import { defineNitroConfig } from "nitro/config";

// Images sans empreinte dans l'URL : 7 jours et pas `immutable`. Remplacer un fichier à la même adresse
// reste possible (les visiteurs de retour le voient sous 7 jours) ; pour un effet immédiat, changer son nom.
const IMAGES = { headers: { "cache-control": "public, max-age=604800" } };

// PostHog servi sous notre domaine (/rel) pour passer les bloqueurs de pub ; sur Vercel, Nitro en fait une rewrite CDN (pas de fonction appelée).
export default defineNitroConfig({
  routeRules: {
    "/logos/**": IMAGES,
    "/ressources/themes/**": IMAGES,
    "/ressources/metiers/**": IMAGES,
    "/rel/static/**": { proxy: "https://eu-assets.i.posthog.com/static/**" },
    "/rel/array/**": { proxy: "https://eu-assets.i.posthog.com/array/**" },
    "/rel/**": { proxy: "https://eu.i.posthog.com/**" },
  },
});
