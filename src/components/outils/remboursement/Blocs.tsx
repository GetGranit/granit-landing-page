// Blocs propres à l'outil B · Remboursement : le bandeau 2027, les renvois aux sources d'un
// paragraphe et le contenu d'une ligne du hub sans page. Tout le texte arrive déjà rédigé et daté
// par le serveur (vues.mjs) : ces composants ne font que le poser.
import { BlocAvertissement } from "@/components/outils/socle";
import type { SourceDonnee } from "@/lib/outils/socle/types";
import type { Bandeau, DetailsLigne } from "@/lib/outils/remboursement/vues.mjs";

/** Le bandeau « Au 1er janvier 2027 » (ou « Depuis le 1er janvier 2027 »), sourcé. */
export function Bandeau2027({ bandeau, className }: { bandeau: Bandeau; className?: string }) {
  return (
    <BlocAvertissement
      variante="a-venir"
      titre={bandeau.titre}
      sourceIds={bandeau.source_ids}
      className={className}
    >
      <p>{bandeau.texte}</p>
    </BlocAvertissement>
  );
}

/**
 * Renvois d'un paragraphe vers ses sources, numérotées comme dans le bloc Sources de la page
 * (« Sources : 1, 3 »), avec l'ancre `#source-<id>`.
 */
export function RenvoisSources({ ids, sources }: { ids: string[]; sources: SourceDonnee[] }) {
  const numeros = ids
    .map((id) => ({ id, n: sources.findIndex((s) => s.id === id) + 1 }))
    .filter((x) => x.n > 0);
  if (!numeros.length) return null;
  return (
    <span className="text-[14px]" style={{ color: "var(--texte-secondaire)" }}>
      {" "}
      ({numeros.length > 1 ? "sources" : "source"}
      {"\u00a0"}
      {numeros.map((x, i) => (
        <span key={x.id}>
          {i > 0 && ", "}
          <a
            href={`#source-${x.id}`}
            className="underline underline-offset-2 hover:no-underline"
            style={{ color: "var(--profond)" }}
          >
            {x.n}
          </a>
        </span>
      ))}
      )
    </span>
  );
}

/** Le corps d'une ligne du hub sans page (verres freinateurs, dentaire, médicaments). */
export function DetailsCode({ details }: { details: DetailsLigne }) {
  return (
    <div className="max-w-[680px]">
      <dl>
        {details.lignes.map((l) => (
          <div
            key={l.libelle}
            className="py-1.5 md:grid md:grid-cols-[220px_minmax(0,1fr)] md:gap-4"
          >
            <dt className="text-[14px]" style={{ color: "var(--texte-secondaire)" }}>
              {l.libelle}
            </dt>
            <dd className="num-tabular min-w-0 break-words">{l.valeur}</dd>
          </div>
        ))}
      </dl>
      {details.conditions && <p className="mt-3">{details.conditions}</p>}
      <p className="mt-3 text-[14px]" style={{ color: "var(--texte-secondaire)" }}>
        {details.datation}
      </p>
    </div>
  );
}
