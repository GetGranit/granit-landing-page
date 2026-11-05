import type { ReactNode } from "react";
import { Nav } from "./Nav";
import { Footer } from "./Footer";

export function SiteLayout({
  children,
  hideFooter = false,
  fond,
  piedColle = false,
  banniere,
}: {
  children: ReactNode;
  hideFooter?: boolean;
  /** Fond de la page, derrière la barre collante (par défaut var(--bg)). */
  fond?: string;
  /** Le pied de page touche la dernière section, sans marge. */
  piedColle?: boolean;
  /** Au-dessus de la barre : elle défile avec la page, la barre reste collée en haut. */
  banniere?: ReactNode;
}) {
  return (
    <div className="isolate flex min-h-screen flex-col" style={{ background: fond ?? "var(--bg)" }}>
      {banniere}
      <Nav />
      <main className="flex-1">{children}</main>
      {!hideFooter && <Footer colle={piedColle} />}
    </div>
  );
}
