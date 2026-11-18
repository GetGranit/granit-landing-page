import type { ReactNode } from "react";
import { Info } from "lucide-react";

/**
 * Une information à lire avant d'agir. Pas de rouge (DESIGN.md : une alerte reste une information).
 * - `fait-foi` : la phrase obligatoire de chaque outil, juste sous « L'essentiel ».
 * - `a-venir` : un changement daté et sourcé (B : 01/01/2027), la date en sur-titre (`titre`).
 * `sourceIds` : liens vers les sources de la page (ancres `#source-<id>` du BlocSources).
 */
export function BlocAvertissement({
  variante = "fait-foi",
  titre,
  children,
  sourceIds,
  className = "",
}: {
  variante?: "fait-foi" | "a-venir";
  titre?: string;
  children: ReactNode;
  sourceIds?: string[];
  className?: string;
}) {
  return (
    <aside
      className={`mt-6 flex gap-3 rounded-[14px] bg-papier p-4 text-[15px] md:p-5 ${className}`}
      style={{
        border: "1px solid var(--filet)",
        borderLeft: "3px solid var(--profond)",
        lineHeight: 1.55,
      }}
      data-variante={variante}
    >
      <Info
        aria-hidden
        size={18}
        className="mt-[3px] shrink-0"
        style={{ color: "var(--profond)" }}
      />
      <div className="min-w-0 break-words">
        {titre && <p className="eyebrow mb-1.5">{titre}</p>}
        <div>{children}</div>
        {sourceIds && sourceIds.length > 0 && (
          <p className="mt-2 text-[14px]" style={{ color: "var(--texte-secondaire)" }}>
            {sourceIds.length > 1 ? "Sources\u00a0: " : "Source\u00a0: "}
            {sourceIds.map((id, i) => (
              <span key={id}>
                {i > 0 && ", "}
                <a
                  href={`#source-${id}`}
                  className="underline underline-offset-2 hover:no-underline"
                  style={{ color: "var(--profond)" }}
                >
                  {sourceIds.length > 1 ? `source ${i + 1}` : "voir la source"}
                </a>
              </span>
            ))}
          </p>
        )}
      </div>
    </aside>
  );
}
