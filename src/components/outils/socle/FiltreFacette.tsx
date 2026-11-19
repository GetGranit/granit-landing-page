import { METIERS_OUTILS } from "@/lib/outils/socle/metiers.mjs";
import type { LigneHub } from "@/lib/outils/socle/types";
import { nombreFr } from "@/lib/outils/socle/texte.mjs";

export type OptionFacette = { valeur: string; libelle: string; compte?: number };

export type FiltreFacetteProps = {
  /** Nom de la facette (`metier`, `operateur`…) : paramètre d'URL et propriété `facette` de lm_filtre. */
  id: string;
  libelle: string;
  options: OptionFacette[];
  valeur: string | null;
  onChange: (v: string | null) => void;
  /** Lien de repli sans JavaScript (`?metier=dentaire`). Jamais suivi par Google (nofollow). */
  hrefPour: (v: string | null) => string;
  /** Libellé de l'option « Tous » (« Tous les opérateurs »). */
  tous?: string;
};

const MAX_PASTILLES = 6;

/**
 * Filtre d'un hub. Jusqu'à 6 options : des pastilles (liens nofollow, clic intercepté en JavaScript),
 * qui passent à la ligne à 375 px ; au-delà : un <select> (formulaire GET, bouton sans JavaScript).
 */
export function FiltreFacette({
  id,
  libelle,
  options,
  valeur,
  onChange,
  hrefPour,
  tous = "Tous",
}: FiltreFacetteProps) {
  if (!options.length) return null;
  if (options.length > MAX_PASTILLES) {
    // Sans JavaScript : le formulaire renvoie les autres paramètres du lien « Tous ».
    const base = new URL(hrefPour(null), "https://exemple.invalid");
    const caches = [...base.searchParams].filter(([k]) => k !== id);
    return (
      <form
        method="get"
        action={base.pathname}
        className="mt-4"
        onSubmit={(e) => e.preventDefault()}
      >
        <label
          className="flex flex-col gap-1.5 text-[14px] md:flex-row md:items-center md:gap-3"
          style={{ fontWeight: 500 }}
        >
          {libelle}
          <select
            name={id}
            value={valeur ?? ""}
            onChange={(e) => onChange(e.target.value || null)}
            className="h-12 min-w-0 rounded-[8px] bg-papier px-3 text-[16px] md:min-w-[280px]"
            style={{
              border: "1px solid var(--filet-champ)",
              color: "var(--encre)",
              fontWeight: 400,
            }}
          >
            <option value="">{tous}</option>
            {options.map((o) => (
              <option key={o.valeur} value={o.valeur}>
                {o.libelle}
                {o.compte !== undefined ? ` (${nombreFr(o.compte)})` : ""}
              </option>
            ))}
          </select>
        </label>
        {caches.map(([k, v]) => (
          <input key={k} type="hidden" name={k} value={v} />
        ))}
        <noscript>
          <button type="submit" className="btn-secondaire mt-2">
            Filtrer
          </button>
        </noscript>
      </form>
    );
  }
  const pastille = (v: string | null, texte: string, compte?: number) => {
    const actif = valeur === v;
    return (
      <li key={v ?? ""}>
        <a
          href={hrefPour(v)}
          rel="nofollow"
          aria-current={actif ? "true" : undefined}
          onClick={(e) => {
            e.preventDefault();
            if (!actif) onChange(v);
          }}
          className="inline-flex min-h-[44px] items-center gap-1.5 rounded-full px-4 text-[14px] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--profond)]"
          style={
            actif
              ? {
                  background: "var(--encre)",
                  color: "var(--menthe)",
                  border: "1px solid var(--encre)",
                  fontWeight: 500,
                }
              : {
                  background: "var(--papier)",
                  color: "var(--encre)",
                  border: "1px solid var(--filet-champ)",
                }
          }
        >
          {texte}
          {compte !== undefined && (
            <span className="num-tabular text-[13px]" style={{ opacity: 0.75 }}>
              {nombreFr(compte)}
            </span>
          )}
        </a>
      </li>
    );
  };
  return (
    <div className="mt-4">
      <p className="text-[14px]" style={{ fontWeight: 500 }} id={`filtre-${id}`}>
        {libelle}
      </p>
      <ul className="mt-2 flex flex-wrap gap-2" aria-labelledby={`filtre-${id}`}>
        {pastille(null, tous)}
        {options.map((o) => pastille(o.valeur, o.libelle, o.compte))}
      </ul>
    </div>
  );
}

/**
 * Le filtre par métier : FiltreFacette réglé sur les 5 métiers du site (libellés courts). Les
 * métiers sans aucune ligne sont masqués ; avec moins de deux métiers, pas de filtre.
 */
export function FiltreMetier({
  lignes,
  libelle = "Métier",
  ...props
}: Omit<FiltreFacetteProps, "id" | "options" | "libelle"> & {
  lignes: readonly LigneHub[];
  libelle?: string;
}) {
  const options = METIERS_OUTILS.map((m) => ({
    valeur: m.id,
    libelle: m.court,
    compte: lignes.filter((l) => l.facettes.metier?.includes(m.id)).length,
  })).filter((o) => o.compte > 0);
  if (options.length < 2) return null;
  return <FiltreFacette id="metier" libelle={libelle} options={options} {...props} />;
}
