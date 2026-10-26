import assert from "node:assert/strict";

// Run against a local production preview or a Vercel deployment, not vite dev.
const base = process.argv[2];
if (!base)
  throw new Error("Usage: node scripts/check-security-headers.mjs https://deployment.example");

for (const path of ["/", "/demo", "/demo.html", "/robots.txt", "/missing-security-check"]) {
  const response = await fetch(new URL(path, base), { redirect: "manual" });
  if (path === "/missing-security-check") assert.equal(response.status, 404, path);
  else assert.equal(response.status, 200, path);
  assert.equal(response.headers.get("x-content-type-options"), "nosniff", path);
  assert.equal(response.headers.get("referrer-policy"), "strict-origin-when-cross-origin", path);
  assert.match(response.headers.get("strict-transport-security") ?? "", /max-age=63072000/, path);
  const csp = response.headers.get("content-security-policy") ?? "";
  assert.match(csp, /object-src 'none'/, path);
  assert.match(csp, /base-uri 'self'/, path);
  assert.equal(response.headers.get("x-frame-options"), "SAMEORIGIN", path);
  assert.match(csp, /frame-ancestors 'self'/, path);
  console.log(`${response.status} ${path}: headers OK`);
}
