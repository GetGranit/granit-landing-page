# Outil B · Remboursement — formules de calcul

Date : 18/11/2026. Chaque règle porte sa source (identifiants de `donnees.json` → `sources`).
Une règle marquée **à vérifier** n'est pas sourcée assez précisément : l'outil ne doit pas l'afficher.

## 1. Les quatre montants de base

| Montant | Formule | Source |
|---|---|---|
| Base de remboursement (BR) | Lue telle quelle dans la base officielle du code : champ `TARIF` de la ligne d'historique LPP en vigueur (optique, audio) ; colonne « Base de remboursement » du tableau ameli des honoraires limites (dentaire prothétique) ; « tarif conventionnel » ameli (soins dentaires) ; prix public TTC hors honoraire, ou TFR s'il y en a un en vigueur (médicament) | `lpp-cnam-v910`, `ameli-dentiste-tarifs-hlf`, `ameli-assure-soins-dentaires`, `bdpm-cis-cip`, `bdmit-cnam` |
| Remboursé par la Sécu | `rembourse_secu = BR × taux_secu`, arrondi au centime | Assurance Maladie, page « Actes techniques de la CCAM » (assurance-maladie.ameli.fr/etudes-et-donnees/actes-techniques-ccam, lue le 18/11/2026) : « le montant remboursé est égal à la base de remboursement multipliée par le taux de remboursement » ; exemples chiffrés de `ameli-taux` (23 € × 60 % = 13,80 €) |
| Ticket modérateur (TM) | `ticket_moderateur = BR − rembourse_secu` (soit BR × (100 % − taux)) | `css-r160-5-2026` : la « participation de l'assuré » est fixée en pourcentage par l'Uncam dans les limites de l'article ; `ameli-taux` |
| Taux Sécu au 18/11/2026 | optique 60 %, aides auditives 60 %, chirurgien-dentiste 60 %, médicaments 100 / 65 / 30 / 15 % selon le médicament (lu par CIP dans la BDPM, pas supposé) | `ameli-taux` (30/09/2026), `bdpm-cis-cip`, `bdmit-cnam` |

Cas particuliers non calculés par l'outil (taux différent, à ne pas afficher comme cas général) :
ALD exonérante, Complémentaire santé solidaire, AT/MP, maternité, régime local d'Alsace-Moselle,
régime des Mines (ameli publie des tableaux à part). Si l'outil propose ces cas, il faut une source par cas.

## 2. Ce qui reste à la complémentaire

### Hors 100 % Santé (classe B, classe II, panier libre, soins dentaires, médicaments)

- Le contrat responsable doit prendre en charge **l'intégralité du ticket modérateur** (R871-2, 1°),
  **sauf** pour les prestations des 6°, 7°, 10° et 14° de R160-5 : médicaments à SMR modéré (30 %),
  homéopathie, cures thermales, médicaments à SMR faible (15 %). Source : `css-r871-2`.
  → Pour un médicament à 30 % ou 15 %, la prise en charge du TM par la complémentaire **dépend du contrat** :
  l'outil ne doit pas l'annoncer comme acquise.
- Au-delà de la BR, la prise en charge dépend du contrat, dans les plafonds du contrat responsable :
  - optique (hors classe A) : planchers / plafonds par équipement (2 verres + 1 monture), tous les deux ans
    sauf renouvellement anticipé, **part Sécu et TM compris** : verres unifocaux simples 50-420 € ; unifocal simple + complexe
    125-560 € ; unifocaux complexes 200-700 € ; unifocal simple + multifocal/progressif complexe 125-610 € ;
    complexe + multifocal/progressif complexe 200-750 € ; multifocaux ou progressifs complexes 200-800 € ;
    **monture : 100 € maximum** (R871-2, 3°, version du 28/11/2025). Source : `css-r871-2`.
    **À vérifier avant affichage** : la correspondance entre ces catégories (« simples », « complexes ») et
    les codes LPP n'est pas donnée par R871-2 ; elle ne doit pas être déduite par l'outil.
  - aides auditives classe II : **1 700 € maximum par aide auditive**, part Sécu et TM compris, par période de 4 ans
    (R871-2, 4°). Source : `css-r871-2`.
  - prothèses dentaires hors 100 % Santé : selon le contrat ; panier maîtrisé : honoraire plafonné par l'honoraire
    limite de facturation (HLF), reste à charge selon le contrat. Source : `ameli-dentiste-tarifs-hlf`.
- Formule affichable : `reste_apres_secu = prix_facture − rembourse_secu`. La part complémentaire réelle
  dépend du contrat ; l'outil peut seulement donner le **minimum dû par un contrat responsable**
  (le TM, quand R871-2 l'impose) et les **plafonds** ci-dessus.

### Panier 100 % Santé (optique classe A, audio classe I, dentaire « sans reste à charge »)

- Prix plafonné : le professionnel ne peut pas facturer au-delà du **prix limite de vente** (PLV, LPP) ou de
  l'**honoraire limite de facturation** (HLF, dentaire). Sources : `lpp-cnam-v910` (champ `PUREGLEMEN`),
  `ameli-optique`, `ameli-audio`, `ameli-dentiste-tarifs-hlf`.
- Le contrat responsable prend en charge les frais exposés **en sus de la BR dans la limite du PLV** (optique, audio,
  R871-2 3° et 4°) ou **dans la limite des HLF** (prothèses dentaires des actes définis par arrêté, R871-2 5°),
  en plus du TM (R871-2 1°). Le tiers payant s'applique au moins jusqu'à ces prix (L871-1). Sources : `css-r871-2`, `css-l871-1`.
- Donc, pour un patient en contrat responsable, si le prix facturé = PLV (ou HLF) :
  `part_complementaire_au_prix_limite = prix_limite − rembourse_secu` et **reste à charge patient = 0**.
  Si le prix facturé est inférieur au PLV : part complémentaire = `prix_facture − rembourse_secu`.
  C'est ce que `donnees.json` appelle `part_complementaire_au_prix_limite` (renseigné seulement pour les entrées 100 % Santé).
- Exemple (lu, pas inventé) : verre unifocal classe A, sphère ]0 ; −2,00] (LPP 2263287) : BR 9,75 €, PLV 32,50 € ;
  Sécu 9,75 × 60 % = 5,85 € ; TM 3,90 € ; complémentaire au PLV 32,50 − 5,85 = 26,65 €.
- Sans complémentaire, ou avec un contrat non responsable, le 100 % Santé ne garantit pas le reste à charge nul :
  l'outil doit le dire (ameli : « intégralement pris en charge par l'Assurance Maladie et la complémentaire santé »).

## 3. Participation forfaitaire et franchises

| Somme | Montant (lu) | Où elle s'applique | Qui la paie | Complémentaire responsable | Source |
|---|---|---|---|---|---|
| Franchise médicale | 1 € par boîte de médicament ; 1 € par acte paramédical (4 €/jour max) ; 4 € par transport (8 €/jour max) ; **plafond 70 € par an et par personne** | médicaments remboursables (allopathie, préparations magistrales) ; pas les dispositifs LPP (« les pansements ne sont pas des médicaments ») | l'assuré : déduite du remboursement Sécu, ou récupérée plus tard en tiers payant | **ne la couvre pas** (L871-1 : les contrats « ne couvrent pas la participation forfaitaire et la franchise ») | `ameli-franchise` (29/09/2026), `css-l871-1` |
| Participation forfaitaire | 2 € | consultations et actes des **médecins** ; ne s'applique **pas** aux chirurgiens-dentistes ; exonérations (moins de 18 ans, C2S, AME, grossesse à partir du 6e mois) | l'assuré | **ne la couvre pas** | `ameli-taux`, `ameli-assure-soins-dentaires`, `css-l871-1` |

Pour l'outil :
- **Optique, audio** : ni franchise ni participation forfaitaire dans les sources lues → ne rien retrancher.
  (À vérifier si l'on veut l'écrire en toutes lettres : aucune source lue ne dit explicitement « pas de franchise sur la LPP »,
  ameli dit seulement que la franchise vise médicaments, actes paramédicaux et transports.)
- **Dentaire** : pas de participation forfaitaire (ameli). Pas de franchise (non listé par ameli). Même réserve.
- **Pharmacie** : `rembourse_secu` affiché = montant **avant** franchise. Afficher à côté : « 1 € de franchise est déduit
  du remboursement Sécu (sauf exonération), la mutuelle ne la rembourse pas ». Ne pas soustraire automatiquement :
  le plafond annuel de 70 € et les exonérations dépendent du patient.
- Plafond annuel de la participation forfaitaire : ameli donne 50 € par an sur une page de février 2026
  (`ameli-assure-soins-dentaires`) ; des sources secondaires parlent d'un plafond porté à 70 € au 01/10/2026.
  **À vérifier** : ne pas afficher de plafond de participation forfaitaire.

## 4. Médicaments : base de remboursement

- `base_remboursement` = prix public TTC hors honoraire (BDPM « prix du médicament », identique au « Prix Public TTC »
  de la fiche BdM_IT), sauf TFR en vigueur pour le CIP (fiche BdM_IT, tableau « CIP appartenant à un groupe à TFR ») :
  alors BR = montant du TFR. Sources : `bdpm-cis-cip`, `bdmit-cnam`, exemple `ameli-taux` (boîte à 6 € × 65 % = 3,90 €).
- L'**honoraire de dispensation à la boîte** (BDPM : 1,02 € sur les présentations retenues) est affiché à part
  (`honoraire_dispensation_boite`). Le « prix public » BDPM = prix + honoraire.
  **À vérifier** : le taux de prise en charge de l'honoraire de dispensation (R160-5 lie l'honoraire de dispensation
  au taux des médicaments à SMR modéré / faible / homéopathie, et prévoit une fourchette propre aux autres honoraires de
  dispensation) n'a pas été lu de façon assez précise : l'outil ne doit pas calculer de remboursement sur l'honoraire.
- Les autres honoraires du pharmacien (ordonnance, âge, médicaments spécifiques…) ne sont pas dans la BDPM : non traités.

## 5. Ce qui change au 01/01/2027 (formules à paramétrer, pas à appliquer)

Les décrets n° 2026-809, 2026-810 et 2026-811 du 21/08/2026 (JO du 22/08/2026) modifient **les fourchettes** de R160-5
au 01/01/2027 ; le taux exact est fixé ensuite par l'Uncam (ou par arrêté). Sources : `decret-2026-809`, `decret-2026-810`,
`decret-2026-811`, `css-r160-5-2027`.

| Poste | Participation de l'assuré 2026 (fourchette) | 2027 (fourchette) | Taux Sécu 2026 (ameli) | Taux Sécu 2027 possible |
|---|---|---|---|---|
| Chirurgiens-dentistes (R160-5 3° bis) | 35-45 % | 50-60 % | 60 % | 40 à 50 % |
| Produits et prestations LPP : optique, aides auditives (8°) | 40-50 % | 50-60 % | 60 % | 40 à 50 % |
| Médicaments SMR modéré + leur honoraire de dispensation (6°) | 70-75 % | 85-95 % | 30 % | 5 à 15 % |
| Homéopathie (7°) | 85-90 % | 93-97 % | — | 3 à 7 % |
| Médicaments SMR faible + leur honoraire de dispensation (14°) | 80-90 % | 93-97 % | 15 % | 3 à 7 % |

- Aucune décision Uncam ni aucun arrêté fixant ces taux n'a été trouvé dans les JO du 08/11 au 18/11/2026
  (archives DILA, `jorf-dila-novembre-2026`) ; la presse spécialisée indique qu'aucun taux n'était publié début novembre 2026.
- Les BR, PLV et HLF ne changent pas du fait de ces décrets. La base LPP v910 ne contient aucune date d'effet future
  pour l'optique et l'audio.
- 100 % Santé : le RAC nul est maintenu en contrat responsable ; la baisse de la part Sécu passe à la complémentaire
  (`css-r871-2` 1° : le TM est couvert en totalité ; 3°, 4°, 5° : le reste jusqu'au PLV / HLF).
- **Règle pour l'outil** : tant que le taux 2027 n'est pas publié, afficher le taux 2026 et un bandeau « au 01/01/2027,
  la part Sécu baissera (fourchette 40-50 %, taux non encore publié) ». Le jour où le taux est publié : changer la
  constante `TAUX_LPP` / `TAUX_DENTAIRE` de `construire.py`, ajouter la source, regénérer, et dater les deux taux.

## 6. Arrondis

- Arrondi au centime, au plus proche, sur `rembourse_secu` ; `ticket_moderateur = BR − rembourse_secu` (ainsi
  `rembourse_secu + ticket_moderateur = BR` exactement). **À vérifier** : la règle d'arrondi exacte appliquée par
  l'Assurance Maladie à la liquidation n'a pas été lue dans un texte ; les exemples ameli lus sont cohérents
  (23 × 60 % = 13,80 ; 28,92 × 60 % = 17,35 ; 30,74 × 60 % = 18,44).
