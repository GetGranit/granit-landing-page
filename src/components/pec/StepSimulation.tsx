import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";

import { useLanguage } from "@/lib/i18n";
import { EQUIPEMENT_EXEMPLE, SIM_ETAPES, type SimEtape } from "@/lib/pec/simulation";
import type { Patient } from "./StepPatient";
import { Kicker, Muted, Screen, Title, euros } from "./ui";

const copy = {
  fr: {
    labels: {
      connexion: "Connexion au portail",
      code: "Code vérifié",
      beneficiaire: "Patient retrouvé",
      formulaire: "Demande remplie",
      chiffrage: "Chiffrage",
    } satisfies Record<SimEtape, string>,
    kicker: "Simulation en cours",
    title: "Granit travaille sur ",
    ecoule: "Temps écoulé",
    rien: "Rien n'est envoyé à la mutuelle : on s'arrête avant la validation.",
    beneficiaire: "Bénéficiaire",
    ne: "Né(e) le",
    prescripteur: "Prescripteur",
    entete: (portail: string) => `PORTAIL ${portail} · SIMULATION DE PRISE EN CHARGE`,
    pec: "Prise en charge",
    calcul: "⌛ calcul de la part mutuelle…",
    attente: "en attente",
  },
  en: {
    labels: {
      connexion: "Logging in to the portal",
      code: "Code verified",
      beneficiaire: "Patient found",
      formulaire: "Request filled in",
      chiffrage: "Pricing",
    } satisfies Record<SimEtape, string>,
    kicker: "Simulation in progress",
    title: "Granit is working on ",
    ecoule: "Time elapsed",
    rien: "Nothing is sent to the insurer: we stop before the final submission.",
    beneficiaire: "Beneficiary",
    ne: "Date of birth",
    prescripteur: "Prescriber",
    entete: (portail: string) => `${portail} PORTAL · COVERAGE SIMULATION`,
    pec: "Coverage",
    calcul: "⌛ calculating the insurer’s share…",
    attente: "pending",
  },
};

export function chrono(sec: number) {
  return `${String(Math.floor(sec / 60)).padStart(2, "0")}:${String(sec % 60).padStart(2, "0")}`;
}

/** NIR à l'écran : on garde le début pour que l'opticien reconnaisse son patient. */
const masque = (nir: string) =>
  `${nir.slice(0, 1)} ${nir.slice(1, 3)} ${nir.slice(3, 5)} •• ••• ••• ••`;

/**
 * E7 · la simulation tourne : chrono, étapes qui avancent au rythme des
 * événements du portail, formulaire qui se remplit. Aucune durée promise.
 */
export function StepSimulation({
  portail,
  etape,
  t0,
  patient,
}: {
  portail: string;
  etape: SimEtape;
  t0: number;
  patient: Patient;
}) {
  const t = copy[useLanguage().lang];
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(t);
  }, []);
  const idx = SIM_ETAPES.indexOf(etape);

  return (
    <Screen id="simulation">
      <Kicker>{t.kicker}</Kicker>
      <Title em={portail} after=".">
        {t.title}
      </Title>
      <span
        className="text-[34px]"
        style={{ fontFamily: "var(--font-mono)", color: "var(--text)" }}
        aria-label={t.ecoule}
      >
        {chrono(Math.max(0, Math.floor((now - t0) / 1000)))}
      </span>
      <ol className="grid w-full max-w-[340px] gap-2 text-left" aria-live="polite">
        {SIM_ETAPES.map((e, i) => (
          <Etape key={e} label={t.labels[e]} ok={i < idx} working={i === idx} />
        ))}
      </ol>
      <Formulaire
        portail={portail}
        patient={patient}
        remplis={idx >= 3}
        chiffre={idx >= 4}
        trouve={idx >= 2}
      />
      <Muted>{t.rien}</Muted>
    </Screen>
  );
}

function Etape({ label, ok, working }: { label: string; ok: boolean; working: boolean }) {
  const reduce = useReducedMotion();
  return (
    <li
      className="flex items-center gap-3 transition-opacity"
      style={{ opacity: ok || working ? 1 : 0.35 }}
    >
      <span
        className={`grid h-7 w-7 place-items-center rounded-full border-[1.5px] text-[14px] ${working && !reduce ? "animate-spin" : ""}`}
        style={{
          borderColor: ok ? "var(--succes)" : "var(--profond)",
          borderTopColor: working ? "transparent" : undefined,
          background: ok ? "var(--succes)" : "var(--papier)",
          color: "var(--rose)",
        }}
      >
        {ok ? "✓" : ""}
      </span>
      <span style={{ color: "var(--text)", fontWeight: 500 }}>{label}</span>
    </li>
  );
}

/** Le formulaire du portail, rempli champ par champ (les lettres se tapent). */
function Formulaire({
  portail,
  patient,
  trouve,
  remplis,
  chiffre,
}: {
  portail: string;
  patient: Patient;
  trouve: boolean;
  remplis: boolean;
  chiffre: boolean;
}) {
  const { lang } = useLanguage();
  const t = copy[lang];
  const lignes: [string, string, boolean][] = [
    [t.beneficiaire, masque(patient.nir), trouve],
    [t.ne, patient.dateNaissance, trouve],
    [t.prescripteur, patient.prescripteur, remplis],
    ...EQUIPEMENT_EXEMPLE.map((l): [string, string, boolean] => [
      l.label[lang],
      euros(l.montant, lang),
      remplis,
    ]),
  ];
  return (
    <div
      className="ph-no-capture w-full overflow-hidden rounded-xl border text-left text-[13px]"
      style={{ borderColor: "var(--border2)" }}
    >
      <div
        className="px-3 py-1.5 text-[11px] text-papier"
        style={{ background: "#34495e", fontFamily: "var(--font-mono)", letterSpacing: ".04em" }}
      >
        {t.entete(portail.toUpperCase())}
      </div>
      <dl className="grid grid-cols-2 gap-2 p-3" style={{ background: "#f5f7f9" }}>
        {lignes.map(([k, v, on]) => (
          <div key={k} className="grid gap-0.5">
            <dt className="text-[11px]" style={{ color: "#56606b" }}>
              {k}
            </dt>
            <dd
              className="min-h-[28px] rounded border bg-papier px-2 py-1"
              style={{ borderColor: "#cfd6de", fontFamily: "var(--font-mono)", color: "#111" }}
            >
              {on ? <Tape text={v} /> : <span style={{ color: "#9aa3ad" }}>…</span>}
            </dd>
          </div>
        ))}
        <div className="col-span-2 grid gap-0.5">
          <dt className="text-[11px]" style={{ color: "#56606b" }}>
            {t.pec}
          </dt>
          <dd
            className="rounded border border-dashed bg-papier px-2 py-1"
            style={{ borderColor: "#cfd6de", color: "#56606b" }}
          >
            {chiffre ? t.calcul : t.attente}
          </dd>
        </div>
      </dl>
    </div>
  );
}

function Tape({ text }: { text: string }) {
  const reduce = useReducedMotion();
  const [n, setN] = useState(reduce ? text.length : 0);
  useEffect(() => {
    if (reduce) return setN(text.length);
    const t = setInterval(() => setN((v) => (v >= text.length ? v : v + 1)), 45);
    return () => clearInterval(t);
  }, [text, reduce]);
  return (
    <>
      {text.slice(0, n)}
      {n >= text.length && <span style={{ color: "var(--succes)" }}> ✓</span>}
    </>
  );
}
