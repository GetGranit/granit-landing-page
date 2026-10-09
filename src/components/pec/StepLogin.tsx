import { useState } from "react";

import {
  Field,
  Kicker,
  Muted,
  Screen,
  TextLink,
  Title,
  bigBtn,
  fieldClass,
  fieldStyle,
} from "./ui";

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
      <Title em={portail} after=".">
        Connectez-vous à{" "}
      </Title>
      <Muted>
        Granit se connecte comme vous le feriez. Rien n'est envoyé à la mutuelle, vos accès ne sont
        pas conservés.
      </Muted>
      {refuse && (
        <p
          role="alert"
          className="w-full rounded-xl px-3 py-2 text-[15px]"
          style={{ background: "#fbf0dc", color: "#7a4f12" }}
        >
          {portail} n'a pas accepté ces identifiants. Vérifiez les majuscules, ou un mot de passe
          changé récemment.
        </p>
      )}
      <form
        noValidate
        className="ph-no-capture grid w-full gap-4"
        onSubmit={(e) => {
          e.preventDefault();
          const v = { identifiant: identifiant.trim(), motDePasse };
          const er = {
            identifiant: v.identifiant ? undefined : "Indiquez votre identifiant.",
            motDePasse: v.motDePasse ? undefined : "Indiquez votre mot de passe.",
          };
          setErr(er);
          if (er.identifiant || er.motDePasse) return;
          onSubmit(v);
        }}
      >
        <Field
          label="Identifiant"
          hint={`Celui que vous tapez d'habitude sur ${portail}.`}
          error={err.identifiant}
        >
          {(a11y) => (
            <input
              {...a11y}
              className={fieldClass}
              style={fieldStyle(err.identifiant)}
              autoComplete="off"
              autoCapitalize="none"
              spellCheck={false}
              value={identifiant}
              onChange={(e) => setIdentifiant(e.target.value)}
            />
          )}
        </Field>
        <Field label="Mot de passe" error={err.motDePasse}>
          {(a11y) => (
            <span className="relative block">
              <input
                {...a11y}
                className={`${fieldClass} pr-20`}
                style={fieldStyle(err.motDePasse)}
                type={voir ? "text" : "password"}
                autoComplete="off"
                value={motDePasse}
                onChange={(e) => setMotDePasse(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setVoir((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[13px] underline"
                style={{ color: "var(--text-muted)" }}
              >
                {voir ? "masquer" : "afficher"}
              </button>
            </span>
          )}
        </Field>
        <div className="grid justify-items-center gap-1">
          <button type="submit" className={`${bigBtn} w-full`}>
            Lancer la simulation <span className="arrow">→</span>
          </button>
          <TextLink onClick={onPaul}>Je préfère le faire avec Paul</TextLink>
        </div>
      </form>
      <TextLink onClick={onBack}>← Retour</TextLink>
    </Screen>
  );
}
