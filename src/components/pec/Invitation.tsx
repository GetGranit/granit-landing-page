import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

import { PORTAILS } from "@/lib/pec/essaiState";
import { Reassure, TextLink, bigBtn } from "./ui";

/** Portails mis en avant à côté de celui déjà fait (les plus courants en optique). */
const EN_AVANT = ["oxantis", "sp_sante", "santeclair", "almerys", "generation", "emoa"];
const VISIBLES = 4;

/**
 * Sous le résultat : « En faire d'autres ? ». Leviers assumés et vrais :
 * la 1re PEC est déjà faite (dotation), 1 portail sur N est branché
 * (progression entamée), on a donné avant de demander (réciprocité). Pas de
 * chiffre de preuve sociale tant qu'on n'en a pas de réel, pas d'urgence, et
 * « Plus tard » reste visible et neutre.
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
  const autres = PORTAILS.filter((p) => p.id !== platformId).sort(
    (a, b) => rang(a.id) - rang(b.id),
  );
  const total = autres.length + 1;
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
          ✓ Votre 1re PEC est faite
        </p>
        <h2
          className="font-serif text-[clamp(24px,5.4vw,30px)] leading-tight"
          style={{ color: "var(--text)", letterSpacing: "-.015em", textWrap: "balance" }}
        >
          En faire d'autres ?{" "}
          <span className="italic" style={{ color: "var(--terra)" }}>
            C'est quand même plus simple.
          </span>
        </h2>
        <p className="text-[15px]" style={{ color: "var(--text-muted)" }}>
          Connectez vos autres portails de tiers payant et faites vos prochaines PEC en quelques
          secondes.
        </p>
      </div>

      <ul className="flex flex-wrap justify-center gap-2" aria-label="Portails de tiers payant">
        <motion.li
          {...entree(0)}
          className="rounded-full px-3 py-1.5 text-[13px]"
          style={{ background: "var(--sage)", color: "#fff", fontWeight: 600 }}
        >
          ✓ {portail}
        </motion.li>
        {autres.slice(0, VISIBLES).map((p, i) => (
          <motion.li
            key={p.id}
            {...entree(i + 1)}
            className="rounded-full border border-dashed px-3 py-1.5 text-[13px]"
            style={{ borderColor: "var(--border2)", color: "var(--text-soft)", background: "#fff" }}
          >
            + {p.label}
          </motion.li>
        ))}
        {reste > 0 && (
          <motion.li
            {...entree(VISIBLES + 1)}
            className="px-1 py-1.5 text-[13px]"
            style={{ color: "var(--text-muted)" }}
          >
            et {reste} autres
          </motion.li>
        )}
      </ul>

      <div className="grid gap-1.5" id="pec-progression">
        <div className="h-1.5 overflow-hidden rounded-full" style={{ background: "var(--bg3)" }}>
          <motion.div
            className="h-full rounded-full"
            style={{ background: "var(--sage)" }}
            initial={reduce ? false : { width: 0 }}
            animate={{ width: `${Math.round((1 / total) * 100)}%` }}
            transition={{ duration: 0.6, delay: delay + 0.3 }}
          />
        </div>
        <p className="text-[13px]" style={{ color: "var(--text-muted)" }}>
          1 portail sur {total} déjà connecté
        </p>
      </div>

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
          <Reassure items={["Gratuit", "20 PEC offertes", "Sans carte bancaire"]} />
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
