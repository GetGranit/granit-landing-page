import { useEffect, useRef, useState } from "react";

import type { PecPlatform } from "@/lib/pec/essaiState";
import { Card, Field, Kicker, Progress, Reassure, TextButton, Title, inputClass } from "./ui";
import { TfaBlock } from "./TfaBlock";

const IDLE_MS = 45_000;

type Props = {
  platform: PecPlatform;
  /** Identifiants validés (simulation) : on passe à la simulation. */
  onDone: () => void;
  /** 45 s sans action sur cet écran. */
  onIdle: () => void;
  /** Arrivée sur la double authentification d'un portail sms / totp. */
  onDelicateTfa: () => void;
  onAskPaul: () => void;
};

/**
 * E4 « Branchez [portail] ».
 *
 * ⚠️ SÉCURITÉ : l'identifiant et le mot de passe vivent UNIQUEMENT dans l'état
 * React local de ce composant. Ils ne sont ni envoyés, ni écrits dans
 * sessionStorage/localStorage, ni remontés au parent, et sont effacés en
 * sortant de l'écran. Pas de <form> : le navigateur ne propose pas de les
 * enregistrer.
 * TODO(CTO) : brancher sur Paramètres > Accès + credential_check
 */
export function BranchezStep({ platform, onDone, onIdle, onDelicateTfa, onAskPaul }: Props) {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [phase, setPhase] = useState<"identifiants" | "tfa">("identifiants");
  const [tfaOk, setTfaOk] = useState(platform.tfa === "aucune");
  const idleFired = useRef(false);

  // 45 s sans action → on propose Paul (une fois).
  useEffect(() => {
    let timer = window.setTimeout(fire, IDLE_MS);
    function fire() {
      if (idleFired.current) return;
      idleFired.current = true;
      onIdle();
    }
    function reset() {
      window.clearTimeout(timer);
      timer = window.setTimeout(fire, IDLE_MS);
    }
    const events = ["pointerdown", "keydown", "input", "scroll"] as const;
    events.forEach((e) => window.addEventListener(e, reset, { passive: true }));
    return () => {
      window.clearTimeout(timer);
      events.forEach((e) => window.removeEventListener(e, reset));
    };
  }, [onIdle]);

  const credsOk = login.trim().length > 0 && password.length > 0;

  function goTfa() {
    if (!credsOk) return;
    if (platform.tfa === "aucune") return finish();
    setPhase("tfa");
    if (platform.tfa === "totp" || platform.tfa === "sms") onDelicateTfa();
  }

  function finish() {
    // Effacement explicite avant de quitter l'écran.
    setLogin("");
    setPassword("");
    onDone();
  }

  return (
    <div>
      <Progress current={4} />
      <Kicker>Dernière étape avant la simulation</Kicker>
      <Title lead="Branchez" accent={platform.label} />
      <p className="mt-3 text-[15px] leading-[1.5]" style={{ color: "var(--text-soft)" }}>
        Le portail de la carte de votre patient. On s'y connecte comme vous le feriez au comptoir.
      </p>

      <Card className="mt-6">
        <div className="mb-4 flex items-center justify-between">
          <span className="text-[15px]" style={{ fontWeight: 600 }}>
            Portail {platform.label}
          </span>
          <span
            className="rounded-full px-2.5 py-1 text-[11px]"
            style={{
              fontFamily: "var(--font-mono)",
              background: "var(--bg2)",
              color: "var(--text-muted)",
            }}
          >
            {phase === "identifiants" ? "1/2 accès" : "2/2 sécurité"}
          </span>
        </div>

        {phase === "identifiants" ? (
          <>
            <ol
              className="mb-4 space-y-1 rounded-[14px] p-3.5 text-[13px] leading-[1.5]"
              style={{ background: "var(--bg2)", color: "var(--text-soft)" }}
            >
              <li>1. Reprenez l'identifiant que vous tapez sur {platform.label}.</li>
              <li>2. Puis le mot de passe du magasin, tel quel.</li>
              <li>3. Granit s'en sert seulement pour préparer vos PEC.</li>
            </ol>
            <Field label="Identifiant">
              <input
                value={login}
                onChange={(e) => setLogin(e.target.value)}
                autoComplete="off"
                autoCapitalize="off"
                spellCheck={false}
                className={inputClass}
                style={{ borderColor: "var(--border)" }}
              />
            </Field>
            <Field label="Mot de passe">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                className={inputClass}
                style={{ borderColor: "var(--border)" }}
              />
            </Field>
            <button
              type="button"
              onClick={goTfa}
              disabled={!credsOk}
              className="btn-primary mt-2 w-full justify-center py-3 text-[15px]"
              style={credsOk ? undefined : { opacity: 0.45, cursor: "not-allowed" }}
            >
              Continuer
            </button>
          </>
        ) : (
          <>
            <TfaBlock
              platform={platform}
              done={tfaOk}
              onDone={() => setTfaOk(true)}
              onAskPaul={onAskPaul}
            />
            <button
              type="button"
              onClick={finish}
              disabled={!tfaOk}
              className="btn-primary mt-4 w-full justify-center py-3 text-[15px]"
              style={tfaOk ? undefined : { opacity: 0.45, cursor: "not-allowed" }}
            >
              Lancer la simulation <span className="arrow">→</span>
            </button>
          </>
        )}
      </Card>

      <ul className="mt-5 space-y-1.5">
        <Reassure>Accès visibles et supprimables dans votre espace</Reassure>
        <Reassure>Photo de la carte non conservée</Reassure>
        <Reassure>Rien n'est envoyé au portail pendant cet aperçu</Reassure>
      </ul>

      <div className="mt-6 text-center">
        <TextButton onClick={onAskPaul}>Je préfère le faire avec Paul</TextButton>
      </div>
    </div>
  );
}
