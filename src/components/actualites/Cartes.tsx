import { Link } from "@tanstack/react-router";
import { useLanguage, type Lang } from "@/lib/i18n";
import { verticale } from "@/lib/ressources/verticales";
import { LIBELLES, LIBELLES_FORMAT } from "@/lib/actualites/textes";
import type { FicheEdition } from "@/lib/actualites/types";
// Importé ici et non dans la route : la feuille reste dans le morceau de la rubrique,
// sinon toutes les pages du site la chargent.
import "@/actualites.css";

/** Les métiers d'une édition en toutes lettres, dans la langue de l'écran. */
export function metiersEnClair(metiers: FicheEdition["metiers"], lang: Lang) {
  return metiers.map((m) => verticale(m, lang)?.court ?? m).join(", ");
}

/**
 * Une édition : le grand fait d'abord. La grande carte (à la une) ajoute le chapô ;
 * celle d'à côté aussi, pour ne pas laisser un vide en face de la une.
 */
export function Carte({
  fiche,
  taille = "normale",
}: {
  fiche: FicheEdition;
  taille?: "normale" | "cote" | "grande";
}) {
  const { lang } = useLanguage();
  const t = LIBELLES[lang];
  // Le contenu reste en français quand l'interface est en anglais.
  const langueContenu = lang === "fr" ? undefined : "fr";
  return (
    <Link
      to="/actualites/$slug"
      params={{ slug: fiche.slug }}
      className={taille === "normale" ? "act-carte" : `act-carte act-carte-${taille}`}
    >
      <span className="act-carte-haut">
        <span className="act-etiquette">{LIBELLES_FORMAT[lang][fiche.format]}</span>
        <span className="act-etiquette">
          {t.numero}&nbsp;{fiche.numero}
        </span>
      </span>
      <span className="act-fait act-serif" lang={langueContenu}>
        {fiche.fait}
      </span>
      <h2 className="act-carte-titre" lang={langueContenu}>
        {fiche.titre}
      </h2>
      {taille !== "normale" && (
        <span className="act-carte-chapo" lang={langueContenu}>
          {fiche.chapo}
        </span>
      )}
      <span className="act-carte-meta">
        {metiersEnClair(fiche.metiers, lang)} · {fiche.lecture}&nbsp;{t.minutes}
        {fiche.statut === "brouillon" && ` · ${t.brouillon}`}
      </span>
    </Link>
  );
}
