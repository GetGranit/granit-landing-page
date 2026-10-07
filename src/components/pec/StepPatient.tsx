import { useState } from "react";

import {
  EQUIPEMENT_EXEMPLE,
  chiffres,
  dateValide,
  nirCoherentAvecDate,
  nirValide,
} from "@/lib/pec/simulation";
import {
  Field,
  Kicker,
  Muted,
  Screen,
  TextLink,
  Title,
  bigBtn,
  euros,
  fieldClass,
  fieldStyle,
} from "./ui";

export type Patient = {
  nir: string;
  dateNaissance: string;
  prescripteur: string;
  adherent?: string;
};
/** Valeurs lues par l'OCR côté infra Granit (pas encore branché) : affichées « lu sur la carte, vérifiez ». */
export type PatientPrefill = { nir?: string; dateNaissance?: string };

/** « 1 85 05 78 006 084 91 », sans espace final pour que l'effacement marche. */
function formatNir(v: string) {
  const s = chiffres(v)
    .replace(/[^0-9AB]/g, "")
    .slice(0, 15);
  const sizes = [1, 2, 2, 2, 3, 3, 2];
  const out: string[] = [];
  let i = 0;
  for (const n of sizes) {
    if (i >= s.length) break;
    out.push(s.slice(i, i + n));
    i += n;
  }
  return out.join(" ");
}

function formatDate(v: string) {
  const d = v.replace(/\D/g, "").slice(0, 8);
  return [d.slice(0, 2), d.slice(2, 4), d.slice(4)].filter(Boolean).join("/");
}

/** E4 · le patient : trois champs, l'équipement est celui de l'exemple. */
export function StepPatient({
  portail,
  avecAdherent,
  initial,
  prefill,
  onSubmit,
  onBack,
}: {
  portail: string;
  avecAdherent: boolean;
  initial?: Patient;
  prefill?: PatientPrefill;
  onSubmit: (p: Patient) => void;
  onBack: () => void;
}) {
  const [nir, setNir] = useState(formatNir(initial?.nir ?? prefill?.nir ?? ""));
  const [date, setDate] = useState(initial?.dateNaissance ?? prefill?.dateNaissance ?? "");
  const [presc, setPresc] = useState(initial?.prescripteur ?? "");
  const [adherent, setAdherent] = useState(initial?.adherent ?? "");
  const [err, setErr] = useState<Partial<Record<keyof Patient, string>>>({});
  const lu = (
    <span
      className="rounded-full px-2 py-0.5 text-[11px]"
      style={{
        background: "var(--sage-light)",
        color: "#2f6b3d",
        fontFamily: "var(--font-mono)",
        fontWeight: 400,
      }}
    >
      lu sur la carte, vérifiez
    </span>
  );

  function submit() {
    const p = chiffres(presc);
    const e: typeof err = {};
    if (!nirValide(nir))
      e.nir =
        chiffres(nir).length === 15
          ? "Ce numéro ne passe pas le contrôle de la clé : un chiffre a dû glisser."
          : "Il faut les 15 chiffres, clé comprise.";
    if (!dateValide(date)) e.dateNaissance = "Au format JJ/MM/AAAA.";
    else if (!e.nir && !nirCoherentAvecDate(nir, date))
      e.dateNaissance = "L'année ne correspond pas au n° de sécu : vérifiez l'un ou l'autre.";
    if (/^\d{11}$/.test(p))
      e.prescripteur =
        "Ça, c'est le RPPS (11 chiffres). Il faut le n° à 9 chiffres, juste à côté sur l'ordonnance.";
    else if (!/^\d{9}$/.test(p)) e.prescripteur = "Le n° du médecin fait 9 chiffres.";
    if (avecAdherent && adherent.trim().length < 3)
      e.adherent = `${portail} demande aussi le n° d'adhérent, sur la carte.`;
    setErr(e);
    if (Object.keys(e).length) return;
    onSubmit({
      nir: chiffres(nir),
      dateNaissance: date.trim(),
      prescripteur: p,
      ...(avecAdherent ? { adherent: adherent.trim() } : {}),
    });
  }

  return (
    <Screen id="patient">
      <Kicker>Le patient</Kicker>
      <Title em="votre client" after=".">
        La PEC de{" "}
      </Title>
      <Muted>Ce qu'il faut pour retrouver le patient sur {portail}. Rien n'est conservé.</Muted>
      <form
        noValidate
        className="ph-no-capture grid w-full gap-4"
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
      >
        <Field
          label="N° de sécurité sociale"
          error={err.nir}
          badge={prefill?.nir && !initial ? lu : undefined}
        >
          <input
            className={fieldClass}
            style={{ ...fieldStyle(err.nir), fontFamily: "var(--font-mono)" }}
            inputMode="numeric"
            autoComplete="off"
            placeholder="1 85 05 78 006 084 91"
            value={nir}
            onChange={(e) => setNir(formatNir(e.target.value))}
          />
        </Field>
        <Field
          label="Date de naissance"
          error={err.dateNaissance}
          badge={prefill?.dateNaissance && !initial ? lu : undefined}
        >
          <input
            className={fieldClass}
            style={{ ...fieldStyle(err.dateNaissance), fontFamily: "var(--font-mono)" }}
            inputMode="numeric"
            autoComplete="off"
            placeholder="JJ/MM/AAAA"
            value={date}
            onChange={(e) => setDate(formatDate(e.target.value))}
          />
        </Field>
        <Field
          label="N° du prescripteur"
          hint="Le n° du médecin sur l'ordonnance, 9 chiffres — pas le RPPS à 11."
          error={err.prescripteur}
        >
          <input
            className={fieldClass}
            style={{ ...fieldStyle(err.prescripteur), fontFamily: "var(--font-mono)" }}
            inputMode="numeric"
            autoComplete="off"
            placeholder="751234567"
            value={presc}
            onChange={(e) => setPresc(e.target.value.replace(/[^\d\s]/g, "").slice(0, 14))}
          />
        </Field>
        {avecAdherent && (
          <Field label="N° d'adhérent" error={err.adherent}>
            <input
              className={fieldClass}
              style={{ ...fieldStyle(err.adherent), fontFamily: "var(--font-mono)" }}
              autoComplete="off"
              value={adherent}
              onChange={(e) => setAdherent(e.target.value.slice(0, 30))}
            />
          </Field>
        )}
        <Equipement />
        <button type="submit" className={`${bigBtn} w-full`}>
          Continuer <span className="arrow">→</span>
        </button>
      </form>
      <TextLink onClick={onBack}>← Retour</TextLink>
    </Screen>
  );
}

function Equipement() {
  return (
    <div
      className="grid gap-1.5 rounded-xl border border-dashed px-4 py-3 text-left text-[14px]"
      style={{ borderColor: "var(--border2)" }}
    >
      <span
        className="text-[11px] uppercase"
        style={{
          fontFamily: "var(--font-mono)",
          letterSpacing: ".12em",
          color: "var(--text-muted)",
        }}
      >
        Équipement d'exemple
      </span>
      {EQUIPEMENT_EXEMPLE.map((l) => (
        <span key={l.label} className="flex justify-between gap-3" style={{ color: "var(--text)" }}>
          {l.label}
          <span style={{ fontFamily: "var(--font-mono)" }}>{euros(l.montant)}</span>
        </span>
      ))}
    </div>
  );
}
