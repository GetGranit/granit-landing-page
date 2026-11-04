import { useState } from "react";

import { useLanguage } from "@/lib/i18n";
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

const copy = {
  fr: {
    kicker: "Votre portail",
    title: "Connectez-vous à ",
    intro:
      "Granit se connecte comme vous le feriez. Rien n'est envoyé à la mutuelle, vos accès ne sont pas conservés.",
    refuse: (portail: string) =>
      `${portail} n'a pas accepté ces identifiants. Vérifiez les majuscules, ou un mot de passe changé récemment.`,
    idManquant: "Indiquez votre identifiant.",
    mdpManquant: "Indiquez votre mot de passe.",
    identifiant: "Identifiant",
    idHint: (portail: string) => `Celui que vous tapez d'habitude sur ${portail}.`,
    mdp: "Mot de passe",
    masquer: "masquer",
    afficher: "afficher",
    lancer: "Lancer la simulation",
    avecPaul: "Je préfère le faire avec Paul",
    retour: "← Retour",
  },
  en: {
    kicker: "Your portal",
    title: "Log in to ",
    intro:
      "Granit logs in the way you would. Nothing is sent to the insurer, your login details are not stored.",
    refuse: (portail: string) =>
      `${portail} did not accept these credentials. Check capital letters, or a recently changed password.`,
    idManquant: "Enter your username.",
    mdpManquant: "Enter your password.",
    identifiant: "Username",
    idHint: (portail: string) => `The one you usually type on ${portail}.`,
    mdp: "Password",
    masquer: "hide",
    afficher: "show",
    lancer: "Start the simulation",
    avecPaul: "I’d rather do it with Paul",
    retour: "← Back",
  },
};

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
  const t = copy[useLanguage().lang];
  const [identifiant, setIdentifiant] = useState(identifiantInitial ?? "");
  const [motDePasse, setMotDePasse] = useState("");
  const [voir, setVoir] = useState(false);
  const [err, setErr] = useState<{ identifiant?: string; motDePasse?: string }>({});

  return (
    <Screen id="login">
      <Kicker>{t.kicker}</Kicker>
      <Title em={portail} after=".">
        {t.title}
      </Title>
      <Muted>{t.intro}</Muted>
      {refuse && (
        <p
          role="alert"
          className="w-full rounded-xl px-3 py-2 text-[15px]"
          style={{ background: "var(--lavis)", color: "var(--encre)" }}
        >
          {t.refuse(portail)}
        </p>
      )}
      <form
        noValidate
        className="ph-no-capture grid w-full gap-4"
        onSubmit={(e) => {
          e.preventDefault();
          const v = { identifiant: identifiant.trim(), motDePasse };
          const er = {
            identifiant: v.identifiant ? undefined : t.idManquant,
            motDePasse: v.motDePasse ? undefined : t.mdpManquant,
          };
          setErr(er);
          if (er.identifiant || er.motDePasse) return;
          onSubmit(v);
        }}
      >
        <Field label={t.identifiant} hint={t.idHint(portail)} error={err.identifiant}>
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
        <Field label={t.mdp} error={err.motDePasse}>
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
                {voir ? t.masquer : t.afficher}
              </button>
            </span>
          )}
        </Field>
        <div className="grid justify-items-center gap-1">
          <button type="submit" className={`${bigBtn} w-full`}>
            {t.lancer} <span className="arrow">→</span>
          </button>
          <TextLink onClick={onPaul}>{t.avecPaul}</TextLink>
        </div>
      </form>
      <TextLink onClick={onBack}>{t.retour}</TextLink>
    </Screen>
  );
}
