import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import type { Lang } from "@/lib/i18n";
import { mouvementReduit } from "@/lib/motion";
import { CADRAGES, METIERS, PHOTOS, SLUGS_METIERS, type SlugMetier } from "./metiers";
import { SequenceMetier } from "./Pastilles";

const textes = {
  fr: {
    eyebrow: "Votre métier",
    titre: "Choisissez votre métier.",
    chapo: "Vous voyez les agents qui s'en occupent, tâche par tâche, dans vos mots.",
    neutreTitre: "Cinq tâches, dans chaque métier",
    neutre: "Choisissez votre métier ci-dessus : vous verrez ce que font ses agents, et dans quels logiciels.",
    familles: ["Droits", "Prise en charge", "Facturation et télétransmission", "Encaissement et rapprochement", "Rejets et relances"],
    agents: "Les agents",
    outils: "Où ils travaillent",
    exemple: "Exemple",
    cta: "Demander une démo",
  },
  en: {
    eyebrow: "Your trade",
    titre: "Pick your trade.",
    chapo: "See the agents that take care of it, task by task, in your own words.",
    neutreTitre: "Five tasks, in every trade",
    neutre: "Pick your trade above: you will see what its agents do, and in which software.",
    familles: ["Eligibility", "Coverage", "Billing and transmission", "Payments and matching", "Rejections and follow-ups"],
    agents: "The agents",
    outils: "Where they work",
    exemple: "Example",
    cta: "Book a demo",
  },
};

const EASE = [0.22, 1, 0.36, 1] as const;

export function SelecteurMetier({ lang, metier }: { lang: Lang; metier?: SlugMetier }) {
  const t = textes[lang];
  const reduit = useReducedMotion();
  const panneau = useRef<HTMLDivElement>(null);
  const premier = useRef(true);

  // Lien direct vers un métier (campagne, accueil) : on arrive sur le sélecteur.
  // Après un clic sur un métier : le panneau vient à l'écran s'il est trop bas.
  useEffect(() => {
    const el = panneau.current;
    if (premier.current) {
      premier.current = false;
      if (metier && window.scrollY < 8) document.getElementById("metiers")?.scrollIntoView({ block: "start" });
      return;
    }
    if (!el || !metier) return;
    if (el.getBoundingClientRect().top > window.innerHeight * 0.55)
      el.scrollIntoView({ behavior: mouvementReduit() ? "auto" : "smooth", block: "start" });
  }, [metier]);

  return (
    <section id="metiers" className="mx-auto max-w-[1120px] scroll-mt-[88px] px-4 pt-16 pb-6 sm:px-6 md:pt-20">
      <div className="eyebrow mb-4">{t.eyebrow}</div>
      <h2 className="h2-section" style={{ fontSize: "clamp(30px, 3.4vw, 46px)" }}>
        {t.titre}
      </h2>
      <p className="body-lg mt-4 max-w-xl">{t.chapo}</p>

      <ul className="mt-8 grid gap-2.5 md:grid-cols-5 md:gap-4">
        {SLUGS_METIERS.map((slug) => {
          const m = METIERS[lang][slug];
          const choisi = slug === metier;
          return (
            <li key={slug}>
              <Link
                to="/agents"
                search={{ metier: slug }}
                replace
                resetScroll={false}
                aria-current={choisi ? "true" : undefined}
                aria-controls="metier-panneau"
                className="group flex items-center gap-4 rounded-[14px] border p-2 pr-4 transition-[border-color,box-shadow,opacity] duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--profond)] md:relative md:block md:overflow-hidden md:p-0"
                style={{
                  background: "var(--papier)",
                  borderColor: choisi ? "var(--profond)" : "var(--filet)",
                  boxShadow: choisi ? "0 0 0 1px var(--profond), var(--ombre-douce)" : "none",
                  opacity: metier && !choisi ? 0.78 : 1,
                }}
              >
                <span className="block size-14 flex-none overflow-hidden rounded-[10px] md:aspect-[4/5] md:size-auto md:w-full md:rounded-none">
                  <img
                    src={PHOTOS[slug]}
                    alt=""
                    width={520}
                    height={780}
                    loading="lazy"
                    className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    style={{ objectPosition: CADRAGES[slug] }}
                  />
                </span>
                <span
                  className="pointer-events-none absolute inset-x-0 bottom-0 hidden h-2/3 md:block"
                  style={{ background: "linear-gradient(0deg, rgba(16, 33, 29, 0.78) 0%, rgba(16, 33, 29, 0) 100%)" }}
                />
                <span className="flex-1 text-[16px] leading-[1.25] font-medium md:absolute md:inset-x-0 md:bottom-0 md:p-4 md:font-serif md:text-[19px] md:font-normal md:text-[var(--rose)]">
                  {m.nom}
                </span>
                <span aria-hidden className="text-[18px] md:hidden" style={{ color: choisi ? "var(--profond)" : "var(--texte-discret)" }}>
                  {choisi ? "●" : "›"}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>

      <div ref={panneau} id="metier-panneau" className="mt-6 scroll-mt-[88px]" aria-live="polite">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={metier ?? "neutre"}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: reduit ? 0 : 0.42, ease: EASE }}
          >
            {metier ? <Panneau lang={lang} slug={metier} /> : <Neutre lang={lang} />}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

function Neutre({ lang }: { lang: Lang }) {
  const t = textes[lang];
  return (
    <div className="rounded-[18px] p-6 md:p-8" style={{ background: "var(--lavis)" }}>
      <div className="eyebrow">{t.neutreTitre}</div>
      <ul className="mt-4 flex flex-wrap gap-2">
        {t.familles.map((f) => (
          <li key={f} className="rounded-full border px-3.5 py-1.5 text-[14px]" style={{ background: "var(--papier)", borderColor: "var(--filet)" }}>
            {f}
          </li>
        ))}
      </ul>
      <p className="mt-4 text-[15px]" style={{ color: "var(--texte-secondaire)" }}>
        {t.neutre}
      </p>
    </div>
  );
}

function Panneau({ lang, slug }: { lang: Lang; slug: SlugMetier }) {
  const t = textes[lang];
  const m = METIERS[lang][slug];
  return (
    <article
      className="grid gap-8 rounded-[22px] border p-5 sm:p-7 lg:grid-cols-[1.25fr_0.75fr] lg:gap-10 lg:p-10"
      style={{ background: "var(--papier)", borderColor: "var(--filet)", boxShadow: "var(--ombre-douce)" }}
    >
      <div>
        <div className="eyebrow">{m.nom}</div>
        <h3 className="mt-3 font-serif text-[clamp(28px,3vw,40px)] leading-[1.08] tracking-[-0.02em]">
          {m.promesse[0]} <span className="accent-italic">{m.promesse[1]}</span>
        </h3>
        <p className="body-lg mt-4 max-w-xl">{m.preuve}</p>

        <h4 className="eyebrow mt-8">{t.agents}</h4>
        <ul className="mt-3 grid gap-x-6 sm:grid-cols-2">
          {m.agents.map((a) => (
            <li key={a.titre} className="border-t py-4" style={{ borderColor: "var(--filet)" }}>
              <span
                className="inline-block rounded-[8px] px-2 py-0.5 text-[12px] font-medium"
                style={{ background: "var(--succes-fond)", color: "var(--succes-texte)" }}
              >
                {a.tache}
              </span>
              <div className="mt-2 text-[17px] leading-[1.3] font-medium">{a.titre}</div>
              <p className="mt-1.5 text-[15px] leading-[1.55]" style={{ color: "var(--texte-secondaire)" }}>
                {a.texte}
              </p>
            </li>
          ))}
        </ul>

        <h4 className="eyebrow mt-4">{t.outils}</h4>
        <p className="mt-2 max-w-xl text-[15px] leading-[1.55]" style={{ color: "var(--texte-secondaire)" }}>
          {m.outils}
        </p>
        <Link to="/" hash="demo" className="btn-primary mt-7">
          {t.cta} <span className="arrow">↗</span>
        </Link>
      </div>

      <div className="relative isolate overflow-hidden rounded-[16px] lg:self-start" style={{ background: "var(--encre)" }}>
        <img
          src={PHOTOS[slug]}
          alt={m.alt}
          width={520}
          height={780}
          className="aspect-[4/5] w-full object-cover lg:aspect-[2/3]"
          style={{ objectPosition: CADRAGES[slug] }}
        />
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: "linear-gradient(0deg, rgba(16, 33, 29, 0.72) 0%, rgba(16, 33, 29, 0.2) 45%, rgba(16, 33, 29, 0) 70%)" }}
        />
        <span
          className="absolute top-3 left-3 rounded-full border px-2.5 py-1 text-[11px] font-medium tracking-[0.06em] uppercase backdrop-blur-md"
          style={{ background: "rgba(31, 53, 48, 0.46)", borderColor: "rgba(250, 240, 242, 0.18)", color: "var(--rose)" }}
        >
          {t.exemple}
        </span>
        <div className="absolute inset-x-3 bottom-3">
          <SequenceMetier etapes={m.agents} />
        </div>
      </div>
    </article>
  );
}
