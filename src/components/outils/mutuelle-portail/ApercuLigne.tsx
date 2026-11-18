// Le résumé d'une ligne du hub (textes.md § 1.2) : les opérateurs relevés, métiers fusionnés ; avec le
// filtre métier posé, seulement ce métier, en 16 px. Un métier « à vérifier » est écrit « à confirmer
// sur la carte », en texte secondaire, jamais comme acquis. La restriction de sous-domaine est écrite
// à côté de l'opérateur (« réservé aux stomatologues »).
import type { MetierOutil } from "@/lib/outils/socle/types";
import type { LigneMutuelle } from "@/lib/outils/mutuelle-portail/types";

const encre = { color: "var(--encre)" } as const;

/** Ce qui suit le résumé : « Fiche › », « Voir › » ou « Voir le relevé ▾ » (le › seul dès 768 px). */
function Indication({ ligne }: { ligne: LigneMutuelle }) {
  const style = { color: "var(--profond)", fontWeight: 500 } as const;
  if (ligne.lien)
    return (
      <span className="mt-1 block" style={style}>
        {ligne.lien === "fiche" ? "Fiche" : "Voir"}
        <span aria-hidden className="md:hidden">
          {" "}
          ›
        </span>
      </span>
    );
  return (
    <span className="mt-1 block md:hidden" style={style}>
      Voir le relevé{" "}
      <span aria-hidden className="inline-block transition-transform group-open:rotate-180">
        ▾
      </span>
    </span>
  );
}

export function ApercuLigne({
  ligne,
  metier,
}: {
  ligne: LigneMutuelle;
  metier: MetierOutil | null;
}) {
  const a = ligne.apercu;
  const filtre = metier ? a.parMetier[metier] : undefined;
  if (filtre?.length)
    return (
      <>
        {filtre.map((p) => (
          <span
            key={`${p.metiers}|${p.operateur}`}
            className="block text-[16px]"
            style={p.statut === "sur" ? encre : undefined}
          >
            {p.metiers}
            {p.restriction ? ` (${p.restriction})` : ""}&nbsp;: {p.operateur}
            {p.statut === "sur"
              ? p.libelle
                ? p.libelle.endsWith("libellés")
                  ? ` · ${p.libelle}`
                  : ` · libellé «\u00a0${p.libelle}\u00a0»`
                : ""
              : ", à confirmer sur la carte"}
          </span>
        ))}
        <Indication ligne={ligne} />
      </>
    );
  return (
    <>
      {a.surs.length ? (
        <span className="block" style={encre}>
          {a.surs.map((g, i) => (
            <span key={g.metiers}>
              {i > 0 && " · "}
              {g.metiers}&nbsp;: {g.operateur}
            </span>
          ))}
        </span>
      ) : (
        <span className="block">Pas de source publique datée pour l’instant</span>
      )}
      {a.aConfirmer.map((g) => (
        <span key={`${g.metiers}|${g.operateur}|${g.restriction}`} className="block">
          {g.metiers}
          {g.restriction ? ` (${g.restriction})` : ""}&nbsp;: {g.operateur}, à confirmer sur la
          carte
        </span>
      ))}
      <Indication ligne={ligne} />
    </>
  );
}
