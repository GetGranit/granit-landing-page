import { useState } from "react";

import type { CardRead } from "@/lib/pec/readCard";
import { platformById, type Platform } from "@/lib/pec/resolve";
import { Kicker, Muted, Reassure, Screen, TextLink, Title, bigBtn, focusRing } from "./ui";

/** Réassurance photo : seulement s'il y a eu une vraie photo (pas la carte d'exemple, pas la saisie). */
export const PHOTO_NON_CONSERVEE = "Photo lue par IA, jamais conservée par Granit";
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
    <div
      className="w-full overflow-hidden rounded-xl border text-left text-[13px]"
      style={{ borderColor: "var(--border2)" }}
    >
      <div
        className="px-3 py-1.5 text-[11px] text-white"
        style={{ background: "#34495e", fontFamily: "var(--font-mono)", letterSpacing: ".04em" }}
      >
        PORTAIL {(p.reseau_via ? labelOf(p.reseau_via) : p.label).toUpperCase()} · DEMANDE DE PRISE
        EN CHARGE
      </div>
      <dl className="grid grid-cols-2 gap-2 p-3" style={{ background: "#f5f7f9" }}>
        {readLines(card, p).map(([k, v]) => (
          <div key={k} className="grid gap-0.5">
            <dt className="text-[11px]" style={{ color: "#56606b" }}>
              {k}
            </dt>
            <dd
              className="rounded border bg-white px-2 py-1"
              style={{ borderColor: "#cfd6de", fontFamily: "var(--font-mono)", color: "#111" }}
            >
              {v} <span style={{ color: "var(--sage)" }}>✓</span>
            </dd>
          </div>
        ))}
        {waiting && (
          <div className="col-span-2 grid gap-0.5">
            <dt className="text-[11px]" style={{ color: "#56606b" }}>
              Équipement
            </dt>
            <dd
              className="rounded border border-dashed bg-white px-2 py-1"
              style={{ borderColor: "#cfd6de", color: "#56606b" }}
            >
              ⌛ équipement d'exemple, modifiable ensuite
            </dd>
          </div>
        )}
      </dl>
    </div>
  );
}

/**
 * E3 · portail simulable. Si la simulation en direct est proposée, on la
 * lance ; sinon (mock invisible aux vrais visiteurs) Paul la montre sur le
 * compte de l'opticien.
 */
export function ResultSimulable({
  card,
  p,
  example,
  photo,
  proposee,
  onSimulate,
  onPaul,
  onBack,
}: {
  card: CardRead | null;
  p: Platform;
  example?: boolean;
  /** La carte vient d'une vraie photo. */
  photo: boolean;
  proposee: boolean;
  onSimulate: () => void;
  onPaul: () => void;
  onBack: () => void;
}) {
  const photoOk = photo ? [PHOTO_NON_CONSERVEE] : [];
  const target = p.reseau_via ? labelOf(p.reseau_via) : p.label;
  return (
    <Screen id="result-sim">
      <span
        className="rounded-full px-3 py-1 text-[12px]"
        style={{
          background: "var(--sage-light)",
          color: "#2f6b3d",
          fontFamily: "var(--font-mono)",
        }}
      >
        ✓ Portail trouvé
      </span>
      {example && <Kicker>Carte d'exemple · au prochain client, prenez sa vraie carte</Kicker>}
      {proposee ? (
        <Title em={target} after=".">
          Simulons votre PEC sur{" "}
        </Title>
      ) : (
        <Title em="simulée en direct" after=".">
          Votre PEC {target} peut être{" "}
        </Title>
      )}
      {expired(card?.fin_droits) && (
        <Warn>La carte semble expirée ({card?.fin_droits}) : vérifiez les droits du patient.</Warn>
      )}
      <PortalBox card={card} p={p} waiting />
      {proposee ? (
        <>
          <Muted>
            Sur votre compte, pour votre client, sans rien envoyer à la mutuelle. Il faudra son n°
            de sécu et vos identifiants {target}.
          </Muted>
          <button type="button" className={`${bigBtn} w-full`} onClick={onSimulate}>
            Simuler ma PEC <span className="arrow">→</span>
          </button>
          <Reassure
            items={[
              "Rien n'est envoyé à la mutuelle",
              "Vos accès ne sont pas conservés",
              ...photoOk,
            ]}
          />
        </>
      ) : (
        <>
          <Muted>
            Paul vous la montre sur votre compte {target}, avec un de vos clients, en 15 minutes.
          </Muted>
          <button type="button" className={`${bigBtn} w-full`} onClick={onPaul}>
            Paul me la montre <span className="arrow">→</span>
          </button>
          <Reassure items={["Rien n'est envoyé à la mutuelle", ...photoOk]} />
        </>
      )}
      <TextLink onClick={onBack}>← Retour</TextLink>
    </Screen>
  );
}

/**
 * E3 · portail pas (encore) simulable : la valeur d'abord (où aller), puis
 * l'offre. Portail qui ferme (`affichage: "prevenir"`, Oxantis) : on ne promet
 * pas d'y faire les PEC, on propose d'être prévenu de la suite.
 */
export function ResultPortal({
  card,
  p,
  photo,
  busy,
  error,
  onContact,
  onPrevenir,
  onOpen,
  onBack,
}: {
  card: CardRead | null;
  p: Platform;
  photo: boolean;
  busy: boolean;
  /** L'envoi de « Me prévenir » n'est pas parti. */
  error?: string;
  onContact: () => void;
  onPrevenir: (email: string) => void;
  onOpen: () => void;
  onBack: () => void;
}) {
  const target = p.reseau_via ? labelOf(p.reseau_via) : p.label;
  return (
    <Screen id="result-portal">
      <Kicker>Portail trouvé</Kicker>
      <Title em={target} after=".">
        Votre PEC se fait sur{" "}
      </Title>
      {expired(card?.fin_droits) && (
        <Warn>La carte semble expirée ({card?.fin_droits}) : vérifiez les droits du patient.</Warn>
      )}
      {p.note_fermeture && <Warn>{p.note_fermeture}</Warn>}
      <PortalBox card={card} p={p} waiting={false} />
      <a
        href={p.url}
        target="_blank"
        rel="noopener noreferrer"
        onClick={onOpen}
        className="btn-ghost justify-center !px-6 !py-3.5 !text-[16px]"
      >
        Ouvrir le portail {target} ↗
      </a>
      {p.affichage === "prevenir" ? (
        <Prevenir portail={target} busy={busy} error={error} onSubmit={onPrevenir} />
      ) : (
        <div className="grid w-full gap-3 border-t pt-5" style={{ borderColor: "var(--border)" }}>
          <p className="font-serif text-[22px] leading-tight" style={{ color: "var(--text)" }}>
            Et si Granit la faisait{" "}
            <span className="italic" style={{ color: "var(--terra)" }}>
              pour vous
            </span>{" "}
            ?
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
      )}
      {photo && <Reassure items={[PHOTO_NON_CONSERVEE]} />}
      <TextLink onClick={onBack}>← Retour</TextLink>
    </Screen>
  );
}

/** Portail qui ferme : l'e-mail seul, pour dire où faire ces PEC ensuite. */
function Prevenir({
  portail,
  busy,
  error,
  onSubmit,
}: {
  portail: string;
  busy: boolean;
  error?: string;
  onSubmit: (email: string) => void;
}) {
  const [email, setEmail] = useState("");
  const [invalide, setInvalide] = useState(false);
  return (
    <form
      noValidate
      className="grid w-full gap-3 border-t pt-5 text-left"
      style={{ borderColor: "var(--border)" }}
      onSubmit={(e) => {
        e.preventDefault();
        if (!emailRe.test(email.trim())) return setInvalide(true);
        onSubmit(email.trim());
      }}
    >
      <p className="font-serif text-[22px] leading-tight" style={{ color: "var(--text)" }}>
        Où faire vos PEC {portail}{" "}
        <span className="italic" style={{ color: "var(--terra)" }}>
          ensuite
        </span>{" "}
        ?
      </p>
      <Muted>Laissez votre e-mail : on vous écrit dès qu'on sait où elles passent.</Muted>
      <input
        type="email"
        inputMode="email"
        autoComplete="email"
        placeholder="contact@votre-magasin.fr"
        aria-label="E-mail"
        aria-invalid={invalide || undefined}
        aria-describedby={invalide ? "prevenir-erreur" : undefined}
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          setInvalide(false);
        }}
        className={`w-full rounded-xl border-[1.5px] bg-white px-4 py-3 text-[17px] ${focusRing}`}
        style={{ borderColor: invalide ? "var(--terra)" : "var(--border2)", color: "var(--text)" }}
      />
      {invalide && (
        <p
          id="prevenir-erreur"
          role="alert"
          className="text-[14px]"
          style={{ color: "var(--terra-hover)" }}
        >
          Indiquez un e-mail valide.
        </p>
      )}
      {error && !invalide && (
        <p
          role="alert"
          className="rounded-xl px-3 py-2 text-[15px]"
          style={{ background: "#fbf0dc", color: "#7a4f12" }}
        >
          {error}
        </p>
      )}
      <button type="submit" disabled={busy} className={`${bigBtn} w-full disabled:opacity-60`}>
        {busy ? "Un instant…" : error ? "Réessayer" : "Me prévenir"}
      </button>
    </form>
  );
}

/** E3 · deux ou trois portails possibles : on ne devine pas, on demande. */
export function ResultChoice({
  platforms,
  onPick,
  onType,
  onBack,
}: {
  platforms: Platform[];
  onPick: (p: Platform) => void;
  onType: () => void;
  onBack: () => void;
}) {
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
      <TextLink onClick={onBack}>← Retour</TextLink>
    </Screen>
  );
}

function Warn({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="w-full rounded-xl px-3 py-2 text-[15px]"
      style={{ background: "#fbf0dc", color: "#7a4f12" }}
    >
      {children}
    </p>
  );
}
