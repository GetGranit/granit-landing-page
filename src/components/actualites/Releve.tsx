import { Link } from "@tanstack/react-router";
import { useLanguage } from "@/lib/i18n";
import { LIBELLES, moisAnnee } from "@/lib/actualites/textes";
import type { FicheEdition } from "@/lib/actualites/types";

/** Le bloc du relevé : ses chiffres viennent de l'édition, jamais du code. Mène à sa page. */
export function Releve({ fiche }: { fiche: FicheEdition }) {
  const { lang } = useLanguage();
  const t = LIBELLES[lang];
  return (
    <Link
      to="/actualites/$slug"
      params={{ slug: fiche.slug }}
      className="act-encre act-sombre act-releve"
    >
      <span>
        <span className="act-etiquette">
          {t.releve} · {moisAnnee(fiche.datePublished, lang)}
        </span>
        <h2 className="act-releve-titre">{t.releveTitre}</h2>
      </span>
      {(fiche.chiffres ?? []).map((c) => (
        <span className="act-chiffre" key={c.libelle}>
          <b className="act-serif">{c.valeur}</b>
          <span>{c.libelle}</span>
        </span>
      ))}
    </Link>
  );
}
