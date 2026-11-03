/* Accueil : les connecteurs, une roue de cartes qui tourne seule (CSS), en pause hors écran.
   « Mouvements réduits » : la roue s'arrête. Logos : ceux de public/logos quand ils existent, sinon public/accueil. */
import { useEffect, useRef } from "react";
import { useLanguage } from "@/lib/i18n";

const copy = {
  fr: {
    h: "Opérationnel en 48\u00a0h. Déjà connecté à vos logiciels",
    lead: "Les agents travaillent dans votre logiciel et sur vos portails avec leurs propres accès, comme le ferait une personne de l’équipe. Pas d’API à demander, pas de nouveau logiciel.",
    wheel: "Logiciels et organismes où Granit travaille",
    connected: "Agent connecté",
  },
  en: {
    h: "Up and running in 48 hours. Already connected to your software",
    lead: "The agents work in your software and on your portals with their own logins, just as a member of your team would. No API to request, no new software.",
    wheel: "Software and payers where Granit works",
    connected: "Agent connected",
  },
};

/* 16 cartes, dans l'ordre de la maquette ; sq : logo carré (affiché plus haut) */
const CN: [string, string, boolean?][] = [
  ["/accueil/connecteurs/amelipro.png", "AmeliPro", true],
  ["/logos/almerys.webp", "Almerys"],
  ["/logos/annuaire/viamedis.svg", "Viamedis"],
  ["/logos/santeclair.svg", "Santéclair"],
  ["/logos/carteblanche.svg", "Carte Blanche"],
  ["/logos/sp-sante.png", "SP Santé"],
  ["/accueil/connecteurs/ociane_matmut.png", "Ociane Matmut", true],
  ["/logos/annuaire/itelis.svg", "Itelis"],
  ["/accueil/connecteurs/seveane.png", "Sévéane"],
  ["/logos/annuaire/groupama.svg", "Groupama", true],
  ["/accueil/connecteurs/cosium.png", "Cosium"],
  ["/logos/actil.png", "Actil"],
  ["/accueil/connecteurs/netsoins.png", "Netsoins", true],
  ["/logos/oxantis-logotype.png", "Oxantis"],
  ["/accueil/connecteurs/doctolib.svg", "Doctolib"],
  ["/accueil/connecteurs/outlook.png", "Outlook", true],
];
const N = CN.length * 2;

export function Connecteurs() {
  const { lang } = useLanguage();
  const t = copy[lang];
  const stageRef = useRef<HTMLDivElement>(null);
  const wheelRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const stage = stageRef.current;
    const wheel = wheelRef.current;
    if (!stage || !wheel) return;
    const card = wheel.querySelector<HTMLElement>(".acc-cn-card");
    /* le rayon suit la largeur ; ~34 px/s au sommet de la roue, quelle que soit la largeur */
    const size = () => {
      const vw = stage.clientWidth;
      const w = vw < 640 ? 168 : 212;
      const R = Math.max((w + 20) / (2 * Math.sin(Math.PI / N)), Math.min(1400, vw * 0.84));
      stage.style.setProperty("--cn-w", w + "px");
      stage.style.setProperty("--cn-r", R.toFixed(0) + "px");
      const h = card?.offsetHeight || w * 0.9;
      const th = Math.asin(Math.min(1, (vw / 2 + w / 2) / R));
      const drop = R * (1 - Math.cos(th));
      stage.style.setProperty("--cn-top", Math.round(36 + h / 2) + "px");
      stage.style.setProperty(
        "--cn-h",
        Math.round(36 + h + Math.min(drop * 0.55, 260) + 24) + "px",
      );
      stage.style.setProperty("--cn-dur", Math.round((2 * Math.PI * R) / 34) + "s");
    };
    size();
    window.addEventListener("resize", size);
    const io = new IntersectionObserver((es) =>
      wheel.classList.toggle("is-off", !es[es.length - 1].isIntersecting),
    );
    io.observe(stage);
    return () => {
      window.removeEventListener("resize", size);
      io.disconnect();
    };
  }, []);

  return (
    <section className="acc-sec acc-dark acc-cn" id="connecteurs" aria-labelledby="acc-cn-t">
      <div className="acc-wrap acc-cn-head">
        <h2 className="acc-h2" id="acc-cn-t" data-reveal="">
          {t.h}
          <span className="dot">.</span>
        </h2>
        <p className="acc-lead" data-reveal="">
          {t.lead}
        </p>
      </div>
      <div className="acc-cn-stage" ref={stageRef}>
        <ul className="acc-cn-wheel" ref={wheelRef} aria-label={t.wheel}>
          {[0, 1].map((k) =>
            CN.map((c, i) => {
              const j = k * CN.length + i;
              return (
                <li
                  key={j}
                  className="acc-cn-card"
                  style={{ ["--a" as string]: ((j * 360) / N).toFixed(3) + "deg" }}
                  aria-hidden={k ? "true" : undefined}
                >
                  <span className="acc-cn-logo">
                    <img
                      src={c[0]}
                      alt=""
                      className={c[2] ? "sq" : undefined}
                      loading="lazy"
                      decoding="async"
                    />
                  </span>
                  <span className="acc-cn-meta">
                    <b>{c[1]}</b>
                    <small>
                      <i />
                      {t.connected}
                    </small>
                  </span>
                </li>
              );
            }),
          )}
        </ul>
      </div>
    </section>
  );
}
