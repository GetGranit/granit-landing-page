import { useId } from "react";
import type { Filtres } from "@/lib/outils/socle/types";
import { nombreFr } from "@/lib/outils/socle/texte.mjs";

export type RechercheOutilProps = {
  /** Chemin du hub : le formulaire GET y envoie `?q=`, et marche sans JavaScript. */
  action: string;
  q: string;
  onChange: (q: string) => void;
  /** Label visible au-dessus du champ (« Code ou libellé du rejet »). */
  libelle: string;
  /** « 0450054, bénéficiaire inconnu… » */
  placeholder: string;
  /** Une ligne sous le champ (« Avec ou sans espaces, avec ou sans le 0 du début. »). */
  aide?: string;
  inputMode?: "text" | "search";
  /** Nombre de lignes du hub ; sans `total`, pas de compteur (page introuvable). */
  total?: number;
  visibles?: number;
  /** [singulier, pluriel] : « 29 codes », « 3 sur 29 ». */
  unite: [string, string];
  /** Filtres posés : renvoyés tels quels par le formulaire sans JavaScript. */
  filtres?: Filtres;
  /** Avec JavaScript, la touche Entrée ne recharge pas la page : ceci est appelé (défiler jusqu'aux résultats). */
  onSoumettre?: () => void;
};

/**
 * Champ de recherche d'un hub. Avec JavaScript, chaque frappe filtre aussitôt (onChange) ; sans
 * JavaScript, le formulaire GET recharge le hub filtré par le serveur.
 */
export function RechercheOutil({
  action,
  q,
  onChange,
  libelle,
  placeholder,
  aide,
  inputMode = "search",
  total,
  visibles,
  unite,
  filtres = {},
  onSoumettre,
}: RechercheOutilProps) {
  const id = useId();
  const compteur =
    total === undefined
      ? undefined
      : visibles !== undefined && visibles < total
        ? `${nombreFr(visibles)} sur ${nombreFr(total)}`
        : `${nombreFr(total)} ${total > 1 ? unite[1] : unite[0]}`;
  return (
    <form
      role="search"
      method="get"
      action={action}
      onSubmit={(e) => {
        // Avec JavaScript, la liste est déjà filtrée : pas de rechargement, le clavier se ferme.
        e.preventDefault();
        (document.activeElement as HTMLElement | null)?.blur?.();
        onSoumettre?.();
      }}
    >
      <label htmlFor={`${id}-q`} className="block text-[14px]" style={{ fontWeight: 500 }}>
        {libelle}
      </label>
      <div className="mt-2 flex gap-2">
        <input
          id={`${id}-q`}
          type="search"
          name="q"
          value={q}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete="off"
          enterKeyHint="search"
          spellCheck={false}
          inputMode={inputMode}
          aria-describedby={
            [compteur !== undefined && `${id}-compte`, aide && `${id}-aide`]
              .filter(Boolean)
              .join(" ") || undefined
          }
          className="h-12 min-w-0 flex-1 rounded-[8px] bg-papier px-4 text-[16px] outline-none transition-colors placeholder:text-texte-secondaire focus:border-[color:var(--profond)] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--profond)]"
          style={{ border: "1px solid var(--filet-champ)", color: "var(--encre)" }}
        />
        <button
          type="submit"
          className="btn-primary h-12 w-[104px] shrink-0 justify-center"
          style={{ fontSize: 15 }}
        >
          Chercher
        </button>
      </div>
      {Object.entries(filtres).map(([f, v]) =>
        v ? <input key={f} type="hidden" name={f} value={v} /> : null,
      )}
      {aide && (
        <p
          id={`${id}-aide`}
          className="mt-2 text-[14px]"
          style={{ color: "var(--texte-secondaire)" }}
        >
          {aide}
        </p>
      )}
      {compteur !== undefined && (
        <p
          id={`${id}-compte`}
          className="num-tabular mt-2 text-[14px]"
          aria-live="polite"
          style={{ fontWeight: 500 }}
        >
          {compteur}
        </p>
      )}
    </form>
  );
}
