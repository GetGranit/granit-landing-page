import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

import { useLanguage } from "@/lib/i18n";
import {
  Field,
  Kicker,
  Reassure,
  Screen,
  TextLink,
  Title,
  bigBtn,
  fieldClass,
  fieldStyle,
} from "./ui";

const emailRe = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
const MIN_MDP = 8;

const copy = {
  fr: {
    kicker: "Votre compte Granit",
    title: "Créez votre ",
    em: "compte gratuit",
    emailInvalide: "Indiquez un e-mail valide.",
    mdpCourt: (n: number) => `Au moins ${n} caractères, sans compter les espaces.`,
    cguManquantes: "Acceptez les conditions pour créer le compte.",
    email: "E-mail",
    emailPlaceholder: "contact@votre-magasin.fr",
    mdp: "Mot de passe",
    mdpHint: (n: number) => `${n} caractères minimum`,
    masquer: "Masquer",
    afficher: "Afficher",
    accepte: "J'accepte les ",
    conditions: "conditions générales",
    reessayer: "Réessayer",
    creer: "Créer mon compte",
    reassure: ["Gratuit", "20 simulations offertes", "Sans carte bancaire"],
    revenir: "Revenir au résultat",
    prepare: "Votre espace se prépare…",
  },
  en: {
    kicker: "Your Granit account",
    title: "Create your ",
    em: "free account",
    emailInvalide: "Enter a valid email.",
    mdpCourt: (n: number) => `At least ${n} characters, not counting spaces.`,
    cguManquantes: "Accept the terms to create the account.",
    email: "Email",
    emailPlaceholder: "contact@your-store.com",
    mdp: "Password",
    mdpHint: (n: number) => `${n} characters minimum`,
    masquer: "Hide",
    afficher: "Show",
    accepte: "I accept the ",
    conditions: "terms and conditions",
    reessayer: "Try again",
    creer: "Create my account",
    reassure: ["Free", "20 free simulations", "No credit card"],
    revenir: "Back to the result",
    prepare: "Your workspace is getting ready…",
  },
};

type Erreurs = { email?: string; mdp?: string; cgu?: string };

/**
 * E9 · le compte, en un seul écran : e-mail, mot de passe, CGU (non cochées).
 * Seul l'e-mail remonte à l'appelant ; le mot de passe reste dans cet écran.
 * Si l'envoi échoue, l'écran reste là (saisie gardée) avec `error` et « Réessayer ».
 * TODO(CTO) : création de compte réelle (Firebase / user-provisioning).
 */
export function StepCompte({
  preparing,
  error,
  onBack,
  onSubmit,
}: {
  /** L'espace se prépare (après validation) : on montre la transition. */
  preparing: boolean;
  /** L'envoi n'est pas parti : on reste sur l'écran. */
  error?: string;
  onBack: () => void;
  onSubmit: (email: string) => void;
}) {
  const t = copy[useLanguage().lang];
  const [email, setEmail] = useState("");
  const [mdp, setMdp] = useState("");
  const [voir, setVoir] = useState(false);
  const [cgu, setCgu] = useState(false);
  const [err, setErr] = useState<Erreurs>({});

  if (preparing) return <Preparation />;

  return (
    <Screen id="compte">
      <Kicker>{t.kicker}</Kicker>
      <Title em={t.em} after=".">
        {t.title}
      </Title>
      <form
        noValidate
        className="grid w-full gap-4"
        onSubmit={(e) => {
          e.preventDefault();
          const next: Erreurs = {};
          if (!emailRe.test(email.trim())) next.email = t.emailInvalide;
          if (mdp.replace(/\s/g, "").length < MIN_MDP) next.mdp = t.mdpCourt(MIN_MDP);
          if (!cgu) next.cgu = t.cguManquantes;
          setErr(next);
          if (Object.keys(next).length) return;
          onSubmit(email.trim());
        }}
      >
        <Field label={t.email} error={err.email}>
          {(a11y) => (
            <input
              {...a11y}
              type="email"
              name="email"
              autoComplete="email"
              inputMode="email"
              placeholder={t.emailPlaceholder}
              className={fieldClass}
              style={fieldStyle(err.email)}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          )}
        </Field>
        <Field label={t.mdp} hint={t.mdpHint(MIN_MDP)} error={err.mdp}>
          {(a11y) => (
            <span className="relative block">
              <input
                {...a11y}
                type={voir ? "text" : "password"}
                name="new-password"
                autoComplete="new-password"
                className={`${fieldClass} ph-no-capture pr-24`}
                style={fieldStyle(err.mdp)}
                value={mdp}
                onChange={(e) => setMdp(e.target.value)}
              />
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  setVoir((v) => !v);
                }}
                aria-pressed={voir}
                className="absolute top-1/2 right-3 -translate-y-1/2 text-[14px] underline underline-offset-4"
                style={{ color: "var(--text-soft)" }}
              >
                {voir ? t.masquer : t.afficher}
              </button>
            </span>
          )}
        </Field>
        <div className="grid gap-1 text-left">
          <label className="flex items-start gap-2.5 text-[14px]" style={{ color: "var(--text)" }}>
            <input
              type="checkbox"
              name="cgu"
              aria-invalid={err.cgu ? true : undefined}
              aria-describedby={err.cgu ? "compte-cgu-erreur" : undefined}
              className="mt-0.5 h-[18px] w-[18px] shrink-0 accent-[var(--terra)]"
              checked={cgu}
              onChange={(e) => setCgu(e.target.checked)}
            />
            <span>
              {t.accepte}
              <a
                href="/cgv"
                target="_blank"
                rel="noopener"
                className="underline underline-offset-4"
                style={{ color: "var(--text-soft)" }}
              >
                {t.conditions}
              </a>
              .
            </span>
          </label>
          {err.cgu && (
            <span
              id="compte-cgu-erreur"
              role="alert"
              className="text-[14px]"
              style={{ color: "var(--terra-hover)" }}
            >
              {err.cgu}
            </span>
          )}
        </div>
        {error && (
          <p
            role="alert"
            className="w-full rounded-xl px-3 py-2 text-left text-[15px]"
            style={{ background: "#fbf0dc", color: "#7a4f12" }}
          >
            {error}
          </p>
        )}
        <button type="submit" className={`${bigBtn} w-full`}>
          {error ? t.reessayer : t.creer} <span className="arrow">→</span>
        </button>
      </form>
      <Reassure items={t.reassure} />
      <TextLink onClick={onBack}>{t.revenir}</TextLink>
    </Screen>
  );
}

/** Transition courte et honnête : on prépare la page suivante, rien de plus. */
function Preparation() {
  const reduce = useReducedMotion();
  const t = copy[useLanguage().lang];
  return (
    <Screen id="preparation">
      <div role="status" aria-live="polite" className="grid justify-items-center gap-4 py-6">
        <div
          className="h-1.5 w-48 overflow-hidden rounded-full"
          style={{ background: "var(--bg3)" }}
        >
          <motion.div
            className="h-full rounded-full"
            style={{ background: "var(--gradient-terra)" }}
            initial={reduce ? { width: "100%" } : { width: "8%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>
        <p className="font-serif text-[22px]" style={{ color: "var(--text)" }}>
          {t.prepare}
        </p>
      </div>
    </Screen>
  );
}
