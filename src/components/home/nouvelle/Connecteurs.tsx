/* Nouvelle home : section « Connecteurs » (maquette Last mile, sections.js § 1 et lm.css « 1. CONNECTEURS »).
   Une roue de 32 cartes (les 16 logiciels et organismes, deux fois) qui tourne seule en CSS ;
   la taille et la vitesse de la roue se recalculent à la largeur de l'écran, comme dans la maquette.
   La roue se met en pause hors écran et quand l'onglet est caché ; elle continue au survol (revue du 30 oct.). */
import { useEffect, useRef, type CSSProperties } from "react";
import { useLanguage, useReveal } from "./socle";
import "./connecteurs.css";

/* les 16 cartes, dans l'ordre de la maquette ; sq = logo carré (affiché plus haut) */
const CN: { f: string; n: string; sq?: boolean }[] = [
  { f: "amelipro.png", n: "AmeliPro", sq: true },
  { f: "almerys.png", n: "Almerys" },
  { f: "viamedis.png", n: "Viamedis" },
  { f: "santeclair.png", n: "Santéclair" },
  { f: "carte_blanche.png", n: "Carte Blanche" },
  { f: "sp_sante.png", n: "SP Santé" },
  { f: "ociane_matmut.png", n: "Ociane Matmut", sq: true },
  { f: "itelis.png", n: "Itelis" },
  { f: "seveane.png", n: "Sévéane" },
  { f: "groupama.png", n: "Groupama", sq: true },
  { f: "cosium.png", n: "Cosium" },
  { f: "actil.png", n: "Actil" },
  { f: "netsoins.png", n: "Netsoins", sq: true },
  { f: "oxantis.png", n: "Oxantis" },
  { f: "doctolib.svg", n: "Doctolib" },
  { f: "outlook.png", n: "Outlook", sq: true },
];
const N = CN.length * 2;

const copy = {
  fr: {
    titre: "Opérationnel en 48h. Déjà connecté à vos logiciels",
    chapo:
      "Les agents travaillent dans votre logiciel et sur vos portails avec leurs propres accès, comme le ferait une personne de l’équipe. Pas d’API à demander, pas de nouveau logiciel.",
    roue: "Logiciels et organismes où Granit travaille",
    statut: "Agent connecté",
  },
  en: {
    titre: "Live in 48 hours. No IT project",
    chapo:
      "The agents work in your software and on your portals with their own logins, just like a member of your team. No API to request, no new software.",
    roue: "Software and payers Granit works with",
    statut: "Agent connected",
  },
};

export function ConnecteursNouvelle() {
  const { lang } = useLanguage();
  const t = copy[lang];
  const secRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const wheelRef = useRef<HTMLUListElement>(null);
  useReveal(secRef);

  /* taille de la roue : le rayon, la largeur des cartes, la hauteur du cadre et la durée d'un tour (~34 px/s au sommet) */
  useEffect(() => {
    const stage = stageRef.current,
      wheel = wheelRef.current;
    if (!stage || !wheel) return;
    const card = wheel.querySelector<HTMLElement>(".lm-cn-card");
    const size = () => {
      const vw = stage.clientWidth,
        w = vw < 640 ? 168 : 212;
      const R = Math.max((w + 20) / (2 * Math.sin(Math.PI / N)), Math.min(1400, vw * 0.84));
      stage.style.setProperty("--cn-w", `${w}px`);
      stage.style.setProperty("--cn-r", `${R.toFixed(0)}px`);
      const h = card?.offsetHeight || w * 0.9;
      const th = Math.asin(Math.min(1, (vw / 2 + w / 2) / R)),
        drop = R * (1 - Math.cos(th));
      stage.style.setProperty(
        "--cn-top",
        `${Math.round(36 + h / 2)}px`,
      ); /* la moitié haute de la carte du sommet reste dans le cadre */
      stage.style.setProperty(
        "--cn-h",
        `${Math.round(36 + h + Math.min(drop * 0.55, 260) + 24)}px`,
      );
      stage.style.setProperty("--cn-dur", `${Math.round((2 * Math.PI * R) / 34)}s`);
    };
    size();
    window.addEventListener("resize", size);

    /* pause hors écran et onglet caché */
    let vis = true;
    const sync = () => wheel.classList.toggle("is-off", !vis || document.hidden);
    const io =
      "IntersectionObserver" in window
        ? new IntersectionObserver((es) => {
            vis = es[es.length - 1].isIntersecting;
            sync();
          })
        : null;
    io?.observe(stage);
    document.addEventListener("visibilitychange", sync);
    return () => {
      window.removeEventListener("resize", size);
      document.removeEventListener("visibilitychange", sync);
      io?.disconnect();
    };
  }, []);

  return (
    <section
      ref={secRef}
      className="lm-sec lm-dark lm-cn"
      id="connecteurs"
      aria-labelledby="lm-cn-t"
    >
      <div className="lm-wrap lm-cn-head">
        <h2 className="lm-h2" id="lm-cn-t" data-reveal>
          {t.titre}
          <span className="dot">.</span>
        </h2>
        <p className="lm-lead" data-reveal>
          {t.chapo}
        </p>
      </div>
      <div className="lm-cn-stage" ref={stageRef}>
        <ul className="lm-cn-wheel" ref={wheelRef} aria-label={t.roue}>
          {[0, 1].flatMap((k) =>
            CN.map((c, i) => {
              const j = k * CN.length + i;
              return (
                <li
                  key={j}
                  className="lm-cn-card"
                  style={{ "--a": `${((j * 360) / N).toFixed(3)}deg` } as CSSProperties}
                  aria-hidden={k ? true : undefined}
                >
                  <span className="lm-cn-logo">
                    <img
                      src={`/home/connecteurs/${c.f}`}
                      alt=""
                      className={c.sq ? "sq" : undefined}
                      loading="lazy"
                      decoding="async"
                    />
                  </span>
                  <span className="lm-cn-meta">
                    <b>{c.n}</b>
                    <small>
                      <i />
                      {t.statut}
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
