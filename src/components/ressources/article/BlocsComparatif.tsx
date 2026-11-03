// Blocs d'une page comparative, rendus depuis content/concurrents/*.json (gabarit §6 bis) :
// tableau « en un coup d'œil », frise du dossier, cartes « Choisir … si », modèles, grille du marché.
// Jamais réécrits par Claude. Aucun prix : le fichier de faits n'en contient pas d'affichable.
import type { ReactElement } from "react";
import { useLanguage, type Lang } from "@/lib/i18n";
import { dateLang } from "@/lib/ressources/contenu";
import type { AxeCle, Concurrent, Modele } from "@/lib/ressources/types";

export type Comparaison = {
  /** Acteurs dans l'ordre de la file : le concurrent d'abord, Granit en dernier. */
  acteurs: Concurrent[];
};

type Textes = {
  lignes: { cle: AxeCle; label: string }[];
  modeles: { cle: Modele; nom: string; texte: string }[];
  etapes: { nom: string; detail: string }[];
  /** Libellé de la bande d'un acteur dans la frise. */
  role: Record<Modele, string>;
  nonPrecise: string;
  oui: string;
  non: string;
  releve: (d: string) => string;
  critere: string;
  modele: string;
  acteur: string;
  ideal: string;
  avance: string;
  noteAvance: string;
  choisir: (nom: string) => string;
};

const copy: Record<Lang, Textes> = {
  fr: {
    lignes: [
      { cle: "quiFait", label: "Qui fait le travail" },
      { cle: "pec", label: "Demandes de prise en charge" },
      { cle: "rejets", label: "Rejets et relances" },
      { cle: "rapprochement", label: "Rapprochement des paiements" },
      { cle: "avance", label: "Avance de trésorerie" },
      { cle: "engagement", label: "Engagement" },
      { cle: "hds", label: "Données de santé" },
      { cle: "plateformes", label: "Plateformes couvertes" },
    ],
    modeles: [
      {
        cle: "interne",
        nom: "En interne",
        texte: "Une personne du magasin s'en occupe, souvent entre deux clients.",
      },
      {
        cle: "freelance",
        nom: "Une freelance",
        texte: "Une gestionnaire indépendante, à distance, quelques heures par semaine.",
      },
      {
        cle: "prestataire",
        nom: "Un prestataire",
        texte: "Une équipe externe à qui l'on délègue tout ou partie du back-office.",
      },
      {
        cle: "outil-saisie",
        nom: "Un outil de saisie",
        texte: "Un logiciel qui remplit les portails plus vite ; l'opticien reste aux commandes.",
      },
      {
        cle: "agents-ia",
        nom: "Des agents IA",
        texte: "Des agents qui font les dossiers sur les portails ; l'opticien suit chaque dossier.",
      },
    ],
    etapes: [
      { nom: "Bonne plateforme", detail: "qui gère la mutuelle" },
      { nom: "Demande de PEC", detail: "sur le portail" },
      { nom: "Accord ou refus", detail: "instance, relances" },
      { nom: "Facture", detail: "télétransmise" },
      { nom: "Paiement", detail: "rapprochement" },
    ],
    role: {
      "agents-ia": "les agents font le dossier",
      prestataire: "l'équipe traite le dossier",
      "outil-saisie": "aide à la saisie, l'opticien fait le dossier",
      freelance: "la gestionnaire traite le dossier",
      interne: "votre équipe fait le dossier",
    },
    nonPrecise: "Non précisé",
    oui: "Oui",
    non: "Non",
    releve: (d) =>
      `Informations publiées par chaque acteur, relevées le ${d}. « Non précisé » : l'acteur ne le publie pas, ce qui ne veut pas dire qu'il ne le fait pas. Aucun prix n'est comparé.`,
    critere: "Critère",
    modele: "Modèle",
    acteur: "Acteur",
    ideal: "Idéal pour",
    avance: "avance de trésorerie",
    noteAvance:
      "L'avance agit après la facture : l'argent arrive plus tôt, un dossier bloqué reste bloqué.",
    choisir: (nom) => `Choisir ${nom} si…`,
  },
  en: {
    lignes: [
      { cle: "quiFait", label: "Who does the work" },
      { cle: "pec", label: "Coverage requests" },
      { cle: "rejets", label: "Rejections and follow-ups" },
      { cle: "rapprochement", label: "Payment reconciliation" },
      { cle: "avance", label: "Cash advance" },
      { cle: "engagement", label: "Commitment" },
      { cle: "hds", label: "Health data" },
      { cle: "plateformes", label: "Platforms covered" },
    ],
    modeles: [
      {
        cle: "interne",
        nom: "In-house",
        texte: "Someone in the store handles it, often between two customers.",
      },
      {
        cle: "freelance",
        nom: "A freelancer",
        texte: "An independent administrator, working remotely a few hours a week.",
      },
      {
        cle: "prestataire",
        nom: "A service provider",
        texte: "An external team you hand all or part of the back office to.",
      },
      {
        cle: "outil-saisie",
        nom: "A data-entry tool",
        texte: "Software that fills in the portals faster; the optician stays in control.",
      },
      {
        cle: "agents-ia",
        nom: "AI agents",
        texte: "Agents that handle the files on the portals; the optician follows every file.",
      },
    ],
    etapes: [
      { nom: "Right platform", detail: "the one handling the insurer" },
      { nom: "Coverage request", detail: "on the portal" },
      { nom: "Approval or refusal", detail: "pending, follow-ups" },
      { nom: "Invoice", detail: "e-transmitted" },
      { nom: "Payment", detail: "reconciliation" },
    ],
    role: {
      "agents-ia": "the agents handle the file",
      prestataire: "the team processes the file",
      "outil-saisie": "helps with data entry, the optician handles the file",
      freelance: "the administrator processes the file",
      interne: "your team handles the file",
    },
    nonPrecise: "Not specified",
    oui: "Yes",
    non: "No",
    releve: (d) =>
      `Information published by each provider, checked on ${d}. “Not specified”: the provider does not publish it, which does not mean it does not do it. No prices are compared.`,
    critere: "Criterion",
    modele: "Model",
    acteur: "Provider",
    ideal: "Best for",
    avance: "cash advance",
    noteAvance:
      "The advance comes after the invoice: the money arrives sooner, but a blocked file stays blocked.",
    choisir: (nom) => `Choose ${nom} if…`,
  },
};

const useTextes = () => copy[useLanguage().lang];
const nomModele = (t: Textes, m: Modele) => t.modeles.find((x) => x.cle === m)?.nom ?? m;

const oui = (v?: string) => v === "oui";

/** Cellule : « oui » / « non » / « Non précisé » lisibles, avec le détail en dessous. */
function Valeur({ c, cle }: { c: Concurrent; cle: AxeCle }) {
  const t = useTextes();
  const a = c.axes[cle];
  if (!a || a.valeur === "non publié")
    return <span className="text-[var(--text-muted)]">{t.nonPrecise}</span>;
  const tete =
    a.valeur === "oui"
      ? t.oui
      : a.valeur === "non"
        ? t.non
        : a.valeur[0].toUpperCase() + a.valeur.slice(1);
  return (
    <>
      <span className={oui(a.valeur) ? "font-semibold text-[var(--text)]" : undefined}>{tete}</span>
      {a.detail && (
        <span className="mt-0.5 block text-[14px] text-[var(--text-muted)]">{a.detail}</span>
      )}
    </>
  );
}

function Releve({ acteurs }: { acteurs: Concurrent[] }) {
  const { lang } = useLanguage();
  const date = acteurs.map((a) => a.checkedOn).sort()[0];
  return (
    <p className="mt-2 text-[13px] text-[var(--text-muted)]">
      {copy[lang].releve(dateLang(date, lang, true))}
    </p>
  );
}

export function CoupDoeil({ acteurs }: Comparaison) {
  const t = useTextes();
  if (acteurs.length < 2) return null;
  const lignes = t.lignes.filter((l) => acteurs.some((c) => c.axes[l.cle]));
  return (
    <div className="my-4">
      <div className="tbl">
        <table>
          <thead>
            <tr>
              <th>{t.critere}</th>
              {acteurs.map((c) => (
                <th key={c.slug}>{c.nom}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <strong className="font-semibold text-[var(--text)]">{t.modele}</strong>
              </td>
              {acteurs.map((c) => (
                <td key={c.slug}>{nomModele(t, c.modele)}</td>
              ))}
            </tr>
            {lignes.map((l) => (
              <tr key={l.cle}>
                <td>
                  <strong className="font-semibold text-[var(--text)]">{l.label}</strong>
                </td>
                {acteurs.map((c) => (
                  <td key={c.slug}>
                    <Valeur c={c} cle={l.cle} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Releve acteurs={acteurs} />
    </div>
  );
}

/**
 * Colonnes (début, fin exclue) où agit un acteur sur les 5 étapes. Des agents trouvent aussi la
 * plateforme (étape 1) ; une équipe commence à la PEC (2), ou aux rejets (3) si elle ne fait pas la PEC.
 */
function bande(c: Concurrent): [number, number] | null {
  const debut = oui(c.axes.pec?.valeur)
    ? c.modele === "agents-ia"
      ? 1
      : 2
    : oui(c.axes.rejets?.valeur)
      ? 3
      : null;
  if (debut === null) return null;
  return [debut, oui(c.axes.rapprochement?.valeur) ? 6 : 5];
}

export function Frise({ acteurs }: Comparaison) {
  const t = useTextes();
  // Sur la grille (plus de 2 acteurs), seulement les étapes : le tableau dit qui fait quoi.
  const bandes = acteurs.length === 2 ? acteurs : [];
  return (
    <div className="my-5 overflow-x-auto">
      <div className="grid min-w-[600px] grid-cols-5 gap-2">
        {t.etapes.map((e) => (
          <div
            key={e.nom}
            className="rounded-[10px] px-3 py-2.5"
            style={{ background: "var(--tint)" }}
          >
            <span className="block text-[14.5px] font-semibold leading-snug text-[var(--text)]">
              {e.nom}
            </span>
            <span className="block text-[12.5px] text-[var(--text-muted)]">{e.detail}</span>
          </div>
        ))}
        {bandes.flatMap((c) => {
          const b = bande(c);
          const granit = c.slug === "granit";
          const out: ReactElement[] = [];
          if (b)
            out.push(
              <div
                key={`${c.slug}-dossier`}
                className="rounded-[10px] border-l-4 bg-white px-3 py-2 text-[14px] font-medium text-[var(--text)]"
                style={{
                  gridColumn: `${b[0]} / ${b[1]}`,
                  borderColor: granit ? "var(--terra)" : "var(--ink)",
                  boxShadow: "inset 0 0 0 1px var(--border)",
                }}
              >
                {c.nom} · {t.role[c.modele]}
              </div>,
            );
          if (oui(c.axes.avance?.valeur))
            out.push(
              <div
                key={`${c.slug}-avance`}
                className="rounded-[10px] border border-dashed bg-white px-3 py-2 text-[14px] font-medium text-[var(--text)]"
                style={{ gridColumn: "4 / 6", borderColor: "var(--ink)" }}
              >
                {c.nom} · {t.avance}
              </div>,
            );
          return out;
        })}
      </div>
      {bandes.some((c) => oui(c.axes.avance?.valeur)) && (
        <p className="mt-2 text-[13px] text-[var(--text-muted)]">{t.noteAvance}</p>
      )}
    </div>
  );
}

export function Choisir({ acteurs }: Comparaison) {
  const t = useTextes();
  if (!acteurs.length) return null;
  return (
    <div className="my-5 grid gap-3 sm:grid-cols-2">
      {acteurs.map((c) => (
        <div
          key={c.slug}
          className="rounded-[14px] border border-[var(--border)] bg-white px-5 py-4"
          style={{ borderTop: `3px solid ${c.slug === "granit" ? "var(--terra)" : "var(--ink)"}` }}
        >
          <p className="font-serif text-[20px] leading-snug text-[var(--text)]">
            {t.choisir(c.nom)}
          </p>
          <ul className="mt-2 list-disc pl-5 text-[15.5px]">
            {c.meilleurSi.map((r) => (
              <li key={r} className="my-1.5">
                {r}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export function Modeles() {
  const t = useTextes();
  return (
    <div className="my-5 grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-2.5">
      {t.modeles.map((m) => (
        <div
          key={m.cle}
          className="rounded-[12px] border border-[var(--border)] bg-white px-3.5 py-3"
        >
          <span className="block text-[16px] font-semibold text-[var(--text)]">{m.nom}</span>
          <span className="mt-0.5 block text-[14px] leading-snug text-[var(--text-muted)]">
            {m.texte}
          </span>
        </div>
      ))}
    </div>
  );
}

export function Grille({ acteurs }: Comparaison) {
  const t = useTextes();
  if (!acteurs.length) return null;
  const cols: AxeCle[] = ["quiFait", "pec", "rejets", "rapprochement", "avance"];
  return (
    <div className="my-4">
      <div className="tbl">
        <table className="min-w-[860px]">
          <thead>
            <tr>
              <th>{t.acteur}</th>
              <th>{t.modele}</th>
              {cols.map((k) => (
                <th key={k}>{t.lignes.find((l) => l.cle === k)!.label}</th>
              ))}
              <th>{t.ideal}</th>
            </tr>
          </thead>
          <tbody>
            {acteurs.map((c) => (
              <tr key={c.slug}>
                <td>
                  <strong className="font-semibold text-[var(--text)]">{c.nom}</strong>
                </td>
                <td>{nomModele(t, c.modele)}</td>
                {cols.map((k) => (
                  <td key={k}>
                    <Valeur c={c} cle={k} />
                  </td>
                ))}
                <td>{c.meilleurSi[0]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Releve acteurs={acteurs} />
    </div>
  );
}

export const BLOCS_COMPARATIF: Record<string, (props: Comparaison) => ReactElement | null> = {
  "coup-doeil": CoupDoeil,
  frise: Frise,
  choisir: Choisir,
  modeles: Modeles,
  grille: Grille,
};
