// Le texte de méthode du hub (textes.md § 1.6, environ 340 mots) : d'où viennent les données et
// comment les lire. Chaque affirmation vient d'une source de sources.md.
import { SectionOutil } from "@/components/outils/socle";

export function MethodeHub() {
  return (
    <>
      <SectionOutil id="de-la-carte-au-portail" titre="De la carte au portail" className="mt-0">
        <p>
          La carte de tiers payant du patient désigne l’opérateur de chaque prestation&nbsp;: c’est
          elle qui tranche. Elle peut le nommer ou porter son logo, comme le spécimen de carte Aésio
          de 2025 («&nbsp;PEC optique, audio, dentaire et hospitalisation&nbsp;:
          almerys.com&nbsp;»), ou un code par catégorie de soins&nbsp;: sur la carte Groupama,
          chaque catégorie (OPTI, PHAR, HOSP…) porte un code de mode de gestion. Pour SP santé,
          seules les dépenses qui portent la mention «&nbsp;SP&nbsp;» sur l’attestation passent par
          lui.
        </p>
      </SectionOutil>
      <SectionOutil id="deux-portails" titre="Pourquoi deux portails pour une même mutuelle">
        <p>
          Une complémentaire peut confier chaque métier à un opérateur différent&nbsp;: dans les
          listes publiques relevées le 18/11/2026, la Mutuelle de Poitiers Assurances figure chez SP
          santé pour l’optique, le dentaire et la pharmacie, et chez iSanté pour les cliniques. La
          date compte aussi&nbsp;: la MGEN est chez Viamedis en optique et en audio depuis le
          27/10/2026, et iVoirNet annonce le reste de son tiers payant chez Viamedis au 30/11/2026.
        </p>
      </SectionOutil>
      <SectionOutil id="operateur-ou-reseau" titre="Opérateur ou réseau de soins">
        <p>
          Un opérateur de tiers payant reçoit la demande de prise en charge et paie le
          professionnel&nbsp;: SP santé, iSanté, Viamedis, Almerys. Un réseau de soins regroupe des
          professionnels partenaires aux tarifs négociés&nbsp;: Kalixia, Itelis, Sévéane. Kalixia
          n’est pas un portail de prise en charge&nbsp;: pour la Mutuelle RATP, la demande passe par
          Viamedis, opticien partenaire Kalixia ou non. Santéclair, Carte Blanche Partenaires et
          Actil font les deux.
        </p>
      </SectionOutil>
      <SectionOutil id="comment-ce-releve-est-fait" titre="Comment ce relevé est fait">
        <p>
          L’annuaire reprend les listes publiques de SP santé et d’iSanté, qui donnent pour chaque
          complémentaire un libellé, un numéro AMC et les métiers ouverts, avec leurs dates&nbsp;;
          elles sont mises à jour à chaque ouverture ou fermeture d’un segment. Il y ajoute les
          pages des complémentaires et la presse professionnelle, datées. Un métier n’est affiché
          comme relevé que si une source publique datée nomme l’opérateur pour ce métier&nbsp;;
          sinon, il est marqué «&nbsp;à confirmer sur la carte&nbsp;». Les autres opérateurs, dont
          Viamedis et Almerys, ne publient pas de liste de leurs clients par métier.
        </p>
      </SectionOutil>
    </>
  );
}
