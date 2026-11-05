import { Link } from "@tanstack/react-router";
import { useLanguage } from "@/lib/i18n";
import { verticale } from "@/lib/ressources/verticales";
import type { VerticaleSlug } from "@/lib/ressources/types";
import { LIBELLES } from "@/lib/actualites/textes";

/** Filtre exact : sans cela, « Tous » resterait actif sur chaque métier. */
const ACTIF = { exact: true, includeSearch: true };

/** De vrais liens : le filtre marche sans JavaScript, le serveur rend la liste du métier. */
export function Filtres({ metiers }: { metiers: VerticaleSlug[] }) {
  const { lang } = useLanguage();
  const t = LIBELLES[lang];
  return (
    <nav className="act-filtres" aria-label={t.votreMetier}>
      <span className="act-etiquette">{t.votreMetier}</span>
      <Link
        to="/actualites"
        search={{}}
        resetScroll={false}
        activeOptions={ACTIF}
        className="act-pastille"
      >
        {t.tous}
      </Link>
      {metiers.map((metier) => (
        <Link
          key={metier}
          to="/actualites"
          search={{ metier }}
          resetScroll={false}
          activeOptions={ACTIF}
          className="act-pastille"
        >
          {verticale(metier, lang)?.court ?? metier}
        </Link>
      ))}
    </nav>
  );
}
