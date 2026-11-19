import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { SuiviOutil } from "@/components/outils/OutilShared";
import { filtrerLignes, hrefHub, type OptionsRecherche } from "@/lib/outils/socle/recherche";
import { EVENEMENTS } from "@/lib/outils/socle/suivi";
import type { Filtres, LigneHub } from "@/lib/outils/socle/types";

/** L'URL suit la saisie 300 ms après la dernière frappe (replaceState : le loader ne repart pas). */
const DELAI_URL = 300;

/**
 * L'état de la recherche d'un hub : la requête et les filtres, partis de l'URL (`?q=`, `?metier=`…
 * lus par validateSearch, donc déjà appliqués au rendu serveur), le résultat du filtre, l'URL tenue à
 * jour, et le suivi (lm_recherche, lm_filtre). À brancher sur RechercheOutil, FiltreFacette et
 * ListeHub :
 *
 *   const suivi = useSuiviOutil("codes-rejet", { page: "hub" });
 *   const hub = useRechercheHub({ lignes, chemin: OUTIL.chemin, q, filtres: { metier }, suivi });
 *   <RechercheOutil q={hub.q} onChange={hub.setQ} total={hub.total} visibles={hub.visibles} … />
 *   <FiltreMetier lignes={lignes} valeur={hub.filtres.metier} onChange={(v) => hub.setFiltre("metier", v)}
 *                 hrefPour={hub.hrefPour("metier")} />
 *   <ListeHub lignes={lignes} q={hub.q} filtres={hub.filtres} … />
 */
export function useRechercheHub<L extends LigneHub>({
  lignes,
  chemin,
  q: qInitial = "",
  filtres: filtresInitiaux = {},
  suivi,
  variantes,
}: {
  lignes: readonly L[];
  /** Chemin du hub (OUTIL.chemin). */
  chemin: string;
  q?: string;
  filtres?: Filtres;
  suivi: Pick<SuiviOutil, "suivre" | "rechercher">;
} & OptionsRecherche) {
  const [q, setQEtat] = useState(qInitial);
  const [filtres, setFiltres] = useState<Filtres>(filtresInitiaux);
  const resultat = useMemo(
    () => filtrerLignes(lignes, q, filtres, { variantes }),
    [lignes, q, filtres, variantes],
  );

  // L'URL suit, sans relancer le loader ; l'ancre éventuelle est gardée.
  const premiere = useRef(true);
  useEffect(() => {
    if (premiere.current) {
      premiere.current = false;
      return;
    }
    const t = setTimeout(() => {
      try {
        window.history.replaceState(
          window.history.state,
          "",
          hrefHub(chemin, q, filtres) + window.location.hash,
        );
      } catch {
        // navigateur qui refuse replaceState : l'URL ne suit pas, la page marche quand même
      }
    }, DELAI_URL);
    return () => clearTimeout(t);
  }, [chemin, q, filtres]);

  // Arrivée avec ?q= : une recherche « url », envoyée tout de suite.
  const { rechercher, suivre } = suivi;
  useEffect(() => {
    if (!qInitial.trim()) return;
    const r = filtrerLignes(lignes, qInitial, filtresInitiaux, { variantes });
    rechercher(
      qInitial,
      { visibles: r.visibles.length, exact: r.exact, filtres: filtresInitiaux },
      "url",
    );
    // une seule fois, au chargement
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setQ = useCallback(
    (v: string) => {
      setQEtat(v);
      const r = filtrerLignes(lignes, v, filtres, { variantes });
      rechercher(v, { visibles: r.visibles.length, exact: r.exact, filtres });
    },
    [lignes, filtres, variantes, rechercher],
  );

  const setFiltre = useCallback(
    (facette: string, valeur: string | null) => {
      const suivants = { ...filtres, [facette]: valeur };
      setFiltres(suivants);
      const r = filtrerLignes(lignes, q, suivants, { variantes });
      suivre(EVENEMENTS.filtre, { facette, valeur, nb_resultats: r.visibles.length });
    },
    [filtres, lignes, q, variantes, suivre],
  );

  /** « Effacer la recherche » : la requête seulement, les filtres restent. */
  const effacer = useCallback(() => setQEtat(""), []);

  /** Lien de repli sans JavaScript d'une pastille : la requête et les autres filtres gardés. */
  const hrefPour = useCallback(
    (facette: string) => (valeur: string | null) =>
      hrefHub(chemin, q, { ...filtres, [facette]: valeur }),
    [chemin, q, filtres],
  );

  return {
    q,
    setQ,
    filtres,
    setFiltre,
    effacer,
    hrefPour,
    /** Lignes visibles, dans l'ordre du HTML. */
    resultat,
    total: lignes.length,
    visibles: resultat.visibles.length,
  };
}
