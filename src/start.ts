import { createCsrfMiddleware, createMiddleware, createStart } from "@tanstack/react-start";

// Same protection TanStack Start applies by default when this file does not exist.
const csrfMiddleware = createCsrfMiddleware({
  filter: (ctx) => ctx.handlerType === "serverFn",
});

// /tarifs/ -> /tarifs in 308 (permanent). Without this, the router answers with a 307
// (temporary), which search engines treat as "keep the old URL".
const slashFinal = createMiddleware({ type: "request" }).server(({ request, next }) => {
  if (request.method !== "GET" && request.method !== "HEAD") return next();
  const url = new URL(request.url);
  if (url.pathname.length < 2 || !url.pathname.endsWith("/")) return next();
  const path = url.pathname.replace(/\/+$/, "") || "/";
  throw new Response(null, { status: 308, headers: { Location: path + url.search } });
});

export const startInstance = createStart(() => ({
  requestMiddleware: [slashFinal, csrfMiddleware],
}));
