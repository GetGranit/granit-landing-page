import { createFileRoute, redirect } from "@tanstack/react-router";

// Old static site: /en/cgv/ was the English terms page.
export const Route = createFileRoute("/en/cgv")({
  beforeLoad: () => {
    throw redirect({ to: "/cgv", statusCode: 301 });
  },
});
