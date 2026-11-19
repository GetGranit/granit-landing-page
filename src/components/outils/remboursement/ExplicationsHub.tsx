// La partie explicative du hub /outils/remboursement, sous la liste : à lire en 30 secondes.
// Ordre : comment se calcule un remboursement (exemple chiffré en barre), qui paie quoi selon la
// classe (100 % Santé / prix libre côte à côte), les plafonds du prix libre (cartes chiffrées), lire un
// code (2 ou 7), ce que l'outil ne calcule pas. Textes et montants arrivent rédigés et datés par le
// serveur (vues.mjs, textesHub.mjs) ; ce composant ne fait que les poser. Sources en exposant.
// Jetons de DESIGN.md seulement.
import type { CSSProperties, ReactNode } from "react";
import { CartePapier, SectionOutil } from "@/components/outils/socle";
import { RenvoisSources } from "@/components/outils/remboursement/Blocs";
import { euros } from "@/lib/outils/remboursement/format.mjs";
import type { SectionMethode } from "@/lib/outils/remboursement/vues.mjs";
import type { SourceDonnee } from "@/lib/outils/socle/types";

type Exemple = NonNullable<SectionMethode["exemple"]>;
type Colonne = NonNullable<SectionMethode["colonnes"]>[number];

const SECONDAIRE: CSSProperties = { color: "var(--texte-secondaire)" };
const SUR_TITRE: CSSProperties = {
  color: "var(--texte-discret)",
  fontSize: 12,
  fontWeight: 500,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  lineHeight: 1.2,
};
/** Les trois parts de la barre : Sécurité sociale, ticket modérateur, au-delà de la base. */
const COULEUR = { secu: "var(--encre)", tm: "var(--profond)", reste: "var(--menthe)" };

const pourcent = (v: number, total: number) => `${((v / total) * 100).toFixed(2)}%`;

/** Pastille de couleur d'une légende (une ou deux couleurs). */
function Pastille({ couleurs }: { couleurs: string[] }) {
  return (
    <span
      aria-hidden
      className="inline-flex h-3 w-3 shrink-0 overflow-hidden rounded-[3px]"
      style={{ border: "1px solid var(--filet)" }}
    >
      {couleurs.map((c) => (
        <span key={c} className="h-full flex-1" style={{ background: c }} />
      ))}
    </span>
  );
}

/** Une tuile chiffrée de l'exemple : libellé, montant, précision. */
function Tuile({
  libelle,
  montant,
  detail,
  couleurs,
  accent = false,
}: {
  libelle: string;
  montant: string;
  detail: ReactNode;
  couleurs?: string[];
  accent?: boolean;
}) {
  return (
    <div className="min-w-0 rounded-[12px] p-4" style={{ background: "var(--rose)" }}>
      <dt className="flex items-center gap-2 text-[14px]" style={SECONDAIRE}>
        {couleurs && <Pastille couleurs={couleurs} />}
        {libelle}
      </dt>
      <dd
        className="num-tabular mt-1 font-serif"
        style={{
          fontSize: 28,
          fontWeight: 300,
          lineHeight: 1.1,
          letterSpacing: "-0.02em",
          color: accent ? "var(--profond)" : "var(--encre)",
        }}
      >
        {montant}
      </dd>
      <dd className="mt-1 text-[14px]" style={{ ...SECONDAIRE, lineHeight: 1.45 }}>
        {detail}
      </dd>
    </div>
  );
}

/** L'exemple chiffré : le verre 2263287 au prix limite, en barre, puis qui paie combien. */
function ExempleChiffre({ e, sources }: { e: Exemple; sources: SourceDonnee[] }) {
  const prix = e.prixLimite;
  const complet =
    prix !== null && e.secu !== null && e.ticketModerateur !== null && e.complementaire !== null;
  return (
    <CartePapier className="mt-5 p-5 md:p-6">
      <div style={SUR_TITRE}>
        Exemple lu dans la base LPP
        <RenvoisSources ids={e.source_ids} sources={sources} exposant />
      </div>
      <div className="mt-2 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <div className="font-serif text-[20px]" style={{ lineHeight: 1.2 }}>
          Verre unifocal de classe A
        </div>
        {prix !== null && (
          <div className="text-[15px]">
            facturé au prix limite&nbsp;:{" "}
            <span className="num-tabular" style={{ fontWeight: 500 }}>
              {euros(prix)}
            </span>
          </div>
        )}
      </div>
      <div className="mt-1 text-[14px] break-words" style={SECONDAIRE}>
        Code {e.code}, «&nbsp;{e.designation}&nbsp;»
      </div>

      {complet ? (
        <>
          {/* La barre redit les tuiles en image : les lecteurs d'écran lisent les tuiles. */}
          <div aria-hidden className="mt-6 text-[13px]">
            <div style={{ width: pourcent(e.base, prix) }}>
              <div className="num-tabular whitespace-nowrap" style={{ fontWeight: 500 }}>
                Base {euros(e.base)}
              </div>
              <div
                className="mt-1 h-2 rounded-t-[3px] border-x border-t"
                style={{ borderColor: "var(--encre)" }}
              />
            </div>
            <div className="mt-1 flex h-10 overflow-hidden rounded-[8px]">
              <div
                className="flex items-center justify-center"
                style={{ width: pourcent(e.secu!, prix), background: COULEUR.secu }}
              >
                <span style={{ color: "var(--rose)", fontWeight: 500 }}>Sécu</span>
              </div>
              <div style={{ width: pourcent(e.ticketModerateur!, prix), background: COULEUR.tm }} />
              <div className="flex-1" style={{ background: COULEUR.reste }} />
            </div>
            <div style={{ marginLeft: pourcent(e.secu!, prix) }}>
              <div
                className="mt-1 h-2 rounded-b-[3px] border-x border-b"
                style={{ borderColor: "var(--encre)" }}
              />
              <div className="num-tabular mt-1 text-right" style={{ fontWeight: 500 }}>
                Complémentaire {euros(e.complementaire!)}
              </div>
            </div>
          </div>

          <dl className="mt-5 grid gap-3 md:grid-cols-3">
            <Tuile
              libelle="Sécurité sociale"
              montant={euros(e.secu!)}
              detail={e.taux !== null ? <>{e.taux}&nbsp;% de la base</> : "part de la base"}
              couleurs={[COULEUR.secu]}
            />
            <Tuile
              libelle="Complémentaire"
              montant={euros(e.complementaire!)}
              detail={
                <>
                  Le ticket modérateur ({euros(e.ticketModerateur!)}) et tout ce qui dépasse la base
                </>
              }
              couleurs={[COULEUR.tm, COULEUR.reste]}
            />
            <Tuile libelle="Patient" montant={euros(0)} detail="En contrat responsable" accent />
          </dl>
        </>
      ) : (
        <>
          <dl className="mt-5 grid gap-3 md:grid-cols-3">
            <Tuile
              libelle="Base de remboursement"
              montant={euros(e.base)}
              detail="Lue dans la LPP"
            />
            {prix !== null && (
              <Tuile libelle="Prix limite de vente" montant={euros(prix)} detail="Lu dans la LPP" />
            )}
            <Tuile
              libelle="Patient"
              montant={euros(0)}
              detail="En contrat responsable, jusqu’au prix limite"
              accent
            />
          </dl>
          <div className="mt-3 text-[14px]" style={SECONDAIRE}>
            Taux 2027 non publié&nbsp;: nous n’affichons pas de montant Sécurité sociale.
          </div>
        </>
      )}
    </CartePapier>
  );
}

/** Une colonne du comparatif 100 % Santé / prix libre. */
function CarteClasse({ c, sources }: { c: Colonne; sources: SourceDonnee[] }) {
  const sante = c.cle === "100-sante";
  return (
    <CartePapier className="flex min-w-0 flex-col p-5">
      <div className="flex items-center gap-1">
        <span
          className="inline-flex items-center rounded-full px-3 py-1 text-[14px]"
          style={{
            fontWeight: 500,
            background: sante ? "var(--succes-fond)" : "var(--lavis)",
            color: sante ? "var(--succes-texte)" : "var(--encre)",
          }}
        >
          {c.titre}
        </span>
        <RenvoisSources ids={c.source_ids} sources={sources} exposant />
      </div>
      <div className="mt-2 text-[14px]" style={SECONDAIRE}>
        {c.classes}
      </div>
      <dl className="mt-3">
        {c.lignes.map((l) => (
          <div key={l.libelle} className="border-t py-2.5" style={{ borderColor: "var(--filet)" }}>
            <dt className="text-[13px]" style={SECONDAIRE}>
              {l.libelle}
            </dt>
            <dd
              className={l.fort ? "mt-0.5 font-serif" : "mt-0.5 text-[15px]"}
              style={
                l.fort
                  ? {
                      fontSize: 24,
                      fontWeight: 300,
                      lineHeight: 1.15,
                      color: sante ? "var(--profond)" : "var(--encre)",
                    }
                  : { lineHeight: 1.45 }
              }
            >
              {l.valeur}
            </dd>
          </div>
        ))}
      </dl>
      {c.note && (
        <div className="mt-auto pt-2 text-[13px]" style={{ ...SECONDAIRE, lineHeight: 1.45 }}>
          {c.note}
        </div>
      )}
    </CartePapier>
  );
}

/** Les paragraphes qui restent (justifiés par le conteneur), sources en exposant. */
function Paragraphes({ s, sources }: { s: SectionMethode; sources: SourceDonnee[] }) {
  return (
    <>
      {s.paragraphes.map((p, i) => (
        <p key={i} className={i ? "mt-3" : ""}>
          {p.texte}
          <RenvoisSources ids={p.source_ids} sources={sources} exposant />
        </p>
      ))}
    </>
  );
}

export function ExplicationsHub({
  sections,
  sources,
}: {
  sections: SectionMethode[];
  sources: SourceDonnee[];
}) {
  return (
    <>
      {sections.map((s) => (
        <SectionOutil key={s.id} id={s.id} titre={s.titre} className="scroll-mt-24">
          {/* Le texte d'abord, sauf pour les codes et les limites où il conclut. */}
          {!s.codes && !s.cas && <Paragraphes s={s} sources={sources} />}

          {s.exemple && <ExempleChiffre e={s.exemple} sources={sources} />}

          {s.colonnes && (
            <div className="grid gap-4 md:grid-cols-2">
              {s.colonnes.map((c) => (
                <CarteClasse key={c.cle} c={c} sources={sources} />
              ))}
            </div>
          )}

          {s.plafonds && (
            <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-3">
              {s.plafonds.map((x) => (
                <CartePapier key={x.objet} className="min-w-0 p-4 md:p-5">
                  <div
                    className="num-tabular font-serif"
                    style={{
                      fontSize: "clamp(28px, 3vw, 36px)",
                      fontWeight: 300,
                      lineHeight: 1.05,
                      letterSpacing: "-0.02em",
                    }}
                  >
                    {x.montant}
                  </div>
                  <div className="mt-1 text-[15px]" style={{ fontWeight: 500 }}>
                    {x.objet}
                  </div>
                  <div className="mt-0.5 text-[13px]" style={SECONDAIRE}>
                    Sécurité sociale comprise
                  </div>
                </CartePapier>
              ))}
              {s.sansPlafond && (
                <div
                  className="col-span-2 min-w-0 rounded-[14px] p-4 md:col-span-1 md:p-5"
                  style={{ border: "1px dashed var(--filet-champ)" }}
                >
                  <div className="text-[15px]" style={{ fontWeight: 500 }}>
                    {s.sansPlafond.titre}
                  </div>
                  <div className="mt-1 text-[13px]" style={{ ...SECONDAIRE, lineHeight: 1.45 }}>
                    {s.sansPlafond.texte}
                  </div>
                </div>
              )}
            </div>
          )}

          {s.codes && (
            <ul className="space-y-3">
              {s.codes.map((c) => (
                <li key={c.chiffre}>
                  <CartePapier className="flex items-start gap-4 p-4">
                    <span
                      aria-hidden
                      className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[12px] font-serif"
                      style={{
                        background: "var(--encre)",
                        color: "var(--menthe)",
                        fontSize: 30,
                        fontWeight: 300,
                      }}
                    >
                      {c.chiffre}
                    </span>
                    <span className="min-w-0">
                      <span className="block text-[15px]" style={{ fontWeight: 500 }}>
                        {c.nom}
                        <span className="sr-only">, commence par {c.chiffre}</span>
                        <span aria-hidden className="num-tabular ml-2" style={SECONDAIRE}>
                          {c.chiffre}&thinsp;xxx&thinsp;xxx
                        </span>
                      </span>
                      <span className="mt-1 block text-[15px]" style={{ lineHeight: 1.45 }}>
                        {c.texte}
                      </span>
                    </span>
                  </CartePapier>
                </li>
              ))}
            </ul>
          )}

          {s.intro && (
            <div>
              {s.intro.texte}
              <RenvoisSources ids={s.intro.source_ids} sources={sources} exposant />
            </div>
          )}
          {s.cas && (
            <ul className="mt-3 flex flex-wrap gap-2">
              {s.cas.map((cas) => (
                <li
                  key={cas}
                  className="rounded-full bg-papier px-3 py-1.5 text-[14px]"
                  style={{ border: "1px solid var(--filet)" }}
                >
                  {cas}
                </li>
              ))}
            </ul>
          )}

          {(s.codes || s.cas) && s.paragraphes.length > 0 && (
            <div className="mt-4">
              <Paragraphes s={s} sources={sources} />
            </div>
          )}
        </SectionOutil>
      ))}
    </>
  );
}
