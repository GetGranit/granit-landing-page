import { useState } from "react";

import { Card, Kicker, PopCheck, Reassure, TextButton, Title } from "./ui";

const LOGICIELS = ["Cosium", "Osmose", "Optimum", "Winoptics", "Autre"] as const;

type Props = {
  onAskPaul: () => void;
};

/**
 * E6 « Pour que les PEC partent toutes seules » : brancher le logiciel du
 * magasin (optionnel, simulé), puis le récap de l'essai. Pas de banque ici.
 * TODO(CTO) : brancher sur Paramètres > Accès (connecteur logiciel métier).
 */
export function LogicielStep({ onAskPaul }: Props) {
  const [choice, setChoice] = useState<string | null>(null);
  const [branche, setBranche] = useState(false);
  const [skipped, setSkipped] = useState(false);
  const showRecap = branche || skipped;

  return (
    <div>
      <Kicker>Optionnel · 1 min</Kicker>
      <Title lead="Pour que les PEC partent" accent="toutes seules." />
      <p className="mt-3 text-[15px] leading-[1.5]" style={{ color: "var(--text-soft)" }}>
        Branchez votre logiciel : Granit voit passer chaque nouveau dossier et prépare la PEC sans
        que vous scanniez la carte.
      </p>

      <Card className="mt-6">
        {branche ? (
          <div className="flex items-center gap-3">
            <PopCheck done />
            <span className="text-[15px]">
              {choice} noté{" "}
              <span style={{ color: "var(--text-muted)" }}>· on le branche avec vous</span>
            </span>
          </div>
        ) : (
          <>
            <p className="mb-3 text-[14px]" style={{ fontWeight: 600 }}>
              Votre logiciel
            </p>
            <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Votre logiciel">
              {LOGICIELS.map((l) => {
                const on = choice === l;
                return (
                  <button
                    key={l}
                    type="button"
                    role="radio"
                    aria-checked={on}
                    onClick={() => setChoice(l)}
                    className="rounded-full border px-4 py-2 text-[14px] transition-colors"
                    style={{
                      borderColor: on ? "var(--terra)" : "var(--border2)",
                      background: on ? "var(--terra-light)" : "white",
                      color: on ? "var(--terra-hover)" : "var(--text)",
                    }}
                  >
                    {l}
                  </button>
                );
              })}
            </div>
            <button
              type="button"
              disabled={!choice}
              onClick={() => setBranche(true)}
              className="btn-primary mt-4 w-full justify-center py-3 text-[15px]"
              style={choice ? undefined : { opacity: 0.45, cursor: "not-allowed" }}
            >
              Brancher {choice ?? "mon logiciel"}
            </button>
            {!skipped && (
              <div className="mt-3 text-center">
                <TextButton onClick={() => setSkipped(true)}>Plus tard</TextButton>
              </div>
            )}
          </>
        )}
      </Card>

      {showRecap && (
        <div className="mt-8 rounded-[22px] p-5" style={{ background: "var(--bg2)" }}>
          <Kicker>Votre essai</Kicker>
          <p className="font-serif text-[22px] leading-[1.25]">
            Essai gratuit : 14 jours ou 20 PEC, <span className="accent-italic">PEC seulement</span>
            , sans carte bancaire.
          </p>
          <ul className="mt-4 space-y-1.5">
            <Reassure>Accès visibles et supprimables dans votre espace</Reassure>
            <Reassure>Pas de carte bancaire demandée</Reassure>
          </ul>
          <button
            type="button"
            onClick={onAskPaul}
            className="btn-primary mt-5 w-full justify-center py-3 text-[15px]"
          >
            Démarrer l'essai avec Paul
          </button>
          <div className="mt-3 text-center">
            <a
              href="/pec"
              className="text-[14px] underline-offset-4 hover:underline"
              style={{ color: "var(--terra)" }}
            >
              En faire une autre
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
