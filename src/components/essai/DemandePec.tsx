import { useState } from "react";

import { useLanguage } from "@/lib/i18n";
import { DOSSIERS_FICTIFS, euros, type DossierFictif } from "@/lib/pec/essaiState";
import { QUOTA } from "./quotaStore";
import { ApercuBadge, Card, Kicker, PopCheck, Row, TextButton, Title } from "./ui";

export type Demande = {
  dossier: DossierFictif;
  statut: "en-cours" | "accordee";
  /** Rang dans les simulations offertes (1 à 20). */
  rang: number;
};

type Props = {
  logiciel: string | null;
  portail: string | null;
  /** La demande lancée, suivie par la page (elle remonte dans l'espace). */
  demande: Demande | null;
  onLaunch: (d: DossierFictif) => void;
  onChooseLogiciel: () => void;
  onBack: () => void;
};

const copy = {
  fr: {
    kicker: "Nouvelle demande",
    lead: "Une PEC,",
    accent: "en deux clics.",
    partiront: (l: string | null) =>
      `Vos PEC partiront de ${l ?? "votre logiciel"} dès qu'il est branché : vous choisissez le dossier, Granit remplit le portail.`,
    choisirLogiciel: "Choisir mon logiciel",
    enAttendant: "En attendant, choisissez le patient…",
    fictifs: "Dossiers fictifs",
    dossier: "Dossier patient",
    lancer: "Lancer la demande",
    retour: "Retour à mon espace",
    lancee: "Demande lancée",
    leadAccordee: "PEC",
    leadEnCours: "C'est parti,",
    accentAccordee: "accordée.",
    accentEnCours: "on s'en occupe.",
    offerte: (rang: number, quota: number) => `Simulation offerte ${rang} / ${quota}`,
    envoyee: (p: string | null) => `Demande envoyée sur ${p ?? "le portail"}`,
    accordeeMutuelle: "Accordée par la mutuelle",
    enCours: "En cours…",
    partMutuelle: "Part mutuelle",
    rac: "Reste à charge patient",
    exemple: "Dossier et montants d'exemple · rien n'est envoyé",
  },
  en: {
    kicker: "New request",
    lead: "A coverage request,",
    accent: "in two clicks.",
    partiront: (l: string | null) =>
      `Your coverage requests will go out from ${l ?? "your software"} once it is connected: you pick the patient file, Granit fills in the portal.`,
    choisirLogiciel: "Choose my software",
    enAttendant: "In the meantime, pick the patient…",
    fictifs: "Fictional files",
    dossier: "Patient file",
    lancer: "Start the request",
    retour: "Back to my workspace",
    lancee: "Request started",
    leadAccordee: "Coverage",
    leadEnCours: "Done,",
    accentAccordee: "approved.",
    accentEnCours: "we’re on it.",
    offerte: (rang: number, quota: number) => `Free simulation ${rang} / ${quota}`,
    envoyee: (p: string | null) => `Request sent on ${p ?? "the portal"}`,
    accordeeMutuelle: "Approved by the insurer",
    enCours: "In progress…",
    partMutuelle: "Insurer share",
    rac: "Patient out-of-pocket amount",
    exemple: "Sample file and amounts · nothing is sent",
  },
};

/** Part mutuelle d'exemple : ~77 % du total, comme la 1re PEC d'exemple. */
function partMutuelle(total: number): number {
  return Math.round(total * 0.77);
}

/**
 * « Faire une demande de PEC » (maquette). Le logiciel n'est jamais vraiment
 * branché ici : on l'explique, puis on montre le parcours avec des dossiers
 * fictifs. TODO(CTO) : dossiers réels via le connecteur logiciel métier.
 */
export function DemandePec({
  logiciel,
  portail,
  demande,
  onLaunch,
  onChooseLogiciel,
  onBack,
}: Props) {
  const { lang } = useLanguage();
  const t = copy[lang];
  const [choix, setChoix] = useState<DossierFictif["id"] | null>(null);
  const dossier = DOSSIERS_FICTIFS.find((d) => d.id === choix) ?? null;

  if (demande) return <Suivi demande={demande} portail={portail} onBack={onBack} />;

  return (
    <div>
      <Kicker>{t.kicker}</Kicker>
      <Title lead={t.lead} accent={t.accent} />
      <p className="mt-3 text-[15px] leading-[1.5]" style={{ color: "var(--text-soft)" }}>
        {t.partiront(logiciel)}
        {!logiciel && (
          <>
            {" "}
            <TextButton onClick={onChooseLogiciel}>{t.choisirLogiciel}</TextButton>
          </>
        )}
      </p>

      <Card className="mt-6">
        <div className="mb-3 flex items-center justify-between gap-3">
          <p className="text-[14px]" style={{ fontWeight: 600 }}>
            {t.enAttendant}
          </p>
          <ApercuBadge>{t.fictifs}</ApercuBadge>
        </div>
        <div role="radiogroup" aria-label={t.dossier} className="space-y-2">
          {DOSSIERS_FICTIFS.map((d) => {
            const on = choix === d.id;
            return (
              <button
                key={d.id}
                type="button"
                role="radio"
                aria-checked={on}
                onClick={() => setChoix(d.id)}
                className="flex w-full items-center justify-between gap-3 rounded-[14px] border px-4 py-3 text-left transition-colors"
                style={{
                  borderColor: on ? "var(--encre)" : "var(--border)",
                  background: on ? "var(--succes-fond)" : "var(--papier)",
                }}
              >
                <span>
                  <span className="block text-[15px]">{d.nom[lang]}</span>
                  <span className="block text-[12px]" style={{ color: "var(--text-muted)" }}>
                    {d.equipement[lang]}
                  </span>
                </span>
                <span
                  className="num-tabular text-[14px]"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  {euros(d.total, lang)}
                </span>
              </button>
            );
          })}
        </div>
        <button
          type="button"
          disabled={!dossier}
          onClick={() => dossier && onLaunch(dossier)}
          className="btn-primary mt-4 w-full justify-center py-3.5 text-[16px]"
          style={dossier ? undefined : { opacity: 0.45, cursor: "not-allowed" }}
        >
          {t.lancer} <span className="arrow">→</span>
        </button>
      </Card>

      <div className="mt-5 text-center">
        <TextButton onClick={onBack}>{t.retour}</TextButton>
      </div>
    </div>
  );
}

function Suivi({
  demande,
  portail,
  onBack,
}: {
  demande: Demande;
  portail: string | null;
  onBack: () => void;
}) {
  const { lang } = useLanguage();
  const t = copy[lang];
  const { dossier, statut } = demande;
  const accordee = statut === "accordee";
  const mutuelle = partMutuelle(dossier.total);
  return (
    <div>
      <Kicker>{t.lancee}</Kicker>
      <Title
        lead={accordee ? t.leadAccordee : t.leadEnCours}
        accent={accordee ? t.accentAccordee : t.accentEnCours}
      />

      <Card className="mt-6">
        <div className="flex items-center justify-between gap-3">
          <p className="text-[15px]" style={{ fontWeight: 600 }}>
            {dossier.nom[lang]}
          </p>
          <ApercuBadge />
        </div>
        <p
          className="num-tabular mt-1 text-[12px]"
          style={{ color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}
        >
          {t.offerte(demande.rang, QUOTA)}
        </p>
        <ol className="mt-4 space-y-3" aria-live="polite">
          <Etape done label={t.envoyee(portail)} />
          <Etape done={accordee} label={accordee ? t.accordeeMutuelle : t.enCours} />
        </ol>
        {accordee && (
          <dl
            className="mt-5 space-y-2.5 border-t pt-4 text-[15px]"
            style={{ borderColor: "var(--border)" }}
          >
            <Row label={dossier.equipement[lang]} value={euros(dossier.total, lang)} />
            <Row label={t.partMutuelle} value={euros(mutuelle, lang)} strong />
            <Row label={t.rac} value={euros(dossier.total - mutuelle, lang)} strong />
          </dl>
        )}
        <p
          className="mt-4 text-[11px]"
          style={{ color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}
        >
          {t.exemple}
        </p>
      </Card>

      <div className="mt-6 text-center">
        <button
          type="button"
          onClick={onBack}
          className="btn-primary w-full justify-center py-3.5 text-[16px]"
        >
          {t.retour}
        </button>
      </div>
    </div>
  );
}

function Etape({ done, label }: { done: boolean; label: string }) {
  return (
    <li className="flex items-center gap-3 text-[15px]">
      <PopCheck done={done} size={20} />
      <span style={{ color: done ? "var(--text)" : "var(--text-soft)" }}>{label}</span>
    </li>
  );
}
