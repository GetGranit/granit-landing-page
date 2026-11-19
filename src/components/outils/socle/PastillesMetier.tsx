import { IDS_METIERS, metierOutil } from "@/lib/outils/socle/metiers.mjs";
import type { MetierOutil } from "@/lib/outils/socle/types";

/**
 * Pastilles des métiers concernés (libellés courts). Les 5 métiers : une seule pastille
 * « Tous les métiers ».
 */
export function PastillesMetier({
  metiers,
  className = "",
}: {
  metiers?: readonly MetierOutil[];
  className?: string;
}) {
  const uniques = IDS_METIERS.filter((id) => metiers?.includes(id));
  if (!uniques.length) return null;
  const libelles =
    uniques.length === IDS_METIERS.length
      ? ["Tous les métiers"]
      : uniques.map((id) => metierOutil(id)?.court ?? id);
  return (
    <ul className={`flex flex-wrap gap-2 ${className}`} aria-label="Métiers concernés">
      {libelles.map((l) => (
        <li
          key={l}
          className="rounded-[8px] bg-papier px-2.5 py-1 text-[13px]"
          style={{ border: "1px solid var(--filet)", lineHeight: 1.4 }}
        >
          {l}
        </li>
      ))}
    </ul>
  );
}
