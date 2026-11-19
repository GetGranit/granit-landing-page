// Petite scène animée de la carte Granit des outils : un agent fait, sous les yeux du lecteur, la tâche
// que l'outil vient d'expliquer (trois étapes cochées une à une, la pastille passe au vert, le chrono
// tourne). Exemple illustratif, annoncé comme tel. Rendu serveur et mouvement réduit : l'état final,
// figé. L'animation ne tourne que quand la carte est à l'écran.
import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import type { OutilId } from "@/lib/outils/socle/types";

type Scene = {
  barre: string;
  etapes: [string, string, string];
  statuts: [string, string];
  /** Secondes affichées à la fin. */
  duree: number;
};

const SCENES: Record<string, Scene> = {
  "codes-rejet": {
    barre: "Retour NOEMIE · 7 h 04",
    etapes: ["Rejet lu, cause trouvée", "Facture corrigée", "Facture renvoyée à la caisse"],
    statuts: ["Rejetée", "Renvoyée"],
    duree: 52,
  },
  remboursement: {
    barre: "Devis · verres classe A",
    etapes: ["Codes LPP vérifiés", "Prise en charge saisie", "Facture envoyée"],
    statuts: ["À saisir", "Envoyée"],
    duree: 47,
  },
  "mutuelle-portail": {
    barre: "Carte de tiers payant",
    etapes: ["Complémentaire reconnue", "Bon portail ouvert", "Prise en charge saisie"],
    statuts: ["À saisir", "Saisie"],
    duree: 44,
  },
};
const SCENE_DEFAUT = SCENES.remboursement;

const PAS = 1.1; // secondes entre deux étapes
const fmt = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

function Coche({ faite }: { faite: boolean }) {
  return (
    <span
      aria-hidden
      className="grid size-[18px] shrink-0 place-items-center rounded-full"
      style={{
        background: faite ? "var(--menthe)" : "transparent",
        border: faite ? "none" : "1.5px solid var(--sur-encre-secondaire)",
        transition: "background 200ms",
      }}
    >
      {faite && (
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="var(--encre)" strokeWidth="3.4">
          <path d="M20 6 9 17l-5-5" />
        </svg>
      )}
    </span>
  );
}

export function ScenePont({ outil }: { outil: OutilId }) {
  const s = SCENES[outil] ?? SCENE_DEFAUT;
  const ref = useRef<HTMLDivElement>(null);
  const visible = useInView(ref, { amount: 0.5 });
  const reduit = useReducedMotion();
  // 3 = état final (rendu serveur, mouvement réduit) ; 0 à 2 = étape en cours.
  const [etape, setEtape] = useState(3);
  const [secondes, setSecondes] = useState(s.duree);

  useEffect(() => {
    if (!visible || reduit) return;
    let annule = false;
    const minuteurs: ReturnType<typeof setTimeout>[] = [];
    const tour = () => {
      if (annule) return;
      setEtape(0);
      setSecondes(0);
      [1, 2, 3].forEach((n) => minuteurs.push(setTimeout(() => !annule && setEtape(n), n * PAS * 1000)));
      // le chrono monte jusqu'à la durée annoncée pendant les trois étapes
      const debut = performance.now();
      const total = 3 * PAS * 1000;
      const tic = () => {
        if (annule) return;
        const p = Math.min(1, (performance.now() - debut) / total);
        setSecondes(Math.round(p * s.duree));
        if (p < 1) requestAnimationFrame(tic);
      };
      requestAnimationFrame(tic);
      minuteurs.push(setTimeout(tour, 3 * PAS * 1000 + 3200)); // pause sur l'état final, puis on rejoue
    };
    tour();
    return () => {
      annule = true;
      minuteurs.forEach(clearTimeout);
      setEtape(3);
      setSecondes(s.duree);
    };
  }, [visible, reduit, s.duree]);

  const fini = etape >= 3;
  return (
    <div
      ref={ref}
      className="rounded-[12px] p-4 text-[14px]"
      style={{ background: "color-mix(in srgb, var(--rose) 6%, transparent)", border: "1px solid color-mix(in srgb, var(--rose) 14%, transparent)" }}
      aria-label={`Exemple : un agent Granit, ${s.etapes.join(", ").toLowerCase()}.`}
      role="img"
    >
      <div className="flex items-center justify-between gap-3">
        <span className="text-[12px]" style={{ color: "var(--sur-encre-secondaire)" }}>
          {s.barre}
        </span>
        <motion.span
          key={fini ? "fini" : "en-cours"}
          initial={reduit ? false : { scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 420, damping: 22 }}
          className="rounded-full px-2.5 py-0.5 text-[12px] font-semibold"
          style={
            fini
              ? { background: "var(--menthe)", color: "var(--encre)" }
              : { background: "color-mix(in srgb, var(--rose) 12%, transparent)", color: "var(--rose)" }
          }
        >
          {fini ? s.statuts[1] : s.statuts[0]}
        </motion.span>
      </div>
      <ul className="mt-3 space-y-2.5">
        {s.etapes.map((texte, i) => {
          const faite = etape > i;
          const active = etape === i;
          return (
            <motion.li
              key={texte}
              className="flex items-center gap-2.5"
              animate={{ opacity: faite || active ? 1 : 0.4, x: active ? 4 : 0 }}
              transition={{ duration: 0.25 }}
            >
              <Coche faite={faite} />
              <span>{texte}</span>
            </motion.li>
          );
        })}
      </ul>
      <div
        className="mt-3 flex items-center justify-between border-t pt-2.5 text-[12px]"
        style={{ borderColor: "color-mix(in srgb, var(--rose) 14%, transparent)", color: "var(--sur-encre-secondaire)" }}
      >
        <span>Exemple de tâche d'un agent</span>
        <span className="num-tabular" style={{ color: fini ? "var(--menthe)" : undefined }}>
          {fmt(secondes)}
        </span>
      </div>
    </div>
  );
}
