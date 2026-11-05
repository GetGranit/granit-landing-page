# Centres dentaires

Fiche métier chargée par le moteur pour les entrées dont `verticales` vaut `dentaire` seul.

## Lecteur

**Lecteur :** l'assistante dentaire ou la secrétaire qui gère le tiers payant d'un cabinet ou d'un centre dentaire.

- Au fauteuil puis à l'accueil : assistante dentaire, assistante orthodontique, secrétaire, coordinatrice de centre.
- Rôle « Gérant » dans la file : le chirurgien-dentiste titulaire ou le gérant du centre, qui arbitre entre tiers payant et risque d'impayé.
- Il connaît son métier : inutile d'expliquer ce qu'est un devis ou une couronne.

## Vocabulaire et sigles

- Devis, plan de traitement, soins conservateurs, prothèse (couronne, bridge, inlay-core), orthodontie (semestres de traitement).
- Paniers 100 % Santé dentaire : reste à charge zéro, reste à charge maîtrisé, tarifs libres ; honoraires limites de facturation.
- AMO, AMC, part obligatoire, part complémentaire, tiers payant intégral, demande de prise en charge (DPEC) auprès de la mutuelle.
- FSE, SESAM-Vitale, DRE (demande de remboursement électronique), Inter-AMC, NOEMIE, rejet, bordereau.
- EBD : examen bucco-dentaire de prévention.

## Situations et irritants

- Le tiers payant limité aux petits soins, par peur des impayés sur la prothèse et les soins lourds.
- Le reste à charge inconnu au moment du devis ; le patient qui repart avec son devis faute de prise en charge.
- Une demande de prise en charge en ligne qui échoue sur un bénéficiaire introuvable alors que les numéros sont bons.
- Un stock de rejets à reprendre avant de pouvoir sécuriser le flux.
- Un conventionnement mutuelle par mutuelle jugé si long que certains cabinets renoncent.
- Les virements rapprochés chaque jour à la main.

## Sources officielles autorisées

Statut relevé le 3 novembre 2026 (cocon v5, section 8). Seulement ces pages, ou une page officielle du même site dont tu es certain qu'elle existe.

- https://www.ameli.fr/chirurgien-dentiste/exercice-liberal/facturation-remuneration/pratique-tiers-payant/tiers-payant-examen-bucco-dentaire-soins — EBD en tiers payant intégral (AMO + AMC) depuis le 1er avril 2025, adhésion Inter-AMC puis 5 jours avant les premières DRE (confirmé). Les soins consécutifs ne sont en tiers payant que pour les 3-24 ans ; pour les femmes enceintes, l'examen seul.
- https://www.tpcomplementaire.fr/iamcps/telechargerDocument?filename=CSTE-SPECIMEN.pdf — contrat Inter-AMC (spécimen « Centre de santé », 24 août 2022) : paiement sous 7 jours ouvrés après une DRE conforme, demande au plus tard 2 ans après les soins. Engagement contractuel, pas règle légale : le dire ainsi.
- https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000047567907 — agrément ARS du dentaire en centre de santé (confirmé).
- https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000006746783 — R161-47 : FSE transmise sous 8 jours ouvrés en dispense d'avance (confirmé ; un dépassement n'entraîne pas de déchéance).
- https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000054733581 — décret n° 2026-809 : participation de l'assuré à 50-60 % au 1er janvier 2027 (confirmé ; taux 2027 non fixé : ne rien chiffrer).
- https://www.service-public.fr/particuliers/vosdroits/F34729 — 100 % Santé.

Ne pas écrire tel quel : la répartition 60 % AMO / 40 % AMC de l'EBD en 2027 (non confirmée) ; un « délai légal de 2 ans pour facturer » (faux : le seul « 2 ans » sûr est contractuel, Inter-AMC).

## Ce que Granit fait pour ce métier

Formuler comme une offre, jamais comme un résultat : Granit peut prendre en charge vos rejets et vos demandes de prise en charge.

- Granit peut reprendre les rejets mutuelle et Sécurité sociale : lecture du motif, correction, nouvel envoi.
- Granit peut envoyer les demandes de prise en charge aux complémentaires et suivre leur réponse.
- Granit peut aussi proposer le tiers payant pour le cabinet ou le centre.

Aucun client, aucun chiffre, aucun résultat dans ce métier : pas de « nos agents traitent », pas de « dans les dossiers que nous traitons ». Les données `granitData` de la file viennent d'un autre métier : ne les utilise pas.

## Ne jamais promettre

- Un client, un cabinet ou un centre équipé, un volume de dossiers, un gain de temps ou un taux de rejet.
- « Branché en 48 h », ou tout délai de mise en place.
- La saisie sur un portail ou un logiciel dentaire précis.
- Que le tiers payant supprime le risque d'impayé sur la prothèse.

## Encart final

```json
{
  "titre": "Vos rejets et vos prises en charge, repris pour vous",
  "fin": "Les rejets et les demandes de prise en charge, Granit peut s'en occuper.",
  "texteFin": "Vous gardez le fauteuil et l'accueil. Granit peut reprendre vos rejets mutuelle, envoyer vos demandes de prise en charge et suivre les réponses.",
  "etapes": [
    "Vous nous montrez vos rejets en attente",
    "On regarde ensemble ce qui peut être repris",
    "Vous décidez de ce que Granit prend en charge"
  ],
  "rassure": "Démo de 20 min · sans engagement"
}
```

## Règles de relecture

- Lecteur : une assistante dentaire ou le titulaire du cabinet, qui bloque sur un devis, un rejet ou une prise en charge mutuelle.
- Aucun mot d'un autre métier dans les exemples (verres, montures, appareils auditifs, ordonnance de lunettes).
- Le panier 100 % Santé dentaire s'écrit avec ses trois paniers, jamais avec ceux d'un autre métier.

## Signature

```json
{ "auteur": "laura", "relecteur": "olivier" }
```
