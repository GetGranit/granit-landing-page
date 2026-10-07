import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

import { LOGICIELS, PORTAILS, type PecPlatform, type Readiness } from "@/lib/pec/essaiState";
import { AjoutPortail } from "./AjoutPortail";
import { ApercuBadge, Card, Kicker, PopCheck, TextButton } from "./ui";

const IDLE_MS = 60_000;
const VISIBLES = 4;

type Props = {
  carte: PecPlatform | null;
  portailConnecte: boolean;
  added: ReadonlySet<string>;
  onAddPortal: (id: string) => void;
  logiciel: string | null;
  onLogiciel: (l: string) => void;
  readiness: { items: Readiness; percent: number };
  /** 60 s sans action pendant un ajout de connexion. */
  onIdle: () => void;
};

/** « Vos connexions » : tout est asynchrone, rien n'est obligatoire maintenant. */
export function Connexions(props: Props) {
  const { carte, portailConnecte, added, onAddPortal, logiciel, onLogiciel, readiness } = props;
  const [open, setOpen] = useState<string | null>(null);
  const [all, setAll] = useState(false);
  const [pickLogiciel, setPickLogiciel] = useState(false);
  useIdleWhile(open !== null || pickLogiciel, props.onIdle);

  const autres = PORTAILS.filter((p) => p.id !== carte?.id);
  const visibles = all ? autres : autres.slice(0, VISIBLES);

  function portalRow(p: PecPlatform, connected: boolean, note?: string) {
    return (
      <li key={p.id} className="py-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <PopCheck done={connected} size={20} />
            <div className="min-w-0">
              <p className="truncate text-[15px]">{p.label}</p>
              {note && (
                <p className="text-[12px]" style={{ color: "var(--text-muted)" }}>
                  {note}
                </p>
              )}
            </div>
          </div>
          {connected ? (
            <span className="text-[13px]" style={{ color: "var(--sage)", fontWeight: 600 }}>
              {portailConnecte && p.id === carte?.id ? "Connecté" : "Ajouté"}
            </span>
          ) : open !== p.id ? (
            <TextButton onClick={() => setOpen(p.id)}>Ajouter</TextButton>
          ) : null}
        </div>
        {open === p.id && !connected && (
          <AjoutPortail
            platform={p}
            onCancel={() => setOpen(null)}
            onAdded={() => {
              onAddPortal(p.id);
              setOpen(null);
            }}
          />
        )}
      </li>
    );
  }

  return (
    <section aria-labelledby="connexions-titre">
      <Kicker>Vos connexions</Kicker>
      <h2 id="connexions-titre" className="font-serif text-[26px] leading-[1.15]">
        Branchez le reste <span className="accent-italic">quand vous voulez.</span>
      </h2>
      <Jauge {...readiness} />

      <Card className="mt-5">
        <p className="eyebrow mb-1" style={{ color: "var(--text-muted)" }}>
          Portails tiers payant
        </p>
        <ul className="divide-y" style={{ borderColor: "var(--border)" }}>
          {carte &&
            portalRow(
              carte,
              portailConnecte || added.has(carte.id),
              portailConnecte
                ? "Le portail de la carte, branché tout à l'heure"
                : "Le portail de la carte",
            )}
          {visibles.map((p) => portalRow(p, added.has(p.id)))}
        </ul>
        {autres.length > VISIBLES && (
          <div className="mt-1">
            <TextButton onClick={() => setAll((a) => !a)}>
              {all ? "Moins de portails" : `Voir tous les portails (${autres.length})`}
            </TextButton>
          </div>
        )}
      </Card>

      <Card className="mt-4">
        <div className="mb-1 flex items-center justify-between gap-3">
          <p className="eyebrow" style={{ color: "var(--text-muted)" }}>
            Logiciel métier
          </p>
          {logiciel && <ApercuBadge />}
        </div>
        {logiciel ? (
          <div className="flex items-start gap-3 py-2">
            <PopCheck done size={20} />
            <div>
              <p className="text-[15px]">{logiciel}</p>
              {/* TODO(CTO) : connecteur logiciel métier */}
              <p className="text-[13px]" style={{ color: "var(--text-soft)" }}>
                En cours de branchement · on vous prévient par e-mail
              </p>
            </div>
          </div>
        ) : pickLogiciel ? (
          <div className="mt-2 flex flex-wrap gap-2" role="radiogroup" aria-label="Votre logiciel">
            {LOGICIELS.map((l) => (
              <button
                key={l}
                type="button"
                role="radio"
                aria-checked={false}
                onClick={() => {
                  onLogiciel(l);
                  setPickLogiciel(false);
                }}
                className="rounded-full border bg-white px-4 py-2 text-[14px] transition-colors hover:border-[color:var(--terra)]"
                style={{ borderColor: "var(--border2)" }}
              >
                {l}
              </button>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-between gap-3 py-2">
            <p className="text-[14px] leading-[1.45]" style={{ color: "var(--text-soft)" }}>
              Vos PEC partent directement de vos dossiers patients.
            </p>
            <TextButton onClick={() => setPickLogiciel(true)}>Choisir</TextButton>
          </div>
        )}
      </Card>
    </section>
  );
}

function Jauge({ items, percent }: { items: Readiness; percent: number }) {
  const reduce = useReducedMotion();
  return (
    <div className="mt-4">
      <div className="mb-2 flex items-baseline justify-between text-[13px]">
        <span style={{ color: "var(--text-soft)" }}>Votre espace est prêt à</span>
        <span className="num-tabular" style={{ fontFamily: "var(--font-mono)", fontWeight: 600 }}>
          {percent} %
        </span>
      </div>
      <div
        className="h-2 overflow-hidden rounded-full"
        style={{ background: "var(--bg3)" }}
        role="progressbar"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Votre espace est prêt"
      >
        <motion.div
          className="h-full rounded-full"
          style={{ background: "var(--sage)" }}
          initial={false}
          animate={{ width: `${percent}%` }}
          transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 120, damping: 20 }}
        />
      </div>
      <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[12px]">
        {items.map((i) => (
          <li key={i.label} style={{ color: i.done ? "var(--text-soft)" : "var(--text-muted)" }}>
            <span aria-hidden style={{ color: i.done ? "var(--sage)" : "var(--border2)" }}>
              {i.done ? "✓" : "○"}
            </span>{" "}
            {i.label}
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Appelle `onIdle` après 60 s sans action, tant que `active` (une seule fois). */
function useIdleWhile(active: boolean, onIdle: () => void) {
  const fired = useRef(false);
  useEffect(() => {
    if (!active || fired.current) return;
    let timer = window.setTimeout(fire, IDLE_MS);
    function fire() {
      if (fired.current) return;
      fired.current = true;
      onIdle();
    }
    function reset() {
      window.clearTimeout(timer);
      timer = window.setTimeout(fire, IDLE_MS);
    }
    const events = ["pointerdown", "keydown", "input", "scroll"] as const;
    events.forEach((e) => window.addEventListener(e, reset, { passive: true }));
    return () => {
      window.clearTimeout(timer);
      events.forEach((e) => window.removeEventListener(e, reset));
    };
  }, [active, onIdle]);
}
