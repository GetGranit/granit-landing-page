import { EVENEMENTS, type Suivre } from "@/lib/outils/socle/suivi";
import { RELECTEUR_OUTILS } from "@/lib/outils/socle/reglages";
import { estDateIso, formaterDate } from "@/lib/outils/socle/texte.mjs";
import type { SourceDonnee } from "@/lib/outils/socle/types";
import { TitreSection } from "./Mise";

type GroupeSources = { titre: string; sources: SourceDonnee[] };

/**
 * Les sources d'une page, datées : éditeur, titre en lien, « document du … · consulté le … »,
 * puis « Vérifié le … » (et le relecteur s'il est désigné, RELECTEUR_OUTILS). Chaque source a
 * l'ancre `#source-<id>` (liens des BlocAvertissement).
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
  const liste = (ss: SourceDonnee[]) => (
    <ol className="mt-4 space-y-4">
      {ss.map((s) => (
        <li
          key={s.id}
          id={`source-${s.id}`}
          className="min-w-0 break-words text-[15px]"
          style={{ lineHeight: 1.5 }}
        >
          <p style={{ fontWeight: 500 }}>{s.editeur}</p>
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
          <p className="mt-0.5 text-[14px]" style={{ color: "var(--texte-secondaire)" }}>
            {estDateIso(s.date_source)
              ? `document du ${formaterDate(s.date_source)}`
              : s.date_source}
            {" · consulté le "}
            {formaterDate(s.consulte_le)}
            {mention?.(s) ? ` · ${mention(s)}` : ""}
          </p>
        </li>
      ))}
    </ol>
  );
  return (
    <section aria-labelledby={id} className="mt-12">
      <TitreSection id={id}>{titre}</TitreSection>
      {groupes
        ? groupes
            .filter((g) => g.sources.length)
            .map((g) => (
              <div key={g.titre} className="mt-6">
                <h3 className="text-[16px]" style={{ fontWeight: 500 }}>
                  {g.titre}
                </h3>
                {liste(g.sources)}
              </div>
            ))
        : liste(sources)}
      <p className="mt-6 text-[14px]" style={{ color: "var(--texte-secondaire)" }}>
        Vérifié le {formaterDate(verifieLe)}
        {relecteur ? ` par ${relecteur.nom}, ${relecteur.fonction}` : ""}.
      </p>
    </section>
  );
}
