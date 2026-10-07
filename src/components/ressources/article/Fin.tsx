// Fin d'un article JSON : questions fréquentes, sources, encart final, « À lire ensuite ».
import { Link } from "@tanstack/react-router";
import { dateFr, ficheJson } from "@/lib/ressources/contenu";
import type { Fiche, Plateforme, RessourceJson } from "@/lib/ressources/types";
import { CarteArticle } from "../Cartes";

const h2 =
  "mb-3.5 scroll-mt-[96px] font-serif text-[30px] font-normal leading-tight tracking-[-0.015em] text-[var(--text)]";

/** Accordéon, première question ouverte ; même texte que le FAQPage. */
export function Faq({ items }: { items: RessourceJson["faqItems"] }) {
  if (!items?.length) return null;
  return (
    <section id="faq" className="mt-12">
      <h2 className={h2}>Questions fréquentes</h2>
      {items.map((f, i) => (
        <details
          key={f.question}
          open={i === 0}
          className="group border-t border-[var(--border)] py-1 last:border-b"
        >
          <summary className="flex cursor-pointer list-none justify-between gap-4 py-3.5 font-semibold text-[var(--text)] [&::-webkit-details-marker]:hidden">
            {f.question}
            <span aria-hidden className="text-[22px] font-normal leading-none text-[var(--text-muted)] group-open:hidden">
              +
            </span>
            <span aria-hidden className="hidden text-[22px] font-normal leading-none text-[var(--text-muted)] group-open:inline">
              −
            </span>
          </summary>
          <p className="pb-3.5 text-[16.5px]">{f.answer}</p>
        </details>
      ))}
    </section>
  );
}

/** Sources : « Site · page », liens externes ; pour une plateforme, la mention du relevé Granit. */
export function Sources({ article, plateforme }: { article: RessourceJson; plateforme: Plateforme | null }) {
  const releves = plateforme ? Object.values(plateforme.sources).filter((s) => !s.url) : [];
  if (!article.sources?.length && !releves.length) return null;
  return (
    <section id="sources" className="mt-12">
      <h2 className={h2}>Sources</h2>
      <ul className="list-disc pl-[22px] text-[15px]">
        {article.sources.map((s) => (
          <li key={s.url} className="my-1.5">
            <a href={s.url} rel="noopener" className="text-[var(--terra-hover)] underline underline-offset-[3px]">
              {s.label}
            </a>
          </li>
        ))}
        {releves.map((s) => (
          <li key={s.label} className="my-1.5">
            {s.label}. Relevé par les agents Granit le {dateFr(plateforme!.checkedOn, true)}.
          </li>
        ))}
      </ul>
    </section>
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

/**
 * « À lire ensuite » : 3 cartes depuis internalLinks + liensEntrants, seulement vers des
 * articles en ligne ; le parent d'abord, puis les sœurs, puis le reste.
 */
export function ALireEnsuite({ article }: { article: RessourceJson }) {
  const vus = new Set([article.slug]);
  const liens: { fiche: Fiche; type: string }[] = [];
  const candidats = [
    ...(article.parentSlug ? [{ slug: article.parentSlug, type: "parent" }] : []),
    ...(article.internalLinks ?? []),
    ...(article.liensEntrants ?? []),
  ].sort((a, b) => (RANG[a.type] ?? 2) - (RANG[b.type] ?? 2));
  for (const l of candidats) {
    const fiche = ficheJson(l.slug);
    if (!fiche || vus.has(l.slug)) continue;
    // Jamais un article d'aperçu depuis un article publié.
    if (fiche.preview && !article.preview) continue;
    vus.add(l.slug);
    liens.push({ fiche, type: l.type });
  }
  if (!liens.length) return null;
  return (
    <section className="border-t border-[var(--border)] bg-[var(--bg2)] py-12">
      <div className="mx-auto max-w-[1280px] px-4 md:px-6">
        <div className="eyebrow">Dans le même thème</div>
        <h2 className="mt-2 font-serif text-[30px] font-normal leading-tight">À lire ensuite</h2>
        <div className="mt-6 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {liens.slice(0, 3).map(({ fiche, type }) => (
            <CarteArticle key={fiche.slug} fiche={fiche} etiquette={ETIQUETTES[type] ?? "À lire aussi"} />
          ))}
        </div>
      </div>
    </section>
  );
}
