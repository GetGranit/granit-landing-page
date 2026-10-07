import { useState } from "react";

import type { SimEchecCause, SimEvent } from "@/lib/pec/simulation";
import {
  Field,
  Kicker,
  Muted,
  Reassure,
  Screen,
  TextLink,
  Title,
  bigBtn,
  euros,
  fieldClass,
  fieldStyle,
} from "./ui";

export type SimResultat = Extract<SimEvent, { type: "resultat" }>;

const emailRe = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

function duree(sec: number) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return m ? `${m} min ${String(s).padStart(2, "0")} s` : `${s} s`;
}

/** E8 · le résultat, puis la suite : l'e-mail, seule donnée demandée. */
export function StepSimDone({
  portail,
  r,
  busy,
  onEmail,
}: {
  portail: string;
  r: SimResultat;
  busy: boolean;
  onEmail: (email: string) => void;
}) {
  const [email, setEmail] = useState("");
  const [err, setErr] = useState("");
  const lignes: [string, number, boolean?][] = [
    ["Total", r.total],
    ["Part Sécurité sociale", r.partSecu],
    ["Part mutuelle", r.partMutuelle, true],
    ["Reste à charge", r.resteACharge],
  ];
  return (
    <Screen id="sim-done">
      <span
        className="rounded-full px-3 py-1 text-[12px]"
        style={{
          background: "var(--sage-light)",
          color: "#2f6b3d",
          fontFamily: "var(--font-mono)",
        }}
      >
        ✓ Simulation faite — rien n'a été envoyé à la mutuelle
      </span>
      <Title em={duree(r.dureeSec)} after=".">
        Votre PEC {portail}, en{" "}
      </Title>
      <dl
        className="grid w-full gap-2 rounded-xl border p-4 text-left text-[15px]"
        style={{ borderColor: "var(--border2)" }}
      >
        {lignes.map(([k, v, fort]) => (
          <div key={k} className="flex justify-between gap-3">
            <dt style={{ color: "var(--text-muted)" }}>{k}</dt>
            <dd
              style={{
                fontFamily: "var(--font-mono)",
                color: fort ? "var(--terra)" : "var(--text)",
                fontWeight: fort ? 600 : 400,
              }}
            >
              {euros(v)}
            </dd>
          </div>
        ))}
        {r.numero && (
          <p
            className="pt-1 text-[12px]"
            style={{ color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}
          >
            Simulation n° {r.numero}
          </p>
        )}
      </dl>
      {r.captureUrl && (
        <img
          src={r.captureUrl}
          alt={`Capture du portail ${portail} après la simulation`}
          className="ph-no-capture w-full rounded-xl border"
          style={{ borderColor: "var(--border2)" }}
        />
      )}

      <div className="grid w-full gap-3 border-t pt-5" style={{ borderColor: "var(--border)" }}>
        <p className="font-serif text-[22px] leading-tight" style={{ color: "var(--text)" }}>
          Granit peut faire ça pour{" "}
          <span className="italic" style={{ color: "var(--terra)" }}>
            toutes vos PEC
          </span>
          , synchronisé avec votre logiciel métier.
        </p>
        <form
          noValidate
          className="grid w-full gap-3"
          onSubmit={(e) => {
            e.preventDefault();
            if (!emailRe.test(email.trim()))
              return setErr("Indiquez un e-mail valide pour retrouver votre espace.");
            setErr("");
            onEmail(email.trim());
          }}
        >
          <Field label="Votre e-mail" error={err}>
            <input
              type="email"
              autoComplete="email"
              inputMode="email"
              placeholder="contact@votre-magasin.fr"
              className={fieldClass}
              style={fieldStyle(err)}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Field>
          <button type="submit" disabled={busy} className={`${bigBtn} w-full disabled:opacity-60`}>
            {busy ? (
              "Un instant…"
            ) : (
              <>
                Ouvrir mon espace Granit <span className="arrow">→</span>
              </>
            )}
          </button>
        </form>
        <Reassure
          items={["Essai gratuit, sans carte bancaire", "Vos accès, supprimables à tout moment"]}
        />
      </div>
    </Screen>
  );
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
