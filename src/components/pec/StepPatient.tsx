import { useState } from "react";

import { useLanguage } from "@/lib/i18n";
import {
  EQUIPEMENT_EXEMPLE,
  chiffres,
  dateErreur,
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

type DateErreurs = Record<NonNullable<ReturnType<typeof dateErreur>>, string>;

const copy = {
  fr: {
    dateErreurs: {
      format: "Au format JJ/MM/AAAA.",
      inexistante: "Cette date n'existe pas : vérifiez le jour et le mois.",
      future: "Cette date est dans le futur.",
      ancienne: "Vérifiez l'année de naissance.",
    } satisfies DateErreurs,
    lu: "lu sur la carte, vérifiez",
    cle: "Ce numéro ne passe pas le contrôle de la clé : un chiffre a dû glisser.",
    quinze: "Il faut les 15 chiffres, clé comprise.",
    annee: "L'année ne correspond pas au n° de sécu : vérifiez l'un ou l'autre.",
    rpps: "Ça, c'est le RPPS (11 chiffres). Il faut le n° à 9 chiffres, juste à côté sur l'ordonnance.",
    neuf: "Le n° du médecin fait 9 chiffres.",
    adherentManquant: (portail: string) =>
      `${portail} demande aussi le n° d'adhérent, sur la carte.`,
    kicker: "Le patient",
    title: "La PEC de ",
    em: "votre client",
    intro: (portail: string) =>
      `Ce qu'il faut pour retrouver le patient sur ${portail}. Rien n'est conservé.`,
    nir: "N° de sécurité sociale",
    date: "Date de naissance",
    datePlaceholder: "JJ/MM/AAAA",
    presc: "N° du prescripteur",
    prescHint: "Le n° du médecin sur l'ordonnance, 9 chiffres — pas le RPPS à 11.",
    adherent: "N° d'adhérent",
    continuer: "Continuer",
    retour: "← Retour",
    equipement: "Équipement d'exemple",
  },
  en: {
    dateErreurs: {
      format: "Use the DD/MM/YYYY format.",
      inexistante: "This date does not exist: check the day and month.",
      future: "This date is in the future.",
      ancienne: "Check the year of birth.",
    } satisfies DateErreurs,
    lu: "read from the card, please check",
    cle: "This number fails the check-digit test: a digit must have slipped.",
    quinze: "All 15 digits are needed, including the 2-digit key.",
    annee: "The year does not match the social security number: check one or the other.",
    rpps: "That is the RPPS number (11 digits). We need the 9-digit number, right next to it on the prescription.",
    neuf: "The doctor’s number has 9 digits.",
    adherentManquant: (portail: string) =>
      `${portail} also asks for the member number, printed on the card.`,
    kicker: "The patient",
    title: "Your customer’s ",
    em: "coverage request",
    intro: (portail: string) =>
      `What we need to find the patient on ${portail}. Nothing is stored.`,
    nir: "Social security number",
    date: "Date of birth",
    datePlaceholder: "DD/MM/YYYY",
    presc: "Prescriber number",
    prescHint: "The doctor’s number on the prescription, 9 digits (not the 11-digit RPPS).",
    adherent: "Member number",
    continuer: "Continue",
    retour: "← Back",
    equipement: "Sample equipment",
  },
};

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
  const t = copy[useLanguage().lang];
  const [nir, setNir] = useState(formatNir(initial?.nir ?? prefill?.nir ?? ""));
  const [date, setDate] = useState(initial?.dateNaissance ?? prefill?.dateNaissance ?? "");
  const [presc, setPresc] = useState(initial?.prescripteur ?? "");
  const [adherent, setAdherent] = useState(initial?.adherent ?? "");
  const [err, setErr] = useState<Partial<Record<keyof Patient, string>>>({});
  const lu = (
    <span
      className="rounded-full px-2 py-0.5 text-[11px]"
      style={{
        background: "var(--succes-fond)",
        color: "var(--succes-texte)",
        fontFamily: "var(--font-mono)",
        fontWeight: 400,
      }}
    >
      {t.lu}
    </span>
  );

  function submit() {
    const p = chiffres(presc);
    const e: typeof err = {};
    if (!nirValide(nir)) e.nir = chiffres(nir).length === 15 ? t.cle : t.quinze;
    const de = dateErreur(date);
    if (de) e.dateNaissance = t.dateErreurs[de];
    else if (!e.nir && !nirCoherentAvecDate(nir, date)) e.dateNaissance = t.annee;
    if (/^\d{11}$/.test(p)) e.prescripteur = t.rpps;
    else if (!/^\d{9}$/.test(p)) e.prescripteur = t.neuf;
    if (avecAdherent && adherent.trim().length < 3) e.adherent = t.adherentManquant(portail);
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
      <Kicker>{t.kicker}</Kicker>
      <Title em={t.em} after=".">
        {t.title}
      </Title>
      <Muted>{t.intro(portail)}</Muted>
      <form
        noValidate
        className="ph-no-capture grid w-full gap-4"
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
      >
        <Field label={t.nir} error={err.nir} badge={prefill?.nir && !initial ? lu : undefined}>
          {(a11y) => (
            <input
              {...a11y}
              className={fieldClass}
              style={{ ...fieldStyle(err.nir), fontFamily: "var(--font-mono)" }}
              inputMode="numeric"
              autoComplete="off"
              placeholder="1 85 05 78 006 084 91"
              value={nir}
              onChange={(e) => setNir(formatNir(e.target.value))}
            />
          )}
        </Field>
        <Field
          label={t.date}
          error={err.dateNaissance}
          badge={prefill?.dateNaissance && !initial ? lu : undefined}
        >
          {(a11y) => (
            <input
              {...a11y}
              className={fieldClass}
              style={{ ...fieldStyle(err.dateNaissance), fontFamily: "var(--font-mono)" }}
              inputMode="numeric"
              autoComplete="off"
              placeholder={t.datePlaceholder}
              value={date}
              onChange={(e) => setDate(formatDate(e.target.value))}
            />
          )}
        </Field>
        <Field label={t.presc} hint={t.prescHint} error={err.prescripteur}>
          {(a11y) => (
            <input
              {...a11y}
              className={fieldClass}
              style={{ ...fieldStyle(err.prescripteur), fontFamily: "var(--font-mono)" }}
              inputMode="numeric"
              autoComplete="off"
              placeholder="751234567"
              value={presc}
              onChange={(e) => setPresc(e.target.value.replace(/[^\d\s]/g, "").slice(0, 14))}
            />
          )}
        </Field>
        {avecAdherent && (
          <Field label={t.adherent} error={err.adherent}>
            {(a11y) => (
              <input
                {...a11y}
                className={fieldClass}
                style={{ ...fieldStyle(err.adherent), fontFamily: "var(--font-mono)" }}
                autoComplete="off"
                value={adherent}
                onChange={(e) => setAdherent(e.target.value.slice(0, 30))}
              />
            )}
          </Field>
        )}
        <Equipement />
        <button type="submit" className={`${bigBtn} w-full`}>
          {t.continuer} <span className="arrow">→</span>
        </button>
      </form>
      <TextLink onClick={onBack}>{t.retour}</TextLink>
    </Screen>
  );
}

function Equipement() {
  const { lang } = useLanguage();
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
          color: "var(--texte-discret)",
        }}
      >
        {copy[lang].equipement}
      </span>
      {EQUIPEMENT_EXEMPLE.map((l) => (
        <span key={l.id} className="flex justify-between gap-3" style={{ color: "var(--text)" }}>
          {l.label[lang]}
          <span style={{ fontFamily: "var(--font-mono)" }}>{euros(l.montant, lang)}</span>
        </span>
      ))}
    </div>
  );
}
