// Versions anglaises des articles, chargées à la demande côté client.
// Le serveur rend toujours le français (la langue est dans localStorage) ; en anglais, le corps
// traduit arrive par un import paresseux, préchargé par le loader de la route quand on navigue
// déjà en anglais. Sans traduction (ou si le chargement échoue), le français reste affiché.
import { useEffect, useState } from "react";
import { useLanguage, type Lang } from "@/lib/i18n";
import { chargeurAncienEn, chargeurEn } from "./contenu";

type Chargeur<T> = () => Promise<{ default: T }>;

const prets = new Map<string, unknown>();
const enCours = new Map<string, Promise<void>>();

function charger<T>(cle: string, f: Chargeur<T>): Promise<void> {
  if (prets.has(cle)) return Promise.resolve();
  let p = enCours.get(cle);
  if (!p) {
    p = f()
      .then((m) => void prets.set(cle, m.default))
      .catch((e) => console.warn(`Ressources : version anglaise indisponible (${cle})`, e))
      .finally(() => enCours.delete(cle));
    enCours.set(cle, p);
  }
  return p;
}

/** Langue choisie avec le bouton FR/EN, lisible hors React ; toujours "fr" côté serveur. */
export function langueEnregistree(): Lang {
  try {
    return typeof window !== "undefined" && window.localStorage.getItem("granit-lang") === "en"
      ? "en"
      : "fr";
  } catch {
    return "fr";
  }
}

const cleArticle = (slug: string) => `article:${slug}`;
const cleAncien = (slug: string) => `ancien:${slug}`;

/** À appeler dans un loader : si l'écran est en anglais, attend la version anglaise de l'article. */
export async function prechargerEn(slug: string): Promise<void> {
  if (langueEnregistree() !== "en") return;
  const article = chargeurEn(slug);
  const ancien = chargeurAncienEn(slug);
  await Promise.all([
    article && charger(cleArticle(slug), article),
    ancien && charger(cleAncien(slug), ancien),
  ]);
}

function useVersionEn<T>(cle: string, f: Chargeur<T> | undefined): T | undefined {
  const { lang } = useLanguage();
  const [, rafraichir] = useState(0);
  useEffect(() => {
    if (lang !== "en" || !f || prets.has(cle)) return;
    let vivant = true;
    void charger(cle, f).then(() => vivant && rafraichir((n) => n + 1));
    return () => {
      vivant = false;
    };
  }, [lang, cle, f]);
  return lang === "en" ? (prets.get(cle) as T | undefined) : undefined;
}

/** Article JSON traduit (corps et fichiers de faits), ou undefined : on garde alors le français. */
export function useArticleEn(slug: string) {
  return useVersionEn(cleArticle(slug), chargeurEn(slug));
}

/** Ancien article traduit (content/en/anciens), ou undefined. */
export function useAncienEn(slug: string) {
  return useVersionEn(cleAncien(slug), chargeurAncienEn(slug));
}
