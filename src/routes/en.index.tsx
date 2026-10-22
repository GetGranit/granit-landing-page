import { createFileRoute, redirect } from "@tanstack/react-router";

// Old static site: /en/ was the English home page.
export const Route = createFileRoute("/en/")({
  beforeLoad: () => {
    throw redirect({ to: "/", statusCode: 301 });
  },
});
