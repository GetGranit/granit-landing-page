import { useInView } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { Reveal } from "@/components/Reveal";
import { mouvementReduit } from "@/lib/motion";

// Blocs communs à /agents et aux pages métier.

export type QuestionFaq = { question: string; answer: string; rdv?: string };

export function FaqAgents({
  titre,
  items,
  children,
}: {
  titre: string;
  items: QuestionFaq[];
  children?: ReactNode;
}) {
  return (
    <section className="mx-auto max-w-[840px] px-4 pb-8 sm:px-6">
      <Reveal>
        <div
          className="ress-faq rounded-[22px] border px-5 py-8 sm:px-8 md:px-10"
          style={{ background: "var(--papier)", borderColor: "var(--filet)" }}
        >
          <h2 className="font-serif text-[clamp(26px,2.6vw,34px)] leading-[1.1] tracking-[-0.015em]">
            {titre}
          </h2>
          <div className="mt-6">
            {items.map((f, i) => (
              <details
                key={f.question}
                open={i === 0}
                className="border-t py-1 last:border-b"
                style={{ borderColor: "var(--filet)" }}
              >
                <summary className="flex cursor-pointer list-none justify-between gap-4 rounded-[4px] py-3.5 font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--profond)] [&::-webkit-details-marker]:hidden">
                  {f.question}
                  <span
                    aria-hidden
                    className="plus grid size-6 shrink-0 place-items-center text-[22px] leading-none font-normal"
                    style={{ color: "var(--texte-secondaire)" }}
                  >
                    +
                  </span>
                </summary>
                <p
                  className="pb-3.5 text-[16px] leading-[1.6]"
                  style={{ color: "var(--texte-secondaire)" }}
                >
                  {f.answer}
                  {f.rdv && (
                    <>
                      {" "}
                      <Link
                        to="/"
                        hash="demo"
                        className="font-medium underline underline-offset-4"
                        style={{ color: "var(--profond)" }}
                      >
                        {f.rdv}
                      </Link>
                    </>
                  )}
                </p>
              </details>
            ))}
          </div>
          {children}
        </div>
      </Reveal>
    </section>
  );
}

export function AppelFinal({
  titre,
  texte,
  bouton,
  children,
}: {
  titre: [string, string];
  texte: string;
  bouton: string;
  children?: ReactNode;
}) {
  return (
    <section className="mx-auto max-w-[1120px] px-4 pt-10 pb-24 sm:px-6">
      <Reveal>
        <div className="section-sombre rounded-[22px] px-6 py-10 md:px-12 md:py-12">
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div>
              <h2 className="font-serif text-[clamp(28px,3vw,40px)] leading-[1.08] tracking-[-0.02em]">
                {titre[0]} <span className="accent-italic">{titre[1]}</span>
              </h2>
              <p
                className="mt-3 max-w-[52ch] text-[16px] leading-[1.55]"
                style={{ color: "var(--sur-encre-secondaire)" }}
              >
                {texte}
              </p>
            </div>
            <Link to="/" hash="demo" className="btn-clair flex-none">
              {bouton} <span aria-hidden>↗</span>
            </Link>
          </div>
          {children}
        </div>
      </Reveal>
    </section>
  );
}

/**
 * Un dossier de bout en bout : chaque étape s'allume quand elle passe à l'écran.
 * Rendu serveur, hydratation et animations réduites : tout est allumé (lisible sans JS).
 */
export function Dossier({ etapes }: { etapes: { etape: string; texte: string }[] }) {
  const [anime, setAnime] = useState(false);
  useEffect(() => {
    if (!mouvementReduit()) setAnime(true);
  }, []);
  return (
    <ol className="relative mt-10 grid gap-0">
      {etapes.map((e, k) => (
        <EtapeDossier
          key={e.etape}
          n={k + 1}
          derniere={k === etapes.length - 1}
          anime={anime}
          {...e}
        />
      ))}
    </ol>
  );
}

function EtapeDossier({
  n,
  etape,
  texte,
  derniere,
  anime,
}: {
  n: number;
  etape: string;
  texte: string;
  derniere: boolean;
  anime: boolean;
}) {
  const ref = useRef<HTMLLIElement>(null);
  const vue = useInView(ref, { once: true, margin: "0px 0px -35% 0px" });
  const allume = !anime || vue;
  return (
    <li
      ref={ref}
      className="relative grid grid-cols-[40px_1fr] gap-5 pb-9 md:grid-cols-[48px_1fr] md:gap-7"
    >
      {!derniere && (
        <span
          aria-hidden
          className="absolute top-10 bottom-0 left-[19px] w-px origin-top transition-transform duration-700 md:top-12 md:left-[23px]"
          style={{ background: "var(--profond)", transform: allume ? "scaleY(1)" : "scaleY(0)" }}
        />
      )}
      {!derniere && (
        <span
          aria-hidden
          className="absolute top-10 bottom-0 left-[19px] -z-10 w-px md:top-12 md:left-[23px]"
          style={{ background: "var(--filet)" }}
        />
      )}
      <span
        className="grid size-10 place-items-center rounded-full text-[14px] font-medium transition-[background-color,color,box-shadow] duration-500 md:size-12 md:text-[15px]"
        style={{
          background: allume ? "var(--encre)" : "var(--papier)",
          color: allume ? "var(--menthe)" : "var(--texte-secondaire)",
          boxShadow: allume ? "none" : "inset 0 0 0 1px var(--filet-champ)",
        }}
      >
        {n}
      </span>
      <div
        className="pt-1.5 transition-opacity duration-500 md:pt-2.5"
        style={{ opacity: allume ? 1 : 0.45 }}
      >
        <div className="font-serif text-[22px] leading-[1.15] md:text-[26px]">{etape}</div>
        <p
          className="mt-2 max-w-[56ch] text-[16px] leading-[1.6]"
          style={{ color: "var(--texte-secondaire)" }}
        >
          {texte}
        </p>
      </div>
    </li>
  );
}
