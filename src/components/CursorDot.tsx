import { useEffect, useRef } from "react";

/**
 * Parenthesis-style custom cursor: a small terracotta dot that trails the
 * pointer and swells over interactive elements. Only enabled on fine-pointer
 * devices (desktop w/ mouse); touch devices keep the native cursor.
 */
export function CursorDot() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    if (!fine.matches) return;

    const root = document.documentElement;
    root.classList.add("cursor-hidden");

    const el = ref.current;
    let raf = 0;
    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let tx = x;
    let ty = y;

    const onMove = (e: MouseEvent) => {
      tx = e.clientX;
      ty = e.clientY;
    };
    const onLeave = () => el && (el.style.opacity = "0");
    const onEnter = () => el && (el.style.opacity = "1");

    const loop = () => {
      x += (tx - x) * 0.22;
      y += (ty - y) * 0.22;
      if (el) el.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseenter", onEnter);
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onEnter);
      root.classList.remove("cursor-hidden");
    };
  }, []);

  return <div ref={ref} className="cursor-dot" aria-hidden />;
}
