import { Outlet, Link, createRootRoute, HeadContent, Scripts, redirect } from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import { PostHogProvider } from "posthog-js/react";
import { LanguageProvider } from "@/lib/i18n";
import { CursorDot } from "@/components/CursorDot";
import { Seo } from "@/components/Seo";
import { rememberAttribution } from "@/lib/attribution";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4" style={{ background: "var(--bg)" }}>
      <div className="max-w-md text-center">
        <h1 className="font-serif text-7xl" style={{ color: "var(--text)" }}>404</h1>
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
      { title: "Granit AI - Plateforme d'agents IA pour la santé" },
      {
        name: "description",
        content:
          "Granit AI déploie des agents IA autonomes qui automatisent les workflows administratifs des établissements de santé. Tiers-payant, facturation, commandes - sans intégration.",
      },
      { name: "author", content: "Granit AI" },
      { property: "og:title", content: "Granit AI - Plateforme d'agents IA pour la santé" },
      { property: "og:description", content: "Granit AI automates healthcare administrative workflows with AI agents, no integration needed." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "description", content: "Granit AI automates healthcare administrative workflows with AI agents, no integration needed." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/1e3c52a3-36dc-4e80-8146-ca8444e17920/id-preview-352504c5--a0c4e6b0-14ec-4357-83be-c6489dcc9ce0.lovable.app-1777045010811.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/1e3c52a3-36dc-4e80-8146-ca8444e17920/id-preview-352504c5--a0c4e6b0-14ec-4357-83be-c6489dcc9ce0.lovable.app-1777045010811.png" },
    ],
    links: [
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Libre+Caslon+Text:ital,wght@0,400;0,700;1,400&family=Inter+Tight:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&family=Just+Me+Again+Down+Here&display=swap",
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
  const apiHost = import.meta.env.VITE_PUBLIC_POSTHOG_HOST ?? "https://eu.i.posthog.com";

  // Seul le site en ligne envoie des événements : ni la preview Lovable ni les essais en local.
  if (!import.meta.env.PROD) {
    return <RootDocument>{children}</RootDocument>;
  }

  return (
    <PostHogProvider
      apiKey={apiKey}
      options={{
        api_host: apiHost,
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
  // Lien tracké (utm_*) : gardé pour l'envoyer avec le formulaire, même plus tard.
  useEffect(() => {
    rememberAttribution();
  }, []);

  return (
    <LanguageProvider>
      <Seo />
      <Outlet />
      <CursorDot />
    </LanguageProvider>
  );
}
