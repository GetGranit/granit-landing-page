// « Copier le lien » sur chaque titre de section, pour s'envoyer « la partie sur les statuts ».
// Le HTML du moteur n'est pas réécrit : les boutons sont ajoutés après rendu.
import { useEffect, useState, type RefObject } from "react";

const EVENEMENT = "ress:lien-copie";

const ICONE =
  '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7"/><path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7"/></svg>';

const classeBouton =
  "ancre-lien ml-2 inline-grid size-7 translate-y-[-2px] place-items-center rounded-[6px] align-middle text-[var(--text-muted)] opacity-50 hover:text-[var(--text)] focus-visible:opacity-100 focus-visible:outline-2 focus-visible:outline-[var(--terra)] md:opacity-0 md:group-hover/titre:opacity-100";

/** Met l'ancre dans l'URL et copie le lien ; n'annonce « Lien copié » que si la copie a marché. */
export async function copierLien(id: string) {
  const url = `${location.origin}${location.pathname}#${id}`;
  history.replaceState(null, "", `#${id}`);
  try {
    await navigator.clipboard.writeText(url);
    window.dispatchEvent(new Event(EVENEMENT));
  } catch {
    // Presse-papier refusé : l'ancre est dans l'URL, on n'affiche rien de faux.
  }
}

/** Bouton d'ancre pour un titre rendu par React (FAQ, Sources). */
export function BoutonAncre({ id, titre }: { id: string; titre: string }) {
  return (
    <button
      type="button"
      className={classeBouton}
      aria-label={`Copier le lien vers « ${titre} »`}
      onClick={() => copierLien(id)}
      dangerouslySetInnerHTML={{ __html: ICONE }}
    />
  );
}

/** Ajoute un bouton d'ancre à chaque H2 du corps (HTML du moteur), et affiche le message. */
export function Ancres({ racine }: { racine: RefObject<HTMLElement | null> }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = racine.current;
    if (!el) return;
    const ajoutes: HTMLElement[] = [];
    el.querySelectorAll<HTMLHeadingElement>(".ress-html h2[id]").forEach((h2) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = classeBouton;
      b.setAttribute("aria-label", `Copier le lien vers « ${h2.textContent?.trim()} »`);
      b.innerHTML = ICONE;
      b.addEventListener("click", () => copierLien(h2.id));
      h2.classList.add("group/titre");
      h2.appendChild(b);
      ajoutes.push(b);
    });
    return () => ajoutes.forEach((b) => b.remove());
  }, [racine]);

  useEffect(() => {
    let minuterie: ReturnType<typeof setTimeout>;
    const montrer = () => {
      setVisible(true);
      clearTimeout(minuterie);
      minuterie = setTimeout(() => setVisible(false), 2000);
    };
    window.addEventListener(EVENEMENT, montrer);
    return () => {
      window.removeEventListener(EVENEMENT, montrer);
      clearTimeout(minuterie);
    };
  }, []);

  return (
    <div
      role="status"
      aria-live="polite"
      className={`toast pointer-events-none fixed bottom-[calc(env(safe-area-inset-bottom)+72px)] left-1/2 z-[70] -translate-x-1/2 rounded-full bg-[#1c1108] px-4 py-2 text-[14px] text-[#f6efe4] ${visible ? "opacity-100" : "opacity-0"}`}
    >
      {visible ? "Lien copié" : ""}
    </div>
  );
}
