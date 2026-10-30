import {
  Outlet,
  Link,
  createRootRoute,
  HeadContent,
  Scripts,
  redirect,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import { PostHogProvider, usePostHog } from "posthog-js/react";
import { LanguageProvider } from "@/lib/i18n";
import { CursorDot } from "@/components/CursorDot";
import { Seo } from "@/components/Seo";
import { getAttributionParams, rememberAttribution } from "@/lib/attribution";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div
      className="flex min-h-screen items-center justify-center px-4"
      style={{ background: "var(--bg)" }}
    >
      <div className="max-w-md text-center">
        <h1 className="font-serif text-7xl" style={{ color: "var(--text)" }}>
          404
        </h1>
        <h2 className="mt-4 text-xl">Page introuvable</h2>
        <p className="mt-2 text-sm" style={{ color: "var(--text-muted)" }}>
          Cette page n'existe pas ou a été déplacée.
        </p>
        <div className="mt-6">
          <Link to="/" className="btn-primary">
            Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  // Routes match case-insensitively: send /Agents to /agents so each page has one URL.
  beforeLoad: ({ location }) => {
    const path = location.pathname;
    if (path !== path.toLowerCase()) {
      throw redirect({ href: path.toLowerCase() + location.searchStr, statusCode: 301 });
    }
  },
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Granit - Agents IA pour la santé" },
      {
        name: "description",
        content:
          "Granit déploie des agents IA autonomes qui automatisent les workflows administratifs des établissements de santé. Tiers-payant, facturation, commandes - sans intégration.",
      },
      { name: "author", content: "Granit" },
      { property: "og:title", content: "Granit - Agents IA pour la santé" },
      {
        property: "og:description",
        content:
          "Granit automates healthcare administrative workflows with AI agents, no integration needed.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      {
        name: "description",
        content:
          "Granit automates healthcare administrative workflows with AI agents, no integration needed.",
      },
      {
        property: "og:image",
        content: "https://www.getgranit.ai/marque/granit-partage-1200x630.png",
      },
      {
        name: "twitter:image",
        content: "https://www.getgranit.ai/marque/granit-partage-1200x630.png",
      },
    ],
    links: [
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "icon", href: "/favicon.ico", sizes: "any" },
      { rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600&family=Roboto+Serif:opsz,wdth,wght@20,94,300..400&display=swap",
      },
      { rel: "stylesheet", href: appCss },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  // Clé projet PostHog publique (phc_) : lisible dans le navigateur, elle ne sert qu'à envoyer des événements.
  const apiKey =
    import.meta.env.VITE_PUBLIC_POSTHOG_PROJECT_TOKEN ??
    "phc_vocwuFQpcKDfGRNvbdcdbL6QHL9Z3kmhgLd3B2mpE28n";
  // /rel : relais PostHog sous notre domaine (voir nitro.config.ts).
  const apiHost = import.meta.env.VITE_PUBLIC_POSTHOG_HOST ?? "/rel";

  // Seul le site en ligne envoie des événements : ni la preview Lovable ni les essais en local
  // (les builds de démo du lead magnet, VITE_PEC_APERCU=on, sont des builds PROD : on les exclut aussi).
  if (!import.meta.env.PROD || import.meta.env.VITE_PEC_APERCU === "on") {
    return <RootDocument>{children}</RootDocument>;
  }

  return (
    <PostHogProvider
      apiKey={apiKey}
      options={{
        api_host: apiHost,
        ui_host: "https://eu.posthog.com",
        defaults: "2025-05-24",
        capture_exceptions: true,
        logs: {
          serviceName: "granit-landing-page",
          environment: import.meta.env.MODE,
        },
      }}
    >
      <RootDocument>{children}</RootDocument>
    </PostHogProvider>
  );
}

function RootDocument({ children }: { children: ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const posthog = usePostHog();
  // Lien tracké (utm_*, ref) : gardé pour l'envoyer avec le formulaire, même plus tard,
  // et posé sur chaque événement PostHog pour lire les clics par lien et par personne.
  useEffect(() => {
    rememberAttribution();
    const params = getAttributionParams();
    if (Object.keys(params).length) posthog?.register(params);
  }, [posthog]);

  return (
    <LanguageProvider>
      <Seo />
      <Outlet />
      <CursorDot />
    </LanguageProvider>
  );
}
