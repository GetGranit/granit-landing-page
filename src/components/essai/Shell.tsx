import logo from "@/assets/logo.svg";
import { useLanguage } from "@/lib/i18n";
import { QUOTA } from "./quotaStore";

const copy = {
  fr: {
    apercu:
      "Aperçu de l'espace Granit · rien n'est encore connecté à votre portail ni à votre logiciel",
    accueil: "Granit, accueil",
    exemple: "Cas d'exemple",
    offertes: "simulations offertes",
  },
  en: {
    apercu:
      "Preview of the Granit workspace · nothing is connected to your portal or your software yet",
    accueil: "Granit, home",
    exemple: "Sample case",
    offertes: "free simulations",
  },
};

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
  const t = copy[useLanguage().lang];
  const chip = {
    background: "var(--lavis)",
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
        {t.apercu}
      </div>
      <header className="mx-auto flex max-w-[1080px] items-center justify-between gap-3 px-4 py-4 sm:px-6">
        <a href="/" aria-label={t.accueil}>
          <img src={logo} width={445} height={96} alt="Granit" className="h-[24px] w-auto" />
        </a>
        <div className="flex flex-wrap justify-end gap-2">
          {exemple && (
            <span className="rounded-full px-3 py-1 text-[11px]" style={chip}>
              {t.exemple} · {mutuelle ?? "Mutuelle Exemple"}
            </span>
          )}
          {faites !== undefined && (
            <a href="#pec" className="num-tabular rounded-full px-3 py-1 text-[11px]" style={chip}>
              {faites} / {QUOTA} {t.offertes}
            </a>
          )}
        </div>
      </header>
      <main className="mx-auto max-w-[1080px] px-4 pb-40 pt-2 sm:px-6 lg:pt-8">{children}</main>
    </div>
  );
}
