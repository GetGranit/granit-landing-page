// Le calcul d'une page de groupe (cadre.md § 6.1, textes.md § 3.7) : un code du groupe et le prix
// facturé ; la carte dit ce que paie la Sécurité sociale, le ticket modérateur, ce qui reste après la
// Sécurité sociale et ce que doit au moins un contrat responsable. Rien d'autre (formules.md) :
// pas de franchise, pas de plafond de verre, pas d'ALD ni de C2S.
//
// Hydratation : l'état de départ (premier code, prix limite en 100 % Santé) et la date du jour
// viennent du serveur ; le rendu serveur et le premier rendu du navigateur sont donc identiques.
// L'ancre `#lpp-<code>` de l'URL n'est lue qu'après l'hydratation (useEffect).
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { CartePapier } from "@/components/outils/socle";
import { calculer, lirePrix, type Taux2027 } from "@/lib/outils/remboursement/calcul.mjs";
import { euros } from "@/lib/outils/remboursement/format.mjs";
import type { CodeAffiche } from "@/lib/outils/remboursement/vues.mjs";
import type { Suivre } from "@/lib/outils/socle/suivi";

/** lm_calcul part 800 ms après la dernière saisie (cadre.md § 10). */
const DELAI_CALCUL = 800;
const NON_PUBLIE = "taux 2027 non publié";

/** Prix prérempli : le prix limite en 100 % Santé, vide sinon. */
const prixDepart = (c: CodeAffiche) =>
  c.panier_100_sante === "100-sante" && c.prix_limite !== null
    ? euros(c.prix_limite)
        .replace(/\s?€$/, "")
        .replace(/\u00a0/g, "")
    : "";

export function CalculRemboursement({
  groupe,
  codes,
  jour,
  regle,
  suivre,
  commence,
}: {
  /** Slug du groupe (propriété `entree` de lm_calcul). */
  groupe: string;
  codes: CodeAffiche[];
  jour: string;
  regle: { taux2027: Taux2027; bascule: string };
  suivre: Suivre;
  commence: () => void;
}) {
  const id = useId();
  const [code, setCode] = useState(codes[0]?.code ?? "");
  const entree = codes.find((c) => c.code === code) ?? codes[0];
  const [prixSaisi, setPrixSaisi] = useState(() => (codes[0] ? prixDepart(codes[0]) : ""));
  const r = useMemo(
    () =>
      calculer({
        entree,
        prix: lirePrix(prixSaisi),
        jour,
        taux2027: regle.taux2027,
        bascule: regle.bascule,
      }),
    [entree, prixSaisi, jour, regle],
  );

  // Arrivée par une ligne du hub ou une redirection (#lpp-2263287) : ce code, son prix de départ.
  useEffect(() => {
    const lire = () => {
      const ancre = decodeURIComponent(window.location.hash.slice(1));
      const c = codes.find((x) => x.ancre === ancre);
      if (!c) return;
      setCode(c.code);
      setPrixSaisi(prixDepart(c));
    };
    lire();
    window.addEventListener("hashchange", lire);
    return () => window.removeEventListener("hashchange", lire);
  }, [codes]);

  // Suivi : jamais le prix lui-même, seulement s'il a été changé et s'il dépasse le prix limite.
  const minuterie = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const touche = useRef(false);
  useEffect(() => {
    if (!touche.current) return;
    clearTimeout(minuterie.current);
    minuterie.current = setTimeout(() => {
      suivre("lm_calcul", {
        entree: groupe,
        code: entree.code,
        prix_modifie: prixSaisi !== prixDepart(entree),
        au_dela_plv: r.alerte === "au-dela-prix-limite",
      });
    }, DELAI_CALCUL);
    return () => clearTimeout(minuterie.current);
  }, [code, prixSaisi, entree, groupe, r.alerte, suivre]);
  const saisie = () => {
    touche.current = true;
    commence();
  };

  if (!entree) return null;
  const m = r.montants;
  const nonPublie = m.regime.etat === "non-publie";
  const lignes: { libelle: string; valeur: string }[] = [
    { libelle: "Base de remboursement", valeur: euros(m.base) },
    {
      libelle: nonPublie
        ? "Remboursé par la Sécurité sociale"
        : `Remboursé par la Sécurité sociale (${m.regime.taux}\u00a0%)`,
      valeur: m.secu === null ? NON_PUBLIE : euros(m.secu),
    },
    {
      libelle: "Ticket modérateur",
      valeur: m.ticketModerateur === null ? NON_PUBLIE : euros(m.ticketModerateur),
    },
    {
      libelle: "Reste après la Sécurité sociale",
      valeur: nonPublie
        ? NON_PUBLIE
        : r.resteApresSecu !== null
          ? euros(r.resteApresSecu)
          : r.sousLaBase
            ? "prix sous la base : non calculé"
            : "indiquez le prix facturé",
    },
  ];

  // Ce que doit au moins un contrat responsable (textes.md § 3.7).
  let responsable: string;
  if (r.responsable.type === "100-sante")
    responsable =
      r.alerte === "au-dela-prix-limite"
        ? ""
        : r.responsable.complementaire !== null
          ? `La complémentaire prend ${euros(r.responsable.complementaire)}\u00a0; reste à charge\u00a0: 0\u00a0€.`
          : `Reste à charge\u00a0: 0\u00a0€ jusqu’au prix limite (${euros(m.prixLimite ?? 0)}).`;
  else if (r.responsable.type === "libre")
    responsable =
      r.responsable.minimum !== null
        ? `Au moins le ticket modérateur (${euros(r.responsable.minimum)})\u00a0; au-delà, selon le contrat.`
        : "Au moins le ticket modérateur\u00a0; au-delà, selon le contrat.";
  else
    responsable =
      "La base LPP ne précise pas le panier de ce code\u00a0: l’outil n’affiche pas de part de la complémentaire.";
  const plafond = r.plafond
    ? r.plafond.objet === "monture"
      ? `Plafond\u00a0: ${euros(r.plafond.montant)} au plus, Sécurité sociale comprise.`
      : `Plafond\u00a0: ${euros(r.plafond.montant)} au plus par aide auditive, Sécurité sociale comprise.`
    : null;

  return (
    <CartePapier className="mt-4 p-5 md:p-6">
      <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_180px]">
        <label className="flex min-w-0 flex-col gap-1.5 text-[14px]" style={{ fontWeight: 500 }}>
          Code LPP
          <select
            value={code}
            onChange={(e) => {
              saisie();
              const c = codes.find((x) => x.code === e.target.value);
              setCode(e.target.value);
              if (c) setPrixSaisi(prixDepart(c));
            }}
            className="h-12 w-full min-w-0 rounded-[8px] bg-papier px-3 text-[16px]"
            style={{
              border: "1px solid var(--filet-champ)",
              color: "var(--encre)",
              fontWeight: 400,
            }}
          >
            {codes.map((c) => (
              <option key={c.code} value={c.code}>
                {c.code} · {c.designation}
              </option>
            ))}
          </select>
        </label>
        <label
          htmlFor={`${id}-prix`}
          className="flex min-w-0 flex-col gap-1.5 text-[14px]"
          style={{ fontWeight: 500 }}
        >
          Prix facturé
          <span className="flex items-center gap-2">
            <input
              id={`${id}-prix`}
              type="text"
              inputMode="decimal"
              autoComplete="off"
              value={prixSaisi}
              onChange={(e) => {
                saisie();
                setPrixSaisi(e.target.value);
              }}
              className="num-tabular h-12 w-full min-w-0 rounded-[8px] bg-papier px-3 text-[16px]"
              style={{
                border: "1px solid var(--filet-champ)",
                color: "var(--encre)",
                fontWeight: 400,
              }}
            />
            <span aria-hidden>€</span>
          </span>
        </label>
      </div>

      <div
        aria-live="polite"
        className="mt-5 border-t pt-4"
        style={{ borderColor: "var(--filet)" }}
      >
        <dl>
          {lignes.map((l) => (
            <div
              key={l.libelle}
              className="flex items-baseline justify-between gap-4 py-1.5 text-[15px]"
            >
              <dt style={{ color: "var(--texte-secondaire)" }}>{l.libelle}</dt>
              <dd className="num-tabular text-right" style={{ fontWeight: 500 }}>
                {l.valeur}
              </dd>
            </div>
          ))}
        </dl>
        <div className="mt-3 space-y-2 text-[15px]" style={{ lineHeight: 1.5 }}>
          {r.alerte === "au-dela-prix-limite" && (
            <p style={{ fontWeight: 500 }}>
              Au-delà du prix limite de vente ({euros(m.prixLimite ?? 0)}), ce produit ne peut pas
              être facturé en 100&nbsp;% Santé.
            </p>
          )}
          {responsable && (
            <p>
              <span style={{ fontWeight: 500 }}>Contrat responsable&nbsp;: </span>
              {responsable}
            </p>
          )}
          {plafond && <p>{plafond}</p>}
          {nonPublie && (
            <p>Taux 2027 non publié&nbsp;: nous n’affichons pas de montant Sécurité sociale.</p>
          )}
          <p style={{ color: "var(--texte-secondaire)" }}>
            Sans complémentaire, ou avec un contrat non responsable, le reste à charge n’est pas
            garanti nul.
          </p>
          <p className="text-[14px]" style={{ color: "var(--texte-secondaire)" }}>
            {entree.datation}
          </p>
        </div>
      </div>
    </CartePapier>
  );
}
