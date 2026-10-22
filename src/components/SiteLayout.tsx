import type { ReactNode } from "react";
import { Nav } from "./Nav";
import { Footer } from "./Footer";

export function SiteLayout({
  children,
  hideFooter = false,
  fond,
}: {
  children: ReactNode;
  hideFooter?: boolean;
  /** Fond de la page, derrière la barre collante (par défaut var(--bg)). */
  fond?: string;
}) {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: fond ?? "var(--bg)" }}>
      <Nav />
      <main className="flex-1">{children}</main>
      {!hideFooter && <Footer />}
    </div>
  );
}
