import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const config = JSON.parse(readFileSync(".vercel/output/config.json", "utf8"));
const headerRule = config.routes.findIndex(
  (route) => route.src === "/(.*)" && route.headers?.["Content-Security-Policy"],
);
assert.ok(headerRule >= 0, "Vercel must receive the global security headers");
assert.ok(
  headerRule < config.routes.findIndex((route) => route.handle === "filesystem"),
  "headers must apply before static-file routing",
);
const headers = new Headers(config.routes[headerRule].headers);
assert.equal(headers.get("x-content-type-options"), "nosniff");
assert.equal(headers.get("x-frame-options"), "SAMEORIGIN");
assert.match(headers.get("content-security-policy"), /frame-ancestors 'self'/);
assert.match(headers.get("content-security-policy"), /object-src 'none'/);
assert.match(headers.get("strict-transport-security"), /max-age=63072000/);
assert.equal(headers.get("referrer-policy"), "strict-origin-when-cross-origin");
assert.equal(config.routes.filter((route) => route.src?.startsWith("/rel/")).length, 3);
console.log("Vercel output: security headers precede static/SSR routes; analytics proxy retained");
