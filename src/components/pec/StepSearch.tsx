import { useEffect, useMemo, useState } from "react";

import { searchMutuelles } from "@/lib/pec/classify";
import { useLanguage } from "@/lib/i18n";
import { Kicker, Muted, Screen, TextLink, Title, focusRing } from "./ui";

const copy = {
  fr: {
    kicker: "Sans photo",
    title: "Tapez le nom de la ",
    em: "mutuelle",
    aide: "Telle qu'elle est écrite sur la carte : MGEN, Harmonie, Malakoff…",
    placeholder: "Ex. Harmonie Mutuelle",
    label: "Nom de la mutuelle",
    inconnue: "On ne la connaît pas encore.",
    paul: "Je ne la trouve pas : Paul me répond",
    photo: "← Reprendre une photo",
  },
  en: {
    kicker: "No photo",
    title: "Type the name of the ",
    em: "insurer",
    aide: "As written on the card: MGEN, Harmonie, Malakoff…",
    placeholder: "E.g. Harmonie Mutuelle",
    label: "Supplementary health insurer (mutuelle) name",
    inconnue: "We don’t know this one yet.",
    paul: "I can’t find it: Paul will get back to me",
    photo: "← Take a photo again",
  },
};

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
  onRecherche,
}: {
  reason?: string | null;
  onPick: (nom: string, platforms: string[]) => void;
  onNotFound: (query: string) => void;
  onBack: () => void;
  /** Saisie posée (après une courte pause) : un nom de mutuelle, jamais de patient. */
  onRecherche?: (query: string, n: number) => void;
}) {
  const t = copy[useLanguage().lang];
  const [q, setQ] = useState("");
  const results = useMemo(() => (q.trim().length >= 2 ? searchMutuelles(q, 8) : []), [q]);
  const n = results.length;

  useEffect(() => {
    const requete = q.trim();
    if (requete.length < 2 || !onRecherche) return;
    const t = setTimeout(() => onRecherche(requete, n), 900);
    return () => clearTimeout(t);
  }, [q, n, onRecherche]);

  return (
    <Screen id="search">
      <Kicker>{t.kicker}</Kicker>
      <Title em={t.em}>{t.title}</Title>
      {reason ? <Muted>{reason}</Muted> : <Muted>{t.aide}</Muted>}
      <input
        autoFocus
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder={t.placeholder}
        className={`w-full rounded-xl border-[1.5px] bg-white px-4 py-3.5 text-[17px] ${focusRing}`}
        style={{ borderColor: "var(--border2)", color: "var(--text)" }}
        aria-label={t.label}
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
      {q.trim().length >= 2 && results.length === 0 && <Muted>{t.inconnue}</Muted>}
      <div className="flex flex-wrap justify-center gap-x-5 gap-y-2">
        {q.trim().length >= 2 && <TextLink onClick={() => onNotFound(q.trim())}>{t.paul}</TextLink>}
        <TextLink onClick={onBack}>{t.photo}</TextLink>
      </div>
    </Screen>
  );
}
