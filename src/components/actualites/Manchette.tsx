import { SymboleGalets } from "@/components/agents/SymboleGalets";
import { useLanguage } from "@/lib/i18n";
import { decouperNom, RYTHME, SOUS_TITRE } from "@/lib/actualites/marque";
import { LIBELLES, moisAnnee } from "@/lib/actualites/textes";
import type { FicheEdition } from "@/lib/actualites/types";

/** La bande encre de la rubrique : folio, nom, sous-titre et l'unique filigrane de la page. */
export function Manchette({ derniere }: { derniere?: FicheEdition }) {
  const { lang } = useLanguage();
  const t = LIBELLES[lang];
  const { debut, accent } = decouperNom();
  return (
    <div className="act-manchette act-sombre">
      <div className="act-filigrane" aria-hidden>
        <SymboleGalets />
      </div>
      <div className="act-cadre">
        <div className="act-folio">
          {derniere && (
            <span>
              {t.edition} {t.numero}&nbsp;{derniere.numero}
            </span>
          )}
          {derniere && <span>{moisAnnee(derniere.datePublished, lang)}</span>}
          <span>{RYTHME[lang]}</span>
        </div>
        <h1 className="act-titre-rubrique">
          {debut} <span>{accent}</span>
        </h1>
        <p className="act-sous-rubrique act-serif">{SOUS_TITRE[lang]}</p>
      </div>
    </div>
  );
}
