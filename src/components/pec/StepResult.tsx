import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

import { useLanguage, type Lang } from "@/lib/i18n";
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
export const PHOTO_NON_CONSERVEE = {
  fr: "Photo lue par IA, jamais conservée par Granit",
  en: "Photo read by AI, never stored by Granit",
} satisfies Record<Lang, string>;

/** Notes de portail (platforms.json, en français) traduites pour l'écran anglais. */
const NOTE_FERMETURE_EN: Record<string, string> = {
  oxantis:
    "The oxantis.net site closes on Oct 26, 2026. We will tell you where to submit these coverage requests next.",
};

const copy = {
  fr: {
    lignes: { mutuelle: "Mutuelle", reseau: "Réseau", amc: "N° AMC", portail: "Portail" },
    portailEntete: (nom: string) => `PORTAIL ${nom} · DEMANDE DE PRISE EN CHARGE`,
    equipement: "Équipement",
    equipementExemple: "⌛ équipement d'exemple, modifiable ensuite",
    trouve: "✓ Portail trouvé",
    exemple: "Carte d'exemple · au prochain client, prenez sa vraie carte",
    simulonsTitre: "Simulons votre PEC sur ",
    peutEtre: (target: string) => `Votre PEC ${target} peut être `,
    peutEtreEm: "simulée en direct",
    expiree: (fin: string | null | undefined) =>
      `La carte semble expirée (${fin}) : vérifiez les droits du patient.`,
    surCompte: (target: string) =>
      `Sur votre compte, pour votre client, sans rien envoyer à la mutuelle. Il faudra son n° de sécu et vos identifiants ${target}.`,
    simuler: "Simuler ma PEC",
    rienEnvoye: "Rien n'est envoyé à la mutuelle",
    accesNonConserves: "Vos accès ne sont pas conservés",
    paulMontre: (target: string) =>
      `Paul vous la montre sur votre compte ${target}, avec un de vos clients, en 15 minutes.`,
    paulBouton: "Paul me la montre",
    retour: "← Retour",
    kickerTrouve: "Portail trouvé",
    seFaitSur: "Votre PEC se fait sur ",
    estimationTitre: "ESTIMATION DU REMBOURSEMENT · LUNETTES",
    priseEnCharge: "pris en charge en moyenne par la complémentaire, sur une paire de lunettes.",
    dapres: "D'après plus de 10\u00a0000 prises en charge déjà gérées pour nos clients opticiens.",
    jamaisTaper: "Ne plus jamais taper une PEC",
    compatible: "COMPATIBLE AVEC VOTRE LOGICIEL",
    etapes: [
      "Ouvrir le portail",
      "Se connecter, code de sécurité",
      "Taper le n° de sécu du client",
      "Saisir l'équipement, les montants",
      "Relire, corriger les fautes",
      "Envoyer la demande",
    ],
    ouvrirPortail: (target: string) => `Ouvrir le portail ${target}`,
    arguments: [
      { ico: "✓", txt: "Dérogations gérées" },
      { ico: "✓", txt: "Contrôle tarifaire" },
      { ico: "✓", txt: "Zéro faute de saisie, zéro rejet à refaire" },
      { ico: "🔒", txt: "Hébergé en France, infrastructure HDS" },
    ],
    etSi: "Et si Granit la faisait ",
    pourVous: "pour vous",
    etSiFin: " ?",
    aLaMain: "À LA MAIN",
    recommence: "…et on recommence à chaque client.",
    avecGranit: "AVEC GRANIT",
    prete: "✓ PEC prête.",
    ouFaire: (portail: string) => `Où faire vos PEC ${portail} `,
    ensuite: "ensuite",
    laissez: "Laissez votre e-mail : on vous écrit dès qu'on sait où elles passent.",
    placeholder: "contact@votre-magasin.fr",
    emailLabel: "E-mail",
    emailInvalide: "Indiquez un e-mail valide.",
    instant: "Un instant…",
    reessayer: "Réessayer",
    prevenir: "Me prévenir",
    presque: "Presque",
    passePar: "Cette mutuelle passe par ",
    plusieurs: "plusieurs portails",
    habitude: "Sur lequel faites-vous d'habitude ses PEC ?",
    aucun: "Aucun de ceux-là : je tape la mutuelle",
  },
  en: {
    lignes: { mutuelle: "Insurer", reseau: "Network", amc: "AMC no.", portail: "Portal" },
    portailEntete: (nom: string) => `${nom} PORTAL · COVERAGE REQUEST`,
    equipement: "Equipment",
    equipementExemple: "⌛ sample equipment, editable later",
    trouve: "✓ Portal found",
    exemple: "Sample card · with your next customer, use their real card",
    simulonsTitre: "Let’s simulate your coverage request on ",
    peutEtre: (target: string) => `Your ${target} coverage request can be `,
    peutEtreEm: "simulated live",
    expiree: (fin: string | null | undefined) =>
      `The card seems to have expired (${fin}): check the patient’s coverage rights.`,
    surCompte: (target: string) =>
      `On your account, for your customer, without sending anything to the insurer. You will need their social security number and your ${target} login.`,
    simuler: "Simulate my coverage request",
    rienEnvoye: "Nothing is sent to the insurer",
    accesNonConserves: "Your login details are not stored",
    paulMontre: (target: string) =>
      `Paul shows it to you on your ${target} account, with one of your customers, in 15 minutes.`,
    paulBouton: "Paul shows me",
    retour: "← Back",
    kickerTrouve: "Portal found",
    seFaitSur: "Your coverage request goes through ",
    estimationTitre: "REIMBURSEMENT ESTIMATE · GLASSES",
    priseEnCharge: "covered on average by the supplementary insurer, for one pair of glasses.",
    dapres:
      "Based on more than 10,000 coverage requests already handled for our optician customers.",
    jamaisTaper: "Never type a coverage request again",
    compatible: "COMPATIBLE WITH YOUR SOFTWARE",
    etapes: [
      "Open the portal",
      "Log in, security code",
      "Type the customer’s social security number",
      "Enter the equipment and amounts",
      "Proofread, fix typos",
      "Send the request",
    ],
    ouvrirPortail: (target: string) => `Open the ${target} portal`,
    arguments: [
      { ico: "✓", txt: "Exceptions handled" },
      { ico: "✓", txt: "Price checks" },
      { ico: "✓", txt: "Zero typos, zero rejections to redo" },
      { ico: "🔒", txt: "Hosted in France, HDS infrastructure" },
    ],
    etSi: "What if Granit did it ",
    pourVous: "for you",
    etSiFin: "?",
    aLaMain: "BY HAND",
    recommence: "…and again for every customer.",
    avecGranit: "WITH GRANIT",
    prete: "✓ Coverage request ready.",
    ouFaire: (portail: string) => `Where to submit your ${portail} coverage requests `,
    ensuite: "next",
    laissez: "Leave your email: we will write to you as soon as we know where they go.",
    placeholder: "contact@your-store.com",
    emailLabel: "Email",
    emailInvalide: "Enter a valid email.",
    instant: "One moment…",
    reessayer: "Try again",
    prevenir: "Notify me",
    presque: "Almost there",
    passePar: "This insurer goes through ",
    plusieurs: "several portals",
    habitude: "Which one do you usually use for its coverage requests?",
    aucun: "None of these: I’ll type the insurer",
  },
};
type Copy = (typeof copy)["fr"];
const emailRe = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

/** Ce qu'on a lu, sans jamais rien sur le patient. */
function readLines(card: CardRead | null, p: Platform, l: Copy["lignes"]) {
  const lines: [string, string][] = [];
  if (card?.assureur) lines.push([l.mutuelle, card.assureur]);
  if (card?.reseau) lines.push([l.reseau, card.reseau]);
  if (card?.amc) lines.push([l.amc, card.amc]);
  lines.push([l.portail, p.reseau_via ? `${p.label} → ${labelOf(p.reseau_via)}` : p.label]);
  return lines;
}
const labelOf = (id: string) => platformById(id)?.label ?? id;

function expired(fin: string | null | undefined): boolean {
  const m = fin?.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!m) return false;
  return new Date(+m[3], +m[2] - 1, +m[1], 23, 59) < new Date();
}

function PortalBox({ card, p, waiting }: { card: CardRead | null; p: Platform; waiting: boolean }) {
  const t = copy[useLanguage().lang];
  return (
    <div
      className="w-full overflow-hidden rounded-xl border text-left text-[13px]"
      style={{ borderColor: "var(--border2)" }}
    >
      <div
        className="px-3 py-1.5 text-[11px] text-white"
        style={{ background: "#34495e", fontFamily: "var(--font-mono)", letterSpacing: ".04em" }}
      >
        {t.portailEntete((p.reseau_via ? labelOf(p.reseau_via) : p.label).toUpperCase())}
      </div>
      <dl className="grid grid-cols-2 gap-2 p-3" style={{ background: "#f5f7f9" }}>
        {readLines(card, p, t.lignes).map(([k, v]) => (
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
              {t.equipement}
            </dt>
            <dd
              className="rounded border border-dashed bg-white px-2 py-1"
              style={{ borderColor: "#cfd6de", color: "#56606b" }}
            >
              {t.equipementExemple}
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
  const { lang } = useLanguage();
  const t = copy[lang];
  const photoOk = photo ? [PHOTO_NON_CONSERVEE[lang]] : [];
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
        {t.trouve}
      </span>
      {example && <Kicker>{t.exemple}</Kicker>}
      {proposee ? (
        <Title em={target} after=".">
          {t.simulonsTitre}
        </Title>
      ) : (
        <Title em={t.peutEtreEm} after=".">
          {t.peutEtre(target)}
        </Title>
      )}
      {expired(card?.fin_droits) && <Warn>{t.expiree(card?.fin_droits)}</Warn>}
      <PortalBox card={card} p={p} waiting />
      {proposee ? (
        <>
          <Muted>{t.surCompte(target)}</Muted>
          <button type="button" className={`${bigBtn} w-full`} onClick={onSimulate}>
            {t.simuler} <span className="arrow">→</span>
          </button>
          <Reassure items={[t.rienEnvoye, t.accesNonConserves, ...photoOk]} />
        </>
      ) : (
        <>
          <Muted>{t.paulMontre(target)}</Muted>
          <button type="button" className={`${bigBtn} w-full`} onClick={onPaul}>
            {t.paulBouton} <span className="arrow">→</span>
          </button>
          <Reassure items={[t.rienEnvoye, ...photoOk]} />
        </>
      )}
      <TextLink onClick={onBack}>{t.retour}</TextLink>
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
  const { lang } = useLanguage();
  const t = copy[lang];
  const target = p.reseau_via ? labelOf(p.reseau_via) : p.label;
  const ferme = p.affichage === "prevenir";
  const estim = ferme ? null : estimationLunettes(p);
  return (
    <Screen id="result-portal">
      <Kicker>{t.kickerTrouve}</Kicker>
      <Title em={target} after=".">
        {t.seFaitSur}
      </Title>
      {expired(card?.fin_droits) && <Warn>{t.expiree(card?.fin_droits)}</Warn>}
      {p.note_fermeture && (
        <Warn>
          {lang === "en" ? (NOTE_FERMETURE_EN[p.id] ?? p.note_fermeture) : p.note_fermeture}
        </Warn>
      )}
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
      {photo && <Reassure items={[PHOTO_NON_CONSERVEE[lang]]} />}
      <TextLink onClick={onBack}>{t.retour}</TextLink>
    </Screen>
  );
}

const euros = (n: number, lang: Lang) =>
  lang === "en" ? `€${n.toLocaleString("en-US")}` : `${n} €`;

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
  const { lang } = useLanguage();
  const t = copy[lang];
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
      <span className="text-[13px]" style={{ fontFamily: "var(--font-mono)", color: "#2f6b3d" }}>
        {t.estimationTitre}
      </span>
      <motion.p
        className="font-serif font-semibold leading-none"
        style={{ color: "#2f6b3d" }}
        initial={run ? { scale: 0.85, opacity: 0 } : false}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      >
        <span className="text-[40px]">{euros(moyenne, lang)}</span>
      </motion.p>
      <motion.p
        className="text-[14px]"
        style={{ color: "#4a5a4f" }}
        initial={run ? { opacity: 0 } : false}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
      >
        {t.priseEnCharge}
      </motion.p>
      <motion.p
        className="text-[12px]"
        style={{ color: "#6b7d70" }}
        initial={run ? { opacity: 0 } : false}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.3, duration: 0.5 }}
      >
        {t.dapres}
      </motion.p>
    </motion.div>
  );
}

/** Le CTA principal : ouvre le calendrier de RDV avec Paul. */
function ConnecterLogiciel({ onRdv }: { onRdv: () => void }) {
  const t = copy[useLanguage().lang];
  return (
    <div className="grid w-full gap-3">
      <a
        href={CAL_URL}
        target="_blank"
        rel="noopener noreferrer"
        onClick={onRdv}
        className={`${bigBtn} w-full justify-center`}
      >
        {t.jamaisTaper} <span className="arrow">→</span>
      </a>
      <div
        className="grid gap-2 rounded-xl border p-3"
        style={{ borderColor: "var(--border2)", background: "var(--bg2)" }}
      >
        <span
          className="text-center text-[11px]"
          style={{
            fontFamily: "var(--font-mono)",
            letterSpacing: ".06em",
            color: "var(--text-muted)",
          }}
        >
          {t.compatible}
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
// Étapes manuelles : `copy.*.etapes`. Le gain de vitesse est déjà dans le
// comparatif 2-colonnes ci-dessus : on ne répète pas « 30 s / 12 min » en chip
// (reco design : couper la redondance). Arguments : `copy.*.arguments`.

function GranitFaitPourVous({ target }: { target: string }) {
  const reduce = useReducedMotion();
  const t = copy[useLanguage().lang];
  const ETAPES_MANUELLES = t.etapes;
  const ARGUMENTS = t.arguments;
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
  const label = (i: number) => (i === 0 ? t.ouvrirPortail(target) : ETAPES_MANUELLES[i]);

  return (
    <div className="grid w-full gap-4 border-t pt-5" style={{ borderColor: "var(--border)" }}>
      <p className="font-serif text-[22px] leading-tight" style={{ color: "var(--text)" }}>
        {t.etSi}
        <span className="italic" style={{ color: "var(--terra)" }}>
          {t.pourVous}
        </span>
        {t.etSiFin}
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
              style={{ fontFamily: "var(--font-mono)", letterSpacing: ".08em", color: "#8a8178" }}
            >
              {t.aLaMain}
            </span>
            <span className="text-[12px]" style={{ color: "#8a8178" }}>
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
                  style={{ borderColor: "#cfc8bd", color: "#b2a99c", fontSize: 10 }}
                >
                  {i + 1}
                </span>
                {label(i)}
              </li>
            ))}
          </ul>
          <span className="text-[12px] italic" style={{ color: "#8a8178" }}>
            {t.recommence}
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
              {t.avecGranit}
            </span>
            <span className="text-[12px] font-semibold" style={{ color: "var(--terra)" }}>
              {t.pourVous}
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
                      color: "#fff",
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
            style={{ color: "#2f6b3d" }}
          >
            {t.prete}
          </motion.span>
        </div>
      </div>

      <ul className="flex flex-wrap gap-2">
        {ARGUMENTS.map((a) => (
          <li
            key={a.txt}
            className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px]"
            style={{ background: "var(--sage-light)", color: "#2f6b3d" }}
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
  const t = copy[useLanguage().lang];
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
        {t.ouFaire(portail)}
        <span className="italic" style={{ color: "var(--terra)" }}>
          {t.ensuite}
        </span>
        {t.etSiFin}
      </p>
      <Muted>{t.laissez}</Muted>
      <input
        type="email"
        inputMode="email"
        autoComplete="email"
        placeholder={t.placeholder}
        aria-label={t.emailLabel}
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
          {t.emailInvalide}
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
        {busy ? t.instant : error ? t.reessayer : t.prevenir}
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
  const t = copy[useLanguage().lang];
  return (
    <Screen id="result-choice">
      <Kicker>{t.presque}</Kicker>
      <Title em={t.plusieurs}>{t.passePar}</Title>
      <Muted>{t.habitude}</Muted>
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
      <TextLink onClick={onType}>{t.aucun}</TextLink>
      <TextLink onClick={onBack}>{t.retour}</TextLink>
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
