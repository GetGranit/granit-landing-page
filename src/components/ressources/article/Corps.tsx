import type { ReactNode } from "react";
import type { Plateforme } from "@/lib/ressources/types";
import { BLOCS } from "./BlocsPlateforme";

const MARQUEUR = /<div\s+data-bloc=["']([a-z]+)["']\s*>\s*<\/div>/g;

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
 * seuls les marqueurs data-bloc sont remplacés par les blocs du fichier de faits, et
 * `apresEssentiel` (fiche d'identité, annuaire) s'insère juste après « L'essentiel ».
 */
export function Corps({
  html,
  plateforme,
  insertion,
}: {
  html: string;
  plateforme: Plateforme | null;
  insertion?: ReactNode;
}) {
  const [tete, reste] = insertion ? apresEssentiel(html) : ["", html];
  const morceaux: ReactNode[] = [];
  let dernier = 0;
  for (const m of reste.matchAll(MARQUEUR)) {
    morceaux.push(<Html key={`h${dernier}`} html={reste.slice(dernier, m.index)} />);
    const Bloc = BLOCS[m[1]];
    if (Bloc && plateforme) morceaux.push(<Bloc key={`b${m.index}`} p={plateforme} />);
    dernier = m.index! + m[0].length;
  }
  morceaux.push(<Html key="fin" html={reste.slice(dernier)} />);
  return (
    <>
      <Html html={tete} />
      {insertion}
      {morceaux}
    </>
  );
}
