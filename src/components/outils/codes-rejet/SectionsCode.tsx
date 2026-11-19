// Les sections propres à une page de code rejet, dans l'ordre de cadre.md § 5 : le libellé source
// par source, les autres écritures, les causes, la correction, la question réelle, la note de
// source. Tout le texte vient du modèle calculé par modele.mjs (rien n'est écrit ici).
import { SectionOutil, TableauOutil } from "@/components/outils/socle";
import type { LigneLibelle, ModeleEntree } from "@/lib/outils/codes-rejet/types";

const lienSource = (id: string, texte: string) => (
  <a
    href={`#source-${id}`}
    className="underline underline-offset-2 hover:no-underline"
    style={{ color: "var(--profond)" }}
  >
    {texte}
  </a>
);

function Deduit({ texte }: { texte?: string }) {
  if (!texte) return null;
  return (
    <p className="mt-3 text-[14px]" style={{ color: "var(--texte-secondaire)" }}>
      {texte}
    </p>
  );
}

export function SectionsCode({ m }: { m: ModeleEntree }) {
  return (
    <>
      <SectionOutil id="libelles" titre={m.libelles.titre}>
        {m.libelles.phrase ? (
          <p>{m.libelles.phrase}</p>
        ) : (
          <TableauOutil<LigneLibelle>
            legende={`Libellés publiés pour le code ${m.code}, par source`}
            lignes={m.libelles.lignes}
            colonnes={[
              { cle: "editeur", entete: "Caisse ou éditeur", rendu: (l) => l.editeur },
              { cle: "date", entete: "Document du", rendu: (l) => lienSource(l.sourceId, l.date) },
              {
                cle: "texte",
                entete: "Libellé",
                rendu: (l) => `«\u00a0${l.texte}\u00a0»`,
                principale: true,
              },
            ]}
          />
        )}
      </SectionOutil>

      {m.ecritures && (
        <SectionOutil id="ecritures" titre={m.ecritures.titre}>
          <p className="num-tabular">{m.ecritures.valeurs.join(" · ")}</p>
        </SectionOutil>
      )}

      <SectionOutil id="causes" titre={m.causes.titre}>
        {m.causes.items.length > 1 ? (
          <ul className="list-disc space-y-2 pl-5">
            {m.causes.items.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        ) : (
          <p>{m.causes.items[0]}</p>
        )}
        <Deduit texte={m.causes.deduit} />
      </SectionOutil>

      <SectionOutil id="corriger" titre={m.correction.titre}>
        {m.correction.etapes.length > 1 ? (
          <ol className="list-decimal space-y-2 pl-5">
            {m.correction.etapes.map((e) => (
              <li key={e}>{e}</li>
            ))}
          </ol>
        ) : (
          <p>{m.correction.etapes[0]}</p>
        )}
        <Deduit texte={m.correction.deduit} />
      </SectionOutil>

      {m.question && (
        <SectionOutil id="question" titre={m.question.titre}>
          {/* Question reformulée (jamais citée mot pour mot ni signée), avec son lien d'origine. */}
          <p className="rounded-[14px] bg-papier p-4" style={{ border: "1px solid var(--filet)" }}>
            {m.question.texte}
          </p>
          {m.question.lien && (
            <p className="mt-3 text-[15px]">
              <a
                href={m.question.lien}
                target="_blank"
                rel="noopener nofollow"
                className="inline-flex min-h-[44px] items-center underline underline-offset-2 hover:no-underline"
                style={{ color: "var(--profond)" }}
              >
                Lire la discussion d’origine
              </a>
            </p>
          )}
        </SectionOutil>
      )}

      {m.note && (
        <SectionOutil id="a-savoir" titre={m.note.titre}>
          {m.note.texte && <p>{m.note.texte}</p>}
          {m.note.professions && <p className={m.note.texte ? "mt-3" : ""}>{m.note.professions}</p>}
        </SectionOutil>
      )}
    </>
  );
}
