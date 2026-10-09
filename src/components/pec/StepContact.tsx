import { useState } from "react";

import { Kicker, Muted, Reassure, Screen, TextLink, Title, bigBtn, focusRing } from "./ui";

const emailRe = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
const CALCOM =
  import.meta.env.VITE_PEC_CALCOM_URL || "https://cal.com/paul-pietra-granit/decouvrir-granit";

type Champ = "phone" | "email";

/**
 * « En parler avec Paul » en pleine page : quand le portail n'est pas encore
 * simulable, que la mutuelle est inconnue, ou que l'opticien préfère être
 * accompagné. Rappel par défaut (on garde l'élan), créneau en second.
 * `error` : l'envoi n'est pas parti, la saisie reste là.
 */
export function StepContact({
  title,
  intro,
  email: initialEmail,
  onSubmit,
  onBack,
  onCal,
  busy,
  error,
}: {
  title: string;
  intro: string;
  email?: string;
  onSubmit: (v: { prenom: string; phone: string; email: string }) => void;
  onBack?: () => void;
  onCal?: () => void;
  busy: boolean;
  error?: string;
}) {
  const [prenom, setPrenom] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState(initialEmail ?? "");
  const [err, setErr] = useState<{ champ: Champ; texte: string } | null>(null);
  const field = `w-full rounded-xl border-[1.5px] bg-white px-4 py-3 text-[17px] ${focusRing}`;
  const fieldStyle = (c: Champ) => ({
    borderColor: err?.champ === c ? "var(--terra)" : "var(--border2)",
    color: "var(--text)",
  });
  const a11y = (c: Champ) =>
    err?.champ === c ? { "aria-invalid": true as const, "aria-describedby": "contact-erreur" } : {};

  return (
    <Screen id="contact">
      <div
        className="grid h-16 w-16 place-items-center rounded-full font-serif text-[26px] text-white"
        style={{ background: "var(--gradient-terra)" }}
        aria-hidden
      >
        P
      </div>
      <Kicker>Paul, chez Granit</Kicker>
      <Title>{title}</Title>
      <Muted>{intro}</Muted>
      <form
        noValidate
        className="grid w-full gap-3 text-left"
        onSubmit={(e) => {
          e.preventDefault();
          if (phone.replace(/\D/g, "").length < 9)
            return setErr({
              champ: "phone",
              texte: "Indiquez un numéro où Paul peut vous joindre.",
            });
          if (!emailRe.test(email.trim()))
            return setErr({ champ: "email", texte: "Indiquez un e-mail valide." });
          setErr(null);
          onSubmit({ prenom: prenom.trim(), phone: phone.trim(), email: email.trim() });
        }}
      >
        <input
          className={field}
          style={{ borderColor: "var(--border2)", color: "var(--text)" }}
          placeholder="Prénom"
          autoComplete="given-name"
          value={prenom}
          onChange={(e) => setPrenom(e.target.value)}
          aria-label="Prénom"
        />
        <input
          {...a11y("phone")}
          className={field}
          style={fieldStyle("phone")}
          placeholder="06 12 34 56 78"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          aria-label="Téléphone"
        />
        <input
          {...a11y("email")}
          className={field}
          style={fieldStyle("email")}
          placeholder="contact@votre-magasin.fr"
          type="email"
          inputMode="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-label="E-mail"
        />
        {err && (
          <p
            id="contact-erreur"
            role="alert"
            className="text-[14px]"
            style={{ color: "var(--terra-hover)" }}
          >
            {err.texte}
          </p>
        )}
        {error && !err && (
          <p
            role="alert"
            className="rounded-xl px-3 py-2 text-[15px]"
            style={{ background: "#fbf0dc", color: "#7a4f12" }}
          >
            {error}
          </p>
        )}
        <button type="submit" disabled={busy} className={`${bigBtn} w-full disabled:opacity-60`}>
          {busy ? (
            "Un instant…"
          ) : (
            <>
              {error ? "Réessayer" : "Paul me rappelle"} <span className="arrow">→</span>
            </>
          )}
        </button>
      </form>
      <a
        href={CALCOM}
        target="_blank"
        rel="noopener noreferrer"
        onClick={onCal}
        className="inline-flex min-h-[44px] items-center px-2 py-2.5 text-[15px] underline underline-offset-4"
        style={{ color: "var(--text-soft)" }}
      >
        Je préfère choisir un créneau de 15 min
      </a>
      <Reassure items={["Rappel sous 24 h ouvrées"]} />
      {onBack && <TextLink onClick={onBack}>← Retour</TextLink>}
    </Screen>
  );
}

export function StepThanks({
  title,
  children,
  creneau = true,
  onCal,
}: {
  title: string;
  children: React.ReactNode;
  /** Proposer un créneau tout de suite (pas pour « Me prévenir »). */
  creneau?: boolean;
  onCal?: () => void;
}) {
  return (
    <Screen id="thanks">
      <Kicker>C'est noté</Kicker>
      <Title>{title}</Title>
      {children}
      {creneau && (
        <a
          href={CALCOM}
          target="_blank"
          rel="noopener noreferrer"
          onClick={onCal}
          className={bigBtn}
        >
          Choisir un créneau maintenant <span className="arrow">→</span>
        </a>
      )}
    </Screen>
  );
}
