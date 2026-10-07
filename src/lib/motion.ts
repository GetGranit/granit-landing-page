// Mouvement des pages Ressources : un seul IntersectionObserver partagé.
// Le CSS fait le reste (src/ressources.css) ; rien ne masque le texte avant le JS.
import { useEffect, useRef } from "react";

let io: IntersectionObserver | undefined;
const rappels = new WeakMap<Element, () => void>();

/** Appelle `fn` une seule fois quand `el` entre dans l'écran. */
export function quandVisible(el: Element, fn: () => void) {
  if (typeof IntersectionObserver === "undefined") return () => {};
  io ??= new IntersectionObserver(
    (entrees) => {
      for (const e of entrees) {
        if (!e.isIntersecting) continue;
        rappels.get(e.target)?.();
        rappels.delete(e.target);
        io!.unobserve(e.target);
      }
    },
    { rootMargin: "0px 0px -10% 0px", threshold: 0.2 },
  );
  rappels.set(el, fn);
  io.observe(el);
  return () => {
    rappels.delete(el);
    io?.unobserve(el);
  };
}

/** Pose `data-vu` sur l'élément à sa première apparition. */
export function useVu<T extends Element>() {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    return quandVisible(el, () => el.setAttribute("data-vu", ""));
  }, []);
  return ref;
}

export const mouvementReduit = () =>
  typeof matchMedia !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches;
