import { useEffect, useMemo, useRef, type ReactNode, type RefObject } from "react";
import { Link } from "@tanstack/react-router";
import {
  filtrerLignes,
  rechercheActive,
  type OptionsRecherche,
} from "@/lib/outils/socle/recherche";
import { EVENEMENTS, lireDepuis, marquerDepuis, type Suivre } from "@/lib/outils/socle/suivi";
import type { Filtres, GroupeHub, LigneHub } from "@/lib/outils/socle/types";
import { TitreSection } from "./Mise";
import { nombreFr } from "@/lib/outils/socle/texte.mjs";

export type ListeHubProps<L extends LigneHub> = {
  lignes: L[];
  groupes: GroupeHub[];
  q: string;
  filtres: Filtres;
  /** Autres formes de la requête (A : « 450054 » → « 0450054 »). */
  variantes?: OptionsRecherche["variantes"];
  /** Corps d'une ligne sans page (<details>), rendu par le serveur : indexé avec le hub. */
  rendreDetails?: (l: L) => ReactNode;
  /** Résumé d'une ligne, s'il dépend des filtres (C : seulement le métier filtré) ; défaut : `resume`. */
  rendreResume?: (l: L) => ReactNode;
  /** B : sans recherche ni filtre, chaque groupe est replié (titre, résumé, nombre de lignes, lien). */
  replier?: boolean;
  /** L'état vide de l'outil (EtatVide). */
  vide: (q: string) => ReactNode;
  suivre: Suivre;
  /** Le `resultat` de useSuiviOutil : lm_resultat_vu quand la liste entre à moitié dans l'écran. */
  refResultat?: RefObject<HTMLDivElement | null>;
  /** [singulier, pluriel] pour « 30 codes » d'un groupe replié. */
  unite?: [string, string];
  /** Sommaire d'ancres des groupes (s'il y en a 2 ou plus). */
  sommaire?: boolean;
};

const GRILLE =
  "md:grid md:grid-cols-[minmax(96px,140px)_minmax(0,1.2fr)_minmax(0,1fr)_20px] md:items-center md:gap-4";

function Contenu({ l, resume }: { l: LigneHub; resume: ReactNode }) {
  return (
    <>
      <span
        className="num-tabular block text-[14px] md:text-[15px]"
        style={{ color: "var(--texte-secondaire)" }}
      >
        {l.code ?? ""}
      </span>
      <span
        className="mt-0.5 line-clamp-2 break-words text-[16px] md:mt-0"
        style={{ fontWeight: 500, lineHeight: 1.35 }}
      >
        {l.titre}
      </span>
      <span
        className="mt-1 block break-words text-[14px] md:mt-0"
        style={{ color: "var(--texte-secondaire)" }}
      >
        {resume}
      </span>
    </>
  );
}

/**
 * La liste d'un hub : toutes les lignes sont dans le HTML serveur ; la recherche et les filtres ne
 * font que poser `hidden` (une ligne filtrée, un groupe sans ligne visible). Une ligne avec page est
 * un lien ; une ligne sans page est un <details> qui s'ouvre sur place. L'ancre `#id` d'une ligne
 * ouvre et montre cette ligne.
 */
export function ListeHub<L extends LigneHub>({
  lignes,
  groupes,
  q,
  filtres,
  variantes,
  rendreDetails,
  rendreResume,
  replier = false,
  vide,
  suivre,
  refResultat,
  unite = ["ligne", "lignes"],
  sommaire = true,
}: ListeHubProps<L>) {
  const { visibles, ids } = useMemo(
    () => filtrerLignes(lignes, q, filtres, { variantes }),
    [lignes, q, filtres, variantes],
  );
  const actif = rechercheActive(q, filtres);
  const groupesPleins = groupes.filter((g) => lignes.some((l) => l.groupe === g.id));
  const parAncre = useRef<string | null>(null);

  // Arrivée sur /outils/<id>#slug (redirection d'une entrée sans page, lien d'une suggestion) :
  // la ligne s'ouvre et vient à l'écran.
  useEffect(() => {
    const ouvrir = () => {
      const id = decodeURIComponent(window.location.hash.slice(1));
      if (!id) return;
      const el = document.getElementById(id);
      if (!el || el.tagName !== "LI") return;
      requestAnimationFrame(() => {
        const groupe = el.closest<HTMLDetailsElement>("details[data-groupe]");
        if (groupe) groupe.open = true;
        const details = el.querySelector<HTMLDetailsElement>(":scope > details");
        if (details && !details.open) {
          parAncre.current = id;
          details.open = true;
        }
        el.scrollIntoView({ block: "start" });
      });
    };
    ouvrir();
    window.addEventListener("hashchange", ouvrir);
    return () => window.removeEventListener("hashchange", ouvrir);
  }, []);

  const rang = (id: string) => visibles.findIndex((v) => v.id === id) + 1;

  const ligne = (l: L) => {
    const resume = rendreResume ? rendreResume(l) : l.resume;
    return (
      <li
        key={l.id}
        id={l.id}
        hidden={!ids.has(l.id)}
        className="scroll-mt-24 border-b"
        style={{ borderColor: "var(--filet)" }}
      >
        {l.chemin ? (
          <Link
            to={l.chemin.split("#")[0]}
            hash={l.chemin.includes("#") ? l.chemin.split("#")[1] : undefined}
            className={`${GRILLE} block min-h-[48px] py-3 hover:bg-papier focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--profond)] md:px-2`}
            onClick={() => {
              marquerDepuis("recherche");
              suivre(EVENEMENTS.resultatClic, {
                vers: l.chemin,
                rang: rang(l.id),
                avec_recherche: actif,
              });
            }}
          >
            <Contenu l={l} resume={resume} />
            <span
              aria-hidden
              className="hidden text-[18px] md:block"
              style={{ color: "var(--profond)" }}
            >
              ›
            </span>
          </Link>
        ) : (
          <details
            className="group"
            onToggle={(e) => {
              if (!(e.currentTarget as HTMLDetailsElement).open) return;
              const ancre = parAncre.current === l.id;
              parAncre.current = null;
              suivre(EVENEMENTS.entreeVue, {
                entree: l.id,
                mode: "ligne",
                depuis: ancre ? lireDepuis() : actif ? "recherche" : "site",
              });
            }}
          >
            <summary
              className={`${GRILLE} block min-h-[48px] cursor-pointer list-none py-3 hover:bg-papier focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--profond)] md:px-2 [&::-webkit-details-marker]:hidden`}
            >
              <Contenu l={l} resume={resume} />
              <span
                aria-hidden
                className="hidden text-[14px] transition-transform group-open:rotate-180 md:block"
                style={{ color: "var(--profond)" }}
              >
                ▾
              </span>
            </summary>
            {rendreDetails && (
              <div className="pb-5 pt-1 text-[15px] md:px-2" style={{ lineHeight: 1.55 }}>
                {rendreDetails(l)}
              </div>
            )}
          </details>
        )}
      </li>
    );
  };

  const visiblesParGroupe = (g: GroupeHub) =>
    lignes.filter((l) => l.groupe === g.id && ids.has(l.id)).length;

  return (
    <div ref={refResultat} className="mt-8">
      {sommaire && groupesPleins.length >= 2 && (
        <nav aria-label="Sommaire de la liste" className="mb-6">
          <ul className="flex flex-wrap gap-x-4 gap-y-1 text-[14px]">
            {groupesPleins.map((g) => (
              <li key={g.id} hidden={visiblesParGroupe(g) === 0}>
                <a
                  href={`#${g.id}`}
                  className="inline-flex min-h-[44px] items-center underline underline-offset-2 hover:no-underline"
                  style={{ color: "var(--profond)" }}
                >
                  {g.titre}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}
      {visibles.length === 0 && vide(q)}
      {groupesPleins.map((g) => {
        const toutes = lignes.filter((l) => l.groupe === g.id);
        const n = visiblesParGroupe(g);
        const liste = (
          <ul className="border-t" style={{ borderColor: "var(--filet)" }}>
            {toutes.map(ligne)}
          </ul>
        );
        return (
          <section
            key={g.id}
            aria-labelledby={g.id}
            hidden={n === 0}
            className="mt-10 first-of-type:mt-0"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <TitreSection id={g.id}>{g.titre}</TitreSection>
              {g.chemin && (
                <Link
                  to={g.chemin}
                  className="inline-flex min-h-[44px] items-center text-[15px] underline underline-offset-2 hover:no-underline"
                  style={{ color: "var(--profond)", fontWeight: 500 }}
                >
                  Voir la page ›
                </Link>
              )}
            </div>
            {(g.resume || replier) && (
              <p
                className="num-tabular mt-1 text-[14px]"
                style={{ color: "var(--texte-secondaire)" }}
              >
                {nombreFr(toutes.length)} {toutes.length > 1 ? unite[1] : unite[0]}
                {g.resume ? ` · ${g.resume}` : ""}
              </p>
            )}
            {g.intro && (
              <p className="mt-2 max-w-[680px] text-[15px]" style={{ lineHeight: 1.55 }}>
                {g.intro}
              </p>
            )}
            {replier ? (
              <details data-groupe={g.id} open={actif} className="group/groupe mt-3">
                <summary
                  className="inline-flex min-h-[44px] cursor-pointer list-none items-center gap-2 text-[15px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--profond)] [&::-webkit-details-marker]:hidden"
                  style={{ color: "var(--profond)", fontWeight: 500 }}
                >
                  <span aria-hidden className="transition-transform group-open/groupe:rotate-90">
                    ›
                  </span>
                  {actif
                    ? `${nombreFr(n)} sur ${nombreFr(toutes.length)}`
                    : `Afficher les ${nombreFr(toutes.length)} ${toutes.length > 1 ? unite[1] : unite[0]}`}
                </summary>
                <div className="mt-2">{liste}</div>
              </details>
            ) : (
              <div className="mt-3">{liste}</div>
            )}
          </section>
        );
      })}
    </div>
  );
}
