// Page métier optique : on part de ce qui coince au comptoir, puis on montre que Granit le fait.
// Les promesses Granit reprennent seulement ce que dit /agents/optique (rien d'autre).
import { Link } from "@tanstack/react-router";
import { calcomDemoUrl } from "@/lib/calcom";
import { useLanguage } from "@/lib/i18n";
import { ficheLang, fichesVerticale } from "@/lib/ressources/contenu";
import type { Fiche } from "@/lib/ressources/types";
import { PROBLEMES_SLUGS } from "@/lib/ressources/problemesOptique";
import { Fleche } from "./Hub";

const conteneur = "mx-auto max-w-[1280px] px-4 md:px-6";

type Probleme = { id: string; titre: string; reponse: string; slugs: string[] };

const copy = {
  fr: {
    titre: "Qu'est-ce qui coince aujourd'hui ?",
    sousTitre: "Choisissez votre situation : chaque guide se lit en moins de 10 minutes.",
    problemes: [
      {
        id: "refus",
        titre: "Ma prise en charge a été refusée",
        reponse: "Le motif du rejet dit presque toujours quoi corriger. Voici comment le lire.",
      },
      {
        id: "impaye",
        titre: "La mutuelle n'a pas payé, ou pas tout",
        reponse: "Retrouver où le dossier bloque, puis relancer au bon moment.",
      },
      {
        id: "portails",
        titre: "Je m'y perds dans les portails",
        reponse: "Connexion, prise en charge et suivi, plateforme par plateforme.",
      },
      {
        id: "devis",
        titre: "Mon client trouve son reste à charge trop élevé",
        reponse: "Les chiffres pour expliquer un devis au comptoir, part par part.",
      },
      {
        id: "annee",
        titre: "Qu'est-ce qui change en 2027 ?",
        reponse: "Ticket modérateur, ordonnances, réseaux : ce qu'il faut régler avant janvier.",
      },
      {
        id: "audio",
        titre: "Je renouvelle un appareil auditif",
        reponse: "Les règles du renouvellement tous les quatre ans, oreille par oreille.",
      },
    ],
    tousPortails: "Tous les portails",
    agentsEyebrow: "Le tiers payant vous prend trop de temps ?",
    agentsTitre: "Les agents Granit font le tiers payant de votre magasin.",
    agentsTexte:
      "Vous faites le devis dans votre logiciel, comme d'habitude. Les agents s'occupent du reste, sur les portails que vous utilisez déjà.",
    etapes: [
      ["Droits", "Ils vérifient les droits du client sur la plateforme de sa mutuelle."],
      ["Prise en charge", "Elle revient en moins de 2 minutes, client encore en boutique."],
      ["Facture", "À la livraison, ils télétransmettent à l'Assurance Maladie et à la mutuelle."],
      ["Virement", "Ils pointent chaque virement, corrigent les rejets et relancent les impayés."],
    ],
    demo: "Voir une démo sur mes dossiers",
    enSavoirPlus: "Comment ça marche",
    rassure: "Optique et audio · Cosium, Optimum… · infrastructure certifiée HDS",
    comparer: "Comparer les options : en interne, externalisé ou automatisé",
    tousGuides: "Tous nos guides, par thème",
  },
  en: {
    titre: "What's getting in your way today?",
    sousTitre: "Pick your situation: each guide takes under 10 minutes to read.",
    problemes: [
      {
        id: "refus",
        titre: "My coverage request was rejected",
        reponse: "The rejection reason almost always says what to fix. Here is how to read it.",
      },
      {
        id: "impaye",
        titre: "The insurer hasn't paid, or not in full",
        reponse: "Find where the claim is stuck, then follow up at the right time.",
      },
      {
        id: "portails",
        titre: "I'm lost in the portals",
        reponse: "Login, coverage request and tracking, platform by platform.",
      },
      {
        id: "devis",
        titre: "My customer finds the out-of-pocket cost too high",
        reponse: "The figures to explain a quote at the counter, share by share.",
      },
      {
        id: "annee",
        titre: "What changes in 2027?",
        reponse: "Co-payment, prescriptions, networks: what to settle before January.",
      },
      {
        id: "audio",
        titre: "I'm renewing a hearing aid",
        reponse: "The four-year renewal rules, ear by ear.",
      },
    ],
    tousPortails: "All portals",
    agentsEyebrow: "Does third-party payment take too much of your time?",
    agentsTitre: "Granit agents handle your store's third-party payment.",
    agentsTexte:
      "You make the quote in your software, as usual. The agents do the rest, on the portals you already use.",
    etapes: [
      ["Eligibility", "They check the customer's rights on their insurer's platform."],
      ["Coverage", "It comes back in under 2 minutes, customer still in store."],
      ["Invoice", "On delivery, they send it to Assurance Maladie and the insurer."],
      ["Payment", "They match each transfer, fix rejections and chase unpaid claims."],
    ],
    demo: "See a demo on my own cases",
    enSavoirPlus: "How it works",
    rassure: "Optical and hearing · Cosium, Optimum… · HDS-certified infrastructure",
    comparer: "Compare the options: in-house, outsourced or automated",
    tousGuides: "All our guides, by topic",
  },
};

/** Les articles d'un problème, dans l'ordre voulu, parmi ceux de la page optique (absents ignorés). */
function articles(slugs: string[], fiches: Fiche[]): Fiche[] {
  return slugs.map((s) => fiches.find((f) => f.slug === s)).filter((f): f is Fiche => !!f);
}

export function ProblemesOptique() {
  const { lang } = useLanguage();
  const t = copy[lang];
  const fiches = fichesVerticale("optique");
  const problemes: Probleme[] = t.problemes.map((p) => ({ ...p, slugs: PROBLEMES_SLUGS[p.id] }));

  return (
    <section id="problemes" className={`${conteneur} monte scroll-mt-24 pt-6`}>
      <div className="border-t border-[var(--border)] pt-5">
        <h2 className="font-serif text-[28px] font-normal leading-tight md:text-[36px]">
          {t.titre}
        </h2>
        <p className="body-lg mt-2 text-[var(--text-muted)]">{t.sousTitre}</p>
      </div>
      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {problemes.map((p) => {
          const liste = articles(p.slugs, fiches);
          if (liste.length === 0) return null;
          return (
            <article
              key={p.id}
              className="flex flex-col rounded-[18px] border border-[var(--border)] bg-[var(--surface)] p-6"
            >
              <h3 className="font-serif text-[22px] font-normal leading-snug">{`«\u00a0${p.titre.replace(" ?", "\u00a0?")}\u00a0»`}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-[var(--text-muted)]">
                {p.reponse}
              </p>
              <ul className="mt-4 space-y-2.5 border-t border-[var(--border)] pt-4">
                {liste.map((f) => (
                  <li key={f.slug}>
                    <Link
                      to="/ressources/$slug"
                      params={{ slug: f.slug }}
                      className="group/l inline-flex gap-1.5 text-[15px] font-semibold leading-snug hover:underline hover:underline-offset-4"
                    >
                      <span>{ficheLang(f, lang).title}</span> <Fleche />
                    </Link>
                  </li>
                ))}
                {p.id === "portails" && (
                  <li>
                    <Link
                      to="/ressources/categorie/$category"
                      params={{ category: "plateformes" }}
                      className="group/l inline-flex gap-1.5 text-[15px] font-semibold text-[var(--text-muted)] hover:underline hover:underline-offset-4"
                    >
                      {t.tousPortails} <Fleche />
                    </Link>
                  </li>
                )}
              </ul>
            </article>
          );
        })}
      </div>
    </section>
  );
}

export function AgentsOptique() {
  const { lang } = useLanguage();
  const t = copy[lang];
  return (
    <section id="agents" className={`${conteneur} scroll-mt-24 pt-14`}>
      <div className="section-sombre rounded-[22px] px-6 py-10 md:px-12 md:py-14">
        <p className="eyebrow">{t.agentsEyebrow}</p>
        <h2 className="mt-3 max-w-[22ch] font-serif text-[clamp(28px,3.6vw,44px)] font-normal leading-[1.1]">
          {t.agentsTitre}
        </h2>
        <p className="mt-4 max-w-[60ch] text-[16px] leading-relaxed text-sur-encre-secondaire">
          {t.agentsTexte}
        </p>
        <ol className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {t.etapes.map(([nom, texte], i) => (
            <li key={nom} className="border-t border-white/20 pt-4">
              <span className="text-[13px] font-semibold text-sur-encre-secondaire">
                {i + 1}. {nom}
              </span>
              <p className="mt-1.5 text-[15px] leading-relaxed">{texte}</p>
            </li>
          ))}
        </ol>
        <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-3">
          <a
            href={calcomDemoUrl("metier-optique")}
            target="_blank"
            rel="noopener"
            className="btn-clair btn-demo text-[16px]"
          >
            {t.demo} <span className="arrow">→</span>
          </a>
          <Link
            to="/agents/$metier"
            params={{ metier: "optique" }}
            className="group/l inline-flex items-center gap-1 text-[15px] font-semibold hover:underline hover:underline-offset-4"
          >
            {t.enSavoirPlus} <Fleche />
          </Link>
        </div>
        <p className="mt-4 text-[13px] text-sur-encre-secondaire">{t.rassure}</p>
        <Link
          to="/ressources/$slug"
          params={{ slug: "gerer-tiers-payant-magasin" }}
          className="group/l mt-6 inline-flex items-center gap-1 border-t border-white/20 pt-4 text-[14px] font-semibold text-sur-encre-secondaire hover:underline hover:underline-offset-4"
        >
          {t.comparer} <Fleche />
        </Link>
      </div>
    </section>
  );
}

/** Titre qui annonce la liste complète par thème, sous les problèmes et les agents. */
export function TitreTousGuides() {
  const t = copy[useLanguage().lang];
  return (
    <div className={`${conteneur} pt-16`}>
      <p className="eyebrow">{t.tousGuides}</p>
    </div>
  );
}
