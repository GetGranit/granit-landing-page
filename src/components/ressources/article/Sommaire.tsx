import { useEffect, useState } from "react";

export type Entree = { id: string; label: string };

/** Section lue : la dernière dont le titre est passé sous la barre du site. */
function useSectionLue(cle: string) {
  const [actif, setActif] = useState<string | undefined>();
  useEffect(() => {
    const ids = cle.split(" ");
    const maj = () => {
      let courant: string | undefined;
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top < 140) courant = id;
      }
      setActif(courant);
    };
    maj();
    window.addEventListener("scroll", maj, { passive: true });
    return () => window.removeEventListener("scroll", maj);
  }, [cle]);
  return actif;
}

function Liste({ entrees, actif }: { entrees: Entree[]; actif?: string }) {
  return (
    <ol className="mt-2.5 text-[14.5px]">
      {entrees.map((e) => (
        <li key={e.id}>
          <a
            href={`#${e.id}`}
            className={`block border-l-2 py-1.5 pl-3 hover:text-[var(--text)] ${
              actif === e.id
                ? "border-[var(--ink)] font-semibold text-[var(--text)]"
                : "border-[var(--border)] text-[var(--text-muted)]"
            }`}
          >
            {e.label}
          </a>
        </li>
      ))}
    </ol>
  );
}

/** Sommaire de la colonne de droite (écrans larges), entrée de la section lue surlignée. */
export function Sommaire({ entrees }: { entrees: Entree[] }) {
  const actif = useSectionLue(entrees.map((e) => e.id).join(" "));
  if (!entrees.length) return null;
  return (
    <nav
      aria-label="Sommaire"
      className="max-h-[calc(100dvh-112px)] overflow-y-auto overscroll-contain rounded-[14px] border border-[var(--border)] bg-white px-[18px] py-4"
    >
      <div className="text-[15px] font-semibold">Dans cet article</div>
      <Liste entrees={entrees} actif={actif} />
    </nav>
  );
}

/** Sommaire mobile : bloc repliable sous la signature, fermé par défaut. */
export function SommaireMobile({ entrees }: { entrees: Entree[] }) {
  if (!entrees.length) return null;
  return (
    <details className="mb-8 rounded-[14px] border border-[var(--border)] bg-white px-[18px] py-3.5 min-[980px]:hidden">
      <summary className="cursor-pointer text-[15px] font-semibold">Dans cet article</summary>
      <Liste entrees={entrees} />
    </details>
  );
}
