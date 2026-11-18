// Recherche et filtres des hubs : fonctions pures, les mêmes au rendu serveur et dans le navigateur.
// Toutes les lignes sont dans le HTML ; ces fonctions disent seulement lesquelles restent visibles.
import { cleCode, normaliser } from "./texte.mjs";
import type { Filtres, LigneHub } from "./types";

export type OptionsRecherche = {
  /** Autres formes de la requête à essayer (A : « 450054 » → « 0450054 »). */
  variantes?: (q: string) => string[];
};

export type ResultatRecherche<L extends LigneHub> = {
  /** Lignes visibles, dans l'ordre du HTML. */
  visibles: L[];
  ids: Set<string>;
  /** Une ligne visible a une clé égale à la requête (code tapé en entier) : pour le suivi. */
  exact: boolean;
};

/** Prépare les champs cherchables d'une ligne à partir des textes bruts. */
export function preparerRecherche(
  cles: readonly (string | undefined | null)[],
  textes: readonly (string | undefined | null)[],
) {
  return {
    cles: [
      ...new Set(
        cles
          .filter((c): c is string => Boolean(c))
          .map(cleCode)
          .filter(Boolean),
      ),
    ],
    texte: normaliser(textes.filter(Boolean).join(" ")),
  };
}

const facettesOk = (l: LigneHub, filtres: Filtres) =>
  Object.entries(filtres).every(([f, v]) => !v || (l.facettes[f] ?? []).includes(v));

/** Une recherche ou un filtre est-il posé ? */
export const rechercheActive = (q: string, filtres: Filtres) =>
  normaliser(q) !== "" || Object.values(filtres).some(Boolean);

/**
 * Garde une ligne si ses facettes correspondent aux filtres ET si la requête est vide, ou si la clé de
 * la requête (ou d'une variante) égale ou préfixe une de ses `cles`, ou si chaque mot de la requête
 * normalisée est dans son `texte`.
 */
export function filtrerLignes<L extends LigneHub>(
  lignes: readonly L[],
  q: string,
  filtres: Filtres = {},
  options: OptionsRecherche = {},
): ResultatRecherche<L> {
  const formes = [q, ...(options.variantes?.(q) ?? [])];
  const cles = [...new Set(formes.map(cleCode).filter(Boolean))];
  const mots = [...new Set(formes.map(normaliser).filter(Boolean))].map((f) => f.split(" "));
  const vide = !cles.length && !mots.length;
  let exact = false;
  const visibles = lignes.filter((l) => {
    if (!facettesOk(l, filtres)) return false;
    if (vide) return true;
    if (cles.some((k) => l.cles.includes(k))) {
      exact = true;
      return true;
    }
    if (cles.some((k) => l.cles.some((c) => c.startsWith(k)))) return true;
    return mots.some((ms) => ms.every((m) => l.texte.includes(m)));
  });
  return { visibles, ids: new Set(visibles.map((l) => l.id)), exact };
}

/**
 * Ce qu'on envoie à PostHog d'une requête : espaces réduites, 40 caractères au plus ; « [retiree] »
 * si elle contient un @ (e-mail) ; toute suite de 11 chiffres ou plus (NIR, téléphone collé par
 * erreur) remplacée par « # ». Les numéros AMC (10 chiffres) passent.
 */
export function nettoyerRequete(q: string): string {
  const t = String(q ?? "")
    .replace(/\s+/g, " ")
    .trim();
  if (t.includes("@")) return "[retiree]";
  // Les chiffres d'un NIR s'écrivent souvent groupés (« 1 85 05 75 … ») : on les lit sans espaces.
  return t
    .replace(/\d(?:[\s.-]?\d){10,}/g, "#")
    .slice(0, 40)
    .trim();
}

/** Distance d'édition (Levenshtein), arrêtée dès qu'elle dépasse `max`. */
export function distanceEdition(a: string, b: string, max = Infinity): number {
  if (Math.abs(a.length - b.length) > max) return max + 1;
  let prec = Array.from({ length: b.length + 1 }, (_, j) => j);
  for (let i = 1; i <= a.length; i++) {
    const cour = [i];
    let mini = i;
    for (let j = 1; j <= b.length; j++) {
      const v = Math.min(
        prec[j] + 1,
        cour[j - 1] + 1,
        prec[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1),
      );
      cour.push(v);
      mini = Math.min(mini, v);
    }
    if (mini > max) return max + 1;
    prec = cour;
  }
  return prec[b.length];
}

const prefixeCommun = (a: string, b: string) => {
  let i = 0;
  while (i < a.length && i < b.length && a[i] === b[i]) i++;
  return i;
};

/**
 * Jusqu'à `max` lignes proches d'une requête sans résultat : même préfixe de code d'abord (au moins
 * la moitié de la clé tapée, 2 caractères au moins), du plus long au plus court, puis une clé à
 * 2 modifications au plus. Ordre du HTML à égalité.
 */
export function suggestions<L extends LigneHub>(
  lignes: readonly L[],
  q: string,
  { max = 3, variantes }: { max?: number } & OptionsRecherche = {},
): L[] {
  const cles = [...new Set([q, ...(variantes?.(q) ?? [])].map(cleCode).filter(Boolean))];
  if (!cles.length) return [];
  const parPrefixe = lignes
    .map((l, rang) => {
      const p = Math.max(0, ...cles.flatMap((k) => l.cles.map((c) => prefixeCommun(k, c))));
      const min = Math.max(2, ...cles.map((k) => Math.ceil(k.length / 2)));
      return { l, p, rang, ok: p >= min };
    })
    .filter((x) => x.ok)
    .sort((a, b) => b.p - a.p || a.rang - b.rang)
    .map((x) => x.l);
  const proches = lignes.filter(
    (l) =>
      !parPrefixe.includes(l) &&
      cles.some((k) => k.length >= 3 && l.cles.some((c) => distanceEdition(k, c, 2) <= 2)),
  );
  return [...parPrefixe, ...proches].slice(0, max);
}

/** Une suggestion de l'état vide : le lien de la page, sinon l'ancre de la ligne dans le hub. */
export type SuggestionVide = { chemin?: string; ancre?: string; code?: string; titre: string };

export const versSuggestion = (l: LigneHub): SuggestionVide => ({
  chemin: l.chemin,
  ancre: l.chemin ? undefined : l.id,
  code: l.code,
  titre: l.titre,
});

/** Lien de repli sans JavaScript (pastilles de filtre) : le chemin du hub et ses paramètres non vides. */
export function hrefHub(chemin: string, q: string, filtres: Filtres = {}): string {
  const params = new URLSearchParams();
  if (q.trim()) params.set("q", q.trim());
  for (const [f, v] of Object.entries(filtres)) if (v) params.set(f, v);
  const s = params.toString();
  return s ? `${chemin}?${s}` : chemin;
}
