import { useEffect, useMemo, useState } from "react";

import { searchPortails } from "@/lib/pec/resolve";
import { useLanguage } from "@/lib/i18n";
import { Kicker, Muted, Screen, TextLink, Title, focusRing } from "./ui";

const copy = {
  fr: {
    kicker: "Sans photo",
    title: "Tapez le nom du ",
    em: "portail",
    aide: "Tel qu'il est écrit sur la carte, souvent sur la ligne optique : Viamédis, Almerys, Santéclair…",
    placeholder: "Ex. Viamédis",
    label: "Nom du portail écrit sur la carte",
    inconnue: "Ce n'est pas un portail que l'on connaît. Paul regarde pour vous.",
    paul: "Je ne le trouve pas : Paul me répond",
    photo: "← Reprendre une photo",
  },
  en: {
    kicker: "No photo",
    title: "Type the name of the ",
    em: "portal",
    aide: "As written on the card, often on the optical line: Viamédis, Almerys, Santéclair…",
    placeholder: "E.g. Viamédis",
    label: "Name of the portal written on the card",
    inconnue: "This is not a portal we know. Paul will look into it for you.",
    paul: "I can’t find it: Paul will get back to me",
    photo: "← Take a photo again",
  },
};

/**
 * Saisie du portail écrit sur la carte : secours quand la photo ne passe pas ou
 * que la carte lue ne nomme aucun portail connu. On ne cherche que parmi les
 * portails (platforms.json), jamais dans une table mutuelle → portail. Jamais
 * d'impasse : « je ne le trouve pas » mène à Paul avec ce qui a été tapé.
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
  /** Saisie posée (après une courte pause) : un nom de portail ou de mutuelle, jamais de patient. */
  onRecherche?: (query: string, n: number) => void;
}) {
  const t = copy[useLanguage().lang];
  const [q, setQ] = useState("");
  const results = useMemo(() => (q.trim().length >= 2 ? searchPortails(q, 8) : []), [q]);
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
        className={`w-full rounded-xl border-[1.5px] bg-papier px-4 py-3.5 text-[17px] ${focusRing}`}
        style={{ borderColor: "var(--filet-champ)", color: "var(--text)" }}
        aria-label={t.label}
      />
      {results.length > 0 && (
        <ul className="grid w-full gap-2 text-left">
          {results.map((r) => (
            <li key={r.nom}>
              <button
                type="button"
                onClick={() => onPick(r.nom, r.platforms)}
                className="w-full rounded-xl border bg-papier px-4 py-3 text-left text-[16px] hover:border-[var(--text)]"
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
