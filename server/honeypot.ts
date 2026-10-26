const rules: [string, RegExp][] = [
  ["env_file", /^\/(?:[^/]+\/)*\.env(?:[.-][a-z0-9_-]+)*$/i],
  ["git_exposure", /^\/\.git(?:\/|$)/i],
  ["wordpress", /^\/(?:wp-admin|wp-content|wp-login\.php|xmlrpc\.php)(?:\/|$)/i],
  ["admin_probe", /^\/(?:api\/)?(?:admin|phpmyadmin|adminer)(?:[./]|$)/i],
  ["credential_file", /^\/\.(?:aws|ssh)(?:\/|$)|^\/\.(?:npmrc|netrc|dockercfg)$/i],
];
const body =
  "<!doctype html><html><head><title>Not Found</title></head><body><h1>Not Found</h1></body></html>";

export function createHoneypot() {
  let started = 0;
  let recorded = 0;
  let suppressed = 0;
  return (request: Request): Response | undefined => {
    const url = new URL(request.url);
    const match = rules.find(([, pattern]) => pattern.test(url.pathname.slice(0, 2048)));
    if (!match) return;
    const now = Date.now();
    if (now - started >= 60_000) {
      started = now;
      recorded = 0;
    }
    if (recorded < 60) {
      recorded++;
      // No body, header, query value or arbitrary path segment is recorded.
      try {
        console.warn(
          JSON.stringify({
            event: "security.honeypot",
            service_name: "landing",
            rule: match[0],
            path_template: `/honeypot/${match[0]}`,
            method: request.method,
            query_present: Boolean(url.search),
            suppressed_since_last_event: suppressed,
          }),
        );
      } catch {
        /* The inert response survives a telemetry failure. */
      }
      suppressed = 0;
    } else suppressed++;
    return new Response(request.method === "HEAD" ? null : body, {
      status: 404,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "no-store",
        "X-Content-Type-Options": "nosniff",
        "X-Robots-Tag": "noindex, nofollow",
      },
    });
  };
}

export const honeypot = createHoneypot();
