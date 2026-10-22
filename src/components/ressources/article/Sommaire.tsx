import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { mouvementReduit } from "@/lib/motion";

export type Entree = { id: string; label: string };

const useEffetDom = typeof window === "undefined" ? useEffect : useLayoutEffect;

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

const aller = (id: string) => {
  document.getElementById(id)?.scrollIntoView({ behavior: mouvementReduit() ? "auto" : "smooth" });
  history.replaceState(null, "", `#${id}`);
};

/** Liste avec un seul indicateur, qui glisse d'entrée en entrée (plus de bordure par item). */
function Liste({
  entrees,
  actif,
  surChoix,
}: {
  entrees: Entree[];
  actif?: string;
  surChoix?: () => void;
}) {
  const liste = useRef<HTMLOListElement>(null);
  const indic = useRef<HTMLSpanElement>(null);
  useEffetDom(() => {
    const lien = actif ? liste.current?.querySelector<HTMLElement>(`[data-toc="${actif}"]`) : null;
    const s = indic.current?.style;
    if (!s) return;
    s.setProperty("--y", `${lien ? lien.offsetTop : 0}px`);
    s.setProperty("--h", `${lien ? lien.offsetHeight : 0}`);
  }, [actif]);
  return (
    <div className="relative mt-2.5 border-l-2 border-[var(--border)]">
      <span ref={indic} aria-hidden className="toc-indic -left-[2px]" />
      <ol ref={liste} className="text-[14.5px]">
        {entrees.map((e) => (
          <li key={e.id}>
            <a
              href={`#${e.id}`}
              data-toc={e.id}
              aria-current={actif === e.id ? "true" : undefined}
              onClick={(ev) => {
                ev.preventDefault();
                surChoix?.();
                aller(e.id);
              }}
              className={`block rounded-[4px] py-1.5 pl-3 hover:text-[var(--text)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--terra)] ${
                actif === e.id ? "font-semibold text-[var(--text)]" : "text-[var(--text-muted)]"
              }`}
            >
              {e.label}
            </a>
          </li>
        ))}
      </ol>
    </div>
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

/**
 * Sommaire mobile : bloc repliable sous la signature (fermé par défaut), puis, une fois sorti
 * de l'écran et jusqu'aux questions fréquentes, une pastille « Sommaire » qui ouvre une feuille
 * avec « Haut de page » et la même liste. Seul élément flottant de la page.
 */
export function SommaireMobile({ entrees }: { entrees: Entree[] }) {
  const bloc = useRef<HTMLDetailsElement>(null);
  const actif = useSectionLue(entrees.map((e) => e.id).join(" "));
  const [pastille, setPastille] = useState(false);
  const [ouvert, setOuvert] = useState(false);

  useEffect(() => {
    const maj = () => {
      const fin = bloc.current?.getBoundingClientRect().bottom ?? 0;
      const faq = document.getElementById("faq") ?? document.getElementById("sources");
      const butee = faq ? faq.getBoundingClientRect().top : Infinity;
      setPastille(fin < 0 && butee > window.innerHeight);
    };
    maj();
    window.addEventListener("scroll", maj, { passive: true });
    window.addEventListener("resize", maj);
    return () => {
      window.removeEventListener("scroll", maj);
      window.removeEventListener("resize", maj);
    };
  }, []);

  useEffect(() => {
    if (!ouvert) return;
    const echap = (e: KeyboardEvent) => e.key === "Escape" && setOuvert(false);
    window.addEventListener("keydown", echap);
    return () => window.removeEventListener("keydown", echap);
  }, [ouvert]);

  if (!entrees.length) return null;
  return (
    <>
      <details
        ref={bloc}
        className="mb-8 rounded-[14px] border border-[var(--border)] bg-white px-[18px] py-3.5 min-[980px]:hidden"
      >
        <summary className="cursor-pointer rounded-[4px] text-[15px] font-semibold focus-visible:outline-2 focus-visible:outline-[var(--terra)]">
          Dans cet article
        </summary>
        <Liste entrees={entrees} />
      </details>

      <div className="min-[980px]:hidden">
        <button
          type="button"
          onClick={() => setOuvert(true)}
          aria-expanded={ouvert}
          tabIndex={pastille ? 0 : -1}
          className={`fixed bottom-[calc(env(safe-area-inset-bottom)+16px)] right-4 z-[55] rounded-full border border-[var(--border2)] bg-white px-4 py-2.5 text-[14px] font-semibold shadow-[var(--shadow-soft)] transition-opacity duration-150 focus-visible:outline-2 focus-visible:outline-[var(--terra)] ${
            pastille && !ouvert ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
        >
          Sommaire
        </button>
        {ouvert && (
          <div
            className="fixed inset-0 z-[65] bg-black/25"
            onClick={() => setOuvert(false)}
            aria-hidden
          />
        )}
        <div
          role="dialog"
          aria-label="Sommaire"
          aria-hidden={!ouvert}
          data-ferme={ouvert ? undefined : ""}
          className={`feuille fixed inset-x-0 bottom-0 z-[66] max-h-[70dvh] overflow-y-auto rounded-t-[18px] bg-white px-5 pb-[calc(env(safe-area-inset-bottom)+20px)] pt-4 shadow-[0_-10px_30px_-12px_rgba(28,17,8,0.2)] ${ouvert ? "" : "invisible"}`}
        >
          <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-[var(--border2)]" aria-hidden />
          <button
            type="button"
            onClick={() => {
              setOuvert(false);
              window.scrollTo({ top: 0, behavior: mouvementReduit() ? "auto" : "smooth" });
            }}
            className="block w-full rounded-[4px] py-2 text-left text-[15px] font-semibold focus-visible:outline-2 focus-visible:outline-[var(--terra)]"
          >
            Haut de page ↑
          </button>
          <Liste entrees={entrees} actif={actif} surChoix={() => setOuvert(false)} />
        </div>
      </div>
    </>
  );
}
