import { useRef, useState } from "react";

import { useLanguage } from "@/lib/i18n";
import { Kicker, Muted, Reassure, Screen, TextLink, Title, bigBtn, focusRing } from "./ui";

const copy = {
  fr: {
    kicker: "Pour les opticiens qui font leurs PEC eux-mêmes",
    title: "Votre prochaine PEC, ",
    em: "sans la taper",
    intro:
      "Prenez en photo la carte de tiers payant de votre client : on identifie le bon portail et on vous donne une estimation du remboursement. La photo n'est jamais conservée.",
    photo: "Prendre la carte en photo",
    importer: "Importer une photo ou un PDF",
    pasDeClient: "Pas de client sous la main ?",
    exemple: "Essayer avec une carte d'exemple",
    taper: "Taper le nom de la mutuelle",
    reassure: ["Photo lue par IA, jamais conservée par Granit", "Gratuit, sans inscription"],
    frameLabel: "Importer une photo ou un PDF de la carte",
    frameHint: "carte à plat, recto, bien éclairée",
  },
  en: {
    kicker: "For opticians who submit their own coverage requests",
    title: "Your next coverage request, ",
    em: "without typing it",
    intro:
      "Take a photo of your customer’s third-party payment card: we identify the right portal and give you an estimate of the reimbursement. The photo is never stored.",
    photo: "Take a photo of the card",
    importer: "Upload a photo or a PDF",
    pasDeClient: "No customer at hand?",
    exemple: "Try with a sample card",
    taper: "Type the insurer’s name",
    reassure: ["Photo read by AI, never stored by Granit", "Free, no sign-up"],
    frameLabel: "Upload a photo or a PDF of the card",
    frameHint: "card flat, front side, well lit",
  },
};

/**
 * E1 · la photo. Caméra arrière d'abord, import juste en dessous (la carte est
 * souvent déjà en photo sur le téléphone), et deux portes de sortie sans
 * jugement : la carte d'exemple et la saisie du nom de la mutuelle.
 */
export function StepCapture({
  onFile,
  onExample,
  onType,
  error,
}: {
  onFile: (f: File) => void;
  onExample: () => void;
  onType: () => void;
  error?: string | null;
}) {
  const t = copy[useLanguage().lang];
  const camera = useRef<HTMLInputElement>(null);
  const gallery = useRef<HTMLInputElement>(null);
  const pick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    e.target.value = "";
    if (f) onFile(f);
  };

  return (
    <Screen id="capture">
      <Kicker>{t.kicker}</Kicker>
      <Title em={t.em}>{t.title}</Title>
      <Muted>{t.intro}</Muted>

      <CardFrame onPick={() => gallery.current?.click()} onFile={onFile} />

      <input
        ref={camera}
        type="file"
        accept="image/*"
        capture="environment"
        hidden
        onChange={pick}
      />
      <input
        ref={gallery}
        type="file"
        accept="image/jpeg,image/png,image/webp,application/pdf"
        hidden
        onChange={pick}
      />

      <button type="button" className={bigBtn} onClick={() => camera.current?.click()}>
        {t.photo} <span className="arrow">→</span>
      </button>
      <TextLink onClick={() => gallery.current?.click()}>{t.importer}</TextLink>

      {error && (
        <p
          role="alert"
          className="rounded-xl px-3 py-2 text-[15px]"
          style={{ background: "var(--lavis)", color: "var(--encre)" }}
        >
          {error}
        </p>
      )}

      <div className="grid w-full gap-2 border-t pt-4" style={{ borderColor: "var(--border)" }}>
        <span className="text-[14px]" style={{ color: "var(--text-muted)" }}>
          {t.pasDeClient}
        </span>
        <div className="flex flex-wrap justify-center gap-x-5 gap-y-2">
          <TextLink onClick={onExample}>{t.exemple}</TextLink>
          <TextLink onClick={onType}>{t.taper}</TextLink>
        </div>
      </div>

      <Reassure items={t.reassure} />
    </Screen>
  );
}

/**
 * Cadre de visée : montre où mettre la carte, s'ouvre au clic (Finder) et accepte
 * aussi le glisser-déposer d'une photo ou d'un PDF.
 */
function CardFrame({ onPick, onFile }: { onPick: () => void; onFile: (f: File) => void }) {
  const t = copy[useLanguage().lang];
  const c = "absolute h-6 w-6 border-[3px]";
  const col = { borderColor: "var(--profond)" };
  const [survol, setSurvol] = useState(false);
  return (
    <button
      type="button"
      onClick={onPick}
      onDragOver={(e) => {
        e.preventDefault();
        if (!survol) setSurvol(true);
      }}
      onDragLeave={() => setSurvol(false)}
      onDrop={(e) => {
        e.preventDefault();
        setSurvol(false);
        const f = e.dataTransfer.files?.[0];
        if (f) onFile(f);
      }}
      aria-label={t.frameLabel}
      className={`relative grid aspect-[1.586] w-full max-w-[340px] cursor-pointer place-items-center rounded-2xl border transition-colors ${
        survol ? "border-[var(--profond)]" : "border-transparent hover:border-[var(--profond)]"
      } ${focusRing}`}
      style={{ background: survol ? "color-mix(in oklab, var(--profond) 8%, var(--bg2))" : "var(--bg2)" }}
    >
      <span
        className={`${c} left-2 top-2 rounded-tl-lg border-b-0 border-r-0`}
        style={col}
        aria-hidden
      />
      <span
        className={`${c} right-2 top-2 rounded-tr-lg border-b-0 border-l-0`}
        style={col}
        aria-hidden
      />
      <span
        className={`${c} bottom-2 left-2 rounded-bl-lg border-r-0 border-t-0`}
        style={col}
        aria-hidden
      />
      <span
        className={`${c} bottom-2 right-2 rounded-br-lg border-l-0 border-t-0`}
        style={col}
        aria-hidden
      />
      <span
        className="text-[13px]"
        style={{ fontFamily: "var(--font-mono)", color: "var(--text-muted)" }}
      >
        {t.frameHint}
      </span>
    </button>
  );
}
