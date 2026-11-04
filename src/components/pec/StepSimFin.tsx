import { useLanguage, type Lang } from "@/lib/i18n";
import type { SimEchecCause, SimEvent } from "@/lib/pec/simulation";
import { Kicker, Muted, Reassure, Screen, TextLink, Title, bigBtn } from "./ui";

export type SimResultat = Extract<SimEvent, { type: "resultat" }>;

export function duree(sec: number, lang: Lang = "fr") {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  if (lang === "en") return m ? `${m}m ${String(s).padStart(2, "0")}s` : `${s}s`;
  return m ? `${m} min ${String(s).padStart(2, "0")} s` : `${s} s`;
}

type Echecs = Record<
  SimEchecCause,
  { titre: string; em: string; texte: (p: string) => string; action: string }
>;

const ECHECS: Echecs = {
  identifiants: {
    titre: "Le portail n'a pas reconnu ",
    em: "ces identifiants",
    texte: (p) =>
      `Ça arrive souvent : une majuscule, un mot de passe changé récemment. Vérifiez-les tels que vous les tapez sur ${p}.`,
    action: "Corriger mes identifiants",
  },
  code: {
    titre: "Le code n'est pas ",
    em: "passé",
    texte: () =>
      "Trois codes ont été refusés. Les codes changent vite : on recommence avec un code tout frais.",
    action: "Recommencer",
  },
  patient: {
    titre: "Le portail ne retrouve pas ",
    em: "ce patient",
    texte: (p) =>
      `Vérifiez le n° de sécu et la date de naissance. Si tout est bon, le patient n'a peut-être pas de droits ouverts sur ${p}.`,
    action: "Vérifier le patient",
  },
  portail: {
    titre: "Le portail ne répond ",
    em: "pas",
    texte: (p) =>
      `${p} ne répond pas pour l'instant. Ce n'est pas vous : réessayez dans quelques minutes.`,
    action: "Réessayer",
  },
  inconnu: {
    titre: "La simulation s'est ",
    em: "interrompue",
    texte: () => "On n'a pas pu aller au bout cette fois-ci. Réessayez, ou faites-la avec Paul.",
    action: "Réessayer",
  },
};

const ECHECS_EN: Echecs = {
  identifiants: {
    titre: "The portal did not recognize ",
    em: "these credentials",
    texte: (p) =>
      `It happens often: a capital letter, a recently changed password. Check them exactly as you type them on ${p}.`,
    action: "Fix my credentials",
  },
  code: {
    titre: "The code did not ",
    em: "go through",
    texte: () =>
      "Three codes were rejected. Codes change quickly: let’s start again with a fresh one.",
    action: "Start again",
  },
  patient: {
    titre: "The portal cannot find ",
    em: "this patient",
    texte: (p) =>
      `Check the social security number and the date of birth. If everything is right, the patient may not have active coverage rights on ${p}.`,
    action: "Check the patient",
  },
  portail: {
    titre: "The portal is not ",
    em: "responding",
    texte: (p) => `${p} is not responding right now. It is not you: try again in a few minutes.`,
    action: "Try again",
  },
  inconnu: {
    titre: "The simulation was ",
    em: "interrupted",
    texte: () => "We could not finish this time. Try again, or do it with Paul.",
    action: "Try again",
  },
};

const copy = {
  fr: {
    kicker: "Pas cette fois",
    avecPaul: "Le faire avec Paul",
    rien: "Rien n'a été envoyé à la mutuelle",
    retour: "← Retour",
  },
  en: {
    kicker: "Not this time",
    avecPaul: "Do it with Paul",
    rien: "Nothing was sent to the insurer",
    retour: "← Back",
  },
};

/** Échec : jamais d'erreur technique, une correction possible, Paul à côté. */
export function StepSimEchec({
  portail,
  cause,
  onFix,
  onPaul,
  onBack,
}: {
  portail: string;
  cause: SimEchecCause;
  onFix: () => void;
  onPaul: () => void;
  onBack: () => void;
}) {
  const { lang } = useLanguage();
  const t = copy[lang];
  const e = (lang === "en" ? ECHECS_EN : ECHECS)[cause];
  return (
    <Screen id={`echec-${cause}`}>
      <Kicker>{t.kicker}</Kicker>
      <Title em={e.em} after=".">
        {e.titre}
      </Title>
      <Muted>{e.texte(portail)}</Muted>
      <button type="button" className={`${bigBtn} w-full`} onClick={onFix}>
        {e.action} <span className="arrow">→</span>
      </button>
      <TextLink onClick={onPaul}>{t.avecPaul}</TextLink>
      <Reassure items={[t.rien]} />
      <TextLink onClick={onBack}>{t.retour}</TextLink>
    </Screen>
  );
}
