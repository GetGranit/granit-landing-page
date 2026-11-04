# Cliniques et laboratoires

Fiche métier chargée par le moteur pour les entrées dont `verticales` vaut `cliniques`, `laboratoires`, ou les deux.

## Lecteur

**Lecteur :** la personne du bureau des entrées d'une clinique privée, ou de l'accueil et de la facturation d'un laboratoire de biologie.

- Clinique : agent du bureau des entrées, responsable de la facturation, direction administrative.
- Laboratoire : secrétaire d'accueil, gestionnaire de facturation, biologiste responsable.
- Rôle « Gérant » dans la file : la direction administrative et financière.
- Il connaît son métier : inutile d'expliquer ce qu'est un séjour ou un prélèvement.

## Vocabulaire et sigles

- Clinique : admission, séjour, demande de prise en charge hospitalière, engagement de paiement, n° FINESS, code DMT, forfait journalier, chambre particulière, norme B2, ROC (IDB, SIM, CLC).
- Laboratoire : dossier d'admission, concentrateur, télétransmission, rejets FSE, retours NOEMIE, lettrage des paiements, facturation B2B aux cliniques et hôpitaux.
- AMO, AMC, part obligatoire, part complémentaire, tiers payant.

## Situations et irritants

- Clinique : demande de prise en charge à envoyer à la mutuelle ou à son opérateur, engagement de paiement à attendre avant la sortie.
- Laboratoire : le tiers payant mutuelle est en général réglé ; la douleur est ailleurs : ressaisie des dossiers à l'admission, rejets FSE répétitifs qui saturent les équipes en période de congés, retours NOEMIE, droits mutuelle non vérifiés à l'accueil, paiements pointés à la main.

## Sources officielles autorisées

Statut relevé le 3 novembre 2026 (cocon v5, section 8). Seulement ces pages, ou une page officielle du même site dont tu es certain qu'elle existe.

- https://www.ameli.fr/assure/remboursements/reste-charge/forfait-hospitalier — forfait journalier de 23 €, 17 € en psychiatrie, depuis le 1er mars 2026, dû aussi le jour de sortie (confirmé).
- https://www.sesam-vitale.fr/roc-es — dispositif ROC pour les établissements.
- https://sante.gouv.fr/professionnels/gerer-un-etablissement-de-sante-medico-social/performance-des-etablissements-de-sante/simphonie/article/roc-le-remboursement-des-organismes-complementaires — ROC, programme SIMPHONIE.
- https://www.fhpmco.fr/2025/07/21/roc-place-aux-cliniques-et-hopitaux-prives/ — ROC en clinique privée : 2 établissements pilotes à la rentrée 2025, montée en charge seulement « envisageable » à partir de septembre 2026, sans obligation.
- https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000006746783 — R161-47 : FSE sous 8 jours ouvrés en dispense d'avance (confirmé).
- https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000054733581 — décret n° 2026-809 (participation de l'assuré en 2027 ; taux non fixé : ne rien chiffrer).

Ne pas écrire tel quel : « ROC étendu aux cliniques, montée en charge en septembre 2026 » comme un fait ; la chambre particulière (R162-27 CSS) et Mon test IST (non confirmés) ; la couverture du forfait journalier par le contrat responsable (non confirmée).

## Ce que Granit fait pour ce métier

<!-- À VALIDER PAR PAUL -->

Formuler comme une offre, jamais comme un résultat : Granit peut prendre en charge vos rejets et vos demandes de prise en charge.

- Granit peut reprendre les rejets FSE et les retours NOEMIE : lecture du motif, correction, nouvel envoi.
- Granit peut envoyer les demandes de prise en charge aux complémentaires et suivre leur réponse.
- Granit peut aussi proposer le tiers payant pour l'établissement.

Aucun client, aucun chiffre, aucun résultat dans ce métier : pas de « nos agents traitent », pas de « dans les dossiers que nous traitons ». Les données `granitData` de la file viennent d'un autre métier : ne les utilise pas.

## Ne jamais promettre

- Un établissement client, un volume de dossiers, un gain de temps, un taux de rejet ou un montant récupéré.
- « Branché en 48 h », ou tout délai de mise en place.
- Une intégration avec un logiciel d'admission, un SIH ou un SGL précis.
- Un calendrier ROC.

## Encart final

```json
{
  "titre": "Vos rejets et vos prises en charge, repris pour vous",
  "fin": "Les rejets et les demandes de prise en charge, Granit peut s'en occuper.",
  "texteFin": "Votre équipe garde l'accueil. Granit peut reprendre vos rejets, envoyer vos demandes de prise en charge et suivre les réponses.",
  "etapes": [
    "Vous nous montrez vos rejets et vos retours en attente",
    "On regarde ensemble ce qui peut être repris",
    "Vous décidez de ce que Granit prend en charge"
  ],
  "rassure": "Démo de 20 min · sans engagement"
}
```

## Règles de relecture

- Lecteur : le bureau des entrées d'une clinique ou l'accueil d'un laboratoire, qui bloque sur une prise en charge, un rejet ou un retour.
- En laboratoire, ne pas présenter le tiers payant mutuelle comme un problème : l'angle est le rejet FSE et le retour NOEMIE.
- Aucun mot d'un autre métier dans les exemples (verres, montures, appareils auditifs, officine, prothèse dentaire).

## Signature

```json
{ "auteur": "laura", "relecteur": "olivier" }
```
