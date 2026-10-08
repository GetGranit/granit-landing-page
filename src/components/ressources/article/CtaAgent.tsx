// Les deux appels à l'action d'un article : la carte collante de la colonne de droite et l'encart
// de fin. Tout se déduit de l'article, sans texte écrit article par article :
// - fiche plateforme (avec connecteur Granit) → nom et logo du portail dans le titre et la fenêtre ;
// - autre article → la phrase et l'animation de sa catégorie (categories.json).
// L'animation montre l'agent au travail : il remplit les champs, envoie, et le statut passe au vert.
// Rendu serveur et mouvement réduit : l'état final, figé (champs remplis, statut vert, chrono).
import { useEffect, useRef } from "react";
import { Link } from "@tanstack/react-router";
import { usePostHog } from "posthog-js/react";
import { categorie } from "@/lib/ressources/contenu";
import { estSymbole, logoPlateforme, nomFenetre } from "@/lib/ressources/logos";
import type { Plateforme, RessourceJson } from "@/lib/ressources/types";

/**
 * Adresse de l'essai gratuit (demande de PEC). Tant qu'elle est vide, le bouton principal reste
 * « Demander une démo » ; une fois renseignée, les articles « saisie de PEC » passent à
 * « Essayer gratuitement ».
 */
const ESSAI_GRATUIT = "";

/** Portail montré quand l'article ne parle pas d'une plateforme précise. */
const PORTAIL_DEFAUT = { nom: "Viamedis", logo: "/logos/viamedis.png" };

type Scene = {
  barre: string;
  bouton: string;
  /** Secondes affichées par le chrono à la fin. */
  duree: number;
  champs: [string, string][];
  /** Avant, pendant l'envoi, en attente, terminé. */
  statuts: [string, string, string, string];
  /** Ligne d'état, une par étape (3 champs, envoi, attente, fin). */
  etat: string[];
  etapes: [string, string, string];
};

const fmt = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

function scene(animation: "pec" | "controle" | "virements"): Scene {
  if (animation === "virements")
    return {
      barre: "Relevé · 7 h 02",
      bouton: "Valider",
      duree: 38,
      champs: [
        ["VIR VIAMEDIS 1 236,40 €", "→ 3 factures ✓"],
        ["VIR CPAM 92,16 €", "→ 1 facture ✓"],
        ["VIR SANTECLAIR 418,00 €", "→ 2 factures ✓"],
      ],
      statuts: ["À rapprocher", "Vérification…", "1 écart à voir", "Rapproché"],
      etat: [
        "L'agent lit le virement Viamedis…",
        "L'agent retrouve la facture Sécu…",
        "L'agent rattache Santéclair…",
        "L'agent valide le rapprochement…",
        "Contrôle des montants…",
        "3 virements rapprochés en 0:38",
      ],
      etapes: [
        "Il lit vos virements Sécu et mutuelles chaque matin",
        "Il les rattache à vos factures",
        "Il vous liste les écarts, et seulement eux",
      ],
    };
  if (animation === "controle")
    return {
      barre: "Contrôle",
      bouton: "Contrôler",
      duree: 21,
      champs: [
        ["N° adhérent", "1 284 556 702 ✓"],
        ["Code LPP verre", "2263508 corrigé"],
        ["Date ordonnance", "12/03/2025 ✓"],
      ],
      statuts: ["À vérifier", "Contrôle…", "1 code corrigé", "Prêt à envoyer"],
      etat: [
        "L'agent vérifie les droits…",
        "L'agent compare le code LPP au verre…",
        "L'agent contrôle l'ordonnance…",
        "L'agent valide le dossier…",
        "Comparaison avec la plateforme…",
        "Dossier contrôlé en 0:21",
      ],
      etapes: [
        "Il vérifie les droits du client sur la plateforme",
        "Il compare codes LPP, montants et ordonnance",
        "Il corrige avant l'envoi, pas après le rejet",
      ],
    };
  return {
    barre: "PEC",
    bouton: "Envoyer",
    duree: 47,
    champs: [
      ["N° adhérent", "1 284 556 702"],
      ["Équipement", "Unifocaux + monture"],
      ["Montant", "412,00 €"],
    ],
    statuts: ["À saisir", "Envoi…", "En instance", "Accordée"],
    etat: [
      "L'agent remplit le n° adhérent…",
      "L'agent saisit l'équipement…",
      "L'agent saisit le montant…",
      "L'agent envoie la demande…",
      "Réponse de la plateforme…",
      "PEC accordée en 0:47",
    ],
    etapes: [
      "Il recopie n° adhérent, équipement et montant depuis votre devis",
      "Il envoie et note le n° de demande",
      "Il vous prévient dès que c'est accordé",
    ],
  };
}

/** Tout ce que les deux appels à l'action affichent, déduit de l'article. */
function contenuCta(a: RessourceJson, p: Plateforme | null) {
  const cat = categorie(a.category)!;
  const connecteur = p && Object.keys(p.sources).some((k) => k.startsWith("granit"));
  const portail = a.type === "plateforme" && p && connecteur ? p : null;
  const s = scene(cat.animation);
  const pec = cat.animation === "pec";
  const essai = pec && ESSAI_GRATUIT !== "";
  const logo = logoPlateforme((portail ?? PORTAIL_DEFAUT).logo, "fenetre");
  return {
    cat,
    s,
    pec,
    essai,
    portail: { nom: nomFenetre((portail ?? PORTAIL_DEFAUT).nom), logo },
    etiquette: portail ? `Demande de PEC · ${nomFenetre(portail.nom)}` : `Agent · ${cat.court}`,
    titre: portail
      ? `Vos PEC ${nomFenetre(portail.nom)}, saisies pour vous en moins d'une minute`
      : cat.agent,
    fin: portail
      ? `La prochaine PEC ${nomFenetre(portail.nom)}, laissez l'agent la saisir.`
      : cat.fin,
    texteFin:
      cat.animation === "virements"
        ? "Chaque matin, il lit vos virements, les rattache à vos factures et vous liste ce qui manque encore."
        : cat.animation === "controle"
          ? "Avant chaque envoi, il compare le dossier à ce que la plateforme attend. Le dossier part juste du premier coup."
          : "Vous donnez le devis. L'agent remplit le portail, envoie la demande et surveille la réponse. Vous, vous restez avec votre client.",
    rassure:
      cat.animation === "virements"
        ? "Sécu, mutuelles et reste à charge, dans le même tableau"
        : cat.animation === "controle"
          ? "Droits, codes LPP, ordonnance : contrôlés avant chaque envoi"
          : essai
            ? "Gratuit pour commencer · branché sur vos portails en 48 h"
            : "Démo de 20 min · branché sur vos portails en 48 h",
  };
}

type Contenu = ReturnType<typeof contenuCta>;

/** Bouton principal : essai gratuit si l'adresse existe, sinon démo. */
function BoutonPrincipal({
  c,
  classe,
  position,
}: {
  c: Contenu;
  classe: string;
  position: "carte" | "encart";
}) {
  const posthog = usePostHog();
  const suivi = (cta: string) =>
    posthog?.capture("blog_cta_clicked", {
      position,
      cta,
      category: c.cat.slug,
      animation: c.cat.animation,
    });
  if (c.essai)
    return (
      <a href={ESSAI_GRATUIT} className={classe} onClick={() => suivi("essai_gratuit")}>
        Essayer gratuitement
      </a>
    );
  return (
    <Link to="/demo" className={classe} onClick={() => suivi("demo")}>
      {c.pec ? "Demander une démo" : "Voir l'agent en démo"}
    </Link>
  );
}

function BoutonSecondaire({
  c,
  classe,
  position,
}: {
  c: Contenu;
  classe: string;
  position: "carte" | "encart";
}) {
  const posthog = usePostHog();
  const suivi = (cta: string) =>
    posthog?.capture("blog_cta_clicked", {
      position,
      cta,
      category: c.cat.slug,
      animation: c.cat.animation,
    });
  if (c.essai)
    return (
      <Link to="/demo" className={classe} onClick={() => suivi("demo")}>
        {position === "carte" ? "ou voir une démo de 20 min" : "Demander une démo"}
      </Link>
    );
  return (
    <Link to="/agents" className={classe} onClick={() => suivi("agents")}>
      {position === "carte" ? "Tous les agents Granit" : "Tous les agents"}
    </Link>
  );
}

/**
 * La fenêtre animée. Rendue dans son état final ; à l'entrée dans l'écran, elle se rejoue deux
 * fois puis se fige (bouton « Revoir »). Hors écran ou mouvement réduit : état final.
 */
function FenetreAgent({ c }: { c: Contenu }) {
  const racine = useRef<HTMLDivElement>(null);
  const { s } = c;

  useEffect(() => {
    const el = racine.current;
    if (!el) return;
    const q = <T extends Element>(sel: string) => el.querySelector(sel) as T;
    const win = q<HTMLDivElement>(".ress-cta-fenetre");
    const cur = q<HTMLDivElement>(".ress-cta-curseur");
    const champs = [...el.querySelectorAll<HTMLDivElement>(".ress-cta-champ")];
    const bouton = q<HTMLSpanElement>(".ress-cta-envoyer");
    const pastille = q<HTMLSpanElement>(".ress-cta-pastille");
    const chrono = q<HTMLSpanElement>(".ress-cta-chrono");
    const etat = q<HTMLDivElement>(".ress-cta-etat");
    const texte = q<HTMLSpanElement>(".ress-cta-etat-texte");
    const revoir = q<HTMLButtonElement>(".ress-cta-revoir");
    let jeton = 0;
    let vu = false;
    const reduit = matchMedia("(prefers-reduced-motion: reduce)");

    const final = () => {
      champs.forEach((f, i) => {
        f.textContent = s.champs[i][1];
        f.className = "ress-cta-champ rempli";
      });
      pastille.textContent = s.statuts[3];
      pastille.className = "ress-cta-pastille ok";
      chrono.textContent = fmt(s.duree);
      chrono.classList.add("fini");
      etat.classList.add("repos");
      texte.textContent = s.etat[5];
    };

    const jouer = async (tours: number) => {
      const t = ++jeton;
      el.classList.remove("termine");
      if (reduit.matches) return final();
      const vivant = () => t === jeton && el.isConnected;
      const attendre = (ms: number) => new Promise((r) => setTimeout(r, ms));
      const vers = (cible: Element) => {
        const a = win.getBoundingClientRect();
        const b = cible.getBoundingClientRect();
        cur.style.transform = `translate(${b.left - a.left + Math.min(b.width * 0.35, 60)}px, ${b.top - a.top + b.height * 0.45}px)`;
      };
      const clic = () => {
        cur.classList.remove("clic");
        void cur.offsetWidth;
        cur.classList.add("clic");
      };
      el.classList.add("joue");
      for (let n = 0; n < tours && vivant(); n++) {
        champs.forEach((f) => {
          f.textContent = "";
          f.className = "ress-cta-champ";
        });
        pastille.textContent = s.statuts[0];
        pastille.className = "ress-cta-pastille";
        chrono.textContent = "0:00";
        chrono.classList.remove("fini");
        etat.classList.remove("repos");
        cur.style.transition = "none";
        cur.style.transform = `translate(${win.clientWidth - 30}px, -30px)`;
        await attendre(30);
        cur.style.transition = "";
        // Le chrono défile de 0:00 jusqu'à la durée, compressé sur le temps de la saisie.
        const t0 = performance.now();
        let defile = true;
        const tic = () => {
          if (!defile || !vivant()) return;
          const v = Math.min(s.duree - 1, Math.floor(((performance.now() - t0) / 4600) * s.duree));
          chrono.textContent = fmt(v);
          requestAnimationFrame(tic);
        };
        tic();
        for (let i = 0; i < champs.length && vivant(); i++) {
          texte.textContent = s.etat[i];
          vers(champs[i]);
          await attendre(560);
          clic();
          champs[i].classList.add("focus");
          const v = s.champs[i][1];
          for (let k = 1; k <= v.length && vivant(); k++) {
            champs[i].textContent = v.slice(0, k);
            await attendre(32);
          }
          champs[i].className = "ress-cta-champ rempli";
          await attendre(180);
        }
        if (!vivant()) return;
        texte.textContent = s.etat[3];
        vers(bouton);
        await attendre(560);
        clic();
        bouton.classList.add("appui");
        pastille.textContent = s.statuts[1];
        pastille.className = "ress-cta-pastille envoi";
        await attendre(200);
        bouton.classList.remove("appui");
        cur.style.transform = `translate(${win.clientWidth - 30}px, ${win.clientHeight + 20}px)`;
        await attendre(700);
        if (!vivant()) return;
        texte.textContent = s.etat[4];
        pastille.textContent = s.statuts[2];
        pastille.className = "ress-cta-pastille attente";
        await attendre(950);
        if (!vivant()) return;
        defile = false;
        final();
        await attendre(2600);
      }
      if (vivant()) {
        el.classList.remove("joue");
        el.classList.add("termine");
      }
    };

    revoir.onclick = () => void jouer(1);
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !vu) {
          vu = true;
          void jouer(2);
        } else if (!e.isIntersecting && vu && !el.classList.contains("termine")) {
          jeton++;
          final();
          el.classList.remove("joue");
          el.classList.add("termine");
        }
      },
      { threshold: 0.5 },
    );
    io.observe(el);
    return () => {
      jeton++;
      io.disconnect();
    };
  }, [s]);

  const { portail } = c;
  const marque =
    c.cat.animation === "virements" ? (
      <span className="ress-cta-initiale banque">€</span>
    ) : portail.logo ? (
      <>
        <img
          src={portail.logo}
          alt=""
          className={estSymbole(portail.logo) ? "symbole" : "logotype"}
        />
        {estSymbole(portail.logo) && <span>{portail.nom}</span>}
      </>
    ) : (
      <>
        <span className="ress-cta-initiale">{portail.nom.slice(0, 1).toUpperCase()}</span>
        <span>{portail.nom}</span>
      </>
    );

  return (
    <div ref={racine} className="ress-cta-demo" role="img" aria-label={s.etat[5]}>
      <div className="ress-cta-fenetre">
        <div className="ress-cta-barre">
          <span className="ress-cta-points" aria-hidden>
            <i />
            <i />
            <i />
          </span>
          <span className="ress-cta-portail">
            {marque}
            <span className="ref">{s.barre}</span>
          </span>
          <span className="ress-cta-chrono fini">{fmt(s.duree)}</span>
        </div>
        <div className="ress-cta-corps">
          {s.champs.map(([libelle, valeur]) => (
            <div key={libelle} className="ress-cta-ligne">
              <span className="libelle">{libelle}</span>
              <div className="ress-cta-champ rempli">{valeur}</div>
            </div>
          ))}
          <div className="ress-cta-pied">
            <span className="ress-cta-envoyer">{s.bouton}</span>
            <span className="ress-cta-pastille ok">{s.statuts[3]}</span>
          </div>
        </div>
        <div className="ress-cta-curseur" aria-hidden>
          <svg viewBox="0 0 16 16">
            <path
              d="M2 1l11 7-5 1-2 5z"
              fill="#fff"
              stroke="#1c1108"
              strokeWidth="1.2"
              strokeLinejoin="round"
            />
          </svg>
          <span>Agent Granit</span>
        </div>
      </div>
      <div className="ress-cta-etat repos" aria-hidden>
        <span className="ress-cta-etat-texte">{s.etat[5]}</span>
        <button type="button" className="ress-cta-revoir" tabIndex={-1}>
          ↻ Revoir
        </button>
      </div>
    </div>
  );
}

/** Carte de la colonne de droite, collante sous le sommaire. */
export function CarteAgent({
  article,
  plateforme,
}: {
  article: RessourceJson;
  plateforme: Plateforme | null;
}) {
  const c = contenuCta(article, plateforme);
  return (
    <div className="ress-cta-carte">
      <p className="ress-cta-etiquette">{c.etiquette}</p>
      <p className="mt-2 font-serif text-[21px] leading-[1.22] text-white">{c.titre}</p>
      <div className="mt-4">
        <FenetreAgent c={c} />
      </div>
      <div className="mt-4 flex flex-col gap-2">
        <BoutonPrincipal c={c} position="carte" classe="ress-cta-bouton" />
        <BoutonSecondaire c={c} position="carte" classe="ress-cta-lien" />
      </div>
      <p className="ress-cta-rassure">{c.rassure}</p>
    </div>
  );
}

/** Encart de fin d'article : la promesse, les trois gestes de l'agent, la même animation. */
export function EncartAgent({
  article,
  plateforme,
}: {
  article: RessourceJson;
  plateforme: Plateforme | null;
}) {
  const c = contenuCta(article, plateforme);
  return (
    <section className="mx-auto mb-20 mt-14 max-w-[1280px] px-4 md:px-6">
      <div className="ress-cta-encart">
        <div>
          <p className="ress-cta-etiquette">À la fin de cet article</p>
          <h2 className="mt-2.5 font-serif text-[clamp(26px,3.2vw,36px)] font-normal leading-[1.15]">
            {c.fin}
          </h2>
          <p className="mt-3 max-w-[46ch] text-[16px] leading-relaxed text-[#c9bfb0]">
            {c.texteFin}
          </p>
          <ol className="ress-cta-etapes">
            {c.s.etapes.map((e, i) => (
              <li key={e}>
                <span className="n">{i + 1}</span>
                {e}
              </li>
            ))}
          </ol>
          <div className="mt-6 flex flex-col gap-2.5 sm:flex-row sm:items-center">
            <BoutonPrincipal c={c} position="encart" classe="btn-primary justify-center" />
            <BoutonSecondaire c={c} position="encart" classe="ress-cta-fantome" />
          </div>
          <p className="ress-cta-rassure gauche">{c.rassure}</p>
        </div>
        <FenetreAgent c={c} />
      </div>
    </section>
  );
}
