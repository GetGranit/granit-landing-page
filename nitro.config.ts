import { defineNitroConfig } from "nitro/config";

// PostHog servi sous notre domaine (/rel) pour passer les bloqueurs de pub ; sur Vercel, Nitro en fait une rewrite CDN (pas de fonction appelée).
export default defineNitroConfig({
  routeRules: {
    "/rel/static/**": { proxy: "https://eu-assets.i.posthog.com/static/**" },
    "/rel/array/**": { proxy: "https://eu-assets.i.posthog.com/array/**" },
    "/rel/**": { proxy: "https://eu.i.posthog.com/**" },
  },
});
