import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

import { PORTAILS } from "@/lib/pec/essaiState";
import { platformById } from "@/lib/pec/resolve";
import { Reassure, TextLink, bigBtn } from "./ui";

/** Portails simulables, dans cet ordre (Viamédis, souvent celui déjà fait, en dernier). */
const SIMULABLES = ["generation", "emoa", "viamedis"];
/** Les plus courants en optique parmi ceux où Granit fait les vraies PEC. */
const EN_AVANT = ["sp_sante", "santeclair", "almerys"];
const VISIBLES = 3;

/**
 * Sous le résultat : « En faire d'autres ? ». D'abord les portails où l'on peut
 * simuler de la même façon, puis, avec un libellé honnête, ceux où Granit fait
 * les vraies PEC sans simulation. Pas de portail qui ferme (Oxantis) mis en
 * avant, pas de chiffre de preuve sociale tant qu'on n'en a pas de réel, pas
 * d'urgence, et « Plus tard » reste visible et neutre.
 */
export function Invitation({
  portail,
  platformId,
  delay,
  onCreer,
  onPlusTard,
}: {
  portail: string;
  platformId: string;
  /** Secondes : on attend la fin du count-up avant d'apparaître. */
  delay: number;
  /** `apresPlusTard` : le clic vient du lien affiché après « Plus tard ». */
  onCreer: (apresPlusTard: boolean) => void;
  onPlusTard: () => void;
}) {
  const reduce = useReducedMotion();
  const [plusTard, setPlusTard] = useState(false);
  const simulables = SIMULABLES.map((id) => PORTAILS.find((p) => p.id === id)).filter(
    (p) => p !== undefined,
  );
  const autres = PORTAILS.filter(
    (p) => !p.simulable && platformById(p.id)?.affichage !== "prevenir",
  ).sort((a, b) => rang(a.id) - rang(b.id));
  const reste = autres.length - VISIBLES;
  const entree = (i: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, x: 18, scale: 0.92 },
          animate: { opacity: 1, x: 0, scale: 1 },
          transition: {
            type: "spring" as const,
            stiffness: 420,
            damping: 26,
            delay: delay + 0.35 + i * 0.12,
          },
        };

  return (
    <motion.div
      id="pec-invitation"
      className="grid w-full gap-4 border-t pt-6"
      style={{ borderColor: "var(--border)" }}
      initial={reduce ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="grid gap-1.5">
        <p
          className="text-[12px]"
          style={{ fontFamily: "var(--font-mono)", color: "var(--sage)", letterSpacing: ".04em" }}
        >
          ✓ 1re simulation faite
        </p>
        <h2
          className="font-serif text-[clamp(24px,5.4vw,30px)] leading-tight"
          style={{ color: "var(--text)", letterSpacing: "-.015em", textWrap: "balance" }}
        >
          En faire d'autres ?{" "}
          <span style={{ color: "var(--terra)" }}>
            C'est quand même plus simple.
          </span>
        </h2>
        <p className="text-[15px]" style={{ color: "var(--text-muted)" }}>
          Simulez aussi sur vos autres portails, puis faites vos vraies PEC avec Granit.
        </p>
      </div>

      <ul className="flex flex-wrap justify-center gap-2" aria-label="Portails où simuler">
        {simulables.map((p, i) =>
          p.id === platformId ? (
            <motion.li
              key={p.id}
              {...entree(i)}
              className="rounded-full px-3 py-1.5 text-[13px]"
              style={{ background: "var(--sage)", color: "#fffdfd", fontWeight: 600 }}
            >
              ✓ {portail}
            </motion.li>
          ) : (
            <motion.li
              key={p.id}
              {...entree(i)}
              className="rounded-full border border-dashed px-3 py-1.5 text-[13px]"
              style={{
                borderColor: "var(--border2)",
                color: "var(--text-soft)",
                background: "#fffdfd",
              }}
            >
              + {p.label}
            </motion.li>
          ),
        )}
      </ul>
      {autres.length > 0 && (
        <p className="text-[13px]" style={{ color: "var(--text-muted)" }}>
          Pour vos vraies PEC :{" "}
          {autres
            .slice(0, VISIBLES)
            .map((p) => p.label)
            .join(", ")}
          {reste > 0 ? ` et ${reste} autres` : ""}.
        </p>
      )}

      {plusTard ? (
        <div className="grid justify-items-center gap-2">
          <p className="text-[15px]" style={{ color: "var(--text-muted)" }}>
            Entendu. Votre résultat reste affiché ici.
          </p>
          <TextLink onClick={() => onCreer(true)}>Créer mon compte gratuit</TextLink>
        </div>
      ) : (
        <div className="grid justify-items-center gap-3">
          <motion.button
            type="button"
            className={`${bigBtn} w-full`}
            onClick={() => onCreer(false)}
            initial={false}
            animate={reduce ? undefined : { scale: [1, 1.035, 1] }}
            transition={{ duration: 0.6, delay: delay + 0.35 + (VISIBLES + 2) * 0.12 }}
          >
            Créer mon compte gratuit <span className="arrow">→</span>
          </motion.button>
          <Reassure items={["Gratuit", "20 simulations offertes", "Sans carte bancaire"]} />
          <TextLink
            onClick={() => {
              setPlusTard(true);
              onPlusTard();
            }}
          >
            Plus tard
          </TextLink>
        </div>
      )}
    </motion.div>
  );
}

function rang(id: string) {
  const i = EN_AVANT.indexOf(id);
  return i === -1 ? EN_AVANT.length : i;
}
