import { useEffect, useRef, useState } from "react";

import { Kicker, Muted, Screen, TextLink, Title, bigBtn } from "./ui";

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
  onPaul,
}: {
  portail: string;
  canal: "totp" | "email";
  essai: number;
  onSubmit: (code: string) => void;
  onPaul: () => void;
}) {
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
      <Kicker>Double authentification</Kicker>
      <Title em="un code" after=".">
        {portail} demande{" "}
      </Title>
      {essai > 1 ? (
        <p
          role="alert"
          className="w-full rounded-xl px-3 py-2 text-[15px]"
          style={{ background: "#fbf0dc", color: "#7a4f12" }}
        >
          Ce code n'a pas été accepté (essai {essai} sur 3).{" "}
          {canal === "totp"
            ? "Attendez le code suivant dans l'appli."
            : "Prenez le dernier e-mail reçu."}
        </p>
      ) : (
        <Muted>
          {canal === "totp"
            ? `Ouvrez votre appli d'authentification et tapez le code ${portail} à 6 chiffres.`
            : `${portail} vient d'envoyer un code à 6 chiffres à l'adresse e-mail du compte.`}
        </Muted>
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
          aria-label="Code à 6 chiffres"
          className="w-full max-w-[300px] rounded-2xl border-[1.5px] bg-white px-4 py-4 text-center text-[34px] outline-none focus:border-[var(--terra)]"
          style={{
            borderColor: "var(--border2)",
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
          Valider le code <span className="arrow">→</span>
        </button>
      </form>
      <TextLink onClick={onPaul}>Je n'ai pas de code : le faire avec Paul</TextLink>
    </Screen>
  );
}
