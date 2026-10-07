import { useCallback, useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { motion, useReducedMotion } from "framer-motion";

import logo from "@/assets/logo.svg";
import { BranchezStep } from "@/components/essai/BranchezStep";
import { LogicielStep } from "@/components/essai/LogicielStep";
import { PaulSheet, usePaulSheet } from "@/components/essai/PaulSheet";
import { ResultStep } from "@/components/essai/ResultStep";
import { SimulationStep } from "@/components/essai/SimulationStep";
import { Kicker, Title } from "@/components/essai/ui";
import {
  EXAMPLE_CASE,
  VIAMEDIS,
  contactPaul,
  readCase,
  readPhone,
  type ContactRequest,
  type PecCase,
} from "@/lib/pec/essaiState";

/**
 * Espace d'essai freemium (aperçu, tout est simulé côté front).
 * Arrivée depuis /pec avec le cas scanné dans sessionStorage ; `?echec=1`
 * force l'écran d'échec pour la démo. Hors navigation, hors sitemap, noindex.
 */
export const Route = createFileRoute("/essai")({
  // Paramètre optionnel : un lien vers /essai n'a pas à le fournir.
  validateSearch: (search: Record<string, unknown>): { echec?: boolean } =>
    search.echec === 1 || search.echec === "1" || search.echec === true ? { echec: true } : {},
  head: () => ({
    meta: [
      { title: "Votre espace d'essai - Granit AI" },
      { name: "robots", content: "noindex, nofollow" },
      {
        name: "description",
        content: "Lancez votre première prise en charge avec Granit, en simulation.",
      },
    ],
  }),
  component: EssaiPage,
});

type Step = "branchez" | "simulation" | "resultat" | "logiciel";

function EssaiPage() {
  const { echec } = Route.useSearch();
  const reduce = useReducedMotion();
  const [pecCase, setPecCase] = useState<PecCase | null>(null);
  const [step, setStep] = useState<Step>("branchez");
  const [phone, setPhone] = useState<string | null>(null);
  const sheet = usePaulSheet();

  // sessionStorage n'existe que côté navigateur : lecture après le montage.
  useEffect(() => {
    const stored = readCase();
    setPecCase(stored?.platform ? stored : EXAMPLE_CASE);
    setPhone(readPhone());
  }, []);

  const platform = pecCase?.platform ?? VIAMEDIS;
  const { show, close } = sheet;

  // Nouvel écran : on remonte en haut et on range le bandeau de l'écran précédent.
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
    close();
    if (step === "resultat" && echec) {
      show("creneau", "Paul reprend votre dossier. Dites-lui quand vous êtes disponible.");
    }
  }, [step, reduce, close, show, echec]);

  const onIdle = useCallback(
    () =>
      show(
        "rappel",
        `Besoin d'un coup de main pour brancher ${platform.label} ? Paul vous rappelle.`,
      ),
    [show, platform.label],
  );

  async function onContact(req: ContactRequest) {
    if (!pecCase) return;
    await contactPaul(req, pecCase);
    if (req.phone) setPhone(req.phone);
  }

  function endSimulation() {
    setStep("resultat");
  }

  let content: React.ReactNode = null;
  if (pecCase && !platform.simulable) {
    content = (
      <NotSimulable
        label={platform.label}
        onAskPaul={() => show("rappel", undefined, { force: true })}
      />
    );
  } else if (pecCase && step === "branchez") {
    content = (
      <BranchezStep
        platform={platform}
        onDone={() => setStep("simulation")}
        onIdle={onIdle}
        onDelicateTfa={() =>
          show(
            "rappel",
            "C'est l'étape la plus délicate. Paul peut la faire avec vous en 3 minutes.",
          )
        }
        onAskPaul={() =>
          show("rappel", "Paul vous rappelle et branche le portail avec vous.", { force: true })
        }
      />
    );
  } else if (pecCase && step === "simulation") {
    content = <SimulationStep pecCase={pecCase} platform={platform} onEnd={endSimulation} />;
  } else if (pecCase && step === "resultat") {
    content = (
      <ResultStep
        pecCase={pecCase}
        platform={platform}
        echec={Boolean(echec)}
        onSendForReal={() =>
          show(
            "creneau",
            "Pour l'instant, l'envoi réel se fait avec Paul : 15 minutes ensemble et votre PEC part.",
            { force: true },
          )
        }
        onNext={() => setStep("logiciel")}
      />
    );
  } else if (pecCase && step === "logiciel") {
    content = (
      <LogicielStep
        onAskPaul={() =>
          show("creneau", "Paul ouvre votre essai et branche vos accès avec vous.", { force: true })
        }
      />
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      <div
        className="px-4 py-2 text-center text-[11px] leading-[1.4]"
        style={{
          background: "var(--bg3)",
          color: "var(--text-soft)",
          fontFamily: "var(--font-mono)",
        }}
      >
        Aperçu de l'espace d'essai · rien n'est encore connecté à votre portail
      </div>
      <header className="mx-auto flex max-w-[480px] items-center justify-between px-4 py-4">
        <a href="/" aria-label="Granit, accueil">
          <img src={logo} alt="Granit" className="h-[24px] w-auto" />
        </a>
        {pecCase?.source === "exemple" && (
          <span
            className="rounded-full px-3 py-1 text-[11px]"
            style={{
              background: "var(--tag-bg)",
              color: "var(--text-soft)",
              fontFamily: "var(--font-mono)",
            }}
          >
            Cas d'exemple · {pecCase.mutuelle ?? "Mutuelle Exemple"}
          </span>
        )}
      </header>

      <main className="mx-auto max-w-[480px] px-4 pb-48 pt-2">
        {/* Pas d'AnimatePresence "wait" : une sortie bloquée (onglet en arrière-plan)
            laisserait l'écran vide. Chaque écran entre simplement en fondu. */}
        {pecCase && (
          <motion.div
            key={step}
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {content}
          </motion.div>
        )}
      </main>

      <PaulSheet
        open={sheet.open}
        mode={sheet.mode}
        message={sheet.message}
        knownPhone={phone}
        onClose={sheet.close}
        onContact={onContact}
      />
    </div>
  );
}

function NotSimulable({ label, onAskPaul }: { label: string; onAskPaul: () => void }) {
  return (
    <div>
      <Kicker>Aperçu</Kicker>
      <Title lead={`${label}, on le branche`} accent="avec vous." />
      <p className="mt-4 text-[16px] leading-[1.5]" style={{ color: "var(--text-soft)" }}>
        Ce portail ne se simule pas encore en ligne. Paul le branche avec vous au téléphone, et
        votre première PEC part dans la foulée.
      </p>
      <button
        type="button"
        onClick={onAskPaul}
        className="btn-primary mt-6 w-full justify-center py-3.5 text-[16px]"
      >
        Le faire avec Paul
      </button>
      <div className="mt-4 text-center">
        <a
          href="/pec"
          className="text-[14px] underline-offset-4 hover:underline"
          style={{ color: "var(--terra)" }}
        >
          Revenir à ma carte
        </a>
      </div>
    </div>
  );
}
