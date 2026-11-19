// Corps d'une ligne du hub sans page (<details>) : le libellé est déjà dans le résumé de la ligne ;
// ici l'explication, les causes, la correction, les métiers et la source principale avec sa date.
// Rendu par le serveur : indexé avec le hub.
import type { DetailsCode as Details } from "@/lib/outils/codes-rejet/types";

export function DetailsCode({ details }: { details: Details }) {
  const { explication, causes, etapes, metiers, source } = details;
  return (
    <div className="max-w-[680px] space-y-3 break-words">
      <p>{explication}</p>
      <div>
        <p className="text-[14px]" style={{ fontWeight: 500 }}>
          Cause probable
        </p>
        {causes.length > 1 ? (
          <ul className="mt-1 list-disc space-y-1 pl-5">
            {causes.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        ) : (
          <p className="mt-1">{causes[0]}</p>
        )}
      </div>
      <div>
        <p className="text-[14px]" style={{ fontWeight: 500 }}>
          Quoi corriger
        </p>
        {etapes.length > 1 ? (
          <ol className="mt-1 list-decimal space-y-1 pl-5">
            {etapes.map((e) => (
              <li key={e}>{e}</li>
            ))}
          </ol>
        ) : (
          <p className="mt-1">{etapes[0]}</p>
        )}
      </div>
      <p className="text-[14px]" style={{ color: "var(--texte-secondaire)" }}>
        Métiers&nbsp;: {metiers}
      </p>
      <p className="text-[14px]" style={{ color: "var(--texte-secondaire)" }}>
        Source&nbsp;: {source.editeur},{" "}
        <a
          href={source.url}
          target="_blank"
          rel="noopener"
          className="underline underline-offset-2 hover:no-underline"
          style={{ color: "var(--profond)" }}
        >
          {source.titre}
        </a>{" "}
        (document du {source.date}). Le libellé de votre retour fait foi.
      </p>
    </div>
  );
}
