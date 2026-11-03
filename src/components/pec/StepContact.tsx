import { useState } from "react";

import { useLanguage } from "@/lib/i18n";
import { Kicker, Muted, Reassure, Screen, TextLink, Title, bigBtn, focusRing } from "./ui";

const copy = {
  fr: {
    kicker: "Paul, chez Granit",
    telInvalide: "Indiquez un numéro où Paul peut vous joindre.",
    emailInvalide: "Indiquez un e-mail valide.",
    prenom: "Prénom",
    telPlaceholder: "06 12 34 56 78",
    tel: "Téléphone",
    emailPlaceholder: "contact@votre-magasin.fr",
    email: "E-mail",
    instant: "Un instant…",
    reessayer: "Réessayer",
    rappel: "Paul me rappelle",
    creneau: "Je préfère choisir un créneau de 15 min",
    sous24h: "Rappel sous 24 h ouvrées",
    retour: "← Retour",
    note: "C'est noté",
    choisir: "Choisir un créneau maintenant",
    autreCarte: "Essayer avec une autre carte",
  },
  en: {
    kicker: "Paul, at Granit",
    telInvalide: "Enter a number where Paul can reach you.",
    emailInvalide: "Enter a valid email.",
    prenom: "First name",
    telPlaceholder: "+33 6 12 34 56 78",
    tel: "Phone",
    emailPlaceholder: "contact@your-store.com",
    email: "Email",
    instant: "One moment…",
    reessayer: "Try again",
    rappel: "Paul calls me back",
    creneau: "I’d rather pick a 15-min slot",
    sous24h: "Callback within 24 business hours",
    retour: "← Back",
    note: "Got it",
    choisir: "Pick a slot now",
    autreCarte: "Try with another card",
  },
};

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
  const t = copy[useLanguage().lang];
  const [prenom, setPrenom] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState(initialEmail ?? "");
  const [err, setErr] = useState<{ champ: Champ; texte: string } | null>(null);
  const field = `w-full rounded-xl border-[1.5px] bg-papier px-4 py-3 text-[17px] ${focusRing}`;
  const fieldStyle = (c: Champ) => ({
    borderColor: err?.champ === c ? "var(--alerte)" : "var(--filet-champ)",
    color: "var(--text)",
  });
  const a11y = (c: Champ) =>
    err?.champ === c ? { "aria-invalid": true as const, "aria-describedby": "contact-erreur" } : {};

  return (
    <Screen id="contact">
      <div
        className="grid h-16 w-16 place-items-center rounded-full font-serif text-[26px] text-rose"
        style={{ background: "var(--encre)" }}
        aria-hidden
      >
        P
      </div>
      <Kicker>{t.kicker}</Kicker>
      <Title>{title}</Title>
      <Muted>{intro}</Muted>
      <form
        noValidate
        className="grid w-full gap-3 text-left"
        onSubmit={(e) => {
          e.preventDefault();
          if (phone.replace(/\D/g, "").length < 9)
            return setErr({ champ: "phone", texte: t.telInvalide });
          if (!emailRe.test(email.trim()))
            return setErr({ champ: "email", texte: t.emailInvalide });
          setErr(null);
          onSubmit({ prenom: prenom.trim(), phone: phone.trim(), email: email.trim() });
        }}
      >
        <input
          className={field}
          style={{ borderColor: "var(--filet-champ)", color: "var(--text)" }}
          placeholder={t.prenom}
          autoComplete="given-name"
          value={prenom}
          onChange={(e) => setPrenom(e.target.value)}
          aria-label={t.prenom}
        />
        <input
          {...a11y("phone")}
          className={field}
          style={fieldStyle("phone")}
          placeholder={t.telPlaceholder}
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          aria-label={t.tel}
        />
        <input
          {...a11y("email")}
          className={field}
          style={fieldStyle("email")}
          placeholder={t.emailPlaceholder}
          type="email"
          inputMode="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-label={t.email}
        />
        {err && (
          <p
            id="contact-erreur"
            role="alert"
            className="text-[14px]"
            style={{ color: "var(--alerte-texte)" }}
          >
            {err.texte}
          </p>
        )}
        {error && !err && (
          <p
            role="alert"
            className="rounded-xl px-3 py-2 text-[15px]"
            style={{ background: "var(--lavis)", color: "var(--encre)" }}
          >
            {error}
          </p>
        )}
        <button type="submit" disabled={busy} className={`${bigBtn} w-full disabled:opacity-60`}>
          {busy ? (
            t.instant
          ) : (
            <>
              {error ? t.reessayer : t.rappel} <span className="arrow">→</span>
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
        {t.creneau}
      </a>
      <Reassure items={[t.sous24h]} />
      {onBack && <TextLink onClick={onBack}>{t.retour}</TextLink>}
    </Screen>
  );
}

export function StepThanks({
  title,
  children,
  creneau = true,
  onCal,
  onRestart,
}: {
  title: string;
  children: React.ReactNode;
  /** Proposer un créneau tout de suite (pas pour « Me prévenir »). */
  creneau?: boolean;
  onCal?: () => void;
  /** Repartir d'une autre carte (évite le cul-de-sac après « Me prévenir »). */
  onRestart?: () => void;
}) {
  const t = copy[useLanguage().lang];
  return (
    <Screen id="thanks">
      <Kicker>{t.note}</Kicker>
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
          {t.choisir} <span className="arrow">→</span>
        </a>
      )}
      {onRestart && <TextLink onClick={onRestart}>{t.autreCarte}</TextLink>}
    </Screen>
  );
}
