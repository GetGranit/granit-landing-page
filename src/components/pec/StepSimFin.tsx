import type { SimEchecCause, SimEvent } from "@/lib/pec/simulation";
import { Kicker, Muted, Reassure, Screen, TextLink, Title, bigBtn } from "./ui";

export type SimResultat = Extract<SimEvent, { type: "resultat" }>;

export function duree(sec: number) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return m ? `${m} min ${String(s).padStart(2, "0")} s` : `${s} s`;
}

const ECHECS: Record<
  SimEchecCause,
  { titre: string; em: string; texte: (p: string) => string; action: string }
> = {
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

/** Échec : jamais d'erreur technique, une correction possible, Paul à côté. */
export function StepSimEchec({
  portail,
  cause,
  onFix,
  onPaul,
}: {
  portail: string;
  cause: SimEchecCause;
  onFix: () => void;
  onPaul: () => void;
}) {
  const e = ECHECS[cause];
  return (
    <Screen id={`echec-${cause}`}>
      <Kicker>Pas cette fois</Kicker>
      <Title em={e.em} after=".">
        {e.titre}
      </Title>
      <Muted>{e.texte(portail)}</Muted>
      <button type="button" className={`${bigBtn} w-full`} onClick={onFix}>
        {e.action} <span className="arrow">→</span>
      </button>
      <TextLink onClick={onPaul}>Le faire avec Paul</TextLink>
      <Reassure items={["Rien n'a été envoyé à la mutuelle"]} />
    </Screen>
  );
}
