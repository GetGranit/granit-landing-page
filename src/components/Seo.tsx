import { useRouterState } from "@tanstack/react-router";
import { canonicalFor, organizationLd } from "@/lib/seo";

/**
 * Sitewide SEO tags. React 19 hoists <link>/<meta> to <head>; the JSON-LD
 * <script> is valid anywhere in the document for crawlers.
 */
export function Seo() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const canonical = canonicalFor(pathname);
  return (
    <>
      <link rel="canonical" href={canonical} />
      <meta property="og:url" content={canonical} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationLd) }}
      />
    </>
  );
}
