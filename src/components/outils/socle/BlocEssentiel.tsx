import type { ReactNode } from "react";
import type { MetierOutil } from "@/lib/outils/socle/types";
import { Conteneur } from "./Mise";
import { PastillesMetier } from "./PastillesMetier";

export type EnTeteEntreeProps = {
  /** 12 px, capitales (« Code rejet NOEMIE · Assurance Maladie »). */
  surTitre: string;
  h1: string;
  /** La réponse, en deux phrases : lue sans défiler à 375 px. */
  reponse: string[];
  /** Pastilles des métiers concernés. */
  metiers?: MetierOutil[];
};

/** En-tête d'une entrée : fond rosé (pas de dégradé), H1, la réponse juste dessous. */
export function EnTeteEntree({ surTitre, h1, reponse, metiers }: EnTeteEntreeProps) {
  return (
    <header>
      <Conteneur className="pt-4 pb-2 md:pt-8">
        <p className="eyebrow">{surTitre}</p>
        <h1
          className="mt-3 max-w-[24ch] break-words font-serif text-balance"
          style={{
            fontSize: "clamp(28px, 3.6vw, 44px)",
            lineHeight: 1.08,
            letterSpacing: "-0.025em",
            fontWeight: 300,
          }}
        >
          {h1}
        </h1>
        <div className="mt-4 max-w-[680px] text-[17px]" style={{ lineHeight: 1.55 }}>
          {reponse.map((p, i) => (
            <p key={i} className={i ? "mt-2" : ""}>
              {p}
            </p>
          ))}
        </div>
        <PastillesMetier metiers={metiers} className="mt-4" />
      </Conteneur>
    </header>
  );
}

export type LigneEssentiel = { libelle: string; valeur: ReactNode };

/** « L'essentiel » : 3 à 5 lignes ; libellé au-dessus de la valeur à 375 px, deux colonnes dès 768 px. */
export function BlocEssentiel({
  titre = "L’essentiel",
  lignes,
}: {
  titre?: string;
  lignes: LigneEssentiel[];
}) {
  return (
    <section
      aria-labelledby="essentiel"
      className="mt-6 rounded-[14px] bg-papier p-5 md:p-6"
      style={{ border: "1px solid var(--filet)" }}
    >
      <h2 id="essentiel" className="eyebrow">
        {titre}
      </h2>
      <dl className="mt-3">
        {lignes.map((l, i) => (
          <div
            key={l.libelle}
            className={`py-3 md:grid md:grid-cols-[180px_minmax(0,1fr)] md:gap-4 ${i ? "border-t" : ""}`}
            style={i ? { borderColor: "var(--filet)" } : undefined}
          >
            <dt className="text-[14px]" style={{ color: "var(--texte-secondaire)" }}>
              {l.libelle}
            </dt>
            <dd
              className="mt-0.5 min-w-0 break-words text-[16px] md:mt-0"
              style={{ lineHeight: 1.5 }}
            >
              {l.valeur}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
