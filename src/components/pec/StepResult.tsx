import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

import type { CardRead } from "@/lib/pec/readCard";
import { platformById, type Platform } from "@/lib/pec/resolve";
import { estimationLunettes, type EstimationLunettes } from "@/lib/pec/estimation";
import { Kicker, Muted, Reassure, Screen, TextLink, Title, bigBtn, focusRing } from "./ui";

/** Lien de prise de rendez-vous (CTA « Connecter mon logiciel »). */
export const CAL_URL = "https://cal.com/paul-pietra-granit/votre-environnement-granit";
/** Logiciels métier sur lesquels Granit se branche (réponse personnalisée). */
const LOGICIELS: { name: string; logo?: string }[] = [
  { name: "Cosium", logo: "/logos/cosium.png" },
  { name: "Optimum", logo: "/logos/optimum.png" },
  { name: "MyEasyOptic", logo: "/logos/myeasyoptic.png" },
  { name: "WinOptics", logo: "/logos/winoptics.png" },
];

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
              style={{ borderColor: "#cfd6de", fontFamily: "var(--font-mono)", color: "#1f3530" }}
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
          color: "#2f7a64",
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
 * E3 · le résultat du lead magnet : on a trouvé le portail, on donne une
 * ESTIMATION indicative du remboursement (montant moyen issu de nos facturations
 * réelles, pas le remboursement du client), puis on explique que le montant
 * exact passe par le logiciel métier → rendez-vous. Pas de bouton « ouvrir le
 * portail » (on ne renvoie pas le prospect se débrouiller seul), pas de promesse
 * de réponse immédiate. Portail qui ferme (`affichage: "prevenir"`, Oxantis) :
 * on ne donne pas d'estimation, on propose d'être prévenu de la suite.
 */
export function ResultEstimation({
  card,
  p,
  photo,
  busy,
  error,
  onRdv,
  onPrevenir,
  onBack,
}: {
  card: CardRead | null;
  p: Platform;
  photo: boolean;
  busy: boolean;
  /** L'envoi de « Me prévenir » n'est pas parti. */
  error?: string;
  /** Suivi du clic sur le CTA (le lien ouvre le calendrier dans un nouvel onglet). */
  onRdv: () => void;
  onPrevenir: (email: string) => void;
  onBack: () => void;
}) {
  const target = p.reseau_via ? labelOf(p.reseau_via) : p.label;
  const ferme = p.affichage === "prevenir";
  const estim = ferme ? null : estimationLunettes(p);
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
      {ferme ? (
        <Prevenir portail={target} busy={busy} error={error} onSubmit={onPrevenir} />
      ) : (
        <>
          {estim && <Estimation estim={estim} />}
          <GranitFaitPourVous target={target} />
          <ConnecterLogiciel onRdv={onRdv} />
        </>
      )}
      {photo && <Reassure items={[PHOTO_NON_CONSERVEE]} />}
      <TextLink onClick={onBack}>← Retour</TextLink>
    </Screen>
  );
}

const euros = (n: number) => `${n} €`;

const sageBox = "grid w-full gap-1.5 rounded-xl border p-4 text-left";
const sageStyle = {
  borderColor: "color-mix(in oklab, var(--sage) 45%, transparent)",
  background: "var(--sage-light)",
} as const;

/** Compteur qui monte de 0 à `target` (easeOutCubic). `run=false` → valeur finale directe. */
function useCountUp(target: number, run: boolean, ms = 900): number {
  const [v, setV] = useState(run ? 0 : target);
  useEffect(() => {
    if (!run) {
      setV(target);
      return;
    }
    let raf = 0;
    const t0 = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / ms);
      const eased = 1 - Math.pow(1 - p, 3);
      setV(Math.round(target * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, run, ms]);
  return v;
}

/**
 * L'estimation : le montant pris en charge, en gros, avec une légère animation
 * d'apparition — le chiffre monte et « pop » d'abord, l'explication arrive juste
 * après (effet « waouh »). Honnête : montant moyen (médiane) de nos facturations.
 */
function Estimation({ estim }: { estim: EstimationLunettes }) {
  const reduce = useReducedMotion();
  const run = !reduce;
  const moyenne = useCountUp(estim.f.median, run);
  return (
    <motion.div
      className={sageBox}
      style={sageStyle}
      initial={run ? { opacity: 0, y: 10 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <span className="text-[13px]" style={{ fontFamily: "var(--font-mono)", color: "#2f7a64" }}>
        ESTIMATION DU REMBOURSEMENT · LUNETTES
      </span>
      <motion.p
        className="font-serif font-semibold leading-none"
        style={{ color: "#2f7a64" }}
        initial={run ? { scale: 0.85, opacity: 0 } : false}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      >
        <span className="text-[40px]">{euros(moyenne)}</span>
      </motion.p>
      <motion.p
        className="text-[14px]"
        style={{ color: "rgba(31,53,48,.82)" }}
        initial={run ? { opacity: 0 } : false}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
      >
        pris en charge en moyenne par la complémentaire, sur une paire de lunettes.
      </motion.p>
      <motion.p
        className="text-[12px]"
        style={{ color: "rgba(31,53,48,.7)" }}
        initial={run ? { opacity: 0 } : false}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.3, duration: 0.5 }}
      >
        D'après plus de 10&nbsp;000 prises en charge déjà gérées pour nos clients opticiens.
      </motion.p>
    </motion.div>
  );
}

/** Le CTA principal : ouvre le calendrier de RDV avec Paul. */
function ConnecterLogiciel({ onRdv }: { onRdv: () => void }) {
  return (
    <div className="grid w-full gap-3">
      <a
        href={CAL_URL}
        target="_blank"
        rel="noopener noreferrer"
        onClick={onRdv}
        className={`${bigBtn} w-full justify-center`}
      >
        Ne plus jamais taper une PEC <span className="arrow">→</span>
      </a>
      <div
        className="grid gap-2 rounded-xl border p-3"
        style={{ borderColor: "var(--border2)", background: "var(--bg2)" }}
      >
        <span
          className="text-center text-[11px]"
          style={{ fontFamily: "var(--font-mono)", letterSpacing: ".06em", color: "var(--text-muted)" }}
        >
          COMPATIBLE AVEC VOTRE LOGICIEL
        </span>
        <ul className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
          {LOGICIELS.map((l) =>
            l.logo ? (
              <li key={l.name} className="flex items-center">
                <img src={l.logo} alt={l.name} className="h-6 w-auto object-contain opacity-90" />
              </li>
            ) : (
              <li
                key={l.name}
                className="text-[14px] font-semibold"
                style={{ color: "var(--text)" }}
              >
                {l.name}
              </li>
            ),
          )}
        </ul>
      </div>
    </div>
  );
}

/**
 * Le passage « à la main ⟷ avec Granit » : à gauche la corvée que l'opticien
 * refait à chaque client, à droite les mêmes étapes qui se cochent toutes
 * seules (en boucle), avec les arguments forts (HDS, vitesse, zéro faute).
 */
const ETAPES_MANUELLES = [
  "Ouvrir le portail",
  "Se connecter, code de sécurité",
  "Taper le n° de sécu du client",
  "Saisir l'équipement, les montants",
  "Relire, corriger les fautes",
  "Envoyer la demande",
];

// Le gain de vitesse est déjà dans le comparatif 2-colonnes ci-dessus : on ne
// répète pas « 30 s / 12 min » en chip (reco design : couper la redondance).
const ARGUMENTS = [
  { ico: "✓", txt: "Dérogations gérées" },
  { ico: "✓", txt: "Contrôle tarifaire" },
  { ico: "✓", txt: "Zéro faute de saisie, zéro rejet à refaire" },
  { ico: "🔒", txt: "Hébergé en France, agréé santé (HDS)" },
];

function GranitFaitPourVous({ target }: { target: string }) {
  const reduce = useReducedMotion();
  const total = ETAPES_MANUELLES.length;
  const [faites, setFaites] = useState(reduce ? total : 0);
  useEffect(() => {
    if (reduce) return;
    let i = 0;
    const id = setInterval(() => {
      i = i > total ? 0 : i + 1;
      setFaites(Math.min(i, total));
      if (i > total) i = 0;
    }, 650);
    return () => clearInterval(id);
  }, [reduce, total]);
  const label = (i: number) => (i === 0 ? `Ouvrir le portail ${target}` : ETAPES_MANUELLES[i]);

  return (
    <div className="grid w-full gap-4 border-t pt-5" style={{ borderColor: "var(--border)" }}>
      <p className="font-serif text-[22px] leading-tight" style={{ color: "var(--text)" }}>
        Et si Granit la faisait{" "}
        <span style={{ color: "var(--terra)" }}>
          pour vous
        </span>{" "}
        ?
      </p>

      <div className="grid gap-3 sm:grid-cols-2">
        {/* À la main */}
        <div
          className="grid content-start gap-2 rounded-xl border p-3 text-left"
          style={{ borderColor: "var(--border2)", background: "var(--bg2)" }}
        >
          <div className="flex items-baseline justify-between">
            <span
              className="text-[11px]"
              style={{ fontFamily: "var(--font-mono)", letterSpacing: ".08em", color: "rgba(31,53,48,.6)" }}
            >
              À LA MAIN
            </span>
            <span className="text-[12px]" style={{ color: "rgba(31,53,48,.6)" }}>
              ~10 min
            </span>
          </div>
          <ul className="grid gap-1.5">
            {ETAPES_MANUELLES.map((_, i) => (
              <li
                key={i}
                className="flex items-center gap-2 text-[13px]"
                style={{ color: "var(--text-muted)" }}
              >
                <span
                  className="grid h-4 w-4 shrink-0 place-items-center rounded-full border"
                  style={{ borderColor: "rgba(31,53,48,.2)", color: "rgba(31,53,48,.5)", fontSize: 10 }}
                >
                  {i + 1}
                </span>
                {label(i)}
              </li>
            ))}
          </ul>
          <span className="text-[12px] italic" style={{ color: "rgba(31,53,48,.6)" }}>
            …et on recommence à chaque client.
          </span>
        </div>

        {/* Avec Granit */}
        <div
          className="grid content-start gap-2 rounded-xl border p-3 text-left"
          style={{
            borderColor: "color-mix(in oklab, var(--terra) 40%, transparent)",
            background: "color-mix(in oklab, var(--terra) 7%, var(--bg3))",
          }}
        >
          <div className="flex items-baseline justify-between">
            <span
              className="text-[11px]"
              style={{
                fontFamily: "var(--font-mono)",
                letterSpacing: ".08em",
                color: "var(--terra)",
              }}
            >
              AVEC GRANIT
            </span>
            <span className="text-[12px] font-semibold" style={{ color: "var(--terra)" }}>
              pour vous
            </span>
          </div>
          <ul className="grid gap-1.5">
            {ETAPES_MANUELLES.map((_, i) => {
              const done = i < faites;
              return (
                <li key={i} className="flex items-center gap-2 text-[13px]">
                  <motion.span
                    className="grid h-4 w-4 shrink-0 place-items-center rounded-full"
                    initial={false}
                    animate={{
                      scale: done ? 1 : 0.8,
                      background: done ? "var(--sage)" : "transparent",
                    }}
                    transition={{ duration: 0.25 }}
                    style={{
                      color: "#fffdfd",
                      fontSize: 11,
                      border: done ? "none" : "1px solid #cfd6de",
                    }}
                  >
                    {done ? "✓" : ""}
                  </motion.span>
                  <span style={{ color: done ? "var(--text)" : "var(--text-muted)" }}>
                    {label(i)}
                  </span>
                </li>
              );
            })}
          </ul>
          <motion.span
            className="text-[12px] font-semibold"
            animate={{ opacity: faites >= total ? 1 : 0.35 }}
            transition={{ duration: 0.25 }}
            style={{ color: "#2f7a64" }}
          >
            ✓ PEC prête.
          </motion.span>
        </div>
      </div>

      <ul className="flex flex-wrap gap-2">
        {ARGUMENTS.map((a) => (
          <li
            key={a.txt}
            className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px]"
            style={{ background: "var(--sage-light)", color: "#2f7a64" }}
          >
            <span aria-hidden>{a.ico}</span>
            {a.txt}
          </li>
        ))}
      </ul>
    </div>
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
        <span style={{ color: "var(--terra)" }}>
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
          style={{ background: "#faeaef", color: "#a9433d" }}
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
      style={{ background: "#faeaef", color: "#a9433d" }}
    >
      {children}
    </p>
  );
}
