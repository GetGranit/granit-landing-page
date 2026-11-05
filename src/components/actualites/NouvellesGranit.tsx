import { Link } from "@tanstack/react-router";
import { useLanguage } from "@/lib/i18n";
import { NOUVELLES } from "@/lib/actualites/nouvelles";
import { LIBELLES, moisAnnee } from "@/lib/actualites/textes";

export function NouvellesGranit() {
  const { lang } = useLanguage();
  return (
    <section className="act-nouvelles act-texte">
      <h2>{LIBELLES[lang].nouvellesGranit}</h2>
      <ul>
        {NOUVELLES.map((n) => {
          const { lien, suite } = n.texte[lang];
          return (
            <li key={n.lien}>
              <time dateTime={n.date.slice(0, 7)}>{moisAnnee(n.date, lang)}</time>
              <span>
                {n.lien.startsWith("/") ? (
                  <Link to={n.lien}>{lien}</Link>
                ) : (
                  <a href={n.lien} target="_blank" rel="noopener">
                    {lien}
                  </a>
                )}
                {suite}
              </span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
