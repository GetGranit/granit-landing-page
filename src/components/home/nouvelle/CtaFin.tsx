/* Nouvelle home : CTA DE FIN, « 03 Dégradé » (portage de lm/cta.js et lm/cta.css, version retenue le 3 novembre).
   Le grand fond de la marque ; une lumière qui suit la souris (pointeurs fins seulement) ; le fond et le filigrane
   Galets qui glissent avec le défilement ; le titre qui entre ligne à ligne. Rien ne boucle.
   « Mouvements réduits » : l'état final, immobile. */
import { useEffect, useRef, type CSSProperties } from "react";
import { GaletsSymbol, useLanguage } from "./socle";
import { CarteContact } from "./CarteContact";
import "./cta-fin.css";

const copy = {
  fr: {
    l1: "Vos équipes soignent.",
    l2: "Nos agents encaissent.",
    lead: "Opérationnel en 48 h sur vos portails. Rien à installer pour vos équipes.",
    garanties: "Garanties",
    hds: "Hébergé sur un cloud certifié HDS",
    ue: "Données dans l’UE",
    rgpd: (
      <>
        Conforme <b>RGPD</b>
      </>
    ),
  },
  en: {
    l1: "Your teams care.",
    l2: "Our agents get you paid.",
    lead: "Live on your portals in 48 hours. Nothing for your teams to install.",
    garanties: "Guarantees",
    hds: "Hosted on HDS-certified cloud",
    ue: "EU data",
    rgpd: (
      <>
        <b>GDPR</b> compliant
      </>
    ),
  },
};

const ETOILES = Array.from({ length: 12 }, (_, i) => {
  const a = (i / 12) * Math.PI * 2;
  return { cx: (12 + 9 * Math.cos(a)).toFixed(2), cy: (12 + 9 * Math.sin(a)).toFixed(2) };
});
const i = (n: number) => ({ "--i": n }) as CSSProperties;

export function CtaFinNouvelle() {
  const { lang } = useLanguage();
  const t = copy[lang];
  const secRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const s3 = secRef.current;
    if (!s3) return;
    const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
    const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
    const rm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    /* le titre entre ligne à ligne quand 30 % de la section est à l'écran */
    if (rm || !("IntersectionObserver" in window)) {
      s3.classList.add("in");
      return;
    }
    const io = new IntersectionObserver(
      (es) => {
        if (es[0].isIntersecting) {
          io.disconnect();
          s3.classList.add("in");
        }
      },
      { threshold: 0.3 },
    );
    io.observe(s3);

    /* le fond et le filigrane suivent la page : --s va de 0 (la section entre par le bas) à 1 (elle sort par le haut) */
    let rafS = 0;
    const defile = () => {
      rafS = 0;
      const r = s3.getBoundingClientRect(),
        vh = window.innerHeight;
      if (r.height > 0 && r.bottom > -200 && r.top < vh + 200)
        s3.style.setProperty("--s", clamp((vh - r.top) / (vh + r.height), 0, 1).toFixed(4));
    };
    const auDefile = () => {
      if (!rafS) rafS = requestAnimationFrame(defile);
    };
    window.addEventListener("scroll", auDefile, { passive: true });
    window.addEventListener("resize", auDefile);
    defile();

    /* la lumière suit la souris, avec un peu de retard (pointeurs fins seulement) */
    const fin = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    let px = 0.7,
      py = 0.45,
      gx = 0.7,
      gy = 0.45,
      rafP = 0;
    const tick = () => {
      px = lerp(px, gx, 0.08);
      py = lerp(py, gy, 0.08);
      s3.style.setProperty("--px", px.toFixed(4));
      s3.style.setProperty("--py", py.toFixed(4));
      rafP = Math.abs(px - gx) + Math.abs(py - gy) > 0.0005 ? requestAnimationFrame(tick) : 0;
    };
    const auPointeur = (e: PointerEvent) => {
      const r = s3.getBoundingClientRect();
      gx = (e.clientX - r.left) / r.width;
      gy = (e.clientY - r.top) / r.height;
      if (!rafP) rafP = requestAnimationFrame(tick);
    };
    if (fin) s3.addEventListener("pointermove", auPointeur);

    return () => {
      io.disconnect();
      window.removeEventListener("scroll", auDefile);
      window.removeEventListener("resize", auDefile);
      s3.removeEventListener("pointermove", auPointeur);
      if (rafS) cancelAnimationFrame(rafS);
      if (rafP) cancelAnimationFrame(rafP);
    };
  }, []);

  return (
    <section ref={secRef} className="ct3" id="cta" aria-labelledby="ct3-t">
      {/* les anciens liens vers /#demo (pied de page, /demo, mails) arrivent ici */}
      <span id="demo" className="ct-ancre" aria-hidden="true" />
      <div className="ct3-grad" aria-hidden="true" />
      <div className="ct3-veil" aria-hidden="true" />
      <div className="ct3-light" aria-hidden="true" />
      <GaletsSymbol className="ct3-motif" />
      <div className="lm-wrap ct3-body ct3-deux">
        <div className="ct3-txt">
          <h2 className="ct-h2" id="ct3-t">
            <span>
              <span className="ct-ln" style={i(0)}>
                {t.l1}
              </span>
            </span>{" "}
            <span className="ct-acc">
              <span className="ct-ln" style={i(1)}>
                {t.l2}
              </span>
            </span>
          </h2>
          <p className="ct-lead ct3-fade" style={i(2)}>
            {t.lead}
          </p>
          <div className="ct3-fade" style={i(3)}>
            <ul className="ct-trust" aria-label={t.garanties}>
              <li>
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 2.8l7.2 2.7v5.6c0 4.6-3 8.2-7.2 10.1-4.2-1.9-7.2-5.5-7.2-10.1V5.5z" />
                  <path d="M8.8 12.2l2.2 2.2 4.2-4.4" />
                </svg>
                {t.hds}
              </li>
              <li>
                <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
                  {ETOILES.map((e, k) => (
                    <circle key={k} cx={e.cx} cy={e.cy} r="1.25" />
                  ))}
                </svg>
                {t.ue}
              </li>
              <li>{t.rgpd}</li>
            </ul>
          </div>
        </div>
        <div className="ct3-fade" style={i(4)}>
          <CarteContact />
        </div>
      </div>
    </section>
  );
}
