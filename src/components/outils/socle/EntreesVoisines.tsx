import { Link } from "@tanstack/react-router";
import { EVENEMENTS, marquerDepuis, type Suivre } from "@/lib/outils/socle/suivi";
import { TitreSection } from "./Mise";

export type EntreeVoisine = { chemin: string; code?: string; titre: string; resume?: string };

export type EntreesVoisinesProps = {
  /** « Codes voisins », « Même opérateur »… */
  titre: string;
  /** Slug de la page courante (propriété `de` de lm_voisin_clic). */
  de: string;
  /** 3 à 6 : voisins déclarés et publiés d'abord, puis pages publiées du même groupe. */
  entrees: EntreeVoisine[];
  suivre: Suivre;
  id?: string;
};

/** Liens vers les entrées voisines, en cartes : une par ligne à 375 px, deux colonnes dès 768 px. */
export function EntreesVoisines({
  titre,
  de,
  entrees,
  suivre,
  id = "voisins",
}: EntreesVoisinesProps) {
  if (!entrees.length) return null;
  return (
    <section aria-labelledby={id} className="mt-12">
      <TitreSection id={id}>{titre}</TitreSection>
      <ul className="mt-4 grid gap-3 md:grid-cols-2">
        {entrees.map((e) => (
          <li key={e.chemin} className="min-w-0">
            <Link
              to={e.chemin}
              className="card-hover flex min-h-[48px] items-start justify-between gap-3 rounded-[14px] bg-papier p-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--profond)]"
              style={{ border: "1px solid var(--filet)" }}
              onClick={() => {
                marquerDepuis("voisin");
                suivre(EVENEMENTS.voisinClic, { de, vers: e.chemin, bloc: "voisins" });
              }}
            >
              <span className="min-w-0 break-words">
                {e.code && (
                  <span
                    className="num-tabular block text-[14px]"
                    style={{ color: "var(--texte-secondaire)" }}
                  >
                    {e.code}
                  </span>
                )}
                <span className="block text-[16px]" style={{ fontWeight: 500, lineHeight: 1.35 }}>
                  {e.titre}
                </span>
                {e.resume && (
                  <span
                    className="mt-1 block text-[14px]"
                    style={{ color: "var(--texte-secondaire)" }}
                  >
                    {e.resume}
                  </span>
                )}
              </span>
              <span
                aria-hidden
                className="shrink-0 text-[18px]"
                style={{ color: "var(--profond)" }}
              >
                ›
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
