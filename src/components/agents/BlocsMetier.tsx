import { Reveal } from "@/components/Reveal";
import { LOGOS, LOGOS_AVEC_NOM, type PageMetier } from "./pages";

// Blocs propres aux pages métier (/metiers/<slug>) : « ce que vous n'avez plus à faire »,
// « comment on démarre », et la liste des logiciels et plateformes.

/** Aujourd'hui / avec Granit, une ligne par tâche. Sur mobile, les deux colonnes s'empilent. */
export function AvantApres({ bloc }: { bloc: NonNullable<PageMetier["avantApres"]> }) {
  return (
    <>
      <Reveal>
        <h2 className="font-serif text-[clamp(30px,3.4vw,46px)] leading-[1.06] tracking-[-0.02em]">
          {bloc.titre[0]} <span className="accent-italic">{bloc.titre[1]}</span>
        </h2>
      </Reveal>
      <Reveal>
        <div
          className="mt-9 overflow-hidden rounded-[22px] border"
          style={{ background: "var(--papier)", borderColor: "var(--filet)" }}
        >
          <div
            className="hidden grid-cols-2 border-b md:grid"
            style={{ borderColor: "var(--filet)" }}
            aria-hidden
          >
            <div className="eyebrow px-7 py-4">{bloc.avant}</div>
            <div className="eyebrow px-7 py-4" style={{ background: "var(--lavis)" }}>
              {bloc.apres}
            </div>
          </div>
          <ul>
            {bloc.lignes.map((l, k) => (
              <li
                key={l.avant}
                className={`grid md:grid-cols-2 ${k > 0 ? "border-t" : ""}`}
                style={{ borderColor: "var(--filet)" }}
              >
                <p
                  className="px-6 pt-5 pb-2 text-[15.5px] leading-[1.55] line-through decoration-1 md:px-7 md:py-5"
                  style={{ color: "var(--texte-secondaire)", textDecorationColor: "var(--filet)" }}
                >
                  <span className="sr-only">{bloc.avant} : </span>
                  {l.avant}
                </p>
                <p
                  className="flex items-start gap-2.5 px-6 pt-2 pb-5 text-[15.5px] leading-[1.55] font-medium md:px-7 md:py-5"
                  style={{ background: "var(--lavis)" }}
                >
                  <svg viewBox="0 0 12 12" className="mt-1.5 size-3.5 flex-none" aria-hidden>
                    <path
                      d="M2.5 6.2l2.3 2.3 4.7-5"
                      fill="none"
                      stroke="var(--profond)"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span>
                    <span className="sr-only">{bloc.apres} : </span>
                    {l.apres}
                  </span>
                </p>
              </li>
            ))}
          </ul>
        </div>
      </Reveal>
    </>
  );
}

/** Les étapes de la mise en route, numérotées, en cartes papier. */
export function Demarrage({ bloc }: { bloc: NonNullable<PageMetier["demarrage"]> }) {
  return (
    <>
      <Reveal>
        <h2 className="font-serif text-[clamp(30px,3.4vw,46px)] leading-[1.06] tracking-[-0.02em]">
          {bloc.titre[0]} <span className="accent-italic">{bloc.titre[1]}</span>
        </h2>
      </Reveal>
      <ol className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {bloc.etapes.map((e, k) => (
          <li key={e.titre}>
            <Reveal delay={k * 0.05} className="h-full">
              <div
                className="h-full rounded-[18px] border p-6"
                style={{ background: "var(--papier)", borderColor: "var(--filet)" }}
              >
                <span
                  className="inline-flex size-8 items-center justify-center rounded-full font-serif text-[16px]"
                  style={{ background: "var(--succes-fond)", color: "var(--succes-texte)" }}
                  aria-hidden
                >
                  {k + 1}
                </span>
                <h3 className="mt-4 font-serif text-[21px] leading-[1.2]">{e.titre}</h3>
                <p
                  className="mt-2 text-[15px] leading-[1.6]"
                  style={{ color: "var(--texte-secondaire)" }}
                >
                  {e.texte}
                </p>
              </div>
            </Reveal>
          </li>
        ))}
      </ol>
    </>
  );
}

export function ListeNoms({
  titre,
  noms,
  suite,
}: {
  titre: string;
  noms: string[];
  suite: string;
}) {
  return (
    <div>
      <h3 className="eyebrow">{titre}</h3>
      <ul className="mt-4 flex flex-wrap gap-2">
        {noms.map((n) => (
          <li
            key={n}
            className="flex h-[64px] w-[110px] items-center justify-center gap-1.5 rounded-[12px] border px-3"
            style={{ background: "var(--papier)", borderColor: "var(--filet)" }}
          >
            {LOGOS[n] ? (
              <>
                <img
                  src={LOGOS[n]}
                  alt={LOGOS_AVEC_NOM.includes(n) ? "" : n}
                  loading="lazy"
                  className={`max-w-[86px] min-w-0 object-contain ${LOGOS_AVEC_NOM.includes(n) ? "max-h-[20px]" : "max-h-[32px]"}`}
                />
                {LOGOS_AVEC_NOM.includes(n) && <span className="text-[14px] font-medium">{n}</span>}
              </>
            ) : (
              <span className="text-[15px] font-medium">{n}</span>
            )}
          </li>
        ))}
        <li
          className="flex items-center px-2 text-[15px]"
          style={{ color: "var(--texte-secondaire)" }}
        >
          {suite}
        </li>
      </ul>
    </div>
  );
}
