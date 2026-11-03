import { useEffect, useRef, useState } from "react";

import { useLanguage } from "@/lib/i18n";
import { Kicker, Muted, Screen, TextLink, Title, bigBtn, focusRing } from "./ui";

const copy = {
  fr: {
    kicker: "Double authentification",
    demande: (portail: string) => `${portail} demande `,
    em: "un code",
    refuse: (essai: number) => `Ce code n'a pas été accepté (essai ${essai} sur 3). `,
    suivantTotp: "Attendez le code suivant dans l'appli.",
    suivantEmail: "Prenez le dernier e-mail reçu.",
    introTotp: (portail: string) =>
      `Ouvrez votre appli d'authentification et tapez le code ${portail} à 6 chiffres.`,
    introEmail: (portail: string) =>
      `${portail} vient d'envoyer un code à 6 chiffres à l'adresse e-mail du compte.`,
    apercu: "Aperçu : tapez n'importe quel code à 6 chiffres (999999 montre un code refusé).",
    label: "Code à 6 chiffres",
    valider: "Valider le code",
    sansCode: "Je n'ai pas de code : le faire avec Paul",
  },
  en: {
    kicker: "Two-factor authentication",
    demande: (portail: string) => `${portail} asks for `,
    em: "a code",
    refuse: (essai: number) => `This code was not accepted (attempt ${essai} of 3). `,
    suivantTotp: "Wait for the next code in the app.",
    suivantEmail: "Use the latest email you received.",
    introTotp: (portail: string) =>
      `Open your authenticator app and type the 6-digit ${portail} code.`,
    introEmail: (portail: string) =>
      `${portail} just sent a 6-digit code to the account’s email address.`,
    apercu: "Preview: type any 6-digit code (999999 shows a rejected code).",
    label: "6-digit code",
    valider: "Confirm the code",
    sansCode: "I don’t have a code: do it with Paul",
  },
};

/**
 * E6 · le code de double authentification, tapé à la main : appli
 * d'authentification (Viamédis, Kalixia) ou e-mail (EMOA, Génération).
 * Envoi automatique au sixième chiffre.
 */
export function StepCode({
  portail,
  canal,
  essai,
  onSubmit,
  apercu,
  onPaul,
}: {
  portail: string;
  canal: "totp" | "email";
  essai: number;
  onSubmit: (code: string) => void;
  onPaul: () => void;
  /** Aperçu (simulation factice) : on dit qu'un code inventé suffit. */
  apercu?: boolean;
}) {
  const t = copy[useLanguage().lang];
  const [code, setCode] = useState("");
  const ref = useRef<HTMLInputElement>(null);
  const sent = useRef(false);

  useEffect(() => {
    ref.current?.focus();
  }, []);

  function send(v: string) {
    if (sent.current || !/^\d{6}$/.test(v)) return;
    sent.current = true;
    onSubmit(v);
  }

  return (
    <Screen id={`code-${essai}`}>
      <Kicker>{t.kicker}</Kicker>
      <Title em={t.em} after=".">
        {t.demande(portail)}
      </Title>
      {essai > 1 ? (
        <p
          role="alert"
          className="w-full rounded-xl px-3 py-2 text-[15px]"
          style={{ background: "var(--lavis)", color: "var(--encre)" }}
        >
          {t.refuse(essai)}
          {canal === "totp" ? t.suivantTotp : t.suivantEmail}
        </p>
      ) : (
        <Muted>{canal === "totp" ? t.introTotp(portail) : t.introEmail(portail)}</Muted>
      )}
      {apercu && (
        <p className="text-[13px]" style={{ color: "var(--text-muted)" }}>
          {t.apercu}
        </p>
      )}
      <form
        noValidate
        className="grid w-full justify-items-center gap-4"
        onSubmit={(e) => {
          e.preventDefault();
          send(code);
        }}
      >
        <input
          ref={ref}
          aria-label={t.label}
          className={`w-full max-w-[300px] rounded-2xl border-[1.5px] bg-papier px-4 py-4 text-center text-[34px] ${focusRing}`}
          style={{
            borderColor: "var(--filet-champ)",
            color: "var(--text)",
            fontFamily: "var(--font-mono)",
            letterSpacing: ".35em",
          }}
          inputMode="numeric"
          autoComplete="one-time-code"
          pattern="\d{6}"
          maxLength={6}
          placeholder="••••••"
          value={code}
          onChange={(e) => {
            const v = e.target.value.replace(/\D/g, "").slice(0, 6);
            setCode(v);
            send(v);
          }}
        />
        <button
          type="submit"
          disabled={code.length !== 6}
          className={`${bigBtn} w-full disabled:opacity-50`}
        >
          {t.valider} <span className="arrow">→</span>
        </button>
      </form>
      <TextLink onClick={onPaul}>{t.sansCode}</TextLink>
    </Screen>
  );
}
