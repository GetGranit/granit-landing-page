// Le tableau des codes d'une page de groupe (cadre.md § 6, bloc 7) : un vrai <table> (avec
// <caption>), une ancre `#lpp-<code>` par ligne (ligne surlignée quand l'ancre la vise).
// - Dès 768 px : il sort de la colonne de lecture (680 px) pour tenir ses 7 colonnes sur la largeur
//   du site ; le code et la désignation LPP (texte officiel exact) forment l'en-tête de ligne.
// - À 375 px : une carte par code, désignation en tête, montants sur deux colonnes.
// Les montants passent par montantsAffiches, avec la date du jour reçue du serveur : à partir du
// 01/01/2027, sans taux publié, les colonnes Sécu, ticket modérateur et complémentaire disent
// « taux 2027 non publié ».
import type { ReactNode } from "react";
import {
  montantsAffiches,
  type Montants,
  type Taux2027,
} from "@/lib/outils/remboursement/calcul.mjs";
import { euros } from "@/lib/outils/remboursement/format.mjs";
import type { CodeAffiche } from "@/lib/outils/remboursement/vues.mjs";

const NON_PUBLIE = "taux 2027 non publié";

type Colonne = { cle: string; entete: string; rendu: (m: Montants) => ReactNode };

export function TableauCodes({
  codes,
  jour,
  regle,
  legende,
  datation,
}: {
  codes: CodeAffiche[];
  jour: string;
  regle: { taux2027: Taux2027; bascule: string };
  legende: string;
  /** La phrase qui date les montants, affichée au-dessus du tableau. */
  datation: string;
}) {
  const lignes = codes.map((c) => ({
    c,
    m: montantsAffiches(c, jour, regle.taux2027, regle.bascule),
  }));
  const taux = lignes[0]?.m.regime.taux;
  const avecComplementaire = lignes.some((l) => l.m.panier === "100-sante");
  const avecPrixLimite = lignes.some((l) => l.m.prixLimite !== null);

  const colonnes: Colonne[] = [
    { cle: "base", entete: "Base", rendu: (m) => euros(m.base) },
    {
      cle: "secu",
      entete: taux != null ? `Sécu (${taux}\u00a0%)` : "Sécu",
      rendu: (m) => (m.secu === null ? NON_PUBLIE : euros(m.secu)),
    },
    {
      cle: "tm",
      entete: "Ticket modérateur",
      rendu: (m) => (m.ticketModerateur === null ? NON_PUBLIE : euros(m.ticketModerateur)),
    },
  ];
  if (avecPrixLimite)
    colonnes.push({
      cle: "plv",
      entete: "Prix limite",
      rendu: (m) => (m.prixLimite === null ? "prix libre" : euros(m.prixLimite)),
    });
  if (avecComplementaire)
    colonnes.push({
      cle: "compl",
      entete: "Complémentaire au prix limite",
      // Seulement en 100 % Santé ; tarif libre : selon le contrat ; panier non donné : rien.
      rendu: (m) =>
        m.panier === "100-sante"
          ? m.complementaireAuPrixLimite === null
            ? NON_PUBLIE
            : euros(m.complementaireAuPrixLimite)
          : m.panier === "libre"
            ? "selon le contrat"
            : "panier non précisé",
    });

  const entete = "px-3 py-2 align-bottom text-[13px]";
  return (
    <>
      <p className="text-[14px]" style={{ color: "var(--texte-secondaire)" }}>
        {datation}
      </p>
      <div className="mt-4 md:w-[min(1056px,calc(100vw_-_80px))]">
        <table className="w-full border-collapse text-[15px] max-md:block">
          <caption className="sr-only">{legende}</caption>
          <thead className="max-md:sr-only">
            <tr>
              <th
                scope="col"
                className={`${entete} border-b text-left`}
                style={{
                  fontWeight: 500,
                  color: "var(--texte-secondaire)",
                  borderColor: "var(--filet-champ)",
                }}
              >
                Code et désignation LPP
              </th>
              {colonnes.map((c) => (
                <th
                  key={c.cle}
                  scope="col"
                  className={`${entete} border-b text-right`}
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
            {lignes.map(({ c, m }) => (
              <tr
                key={c.ancre}
                id={c.ancre}
                className="scroll-mt-24 target:bg-lavis max-md:mb-3 max-md:grid max-md:grid-cols-2 max-md:gap-x-4 max-md:gap-y-2 max-md:rounded-[14px] max-md:border max-md:bg-papier max-md:p-4 md:border-b"
                style={{ borderColor: "var(--filet)" }}
              >
                <th
                  scope="row"
                  className="min-w-0 break-words px-3 py-2.5 text-left align-top max-md:col-span-2 max-md:px-0 max-md:py-0"
                  style={{ fontWeight: 400 }}
                >
                  <span className="num-tabular block" style={{ fontWeight: 500 }}>
                    {c.code}
                  </span>
                  <span
                    className="block text-[14px] max-md:text-[15px]"
                    style={{ lineHeight: 1.4 }}
                  >
                    {c.libelle}
                  </span>
                </th>
                {colonnes.map((col) => (
                  <td
                    key={col.cle}
                    data-entete={col.entete}
                    className="num-tabular min-w-0 break-words px-3 py-2.5 align-top max-md:px-0 max-md:py-0 max-md:before:block max-md:before:text-[13px] max-md:before:text-texte-secondaire max-md:before:content-[attr(data-entete)] md:text-right"
                  >
                    {col.rendu(m)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
