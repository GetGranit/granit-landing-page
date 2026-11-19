import type { ReactNode } from "react";

export type ColonneTableau<T> = {
  cle: string;
  entete: string;
  rendu: (l: T) => ReactNode;
  /** Chiffres tabulaires, alignés à droite dès 768 px. */
  numerique?: boolean;
  /** En tête de carte à 375 px, en 16 px, sans libellé. */
  principale?: boolean;
};

/**
 * Un vrai <table> (avec <caption>), lisible par Google. À 375 px, sans CSS ajouté : chaque ligne
 * devient une carte, chaque cellule affiche son en-tête (data-entete), la colonne principale passe
 * en tête de carte ; dès 768 px, un tableau classique.
 * `idLigne` pose une ancre par ligne (B : lpp-2263287) ; la ligne visée est surlignée.
 */
export function TableauOutil<T>({
  legende,
  colonnes,
  lignes,
  idLigne,
  legendeVisible = false,
}: {
  legende: string;
  colonnes: ColonneTableau<T>[];
  lignes: T[];
  idLigne?: (l: T) => string;
  /** La légende est lue par les lecteurs d'écran ; visible seulement si demandé. */
  legendeVisible?: boolean;
}) {
  return (
    <table className="mt-4 w-full border-collapse text-[15px] max-md:block">
      <caption
        className={legendeVisible ? "mb-2 text-left text-[14px]" : "sr-only"}
        style={legendeVisible ? { color: "var(--texte-secondaire)" } : undefined}
      >
        {legende}
      </caption>
      <thead className="max-md:sr-only">
        <tr>
          {colonnes.map((c) => (
            <th
              key={c.cle}
              scope="col"
              className={`border-b px-3 py-2 align-bottom text-[13px] ${c.numerique ? "text-right" : "text-left"}`}
              style={{
                fontWeight: 500,
                color: "var(--texte-secondaire)",
                borderColor: "var(--filet-champ)",
              }}
            >
              {c.entete}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="max-md:block">
        {lignes.map((l, i) => (
          <tr
            key={idLigne?.(l) ?? i}
            id={idLigne?.(l)}
            className="scroll-mt-24 target:bg-lavis max-md:mb-3 max-md:flex max-md:flex-col max-md:rounded-[14px] max-md:border max-md:bg-papier max-md:p-4 md:border-b"
            style={{ borderColor: "var(--filet)" }}
          >
            {colonnes.map((c) => (
              <td
                key={c.cle}
                data-entete={c.principale ? undefined : c.entete}
                className={[
                  "min-w-0 break-words px-3 py-2.5 align-top max-md:px-0 max-md:py-1",
                  c.numerique ? "num-tabular md:text-right" : "",
                  c.principale
                    ? "max-md:order-first max-md:pb-2 max-md:text-[16px] max-md:font-medium"
                    : "max-md:before:block max-md:before:text-[13px] max-md:before:text-texte-secondaire max-md:before:content-[attr(data-entete)]",
                ].join(" ")}
              >
                {c.rendu(l)}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
