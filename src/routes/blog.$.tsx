import { createFileRoute, redirect } from "@tanstack/react-router";
import { legacyBlogSlug } from "@/lib/legacyBlog";

export const Route = createFileRoute("/blog/$")({
  beforeLoad: ({ params }) => {
    const slug = legacyBlogSlug("fr", params._splat);
    if (slug) throw redirect({ to: "/ressources/$slug", params: { slug }, statusCode: 301 });
    throw redirect({ to: "/ressources", statusCode: 301 });
  },
});
