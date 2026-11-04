import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type Lang = "fr" | "en";

type LanguageContextValue = {
  lang: Lang;
  setLang: (lang: Lang) => void;
  toggleLang: () => void;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

const CLE = "granit-lang";
const estLang = (v: unknown): v is Lang => v === "fr" || v === "en";

/**
 * Langue de l'écran, lisible hors React ; null côté serveur ou sans choix.
 * `?lang=en` (ou `fr`) dans l'URL l'emporte et devient la langue gardée : c'est le lien à
 * partager pour ouvrir le site directement en anglais (annonce, posts, mails).
 */
export function lireLangue(): Lang | null {
  if (typeof window === "undefined") return null;
  try {
    const demandee = new URLSearchParams(window.location.search).get("lang");
    if (estLang(demandee)) {
      window.localStorage.setItem(CLE, demandee);
      return demandee;
    }
    const gardee = window.localStorage.getItem(CLE);
    return estLang(gardee) ? gardee : null;
  } catch {
    return null;
  }
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("fr");

  useEffect(() => {
    const choisie = lireLangue();
    if (choisie) {
      setLangState(choisie);
      document.documentElement.lang = choisie;
    }
  }, []);

  const setLang = (nextLang: Lang) => {
    setLangState(nextLang);
    try {
      window.localStorage.setItem(CLE, nextLang);
    } catch {
      // navigation privée ou stockage bloqué : la langue tient le temps de la page
    }
    document.documentElement.lang = nextLang;
  };

  const value = useMemo(
    () => ({
      lang,
      setLang,
      toggleLang: () => setLang(lang === "fr" ? "en" : "fr"),
    }),
    [lang],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
}
