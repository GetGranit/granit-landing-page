// Script nonces need a separate TanStack SSR integration before enforcing
// script-src. Same-origin frames preserve the existing interactive demo.
export const securityHeaders = {
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
  "Strict-Transport-Security": "max-age=63072000",
  "X-Frame-Options": "SAMEORIGIN",
  "Content-Security-Policy":
    "object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'self'",
};
