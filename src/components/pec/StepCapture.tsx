import { useRef } from "react";

import { Kicker, Muted, Reassure, Screen, TextLink, Title, bigBtn } from "./ui";

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
  const camera = useRef<HTMLInputElement>(null);
  const gallery = useRef<HTMLInputElement>(null);
  const pick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    e.target.value = "";
    if (f) onFile(f);
  };

  return (
    <Screen id="capture">
      <Kicker>Pour les opticiens qui font leurs PEC eux-mêmes</Kicker>
      <Title em="sans la taper">Votre prochaine PEC, </Title>
      <Muted>
        Prenez en photo la carte de tiers payant de votre client. On trouve le bon portail et on
        prépare la demande.
      </Muted>

      <CardFrame />

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
        accept="image/jpeg,image/png,image/webp"
        hidden
        onChange={pick}
      />

      <button type="button" className={bigBtn} onClick={() => camera.current?.click()}>
        Prendre la carte en photo <span className="arrow">→</span>
      </button>
      <TextLink onClick={() => gallery.current?.click()}>Importer une photo déjà prise</TextLink>

      {error && (
        <p
          role="alert"
          className="rounded-xl px-3 py-2 text-[15px]"
          style={{ background: "var(--amber-light, #fbf0dc)", color: "#7a4f12" }}
        >
          {error}
        </p>
      )}

      <div className="grid w-full gap-2 border-t pt-4" style={{ borderColor: "var(--border)" }}>
        <span className="text-[14px]" style={{ color: "var(--text-muted)" }}>
          Pas de client sous la main ?
        </span>
        <div className="flex flex-wrap justify-center gap-x-5 gap-y-2">
          <TextLink onClick={onExample}>Essayer avec une carte d'exemple</TextLink>
          <TextLink onClick={onType}>Taper le nom de la mutuelle</TextLink>
        </div>
      </div>

      <Reassure items={["Photo lue puis effacée", "Gratuit, sans inscription"]} />
    </Screen>
  );
}

/** Cadre de visée : montre où mettre la carte, rien de plus. */
function CardFrame() {
  const c = "absolute h-6 w-6 border-[3px]";
  const col = { borderColor: "var(--terra)" };
  return (
    <div
      className="relative grid aspect-[1.586] w-full max-w-[340px] place-items-center rounded-2xl"
      style={{ background: "var(--bg2)" }}
      aria-hidden
    >
      <span className={`${c} left-2 top-2 rounded-tl-lg border-b-0 border-r-0`} style={col} />
      <span className={`${c} right-2 top-2 rounded-tr-lg border-b-0 border-l-0`} style={col} />
      <span className={`${c} bottom-2 left-2 rounded-bl-lg border-r-0 border-t-0`} style={col} />
      <span className={`${c} bottom-2 right-2 rounded-br-lg border-l-0 border-t-0`} style={col} />
      <span
        className="text-[13px]"
        style={{ fontFamily: "var(--font-mono)", color: "var(--text-muted)" }}
      >
        carte à plat, recto, bien éclairée
      </span>
    </div>
  );
}
