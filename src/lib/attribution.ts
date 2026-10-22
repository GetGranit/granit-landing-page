/**
 * Retient d'où vient un visiteur (paramètres utm_* du lien d'arrivée) pour
 * l'envoyer avec le formulaire : un lead venu du post d'un apporteur
 * (…?utm_medium=partenaire&utm_campaign=jerome-alsfasser) reste rattaché
 * à lui même s'il revient plus tard sur le site sans le lien.
 *
 * Dernier lien tracké gagnant, gardé 30 jours dans le navigateur.
 *
 * `ref` = identifiant de la fiche Attio du destinataire (liens de prospection,
 * test 3 messages) : il relie un clic à une personne même sans formulaire.
 * L'outil PEC l'appelle `p` : on accepte les deux.
 */
const KEY = "granit_attribution";
const MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000;
const PARAMS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "ref"] as const;
const ALIAS: Partial<Record<(typeof PARAMS)[number], string>> = { ref: "p" };

type Stored = { value: string; at: number };

/** À appeler à chaque arrivée sur une page : mémorise les utm_* s'il y en a. */
export function rememberAttribution(): void {
  if (typeof window === "undefined") return;
  try {
    const q = new URLSearchParams(window.location.search);
    const parts = PARAMS.map((p) => {
      const v = q.get(p) ?? (ALIAS[p] ? q.get(ALIAS[p]!) : null) ?? "";
      return `${p}=${encodeURIComponent(v.trim().slice(0, 80))}`;
    }).filter((s) => !s.endsWith("="));
    if (!parts.length) return;
    const stored: Stored = { value: parts.join("&"), at: Date.now() };
    window.localStorage.setItem(KEY, JSON.stringify(stored));
  } catch {
    // Stockage bloqué (navigation privée, cookies refusés) : on perd juste l'attribution.
  }
}

/** Les paramètres mémorisés sous forme d'objet ({ utm_source: "linkedin", ref: "…" }), ou {}. */
export function getAttributionParams(): Record<string, string> {
  return Object.fromEntries(new URLSearchParams(getAttribution()));
}

/** Les utm_* mémorisées (« utm_source=linkedin&utm_medium=partenaire&… »), ou "". */
export function getAttribution(): string {
  if (typeof window === "undefined") return "";
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return "";
    const stored = JSON.parse(raw) as Stored;
    if (!stored?.value || Date.now() - stored.at > MAX_AGE_MS) return "";
    return stored.value;
  } catch {
    return "";
  }
}
