# Pharmacies

Fiche métier chargée par le moteur pour les entrées dont `verticales` vaut `pharmacie` seul.

## Lecteur

**Lecteur :** le titulaire ou le préparateur qui suit le tiers payant d'une officine.

- Au comptoir puis au back-office : préparateur, pharmacien adjoint, personne chargée des retours et des rejets.
- Rôle « Gérant » dans la file : le titulaire, qui regarde les créances de tiers payant et la balance âgée.
- Il connaît son métier : inutile d'expliquer ce qu'est une ordonnance ou un générique.

## Vocabulaire et sigles

- LGO (logiciel de gestion d'officine), ordonnance, délivrance, générique, tiers payant contre génériques.
- AMO, AMC, part obligatoire, part complémentaire, tiers payant, dispense d'avance.
- FSE, lot, ARL (accusé de réception logique), NOEMIE, retour, rejet, bordereau, balance âgée, créances.
- Carte Vitale exigée pour le tiers payant ; exceptions (AME, nourrissons de moins de 3 mois, résidents d'EHPAD, demandeurs d'asile).

## Situations et irritants

- Des rejets traités à la main, un par un.
- Une balance âgée qui grossit sans qu'on sache quoi relancer.
- Des paiements attendus non reçus, sans alerte.
- La peur d'empiler les outils et les ressaisies à côté du LGO : ne rien promettre d'intégré.

## Sources officielles autorisées

Statut relevé le 3 novembre 2026 (cocon v5, section 8). Seulement ces pages, ou une page officielle du même site dont tu es certain qu'elle existe.

- https://www.ameli.fr/pharmacien/exercice-professionnel/pratique-tiers-payant/modalites-regles-facturation — carte Vitale exigée pour le tiers payant depuis juin 2025 et ses exceptions (confirmé).
- https://www.ameli.fr/pharmacien/exercice-professionnel/teletransmission/teletransmission/teletransmission-fse-mode-emploi — télétransmission des FSE, ARL, réémission après un ARL négatif.
- https://www.legifrance.gouv.fr/loda/article_lc/LEGIARTI000047790267 — texte de référence sur l'ARL (pharmacie).
- https://www.ameli.fr/pharmacien/exercice-professionnel/pratique-tiers-payant/tiers-payant-generiques — tiers payant contre génériques.
- https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000006746783 — R161-47 : FSE sous 8 jours ouvrés en dispense d'avance ; FSE et ARL conservés 90 jours au moins (confirmé).
- https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000054733581 — décret n° 2026-809 (participation de l'assuré en 2027 ; taux non fixé : ne rien chiffrer).

Ne pas écrire tel quel : le paiement AMO « en 4 jours ouvrés », l'extension du tiers payant contre génériques au 1er septembre 2026, l'article 32 du PLFSS 2027 (non voté) : au conditionnel ou pas du tout.

## Ce que Granit fait pour ce métier

<!-- À VALIDER PAR PAUL -->

Formuler comme une offre, jamais comme un résultat : Granit peut prendre en charge vos rejets et vos demandes de prise en charge.

- Granit peut reprendre les rejets et les retours de tiers payant : lecture du motif, correction, nouvel envoi.
- Granit peut envoyer les demandes de prise en charge aux complémentaires et suivre leur réponse.
- Granit peut aussi proposer le tiers payant pour l'officine.

Aucun client, aucun chiffre, aucun résultat dans ce métier : pas de « nos agents traitent », pas de « dans les dossiers que nous traitons ». Les données `granitData` de la file viennent d'un autre métier : ne les utilise pas.

## Ne jamais promettre

- Une officine cliente, un volume de dossiers, un gain de temps, un taux de rejet ou un montant récupéré.
- « Branché en 48 h », ou tout délai de mise en place.
- Une intégration avec un LGO, ou la fin des ressaisies.
- Un délai de paiement de la caisse ou d'une mutuelle.

## Encart final

```json
{
  "titre": "Vos rejets et vos prises en charge, repris pour vous",
  "fin": "Les rejets et les demandes de prise en charge de l'officine, Granit peut s'en occuper.",
  "texteFin": "Votre équipe garde le comptoir. Granit peut reprendre vos rejets, envoyer vos demandes de prise en charge et suivre les réponses.",
  "etapes": [
    "Vous nous montrez vos rejets et votre balance âgée",
    "On regarde ensemble ce qui peut être repris",
    "Vous décidez de ce que Granit prend en charge"
  ],
  "rassure": "Démo de 20 min · sans engagement"
}
```

## Règles de relecture

- Lecteur : un titulaire ou un préparateur d'officine qui bloque sur un rejet, un retour NOEMIE ou une créance.
- Les règles d'ARL viennent de sources pharmacie : ne pas les généraliser aux autres professions.
- Aucun mot d'un autre métier dans les exemples (verres, montures, appareils auditifs, prothèse dentaire).

## Signature

```json
{ "auteur": "laura", "relecteur": "olivier" }
```
