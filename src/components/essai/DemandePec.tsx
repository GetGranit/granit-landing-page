import { useState } from "react";

import { DOSSIERS_FICTIFS, euros, type DossierFictif } from "@/lib/pec/essaiState";
import { QUOTA } from "./quotaStore";
import { ApercuBadge, Card, Kicker, PopCheck, Row, TextButton, Title } from "./ui";

export type Demande = {
  dossier: DossierFictif;
  statut: "en-cours" | "accordee";
  /** Rang dans les PEC offertes (1 à 20). */
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
  const [choix, setChoix] = useState<DossierFictif["id"] | null>(null);
  const dossier = DOSSIERS_FICTIFS.find((d) => d.id === choix) ?? null;

  if (demande) return <Suivi demande={demande} portail={portail} onBack={onBack} />;

  return (
    <div>
      <Kicker>Nouvelle demande</Kicker>
      <Title lead="Une PEC," accent="en deux clics." />
      <p className="mt-3 text-[15px] leading-[1.5]" style={{ color: "var(--text-soft)" }}>
        Vos PEC partiront de {logiciel ?? "votre logiciel"} dès qu'il est branché : vous choisissez
        le dossier, Granit remplit le portail.
        {!logiciel && (
          <>
            {" "}
            <TextButton onClick={onChooseLogiciel}>Choisir mon logiciel</TextButton>
          </>
        )}
      </p>

      <Card className="mt-6">
        <div className="mb-3 flex items-center justify-between gap-3">
          <p className="text-[14px]" style={{ fontWeight: 600 }}>
            En attendant, choisissez le patient…
          </p>
          <ApercuBadge>Dossiers fictifs</ApercuBadge>
        </div>
        <div role="radiogroup" aria-label="Dossier patient" className="space-y-2">
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
                  borderColor: on ? "var(--terra)" : "var(--border)",
                  background: on ? "var(--terra-light)" : "white",
                }}
              >
                <span>
                  <span className="block text-[15px]">{d.nom}</span>
                  <span className="block text-[12px]" style={{ color: "var(--text-muted)" }}>
                    {d.equipement}
                  </span>
                </span>
                <span
                  className="num-tabular text-[14px]"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  {euros(d.total)}
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
          Lancer la demande <span className="arrow">→</span>
        </button>
      </Card>

      <div className="mt-5 text-center">
        <TextButton onClick={onBack}>Retour à mon espace</TextButton>
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
  const { dossier, statut } = demande;
  const accordee = statut === "accordee";
  const mutuelle = partMutuelle(dossier.total);
  return (
    <div>
      <Kicker>Demande lancée</Kicker>
      <Title
        lead={accordee ? "PEC" : "C'est parti,"}
        accent={accordee ? "accordée." : "on s'en occupe."}
      />

      <Card className="mt-6">
        <div className="flex items-center justify-between gap-3">
          <p className="text-[15px]" style={{ fontWeight: 600 }}>
            {dossier.nom}
          </p>
          <ApercuBadge />
        </div>
        <p
          className="num-tabular mt-1 text-[12px]"
          style={{ color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}
        >
          PEC offerte {demande.rang} / {QUOTA}
        </p>
        <ol className="mt-4 space-y-3" aria-live="polite">
          <Etape done label={`Demande envoyée sur ${portail ?? "le portail"}`} />
          <Etape done={accordee} label={accordee ? "Accordée par la mutuelle" : "En cours…"} />
        </ol>
        {accordee && (
          <dl
            className="mt-5 space-y-2.5 border-t pt-4 text-[15px]"
            style={{ borderColor: "var(--border)" }}
          >
            <Row label={dossier.equipement} value={euros(dossier.total)} />
            <Row label="Part mutuelle" value={euros(mutuelle)} strong />
            <Row label="Reste à charge patient" value={euros(dossier.total - mutuelle)} strong />
          </dl>
        )}
        <p
          className="mt-4 text-[11px]"
          style={{ color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}
        >
          Dossier et montants d'exemple · rien n'est envoyé
        </p>
      </Card>

      <div className="mt-6 text-center">
        <button
          type="button"
          onClick={onBack}
          className="btn-primary w-full justify-center py-3.5 text-[16px]"
        >
          Retour à mon espace
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
