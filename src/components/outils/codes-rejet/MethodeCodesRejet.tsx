// Texte de méthode du hub /outils/codes-rejet (textes.md § 1.6), écrit à partir des seules sources
// de outils-nuit/A/sources.md. L'identifiant de la source suit chaque section, en commentaire.
import { LienOutil, SectionOutil } from "@/components/outils/socle";
import type { Suivre } from "@/lib/outils/socle/suivi";
import { LIEN_MUTUELLE } from "@/lib/outils/codes-rejet/textes";

export function MethodeCodesRejet({ suivre }: { suivre: Suivre }) {
  return (
    <>
      {/* cdc-noemie-ps-2004 ; sources.md, « Règles appliquées » */}
      <SectionOutil id="lire" titre="Comment lire un code rejet">
        <p>
          Quand la caisse ne peut pas payer une facture en l’état, votre retour NOEMIE l’indique par
          un code et un libellé. Le cahier des charges NOEMIE des professionnels de santé prévoit,
          pour chaque rejet, une codification, un libellé en clair, le niveau visé (la facture, une
          ligne ou un «&nbsp;code affiné&nbsp;») et la part en cause, obligatoire ou complémentaire.
          Les mémos des caisses écrivent le code sur 7&nbsp;chiffres (0450054), parfois en deux
          groupes (0450 054) ou sans le zéro du début (450054)&nbsp;: c’est le même code, et la
          recherche accepte les trois écritures.
        </p>
      </SectionOutil>

      {/* ameli-medecin-rejets-2026, ameli-pharmacien-retour-noemie-2022,
          ameli-pharmacien-fse-mode-emploi-2021, gie-cdc-annexe1b-2025 */}
      <SectionOutil id="pas-un-rejet" titre="Ce qui n’est pas un rejet">
        <p>
          «&nbsp;Traitement caisse&nbsp;» n’est pas un rejet&nbsp;: la caisse étudie la facture, et
          un second retour dira si elle est payée ou rejetée. Ne la renvoyez pas en attendant, ce
          serait un doublon. L’ARL (accusé de réception logique) répond au lot télétransmis, pas à
          chaque facture&nbsp;: négatif, le lot n’a pas été pris en charge&nbsp;; ameli.fr conseille
          alors un nouvel essai, puis de contacter la caisse. En mode dégradé, il n’y a pas d’ARL.
        </p>
      </SectionOutil>

      {/* cpam33-laboratoires-2018, cpam38-pharmaciens-2023 ; sources.md, « Pièges relevés » */}
      <SectionOutil id="fait-foi" titre="Pourquoi le libellé de votre retour fait foi">
        <p>
          Un même code peut porter deux textes. Le code 0450072 s’écrit «&nbsp;DIVERGENCE VITALE/EXO
          BDO ABSENTE&nbsp;» dans le mémo 2018 de la CPAM de la Gironde, et «&nbsp;Situation
          d’exonération inconnue pour ce bénéficiaire&nbsp;» dans celui de la CPAM de l’Isère en
          2023&nbsp;: le sens est le même, les mots changent. Les libellés de cette liste viennent
          de caisses du régime général&nbsp;; un autre régime (MSA, régimes spéciaux) peut employer
          d’autres textes. Chaque page donne donc la caisse, la date du document et les autres
          libellés relevés pour le même code.
        </p>
      </SectionOutil>

      {/* sources.md, « Pièges relevés » et « Ce qui manque » */}
      <SectionOutil id="numero-court" titre="Un numéro court n’est pas un code NOEMIE">
        <p>
          Des numéros comme «&nbsp;153&nbsp;» ou «&nbsp;159&nbsp;» circulent sur le web. Aucun ne
          figure dans les documents officiels lus&nbsp;: dans les mémos des caisses, un code rejet
          NOEMIE s’écrit sur 7&nbsp;chiffres. Un numéro court est souvent un code tronqué ou propre
          à un logiciel. Cherchez un mot du libellé, ou demandez la table à votre éditeur&nbsp;:
          nous n’avons trouvé aucune table complète des codes qui soit publique.
        </p>
      </SectionOutil>

      {/* sources.md, « Ce qui manque » */}
      <SectionOutil id="part-mutuelle" titre={"Et la part mutuelle\u00a0?"}>
        <p>
          Les motifs de rejet des complémentaires et de leurs plateformes s’affichent dans leurs
          portails&nbsp;: nous n’en avons trouvé aucune table publique. Pour un rejet de la part
          mutuelle, partez du portail de la complémentaire.
        </p>
        <div className="mt-4">
          <LienOutil id="mutuelle-portail" texte={LIEN_MUTUELLE} suivre={suivre} de="hub" />
        </div>
      </SectionOutil>
    </>
  );
}
