import { useState } from "react";

import { Field, Kicker, Muted, Reassure, Screen, TextLink, Title, bigBtn, fieldClass, fieldStyle } from "./ui";

/**
 * E5 · connexion au portail. Les identifiants restent dans la mémoire de la
 * page le temps de la simulation : jamais stockés, jamais envoyés en lead.
 */
export function StepLogin({
  portail,
  identifiantInitial,
  refuse,
  onSubmit,
  onPaul,
  onBack,
}: {
  portail: string;
  identifiantInitial?: string;
  /** Le portail vient de refuser ces identifiants. */
  refuse?: boolean;
  onSubmit: (v: { identifiant: string; motDePasse: string }) => void;
  onPaul: () => void;
  onBack: () => void;
}) {
  const [identifiant, setIdentifiant] = useState(identifiantInitial ?? "");
  const [motDePasse, setMotDePasse] = useState("");
  const [voir, setVoir] = useState(false);
  const [err, setErr] = useState<{ identifiant?: string; motDePasse?: string }>({});

  return (
    <Screen id="login">
      <Kicker>Votre portail</Kicker>
      <Title em={portail} after=".">Connectez-vous à </Title>
      <Muted>Les identifiants que vous tapez d'habitude sur {portail}.</Muted>
      {refuse && (
        <p role="alert" className="w-full rounded-xl px-3 py-2 text-[15px]" style={{ background: "#fbf0dc", color: "#7a4f12" }}>
          {portail} n'a pas accepté ces identifiants. Vérifiez les majuscules, ou un mot de passe changé récemment.
        </p>
      )}
      <form
        noValidate
        className="ph-no-capture grid w-full gap-4"
        onSubmit={(e) => {
          e.preventDefault();
          const v = { identifiant: identifiant.trim(), motDePasse };
          const er = { identifiant: v.identifiant ? undefined : "Indiquez votre identifiant.", motDePasse: v.motDePasse ? undefined : "Indiquez votre mot de passe." };
          setErr(er);
          if (er.identifiant || er.motDePasse) return;
          onSubmit(v);
        }}
      >
        <Field label="Identifiant" error={err.identifiant}>
          <input className={fieldClass} style={fieldStyle(err.identifiant)} autoComplete="off" autoCapitalize="none" spellCheck={false} value={identifiant} onChange={(e) => setIdentifiant(e.target.value)} />
        </Field>
        <Field label="Mot de passe" error={err.motDePasse}>
          <span className="relative block">
            <input
              className={`${fieldClass} pr-20`}
              style={fieldStyle(err.motDePasse)}
              type={voir ? "text" : "password"}
              autoComplete="off"
              value={motDePasse}
              onChange={(e) => setMotDePasse(e.target.value)}
            />
            <button type="button" onClick={() => setVoir((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[13px] underline" style={{ color: "var(--text-muted)" }}>
              {voir ? "masquer" : "afficher"}
            </button>
          </span>
        </Field>
        <button type="submit" className={`${bigBtn} w-full`}>
          Lancer la simulation <span className="arrow">→</span>
        </button>
      </form>
      <Reassure items={["Utilisé uniquement pour cette simulation", "Rien n'est envoyé à la mutuelle"]} />
      <TextLink onClick={onPaul}>Je préfère le faire avec Paul</TextLink>
      <TextLink onClick={onBack}>← Retour</TextLink>
    </Screen>
  );
}
