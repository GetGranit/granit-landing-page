import { useMemo, useState } from "react";

import { searchMutuelles } from "@/lib/pec/classify";
import { Kicker, Muted, Screen, TextLink, Title } from "./ui";

/**
 * Saisie du nom de la mutuelle : secours quand la photo ne passe pas ou que
 * l'opticien n'a pas de carte sous la main. Jamais d'impasse : « je ne trouve
 * pas » mène à Paul.
 */
export function StepSearch({
  reason,
  onPick,
  onNotFound,
  onBack,
}: {
  reason?: string | null;
  onPick: (nom: string, platforms: string[]) => void;
  onNotFound: (query: string) => void;
  onBack: () => void;
}) {
  const [q, setQ] = useState("");
  const results = useMemo(() => (q.trim().length >= 2 ? searchMutuelles(q, 8) : []), [q]);

  return (
    <Screen id="search">
      <Kicker>Sans photo</Kicker>
      <Title em="mutuelle">Tapez le nom de la </Title>
      {reason ? (
        <Muted>{reason}</Muted>
      ) : (
        <Muted>Telle qu'elle est écrite sur la carte : MGEN, Harmonie, Malakoff…</Muted>
      )}
      <input
        autoFocus
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Ex. Harmonie Mutuelle"
        className="w-full rounded-xl border-[1.5px] bg-white px-4 py-3.5 text-[17px] outline-none focus:border-[var(--terra)]"
        style={{ borderColor: "var(--border2)", color: "var(--text)" }}
        aria-label="Nom de la mutuelle"
      />
      {results.length > 0 && (
        <ul className="grid w-full gap-2 text-left">
          {results.map((r) => (
            <li key={r.nom}>
              <button
                type="button"
                onClick={() => onPick(r.nom, r.platforms)}
                className="w-full rounded-xl border bg-white px-4 py-3 text-left text-[16px] hover:border-[var(--text)]"
                style={{ borderColor: "var(--border2)", color: "var(--text)" }}
              >
                {r.nom}
              </button>
            </li>
          ))}
        </ul>
      )}
      {q.trim().length >= 2 && results.length === 0 && <Muted>On ne la connaît pas encore.</Muted>}
      <div className="flex flex-wrap justify-center gap-x-5 gap-y-2">
        {q.trim().length >= 2 && (
          <TextLink onClick={() => onNotFound(q.trim())}>
            Je ne la trouve pas : Paul me répond
          </TextLink>
        )}
        <TextLink onClick={onBack}>← Reprendre une photo</TextLink>
      </div>
    </Screen>
  );
}
