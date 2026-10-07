import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

import { Kicker, Muted, Screen, Title } from "./ui";

const STEPS = ["Photo reçue", "Mutuelle lue", "Portail trouvé"];

/**
 * E2 · la lecture. La photo reste floutée à l'écran (on montre qu'on ne
 * s'intéresse pas au patient) pendant qu'un trait de scan la parcourt. Les
 * coches avancent avec le temps, la dernière n'arrive qu'avec la vraie réponse.
 */
export function StepReading({
  previewUrl,
  done,
  onFinished,
}: {
  previewUrl?: string;
  done: boolean;
  onFinished: () => void;
}) {
  const reduce = useReducedMotion();
  const [n, setN] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setN(1), reduce ? 0 : 500);
    const t2 = setTimeout(() => setN((v) => Math.max(v, 2)), reduce ? 0 : 1400);
    return () => {
      clearTimeout(t);
      clearTimeout(t2);
    };
  }, [reduce]);

  useEffect(() => {
    if (!done || n < 2) return;
    setN(3);
    const t = setTimeout(onFinished, reduce ? 0 : 650);
    return () => clearTimeout(t);
  }, [done, n, onFinished, reduce]);

  return (
    <Screen id="reading">
      <Kicker>Lecture de la carte</Kicker>
      <Title em="quelques secondes">On regarde ça, </Title>

      <div
        className="ph-no-capture relative aspect-[1.586] w-full max-w-[340px] overflow-hidden rounded-2xl border"
        style={{ borderColor: "var(--border)", background: "var(--bg2)" }}
      >
        {previewUrl ? (
          <img
            src={previewUrl}
            alt=""
            className="h-full w-full object-cover"
            style={{ filter: "blur(9px) saturate(.7)", transform: "scale(1.08)" }}
          />
        ) : (
          <ExampleCard />
        )}
        {!reduce && (
          <motion.span
            aria-hidden
            className="absolute inset-x-0 h-10"
            style={{
              background:
                "linear-gradient(180deg,transparent,color-mix(in oklab,var(--terra) 35%,transparent),transparent)",
            }}
            initial={{ top: "-20%" }}
            animate={{ top: "110%" }}
            transition={{ duration: 1.2, repeat: Infinity, ease: [0.22, 1, 0.36, 1] }}
          />
        )}
        {previewUrl && (
          <span
            className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full px-3 py-1 text-[11px]"
            style={{
              background: "rgba(255,255,255,.85)",
              fontFamily: "var(--font-mono)",
              color: "var(--text-muted)",
            }}
          >
            identité du patient masquée
          </span>
        )}
      </div>

      <ol className="grid w-full max-w-[340px] gap-2 text-left">
        {STEPS.map((label, i) => {
          const ok = n > i;
          const working = n === i;
          return (
            <li
              key={label}
              className="flex items-center gap-3 transition-opacity"
              style={{ opacity: ok || working ? 1 : 0.35 }}
            >
              <span
                className={`grid h-7 w-7 place-items-center rounded-full border-[1.5px] text-[14px] ${working && !reduce ? "animate-spin" : ""}`}
                style={{
                  borderColor: ok ? "var(--sage)" : "var(--terra)",
                  borderTopColor: working ? "transparent" : undefined,
                  background: ok ? "var(--sage)" : "#fff",
                  color: "#fff",
                }}
              >
                {ok ? "✓" : ""}
              </span>
              <span style={{ color: "var(--text)", fontWeight: 500 }}>{label}</span>
            </li>
          );
        })}
      </ol>
      <Muted>La photo n'est pas conservée.</Muted>
    </Screen>
  );
}

/** Carte fictive dessinée pour le parcours « carte d'exemple » (aucune vraie donnée). */
function ExampleCard() {
  const mono = { fontFamily: "var(--font-mono)" };
  return (
    <div
      className="grid h-full w-full grid-rows-[auto_1fr_auto] gap-2 p-4 text-left text-[11px]"
      style={{ background: "linear-gradient(135deg,#eef3f8,#dfe8f1)", color: "#2b3a4a" }}
    >
      <div className="flex items-center justify-between">
        <b className="text-[13px]">Mutuelle Exemple</b>
        <span
          className="rounded px-1.5 py-0.5 text-[10px] text-white"
          style={{ background: "#34495e" }}
        >
          TIERS PAYANT
        </span>
      </div>
      <div className="grid content-start gap-1" style={mono}>
        <span>Bénéficiaire : Mme C. EXEMPLE</span>
        <span>N° AMC : 99999999</span>
        <span>Réseau : Kalixia</span>
      </div>
      <div className="grid grid-cols-4 gap-1 text-center text-[10px]" style={mono}>
        {["PHAR", "HOSP", "DENT", "OPTI"].map((c) => (
          <span
            key={c}
            className="rounded border bg-white/70 py-0.5"
            style={{ borderColor: "#b8c6d4" }}
          >
            {c}
            <br />
            {c === "OPTI" ? "KALIXIA" : "PEC"}
          </span>
        ))}
      </div>
    </div>
  );
}
