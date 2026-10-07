// Fin d'un article JSON : questions fréquentes, sources, encart final, « À lire ensuite ».
import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { usePostHog } from "posthog-js/react";
import {
  aLaUne,
  categorie,
  dateFr,
  ficheJson,
  fichesCategorie,
  tempsLecture,
} from "@/lib/ressources/contenu";
import type { Concurrent, Fiche, Plateforme, RessourceJson } from "@/lib/ressources/types";
import { CarteArticle } from "../Cartes";
import { BoutonAncre } from "./Ancres";

/** Adresse pour signaler une erreur ; tant qu'elle est vide, la ligne « Écrivez-nous » n'apparaît pas. */
const CORRECTIONS_EMAIL = "";

const h2 =
  "mb-3.5 scroll-mt-[96px] font-serif text-[30px] font-normal leading-tight tracking-[-0.015em] text-[var(--text)]";

/** Accordéon, première question ouverte ; même texte que le FAQPage. */
export function Faq({ items }: { items: RessourceJson["faqItems"] }) {
  if (!items?.length) return null;
  return (
    <section id="faq" className="ress-faq mt-12 scroll-mt-[96px]">
      <h2 className={`group/titre ${h2}`}>
        Questions fréquentes
        <BoutonAncre id="faq" titre="Questions fréquentes" />
      </h2>
      {items.map((f, i) => (
        <details
          key={f.question}
          open={i === 0}
          className="border-t border-[var(--border)] py-1 last:border-b"
        >
          <summary className="flex cursor-pointer list-none justify-between gap-4 rounded-[4px] py-3.5 font-semibold text-[var(--text)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--terra)] [&::-webkit-details-marker]:hidden">
            {f.question}
            <span
              aria-hidden
              className="plus grid size-6 shrink-0 place-items-center text-[22px] font-normal leading-none text-[var(--text-muted)]"
            >
              +
            </span>
          </summary>
          <p className="pb-3.5 text-[16.5px]">{f.answer}</p>
        </details>
      ))}
    </section>
  );
}

/** Sources : « Site · page », liens externes ; pour une plateforme, la mention du relevé Granit. */
export function Sources({
  article,
  plateforme,
  acteurs = [],
}: {
  article: RessourceJson;
  plateforme: Plateforme | null;
  /** Page comparative : les pages d'où viennent les faits des tableaux, en plus des sources du texte. */
  acteurs?: Concurrent[];
}) {
  const releves = plateforme ? Object.values(plateforme.sources).filter((s) => !s.url) : [];
  const dejaCitees = new Set(article.sources.map((s) => s.url.replace(/\/+$/, "")));
  const faits = acteurs
    .flatMap((c) => Object.values(c.sources).map((s) => ({ ...s, checkedOn: c.checkedOn })))
    .filter((s): s is typeof s & { url: string } => Boolean(s.url))
    .filter(
      (s, i, tous) =>
        !dejaCitees.has(s.url.replace(/\/+$/, "")) && tous.findIndex((x) => x.url === s.url) === i,
    );
  if (!article.sources?.length && !releves.length && !faits.length) return null;
  return (
    <section id="sources" className="mt-12 scroll-mt-[96px]">
      <h2 className={`group/titre ${h2}`}>
        Sources
        <BoutonAncre id="sources" titre="Sources" />
      </h2>
      <ul className="list-disc pl-[22px] text-[15px]">
        {article.sources.map((s) => (
          <li key={s.url} className="my-1.5">
            <a
              href={s.url}
              rel="noopener"
              className="text-[var(--terra-hover)] underline underline-offset-[3px]"
            >
              {s.label}
            </a>
          </li>
        ))}
        {releves.map((s) => (
          <li key={s.label} className="my-1.5">
            {s.label}. Relevé par les agents Granit le {dateFr(plateforme!.checkedOn, true)}.
          </li>
        ))}
        {faits.map((s) => (
          <li key={s.url} className="my-1.5">
            <a
              href={s.url}
              rel="noopener"
              className="text-[var(--terra-hover)] underline underline-offset-[3px]"
            >
              {s.label}
            </a>{" "}
            (relevé le {dateFr(s.consulte ?? s.checkedOn, true)})
          </li>
        ))}
      </ul>
      {acteurs.length > 0 && (
        <p className="mt-4 text-[14.5px] text-[var(--text-muted)]">
          Comparatif rédigé par Granit, qui en fait partie. Il ne reprend que des informations
          publiées par chaque acteur, à la date indiquée, et ne compare aucun prix. Publicité
          comparative au sens de l'article L122-1 du Code de la consommation ; les marques citées
          appartiennent à leurs titulaires.
        </p>
      )}
      {CORRECTIONS_EMAIL && (
        <p className="mt-4 text-[14.5px] text-[var(--text-muted)]">
          Une information est fausse ou a changé ?{" "}
          <a
            href={`mailto:${CORRECTIONS_EMAIL}?subject=${encodeURIComponent(`Correction : ${article.title.split(" : ")[0]}`)}`}
            className="font-semibold text-[var(--text)] underline underline-offset-[3px]"
          >
            Écrivez-nous
          </a>
        </p>
      )}
    </section>
  );
}

/** « Utile ? » : deux réponses de même poids, un merci, aucune relance ni champ libre. */
export function Utile({ slug }: { slug: string }) {
  const posthog = usePostHog();
  const [repondu, setRepondu] = useState(false);
  const repondre = (reponse: "oui" | "non") => {
    posthog?.capture("ressource_utile", { slug, reponse });
    setRepondu(true);
  };
  const bouton =
    "rounded-full border border-[var(--border2)] bg-white px-4 py-1.5 text-[14.5px] font-medium hover:border-[var(--text-muted)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--terra)]";
  return (
    <div
      className="mt-10 flex flex-wrap items-center gap-3 border-t border-[var(--border)] pt-6 text-[15px]"
      aria-live="polite"
    >
      {repondu ? (
        <span>Merci, c'est noté.</span>
      ) : (
        <>
          <span className="mr-1">Cet article vous a été utile ?</span>
          <button type="button" className={bouton} onClick={() => repondre("oui")}>
            Oui
          </button>
          <button type="button" className={bouton} onClick={() => repondre("non")}>
            Non
          </button>
        </>
      )}
    </div>
  );
}

/** Encart final : texte fixe validé le 07/10/2026, seul endroit où figure la promesse « 48 h ». */
export function EncartFinal() {
  return (
    <aside className="mt-14 rounded-[18px] bg-[#1c1108] p-7 text-[#f6efe4] md:p-8">
      <h3 className="font-serif text-[26px] font-normal leading-tight">
        Vos prises en charge prennent trop de temps ?
      </h3>
      <p className="mt-3 max-w-[56ch] text-[16px] leading-relaxed text-[#c9bfb0]">
        Granit saisit les demandes sur les portails des plateformes et suit les réponses à votre
        place. Branché sur vos portails en 48 h, sans API à demander.
      </p>
      <Link to="/demo" className="btn-primary mt-5 inline-flex">
        Demander une démo
      </Link>
    </aside>
  );
}

const ETIQUETTES: Record<string, string> = {
  parent: "Pour aller plus haut",
  enfant: "Pour aller plus loin",
  sœur: "Même thème",
  soeur: "Même thème",
  outil: "Outil",
};
const RANG: Record<string, number> = { parent: 0, sœur: 1, soeur: 1 };

/** Liens du cocon en ligne, sans l'article lui-même ni (en publié) d'aperçu. */
function liensEnLigne(article: RessourceJson) {
  const out: { fiche: Fiche; type: string }[] = [];
  const vus = new Set([article.slug]);
  for (const l of [
    ...(article.parentSlug ? [{ slug: article.parentSlug, type: "parent" }] : []),
    ...(article.internalLinks ?? []),
    ...(article.liensEntrants ?? []),
  ]) {
    const fiche = ficheJson(l.slug);
    if (!fiche || vus.has(l.slug)) continue;
    // Jamais un article d'aperçu depuis un article publié.
    if (fiche.preview && !article.preview) continue;
    vus.add(l.slug);
    out.push({ fiche, type: l.type });
  }
  return out;
}

/** Le prochain article logique : un enfant, sinon une sœur, sinon le parent. */
export function etapeSuivante(article: RessourceJson) {
  const liens = liensEnLigne(article);
  for (const types of [["enfant"], ["sœur", "soeur"], ["parent"]]) {
    const l = liens.find((x) => types.includes(x.type));
    if (l) return l;
  }
  return undefined;
}

/** « Étape suivante », juste après la dernière section, avant la FAQ. */
export function EtapeSuivante({ article }: { article: RessourceJson }) {
  const l = etapeSuivante(article);
  if (!l) return null;
  const c = categorie(l.fiche.category)!;
  return (
    <Link
      to="/ressources/$slug"
      params={{ slug: l.fiche.slug }}
      className="group mt-10 block rounded-[14px] border border-[var(--border)] bg-[var(--bg2)] px-5 py-4 transition hover:border-[var(--border2)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--terra)]"
    >
      <span
        className="font-mono text-[11px] font-medium uppercase tracking-[0.12em]"
        style={{ color: c.ink }}
      >
        {l.type === "parent" ? "Vue d'ensemble" : "Étape suivante"}
      </span>
      <span className="mt-1.5 block font-serif text-[21px] leading-snug text-[var(--text)] group-hover:underline group-hover:decoration-1 group-hover:underline-offset-[5px]">
        {l.fiche.title}
      </span>
      <span className="mt-1 block text-[14px] text-[var(--text-muted)]">
        {tempsLecture(l.fiche.readTime)} · {c.nom}{" "}
        <span aria-hidden className="inline-block transition-transform group-hover:translate-x-1">
          →
        </span>
      </span>
    </Link>
  );
}

/**
 * « À lire ensuite » : 3 cartes, le parent d'abord, puis les sœurs, puis le reste ;
 * complété par la même catégorie puis « À la une ». Sans l'étape suivante déjà montrée.
 */
export function ALireEnsuite({ article }: { article: RessourceJson }) {
  const suivante = etapeSuivante(article)?.fiche.slug;
  const liens = liensEnLigne(article)
    .filter((l) => l.fiche.slug !== suivante)
    .sort((a, b) => (RANG[a.type] ?? 2) - (RANG[b.type] ?? 2));
  const vus = new Set([article.slug, suivante, ...liens.map((l) => l.fiche.slug)]);
  for (const f of [...fichesCategorie(article.category), ...aLaUne()]) {
    if (liens.length >= 3) break;
    if (vus.has(f.slug) || (f.preview && !article.preview)) continue;
    vus.add(f.slug);
    liens.push({ fiche: f, type: "sœur" });
  }
  if (!liens.length) return null;
  return (
    <section className="border-t border-[var(--border)] bg-[var(--bg2)] py-12">
      <div className="mx-auto max-w-[1280px] px-4 md:px-6">
        <div className="eyebrow">Dans le même thème</div>
        <h2 className="mt-2 font-serif text-[30px] font-normal leading-tight">À lire ensuite</h2>
        <div className="mt-6 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {liens.slice(0, 3).map(({ fiche, type }, i) => (
            <CarteArticle
              key={fiche.slug}
              fiche={fiche}
              rang={i}
              etiquette={ETIQUETTES[type] ?? "À lire aussi"}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
