import { Link } from "@tanstack/react-router";
import { Fil } from "@/components/ressources/Fil";
import { calcomDemoUrl } from "@/lib/calcom";
import { useLanguage } from "@/lib/i18n";
import { fiches } from "@/lib/actualites/contenu";
import { NOM_RUBRIQUE } from "@/lib/actualites/marque";
import { tempsLecture } from "@/lib/actualites/rangement";
import {
  dateLongue,
  finDe,
  LIBELLES,
  LIBELLES_FORMAT,
  SUITE_FIN,
} from "@/lib/actualites/textes";
import type { Edition } from "@/lib/actualites/types";
import { metiersEnClair } from "./Cartes";

/** Le gabarit fixe d'une édition : tête encre, quatre blocs, sources, encart, colonne latérale. */
export function PageEdition({ edition: e }: { edition: Edition }) {
  const { lang } = useLanguage();
  const t = LIBELLES[lang];
  const metiers = metiersEnClair(e.metiers, lang);
  const format = LIBELLES_FORMAT[lang][e.format];
  // Le contenu reste en français quand l'interface est en anglais.
  const langueContenu = lang === "fr" ? undefined : "fr";
  const autres = fiches.filter((f) => f.slug !== e.slug);
  const tableau = e.qui.tableau;
  return (
    <div className="act">
      <div className="act-tete act-sombre">
        <div className="act-cadre">
          <Fil
            items={[
              { nom: t.rubrique, to: "/actualites" },
              { nom: `${t.numero} ${e.numero}` },
            ]}
          />
          <div className="act-folio">
            <span>
              {NOM_RUBRIQUE} · {t.numero}&nbsp;{e.numero}
            </span>
            <span>{format}</span>
            <span>{metiers}</span>
            <time dateTime={e.datePublished}>{dateLongue(e.datePublished, lang)}</time>
            {e.statut === "brouillon" && <span>{t.brouillon}</span>}
          </div>
          <p className="act-fait act-serif" lang={langueContenu}>
            {e.fait}
          </p>
          <h1 lang={langueContenu}>{e.titre}</h1>
          <p className="act-chapo" lang={langueContenu}>
            {e.chapo}
          </p>
        </div>
      </div>

      <div className="act-cadre act-corps">
        <article className="act-article act-texte">
          <section>
            <h2>{t.change}</h2>
            <div lang={langueContenu}>
              {e.change.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </section>

          <section>
            <h2>{t.qui}</h2>
            <p lang={langueContenu}>{e.qui.texte}</p>
            {tableau && (
              <div className="act-tableau" tabIndex={0} role="region" aria-label={t.qui}>
                <table lang={langueContenu}>
                  <thead>
                    <tr>
                      {tableau.entetes.map((c, i) => (
                        <th key={i} scope="col">
                          {c}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {tableau.lignes.map((ligne, i) => (
                      <tr key={i}>
                        {ligne.map((c, j) => (
                          <td key={j}>{c}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          <section>
            <h2>{t.gestes}</h2>
            <ol className="act-gestes" lang={langueContenu}>
              {e.gestes.map((g, i) => (
                <li key={i}>
                  <span>{g}</span>
                </li>
              ))}
            </ol>
          </section>

          <section className="act-inconnu">
            <h2>{t.inconnu}</h2>
            <div lang={langueContenu}>
              {e.inconnu.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </section>

          <section className="act-sources">
            <h2>{t.sources}</h2>
            <ul lang={langueContenu}>
              {e.sources.map((s) => (
                <li key={s.url}>
                  <a href={s.url} target="_blank" rel="noopener">
                    {s.libelle}
                  </a>
                </li>
              ))}
            </ul>
          </section>

          {/* La signature affirme une relecture : elle n'existe qu'avec un relecteur. */}
          {e.relecteur && <p className="act-signature">{t.signature}</p>}

          <aside className="act-encre act-sombre act-encart">
            <h2>
              {finDe(e.metiers, lang)} <span>{SUITE_FIN[lang]}</span>
            </h2>
            <a
              href={calcomDemoUrl("actualites", e.slug)}
              target="_blank"
              rel="noopener"
              className="btn-clair"
            >
              {t.demo}
            </a>
          </aside>
        </article>

        <aside className="act-cote">
          <dl>
            <dt>{t.metier}</dt>
            <dd>{metiers}</dd>
            <dt>{t.lecture}</dt>
            <dd>
              {tempsLecture(e)}&nbsp;{t.minutes}
            </dd>
            <dt>{t.relu}</dt>
            <dd>
              {e.relecteur
                ? `${e.relecteur.nom}, ${dateLongue(e.relecteur.date, lang)}`
                : t.relecturePrevue}
            </dd>
          </dl>
          {autres.length > 0 && (
            <nav className="act-autres act-texte" aria-label={t.autresEditions}>
              <span className="act-etiquette">{t.autresEditions}</span>
              {autres.map((f) => (
                <Link key={f.slug} to="/actualites/$slug" params={{ slug: f.slug }}>
                  {t.numero}&nbsp;{f.numero} · {LIBELLES_FORMAT[lang][f.format]}
                </Link>
              ))}
            </nav>
          )}
        </aside>
      </div>
    </div>
  );
}
