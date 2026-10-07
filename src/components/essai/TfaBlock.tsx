import { useState } from "react";

import type { PecPlatform } from "@/lib/pec/essaiState";
import { PopCheck, inputClass } from "./ui";

type Props = {
  platform: PecPlatform;
  done: boolean;
  onDone: () => void;
  onAskPaul: () => void;
};

/**
 * Double authentification selon le portail. Tout est simulé : aucun accès
 * mail n'est demandé, aucune photo n'est prise ni lue, le code SMS n'est
 * vérifié nulle part.
 * TODO(CTO) : brancher sur Paramètres > Accès (OAuth mail, secret TOTP, SMS).
 */
export function TfaBlock({ platform, done, onDone, onAskPaul }: Props) {
  const [via, setVia] = useState<string | null>(null);
  const [code, setCode] = useState("");

  if (done) {
    return (
      <div
        className="flex items-center gap-3 rounded-[14px] p-3.5"
        style={{ background: "var(--sage-light)" }}
      >
        <PopCheck done />
        <span className="text-[14px]">
          {via ? `${via} branché` : "Sécurité validée"}
          <span style={{ color: "var(--text-muted)" }}> · pour l'aperçu</span>
        </span>
      </div>
    );
  }

  const paulButton = (
    <button
      type="button"
      onClick={onAskPaul}
      className="w-full rounded-full px-5 py-3 text-[15px]"
      style={{ background: "var(--terra-light)", color: "var(--terra-hover)", fontWeight: 600 }}
    >
      Le faire avec Paul
    </button>
  );

  switch (platform.tfa) {
    case "email":
      return (
        <div>
          <p className="text-[15px]" style={{ fontWeight: 600 }}>
            Le code arrive par e-mail
          </p>
          <p className="mt-1 text-[13px]" style={{ color: "var(--text-soft)" }}>
            Branchez votre boîte en 1 clic : lecture seule, révocable quand vous voulez.
          </p>
          <div className="mt-3 grid grid-cols-2 gap-2">
            {["Gmail", "Outlook"].map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => {
                  setVia(m);
                  onDone();
                }}
                className="btn-ghost justify-center py-3"
              >
                Brancher {m}
              </button>
            ))}
          </div>
        </div>
      );

    case "totp":
      return (
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-[15px]" style={{ fontWeight: 600 }}>
              Votre appli d'authentification
            </p>
            <span
              className="rounded-full px-2.5 py-0.5 text-[11px]"
              style={{
                fontFamily: "var(--font-mono)",
                background: "var(--bg3)",
                color: "var(--text-soft)",
              }}
            >
              la plus délicate · comptez 3 min
            </span>
          </div>
          <p className="mt-1 text-[13px] leading-[1.5]" style={{ color: "var(--text-soft)" }}>
            Prenez en photo le QR de votre appli d'authentification ({platform.label} vous l'affiche
            dans « Sécurité »). Granit génère ensuite les codes à votre place.
          </p>
          <div className="mt-3 space-y-2">
            {paulButton}
            <button type="button" onClick={onDone} className="btn-ghost w-full justify-center py-3">
              J'ai le QR sous la main
            </button>
          </div>
        </div>
      );

    case "sms": {
      const ok = /^\d{6}$/.test(code);
      return (
        <div>
          <p className="text-[15px]" style={{ fontWeight: 600 }}>
            Le code arrive par SMS
          </p>
          <p className="mt-1 text-[13px]" style={{ color: "var(--text-soft)" }}>
            Tapez le code à 6 chiffres reçu sur le téléphone du magasin.
          </p>
          <input
            inputMode="numeric"
            maxLength={6}
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
            aria-label="Code reçu par SMS"
            className={`${inputClass} mt-3 text-center tracking-[0.4em]`}
            style={{ borderColor: "var(--border)", fontFamily: "var(--font-mono)" }}
          />
          <button
            type="button"
            onClick={onDone}
            disabled={!ok}
            className="btn-ghost mt-2 w-full justify-center py-3"
            style={ok ? undefined : { opacity: 0.45 }}
          >
            Valider le code
          </button>
          <div className="mt-2">{paulButton}</div>
        </div>
      );
    }

    default:
      return (
        <div>
          <p className="text-[15px]" style={{ fontWeight: 600 }}>
            La sécurité de ce portail
          </p>
          <p className="mt-1 text-[13px]" style={{ color: "var(--text-soft)" }}>
            On ne sait pas encore comment {platform.label} vérifie votre identité. On le regarde
            ensemble au moment de brancher pour de vrai.
          </p>
          <button
            type="button"
            onClick={onDone}
            className="btn-ghost mt-3 w-full justify-center py-3"
          >
            Continuer l'aperçu
          </button>
        </div>
      );
  }
}
