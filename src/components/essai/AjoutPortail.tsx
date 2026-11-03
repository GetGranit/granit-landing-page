import { useState } from "react";

import { useLanguage } from "@/lib/i18n";
import type { PecPlatform } from "@/lib/pec/essaiState";
import { Field, TextButton, inputClass } from "./ui";

const copy = {
  fr: {
    identifiant: (l: string) => `Identifiant ${l}`,
    mdp: "Mot de passe",
    tfa: "Le code de double authentification vous sera demandé à la 1re PEC sur ce portail.",
    connecter: (l: string) => `Connecter ${l}`,
    annuler: "Annuler",
  },
  en: {
    identifiant: (l: string) => `${l} username`,
    mdp: "Password",
    tfa: "You will be asked for the two-factor authentication code on your 1st coverage request on this portal.",
    connecter: (l: string) => `Connect ${l}`,
    annuler: "Cancel",
  },
};

type Props = {
  platform: PecPlatform;
  onAdded: () => void;
  onCancel: () => void;
};

/**
 * Mini-formulaire « Connecter [portail] ».
 *
 * SÉCURITÉ : l'identifiant et le mot de passe vivent UNIQUEMENT dans l'état
 * React local de ce composant. Ils ne sont ni envoyés, ni écrits dans
 * sessionStorage/localStorage, ni remontés au parent, et sont effacés à la
 * validation. Pas de <form> : le navigateur ne propose pas de les enregistrer.
 * TODO(CTO) : Paramètres > Accès + credential_check
 */
export function AjoutPortail({ platform, onAdded, onCancel }: Props) {
  const t = copy[useLanguage().lang];
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const ok = login.trim().length > 0 && password.length > 0;

  function add() {
    if (!ok) return;
    setLogin("");
    setPassword("");
    onAdded();
  }

  return (
    <div className="ph-no-capture mt-3 rounded-[16px] p-4" style={{ background: "var(--bg2)" }}>
      <Field label={t.identifiant(platform.label)}>
        <input
          type="text"
          autoComplete="off"
          autoCapitalize="none"
          spellCheck={false}
          value={login}
          onChange={(e) => setLogin(e.target.value)}
          className={inputClass}
          style={{ borderColor: "var(--filet-champ)" }}
        />
      </Field>
      <Field label={t.mdp}>
        <input
          type="password"
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && add()}
          className={inputClass}
          style={{ borderColor: "var(--filet-champ)" }}
        />
      </Field>
      {platform.tfa !== "aucune" && (
        <p className="mb-3 text-[13px] leading-[1.45]" style={{ color: "var(--text-soft)" }}>
          {t.tfa}
        </p>
      )}
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={add}
          disabled={!ok}
          className="btn-primary flex-1 justify-center py-3 text-[15px]"
          style={ok ? undefined : { opacity: 0.45, cursor: "not-allowed" }}
        >
          {t.connecter(platform.label)}
        </button>
        <TextButton onClick={onCancel}>{t.annuler}</TextButton>
      </div>
    </div>
  );
}
