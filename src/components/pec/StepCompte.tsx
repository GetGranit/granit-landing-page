import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

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
  const [email, setEmail] = useState("");
  const [mdp, setMdp] = useState("");
  const [voir, setVoir] = useState(false);
  const [cgu, setCgu] = useState(false);
  const [err, setErr] = useState<Erreurs>({});

  if (preparing) return <Preparation />;

  return (
    <Screen id="compte">
      <Kicker>Votre compte Granit</Kicker>
      <Title em="compte gratuit" after=".">
        Créez votre{" "}
      </Title>
      <form
        noValidate
        className="grid w-full gap-4"
        onSubmit={(e) => {
          e.preventDefault();
          const next: Erreurs = {};
          if (!emailRe.test(email.trim())) next.email = "Indiquez un e-mail valide.";
          if (mdp.replace(/\s/g, "").length < MIN_MDP)
            next.mdp = `Au moins ${MIN_MDP} caractères, sans compter les espaces.`;
          if (!cgu) next.cgu = "Acceptez les conditions pour créer le compte.";
          setErr(next);
          if (Object.keys(next).length) return;
          onSubmit(email.trim());
        }}
      >
        <Field label="E-mail" error={err.email}>
          {(a11y) => (
            <input
              {...a11y}
              type="email"
              name="email"
              autoComplete="email"
              inputMode="email"
              placeholder="contact@votre-magasin.fr"
              className={fieldClass}
              style={fieldStyle(err.email)}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          )}
        </Field>
        <Field label="Mot de passe" hint={`${MIN_MDP} caractères minimum`} error={err.mdp}>
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
                {voir ? "Masquer" : "Afficher"}
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
              J'accepte les{" "}
              <a
                href="/cgv"
                target="_blank"
                rel="noopener"
                className="underline underline-offset-4"
                style={{ color: "var(--text-soft)" }}
              >
                conditions générales
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
          {error ? "Réessayer" : "Créer mon compte"} <span className="arrow">→</span>
        </button>
      </form>
      <Reassure items={["Gratuit", "20 simulations offertes", "Sans carte bancaire"]} />
      <TextLink onClick={onBack}>Revenir au résultat</TextLink>
    </Screen>
  );
}

/** Transition courte et honnête : on prépare la page suivante, rien de plus. */
function Preparation() {
  const reduce = useReducedMotion();
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
          Votre espace se prépare…
        </p>
      </div>
    </Screen>
  );
}
