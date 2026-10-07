import { useState } from "react";

import type { CardRead } from "@/lib/pec/readCard";
import { platformById, type Platform } from "@/lib/pec/resolve";
import { Kicker, Muted, Reassure, Screen, TextLink, Title, bigBtn } from "./ui";

const emailRe = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

/** Ce qu'on a lu, sans jamais rien sur le patient. */
function readLines(card: CardRead | null, p: Platform) {
  const lines: [string, string][] = [];
  if (card?.assureur) lines.push(["Mutuelle", card.assureur]);
  if (card?.reseau) lines.push(["Réseau", card.reseau]);
  if (card?.amc) lines.push(["N° AMC", card.amc]);
  lines.push(["Portail", p.reseau_via ? `${p.label} → ${labelOf(p.reseau_via)}` : p.label]);
  return lines;
}
const labelOf = (id: string) => platformById(id)?.label ?? id;

function expired(fin: string | null | undefined): boolean {
  const m = fin?.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!m) return false;
  return new Date(+m[3], +m[2] - 1, +m[1], 23, 59) < new Date();
}

function PortalBox({ card, p, waiting }: { card: CardRead | null; p: Platform; waiting: boolean }) {
  return (
    <div className="w-full overflow-hidden rounded-xl border text-left text-[13px]" style={{ borderColor: "var(--border2)" }}>
      <div className="px-3 py-1.5 text-[11px] text-white" style={{ background: "#34495e", fontFamily: "var(--font-mono)", letterSpacing: ".04em" }}>
        PORTAIL {(p.reseau_via ? labelOf(p.reseau_via) : p.label).toUpperCase()} · DEMANDE DE PRISE EN CHARGE
      </div>
      <dl className="grid grid-cols-2 gap-2 p-3" style={{ background: "#f5f7f9" }}>
        {readLines(card, p).map(([k, v]) => (
          <div key={k} className="grid gap-0.5">
            <dt className="text-[11px]" style={{ color: "#56606b" }}>{k}</dt>
            <dd className="rounded border bg-white px-2 py-1" style={{ borderColor: "#cfd6de", fontFamily: "var(--font-mono)", color: "#111" }}>
              {v} <span style={{ color: "var(--sage)" }}>✓</span>
            </dd>
          </div>
        ))}
        {waiting && (
          <div className="col-span-2 grid gap-0.5">
            <dt className="text-[11px]" style={{ color: "#56606b" }}>Équipement</dt>
            <dd className="rounded border border-dashed bg-white px-2 py-1" style={{ borderColor: "#cfd6de", color: "#56606b" }}>
              ⌛ équipement d'exemple, modifiable ensuite
            </dd>
          </div>
        )}
      </dl>
    </div>
  );
}

/** E3 · portail simulable : la PEC existe déjà, le compte ne fait que la débloquer. */
export function ResultSimulable({ card, p, onLaunch, busy, example }: { card: CardRead | null; p: Platform; onLaunch: (email: string) => void; busy: boolean; example?: boolean }) {
  const [email, setEmail] = useState("");
  const [err, setErr] = useState("");
  return (
    <Screen id="result-sim">
      <span className="rounded-full px-3 py-1 text-[12px]" style={{ background: "var(--sage-light)", color: "#2f6b3d", fontFamily: "var(--font-mono)" }}>
        ✓ 3 étapes sur 5 déjà faites
      </span>
      {example && <Kicker>Carte d'exemple · au prochain client, prenez sa vraie carte</Kicker>}
      <Title em="est prête" after=".">Votre PEC {p.reseau_via ? labelOf(p.reseau_via) : p.label} </Title>
      {expired(card?.fin_droits) && <Warn>La carte semble expirée ({card?.fin_droits}) : vérifiez les droits du patient.</Warn>}
      <PortalBox card={card} p={p} waiting />
      <p className="text-[15px]" style={{ color: "var(--text)" }}>⏸ Elle attend votre connexion au portail pour être simulée.</p>
      <form
        className="grid w-full gap-3 text-left"
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          if (!emailRe.test(email.trim())) return setErr("Indiquez un e-mail valide pour retrouver votre PEC.");
          setErr("");
          onLaunch(email.trim());
        }}
      >
        <label className="grid gap-1.5 text-[15px]" style={{ color: "var(--text)", fontWeight: 500 }}>
          Votre e-mail
          <input
            type="email"
            autoComplete="email"
            inputMode="email"
            placeholder="contact@votre-magasin.fr"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border-[1.5px] bg-white px-4 py-3.5 text-[17px] outline-none focus:border-[var(--terra)]"
            style={{ borderColor: "var(--border2)", color: "var(--text)" }}
          />
        </label>
        {err && <p role="alert" className="text-[14px]" style={{ color: "var(--terra-hover)" }}>{err}</p>}
        <button type="submit" disabled={busy} className={`${bigBtn} w-full disabled:opacity-60`}>
          {busy ? "Un instant…" : <>Lancer ma PEC <span className="arrow">→</span></>}
        </button>
      </form>
      <Reassure items={["Rien n'est envoyé à la mutuelle", "Essai gratuit, sans carte bancaire", "Photo non conservée"]} />
    </Screen>
  );
}

/** E3 · portail pas (encore) simulable : la valeur d'abord (où aller), puis l'offre. */
export function ResultPortal({ card, p, onContact }: { card: CardRead | null; p: Platform; onContact: () => void }) {
  const target = p.reseau_via ? labelOf(p.reseau_via) : p.label;
  return (
    <Screen id="result-portal">
      <Kicker>Portail trouvé</Kicker>
      <Title em={target} after=".">Votre PEC se fait sur </Title>
      {expired(card?.fin_droits) && <Warn>La carte semble expirée ({card?.fin_droits}) : vérifiez les droits du patient.</Warn>}
      {p.note_fermeture && <Warn>{p.note_fermeture}</Warn>}
      <PortalBox card={card} p={p} waiting={false} />
      <a href={p.url} target="_blank" rel="noopener noreferrer" className="btn-ghost justify-center !px-6 !py-3.5 !text-[16px]">
        Ouvrir le portail {target} ↗
      </a>
      <div className="grid w-full gap-3 border-t pt-5" style={{ borderColor: "var(--border)" }}>
        <p className="font-serif text-[22px] leading-tight" style={{ color: "var(--text)" }}>
          Et si Granit la faisait <span className="italic" style={{ color: "var(--terra)" }}>pour vous</span> ?
        </p>
        <Muted>
          {p.pec_optique_granit
            ? `On remplit et on envoie vos PEC ${target} à votre place. Paul vous montre sur un de vos dossiers, en 15 minutes.`
            : `On ne fait pas encore les PEC ${target}, mais on fait celles de Viamédis, SP Santé, Almerys, Santéclair et d'autres. Paul vous dit lesquelles on peut vous enlever, en 15 minutes.`}
        </Muted>
        <button type="button" className={`${bigBtn} w-full`} onClick={onContact}>
          En parler avec Paul <span className="arrow">→</span>
        </button>
      </div>
    </Screen>
  );
}

/** E3 · deux ou trois portails possibles : on ne devine pas, on demande. */
export function ResultChoice({ platforms, onPick, onType }: { platforms: Platform[]; onPick: (p: Platform) => void; onType: () => void }) {
  return (
    <Screen id="result-choice">
      <Kicker>Presque</Kicker>
      <Title em="plusieurs portails">Cette mutuelle passe par </Title>
      <Muted>Sur lequel faites-vous d'habitude ses PEC ?</Muted>
      <div className="grid w-full gap-2.5">
        {platforms.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => onPick(p)}
            className="w-full rounded-[14px] border-[1.5px] bg-white px-5 py-4 text-[17px] transition-colors hover:border-[var(--text)]"
            style={{ borderColor: "var(--border2)", color: "var(--text)", fontWeight: 500 }}
          >
            {p.label}
          </button>
        ))}
      </div>
      <TextLink onClick={onType}>Aucun de ceux-là : je tape la mutuelle</TextLink>
    </Screen>
  );
}

function Warn({ children }: { children: React.ReactNode }) {
  return (
    <p className="w-full rounded-xl px-3 py-2 text-[15px]" style={{ background: "#fbf0dc", color: "#7a4f12" }}>
      {children}
    </p>
  );
}
