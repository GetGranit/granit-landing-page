import { defineNitroConfig } from "nitro/config";
import { securityHeaders } from "./server/security-headers";

// PostHog servi sous notre domaine (/rel) pour passer les bloqueurs de pub ; sur Vercel, Nitro en fait une rewrite CDN (pas de fonction appelée).
export default defineNitroConfig({
  plugins: ["./server/plugins/security-headers.ts"],
  routeRules: {
    "/**": { headers: securityHeaders },
    "/rel/static/**": { proxy: "https://eu-assets.i.posthog.com/static/**" },
    "/rel/array/**": { proxy: "https://eu-assets.i.posthog.com/array/**" },
    "/rel/**": { proxy: "https://eu.i.posthog.com/**" },
  },
});
