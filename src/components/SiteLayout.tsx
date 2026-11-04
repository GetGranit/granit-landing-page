import type { ReactNode } from "react";
import { Nav } from "./Nav";
import { Footer } from "./Footer";

export function SiteLayout({
  children,
  hideFooter = false,
  fond,
  piedColle = false,
}: {
  children: ReactNode;
  hideFooter?: boolean;
  /** Fond de la page, derrière la barre collante (par défaut var(--bg)). */
  fond?: string;
  /** Le pied de page touche la dernière section, sans marge. */
  piedColle?: boolean;
}) {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: fond ?? "var(--bg)" }}>
      <Nav />
      <main className="flex-1">{children}</main>
      {!hideFooter && <Footer colle={piedColle} />}
    </div>
  );
}
