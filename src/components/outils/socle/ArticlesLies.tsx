import { Link } from "@tanstack/react-router";
import { outilDisponible } from "@/lib/outils/socle/outils";
import { articleEnLigne } from "@/lib/outils/socle/site";
import { EVENEMENTS, marquerDepuis, type Suivre } from "@/lib/outils/socle/suivi";
import type { OutilId } from "@/lib/outils/socle/types";
import { TitreSection } from "./Mise";

export type LienOutilProps = {
  id: OutilId;
  /** « Rejet de la part mutuelle : trouver le portail de la complémentaire » */
  texte: string;
  /** Ancre sur le hub de l'autre outil (jamais une recherche `?q=`). */
  ancre?: string;
  suivre?: Suivre;
  /** Slug de la page courante, pour lm_voisin_clic. */
  de?: string;
};

/** Lien vers le hub d'un autre outil ; ne rend rien tant que cet outil n'est pas fusionné. */
export function LienOutil({ id, texte, ancre, suivre, de }: LienOutilProps) {
  const outil = outilDisponible(id);
  if (!outil) return null;
  return (
    <Link
      to={outil.chemin}
      hash={ancre?.replace(/^#/, "")}
      className="card-hover flex min-h-[48px] items-start justify-between gap-3 rounded-[14px] bg-papier p-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--profond)]"
      style={{ border: "1px solid var(--filet)" }}
      onClick={() => {
        marquerDepuis("autre-outil");
        suivre?.(EVENEMENTS.voisinClic, { de, vers: outil.chemin, bloc: "autre-outil" });
      }}
    >
      <span className="min-w-0 break-words">
        <span className="eyebrow block">Outil gratuit · {outil.nom}</span>
        <span className="mt-1 block text-[16px]" style={{ fontWeight: 500, lineHeight: 1.35 }}>
          {texte}
        </span>
      </span>
      <span aria-hidden className="shrink-0 text-[18px]" style={{ color: "var(--profond)" }}>
        ›
      </span>
    </Link>
  );
}

/**
 * « Pour aller plus loin » : 1 à 3 articles /ressources en ligne (un slug absent, en aperçu ou
 * remplacé n'est pas rendu, et fait échouer le test commun), plus au plus 2 liens vers les autres
 * outils (qui n'apparaissent qu'une fois ces outils fusionnés).
 */
export function ArticlesLies({
  slugs,
  titre = "Pour aller plus loin",
  outils = [],
  suivre,
  de,
  id = "articles-lies",
}: {
  slugs: string[];
  titre?: string;
  outils?: LienOutilProps[];
  suivre?: Suivre;
  de?: string;
  id?: string;
}) {
  const articles = slugs
    .map(articleEnLigne)
    .filter((a) => a !== undefined)
    .slice(0, 3);
  const liens = outils.filter((o) => outilDisponible(o.id)).slice(0, 2);
  if (!articles.length && !liens.length) return null;
  return (
    <section aria-labelledby={id} className="mt-12">
      <TitreSection id={id}>{titre}</TitreSection>
      <ul className="mt-4 grid gap-3 md:grid-cols-2">
        {articles.map((a) => (
          <li key={a.slug} className="min-w-0">
            <Link
              to="/ressources/$slug"
              params={{ slug: a.slug }}
              className="card-hover flex min-h-[48px] items-start justify-between gap-3 rounded-[14px] bg-papier p-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--profond)]"
              style={{ border: "1px solid var(--filet)" }}
              onClick={() => {
                marquerDepuis("article");
                suivre?.(EVENEMENTS.voisinClic, {
                  de,
                  vers: `/ressources/${a.slug}`,
                  bloc: "articles",
                });
              }}
            >
              <span className="min-w-0 break-words">
                <span className="eyebrow block">Ressources</span>
                <span
                  className="mt-1 block text-[16px]"
                  style={{ fontWeight: 500, lineHeight: 1.35 }}
                >
                  {a.titre}
                </span>
                {a.description && (
                  <span
                    className="mt-1 line-clamp-2 text-[14px]"
                    style={{ color: "var(--texte-secondaire)" }}
                  >
                    {a.description}
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
        {liens.map((o) => (
          <li key={o.id} className="min-w-0">
            <LienOutil {...o} suivre={o.suivre ?? suivre} de={o.de ?? de} />
          </li>
        ))}
      </ul>
    </section>
  );
}
