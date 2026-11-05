import { useLanguage } from "@/lib/i18n";
import { ORDRE_VERTICALES } from "@/lib/ressources/verticales";
import type { VerticaleSlug } from "@/lib/ressources/types";
import { NEWSLETTER_OUVERTE } from "@/lib/actualites/marque";
import { metiersPresents, repartir } from "@/lib/actualites/rangement";
import { LIBELLES } from "@/lib/actualites/textes";
import type { FicheEdition } from "@/lib/actualites/types";
import { Abonnement } from "./Abonnement";
import { Carte } from "./Cartes";
import { Filtres } from "./Filtres";
import { Manchette } from "./Manchette";
import { NouvellesGranit } from "./NouvellesGranit";
import { Releve } from "./Releve";

/** La page /actualites. La répartition vient de repartir() : une colonne de moins si rien ne la remplit. */
export function Rubrique({ fiches, metier }: { fiches: FicheEdition[]; metier?: VerticaleSlug }) {
  const { lang } = useLanguage();
  const { une, cote, releve, grille } = repartir(fiches, metier);
  const adroite = releve ? <Releve fiche={releve} /> : cote && <Carte fiche={cote} taille="cote" />;
  const haut = une ?? (metier ? null : releve);
  const metiers = metiersPresents(fiches, ORDRE_VERTICALES);
  return (
    <div className="act">
      <Manchette derniere={fiches[0]} />
      <div className="act-cadre">
        <Filtres metiers={metiers} />
        {haut && (
          <div className={une && adroite ? "act-une" : "act-une act-une-seule"}>
            {une ? <Carte fiche={une} taille="grande" /> : null}
            {adroite}
          </div>
        )}
        {grille.length > 0 ? (
          <div className="act-grille">
            {grille.map((fiche) => (
              <Carte key={fiche.slug} fiche={fiche} />
            ))}
          </div>
        ) : (
          metier && <p className="act-vide">{LIBELLES[lang].aucuneEdition}</p>
        )}
        <div className={NEWSLETTER_OUVERTE ? "act-bas" : "act-bas act-bas-seul"}>
          <NouvellesGranit />
          <Abonnement />
        </div>
      </div>
    </div>
  );
}
