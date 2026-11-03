/* Accueil : le CTA de fin, « 03 Dégradé » (retenu le 3 novembre). Le grand fond de la marque, une lumière qui suit
   la souris, le symbole en filigrane qui monte avec la page ; le titre entre ligne à ligne.
   Ancre #demo : la Nav et le pied de page du site y envoient (« Demander une démo »).
   « Mouvements réduits » : l'état final, immobile. */
import { useEffect, useRef } from "react";
import { usePostHog } from "posthog-js/react";
import { useLanguage } from "@/lib/i18n";
import {
  IconOut,
  IconShieldSmall,
  IconStars,
  LOGO,
  calUrl,
  useReducedMotion,
  useSeenOnce,
} from "./commun";

const copy = {
  fr: {
    l1: "Vos équipes soignent.",
    l2: "Nos agents encaissent.",
    lead: "Opérationnel en 48 h sur vos portails. Rien à installer pour vos équipes.",
    btn: "Demander une démo",
    trust: "Garanties",
    hds: "Hébergé sur un cloud HDS",
    ue: "Données dans l’UE",
    rgpd: { avant: "Conforme ", b: "RGPD", apres: "" },
  },
  en: {
    l1: "Your teams care for patients.",
    l2: "Our agents get you paid.",
    lead: "Up and running in 48 hours on your portals. Nothing for your teams to install.",
    btn: "Book a demo",
    trust: "Commitments",
    hds: "Hosted on an HDS cloud",
    ue: "Data stays in the EU",
    rgpd: { avant: "", b: "GDPR", apres: " compliant" },
  },
};

export function CtaFin() {
  const { lang } = useLanguage();
  const posthog = usePostHog();
  const t = copy[lang];
  const rm = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const vu = useSeenOnce(ref, 0.3);

  /* le fond et le filigrane suivent la page ; la lumière suit la souris (pointeur fin seulement) */
  useEffect(() => {
    const s3 = ref.current;
    if (!s3 || rm) return;
    const prog = () => {
      const r = s3.getBoundingClientRect();
      if (r.bottom < -200 || r.top > window.innerHeight + 200) return;
      const vh = window.innerHeight;
      s3.style.setProperty(
        "--s",
        Math.min(1, Math.max(0, (vh - r.top) / (vh + r.height))).toFixed(4),
      );
    };
    prog();
    window.addEventListener("scroll", prog, { passive: true });
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    let px = 0.7;
    let py = 0.45;
    let gx = 0.7;
    let gy = 0.45;
    let raf = 0;
    const tick = () => {
      px += (gx - px) * 0.08;
      py += (gy - py) * 0.08;
      s3.style.setProperty("--px", px.toFixed(4));
      s3.style.setProperty("--py", py.toFixed(4));
      raf = Math.abs(px - gx) + Math.abs(py - gy) > 0.0005 ? requestAnimationFrame(tick) : 0;
    };
    const move = (e: PointerEvent) => {
      const r = s3.getBoundingClientRect();
      gx = (e.clientX - r.left) / r.width;
      gy = (e.clientY - r.top) / r.height;
      if (!raf) raf = requestAnimationFrame(tick);
    };
    if (fine) s3.addEventListener("pointermove", move);
    return () => {
      window.removeEventListener("scroll", prog);
      s3.removeEventListener("pointermove", move);
      cancelAnimationFrame(raf);
    };
  }, [rm]);

  return (
    <div className="acc-ct-root" id="cta">
      <section
        className={"acc-ct3" + (vu || rm ? " in" : "")}
        id="demo"
        ref={ref}
        aria-labelledby="acc-ct3-t"
      >
        <div className="acc-ct3-grad" aria-hidden="true" />
        <div className="acc-ct3-veil" aria-hidden="true" />
        <div className="acc-ct3-light" aria-hidden="true" />
        <img className="acc-ct3-motif" src={LOGO.symboleRose} alt="" aria-hidden="true" />
        <div className="acc-wrap acc-ct3-body">
          <h2 className="acc-ct-h2" id="acc-ct3-t">
            <span>
              <span className="acc-ct-ln" style={{ ["--i" as string]: 0 }}>
                {t.l1}
              </span>
            </span>{" "}
            <span className="acc-ct-acc">
              <span className="acc-ct-ln" style={{ ["--i" as string]: 1 }}>
                {t.l2}
              </span>
            </span>
          </h2>
          <p className="acc-ct-lead acc-ct3-fade" style={{ ["--i" as string]: 2 }}>
            {t.lead}
          </p>
          <div className="acc-ct3-fade" style={{ ["--i" as string]: 3 }}>
            <a
              className="acc-btn-lg acc-ct-btn"
              href={calUrl("bandeau_bas")}
              target="_blank"
              rel="noopener"
              onClick={() => posthog?.capture("demo_booking_clicked", { placement: "bandeau_bas" })}
            >
              {t.btn}
              <IconOut />
            </a>
          </div>
          <div className="acc-ct3-fade" style={{ ["--i" as string]: 4 }}>
            <ul className="acc-ct-trust" aria-label={t.trust}>
              <li>
                <IconShieldSmall />
                {t.hds}
              </li>
              <li>
                <IconStars />
                {t.ue}
              </li>
              <li>
                {t.rgpd.avant}
                <b>{t.rgpd.b}</b>
                {t.rgpd.apres}
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
