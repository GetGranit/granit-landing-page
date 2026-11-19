import { useEffect, useRef } from "react";
import { ChevronDown } from "lucide-react";
import { EVENEMENTS, type Suivre } from "@/lib/outils/socle/suivi";
import { RELECTEUR_OUTILS } from "@/lib/outils/socle/reglages";
import { estDateIso, formaterDate } from "@/lib/outils/socle/texte.mjs";
import type { SourceDonnee } from "@/lib/outils/socle/types";
import { TitreSection } from "./Mise";

type GroupeSources = { titre: string; sources: SourceDonnee[] };

/** Première année (19xx ou 20xx) écrite dans la date d'une source, ou null (« non datée »). */
const annee = (s: SourceDonnee) => s.date_source.match(/\b(19|20)\d{2}\b/)?.[0] ?? null;

/**
 * Le résumé d'une ligne, dans le <summary> : « 7 sources, documents de 2009 à 2023 ». Les groupes
 * (hub) restent visibles une fois le bloc ouvert, pas dans le résumé : il tient sur une ligne à 375 px.
 */
function resumeSources(toutes: SourceDonnee[]) {
  const n = toutes.length;
  const debut = `${n}\u00a0source${n > 1 ? "s" : ""}`;
  const annees = toutes
    .map(annee)
    .filter((a): a is string => Boolean(a))
    .sort();
  if (!annees.length) return debut;
  return annees[0] === annees.at(-1)
    ? `${debut}, documents de ${annees[0]}`
    : `${debut}, documents de ${annees[0]} à ${annees.at(-1)}`;
}

/**
 * Les sources d'une page, datées, dans un bloc replié par défaut pour ne pas rallonger la page :
 * le titre, une ligne de résumé, puis un <details> rendu par le serveur (la liste est dans le HTML,
 * lue par les moteurs). Chaque source garde son ancre `#source-<id>` (liens des BlocAvertissement
 * et des tableaux) : un lien vers une ancre, ou une arrivée sur la page avec cette ancre, ouvre le
 * bloc puis amène la source à l'écran. « Vérifié le … » reste visible, hors du bloc.
 * Une source : éditeur, titre en lien, « document du … · consulté le … ».
 * `groupes` remplace `sources` pour un classement par éditeur (hub A) ; `mention` ajoute une précision
 * par source (C : « lu via un outil de lecture »).
 */
export function BlocSources({
  sources = [],
  groupes,
  verifieLe,
  relecteur = RELECTEUR_OUTILS,
  titre = "Sources",
  mention,
  suivre,
  id = "sources",
}: {
  sources?: SourceDonnee[];
  groupes?: GroupeSources[];
  verifieLe: string;
  relecteur?: { nom: string; fonction: string } | null;
  titre?: string;
  mention?: (s: SourceDonnee) => string | undefined;
  suivre?: Suivre;
  id?: string;
}) {
  const refBloc = useRef<HTMLDetailsElement>(null);
  const toutes = groupes ? groupes.flatMap((g) => g.sources) : sources;

  // Un lien `#source-<id>` (ou `#<id>`) ouvre le bloc avant que le navigateur ne défile vers la
  // cible ; l'arrivée sur la page avec cette ancre, ou un changement d'ancre, fait de même.
  useEffect(() => {
    const bloc = refBloc.current;
    if (!bloc) return;
    const viseLeBloc = (hash: string) => {
      const cible = decodeURIComponent(hash.replace(/^#/, ""));
      if (!cible) return null;
      const el = document.getElementById(cible);
      return el && (el === bloc || bloc.contains(el)) ? el : null;
    };
    const ouvrir = (hash: string, defiler: boolean) => {
      const el = viseLeBloc(hash);
      if (!el) return;
      bloc.open = true;
      if (defiler) requestAnimationFrame(() => el.scrollIntoView({ block: "start" }));
    };
    const surClic = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.("a[href^='#']");
      if (a) ouvrir(a.getAttribute("href") ?? "", true);
    };
    const surHash = () => ouvrir(window.location.hash, true);
    surHash();
    document.addEventListener("click", surClic, true);
    window.addEventListener("hashchange", surHash);
    return () => {
      document.removeEventListener("click", surClic, true);
      window.removeEventListener("hashchange", surHash);
    };
  }, []);

  const liste = (ss: SourceDonnee[]) => (
    <ol className="mt-3 space-y-3">
      {ss.map((s) => (
        <li
          key={s.id}
          id={`source-${s.id}`}
          className="min-w-0 scroll-mt-24 break-words text-[14px]"
          style={{ lineHeight: 1.5 }}
        >
          <span style={{ fontWeight: 500 }}>{s.editeur}</span>
          {" : "}
          <a
            href={s.url}
            target="_blank"
            rel="noopener"
            className="underline underline-offset-2 hover:no-underline"
            style={{ color: "var(--profond)" }}
            onClick={() => suivre?.(EVENEMENTS.sourceClic, { source_id: s.id })}
          >
            {s.titre}
          </a>
          <span style={{ color: "var(--texte-secondaire)" }}>
            {" · "}
            {estDateIso(s.date_source)
              ? `document du ${formaterDate(s.date_source)}`
              : s.date_source}
            {", consulté le "}
            {formaterDate(s.consulte_le)}
            {mention?.(s) ? ` · ${mention(s)}` : ""}
          </span>
        </li>
      ))}
    </ol>
  );
  return (
    <section aria-labelledby={id} className="mt-12">
      <TitreSection id={id}>{titre}</TitreSection>
      <details
        ref={refBloc}
        className="group mt-4 rounded-[14px] bg-papier"
        style={{ border: "1px solid var(--filet)" }}
      >
        <summary
          className="flex min-h-[48px] cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 text-[15px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--profond)] md:px-5 [&::-webkit-details-marker]:hidden"
          style={{ lineHeight: 1.45 }}
        >
          <span className="min-w-0 break-words">{resumeSources(toutes)}</span>
          <span
            className="flex shrink-0 items-center gap-1 text-[14px]"
            style={{ color: "var(--profond)", fontWeight: 500 }}
          >
            <span className="group-open:hidden">Voir la liste</span>
            <span className="hidden group-open:inline">Replier</span>
            <ChevronDown
              aria-hidden
              size={16}
              className="transition-transform group-open:rotate-180"
            />
          </span>
        </summary>
        <div className="border-t px-4 pb-4 md:px-5" style={{ borderColor: "var(--filet)" }}>
          {groupes
            ? groupes
                .filter((g) => g.sources.length)
                .map((g) => (
                  <div key={g.titre} className="mt-4">
                    <h3 className="text-[15px]" style={{ fontWeight: 500 }}>
                      {g.titre}
                    </h3>
                    {liste(g.sources)}
                  </div>
                ))
            : liste(sources)}
        </div>
      </details>
      <p className="mt-3 text-[14px]" style={{ color: "var(--texte-secondaire)" }}>
        Vérifié le {formaterDate(verifieLe)}
        {relecteur ? ` par ${relecteur.nom}, ${relecteur.fonction}` : ""}.
      </p>
    </section>
  );
}
