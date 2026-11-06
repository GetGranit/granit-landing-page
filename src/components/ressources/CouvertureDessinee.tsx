// Couverture d'un article : la fenêtre des fiches plateformes, avec une scène propre au sujet.
// Rendu statique, repris tel quel par l'image de partage ; mesures en unités --s, comme la fenêtre.
import type { CSSProperties } from "react";
import {
  coinDesPoints,
  couvertureDe,
  couvertureLangue,
  FONDS,
  type CouvertureFiche,
} from "@/lib/ressources/couverture";
import { useLanguage } from "@/lib/i18n";
import { estSymbole, logoPlateforme, nomFenetre } from "@/lib/ressources/logos";
import type { Fiche } from "@/lib/ressources/types";

type Elements = CouvertureFiche["elements"];

const SQUELETTES = [
  [62, 40],
  [54, 34],
  [70, 30],
  [50, 38],
];

function Squelette({ rang }: { rang: number }) {
  const [l1, l2] = SQUELETTES[rang % SQUELETTES.length];
  return (
    <span className="textes">
      <span className="l1" style={{ width: `${l1}%` }} />
      <span className="l2" style={{ width: `${l2}%` }} />
    </span>
  );
}

const CLASSE_ETAT = { fait: "accord", attente: "attente", alerte: "alerte" } as const;

function Badge({ etat, children }: { etat: Elements[number]["etat"]; children: string }) {
  return <span className={`badge ${CLASSE_ETAT[etat]}`}>{children}</span>;
}

function Statuts({ elements }: { elements: Elements }) {
  return elements.map((e, i) => (
    <div key={i} className={`ress-fenetre-ligne ${e.etat === "alerte" ? "vient alerte" : ""}`}>
      <Squelette rang={i} />
      <Badge etat={e.etat}>{e.label}</Badge>
    </div>
  ));
}

function Frise({ elements, badge }: { elements: Elements; badge?: string | null }) {
  const alerte = elements.some((e) => e.etat === "alerte");
  return (
    <>
      <div className="ress-sc-frise">
        {elements.map((e, i) => (
          <span key={i} className={`etape ${e.etat}`}>
            <i />
            {e.label}
          </span>
        ))}
      </div>
      <div className={`ress-fenetre-ligne ${alerte ? "vient alerte" : ""}`}>
        <Squelette rang={0} />
        {badge && <Badge etat={alerte ? "alerte" : "fait"}>{badge}</Badge>}
      </div>
      <div className="ress-fenetre-ligne">
        <Squelette rang={1} />
      </div>
    </>
  );
}

/** Attendu, reçu, écart : le premier élément occupe toute la largeur, le deuxième s'arrête avant. */
function Ecart({ elements }: { elements: Elements }) {
  const [attendu, recu, ecart] = elements;
  return (
    <div className="ress-sc-ecart">
      <div>
        {attendu?.label}
        <span className="piste">
          <span className="plein" />
        </span>
      </div>
      <div>
        {recu?.label}
        <span className="piste">
          <span className="recu" />
          <span className="manque">{ecart?.label}</span>
        </span>
      </div>
    </div>
  );
}

function Paliers({ elements }: { elements: Elements }) {
  const pas = elements.length > 1 ? 66 / (elements.length - 1) : 0;
  return (
    <div className="ress-sc-paliers">
      {elements.map((e, i) => (
        <span key={i} className="palier">
          <i
            className={e.etat === "alerte" ? "alerte" : `rang-${i}`}
            style={{ height: `${18 + pas * i}%` }}
          />
          <span>{e.label}</span>
        </span>
      ))}
    </div>
  );
}

function Controles({ elements }: { elements: Elements }) {
  return elements.map((e, i) => (
    <div key={i} className="ress-fenetre-ligne ress-sc-controle">
      <span className={`coche ${e.etat}`}>{e.etat === "fait" ? "✓" : ""}</span>
      <span className="libelle">{e.label}</span>
    </div>
  ));
}

function Options({ elements }: { elements: Elements }) {
  return (
    <div className="ress-sc-options">
      {elements.map((e, i) => (
        <span key={i} className={`option ${e.etat === "fait" ? "choisie" : ""}`}>
          {e.label}
          <i />
          <i className="court" />
        </span>
      ))}
    </div>
  );
}

const CRENEAUX = "m..g.m.g.m..g.m.g.g..m.g".split("");

function Agenda({ elements }: { elements: Elements }) {
  return (
    <>
      <div className="ress-sc-agenda">
        {CRENEAUX.map((c, i) => (
          <i key={i} className={c === "m" ? "ciel" : c === "g" ? "menthe" : undefined} />
        ))}
      </div>
      <div className="ress-sc-lien">
        {elements[0]?.label}
        <u />
        {elements[1]?.label}
      </div>
    </>
  );
}

const REMPLISSAGES = [0.75, 0.5, 0.9];

function Boucles({ elements }: { elements: Elements }) {
  const rayon = 42;
  const tour = 2 * Math.PI * rayon;
  return (
    <div className="ress-sc-boucles">
      {elements.map((e, i) => (
        <span key={i} className="boucle">
          <svg viewBox="0 0 100 100" aria-hidden>
            <circle cx="50" cy="50" r={rayon} className="fond" />
            <circle
              cx="50"
              cy="50"
              r={rayon}
              className={e.etat}
              strokeDasharray={`${tour * REMPLISSAGES[i % 3]} ${tour}`}
              transform="rotate(-90 50 50)"
            />
          </svg>
          {e.label}
        </span>
      ))}
    </div>
  );
}

function Contenu({ c }: { c: CouvertureFiche }) {
  const { scene, elements } = c;
  if (scene === "statuts") return <Statuts elements={elements} />;
  if (scene === "frise") return <Frise elements={elements} badge={c.badge} />;
  if (scene === "ecart") return <Ecart elements={elements} />;
  if (scene === "paliers") return <Paliers elements={elements} />;
  if (scene === "controles") return <Controles elements={elements} />;
  if (scene === "options") return <Options elements={elements} />;
  if (scene === "agenda") return <Agenda elements={elements} />;
  return <Boucles elements={elements} />;
}

function Barre({ c }: { c: CouvertureFiche }) {
  const logo = logoPlateforme(c.marque?.logo, "fenetre");
  return (
    <div className="ress-fenetre-barre">
      {logo ? (
        <>
          <img src={logo} alt="" className={estSymbole(logo) ? "symbole" : "logotype"} />
          {estSymbole(logo) && <span className="nom">{nomFenetre(c.marque!.nom)}</span>}
        </>
      ) : (
        <span className="nom">{c.titre}</span>
      )}
      <span className="ref">{c.repere}</span>
    </div>
  );
}

export function CouvertureDessinee({ fiche }: { fiche: Fiche }) {
  const { lang } = useLanguage();
  const c = couvertureLangue(couvertureDe(fiche), lang);
  const fond = FONDS[fiche.category];
  const [x, y] = coinDesPoints(fiche.slug);
  return (
    <div
      aria-hidden
      className={`ress-fenetre-scene ${fond ?? ""}`}
      style={{ "--points-x": x, "--points-y": y } as CSSProperties}
    >
      <div className="ress-fenetre">
        <Barre c={c} />
        <Contenu c={c} />
      </div>
    </div>
  );
}
