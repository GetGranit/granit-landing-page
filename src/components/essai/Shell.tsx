import logo from "@/assets/logo.svg";
import { QUOTA } from "./quotaStore";

/** Cadre de l'espace : bandeau « Aperçu », logo, pastilles d'état. */
export function Shell({
  exemple,
  mutuelle,
  faites,
  children,
}: {
  exemple: boolean;
  mutuelle?: string | null;
  faites?: number;
  children?: React.ReactNode;
}) {
  const chip = {
    background: "var(--tag-bg)",
    color: "var(--text-soft)",
    fontFamily: "var(--font-mono)",
  };
  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      <div
        className="px-4 py-2 text-center text-[11px] leading-[1.4]"
        style={{
          background: "var(--bg3)",
          color: "var(--text-soft)",
          fontFamily: "var(--font-mono)",
        }}
      >
        Aperçu de l'espace Granit · rien n'est encore connecté à votre portail ni à votre logiciel
      </div>
      <header className="mx-auto flex max-w-[1080px] items-center justify-between gap-3 px-4 py-4 sm:px-6">
        <a href="/" aria-label="Granit, accueil">
          <img src={logo} alt="Granit" className="h-[24px] w-auto" />
        </a>
        <div className="flex flex-wrap justify-end gap-2">
          {exemple && (
            <span className="rounded-full px-3 py-1 text-[11px]" style={chip}>
              Cas d'exemple · {mutuelle ?? "Mutuelle Exemple"}
            </span>
          )}
          {faites !== undefined && (
            <a href="#pec" className="num-tabular rounded-full px-3 py-1 text-[11px]" style={chip}>
              {faites} / {QUOTA} PEC offertes
            </a>
          )}
        </div>
      </header>
      <main className="mx-auto max-w-[1080px] px-4 pb-40 pt-2 sm:px-6 lg:pt-8">{children}</main>
    </div>
  );
}
