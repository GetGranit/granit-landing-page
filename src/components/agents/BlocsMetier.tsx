import type { ReactNode } from "react";
import { Reveal } from "@/components/Reveal";
import { LOGOS, LOGOS_AVEC_NOM, type PageMetier } from "./pages";

// Blocs propres aux pages métier (/metiers/<slug>) : « ce que vous n'avez plus à faire »,
// « comment on démarre », et la liste des logiciels et plateformes.

/** Met en gras le passage clé de la phrase (s'il n'y figure pas, la phrase reste telle quelle). */
function avecCle(texte: string, cle: string): ReactNode {
  const i = texte.indexOf(cle);
  if (i < 0) return texte;
  return (
    <>
      {texte.slice(0, i)}
      <strong className="font-semibold">{cle}</strong>
      {texte.slice(i + cle.length)}
    </>
  );
}

const GRILLE = "md:grid-cols-[180px_1fr_40px_1fr]";

/**
 * Le parcours du dossier, une ligne par étape numérotée : la tâche d'aujourd'hui en retrait, une flèche,
 * puis ce que fait Granit sur fond menthe, passage clé en gras. Sur mobile : l'étape, l'avant, puis l'après
 * dans un encart menthe.
 */
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
          className="mt-9 max-w-[980px] overflow-hidden rounded-[22px] border"
          style={{ background: "var(--papier)", borderColor: "var(--filet)" }}
        >
          <div
            className={`hidden border-b md:grid ${GRILLE}`}
            style={{ borderColor: "var(--filet)" }}
            aria-hidden
          >
            <div />
            <div className="eyebrow px-6 py-4">{bloc.avant}</div>
            <div />
            <div
              className="eyebrow px-6 py-4"
              style={{ background: "var(--succes-fond)", color: "var(--succes-texte)" }}
            >
              {bloc.apres}
            </div>
          </div>
          <ol>
            {bloc.lignes.map((l, k) => (
              <li
                key={l.etape}
                className={`grid md:items-stretch ${GRILLE} ${k > 0 ? "border-t" : ""}`}
                style={{ borderColor: "var(--filet)" }}
              >
                <div className="flex items-baseline gap-3 px-6 pt-5 md:items-center md:py-5">
                  <span
                    className="num-tabular font-serif text-[15px]"
                    style={{ color: "var(--profond)" }}
                    aria-hidden
                  >
                    {String(k + 1).padStart(2, "0")}
                  </span>
                  <h3 className="font-serif text-[18px] leading-[1.2]">{l.etape}</h3>
                </div>
                <p
                  className="px-6 pt-2 text-[15px] leading-[1.5] md:flex md:items-center md:py-5"
                  style={{ color: "var(--texte-secondaire)" }}
                >
                  <span>
                    <span className="sr-only">{bloc.avant} : </span>
                    {l.avant}
                  </span>
                </p>
                <div
                  className="hidden items-center justify-center md:flex"
                  style={{ color: "var(--profond)" }}
                  aria-hidden
                >
                  <svg viewBox="0 0 20 12" className="h-3 w-5">
                    <path
                      d="M1 6h16M12 1.5L17 6l-5 4.5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <p
                  className="mx-4 mt-3 mb-4 rounded-[12px] px-4 py-3 text-[15.5px] leading-[1.5] md:m-0 md:flex md:items-center md:rounded-none md:px-6 md:py-5"
                  style={{ background: "var(--succes-fond)", color: "var(--succes-texte)" }}
                >
                  <span>
                    <span className="sr-only">{bloc.apres} : </span>
                    {avecCle(l.apres, l.cle)}
                  </span>
                </p>
              </li>
            ))}
          </ol>
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
