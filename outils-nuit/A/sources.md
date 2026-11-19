# Outil A · Codes rejet · sources et vérifications

Généré le 18/11/2026. Données : `donnees.json` (même dossier). Scripts : `scripts/extraire_tables.py`,
`scripts/construire_donnees.py` et `scripts/corriger_dev_a.py` (même dossier).

**Tables du GIE SESAM-Vitale tenues hors du dépôt (relecture du 18/11/2026).** Les 83 entrées tirées du cahier des
charges SESAM-Vitale (30 ARL négatifs de l'annexe 1-B, 53 messages de service de l'annexe 4) ne sont plus dans
`donnees.json`, ni la partie des scripts qui les extrait et les rédige : le GIE demande son accord pour toute reproduction,
même partielle (décision de Paul n° 1). Une copie complète est conservée hors du dépôt. Les fiches de ces sources restent
dans `donnees.json` : citer un document n'est pas le reproduire, et la méthode du hub cite l'annexe 1-B.

## En bref

| Famille | Entrées | Sûres | À vérifier | Pages conseillées |
|---|---|---|---|---|
| `noemie` (rejets des retours NOEMIE de l'Assurance Maladie) | 105 | 27 | 78 | 27 |
| `arl` (7 rejets de lot de l’OCT Résopharma ; les 30 ARL négatifs SESAM-Vitale sont hors du dépôt) | 7 | 0 | 7 | 0 |
| `amc-tiers-payant` (rejets de factures complémentaires, OCT Résopharma) | 6 | 0 | 6 | 0 |
| `autre` (OCT Résopharma, abonnement) | 1 | 0 | 1 | 0 |
| **Total dans `donnees.json`** | **119** | **27** | **92** | **27** |
| Hors du dépôt, en attendant l'accord du GIE : 30 ARL négatifs et 53 messages de service, tous sûrs | 83 | 83 | 0 | 15 |

Comptes mis à jour par dev-A le 18/11/2026 après les corrections décrites plus bas (2 entrées NOEMIE passées
« à vérifier »), puis par la relecture (83 entrées du GIE sorties du dépôt).

Ce qui est vraiment utile au comptoir tient dans les **27 codes NOEMIE sûrs** ; viendraient ensuite, avec l'accord du GIE,
**les ARL négatifs** et **4 messages de service** (`page_conseillee: true`). Les 49 autres messages de service sont sûrs
mais très techniques (structure du fichier) : ils serviraient la recherche, pas une page.

## Règles appliquées

- **Libellé** : recopié tel qu'écrit dans le document cité (majuscules, abréviations et fautes comprises, ex. « DEMAMDE »).
  Les autres libellés publiés pour le même code sont dans `libelles_variantes`, avec leur source.
- **Code** : écrit sur 7 chiffres pour NOEMIE (`0450054`). Les documents l'écrivent aussi `0450 054`, `0450-054` ou `450054`
  (zéro de tête omis) : ces formes sont dans `autres_ecritures`. La règle du zéro de tête est confirmée par plusieurs codes vus
  sous les deux formes (0250050/250050, 0450054/450054, 0180051/180051, 0317051/317051, 0100052/100052).
- **Statut `sur`** :
  - NOEMIE : code et libellé lus dans au moins un document CPAM ou ameli.fr **daté de 2016 ou après** (mémos CPAM de la Gironde
    2016 à 2019, mémo établissements 2018, mémo CPAM de l'Isère 2023, pages ameli.fr 2022 et 2026).
  - ARL et messages de service : tables officielles complètes du cahier des charges SESAM-Vitale (version 8.60 du 11/04/2025),
    extraites entièrement par script et vérifiées ligne par ligne contre le texte du PDF (entrées et script tenus hors du
    dépôt, voir plus haut).
- **Statut `a_verifier`** : source ancienne (2009-2015), non datée, propre à un concentrateur, ou libellé ambigu. Voir plus bas.
- **Cause et action** : `cause_action_origine: "source"` quand le document les donne ; sinon formulation prudente et générale,
  marquée `deduit_du_libelle` (cas des codes du lexique 2010 et de Résopharma). Aucune procédure inventée.
- **Métiers** : ceux que vise la source ; « tous » quand le code est commun (droits, doublons, ARL). Les professions exactes
  citées par les sources sont dans `professions_citees_par_les_sources` (infirmiers, médecins… quand le métier cible est déduit).
- **Champs ajoutés au format du brief** (facultatifs) : `libelles_variantes`, `autres_ecritures`, `professions_citees_par_les_sources`,
  `page_conseillee` (contenu suffisant pour une page), `niveau_arl` (lot ou facture), `type_message` (messages de service).
- Prose (explication, cause, action) : vouvoiement, typographie française (apostrophe ’, espaces insécables), pas de tiret long.

## Cohérence avec l'article existant `/ressources/codes-rejets-noemie`

L'article dit : le libellé reçu fait foi, la liste officielle est diffusée aux éditeurs, un code lu ailleurs peut être faux.
Les sources lues le confirment :
- la norme NOEMIE PS (cahier des charges de mai 2004, entité 294 « ligne rejet ») ne contient **aucune table de codes** : chaque
  rejet arrive avec sa codification (10 caractères) **et son libellé** (80 caractères), son niveau (facture, ligne, code affiné)
  et la part concernée (obligatoire ou complémentaire) ;
- deux caisses peuvent publier deux libellés pour un même code (0450072), et des sites tiers publient des codes absents des
  documents officiels ou contradictoires (non retenus).

L'outil ne contredit donc pas l'article s'il affiche, sur chaque page, **la caisse et la date du document cité** et la phrase
« le libellé de votre propre retour fait foi ». Seule la phrase de l'article « cette page ne reproduit aucun code » deviendra
étrange une fois l'outil en ligne : proposer à Paul d'y ajouter un lien vers l'outil (« les libellés publiés par les CPAM,
code par code »).

## Sources

| id | Document | Éditeur | Date du document | Ce qu'on y a pris |
|---|---|---|---|---|
| `ameli-medecin-rejets-2026` | [Les rejets de facturation et les solutions en cas de rejet](https://www.ameli.fr/medecin/exercice-liberal/accompagnement-l-installation/l-accompagnement-dans-la-premiere-annee-d-exercice/les-rejets-de-facturation-et-les-solutions-en-cas-de-rejet) | Assurance Maladie | 26/01/2026 | ARL négatif / RSP, motif « Traitement Caisse », téléservice « Réclamation paiements », retour sous 48 h |
| `ameli-pharmacien-retour-noemie-2022` | [Le retour NOEMIE (pharmacien)](https://www.ameli.fr/pharmacien/exercice-professionnel/teletransmission/retour-noemie) | Assurance Maladie | 29/04/2022 | ARL positif / négatif, pas d'ARL en mode dégradé, « Traitement Caisse » |
| `ameli-pharmacien-fse-mode-emploi-2021` | [La télétransmission des FSE : mode d'emploi](https://www.ameli.fr/pharmacien/exercice-professionnel/teletransmission/teletransmission/teletransmission-fse-mode-emploi) | Assurance Maladie | 02/01/2021 | ARL négatif ou absent : nouvel essai, puis contacter la caisse |
| `cpam38-pharmaciens-2023` | [Mémo facturation pharmaciens](https://local.pastel.cpam-isere.fr/wp-content/uploads/2024/12/20230830_MemoPS_facturation-pharmaciens.pdf) | CPAM de l'Isère | 30/08/2023 (nom du fichier) | 15 codes (droits, doublons, prescripteurs, médicaments), libellés récents (C2S) |
| `cpam33-infirmiers-2019` | [Rejets les plus courants, infirmiers](https://www.ameli.fr/sites/default/files/memo_infirmiers_rejets_ok.pdf) | CPAM de la Gironde | 22/11/2019 | 0480054, 0450054, 0450056, 0730055, 0460051 (dont le FINESS du Service de santé des armées) |
| `cpam33-pharmaciens-2019` | [Rejets les plus courants, pharmaciens](https://www.ameli.fr/content/memo-rejets-de-teletransmission-les-plus-courants-pharmaciens) | CPAM de la Gironde | 12/04/2019 | 0460051, 4000067, 0460053, 2900005, 0450056 |
| `cpam33-dentistes-2019` | [Rejets les plus courants, chirurgiens-dentistes](https://www.ameli.fr/content/memo-rejets-de-teletransmission-les-plus-courants-chirurgiens-dentistes) | CPAM de la Gironde | 10/04/2019 | 0600064, 0450097, 0600069, 0470049, 0180051, 0650001, 2900230 |
| `cpam33-laboratoires-2018` | [Rejets les plus courants, laboratoires](https://www.ameli.fr/content/memo-rejets-de-teletransmission-les-plus-courants-laboratoires) | CPAM de la Gironde | 29/06/2018 | 0450072, 0250050, 0270051, 0730055, 0470049 |
| `cpam-ets-publics-2018` | [Rejets les plus courants, établissements publics](https://www.ameli.fr/sites/default/files/memo_ets_publics_rejets.pdf) | Assurance Maladie (caisse non nommée dans le texte lu) | 26/06/2018 | 0710060, 0450054, 0270051, 0450082, 2600650 |
| `cpam33-fournisseurs-2016` / `-pharmaciens-2016` / `-laboratoires-2016` / `-dentistes-2016` | [Mémos 2016 de la CPAM de la Gironde](https://www.cpam-bordeaux.fr/newsletter/2016/images/images_1216/MEMO_FOURNISSEURS_REJETS_OK.pdf) (4 PDF, même dossier) | CPAM de la Gironde | 23/11/2016 | Fournisseurs : 0450054, 0250050, 0450056, 0100052, 0700060. Dentistes : 2600649, 2600710, 0650001, 2900230, 0450097 |
| `cpam67-medecins` / `-pharmaciens` / `-dentistes` | [Mémos des rejets de la CPAM du Bas-Rhin](https://www.ameli.fr/sites/default/files/cpam-basrhin_rejets-medecins.pdf) (3 PDF sur ameli.fr) | CPAM du Bas-Rhin | **non datés** dans le texte lu | Explications et « raisons possibles » ; codes propres (voir « à vérifier ») |
| `cpam44-optique-2010` | [Lexique des rejets, fournitures optiques](http://www.myeasyoptic.com/wp-content/uploads/2015/12/Lexique_Rejets_Opticien.pdf) | CPAM de la Loire-Atlantique (PDF hébergé par un éditeur optique) | octobre 2010 | Table complète de 73 codes avec part des rejets et explication, extraite entièrement |
| `fiche-rejets-opticiens-bretagne` | [Fiche technique, traitement des rejets, opticiens](https://www.prooptic-idm.com/wiki/wp-content/uploads/2015/05/traite_DOCAMOAMC.pdf) | non nommé (contenu de CPAM, caisses de Bretagne citées), hébergé par un éditeur | 2009 (modifié en 2015) | Libellés du retour et du courrier CPAM, consignes ; quelques codes propres |
| `gie-cdc-annexe1b-2025` | Cahier des charges SESAM-Vitale 1.40 add. 8, **annexe 1-B** v8.60, dans le [corpus 2025 T1](https://www.sesam-vitale.fr/documents/d/sesam-vitale/corpus-cdc_v8-50-2025-t1-documents-individuels-zip) | GIE SESAM-Vitale | 11/04/2025 | **Table complète des ARL négatifs** (30 lignes) et traitement à faire ; règles d'absence d'ARL (48 h), messages de service |
| `gie-cdc-annexe4-2025` | Même corpus, **annexe 4** v8.60 | GIE SESAM-Vitale | 11/04/2025 | **Tables complètes des messages de service** (rejet SMTP 16, rejet fichier 34, chiffrement 3) |
| `gie-fiche-info-094-2012` | [Fiche d'information n° 94](https://www.sesam-vitale.fr/documents/20195/20710/PDT-INF-094.pdf/f6a79adf-ea3b-4c37-afc2-298b6f93b2de?version=1.0) | GIE SESAM-Vitale | 06/06/2012 | ARL 2004 « certificat Vitale incorrect » : cause (carte Vitale suspecte) et conduite à tenir |
| `gie-actu-addendum-2023` | [Report de l'arrêt des flux en addendum 2 bis et 3](https://www.sesam-vitale.fr/web/sesam-vitale/actualites/-/blogs/report-de-l-arret-des-flux-en-addendum-2-bis-et-addendum-3-au-31-decembre-2023) | GIE SESAM-Vitale | 27/06/2023 | ARL 4003 et logiciels obsolètes |
| `orisha-desmos-arl-securite-lot` | [ARL négatives « Sécurité lot erronée »](https://healthcare-orisha.my.site.com/CustomerCommunityKnowledge/s/article/DESMOS-Comment-traiter-la-r%C3%A9ception-d-ARL-n%C3%A9gatives-S%C3%A9curit%C3%A9-lot-erron%C3%A9e) | Orisha Healthcare (aide publique d'éditeur) | non datée | Cause probable de l'ARL 2502 (carte CPS ou CPE révoquée) |
| `julie-teletransmission-2023` | [Problème de télétransmission](https://www.julie.fr/article-houston-probleme-de-teletransmission/) | Julie (éditeur dentaire) | 10/02/2023 | Même cause pour « Sécurité lot erronée » (carte CPS obsolète) |
| `resopharma-oct-2013` | [Nomenclature des codes rejets de l'OCT](https://www.resopharma.fr/documents/normes/nomenclature_des_rejets_OCT.pdf) | Résopharma (OCT des pharmacies) | 17/04/2013 | 14 codes « R… » retenus sur 147 (lots, doublons, organismes complémentaires) |

Source de contexte, non citée par une entrée (ajoutée à la liste des sources de `donnees.json` par dev-A, sous l'identifiant
`cdc-noemie-ps-2004`, parce que la méthode du hub s'appuie dessus) : [cahier des charges NOEMIE PS, mai 2004](https://www.sesam-vitale.fr/documents/20182/55864/cdc_noemie-ps-052004.pdf)
(structure de la ligne rejet, voir plus haut). Toutes les sources ont été consultées le 18/11/2026.

## Corrections de dev-A (18/11/2026)

Faites avec `scripts/A/corriger_dev_a.py` (dossier de travail de la nuit), avant la copie dans le dépôt.

| Entrée | Avant | Après | Pourquoi |
|---|---|---|---|
| `noemie-2600650` | `sur`, métier `clinique-laboratoire`, dans `PRIORITE` | `a_verifier` | Sa seule source (`cpam-ets-publics-2018`) est le mémo des **établissements publics de santé**, qui ne font pas partie des 5 métiers. Le rattachement aux cliniques était déduit (« à confirmer », disait la note) : la pastille « Cliniques et labos » affirmait plus que la source (signalé par copy-seo, `textes.md` § 6). La source ne permet pas de choisir un autre métier : l'entrée sort de la liste et des pages. Elle reste dans `PRIORITE` : elle aura sa page dès qu'un mémo daté la confirme pour un des 5 métiers (cliniques privées, centre de santé, dentaire). |
| `noemie-0710060` | `sur`, métier `clinique-laboratoire`, liste seulement | `a_verifier` | Même source, même problème, et sa note disait déjà « concerne les établissements publics, pas les cliniques privées » (T2A publique). |
| sources | 25 | 26 | `cdc-noemie-ps-2004` ajoutée (voir plus haut). |

Correction de la relecture (18/11/2026), sources rouvertes le jour même :

| Entrée | Avant | Après | Pourquoi |
|---|---|---|---|
| `noemie-0460051` | libellé « PRESCRIPTEUR INCONNU DANS LE REPERTOIRE NATIONAL » attribué au mémo pharmaciens de la Gironde (12/04/2019) | libellé « PRESCRIPTEUR INCONNU DANS REPERTOIRE NATIONAL » (mémo pharmaciens, 12/04/2019) ; la forme avec « LE » passe en variante, attribuée au mémo infirmiers (22/11/2019) | Le mémo pharmaciens écrit « DANS REPERTOIRE » ; la forme avec « LE » est celle du mémo infirmiers. La page montrait deux libellés différents sous le même document. |

À surveiller (non corrigé, la note de l'entrée le dit déjà sur la page) : `noemie-0460051` et `noemie-0460053` citent les
centres de santé et les laboratoires par déduction (« soins sur prescription ») ; `noemie-0100052` (mémo « fournisseurs »)
est rattaché à l'optique.

## Entrées « à vérifier » et pourquoi (92)

| Groupe | Codes | Pourquoi | Pour passer en « sûr » |
|---|---|---|---|
| Établissements publics seuls (2, dev-A) | 2600650, 0710060 | Seule source : le mémo des établissements publics de santé (2018) ; aucun des 5 métiers visé | Un mémo daté qui cite le code pour les cliniques privées, un centre de santé ou un cabinet dentaire |
| CPAM du Bas-Rhin seule (12) | 0450071, 2900010, 2900001, 0540152, 0315058, 1050060, 2600700, 0568002, 1170001 ; plus 0450057, 0450058, 0317051 (aussi dans les documents 2009-2015) | Mémos officiels mais **non datés** dans le texte lu (ameli.fr refuse le téléchargement direct) | Ouvrir les 3 PDF dans un navigateur, lire la date (propriétés du PDF) ; si 2016 ou après, passer en sûr |
| 1170001 en particulier | 1170001 | Le mémo écrit « 117001 » : 0117001 ou 1170001 ? Un document hospitalier de 2011 donne « 1170001 BASE REMBOURSEMENT ABSENTE » | Confirmer auprès d'un éditeur dentaire |
| Lexique optique 2010 (56) | voir `donnees.json` (2500064, 2500079, 2500052, 2500069, 2526010, 0170050…) | Document CPAM de **2010** : codes probablement stables (plusieurs se retrouvent à l'identique en 2016-2023), mais certaines règles citées sont caduques (forfaits CMU, OP1 à OP4) | Confirmer les codes LPP optique auprès d'un éditeur optique (Cosium, Optimum…) ou d'une CPAM ; ce sont les plus utiles aux opticiens |
| Fiche opticiens « Bretagne » (8) | 2500051, 2500059, 2520001, 0315032, 0480055 ; signalements 0250053, 0270053, 0720051 | Document ancien, émetteur non nommé ; **conflits** avec le lexique 2010 (2500059 contre 2500079 pour le même libellé ; 2500051 et 2500052 tous deux « code LPP inexistant » avec deux sens) | Trancher avec un éditeur optique |
| OCT Résopharma (14) | R5003, R5008, R5013, R5016, R5021, R5027, R5029, R5080, R6030, R6037, R6039, R6040, R6045, R6068 | Document de 2013, propre aux pharmacies qui passent par cet OCT | Demander à Résopharma sa nomenclature à jour |

Une phrase volontairement non reprise : la période de grossesse ouvrant l'examen bucco-dentaire (mémo 2019) et les taux de base
du mémo établissements 2018. Ces règles ont pu changer ; elles ne sont pas citées.

## Pièges relevés (à garder en tête pour les pages)

- **Même numéro, autre famille** : dans le cahier des charges SESAM-Vitale, un même numéro peut désigner un ARL et un message
  de service (4005), un ARL et un rejet de rapport de réclamation (5001, 5002), ou figurer dans deux tables de messages de
  service (9999). Slugs distincts par famille : `arl-…`, `sv-chiffrement-…`, `sv-smtp-…`, `sv-fichier-…`.
- **Même code, deux libellés** : 0450072 (« DIVERGENCE VITALE/EXO BDO ABSENTE » en 2018, « Situation d'exonération inconnue… »
  en 2016 et 2023) ; ARL 2004, qui a deux libellés et deux conduites à tenir (fiche d'information du GIE n° 94, 2012).
- **Les versions changent** : entre l'annexe OCT de 2016 et l'annexe 4 de 2025, des codes de messages de service sont
  renumérotés, apparaissent ou disparaissent. D'où la date sur chaque source.
- **Les codes NOEMIE sont ceux du régime général** (CPAM) ; un autre régime (MSA, régimes spéciaux) peut employer d'autres textes.
- Des codes courts du type « 153 », « 14 », « 56 » circulent : aucun n'apparaît dans les documents officiels lus. Un code NOEMIE
  du régime général a 7 chiffres ; un code court est souvent un code tronqué ou propre à un logiciel. L'outil peut le dire.

## Droits de reproduction (à trancher par Paul)

Les documents du GIE SESAM-Vitale (annexes 1-B et 4, annexe OCT) sont en téléchargement libre mais portent une mention : toute
reproduction, même partielle, est soumise à l'accord du GIE. Les libellés de codes sont des données courtes ; une page par code
qui cite son libellé et renvoie au document relève de la courte citation, mais republier les tables entières est plus discutable.
Options : demander l'accord du GIE (relations-industriels), ou ne publier que les pages conseillées et garder le reste dans la
recherche. Les mémos CPAM et pages ameli.fr ne portent pas de mention restrictive dans le texte lu.

En attendant la décision, les 83 entrées et la partie des scripts qui les produit sont hors du dépôt (copie complète conservée
à part). Les commits antérieurs de la branche `outils/codes-rejet` contiennent encore ces tables : une fusion en squash suivie
de la suppression de la branche les fait disparaître de `main` ; les effacer de l'historique tout de suite demande de
reconstruire la branche (décision de Paul).

## Ce qui manque

- **Complémentaires et plateformes de tiers payant** (Viamedis, Almerys, iSanté, SP Santé, Santéclair, Kalixia, Carte Blanche…) :
  aucune table publique de motifs de rejet trouvée ; les motifs s'affichent dans leurs portails. Seule une nomenclature d'OCT
  (Résopharma, 2013) a été lue. Les articles du site sur les portails disent déjà « nous ne reproduisons pas de codes de rejet ».
- **Table officielle complète des rejets NOEMIE** : non publique (la norme ne donne que la structure). Ce qui existe : les mémos
  par profession de quelques CPAM. Aucun mémo dédié trouvé pour les **audioprothésistes**, les **centres de santé** ni les
  **cliniques privées** (le guide CNDA « rejets terrain cliniques privées » est réservé aux éditeurs).
- Pages techniques NOEMIE d'ameli.fr (documentation technique) et cahier des charges NOEMIE PS 2011 de sante.gouv.fr : non lus
  (protection anti-robot). L'annexe 20 du cahier NOEMIE OC (« libellés de rejets ») concerne les échanges caisse-complémentaire,
  pas les retours aux professionnels.
- Codes LPP optique récents (après la réforme 100 % Santé) : non trouvés dans un document CPAM daté.

## Conseils de mise à jour

1. **Chaque trimestre**, relancer `extraire_tables.py` puis `construire_donnees.py` et `corriger_dev_a.py`. Les tables ARL et
   messages de service ne sont plus produites par les scripts du dépôt : après l'accord du GIE, la version complète (tenue
   à part) retélécharge le corpus du cahier des charges SESAM-Vitale et s'arrête si un code apparaît ou disparaît.
2. Chercher les nouveaux mémos « rejets les plus courants » des CPAM (ameli.fr, pages locales « près de chez vous ») ; un mémo daté
   récent qui confirme un code « à vérifier » le fait passer en « sûr ».
3. Demander aux éditeurs partenaires leur table de libellés (elle vient de la documentation diffusée aux éditeurs) pour l'optique
   et l'audio ; c'est la voie la plus rapide pour confirmer les 56 codes du lexique 2010.
4. Quand un professionnel envoie une capture d'un rejet (code + libellé), l'ajouter avec la date et la caisse émettrice, statut
   « à vérifier » tant qu'aucun document ne le confirme.
5. Revoir chaque page dont la source a plus de 3 ans à chaque mise à jour du cahier des charges ou de la convention du métier.
