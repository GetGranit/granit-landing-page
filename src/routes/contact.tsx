import { createFileRoute, redirect } from "@tanstack/react-router";

// Old site: /contact is now the demo request page.
export const Route = createFileRoute("/contact")({
  beforeLoad: () => {
    throw redirect({ to: "/demo", statusCode: 301 });
  },
});
