import { useState } from "react";

import { PORTAILS, type PecPlatform } from "@/lib/pec/essaiState";
import { AjoutPortail } from "./AjoutPortail";
import { Bascule, Progression } from "./Bascule";
import { Confettis } from "./Confettis";
import { Card, Kicker, PopCheck, TextButton } from "./ui";
import { useIdleWhile } from "./useIdle";

type Props = {
  /** Portail de la simulation : déjà connecté sur /pec. */
  carte: PecPlatform | null;
  selection: ReadonlySet<string>;
  onToggle: (id: string) => void;
  choixFait: boolean;
  onValider: () => void;
  onModifier: () => void;
  connectes: ReadonlySet<string>;
  onConnect: (id: string) => void;
  onIdle: () => void;
  celebrer: boolean;
};

/**
 * Étape « Accès » : l'opticien coche les portails qu'il utilise (rien de
 * pré-coché), puis les connecte un par un. Les identifiants restent dans
 * AjoutPortail ; ici on ne manipule que des identifiants de portail.
 */
export function Acces(props: Props) {
  const { carte, selection, choixFait, connectes } = props;
  const cochés = PORTAILS.filter((p) => p.id !== carte?.id && selection.has(p.id));
  const total = cochés.length + (carte ? 1 : 0);
  const faits = cochés.filter((p) => connectes.has(p.id)).length + (carte ? 1 : 0);

  return (
    <section id="acces" aria-labelledby="acces-titre" className="scroll-mt-6">
      {!choixFait ? (
        <Choix {...props} />
      ) : faits === total ? (
        <Bascule
          portails={[...(carte ? [carte] : []), ...cochés]}
          celebrer={props.celebrer}
          onAjouter={props.onModifier}
        />
      ) : (
        <Connexion {...props} cochés={cochés} faits={faits} total={total} />
      )}
    </section>
  );
}

function Choix({ carte, selection, onToggle, onValider }: Props) {
  const autres = PORTAILS.filter((p) => p.id !== carte?.id);
  const n = autres.filter((p) => selection.has(p.id)).length;
  return (
    <>
      <Kicker>Étape 1 · vos accès</Kicker>
      <h2 id="acces-titre" className="font-serif text-[28px] leading-[1.15]">
        Quels portails <span className="accent-italic">utilisez-vous ?</span>
      </h2>
      <p className="mt-2 text-[15px] leading-[1.5]" style={{ color: "var(--text-soft)" }}>
        Cochez ceux où vous faites des PEC. Granit s'y connecte avec vos accès, une fois pour
        toutes.
      </p>
      <ul className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3">
        {carte && (
          <li>
            <div
              className="flex h-full items-center gap-2.5 rounded-[14px] border px-3 py-3"
              style={{ borderColor: "var(--sage)", background: "var(--sage-light)" }}
            >
              <PopCheck done size={20} />
              <span className="min-w-0">
                <span className="block truncate text-[14px]" style={{ fontWeight: 600 }}>
                  {carte.label}
                </span>
                <span className="block text-[11px]" style={{ color: "var(--text-soft)" }}>
                  Déjà connecté
                </span>
              </span>
            </div>
          </li>
        )}
        {autres.map((p) => {
          const on = selection.has(p.id);
          return (
            <li key={p.id}>
              <button
                type="button"
                aria-pressed={on}
                onClick={() => onToggle(p.id)}
                className="flex h-full w-full items-center gap-2.5 rounded-[14px] border bg-white px-3 py-3 text-left transition-colors"
                style={{
                  borderColor: on ? "var(--terra)" : "var(--border)",
                  background: on ? "var(--terra-light)" : "white",
                }}
              >
                <Case on={on} />
                <span className="min-w-0 truncate text-[14px]">{p.label}</span>
              </button>
            </li>
          );
        })}
      </ul>
      <button
        type="button"
        onClick={onValider}
        className="btn-primary mt-5 w-full justify-center py-3.5 text-[16px]"
      >
        {n > 0
          ? `Connecter ${n === 1 ? "ce portail" : `ces ${n} portails`}`
          : carte
            ? `Je n'utilise que ${carte.label}`
            : "Continuer"}{" "}
        <span className="arrow">→</span>
      </button>
    </>
  );
}

/** Case à cocher dessinée (le bouton porte aria-pressed). */
function Case({ on }: { on: boolean }) {
  return (
    <span
      aria-hidden
      className="flex h-5 w-5 shrink-0 items-center justify-center rounded-[6px] border-2 text-[12px] text-white"
      style={{
        borderColor: on ? "var(--terra)" : "var(--border2)",
        background: on ? "var(--terra)" : "white",
      }}
    >
      {on ? "✓" : ""}
    </span>
  );
}

function Connexion({
  carte,
  cochés,
  connectes,
  onConnect,
  onModifier,
  onIdle,
  faits,
  total,
}: Props & { cochés: PecPlatform[]; faits: number; total: number }) {
  const premier = cochés.find((p) => !connectes.has(p.id))?.id ?? null;
  const [open, setOpen] = useState<string | null>(premier);
  const [burst, setBurst] = useState<{ id: string; n: number }>({ id: "", n: 0 });
  useIdleWhile(open !== null, onIdle);

  function connect(id: string) {
    onConnect(id);
    setBurst((b) => ({ id, n: b.n + 1 }));
    // On enchaîne sur le portail suivant à connecter.
    setOpen(cochés.find((p) => p.id !== id && !connectes.has(p.id))?.id ?? null);
  }

  return (
    <>
      <Kicker>Étape 1 · vos accès</Kicker>
      <h2 id="acces-titre" className="font-serif text-[28px] leading-[1.15]">
        Connectez vos portails, <span className="accent-italic">un par un.</span>
      </h2>
      <Progression faits={faits} total={total} />

      <Card className="mt-5">
        <ul className="divide-y" style={{ borderColor: "var(--border)" }}>
          {carte && <Ligne platform={carte} connected note="Le portail de votre simulation" />}
          {cochés.map((p) => {
            const connected = connectes.has(p.id);
            return (
              <Ligne
                key={p.id}
                platform={p}
                connected={connected}
                burst={burst.id === p.id ? burst.n : 0}
                action={
                  !connected && open !== p.id ? (
                    <TextButton onClick={() => setOpen(p.id)}>Connecter</TextButton>
                  ) : null
                }
              >
                {open === p.id && !connected && (
                  <AjoutPortail
                    platform={p}
                    onCancel={() => setOpen(null)}
                    onAdded={() => connect(p.id)}
                  />
                )}
              </Ligne>
            );
          })}
        </ul>
      </Card>
      <div className="mt-3">
        <TextButton onClick={onModifier}>Modifier ma liste de portails</TextButton>
      </div>
    </>
  );
}

function Ligne({
  platform,
  connected,
  note,
  burst = 0,
  action,
  children,
}: {
  platform: PecPlatform;
  connected: boolean;
  note?: string;
  burst?: number;
  action?: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <li className="py-3">
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <span className="relative inline-flex">
            <PopCheck done={connected} size={22} />
            <Confettis burst={burst} />
          </span>
          <div className="min-w-0">
            <p className="truncate text-[15px]">{platform.label}</p>
            {note && (
              <p className="text-[12px]" style={{ color: "var(--text-muted)" }}>
                {note}
              </p>
            )}
          </div>
        </div>
        {connected ? (
          <span className="text-[13px]" style={{ color: "var(--sage)", fontWeight: 600 }}>
            Connecté
          </span>
        ) : (
          action
        )}
      </div>
      {children}
    </li>
  );
}
