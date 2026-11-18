// Le relevé d'une mutuelle : le tableau « Portail par métier », les phrases du relevé et ce qu'il
// faut confirmer sur la carte. Rendu par le serveur dans la ligne dépliée du hub et sur la page d'une
// entrée. Jetons de DESIGN.md seulement ; aucune URL brute affichée.
import { TableauOutil } from "@/components/outils/socle";
import type { Suivre } from "@/lib/outils/socle/suivi";
import type { LignePortail, ReleveMutuelle } from "@/lib/outils/mutuelle-portail/types";

/** Nom court d'une source dans le tableau : « Liste iSanté », sinon l'éditeur. */
export type NomsSources = Record<string, string>;

const LISTES: Record<string, string> = {
  "sp-liste-amc": "Liste SP santé",
  "isante-liste-amc": "Liste iSanté",
};
const nomSource = (id: string, noms: NomsSources) => LISTES[id] ?? noms[id] ?? id;

/** Liens vers les sources de la page (ancres #source-<id> du BlocSources). */
export function LiensSources({ ids, noms }: { ids: string[]; noms: NomsSources }) {
  return (
    <>
      {ids.map((id, i) => (
        <span key={id}>
          {i > 0 && ", "}
          <a
            href={`#source-${id}`}
            className="underline underline-offset-2 hover:no-underline"
            style={{ color: "var(--profond)" }}
          >
            {nomSource(id, noms)}
          </a>
        </span>
      ))}
    </>
  );
}

const secondaire = { color: "var(--texte-secondaire)" } as const;

/** Le tableau « Portail par métier » : une ligne par opérateur cité pour un métier. */
export function TableauPortails({
  releve,
  noms,
  suivre,
  legende,
}: {
  releve: ReleveMutuelle;
  noms: NomsSources;
  suivre: Suivre;
  legende: string;
}) {
  const plusieursSegments = (l: LignePortail) =>
    l.segments.length > 1 || l.cleMetier === "centre-de-sante" || l.cleMetier === "hospitalisation";
  return (
    <TableauOutil<LignePortail>
      legende={legende}
      lignes={releve.lignes}
      idLigne={(l) => `portail-${l.id.replace(/:/g, "-")}`}
      colonnes={[
        { cle: "metier", entete: "Métier", principale: true, rendu: (l) => l.metier },
        {
          cle: "operateur",
          entete: "Opérateur",
          rendu: (l) =>
            l.portail ? (
              <a
                href={l.portail}
                target="_blank"
                rel="noopener nofollow"
                className="inline-flex min-h-[44px] items-center underline underline-offset-2 hover:no-underline md:min-h-0"
                style={{ color: "var(--profond)", fontWeight: 500 }}
                onClick={() =>
                  suivre("lm_portail_clic", {
                    entree: releve.slug,
                    operateur: l.operateurId,
                    metier: l.cleMetier,
                  })
                }
              >
                {l.operateur}
                <span className="sr-only"> (espace professionnel, nouvel onglet)</span>
              </a>
            ) : (
              <span style={l.statut === "sur" ? undefined : secondaire}>{l.operateur}</span>
            ),
        },
        {
          cle: "libelle",
          entete: "Libellé relevé",
          rendu: (l) =>
            l.libelles.length ? (
              <ul className={l.libelles.length > 1 ? "space-y-1.5" : undefined}>
                {l.libelles.map((x) => (
                  <li key={`${x.libelle}|${x.amc}`}>
                    <span className="block">«&nbsp;{x.libelle}&nbsp;»</span>
                    <span className="num-tabular block text-[14px]" style={secondaire}>
                      n°&nbsp;AMC {x.amc}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <span style={secondaire}>sans libellé publié</span>
            ),
        },
        {
          cle: "etat",
          entete: "État",
          rendu: (l) => (
            <>
              <span
                className="block"
                style={l.statut === "sur" ? undefined : { ...secondaire, fontWeight: 500 }}
              >
                {l.etat}
              </span>
              {l.restriction && (
                <span className="block text-[14px]" style={{ fontWeight: 500 }}>
                  {l.restriction}
                </span>
              )}
              {l.sousDomaines && (
                <span className="block text-[14px]" style={secondaire}>
                  {l.sousDomaines}
                </span>
              )}
              {plusieursSegments(l) && l.segments.length > 0 && (
                <span className="block text-[14px]" style={secondaire}>
                  {l.segments.length > 1 ? "segments listés : " : "segment listé : "}
                  {l.segments.map((s) => (s === "ESPIC" ? s : s.toLowerCase())).join(", ")}
                </span>
              )}
            </>
          ),
        },
        {
          cle: "source",
          entete: "Source",
          rendu: (l) => (
            <span className="text-[14px]">
              <LiensSources ids={l.sourceIds} noms={noms} />
            </span>
          ),
        },
      ]}
    />
  );
}

function Paragraphes({ textes }: { textes: string[] }) {
  return (
    <>
      {textes.map((t) => (
        <p key={t} className="mt-3 first:mt-0">
          {t}
        </p>
      ))}
    </>
  );
}

/** Les phrases du relevé sûr (rendues telles qu'elles sont comptées pour le seuil de contenu). */
export function PhrasesReleve({ releve }: { releve: ReleveMutuelle }) {
  const p = releve.phrases;
  return (
    <div className="max-w-[680px]">
      <Paragraphes textes={p.notes} />
      {p.releve.map((b) => (
        <div key={b.phrase} className="mt-3 first:mt-0">
          <p>{b.phrase}</p>
          {b.items.length > 0 && (
            <ul className="mt-2 list-disc space-y-1 pl-5">
              {b.items.map((i) => (
                <li key={i} className="break-words">
                  {i}
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
      {p.restrictions.length > 0 && (
        <div className="mt-3">
          <Paragraphes textes={p.restrictions} />
        </div>
      )}
      {p.sources.length > 0 && (
        <div className="mt-3">
          <Paragraphes textes={p.sources} />
        </div>
      )}
    </div>
  );
}

/** Ce qui reste à confirmer sur la carte, une fois par opérateur et par raison. */
export function AConfirmer({ releve }: { releve: ReleveMutuelle }) {
  if (!releve.aConfirmer.length) return null;
  return (
    <div className="mt-4 max-w-[680px]">
      <p style={{ fontWeight: 500 }}>À confirmer sur la carte&nbsp;:</p>
      <ul className="mt-2 space-y-2">
        {releve.aConfirmer.map((a) => (
          <li key={`${a.metiers}|${a.operateur}|${a.raison}`} className="break-words">
            <span style={{ fontWeight: 500 }}>
              {a.metiers}
              {a.restriction ? ` (${a.restriction})` : ""}&nbsp;: {a.operateur}.
            </span>{" "}
            <span style={secondaire}>{a.raison}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** « Pas de source publique relevée pour : audio, clinique. » */
export function SansSource({ releve }: { releve: ReleveMutuelle }) {
  if (!releve.sansSource.length) return null;
  return (
    <p className="mt-4 max-w-[680px] text-[15px]" style={secondaire}>
      {releve.sansSource.length === 7
        ? "Pas de source publique datée pour l’instant, pour aucun métier."
        : `Pas de source publique relevée pour\u00a0: ${releve.sansSource.map((m) => m.toLowerCase()).join(", ")}.`}
    </p>
  );
}

/**
 * Les opérateurs relevés, une ligne par opérateur et par état (métiers fusionnés) : la forme légère
 * du tableau, pour les lignes dépliées du hub (54 lignes dans le même HTML).
 */
export function ListePortails({
  releve,
  noms,
  suivre,
}: {
  releve: ReleveMutuelle;
  noms: NomsSources;
  suivre: Suivre;
}) {
  if (!releve.lignes.length) return null;
  return (
    <ul className="mt-1 max-w-[760px] divide-y" style={{ borderColor: "var(--filet)" }}>
      {releve.lignes.map((l) => (
        <li key={l.id} className="break-words py-2.5" style={{ borderColor: "var(--filet)" }}>
          <span className="block" style={{ fontWeight: 500 }}>
            {l.metier}
            {l.restriction ? ` (${l.restriction})` : ""}&nbsp;:{" "}
            {l.portail ? (
              <a
                href={l.portail}
                target="_blank"
                rel="noopener nofollow"
                className="underline underline-offset-2 hover:no-underline"
                style={{ color: "var(--profond)" }}
                onClick={() =>
                  suivre("lm_portail_clic", {
                    entree: releve.slug,
                    operateur: l.operateurId,
                    metier: l.cleMetier,
                  })
                }
              >
                {l.operateur}
                <span className="sr-only"> (espace professionnel, nouvel onglet)</span>
              </a>
            ) : (
              <span style={l.statut === "sur" ? undefined : secondaire}>{l.operateur}</span>
            )}
            {l.libelles.map((x, i) => (
              <span key={`${x.libelle}|${x.amc}`} style={{ fontWeight: 400 }}>
                {i === 0 ? " · libellé «\u00a0" : " ; «\u00a0"}
                {x.libelle}
                {"\u00a0», "}
                <span className="num-tabular whitespace-nowrap">n°&nbsp;AMC {x.amc}</span>
              </span>
            ))}
          </span>
          <span className="mt-0.5 block text-[14px]" style={secondaire}>
            {l.etat}
            {l.sousDomaines ? ` · ${l.sousDomaines}` : ""}
            {(l.cleMetier === "centre-de-sante" || l.cleMetier === "hospitalisation") &&
            l.segments.length > 0
              ? ` · ${l.segments.length > 1 ? "segments" : "segment"}\u00a0: ${l.segments.map((x) => (x === "ESPIC" ? x : x.toLowerCase())).join(", ")}`
              : ""}
            {" · "}
            <LiensSources ids={l.sourceIds} noms={noms} />
          </span>
        </li>
      ))}
    </ul>
  );
}

/** Le relevé complet dans une ligne dépliée du hub. */
export function ReleveLigne({
  releve,
  noms,
  suivre,
}: {
  releve: ReleveMutuelle;
  noms: NomsSources;
  suivre: Suivre;
}) {
  const p = releve.phrases;
  return (
    <div className="pt-1">
      <PhrasesReleve releve={releve} />
      <ListePortails releve={releve} noms={noms} suivre={suivre} />
      <AConfirmer releve={releve} />
      <SansSource releve={releve} />
      {(p.fermes.length > 0 || p.reseaux.length > 0) && (
        <div className="mt-4 max-w-[680px]">
          {p.fermes.length > 0 && (
            <>
              <p style={{ fontWeight: 500 }}>Segments fermés&nbsp;:</p>
              <Paragraphes textes={p.fermes} />
            </>
          )}
          {p.reseaux.length > 0 && (
            <div className={p.fermes.length ? "mt-3" : ""}>
              <p style={{ fontWeight: 500 }}>Réseau de soins&nbsp;:</p>
              <Paragraphes textes={p.reseaux} />
            </div>
          )}
        </div>
      )}
      <p className="mt-4 max-w-[680px] text-[14px]" style={secondaire}>
        La carte de tiers payant du patient fait foi. Relevé du {releve.releveLe}
        {releve.sourceIds.length > 0 && (
          <>
            {" · "}
            {releve.sourceIds.length > 1 ? "sources\u00a0: " : "source\u00a0: "}
            <LiensSources ids={releve.sourceIds} noms={noms} />
          </>
        )}
        .
      </p>
    </div>
  );
}
