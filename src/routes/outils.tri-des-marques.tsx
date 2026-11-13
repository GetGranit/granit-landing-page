import { useMemo, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Plus, X } from "lucide-react";

import {
  BlocSombre,
  Carte,
  Champ,
  EnTeteOutil,
  FormulaireOutil,
  GrandChiffre,
  champClass,
  champStyle,
  useSuiviOutil,
} from "@/components/outils/OutilShared";
import { SiteLayout } from "@/components/SiteLayout";
import {
  MAX_MARQUES,
  SEUIL_GARDER,
  SEUIL_SORTIR,
  euros,
  mois,
  trierMarques,
  type Verdict,
} from "@/lib/outils/calculs";

/**
 * Outil gratuit « tri des marques » : l'opticien entre ses marques avec trois
 * chiffres de son logiciel, la grille dit lesquelles garder, réduire ou sortir
 * et combien d'argent dort dans le stock. Lead magnet envoyé après une
 * invitation LinkedIn acceptée (personnes qui ont réagi à un post sur le tri
 * des marques), lien avec utm_campaign=post-marques.
 *
 * Page de campagne comme /silmo et le webinar : hors navigation, hors sitemap,
 * en noindex. Le résultat s'affiche sans formulaire ; le formulaire sert à
 * recevoir la grille par mail (source du lead : lead-magnet-marques).
 */
export const Route = createFileRoute("/outils/tri-des-marques")({
  head: () => ({
    meta: [
      { title: "Tri des marques : quelles marques garder en magasin - Granit" },
      { name: "robots", content: "noindex, nofollow" },
      {
        name: "description",
        content:
          "Entrez vos marques avec trois chiffres de votre logiciel. La grille vous dit lesquelles garder, réduire ou sortir, et combien d'argent dort dans votre stock.",
      },
      { property: "og:title", content: "Votre tri des marques pour janvier, en 20 minutes" },
      {
        property: "og:description",
        content: "Un outil gratuit pour les opticiens : rotation, stock dormant, verdict par marque.",
      },
    ],
  }),
  component: TriDesMarques,
});

type Ligne = { id: number; nom: string; stock: string; ventes: string; prixAchat: string; marge: string };

/** Six lignes d'exemple, à remplacer : la page montre ce que fait l'outil dès l'arrivée. */
const EXEMPLE: Omit<Ligne, "id">[] = [
  { nom: "Marque A", stock: "120", ventes: "310", prixAchat: "62", marge: "" },
  { nom: "Marque B", stock: "85", ventes: "140", prixAchat: "78", marge: "" },
  { nom: "Marque C", stock: "140", ventes: "95", prixAchat: "55", marge: "" },
  { nom: "Marque D", stock: "60", ventes: "22", prixAchat: "90", marge: "" },
  { nom: "Marque E", stock: "45", ventes: "160", prixAchat: "48", marge: "" },
  { nom: "Marque F", stock: "70", ventes: "0", prixAchat: "110", marge: "" },
];

const COLONNES = [
  { cle: "stock", libelle: "Pièces en stock" },
  { cle: "ventes", libelle: "Vendues sur 12 mois" },
  { cle: "prixAchat", libelle: "Prix d’achat moyen (€)" },
  { cle: "marge", libelle: "Marge (%), facultatif" },
] as const;

const PASTILLE: Record<Verdict, { texte: string; style: CSSProperties }> = {
  garder: {
    texte: "Garder",
    style: { background: "var(--succes-fond)", color: "var(--succes-texte)" },
  },
  reduire: { texte: "Réduire", style: { background: "var(--ciel)", color: "var(--encre)" } },
  sortir: {
    texte: "Sortir",
    style: { border: "1px solid var(--alerte)", color: "var(--alerte-texte)" },
  },
};

/** Colonnes communes à l'en-tête et aux lignes de la grille, à partir de 768 px. */
const GRILLE = "md:grid md:grid-cols-[1.5fr_1fr_1fr_1fr_1fr_36px] md:items-center md:gap-3";
const RESULTATS = "md:grid md:grid-cols-[1.5fr_0.9fr_0.9fr_1fr_1.4fr] md:items-center md:gap-3";

/** Un champ de la grille : son libellé est visible sur téléphone, porté par l'en-tête au-delà. */
function Cellule({
  libelle,
  large = false,
  children,
}: {
  libelle: string;
  large?: boolean;
  children: ReactNode;
}) {
  return (
    <label className={`flex min-w-0 flex-col gap-1.5 ${large ? "col-span-2 md:col-span-1" : ""}`}>
      <span className="text-[13px] md:sr-only" style={{ fontWeight: 500 }}>
        {libelle}
      </span>
      {children}
    </label>
  );
}

function TriDesMarques() {
  const { suivre, commence, resultat } = useSuiviOutil("tri-des-marques");
  const prochainId = useRef(EXEMPLE.length);
  const [lignes, setLignes] = useState<Ligne[]>(() => EXEMPLE.map((l, id) => ({ id, ...l })));
  const [enAttente, setEnAttente] = useState("");
  const pontSuivi = useRef(false);

  const saisie = useMemo(
    () =>
      lignes.map((l) => ({
        nom: l.nom,
        stock: Number(l.stock),
        ventes: Number(l.ventes),
        prixAchat: Number(l.prixAchat),
        marge: l.marge.trim() === "" ? null : Number(l.marge),
      })),
    [lignes],
  );
  const tri = useMemo(() => trierMarques(saisie), [saisie]);
  const attente = Math.max(0, Number(enAttente) || 0);

  const modifier = (id: number, cle: keyof Omit<Ligne, "id">, valeur: string) => {
    commence();
    setLignes((ls) => ls.map((l) => (l.id === id ? { ...l, [cle]: valeur } : l)));
  };

  // La ligne qui sert d'exemple de lecture : la première marque « à sortir » qui vend encore.
  const lecture =
    tri.lignes.find((l) => l.verdict === "sortir" && l.ventes > 0) ??
    tri.lignes.find((l) => l.ventes > 0);

  return (
    <SiteLayout>
      <EnTeteOutil
        titre="Votre tri des marques pour janvier,"
        accent="en 20 minutes."
        chapeau="Entrez vos marques avec trois chiffres de votre logiciel. La grille vous dit lesquelles garder, réduire ou sortir, et combien d’argent dort dans votre stock."
      />

      <div className="mx-auto flex max-w-[1120px] flex-col gap-7 px-4 py-10 md:px-8 md:py-16">
        {/* ------------------------------ La grille ------------------------------ */}
        <Carte>
          <h2 className="font-serif text-[24px]" style={{ fontWeight: 400, lineHeight: 1.15 }}>
            Vos marques
          </h2>
          <p className="mt-2 max-w-[62ch] text-[15px]" style={{ color: "var(--texte-secondaire)" }}>
            Les six lignes sont un exemple : remplacez-les par les vôtres. Vos chiffres restent dans
            votre navigateur tant que vous n’avez rien envoyé.
          </p>

          <div className={`mt-6 hidden ${GRILLE}`} aria-hidden>
            <span className="eyebrow">Marque</span>
            {COLONNES.map((c) => (
              <span key={c.cle} className="eyebrow">
                {c.libelle}
              </span>
            ))}
          </div>

          <ul className="mt-3 flex flex-col gap-4 md:gap-2">
            {lignes.map((l, i) => (
              <li
                key={l.id}
                className={`grid grid-cols-2 gap-3 rounded-[12px] bg-lavis p-3 md:rounded-none md:bg-transparent md:p-0 ${GRILLE}`}
              >
                <Cellule libelle={`Marque ${i + 1}`} large>
                  <input
                    value={l.nom}
                    maxLength={40}
                    onChange={(e) => modifier(l.id, "nom", e.target.value)}
                    className={champClass}
                    style={champStyle}
                  />
                </Cellule>
                {COLONNES.map((c) => (
                  <Cellule key={c.cle} libelle={c.libelle}>
                    <input
                      type="number"
                      min={0}
                      inputMode="decimal"
                      value={l[c.cle]}
                      onChange={(e) => modifier(l.id, c.cle, e.target.value)}
                      className={champClass}
                      style={champStyle}
                    />
                  </Cellule>
                ))}
                <button
                  type="button"
                  aria-label={`Retirer ${l.nom || `la marque ${i + 1}`}`}
                  onClick={() => {
                    commence();
                    setLignes((ls) => ls.filter((x) => x.id !== l.id));
                  }}
                  className="col-span-2 flex h-9 items-center justify-center gap-2 rounded-full text-[13px] md:col-span-1 md:w-9"
                  style={{ color: "var(--texte-secondaire)", border: "1px solid var(--filet)" }}
                >
                  <X size={15} strokeWidth={2} />
                  <span className="md:sr-only">Retirer cette marque</span>
                </button>
              </li>
            ))}
          </ul>

          {lignes.length < MAX_MARQUES && (
            <button
              type="button"
              className="btn-secondaire mt-5"
              onClick={() => {
                commence();
                const id = prochainId.current++;
                setLignes((ls) => [
                  ...ls,
                  { id, nom: "", stock: "", ventes: "", prixAchat: "", marge: "" },
                ]);
              }}
            >
              <Plus size={16} strokeWidth={2} /> Ajouter une marque
            </button>
          )}
        </Carte>

        {/* ------------------------------ Le verdict ------------------------------ */}
        <div ref={resultat}>
          <BlocSombre>
            <p className="eyebrow">L’argent qui dort dans votre stock</p>
            <GrandChiffre>{euros(tri.argentQuiDort)}</GrandChiffre>
            <dl className="mt-7 grid grid-cols-3 gap-4">
              {(["garder", "reduire", "sortir"] as const).map((v) => (
                <div key={v}>
                  <dd
                    className="num-tabular font-serif text-[34px]"
                    style={{ fontWeight: 300, lineHeight: 1 }}
                  >
                    {tri.compte[v]}
                  </dd>
                  <dt className="mt-1 text-[14px]" style={{ color: "var(--sur-encre-secondaire)" }}>
                    {v === "garder" ? "à garder" : v === "reduire" ? "à réduire" : "à sortir"}
                  </dt>
                </div>
              ))}
            </dl>
          </BlocSombre>
        </div>

        <Carte>
          <h2 className="font-serif text-[24px]" style={{ fontWeight: 400, lineHeight: 1.15 }}>
            Marque par marque
          </h2>
          <div className={`mt-5 hidden ${RESULTATS}`} aria-hidden>
            <span className="eyebrow">Marque</span>
            <span className="eyebrow">Mois de stock</span>
            <span className="eyebrow">Part des ventes</span>
            <span className="eyebrow">Argent qui dort</span>
            <span className="eyebrow">Verdict</span>
          </div>
          <ul className="mt-2">
            {tri.lignes.map((l, i) => (
              <li
                key={`${l.nom}-${i}`}
                className={`num-tabular flex flex-wrap items-center gap-x-4 gap-y-1 py-3 text-[15px] ${RESULTATS}`}
                style={{ borderTop: "1px solid var(--filet)" }}
              >
                <span className="w-full md:w-auto" style={{ fontWeight: 500 }}>
                  {l.nom}
                </span>
                <span>
                  {mois(l.moisDeStock)}
                  <span className="md:hidden">{Number.isFinite(l.moisDeStock) && " mois de stock"}</span>
                </span>
                <span>
                  {Math.round(l.partDesVentes * 100)} %<span className="md:hidden"> des ventes</span>
                </span>
                <span>
                  {euros(l.argentQuiDort)}
                  <span className="md:hidden"> qui dorment</span>
                </span>
                <span className="flex flex-wrap items-center gap-2">
                  <span
                    className="inline-flex rounded-full px-3 py-1 text-[13px]"
                    style={{ fontWeight: 500, ...PASTILLE[l.verdict].style }}
                  >
                    {PASTILLE[l.verdict].texte}
                  </span>
                  {l.margeARegarder && (
                    <span className="text-[13px]" style={{ color: "var(--texte-secondaire)" }}>
                      marge au-dessus de votre moyenne, à regarder avant de trancher
                    </span>
                  )}
                </span>
              </li>
            ))}
          </ul>

          <div
            className="mt-5 flex flex-col gap-2 rounded-[12px] p-4 text-[14px]"
            style={{ background: "var(--lavis)", lineHeight: 1.55 }}
          >
            <p style={{ fontWeight: 500 }}>Comment lire la grille</p>
            {lecture && (
              <p>
                {lecture.nom} : {lecture.stock} pièces en stock, {Math.round(lecture.ventes / 12)}{" "}
                vendues par mois. Il lui faut {mois(lecture.moisDeStock)} mois pour écouler son
                stock, d’où le verdict « {PASTILLE[lecture.verdict].texte.toLowerCase()} ».
              </p>
            )}
            <p style={{ color: "var(--texte-secondaire)" }}>
              Moins de {SEUIL_GARDER} mois de stock, on garde. De {SEUIL_GARDER} à {SEUIL_SORTIR}{" "}
              mois, on réduit les achats. Plus de {SEUIL_SORTIR} mois, on sort. L’argent qui dort,
              ce sont les pièces au-delà de 12 mois de ventes, comptées au prix d’achat. Ce sont
              des repères, pas une règle : une marque d’image peut mériter sa place.
            </p>
          </div>
        </Carte>

        {/* --------------------- Le pont vers le back-office --------------------- */}
        <Carte>
          <div className="max-w-[520px]">
            <Champ
              libelle="Et l’argent des mutuelles pas encore encaissé ? (facultatif)"
              aide="Les prises en charge accordées dont le virement n’est pas arrivé, en euros."
            >
              <input
                type="number"
                min={0}
                inputMode="decimal"
                value={enAttente}
                onChange={(e) => {
                  setEnAttente(e.target.value);
                  if (!pontSuivi.current && Number(e.target.value) > 0) {
                    pontSuivi.current = true;
                    suivre("lm_pont_rempli");
                  }
                }}
                className={champClass}
                style={champStyle}
              />
            </Champ>
          </div>
          {attente > 0 && (
            <p className="mt-4 text-[16px]" aria-live="polite">
              Stock dormant et mutuelles en attente :{" "}
              <strong style={{ fontWeight: 500 }}>{euros(tri.argentQuiDort + attente)}</strong> qui
              ne sont pas sur votre compte.
            </p>
          )}
        </Carte>

        {/* ----------------------------- Le formulaire ----------------------------- */}
        <FormulaireOutil
          outil="tri-des-marques"
          source="lead-magnet-marques"
          formLocation="outil_tri_marques"
          titre="Recevez votre grille en tableur, avec vos chiffres dedans."
          bouton="Recevoir ma grille"
          merci="Votre grille arrive dans la minute à {adresse}. Une question sur vos chiffres ? Paul vous répond en direct."
          suivre={suivre}
          resume={
            `Tri des marques : ${tri.lignes.length} marques, ${tri.compte.sortir} à sortir, ` +
            `${tri.compte.reduire} à réduire, ${euros(tri.argentQuiDort)} de stock dormant` +
            (attente > 0 ? `, ${euros(attente)} de mutuelles en attente` : "") +
            "."
          }
          proprietes={{
            marques: tri.lignes.length,
            a_sortir: tri.compte.sortir,
            argent_qui_dort: Math.round(tri.argentQuiDort),
            mutuelles_en_attente: attente > 0 ? Math.round(attente) : undefined,
          }}
          mail={() => ({ outil: "tri-des-marques", marques: saisie, enAttente: attente })}
        />
      </div>
    </SiteLayout>
  );
}
