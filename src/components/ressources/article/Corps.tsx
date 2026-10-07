import type { ReactNode } from "react";
import type { Concurrent, Plateforme } from "@/lib/ressources/types";
import { figureHtml, type Figure } from "@/lib/ressources/figures";
import { BLOCS } from "./BlocsPlateforme";
import { BLOCS_COMPARATIF } from "./BlocsComparatif";

const MARQUEUR = /<div\s+data-(bloc|figure)=["']([a-z0-9-]+)["']\s*>\s*<\/div>/g;

/**
 * Coupe le HTML juste après l'encadré « L'essentiel » (le premier </div> qui suit
 * class="key-takeaways" : l'encadré ne contient qu'un <strong> et une liste).
 */
function apresEssentiel(html: string): [string, string] {
  const debut = html.search(/class=["']key-takeaways["']/);
  if (debut < 0) return ["", html];
  const fin = html.indexOf("</div>", debut);
  if (fin < 0) return ["", html];
  return [html.slice(0, fin + 6), html.slice(fin + 6)];
}

function Html({ html }: { html: string }) {
  if (!html.trim()) return null;
  return <div className="ress-html" dangerouslySetInnerHTML={{ __html: html }} />;
}

/**
 * Le corps d'un article JSON. contentHtml est affiché tel quel (déjà contrôlé par le moteur) ;
 * seuls les marqueurs data-bloc sont remplacés par les blocs des fichiers de faits (plateforme,
 * ou acteurs d'une page comparative), et
 * `apresEssentiel` (fiche d'identité, annuaire) s'insère juste après « L'essentiel ».
 */
export function Corps({
  html,
  plateforme,
  figures = [],
  insertion,
  acteurs = [],
}: {
  html: string;
  plateforme: Plateforme | null;
  /** Page comparative : acteurs dans l'ordre de l'article. */
  acteurs?: Concurrent[];
  figures?: Figure[];
  insertion?: ReactNode;
}) {
  const [tete, reste] = insertion ? apresEssentiel(html) : ["", html];
  const morceaux: ReactNode[] = [];
  let dernier = 0;
  for (const m of reste.matchAll(MARQUEUR)) {
    morceaux.push(<Html key={`h${dernier}`} html={reste.slice(dernier, m.index)} />);
    if (m[1] === "figure") {
      // Une figure absente du champ `figures` : marqueur ignoré.
      const f = figures.find((x) => x.id === m[2]);
      if (f)
        morceaux.push(
          <div key={`f${m.index}`} dangerouslySetInnerHTML={{ __html: figureHtml(f) }} />,
        );
    } else {
      const Bloc = BLOCS[m[2]];
      const BlocComparatif = BLOCS_COMPARATIF[m[2]];
      if (Bloc && plateforme) morceaux.push(<Bloc key={`b${m.index}`} p={plateforme} />);
      else if (BlocComparatif && acteurs.length)
        morceaux.push(<BlocComparatif key={`b${m.index}`} acteurs={acteurs} />);
    }
    dernier = m.index! + m[0].length;
  }
  morceaux.push(<Html key="fin" html={reste.slice(dernier)} />);
  // Conteneur unique : il porte la timeline de la barre de lecture (pleine avant la FAQ).
  return (
    <div className="ress-flux">
      <Html html={tete} />
      {insertion}
      {morceaux}
    </div>
  );
}
