# Centres de santé et ophtalmologie

Fiche métier chargée par le moteur pour les entrées dont `verticales` vaut `centres` seul (centres de santé médicaux, polyvalents, centres d'ophtalmologie).

## Lecteur

**Lecteur :** la personne de l'accueil et de la facturation d'un centre de santé ou d'un centre d'ophtalmologie.

- Agent d'accueil, chargée de facturation, coordinatrice, responsable administratif.
- Rôle « Gérant » dans la file : la direction du centre ou du groupe multi-sites, qui suit le recouvrement et le coût de la gestion.
- Il connaît son métier : inutile d'expliquer ce qu'est une consultation ou un orthoptiste.

## Vocabulaire et sigles

- Centre de santé (L6323-1 CSP), gestionnaire, accord national des centres de santé, rémunération forfaitaire, agrément ARS.
- Tiers payant obligatoire sur la part AMO, pas de dépassement d'honoraires, dispense d'avance de frais.
- AMO, AMC, C2S, AME, tiers payant intégral, Inter-AMC, DRE.
- FSE, SESAM-Vitale, mode dégradé, ARL, NOEMIE, rejet, retour, lettrage.
- Ophtalmologie : consultation, actes CCAM, orthoptie, filière visuelle.

## Situations et irritants

- Des rejets non suivis ; un gérant sans visibilité sur ce qui reste dehors.
- Des envois souvent en mode dégradé, alors que la caisse regarde de près quelle carte facture quoi.
- Un coût jugé élevé du couple logiciel + société de gestion, pour un récapitulatif trimestriel et aucun pilotage des impayés.
- Un prestataire qui ne traite pas les rejets ; un gérant qui exerce à côté et n'a pas le temps.
- Un conventionnement mutuelle par mutuelle long et papier.

## Sources officielles autorisées

Statut relevé le 3 novembre 2026 (cocon v5, section 8). Seulement ces pages, ou une page officielle du même site dont tu es certain qu'elle existe.

- https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000047567936 — L6323-1-7 CSP : tiers payant sur la part AMO et pas de dépassement en centre de santé (confirmé, en vigueur depuis le 21 mai 2023).
- https://www.ameli.fr/exercice-coordonne/textes-reference/accord-national/accord-national-centres-sante — accord national des centres de santé (confirmé : signé le 28 août 2025, réputé approuvé le 1er octobre 2025).
- https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000052391780 — même accord au Journal officiel du 15 octobre 2025.
- https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000047567907 — agrément ARS de l'ophtalmologie, de l'orthoptie et du dentaire en centre de santé (confirmé).
- https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000047561943 — loi du 19 mai 2023 (agrément ; centres existants agréés avant le 21 novembre 2025).
- https://www.tpcomplementaire.fr/iamcps/telechargerDocument?filename=CSTE-SPECIMEN.pdf — contrat Inter-AMC, spécimen « Centre de santé » : paiement sous 7 jours ouvrés après une DRE conforme. Engagement contractuel, pas règle légale.
- https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000006746783 — R161-47 : FSE sous 8 jours ouvrés en dispense d'avance (confirmé).
- https://www.ameli.fr/medecin/exercice-liberal/facturation-remuneration/tiers-payant-modalites-regles-facturation/tiers-payant-modalites-regles-facturation — modalités du tiers payant.
- https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000054733581 — décret n° 2026-809 (participation de l'assuré en 2027 ; taux non fixé : ne rien chiffrer).

Ne pas écrire tel quel : « FSE sécurisée, mode de facturation privilégié » (absent de la page ameli) ; « C2S et AME : tiers payant intégral par la caisse » (la part complémentaire de la C2S peut être gérée par un organisme choisi par l'assuré).

## Ce que Granit fait pour ce métier

<!-- À VALIDER PAR PAUL -->

Formuler comme une offre, jamais comme un résultat : Granit peut prendre en charge vos rejets et vos demandes de prise en charge.

- Granit peut reprendre les rejets Sécurité sociale et mutuelle : lecture du motif, correction, nouvel envoi.
- Granit peut envoyer les demandes de prise en charge aux complémentaires et suivre leur réponse.
- Granit peut aussi proposer le tiers payant pour le centre.

Aucun client, aucun chiffre, aucun résultat dans ce métier : pas de « nos agents traitent », pas de « dans les dossiers que nous traitons ». Les données `granitData` de la file viennent d'un autre métier : ne les utilise pas.

## Ne jamais promettre

- Un centre client, un volume de dossiers, un gain de temps, un taux de rejet ou un montant récupéré.
- « Branché en 48 h », ou tout délai de mise en place.
- Une intégration avec un logiciel de centre précis.
- Un effet sur la rémunération forfaitaire ou sur un contrôle de la caisse.

## Encart final

```json
{
  "titre": "Vos rejets et vos prises en charge, repris pour vous",
  "fin": "Les rejets et les demandes de prise en charge du centre, Granit peut s'en occuper.",
  "texteFin": "Votre équipe garde l'accueil. Granit peut reprendre vos rejets, envoyer vos demandes de prise en charge et suivre les réponses.",
  "etapes": [
    "Vous nous montrez ce qui reste dehors",
    "On regarde ensemble ce qui peut être repris",
    "Vous décidez de ce que Granit prend en charge"
  ],
  "rassure": "Démo de 20 min · sans engagement"
}
```

## Règles de relecture

- Lecteur : l'accueil ou la facturation d'un centre de santé, ou sa direction, qui bloque sur un rejet ou un impayé.
- Un centre de santé n'a pas de dépassement d'honoraires : ne jamais en donner un exemple.
- Aucun mot d'un autre métier dans les exemples (verres, montures, appareils auditifs, officine).

## Signature

```json
{ "auteur": "laura", "relecteur": "olivier" }
```
