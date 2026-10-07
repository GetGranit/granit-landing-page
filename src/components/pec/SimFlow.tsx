import { useEffect, useRef, useState } from "react";

import { PaulSheet, usePaulSheet } from "@/components/essai/PaulSheet";
import { canalCode, simulationEnDirect, startSimulation, type SimEchecCause, type SimEtape, type SimulationSession } from "@/lib/pec/simulation";
import { StepCode } from "./StepCode";
import { StepLogin } from "./StepLogin";
import { StepPatient, type Patient, type PatientPrefill } from "./StepPatient";
import { StepSimDone, StepSimEchec, type SimResultat } from "./StepSimFin";
import { StepSimulation } from "./StepSimulation";
import { ApercuBanner } from "./ui";

const CALCOM = import.meta.env.VITE_PEC_CALCOM_URL || "/#demo";

type Phase =
  | { p: "patient" }
  | { p: "login"; refuse?: boolean }
  | { p: "code"; canal: "totp" | "email"; essai: number }
  | { p: "running" }
  | { p: "done"; r: SimResultat }
  | { p: "echec"; cause: SimEchecCause };

const PROGRESS: Record<Phase["p"], number> = { patient: 4, login: 5, code: 6, running: 7, done: 8, echec: 7 };

/**
 * E4 → E8 · la simulation en direct sur le portail de l'opticien : patient,
 * connexion, code, simulation, résultat (ou échec rattrapable). Le patient et
 * les identifiants ne vivent qu'ici, en mémoire, et ne remontent jamais.
 */
export function SimFlow({
  platformId,
  portail,
  prefill,
  busy,
  track,
  onProgress,
  onBack,
  onEmail,
}: {
  /** Portail réel (Kalixia → viamedis). */
  platformId: string;
  portail: string;
  prefill?: PatientPrefill;
  busy: boolean;
  track: (e: string, p?: Record<string, unknown>) => void;
  onProgress: (n: number) => void;
  onBack: () => void;
  onEmail: (email: string, r: SimResultat) => void;
}) {
  const [phase, setPhase] = useState<Phase>({ p: "patient" });
  const [patient, setPatient] = useState<Patient>();
  const [etape, setEtape] = useState<SimEtape>("connexion");
  const [identifiant, setIdentifiant] = useState<string>();
  const creds = useRef<{ identifiant: string; motDePasse: string } | null>(null);
  const session = useRef<SimulationSession | null>(null);
  const t0 = useRef(0);
  const paul = usePaulSheet();
  const apercu = !simulationEnDirect();

  useEffect(() => onProgress(PROGRESS[phase.p]), [phase.p, onProgress]);
  useEffect(() => () => session.current?.cancel(), []);

  function lancer(pat: Patient) {
    const c = creds.current;
    if (!c) return setPhase({ p: "login" });
    session.current?.cancel();
    const s = startSimulation({ platformId, ...pat, ...c });
    session.current = s;
    t0.current = Date.now();
    setEtape("connexion");
    setPhase({ p: "running" });
    s.onEvent((e) => {
      if (e.type === "etape") {
        setEtape(e.etape);
        setPhase((ph) => (ph.p === "code" ? { p: "running" } : ph));
      } else if (e.type === "code_requis") {
        setPhase({ p: "code", canal: e.canal, essai: e.essai });
      } else if (e.type === "resultat") {
        creds.current = null;
        track("pec_simulation_ok", { platform: platformId, dureeSec: e.dureeSec, apercu });
        setPhase({ p: "done", r: e });
      } else {
        if (e.cause === "identifiants") creds.current = null;
        track("pec_simulation_echec", { platform: platformId, cause: e.cause, apercu });
        setPhase({ p: "echec", cause: e.cause });
        paul.show("creneau", "Le portail fait des siennes ? Paul vous montre la simulation sur votre compte, en 15 minutes.");
      }
    });
  }

  function openPaul() {
    paul.show("creneau", `Paul fait la simulation ${portail} avec vous, sur votre compte, en 15 minutes.`, { force: true });
  }

  function fix(cause: SimEchecCause) {
    if (cause === "identifiants") return setPhase({ p: "login", refuse: true });
    if (cause === "patient") return setPhase({ p: "patient" });
    if (patient) lancer(patient);
  }

  return (
    <>
      <div className="grid">
        {apercu && <ApercuBanner />}
        {phase.p === "patient" && (
          <StepPatient
            portail={portail}
            avecAdherent={platformId === "generation"}
            initial={patient}
            prefill={prefill}
            onBack={onBack}
            onSubmit={(p) => {
              setPatient(p);
              track("pec_patient_ok", { platform: platformId });
              if (creds.current) lancer(p);
              else setPhase({ p: "login" });
            }}
          />
        )}
        {phase.p === "login" && (
          <StepLogin
            key={phase.refuse ? "refuse" : "login"}
            portail={portail}
            identifiantInitial={identifiant}
            refuse={phase.refuse}
            onPaul={openPaul}
            onBack={() => setPhase({ p: "patient" })}
            onSubmit={(c) => {
              creds.current = c;
              setIdentifiant(c.identifiant);
              track("pec_portail_login", { platform: platformId, canal: canalCode(platformId) });
              if (patient) lancer(patient);
            }}
          />
        )}
        {phase.p === "code" && (
          <StepCode
            key={phase.essai}
            portail={portail}
            canal={phase.canal}
            essai={phase.essai}
            onPaul={openPaul}
            onSubmit={(code) => {
              track("pec_code_saisi", { platform: platformId, essai: phase.essai });
              session.current?.submitCode(code);
            }}
          />
        )}
        {phase.p === "running" && patient && <StepSimulation portail={portail} etape={etape} t0={t0.current} patient={patient} />}
        {phase.p === "done" && <StepSimDone portail={portail} r={phase.r} busy={busy} onEmail={(m) => onEmail(m, phase.r)} />}
        {phase.p === "echec" && <StepSimEchec portail={portail} cause={phase.cause} onFix={() => fix(phase.cause)} onPaul={openPaul} />}
      </div>
      <PaulSheet
        open={paul.open}
        mode={paul.mode}
        message={paul.message}
        onClose={paul.close}
        onContact={() => {
          track("pec_paul_creneau", { platform: platformId, phase: phase.p });
          window.open(CALCOM, "_blank", "noopener,noreferrer");
        }}
      />
    </>
  );
}
