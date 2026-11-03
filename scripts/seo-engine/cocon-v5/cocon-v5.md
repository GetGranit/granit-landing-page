# Cocon Ressources v5 : cinq verticales, un tronc commun

Carte de travail pour Paul (GTM). Établie dans la nuit du 3 au 4 novembre 2026 à partir des notes de l'équipe SEO (cinq consultants métier, terrain, architecture, avocat du diable) et de l'arbitrage final du chef d'équipe. Les 22 nouvelles entrées de file correspondantes sont prêtes au format de `articles-queue.json` ; elles sont insérées dans la proposition `articles-queue.v5.json` (la file en service, `articles-queue.json`, n'est pas modifiée).

Sommaire : 1. Méthode et limites · 2. Cliniques et labos : la réponse · 3. Le schéma · 4. Le tronc commun · 5. Les verticales · 6. Maillage et ordre de publication · 7. Écartés · 8. Faits réglementaires et sources · 9. Risques moteur bloquants.

---

## 1. Méthode et limites

| Point | Ce qu'il faut savoir |
|---|---|
| Date | Recherche du 3 novembre 2026. Les faits réglementaires sont ceux connus à cette date (voir section 8). |
| Demande | **Pas de Semrush ni d'outil de volume.** La demande est estimée **Faible / Moyen / Fort** à partir des suggestions Google (`suggestqueries`, `hl=fr`, de 30 à 40 requêtes par verticale), de la forme des SERP (Linkup, WebSearch) et de signaux annexes (offres d'emploi, certifications, actualité pro). Une suggestion qui se décline en « connexion », « conventionnement », « pec » est tapée par des professionnels ; une SERP de comparateurs indique une intention patient. |
| Volumes | Toutes les nouvelles entrées portent `searchVolume: 0` et `primaryKeywordMeasured: false` : cela veut dire « pas mesuré », pas « aucune demande ». À recaler dans la Search Console 4 à 6 semaines après publication. |
| SERP | Relevées sans géolocalisation (WebSearch sort des résultats US par défaut). Le classement réel sur google.fr peut différer. Les blocs « Autres questions » n'ont pas été accessibles : les FAQ viennent des suggestions, des FAQ des pages qui se classent et des forums pros. |
| Terrain | Environ 45 réunions Granola lues (mars à début novembre 2026), **anonymisées** : aucun nom de personne, de client, de prospect, d'enseigne ni de ville ; aucun chiffre de client ou de prospect ; aucune taille ni région qui permettrait de reconnaître quelqu'un. Les irritants cités ici sont reformulés. |
| Ce que Granit peut dire | Granit n'est mis en avant que là où c'est en production : **optique et audio** (rapprochement RO/RC, classement des documents, alertes de PEC). Dentaire, centres, ophtalmo et laboratoires en sont au POC ou à la démo ; en officine, Granit fait de la PDA et des bilans de médication, pas du tiers payant ; rien en clinique. Ailleurs qu'en optique et en audio, chaque article s'écrit sous l'**angle méthode**, sans « Granit fait X ». |
| Interdits de publication | Aucun nom de client ou de prospect, aucun chiffre de résultat client, aucun prix (ni d'abonnement, ni d'externalisation), aucun concurrent nommé dans le corps des articles. Les domaines cités en SERP ci-dessous servent à l'analyse, pas à la rédaction. |

---

## 2. Cliniques et laboratoires : font-ils du tiers payant mutuelle ?

**Oui, juridiquement et en pratique. Mais ce n'est pas le sujet de Granit aujourd'hui, et ce n'est presque pas un sujet SEO pour nous.**

| | Clinique privée | Laboratoire de biologie |
|---|---|---|
| Le tiers payant mutuelle existe-t-il ? | Oui, et il pèse lourd : le bureau des entrées demande une **prise en charge hospitalière** à la mutuelle ou à son opérateur (n° FINESS, code DMT, dates de séjour) et attend un **engagement de paiement**. La part AMO part en norme B2 et revient par NOEMIE. Le dispositif **ROC** (IDB, SIM, CLC) doit normaliser ces échanges ; pour les cliniques privées, il n'en est qu'aux pilotes. | Oui, et il est **industrialisé** : télétransmission par concentrateur, conventions de tiers payant avec la plupart des mutuelles, sans accord préalable. |
| Ce que dit le terrain | **Aucun call** avec une clinique. Granit a dit lui-même, en juillet 2026, ne pas viser les cliniques. | Les laboratoires (le métier le plus documenté hors optique) disent que le tiers payant mutuelle est **réglé chez eux**. Leur douleur est ailleurs : admission et ressaisie des dossiers, **rejets FSE**, **retours NOEMIE**, pointage bancaire en masse, lettrage des paiements B2B des cliniques et hôpitaux. |
| Demande SEO pro | Faible à moyenne, étroite (« demande de prise en charge hospitalière + portail », « dispositif roc »). La demande patient domine (chambre particulière, forfait journalier). | Quasi nulle (« rejet mutuelle laboratoire », « facturation laboratoire biologie » : aucune suggestion). |
| Point réglementaire à ne pas écrire tel quel | ROC en clinique : la montée en charge à partir de septembre 2026 n'est qu'« envisageable » selon la FHP-MCO, sans obligation. | — |

**Ce qu'on fait (décision d'arbitrage) :**
1. La verticale « Cliniques et laboratoires » est gardée (décision de Paul), en **format minimal**. Ses trois entrées propres (K0 pilier clinique, K1 demande de prise en charge hospitalière, K2 rejets FSE en laboratoire) sont en statut **`waiting`** : le moteur ne les prend pas tant que Paul n'a pas tranché.
2. La verticale avance d'ici là par un **article du tronc** en `pending` : X5 `idb-clc-roc-tiers-payant` (IDB, CLC, ROC), utile aussi aux centres de santé et au dentaire, avec une section clinique datée.
3. L'article labo (K2) prend l'angle des **rejets FSE et retours NOEMIE**, pas du tiers payant mutuelle. Il n'a de sens en SEO qu'une fois le POC laboratoire validé ; avant, c'est un contenu de vente.
4. La page `/ressources/metier/cliniques` reste en `noindex` jusqu'à trois articles propres en ligne. On ne transfère pas `hopital-prive-ordonnancement` vers K0.
5. Même logique pour la pharmacie, à garder en tête : la page Pharmacie gagnerait à parler de ce que Granit y fait vraiment (PDA, comparaison d'ordonnances), puisqu'aucun call ne parle de tiers payant en officine.

---

## 3. Le schéma

Un pilier transverse (T0) au sommet, cinq piliers métier dessous, et un tronc d'articles communs qui servent toutes les verticales. `tiers-payant-opticien` cesse d'être le « Pilier global » : il devient le pilier métier de la verticale 1 (parent dans la file : T0 ; on ne le réécrit pas).

```
tiers-payant-professionnels-de-sante                (T0, pilier global, 5 verticales)
├── PILIERS MÉTIER
│   ├── tiers-payant-opticien                       (verticale 1, existant)
│   │   ├── portails-tiers-payant → portail-* → *-prise-en-charge / *-espace-pro
│   │   ├── rejet-tiers-payant, gerer-tiers-payant-magasin, conformite-opticien
│   │   └── G1, G2, G3 …                            (19 entrées restent optique)
│   ├── tiers-payant-audioprothesiste               (AU0, verticale 1, parent T0)
│   │   └── AU1 pec-audio · AU2 codes-lpp · AU3 paiement-bloque · AU4 css · R5 (existant)
│   ├── tiers-payant-dentaire                       (D0)
│   │   └── D1 pec-dentaire · D2 hors-nomenclature · R4, R1 (existants)
│   ├── tiers-payant-centre-de-sante                (S0)
│   │   └── S1 accord-national · S2 rejet-cpam · S3 centre-ophtalmologie · R9, R10 (existants)
│   ├── gestion-tiers-payant-pharmacie              (PH0)
│   │   └── R3, R6 (existants)
│   └── tiers-payant-clinique-privee                (K0, waiting)
│       └── K1 prise-en-charge-hospitaliere · K2 rejets-fse-laboratoire (waiting)
├── PILIERS DU TRONC
│   ├── rapprochement-bancaire-tiers-payant (C0) → C1-C5, C7, X2 arl-negatif
│   └── glossaire-tiers-payant (F0) → F1, F2, F3
└── ARTICLES DU TRONC rattachés à T0
    X1 ticket-moderateur-2027 · X3 inter-amc · X4 rejet-acte-hors-perimetre · X5 idb-clc-roc
    B2, B3, B5, B6, B7, B9, B10, E1, E5, E6, G5, G6, H6
```

Les cinq pages métier restent aux adresses existantes (`optique`, `dentaire`, `centres`, `pharmacie`, `cliniques`) ; `audio` → `optique`, `laboratoires` → `cliniques` et `ehpad` → `/ressources` en 301 (détail dans `pages-metier.md`, même dossier).

---

## 4. Le tronc commun

### 4a. Entrées existantes qui deviennent multi-métiers (20)

« Tous » = optique, dentaire, centres, pharmacie, cliniques. Le parent proposé remplace `tiers-payant-opticien` par T0 là où il était.

| Id | Slug | Verticales | Changement | Parent |
|---|---|---|---|---|
| C0 | `rapprochement-bancaire-tiers-payant` | Tous | Écrit d'emblée multi-métiers (exemples centre dentaire multi-sites, officine, centre auditif) | T0 |
| F0 | `glossaire-tiers-payant` | Tous | « optique » sort du titre ; ajouter HN, EBD, Inter-AMC, ROC, IDB, CLC, OCT, DMT, FINESS, PLV, codes audio | T0 |
| F1 | `amo-amc` | Tous | Exemples par métier ; tout « 60/40 » daté (taux 2027 non publié) | F0 |
| F2 | `sigles-tiers-payant-noemie` | Tous | Garde « télétransmission noémie » | F0 |
| F3 | `carte-vitale-carte-tiers-payant` | Tous | Volets audio (2025) et officine (juin 2025) | F0 |
| C4 | `retour-noemie-sans-virement` | Tous | Mot-clé → « retour noemie » | C0 |
| C5 | `libelles-virements-tiers-payant` | Tous | Exemples hors optique | C0 |
| C7 | `impayes-mutuelle-anciens` | Tous | Distinct de `officine-balance-agee-tiers-payant` ; pas de « délai légal de 2 ans » | C0 |
| B2 | `refacturer-part-mutuelle` | Tous | « selon le logiciel métier » au lieu de noms de logiciels optique | T0 |
| B6 | `ouvrant-droit-beneficiaire` | Tous | Lien de sœur avec `rejet-beneficiaire-inconnu` | T0 |
| B9 | `client-sans-carte-tiers-payant` | Tous | Titre « Le patient arrive sans sa carte de tiers payant : que faire ? » | T0 |
| B10 | `reduire-taux-rejet-tiers-payant` | Tous | Reçoit la FAQ de G4 ; aucun taux non mesuré | T0 |
| B5 | `tiers-payant-css-opticien` → **`tiers-payant-css`** | Tous | Garde « tiers payant css », lié en sœur à AU4 | T0 |
| G5 | `tiers-payant-integral-opticien` → **`tiers-payant-integral`** | Tous | Beaucoup de faits à sourcer par métier ; **pas** de « tiers payant obligatoire sur le 100 % Santé » (non confirmé) | T0 |
| G6 | `cas-particuliers-tiers-payant-optique` → **`cas-particuliers-tiers-payant`** | Tous | L'ALD passe dans G5 | T0 |
| E5 | `cout-temps-tiers-payant` | Tous | Méthode de calcul seulement ; donnée « heures économisées » retirée (optique seulement) | T0 |
| E6 | `indicateurs-tiers-payant` | Tous | Vue par site et par payeur (absorbe l'idée « indicateurs centre de santé ») | T0 |
| B3 | `prise-en-charge-refusee` | optique, dentaire, centres (**sans cliniques** ; pas d'officine) | — | T0 |
| B7 | `contester-refus-prise-en-charge` | optique, dentaire, centres (**sans cliniques**) | — | T0 |
| E1 | `gestionnaire-tiers-payant` | optique, dentaire, centres, cliniques | Salaire seulement avec offres d'emploi datées | T0 |

Cas limites : H6 `reseaux-de-soins-conventionnement` en `["optique","dentaire"]` (parent T0) ; A12 `contacts-plateformes-tiers-payant` (en review) reçoit `verticales: Tous` avant fusion de sa PR. Publiés à retaguer sans réécriture (`verticales.json` → `surcharges`) : `sesam-vitale-evolutions-2025` (optique, dentaire, centres, pharmacie), `recouvrement-patient-empathie` (centres, dentaire, **sans cliniques**, et après correction de son exemple de « dépassement » en centre de santé, que L6323-1-7 interdit), `integration-doctolib-lgo` (centres, dentaire), `facturation-ehpad-controle-humain` (`[]`).

### 4b. Les nouvelles entrées du tronc

| Id | Slug | Mot-clé | Verticales | Parent | Pourquoi |
|---|---|---|---|---|---|
| T0 | `tiers-payant-professionnels-de-sante` | tiers payant professionnel de santé | Tous | — | Parent neutre du tronc et des piliers métier ; ne vise jamais « opticien » |
| X1 | `ticket-moderateur-2027-tiers-payant` | ticket modérateur 2027 | optique, dentaire | T0 | Décrets du 21 août 2026 ; daté, à publier avant le 1er janvier 2027 ; sert aussi la verticale en production |
| X2 | `arl-negatif` | arl négatif | Tous | C0 | Demande de toutes les professions qui télétransmettent, dont l'optique et l'audio |
| X3 | `inter-amc-tiers-payant-complementaire` | inter amc | centres, dentaire, pharmacie | T0 | Meilleure demande des centres ; un seul article (fusion de l'article dentaire) avec une section examen bucco-dentaire |
| X4 | `rejet-mutuelle-acte-hors-perimetre` | rejet mutuelle acte hors périmètre | centres, pharmacie, dentaire | T0 | Mêmes libellés AMC en centre et en officine : un seul article, causes « probables » |
| X5 | `idb-clc-roc-tiers-payant` | dispositif roc | cliniques, centres, dentaire | T0 | Fait avancer la verticale cliniques sans pilier ; section clinique datée |

Le détail de chaque nouvelle entrée du tronc (lecteur, FAQ, SERP) est en section 5, rangé sous la verticale qui l'a fait naître.

### 4c. Ce qui reste optique (19)

A10 `portail-kalixia`, G1 `100-sante-classe-a-b-opticien` (sa FAQ « tiers payant obligatoire sur le 100 % Santé ? » renvoie vers G5 sans trancher), A11 `portail-carte-blanche`, A19 `itelis-conventionnement`, A17 `sp-sante-espace-pro`, A16 `viamedis-prise-en-charge`, A18 `isante-prise-en-charge`, G3 `questions-tiers-payant-opticien`, G2 `remboursement-optique-amo-amc`, E3 `logiciel-opticien-tiers-payant`, B4 `renouvellement-lunettes-moins-2-ans`, E2 `solutions-tiers-payant-optique` (waiting ; mot-clé à changer pour ne pas doubler E0), E4 `automatiser-saisie-prise-en-charge` (conversion), H0 `conformite-opticien`, H1 `controle-assurance-maladie-opticien`, H2 `devis-normalise-codes-lpp` (titre « … en optique »), H3 `conservation-dossiers-tiers-payant` (titre « … en optique »), H4 `fraude-tiers-payant-optique` (section audio possible, sans chiffre de fraude), H5 `rgpd-donnees-sante-opticien`.

### 4d. Supprimés et repoussés

| Id | Slug | Décision | Raison |
|---|---|---|---|
| C8 | `reste-a-charge-impaye` | Supprimé | Même intention que `recouvrement-patient-empathie`, déjà publié |
| G4 | `erreurs-tiers-payant-opticien` | Supprimé | Même intention que `checklist-prise-en-charge`, `rejet-tiers-payant` et B10 (sa FAQ passe dans B10) |
| C6 | `delais-paiement-plateformes` | Repoussé (`waiting`) | Dépend de statistiques de production non validées et d'une source datée par ligne |
| E7 | `conges-dossiers-tiers-payant` | Repoussé (`waiting`, mai 2027) | Saisonnier ; reste optique |

---

## 5. Les verticales

Légende des champs : **Intention** (ce que cherche le lecteur) · **Demande** (estimation et signaux) · **SERP** (domaines qui se classent) · **Granit** (ce qu'on peut dire de vrai) · **Existant** (articles à adapter) · **Terrain** (irritants anonymes qui justifient l'article).

### 5.1 Opticiens et audioprothésistes

**L'optique, en résumé.** Le cocon optique existe (pilier `tiers-payant-opticien`, fiches portail, rejets, conformité) et ses 19 entrées restantes sont listées en 4c. Il reste la seule verticale où Granit peut citer des constats d'expérience des dossiers traités par ses agents, toujours sans chiffre client. Les ajouts audio aux pages optique se font par **encadrés** (« En audioprothèse ») dans les fiches portail existantes, pas par de nouvelles pages par plateforme.

**L'audio, en détail.** Seul métier non optique adossé à de la production. La SERP audio est saturée de contenu patient (comparateurs, enseignes) ; le côté pro (PEC sur extranet, codes, paiements) n'est couvert que par ameli pro, le syndicat et la presse pro, sans guide pratique. Volumes faibles, lecteurs très qualifiés. CTA : « Démo ».

**AU0 · `tiers-payant-audioprothesiste`** (pilier métier, parent T0, signé Laura)
- Mot-clé : tiers payant audioprothésiste. Intention : informationnelle pro, comprendre le circuit complet (prescription, devis normalisé, PEC, essai de 30 jours, facture SESAM-Vitale avec carte Vitale, AMO et AMC, NOEMIE, rapprochement).
- Lecteur : audioprothésiste titulaire ou gérant de centre auditif, assistant(e) audio chargé(e) du tiers payant.
- Demande : **Moyen**. Suggestions « tiers payant audioprothésiste », « tiers payant appareil auditif », « prise en charge mutuelle appareil auditif », « audioprothésiste mutuelle » ; aucun guide pro du circuit en SERP.
- FAQ : Le tiers payant est-il obligatoire chez l'audioprothésiste ? · La carte Vitale est-elle obligatoire chez l'audioprothésiste ? · Quand facturer une aide auditive : au devis ou après l'essai ? · Comment se faire payer la part mutuelle d'un appareil auditif ? · Combien de temps un devis d'audioprothèse est-il valable ?
- SERP : ideal-audition.fr, audition44.fr, audiplus.fr, jechange.fr, groupama.fr, matmut.fr, swisslife.fr, ameli.fr (assuré).
- Granit : constats d'expérience des dossiers audio (dépôt et suivi des PEC, alertes avant facturation, rapprochement RO/RC), **sans chiffre** et sans présenter une plateforme précise comme gérée tant que le produit ne l'a pas validé. Intègre le devis normalisé (ex-A6) en section.
- Existant : R5 `audioprothese-renouvellement-tiers-payant` devient son enfant (`parentSlug`), corrige sa source ameli et ajoute « renouveler avant 4 ans ».
- Terrain : contrôles des plateformes jugés tatillons (dossier invalidé pour une pièce mal qualifiée, document à signer à une date précise), sans interlocuteur ; certains centres réduisent le tiers payant pour protéger leur trésorerie ; accès aux plateformes et double authentification lourds.

**AU1 · `pec-audio-plateformes-tiers-payant`** (fille de AU0)
- Mot-clé : pec audio. Intention : pratique pro, « où et comment saisir ma PEC audio sur tel portail ».
- Lecteur : assistant(e) audio ou audioprothésiste qui saisit les prises en charge.
- Demande : **Moyen**, le signal le plus net de la verticale : « almerys pec audio », « almerys tp audio », « itelis pec audio », « carte blanche pec audio », « kalixia audio pro », « partenaire itelis audioprothesiste ».
- FAQ : Comment faire une PEC audio sur Almerys ? · Comment devenir audioprothésiste partenaire d'un réseau comme Itelis ou Kalixia ? · Que faire si la prise en charge expire pendant la période d'essai ? · Quel numéro appeler pour Kalixia Audio ?
- SERP : itelis.fr, mgen.fr, kalixia.fr, santeclair.fr, carteblanchepartenaires.fr, assurance-jeunes.com, audiplus.fr, bl-assur.fr.
- Granit : cœur du produit en production (dépôt de PEC, relevé des statuts, alerte avant expiration). Aucune plateforme présentée comme « gérée par Granit » sans validation produit. Tableau des plateformes daté, sources d'acteurs (pas de texte public sur les PEC AMC).
- Existant : encadré « En audioprothèse » dans les fiches portail (Itelis, Santéclair, Kalixia, Carte Blanche, Almerys, Viamedis) ; `mutuelle-quel-portail` mentionne l'audioprothésiste.
- Terrain : plusieurs centres pas encore conventionnés ; codes SMS et double authentification ; PEC à surveiller avant le rendez-vous de facturation.

**AU2 · `codes-lpp-audioprothese-facturation`** (fille de AU0, absorbe piles et suivi, ex-A5)
- Mot-clé : code lpp audioprothèse. Intention : référence pro à garder sous la main.
- Lecteur : assistant(e) audio qui facture, audioprothésiste qui paramètre son logiciel.
- Demande : **Faible à Moyen**, 100 % pro : « code lpp audio classe 2 », « liste code lpp audioprothèse », « code lpp appareil auditif css », « prestation de suivi audioprothésiste », « forfait remboursement piles appareil auditif ».
- FAQ : Quel est le code LPP d'une aide auditive de classe 2 ? · Quel code utiliser pour un bénéficiaire de la CSS ? · Faut-il un code différent pour l'oreille droite et l'oreille gauche ? · Combien de paquets de piles sont remboursés par an ? · Peut-on facturer un an de piles en une fois ?
- SERP : ameli.fr (pro), sdaudio.org, codage.ext.cnamts.fr, PDF de mutuelles.
- Granit : constat d'expérience modeste (lignes de suivi et de piles à reconnaître dans le rapprochement). **Pas** de promesse de contrôle de cohérence avant envoi (pas en production). **Pas** de montant « 0,01 € » pour le suivi (non confirmé).
- Existant : `codes-rejets-noemie` ajoute les cas audio (code oreille, délai de renouvellement, PLV dépassé, piles anticipées) ; H2 reste « devis normalisé optique ».
- Terrain : noms de mutuelles peu fiables dans le logiciel métier, rejets à remonter à leur cause.

**AU3 · `paiement-audioprothese-bloque`** (fille de AU0, rôle Conversion)
- Mot-clé : paiement audioprothèse bloqué (hypothèse, aucune suggestion directe ; alternative « remboursement audioprothèse en attente »). Intention : résolution, le professionnel attend son argent.
- Lecteur : gérant de centre auditif indépendant, assistant(e) chargé(e) du suivi des paiements.
- Demande : **Faible** en volume, **forte en douleur** (presse pro sur les paiements suspendus et les justificatifs exigés).
- FAQ : Pourquoi ma facture d'audioprothèse est-elle « en cours de vérification » ? · Une ordonnance d'appareil auditif de plus d'un an peut-elle être rejetée ? · Quels justificatifs une mutuelle peut-elle demander pour une aide auditive ? · Que faire si la mutuelle ne paie pas l'appareil auditif ?
- SERP : audiologie-demain.com, audioinfos365.fr, acuite.fr, ouiemagazine.net, frequenceaudio.fr.
- Granit : constats d'expérience sur les paiements attendus non reçus repérés par le rapprochement RO/RC, sans chiffre. Granit ne négocie pas avec la caisse. **Aucun chiffre de fraude** ; ne jamais suggérer que les contrôles sont abusifs.
- Existant : `quand-relancer-mutuelle`, `impayes-mutuelle-anciens`, `virement-mutuelle-inferieur` reçoivent un exemple audio.
- Terrain : paiements en retard de plusieurs mois sans alerte ; virements groupés impossibles à ventiler ; mutuelles qui exigent des relances à la main ou n'envoient leurs décomptes que par courrier ; dossier facturé dans un centre et payé dans un autre.

**AU4 · `aides-auditives-css-tiers-payant`** (fille de AU0, signé Laura)
- Mot-clé : appareil auditif css. Intention : règles d'un public particulier, avec une part de requêtes patients.
- Lecteur : audioprothésiste et assistant(e) qui accueillent des bénéficiaires de la Complémentaire santé solidaire.
- Demande : **Moyen** : « appareil auditif css » et ses déclinaisons (« prix… », « code lpp… », « remboursement css audioprothèse »), fil du forum ameli où l'audioprothésiste est perdu.
- FAQ : Quel est le prix maximal d'un appareil auditif pour un bénéficiaire de la CSS ? · Quel code LPP pour un appareil auditif CSS ? · Un bénéficiaire de la CSS peut-il choisir un appareil de classe II ? · Faut-il envoyer le devis à l'organisme qui gère la CSS ?
- SERP : ameli.fr (assuré et forum), complementaire-sante-solidaire.gouv.fr, cmu.fr, sdaudio.org.
- Granit : rien de propre (la vérification des droits n'est pas un produit) : `granitData` à « — ».
- Existant : lien de sœur obligatoire avec B5 `tiers-payant-css`, qui garde « tiers payant css ».
- Terrain : contrôles avant paiement plus fréquents sur certains dossiers ; besoin de savoir à l'avance ce qui sera payé.

### 5.2 Dentaire

Lecteur réel : la coordinatrice de soins dentaires (une certification RS dédiée existe) et le gestionnaire tiers payant multi-sites, pas le chirurgien-dentiste. SERP pro tenue par des prestataires d'externalisation et un éditeur d'automatisation des PEC ; SERP patient saturée de comparateurs. **Aucun client dentaire en production** : angle méthode partout, `granitData` « — », CTA « Parlons de votre tiers payant ».

**D0 · `tiers-payant-dentaire`** (pilier métier, parent T0, signé Laura ; absorbe « tiers payant centre dentaire » et le pilotage multi-fauteuils)
- Mot-clé : tiers payant dentaire. Intention : informationnelle et organisationnelle, comprendre le circuit et savoir où l'argent se perd.
- Lecteur : coordinatrice de soins ou assistante dentaire chargée du tiers payant, responsable administratif d'un centre dentaire multi-fauteuils.
- Demande : **Moyen**. « tiers payant dentaire » se décline (« …dentiste obligatoire », « gestionnaire tiers payant dentaire », « formation… », « carte tiers payant dentiste ») ; offres d'emploi de gestionnaire en centres dentaires. Une partie de la SERP est belge : cadrer « France ».
- FAQ : Le tiers payant est-il obligatoire chez le dentiste ? · Un centre dentaire est-il obligé de pratiquer le tiers payant ? · Un centre dentaire peut-il demander de payer la prothèse avant la pose ? · Le tiers payant s'applique-t-il aux prothèses et aux implants ? · Comment suivre les impayés mutuelles sur plusieurs fauteuils ou plusieurs sites ?
- SERP : iremia-sante.fr, sicorfe.com, conseiltierspayant.com, tat-tierspayant.fr, stpps.net, blog.tpzen.com, omnicab.fr, macif.fr, previssima.fr, unecd.com, inami.fgov.be (bruit belge).
- Granit : angle méthode, rien à promettre. Points de fond : L6323-1-7 pour les centres, agrément ARS de l'activité dentaire en centre de santé, examen bucco-dentaire (renvoi X3). Retirer toute idée de « tiers payant obligatoire sur le panier 100 % Santé » (non confirmé).
- Existant : R4 `dentaire-paniers-100-sante-tiers-payant` et R1 `orthodontie-facturation-traitements-longs` deviennent ses enfants ; sections dentaires dans `rejet-tiers-payant`, `codes-rejets-noemie`, `virement-mutuelle-inferieur`, `quand-relancer-mutuelle`, fiches portail ; `mutuelle-quel-portail` doit distinguer portail optique et portail dentaire d'une même mutuelle.
- Terrain : tiers payant limité aux petits soins par peur des impayés sur la prothèse ; stock de rejets à reprendre avant de sécuriser le flux ; reste à charge inconnu au moment du devis ; conventionnement plateforme par plateforme jugé long au point que certains cabinets renoncent ; rapprochement des virements fait chaque jour à la main.

**D1 · `pec-dentaire-portails-mutuelles`** (fille de D0)
- Mot-clé : pec dentaire. Intention : pratique, « sur quel portail, avec quelles pièces, que faire de la réponse ».
- Lecteur : assistante ou coordinatrice qui saisit les devis de prothèse et d'implant.
- Demande : **Moyen** (somme de longues traînes pros) : « almerys pec dentaire », « viamedis pec dentaire », « itelis pec dentaire », « carte blanche pec dentaire », « envoyer devis dentaire mutuelle », « validité devis dentaire mutuelle ».
- FAQ : Comment faire une PEC dentaire sur Almerys ou Viamedis ? · Combien de temps est valable un accord de prise en charge dentaire ? · Que faire si la mutuelle ne répond pas au devis ? · Faut-il refaire une PEC si le plan de traitement change ? · Qui envoie le devis à la mutuelle : le cabinet ou le patient ?
- SERP : omnicab.fr, itelis.fr, conseiltierspayant.com, assurance-jeunes.com, bonne-assurance.com, redentklinik.com, mese.fr.
- Granit : angle méthode (la méthode est la même qu'en optique, mais rien n'est en production en dentaire). Tableau des plateformes daté ; validité d'un accord « à lire sur l'accord ».
- Existant : section « Pour les cabinets dentaires » dans les fiches portail Itelis, Almerys, Viamedis, Carte Blanche, Kalixia, Santéclair.
- Terrain : demande de prise en charge en ligne qui échoue sur un bénéficiaire introuvable alors que les numéros sont bons ; patient qui repart avec son devis faute de PEC.

**D2 · `actes-hors-nomenclature-dentaire`** (fille de D0)
- Mot-clé : actes hors nomenclature dentaire. Intention : pro, obtenir la part mutuelle d'un acte sans base AMO (devis, PEC, suivi du forfait). **Pas de cotation** (risque de conseil erroné).
- Lecteur : coordinatrice ou responsable facturation d'un cabinet ou centre à forte activité implantaire.
- Demande : **Moyen** côté pro (« code hn dentiste mutuelle », « liste des actes hors nomenclature dentaire », « itelis implant dentaire »), **Fort** côté patient, à ne pas viser.
- FAQ : Qu'est-ce qu'un acte hors nomenclature en dentaire ? · La mutuelle rembourse-t-elle un acte HN sans remboursement de la Sécurité sociale ? · Faut-il un accord de la mutuelle avant la pose d'un implant ? · Peut-on faire le tiers payant sur un implant ? · Que faire si le patient change de mutuelle entre le devis et la pose ?
- SERP : lelynx.fr, ag2rlamondiale.fr, dentaly.org, aide-sociale.fr, ircem.com, aquaverde-assurance.fr, espace-famille.net, sites de cabinets.
- Granit : angle méthode, rien à promettre. Aucune base de remboursement de la couronne sur implant sans source primaire.
- Existant : `virement-mutuelle-inferieur` (cas forfait implant), R4.
- Terrain : refus du tiers payant sur la prothèse et les soins lourds faute de maîtrise des impayés ; reste à charge inconnu au devis.

*Dentaire, traité dans le tronc :* l'article « remboursement dentaire 2027 » devient X1 (ci-dessous), l'article Inter-AMC dentaire fusionne dans X3.

**X1 · `ticket-moderateur-2027-tiers-payant`** (tronc, optique et dentaire, parent T0)
- Mot-clé : ticket modérateur 2027 (« remboursement dentaire 2027 » est une requête patient). Intention : actualité réglementaire pratique, « que changer au 1er janvier ».
- Lecteur : responsable facturation ou coordinatrice de cabinet ou centre dentaire, gérant de magasin d'optique ou de centre auditif.
- Demande : **Fort** de novembre 2026 à mars 2027, puis Faible : « remboursement dentaire 2027 » (6 suggestions), « ticket modérateur dentaire » (8), nombreux articles patients depuis le 22 août 2026.
- FAQ : Qu'est-ce qui change au 1er janvier 2027 pour le ticket modérateur ? · Qui fixe le nouveau taux de participation de l'assuré ? · Faut-il refaire les devis signés en 2026 pour des soins faits en 2027 ? · Le panier 100 % Santé est-il concerné ? · Les lunettes et les aides auditives sont-elles concernées par le décret 2026-810 ?
- SERP : assurland.com, cotelib.fr, spac-actuaires.fr, airzen.fr, magcentre.fr, bourseinside.fr, kohenavocats.com, eurodentaire.com.
- Granit : rien à chiffrer. Fond : décret 2026-809 confirmé ; 2026-810 à relire sur Légifrance ; **aucun taux** tant que la décision Uncam n'est pas publiée. À publier avant le 1er janvier 2027.
- Existant : `amo-amc` et tous les exemples « 60 % » à dater ; R1 (orthodontie à cheval sur 2026-2027).
- Terrain : transfert vers la part mutuelle = plus de montants exposés aux rejets complémentaires, dans des structures qui suivent déjà mal la part mutuelle.

### 5.3 Centres de santé et ophtalmologie

En centre de santé, le patient n'avance rien sur la part AMO (L6323-1-7) : chaque rejet devient une créance du centre, sur beaucoup de lignes de faible montant. L'angle de toute la verticale est le volume en aval de la facturation. **Aucun centre en production** : angle méthode, `granitData` « — », rien sur la télétransmission ni la carte CPS.

**S0 · `tiers-payant-centre-de-sante`** (pilier métier, parent T0, signé Laura, `remplace: ["groupes-multi-sites-pilotage"]`)
- Mot-clé : tiers payant centre de santé. Intention : informationnelle et organisationnelle (« comment gérer »).
- Lecteur : direction ou responsable administratif et financier de centre de santé, coordinatrice de la facturation, gestionnaire multi-sites.
- Demande : **Moyen** : « centre de santé tiers payant », « facturation centre de santé », « logiciel facturation centre de santé ». Une partie de la SERP est locale et patient : viser la variante « gestion ».
- FAQ : Un centre de santé peut-il refuser le tiers payant ? · Le tiers payant est-il automatique avec toutes les mutuelles ? · Un centre de santé peut-il facturer des dépassements d'honoraires ? · Quel délai de paiement pour une DRE mutuelle en centre de santé ? · Qui gère le tiers payant dans un centre de santé ?
- SERP : healthcare.orisha.com, sicorfe.com, conseiltierspayant.com, stpps.net, docteur-house.fr, sites satellites de liens.
- Granit : angle méthode, rien à promettre. Fond : L6323-1-7 (part AMO), contrat Inter-AMC pour la part complémentaire, nuance sur la C2S (part complémentaire pas toujours gérée par la caisse).
- Existant : R9 `recouvrement-patient-empathie` (à corriger d'abord) et R10 `integration-doctolib-lgo` deviennent ses enfants. **Transfert du `remplace`** : `groupes-multi-sites-pilotage` est aujourd'hui déclaré dans `tiers-payant-opticien.json` ; il faut le retirer de ce JSON dans la même PR de relecture que S0, sinon le build casse (ancien article remplacé deux fois).
- Terrain : coût jugé élevé du couple logiciel + société de gestion pour une visibilité faible (un récapitulatif trimestriel, aucun pilotage des impayés) ; prestataire intégré qui ne traite pas les rejets ; gérant qui exerce à côté et n'a pas le temps ; carte Vitale exigée et peu de mode dégradé.

**S1 · `accord-national-centres-de-sante`** (fille de S0)
- Mot-clé : accord national centre de santé. Intention : réglementaire, « qu'est-ce qui change pour notre facturation ».
- Lecteur : direction et responsable administratif de centre, gestionnaire d'un réseau de centres.
- Demande : **Moyen** : huit suggestions sur la racine (« 2025 », « annexe 5 », « nouvel accord », « avenant… »). ameli et Légifrance tiennent le texte ; l'angle facturation est libre.
- FAQ : Quand le nouvel accord national des centres de santé est-il entré en vigueur ? · Un centre peut-il faire le tiers payant sans carte Vitale ? · Un centre d'ophtalmologie touche-t-il encore la rémunération forfaitaire ? · Quand la nouvelle rémunération forfaitaire est-elle versée ?
- SERP : ameli.fr, legifrance.gouv.fr, fncs.org, docteur-house.fr, lequotidiendumedecin.fr.
- Granit : angle méthode. Fond confirmé : signature, approbation, manquement « de façon répétée », exclusion à 50 % de filière visuelle. Non confirmé : « FSE sécurisée, mode privilégié ».
- Existant : E6 `indicateurs-tiers-payant` (indicateurs de téléservices et de délais).
- Terrain : la CPAM regarde de près quelle carte facture quoi ; peu de mode dégradé permis.

**S2 · `rejet-cpam-centre-de-sante`** (fille de S0)
- Mot-clé : rejet cpam centre de santé (« rejet cpam » seul est trop générique et doublonnerait `codes-rejets-noemie`). Intention : résolution et méthode à volume constant.
- Lecteur : équipe de facturation d'un centre médical ou polyvalent, coordinatrice d'un centre de soins infirmiers.
- Demande : **Fort** sur la racine toutes professions (« rejet cpam invalidation à l'initiative de la caisse », « pas de traitement OC », « modulation du ticket modérateur », « rejet noemie traitement caisse ») ; l'angle centre de santé n'est pris par personne.
- FAQ : Que veut dire « invalidation à l'initiative de la caisse » ? · Rejet CPAM « pas de traitement OC » : qui paie la part complémentaire ? · La CPAM garantit-elle le paiement d'une FSE sécurisée ? · Que faire d'un rejet « prescription interdite à cette date » ? · Combien de temps un centre a-t-il pour refacturer après un rejet CPAM ?
- SERP : forum.epsilog.com, swily.io, agatheyou.fr, caducee.net, mes-debuts-idel.fr, laruche.cbainfo.fr.
- Granit : angle méthode. Le sens des libellés CPAM n'est défini par aucun texte public : causes « probables ». Pas de « délai légal de 2 ans ».
- Existant : `codes-rejets-noemie` (exemples centre de santé, liens vers S2 et X4).
- Terrain : rejets non suivis ; envoi souvent en mode dégradé ; gérant sans visibilité sur ce qui reste dehors.

**S3 · `tiers-payant-centre-ophtalmologie`** (fille de S0, signé Laura)
- Mot-clé : centre ophtalmologique tiers payant. Intention : organisationnelle (direction de structure) ; mot-clé en partie patient, titre et chapô tournés vers la structure.
- Lecteur : direction administrative et financière ou responsable de la facturation d'un centre de santé ophtalmologique.
- Demande : **Faible à Moyen** : « centre ophtalmologique tiers payant », « ophtalmologue tiers payant mutuelle », « facturation orthoptiste salarié ». Demande B2B mince mais qualifiée.
- FAQ : Un centre ophtalmologique est-il obligé de pratiquer le tiers payant ? · Un centre de santé ophtalmologique a-t-il besoin d'un agrément ARS ? · Un centre d'ophtalmologie touche-t-il encore la rémunération forfaitaire ? · Qui facture les actes de l'orthoptiste dans un centre d'ophtalmologie ? · Le tiers payant mutuelle est-il possible sur une consultation d'ophtalmologie ?
- SERP : sicorfe.com, snof.org, pages patient de réseaux de centres, ag2rlamondiale.fr, quechoisir.org.
- Granit : angle méthode. Recentré sur le **centre de santé** ophtalmo (agrément ARS, accord national, tiers payant AMO obligatoire) ; OPTAM réduit à un encadré. Rien sur la télésurveillance.
- Existant : lien vers le cocon optique (le patient repart souvent avec une ordonnance de lunettes), `virement-mutuelle-inferieur`.
- Terrain : en cabinet libéral, le tiers payant se fait surtout sur la part Sécurité sociale, sans mutuelle (d'où le recentrage) ; en centre, coût du logiciel et de la gestion jugé disproportionné, rejets non suivis. Un prospect a trouvé Granit en interrogeant un assistant IA : signal GEO à garder en tête pour la rédaction.

**X3 · `inter-amc-tiers-payant-complementaire`** (tronc, centres, dentaire, pharmacie, parent T0)
- Mot-clé : inter amc. Intention : navigationnelle et pratique (s'inscrire, ce qu'on signe, ce qu'on y gagne).
- Lecteur : responsable facturation de centre de santé, coordinatrice dentaire, référent tiers payant d'officine.
- Demande : **Fort pour la verticale** : dix suggestions (« portail », « connexion », « inscription », « liste mutuelle », « contact », « dentiste »…). Requête de marque d'un outil réellement utilisé ; peu de contenus éditoriaux.
- FAQ : Comment s'inscrire sur le portail Inter-AMC ? · Quelles mutuelles sont couvertes par le contrat Inter-AMC ? · Sous quel délai une mutuelle paie-t-elle une DRE conforme dans le cadre Inter-AMC ? · Le tiers payant est-il obligatoire pour l'examen bucco-dentaire ? · Faut-il encore signer des conventions mutuelle par mutuelle ?
- SERP : tpcomplementaire.fr, inter-amc.fr, l-idel.fr, pkf-arsilon.com, ameli.fr, information-dentaire.fr.
- Granit : angle méthode. Fond : délais du contrat spécimen 2022 (engagement contractuel, version à vérifier) ; section examen bucco-dentaire (tiers payant intégral depuis le 1er avril 2025, soins consécutifs pour les 3-24 ans seulement).
- Existant : `quand-relancer-mutuelle` (jalon 7 jours ouvrés), `impayes-mutuelle-anciens` (demande au plus tard 2 ans après les soins, contractuel).
- Terrain : conventionnement mutuelle par mutuelle long et papier ; recherche d'un point d'entrée unique.

**X4 · `rejet-mutuelle-acte-hors-perimetre`** (tronc, centres, pharmacie, dentaire, parent T0 ; fusion des articles rejet AMC des centres et de la pharmacie)
- Mot-clé : rejet mutuelle acte hors périmètre. Intention : résolution, « j'ai ce libellé, que faire ».
- Lecteur : agent de facturation en centre de santé, préparateur ou adjoint chargé des rejets en officine, assistante dentaire.
- Demande : **Moyen** : « rejet mutuelle » donne dix suggestions dont « acte hors périmètre (signification) », « doublon fonctionnel », « montant demandé montant calculé », « situation bénéficiaire », « prestation non couverte » ; SERP pauvre (forums, aides d'éditeurs).
- FAQ : Que signifie « acte hors périmètre » sur un rejet de mutuelle ? · Que veut dire « doublon fonctionnel » sur un rejet mutuelle ? · Pourquoi la mutuelle rejette-t-elle « montant demandé supérieur au montant calculé » ? · Rejet « hors champ d'application de la convention » : faut-il facturer le patient ? · Comment renvoyer uniquement la part AMC sans renvoyer l'AMO ?
- SERP : droit-finances.commentcamarche.com, forum.epsilog.com, agatheyou.fr, mes-debuts-idel.fr, swily.io, santemobile.io, pulse-sante.zendesk.com.
- Granit : angle méthode. Aucun texte public ne définit ces libellés : causes « probables », à vérifier sur le retour réel ; aucun code numérique sans table d'opérateur.
- Existant : `codes-rejets-noemie`, `recouvrement-patient-empathie` (quand la part n'est pas due par l'AMC).
- Terrain : rejets traités à la main, un par un ; prestataire qui ne traite pas les rejets.

### 5.4 Pharmacies

Le tiers payant officine est très différent de l'optique : pas de PEC sur portail, droits AMC lus dans le LGO, flux unique par concentrateur (OCT) qui éclate la part AMC, conventions souvent syndicales. **Aucun signal terrain** sur le tiers payant en officine et **aucun produit** de tiers payant : un seul pilier, en méthode pure, plus les articles du tronc (X2, X3, X4, C0, C4, C7…).

**PH0 · `gestion-tiers-payant-pharmacie`** (pilier métier, parent T0)
- Mot-clé : gestion tiers payant pharmacie. Intention : informationnelle pro, angle « **après la télétransmission** » (ARL, retours NOEMIE, rejets, relances, rapprochement).
- Lecteur : titulaire d'officine et référent tiers payant (préparateur ou adjoint).
- Demande : **Moyen** : « gestion tiers payant pharmacie offre d'emploi », « gestionnaire tiers payant pharmacie », « formation gestion tiers payant pharmacie ». « tiers payant pharmacie » seul est Fort mais patient : capté en longue traîne, pas en tête.
- FAQ : Comment fonctionne le tiers payant en pharmacie pour la part mutuelle ? · Qu'est-ce qu'un concentrateur (OCT) et est-il obligatoire ? · Peut-on faire le tiers payant sans carte Vitale en pharmacie ? · Que faire quand un ARL est négatif ? · Qui contacter quand une mutuelle ne paie pas ?
- SERP : sapsante.com, spc-tiers-payant.fr, conseiltierspayant.com, comptable-pharmacies.fr, hayot-expertise.fr, lemoniteurdespharmacies.fr, cpcms.fr, ameli.fr (pharmacien).
- Granit : angle méthode, rien à promettre ; **rien sur une intégration LGO ou concentrateur**. L'encart Granit, s'il y en a un, ne parle pas de tiers payant. Neutre entre syndicats. Aucun montant d'indemnité AMC ni de coût caché.
- Existant : R3 `officine-balance-agee-tiers-payant` et R6 `trois-boucles-pharmacie` deviennent ses enfants ; sections officine dans `codes-rejets-noemie`, `quand-relancer-mutuelle`, `virement-mutuelle-inferieur`, `rejet-beneficiaire-inconnu`, F3.
- Terrain : aucun irritant de tiers payant remonté en officine. Ce qui remonte : peur d'empiler les outils et ressaisies dans le LGO (argument pour ne rien promettre d'intégré).

**X2 · `arl-negatif`** (tronc, toutes verticales, parent C0)
- Mot-clé : arl négatif. Intention : résolution urgente.
- Lecteur : la personne qui télétransmet et suit les retours, tous métiers.
- Demande : **Moyen** : « arl négatif », « …que faire », « …2004 », « …secu », « …fse non integre » ; SERP d'aides d'éditeurs et d'ameli, aucune page de référence.
- FAQ : Que faire quand un ARL est négatif ? · Que faire quand on ne reçoit aucun ARL ? · Un ARL positif garantit-il le paiement ? · Faut-il renvoyer les pièces justificatives après un ARL négatif ? · Combien de temps garder les ARL ?
- SERP : ameli.fr, intercom.help/smart-rx, wikiinfi.com, iqthings.io, legifrance.gouv.fr.
- Granit : rien de propre (`granitData` « — »). Les règles relevées (ARL au plus tard le surlendemain, réémission, pièces SCOR) sont des sources **pharmacie** : à sourcer pour chaque profession citée. La réémission reste un geste dans le logiciel de facturation.
- Existant : R3 renvoie vers X2 ; `retour-noemie-sans-virement` en sœur.
- Terrain : paiements attendus non reçus sans alerte (tous métiers en production).

### 5.5 Cliniques et laboratoires

Voir la section 2 pour le fond. Trois entrées propres en **`waiting`**, plus X5 au tronc en `pending`. Angle méthode, rien à promettre, aucun établissement nommé.

**X5 · `idb-clc-roc-tiers-payant`** (tronc, cliniques, centres, dentaire, parent T0, `pending`)
- Mot-clé : dispositif roc. Intention : informationnelle et veille (comprendre IDB, CLC, ROC, savoir où en est le déploiement).
- Lecteur : responsable facturation d'un centre de santé ou d'un centre dentaire, responsable du bureau des entrées d'une clinique.
- Demande : **Faible mais 100 % pro**, en hausse : « dispositif roc », « …mutuelle », « …hopital », « roc tiers payant hospitalier », « roc idb », « idb clc ».
- FAQ : Qu'est-ce que le dispositif ROC ? · Que font les services IDB, SIM et CLC ? · Que se passe-t-il si le logiciel n'a pas pu interroger IDB ? · Les cliniques privées sont-elles concernées par ROC, et quand ? · ROC remplace-t-il les portails des plateformes de tiers payant ?
- SERP : sesam-vitale.fr, esante.gouv.fr, sante.gouv.fr, tpcomplementaire.fr, viamedis.fr, groupe-vyv.fr, sintia.fr, fhpmco.fr.
- Granit : angle méthode. Section clinique datée : pilotes en 2025, montée en charge « envisagée », **jamais une date ferme**. Article à revoir tous les six mois.
- Existant : F0 et F2 reçoivent IDB, CLC, ROC ; X3 en sœur.
- Terrain : vérification des droits faite à la main le jour de l'accueil (laboratoires) ; risque de rejet quand le patient a changé de mutuelle sans le dire.

**K0 · `tiers-payant-clinique-privee`** (pilier métier, parent T0, `waiting`)
- Mot-clé : tiers payant clinique privée. Intention : méthode, comprendre la chaîne entière du séjour.
- Lecteur : responsable du bureau des entrées, de la facturation ou du recouvrement d'une clinique privée.
- Demande : **Faible** côté pro (« tiers payant clinique privée », « tiers payant hospitalier » sans déclinaisons) ; moyenne côté patient.
- FAQ : Est-ce à la clinique ou au patient de demander la prise en charge à la mutuelle ? · Que faire si la prise en charge n'est pas arrivée le jour de l'admission ? · La mutuelle doit-elle rembourser le forfait journalier ? · Qui facture les dépassements d'honoraires du chirurgien : la clinique ou le praticien ?
- SERP : ameli.fr (assuré), pages de mutuelles, livrets d'accueil de cliniques, comptemutuelle.info, compteassurance.com, mystarweb.fr.
- Granit : rien à promettre (pas de PEC hospitalière, aucun call).
- Existant : aucun ; `hopital-prive-ordonnancement` n'est **pas** transféré.
- Terrain : aucun call clinique. Le seul signal indirect vient des laboratoires, qui facturent les cliniques en B2B.

**K1 · `demande-prise-en-charge-hospitaliere`** (fille de K0, `waiting`)
- Mot-clé : demande de prise en charge hospitalière. Intention : procédurale.
- Lecteur : agent du bureau des entrées ou des pré-admissions.
- Demande : **Moyen**, la meilleure de la verticale, mais mixte (une bonne part patient) : « demande de prise en charge hospitalière + viamedis / almerys / isante / mutuelles ».
- FAQ : Quelles informations faut-il pour demander une prise en charge hospitalière ? · Comment savoir quel portail utiliser pour une mutuelle donnée ? · Que faire en cas de refus de prise en charge hospitalière ? · Une prise en charge couvre-t-elle la chambre particulière ? · Que faire si le séjour est prolongé au-delà de la prise en charge ?
- SERP : comptemutuelle.info, compteassurance.com, mystarweb.fr, conseilassurancesecurite.fr, FAQ de mutuelles, livrets de cliniques.
- Granit : rien à promettre. Le canal réel de la part AMC en clinique n'est pas documenté de façon primaire ; validité d'une PEC hospitalière : ne rien affirmer.
- Existant : sections « Prise en charge hospitalière » courtes dans les fiches portail Viamedis, Almerys, iSanté, SP Santé.
- Terrain : aucun.

**K2 · `rejets-fse-laboratoire`** (fille de K0, `waiting`)
- Mot-clé : rejets fse laboratoire (à mesurer). Intention : résolution et méthode à volume.
- Lecteur : responsable facturation ou équipe des rejets d'un laboratoire multisite.
- Demande : **Très faible** (aucune suggestion pro sur la biologie) : contenu de vente tant que le POC n'a pas de résultat validé.
- FAQ : Comment traiter un rejet FSE en laboratoire ? · Que contient un retour NOEMIE pour un laboratoire ? · Que faire d'un rejet mutuelle « droits fermés » sur un petit montant ? · Comment éviter un rejet quand le patient a changé de mutuelle sans le dire ? · Pourquoi le patient paie-t-il quelque chose au laboratoire malgré sa mutuelle ?
- SERP : pages patient des réseaux de laboratoires, comparateurs, prestataires de recouvrement spécialisés, cabinets comptables.
- Granit : rien à promettre (aucun laboratoire en production, aucune intégration SIL promise).
- Existant : `codes-rejets-noemie` (les laboratoires reçoivent des retours NOEMIE), `retour-noemie-sans-virement`.
- Terrain : rejets FSE répétitifs qui saturent les équipes en période de congés ; droits mutuelle non vérifiés à l'accueil ; paiements mutuelles pointés à la main.

---

## 6. Maillage et ordre de publication

### Types de liens (`internalLinks`)

| De → vers | Type | Règle |
|---|---|---|
| Article → son pilier (métier ou tronc) | `parent` | Toujours, en premier |
| Pilier → ses articles | `enfant` | Liste complète dans la file ; le moteur ne garde que les cibles en ligne |
| Article ↔ article du même parent | `sœur` | 2 à 3 par article ; le moteur ajoute le lien de retour depuis le parent et les sœurs |
| Article métier → article du tronc | `transverse` | 1 à 3 (ex. D0 → `rapprochement-bancaire-tiers-payant`, `prise-en-charge-refusee`, `tiers-payant-css`) |
| Article du tronc → pilier métier | `transverse` ou `sœur` | Seulement vers des piliers en ligne ; T0 lie les 5 piliers métier en `enfant` |
| Tout article → outil | `outil` | `mutuelle-quel-portail` : optique, audio et dentaire seulement |
| Article → `/demo` | `conversion` | Au plus 1, et **seulement en audio** (AU0, AU3) ; nulle part ailleurs hors optique |

Exceptions voulues : AU4 ↔ B5 `tiers-payant-css` en `sœur` (parents différents, décision d'arbitrage) ; B3 et B7 ne sont jamais liés depuis les entrées cliniques.

### Ordre : pilier avant enfants

Le moteur prend la **première entrée `pending` de la file**, un article par jour ouvré. L'ordre d'insertion décide donc de tout. Règles :
1. T0, C0 et chaque pilier métier passent **avant** leurs enfants (sinon l'enfant n'a jamais de lien vers son parent dans le corps).
2. Alternance de Paul : 2 cases optique, 1 case autre verticale, rotation dentaire → centres → cliniques → pharmacie. Un article du tronc tagué `optique` et l'audio occupent une case optique ; tant que K0 est en `waiting`, la case cliniques va à X5.
3. Les articles datés passent tôt : X1 doit sortir **avant le 1er janvier 2027** (environ 40 jours ouvrés à partir du 4 novembre), AU0 monte en tête des cases optique.

L'ordre retenu est celui de `articles-queue.v5.json` (61 entrées à publier ou en attente, après les 31 publiées et les 2 en relecture). À appliquer **après** les correctifs moteur de la section 9. Les entrées cliniques K0, K1 et K2 sont à leur place mais en `waiting` : le moteur les saute, donc tant qu'elles ne passent pas en `pending`, quatre cases optique se suivent à ces endroits. X1 (`ticket-moderateur-2027-tiers-payant`) sort en 7e position, vers le 12 novembre si la file v5 est en place le 4. Après la 45e entrée, il ne reste que de l'optique et du tronc : une vague 5 d'articles métier est à préparer d'ici janvier.

| # | Case | Id | Slug | Statut |
|---|---|---|---|---|
| 1 | optique (tronc) | T0 | `tiers-payant-professionnels-de-sante` | pending |
| 2 | optique (tronc) | C0 | `rapprochement-bancaire-tiers-payant` | pending |
| 3 | dentaire | D0 | `tiers-payant-dentaire` | pending |
| 4 | optique (tronc) | F0 | `glossaire-tiers-payant` | pending |
| 5 | optique (audio) | AU0 | `tiers-payant-audioprothesiste` | pending |
| 6 | centres | S0 | `tiers-payant-centre-de-sante` | pending |
| 7 | optique (tronc) | X1 | `ticket-moderateur-2027-tiers-payant` | pending |
| 8 | optique | A10 | `portail-kalixia` | pending |
| 9 | cliniques (tronc) | X5 | `idb-clc-roc-tiers-payant` | pending |
| 10 | optique | G1 | `100-sante-classe-a-b-opticien` | pending |
| 11 | optique (audio) | AU1 | `pec-audio-plateformes-tiers-payant` | pending |
| 12 | pharmacie | PH0 | `gestion-tiers-payant-pharmacie` | pending |
| 13 | optique (tronc) | F2 | `sigles-tiers-payant-noemie` | pending |
| 14 | optique | A11 | `portail-carte-blanche` | pending |
| 15 | dentaire | D1 | `pec-dentaire-portails-mutuelles` | pending |
| 16 | optique (tronc) | F1 | `amo-amc` | pending |
| 17 | optique (tronc) | C4 | `retour-noemie-sans-virement` | pending |
| 18 | centres (tronc) | X3 | `inter-amc-tiers-payant-complementaire` | pending |
| 19 | optique (audio) | AU3 | `paiement-audioprothese-bloque` | pending |
| 20 | optique (tronc) | E1 | `gestionnaire-tiers-payant` | pending |
| 21 | cliniques | K0 | `tiers-payant-clinique-privee` | waiting |
| 22 | optique (tronc) | B2 | `refacturer-part-mutuelle` | pending |
| 23 | optique (tronc) | B3 | `prise-en-charge-refusee` | pending |
| 24 | pharmacie (tronc) | X4 | `rejet-mutuelle-acte-hors-perimetre` | pending |
| 25 | optique (tronc) | C5 | `libelles-virements-tiers-payant` | pending |
| 26 | optique (audio) | AU4 | `aides-auditives-css-tiers-payant` | pending |
| 27 | dentaire | D2 | `actes-hors-nomenclature-dentaire` | pending |
| 28 | optique | G3 | `questions-tiers-payant-opticien` | pending |
| 29 | optique (tronc) | B6 | `ouvrant-droit-beneficiaire` | pending |
| 30 | centres | S1 | `accord-national-centres-de-sante` | pending |
| 31 | optique (tronc) | B7 | `contester-refus-prise-en-charge` | pending |
| 32 | optique (tronc) | B9 | `client-sans-carte-tiers-payant` | pending |
| 33 | cliniques | K1 | `demande-prise-en-charge-hospitaliere` | waiting |
| 34 | optique (tronc) | B10 | `reduire-taux-rejet-tiers-payant` | pending |
| 35 | optique (audio) | AU2 | `codes-lpp-audioprothese-facturation` | pending |
| 36 | pharmacie (tronc, tous métiers) | X2 | `arl-negatif` | pending |
| 37 | optique (tronc) | C7 | `impayes-mutuelle-anciens` | pending |
| 38 | optique | H0 | `conformite-opticien` | pending |
| 39 | centres | S2 | `rejet-cpam-centre-de-sante` | pending |
| 40 | optique | H2 | `devis-normalise-codes-lpp` | pending |
| 41 | optique (tronc) | H6 | `reseaux-de-soins-conventionnement` | pending |
| 42 | cliniques | K2 | `rejets-fse-laboratoire` | waiting |
| 43 | optique | E4 | `automatiser-saisie-prise-en-charge` | pending |
| 44 | optique (tronc) | E5 | `cout-temps-tiers-payant` | pending |
| 45 | centres | S3 | `tiers-payant-centre-ophtalmologie` | pending |
| 46 | optique | A19 | `itelis-conventionnement` | pending |
| 47 | optique | A17 | `sp-sante-espace-pro` | pending |
| 48 | optique | A16 | `viamedis-prise-en-charge` | pending |
| 49 | optique | A18 | `isante-prise-en-charge` | pending |
| 50 | optique | G2 | `remboursement-optique-amo-amc` | pending |
| 51 | optique | E3 | `logiciel-opticien-tiers-payant` | pending |
| 52 | optique | B4 | `renouvellement-lunettes-moins-2-ans` | pending |
| 53 | optique (tronc) | B5 | `tiers-payant-css` | pending |
| 54 | optique (tronc) | G5 | `tiers-payant-integral` | pending |
| 55 | optique (tronc) | G6 | `cas-particuliers-tiers-payant` | pending |
| 56 | optique (tronc) | F3 | `carte-vitale-carte-tiers-payant` | pending |
| 57 | optique | H1 | `controle-assurance-maladie-opticien` | pending |
| 58 | optique | H3 | `conservation-dossiers-tiers-payant` | pending |
| 59 | optique | H4 | `fraude-tiers-payant-optique` | pending |
| 60 | optique | H5 | `rgpd-donnees-sante-opticien` | pending |
| 61 | optique (tronc) | E6 | `indicateurs-tiers-payant` | pending |

### Limites du moteur qui contraignent cet ordre

- Un article publié avant son parent n'a jamais de lien vers lui dans le corps (déjà le cas de C1 à C3, publiés avant C0).
- Les liens `transverse` n'ont pas de retour : un pilier métier publié tôt ne gagnera pas les liens vers les articles du tronc sortis après lui. Deux solutions : ajouter un `liensEntrants` dans les piliers en ligne désignés en `transverse` (étape 6 de `publish-article.mjs`), ou réviser les 5 piliers métier tous les deux mois.
- Les liens vers une cible hors ligne sont filtrés silencieusement (`publish-article.mjs`, `liensPrevus`). Conséquences : les liens vers `tiers-payant-css` et `tiers-payant-integral` ne joueront qu'une fois B5 et G5 renommés et publiés ; le lien `conversion` vers `/demo` n'est pas une page Ressources et sera **toujours filtré** tant que le moteur ne traite pas ce type à part.

---

## 7. Écartés et pourquoi

| Sujet | Décision | Raison |
|---|---|---|
| Audio A5 `piles-suivi-audioprothese-facturation` | Fusionné dans AU2 | PIL et SUI sont des codes ; lien produit mince ; montant « 0,01 € » non confirmé |
| Audio A6 `devis-normalise-audioprothese` | Fusionné dans AU0 | Demande faible ; point sur les codes LPP au devis non vérifié |
| Dentaire 3 `remboursement-dentaire-2027-tiers-payant` | Devient X1 | Requête patient ; article du tronc sur les décrets du 21 août 2026, mot-clé pro, sans taux |
| Dentaire 4 `tiers-payant-centre-dentaire` | Fusionné dans D0 | Doublon d'intention avec le pilier |
| Dentaire 5 `inter-amc-dentiste-examen-bucco-dentaire` | Fusionné dans X3 | Doublon de « inter amc » |
| Centres A2 `inter-amc-tiers-payant-complementaire` | Devient X3 (tronc) | Ouvert au dentaire et à la pharmacie |
| Centres A3 `rejet-mutuelle-acte-hors-perimetre` | Devient X4 (tronc) | Mêmes libellés que l'article pharmacie |
| Pharmacie 2 `rejet-mutuelle-pharmacie` | Fusionné dans X4 | Doublon d'intention, pas de lien produit |
| Pharmacie 4 `arl-negatif-pharmacie` | Devient X2 (tronc) | Demande de toutes les professions qui télétransmettent |
| Pharmacie 3 `convention-tiers-payant-pharmacie` | Supprimé | Aucune suggestion, sujet de politique syndicale, chiffres non publics |
| Pharmacie 5 `indu-cpam-pharmacie` | Supprimé | Quasi-conseil juridique, actualité instable (PLFSS non voté), aucun lien produit |
| Pharmacie 6 `externaliser-tiers-payant-pharmacie` | Supprimé | Présenterait Granit comme une alternative aux sociétés de gestion en officine, service qu'il n'offre pas |
| Cliniques `code-dmt-hospitalisation` | Supprimé | Intention patient, aucune nomenclature officielle trouvée, aucun lien produit |
| Cliniques `chambre-particuliere-clinique-facturation` | Supprimé | Intention patient forte, demande pro faible, hors produit |
| Cliniques `creances-mutuelles-clinique` | Supprimé | Optionnel, doublon de C7, demande nulle |
| Cliniques `roc-clinique-privee` | Devient X5 (tronc) | IDB et CLC servent déjà aux centres et au dentaire |
| File C8 `reste-a-charge-impaye` | Supprimé | Doublon de `recouvrement-patient-empathie` |
| File G4 `erreurs-tiers-payant-opticien` | Supprimé | Doublon de la checklist, de `rejet-tiers-payant` et de B10 |
| File C6 `delais-paiement-plateformes` | Repoussé (`waiting`) | Données de production non validées |
| File E7 `conges-dossiers-tiers-payant` | Repoussé (`waiting`) | Saisonnier, mai 2027 |

Écartés en amont par les consultants (patient, codage ou hors produit) : 100 % Santé audio et classes d'appareils, période d'essai, comparatifs de mutuelles, logiciels métier (audio, dentaire), page par plateforme en audio, fraude audio en article autonome, MDPH ; rejets dentaires en article à part, devis dentaire (couvert par R4), orthodontie (R1), implants côté patient ; cotation CCAM ophtalmo et orthoptie, OPTAM seul, centre multi-sites et tableau de bord (fondus dans S0 et E6) ; sans carte Vitale et CSS en pharmacie (encadrés), génériques, SCOR ; forfait journalier, dépassements en clinique, T2A et PMSI, NABM, Mon test IST, hôpitaux publics, HAD.

---

## 8. Faits réglementaires : statut et source

Toute affirmation réglementaire de ce document renvoie à une ligne de ce tableau. « NON CONFIRMÉ » = à ne pas écrire tel quel dans un article ; « FAUX corrigé » = l'erreur relevée et sa correction.

| # | Fait | Statut | Source primaire |
|---|---|---|---|
| 1 | Décret n° 2026-809 du 21 août 2026 (JO du 22 août) : participation de l'assuré portée de 35-45 % à 50-60 % (R160-5, 3° bis), au 1er janvier 2027 | CONFIRMÉ | https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000054733581 |
| 2 | Taux applicable en 2027 fixé par l'Uncam | NON CONFIRMÉ (aucune décision ni arrêté publié au 22 octobre 2026) : ne rien chiffrer | Même décret ; presse secondaire |
| 3 | Décret n° 2026-810 (dispositifs médicaux, optique et audio) : ticket modérateur LPP de 40-50 % à 50-60 % au 1er janvier 2027 | CONFIRMÉ par sources secondaires seulement ; JORFTEXT à récupérer sur Légifrance | https://www.legifrance.gouv.fr (texte à retrouver) |
| 4 | Exemples « AMO 60 % » (audio, dentaire, optique) | À dater : vrais jusqu'au 31 décembre 2026, taux 2027 à confirmer | Voir 1 et 3 ; https://www.ameli.fr/professionnel-de-la-lpplatm/exercice-professionnel/facturation/aide-auditive-dans-le-cadre-du-100-sante |
| 5 | L6323-1-7 CSP : tiers payant (part AMO) et pas de dépassement en centre de santé ; pas de paiement intégral exigé pour des soins non dispensés | CONFIRMÉ (en vigueur depuis le 21 mai 2023) | https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000047567936 |
| 6 | Audio : carte Vitale obligatoire pour le tiers payant depuis le 1er janvier 2025 ; ADRi ; facture après un essai de 30 jours minimum ; exceptions AME et détenus | CONFIRMÉ | https://www.ameli.fr/professionnel-de-la-lpplatm/textes-reference/conventions-nationales-avenants/la-convention-des-audioprothesistes-et-ses-avenants/avenant-1-la-convention-des-audioprothesistes-lutte-contre-la-fraude |
| 7 | Avenant 1 à la convention des audioprothésistes signé le 18 octobre 2024 | FAUX corrigé : signé le **4 novembre 2024** (JORFTEXT000050714807) | Même page ameli |
| 8 | Audio CSS : 800 € par oreille (20 ans et plus), 1 400 € (moins de 20 ans, ou personne sourde et aveugle), codes P2G/P2D, prise en charge à 100 % | CONFIRMÉ (revérifier le jour de la rédaction) | https://www.ameli.fr/professionnel-de-la-lpplatm/exercice-professionnel/facturation/aide-auditive-dans-le-cadre-du-100-sante |
| 9 | Prestation de suivi audio « valorisée à 0,01 € » | NON CONFIRMÉ (ameli dit « prise en charge à 100 % », sans montant) | Même page ameli |
| 10 | Audio : renouvellement pas avant 4 ans par oreille ; ordonnance sans durée de validité (R165-40 non applicable) ; devis normalisé (arrêté du 29 août 2019) | Relevé par le consultant, NON CONFIRMÉ par la relecture | https://www.legifrance.gouv.fr/eli/arrete/2018/11/14/SSAS1830986A/jo/texte ; https://www.legifrance.gouv.fr/affichCodeArticle.do?idArticle=LEGIARTI000026153100&cidTexte=LEGITEXT000006073189 ; https://www.ameli.fr/professionnel-de-la-lpplatm/exercice-professionnel/vie-professionnelle/competences-obligations/audioprothesistes-devis-normalise |
| 11 | Examen bucco-dentaire en tiers payant intégral (AMO + AMC) depuis le 1er avril 2025 ; adhésion Inter-AMC puis 5 jours avant les premières DRE | CONFIRMÉ | https://www.ameli.fr/chirurgien-dentiste/exercice-liberal/facturation-remuneration/pratique-tiers-payant/tiers-payant-examen-bucco-dentaire-soins |
| 12 | Soins consécutifs à l'EBD en tiers payant pour tous les bénéficiaires de l'examen | FAUX corrigé : **seulement pour les 3-24 ans** ; pour les femmes enceintes, l'examen seul | Même page ameli |
| 13 | Répartition 60 % AMO / 40 % AMC de l'EBD en 2027 | NON CONFIRMÉ pour 2027 (le décret garantit l'absence de reste à charge, pas la répartition) | Même page ameli ; voir 1 |
| 14 | Accord national des centres de santé : signé le 28 août 2025, réputé approuvé le 1er octobre 2025, JO du 15 octobre 2025 ; manquement « de façon répétée » pour la dispense d'avance sans carte Vitale ; exclusion de la rémunération forfaitaire si une activité de second recours (filière visuelle) fait 50 % ou plus des recettes | CONFIRMÉ | https://www.ameli.fr/exercice-coordonne/textes-reference/accord-national/accord-national-centres-sante ; https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000052391780 |
| 15 | Accord des centres de santé : « FSE sécurisée, mode de facturation privilégié » | NON CONFIRMÉ (absent de la page ameli) | Même page ameli |
| 16 | Agrément ARS de l'ophtalmologie, de l'orthoptie **et du dentaire** en centre de santé (loi du 19 mai 2023) ; centres existants agréés avant le 21 novembre 2025 | CONFIRMÉ | https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000047567907 ; https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000047561943 |
| 17 | C2S et AME : tiers payant intégral « par la caisse » | NON CONFIRMÉ tel quel : la part complémentaire de la C2S peut être gérée par un organisme choisi par l'assuré | https://www.ameli.fr/medecin/exercice-liberal/facturation-remuneration/tiers-payant-modalites-regles-facturation/tiers-payant-modalites-regles-facturation |
| 18 | Contrat Inter-AMC : paiement sous 7 jours ouvrés après une DRE conforme (20 sur papier) ; demande au plus tard 2 ans après les soins ; trop-perçus 5 ans | CONFIRMÉ sur le **spécimen** « Centre de santé » version 03 du 24 août 2022 (vérifier qu'il n'existe pas plus récent ; engagement contractuel, pas règle légale) | https://www.tpcomplementaire.fr/iamcps/telechargerDocument?filename=CSTE-SPECIMEN.pdf |
| 19 | « Délai légal de 2 ans pour facturer » (L332-1 CSS) | FAUX corrigé : depuis le 1er janvier 2016, L332-1 ne vise que les prestations en espèces ; les 2 ans d'une feuille de soins sont une règle côté assuré ; L161-33 ne fixe aucun délai chiffré ; côté professionnel, le seul « 2 ans » sûr est contractuel (Inter-AMC, ligne 18) | https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000031686666 ; https://www.service-public.fr/particuliers/vosdroits/F11616 ; https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000043498632 |
| 20 | R161-47 CSS : transmission de la FSE sous 8 jours ouvrés en dispense d'avance ; conservation des FSE et ARL 90 jours au moins | CONFIRMÉ sur le délai ; son dépassement n'entraîne pas de déchéance (Cass. 2e civ., 8 octobre 2015, n° 14-20252) | https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000006746783 |
| 21 | ARL envoyé au plus tard le surlendemain ; réémission du lot et des pièces après un ARL négatif | Relevé sur des sources **pharmacie**, NON CONFIRMÉ pour les autres professions | https://www.ameli.fr/pharmacien/exercice-professionnel/teletransmission/teletransmission/teletransmission-fse-mode-emploi ; https://www.legifrance.gouv.fr/loda/article_lc/LEGIARTI000047790267 |
| 22 | Pharmacie : carte Vitale exigée pour le tiers payant depuis juin 2025 ; exceptions AME, nourrissons de moins de 3 mois, résidents d'EHPAD, demandeurs d'asile | CONFIRMÉ | https://www.ameli.fr/pharmacien/exercice-professionnel/pratique-tiers-payant/modalites-regles-facturation |
| 23 | Pharmacie : paiement AMO en 4 jours ouvrés ; tiers payant contre génériques étendu au 1er septembre 2026 ; article 32 du PLFSS 2027 (un an pour l'action en paiement) | NON CONFIRMÉ (le PLFSS n'est pas voté : au conditionnel ou pas du tout) | https://www.ameli.fr/pharmacien/exercice-professionnel/pratique-tiers-payant/modalites-regles-facturation ; https://www.ameli.fr/pharmacien/exercice-professionnel/pratique-tiers-payant/tiers-payant-generiques |
| 24 | « Tiers payant obligatoire sur le panier 100 % Santé » pour le professionnel | NON CONFIRMÉ (aucune obligation trouvée) : à sourcer ou à retirer | https://www.service-public.fr/particuliers/vosdroits/F34729 ; https://www.service-public.fr/particuliers/vosdroits/F167 |
| 25 | ROC étendu aux cliniques privées (ROC V2), montée en charge en septembre 2026 | NON CONFIRMÉ comme fait : 2 établissements pilotes à la rentrée 2025, montée en puissance seulement « envisageable » à partir de septembre 2026, aucune obligation | https://www.fhpmco.fr/2025/07/21/roc-place-aux-cliniques-et-hopitaux-prives/ ; https://www.sesam-vitale.fr/roc-es ; https://sante.gouv.fr/professionnels/gerer-un-etablissement-de-sante-medico-social/performance-des-etablissements-de-sante/simphonie/article/roc-le-remboursement-des-organismes-complementaires |
| 26 | Forfait journalier hospitalier de 23 €, 17 € en psychiatrie, depuis le 1er mars 2026, dû aussi le jour de sortie | CONFIRMÉ | https://www.ameli.fr/assure/remboursements/reste-charge/forfait-hospitalier |
| 27 | Contrat responsable : forfait journalier couvert sans limitation de durée (R871-2 CSS) | Relevé par le consultant, NON CONFIRMÉ par la relecture (URL à rouvrir) | https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000052861614 |
| 28 | Chambre particulière : R162-27 CSS « en vigueur depuis le 1er janvier 2025 » ; Mon test IST (60 % AMO / 40 % AMC au-delà de 26 ans) | NON CONFIRMÉ | https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000050942717 ; https://www.ameli.fr/laboratoire-danalyses-medicales/exercice-liberal/prise-charge-patients/depistage-ist/mon-test-ist-depistage-en-laboratoire-sans-ordonnance |
| 29 | Libellés de rejet AMC (« acte hors périmètre », « doublon fonctionnel », « montant demandé / montant calculé ») et CPAM (« pas de traitement OC », « invalidation à l'initiative de la caisse ») | Aucun texte public ne les définit : causes « probables » seulement | Retours réels (bordereaux, NOEMIE) ; contrat Inter-AMC (ligne 18) pour le « rejet motivé » |

---

## 9. Risques moteur bloquants avant de publier hors optique

**Aucun article non optique (T0 compris) ne doit sortir avant les correctifs 1 à 4 et 6.** Sinon l'article est écrit pour l'opticien et l'encart final promet, sur une page dentaire ou pharmacie, des dépôts de PEC que Granit n'y fait pas.

| # | Risque | Effet | Correctif |
|---|---|---|---|
| 1 | Le `reader` est ignoré hors refonte : `BLOG_CMS_granit.md` impose « par défaut, la personne qui fait le tiers payant dans un magasin d'optique », et le message propose des liens « pour un opticien » | Articles dentaire ou multi-métiers écrits pour l'opticien | Dans `publish-article.mjs` (`message()`), appliquer la consigne « le lecteur n'est pas l'opticien » dès que `reader` ou `verticales` ne désignent pas l'optique seule ; « exemples tirés de chaque métier » pour le tronc ; « pour ce lecteur » au lieu de « pour un opticien » |
| 2 | `BLOG_CMS_granit.md` se contredit (« pas d'article audioprothèse »), ne liste que des sources optique, verrouille le gabarit plateforme sur l'optique | Sources introuvables, deux refus de `verifierSources` arrêtent la journée de publication | PR sur BLOG_CMS : lecteur par métier, sources officielles par profession (les URL de la section 8), suppression de la phrase sur l'audio |
| 3 | La relecture (`lib/relecture.mjs`, `REGLES` en dur) parle d'« un opticien ou une assistante au comptoir » et applique les règles portail à tout | Le correcteur ramène l'article vers l'optique | Paramétrer `REGLES` avec `ctx.meta.reader` ; règles portail limitées au type `plateforme` |
| 4 | Encart final et cartes `agent` des catégories promettent des capacités validées en optique et audio seulement | Promesse fausse sur une page dentaire, centres, pharmacie ou clinique | Encart par verticale (`verticales.json` → `agent`) ; d'ici là, `granitData` « — » hors optique et audio |
| 5 | Signature : les catégories `guide-tiers-payant` et `glossaire` sont signées par une rédactrice « experte métier optique » | Problème d'E-E-A-T sur T0, les piliers métier, X5, K0 | `auteur: "laura"` posé sur T0, AU0, AU4, D0, S0, S3 ; à décider pour X5 et K0 (catégorie guide, non prévus par l'arbitrage) |
| 6 | Une entrée sans `verticales` retombe sur l'optique (`verticalesDe`, `metierDe`) | Article dentaire affiché sur la page optique | Champ `verticales` obligatoire, contrôlé par un test dans `scripts/seo-engine/tests` (les 22 nouvelles entrées le portent) |
| 7 | Ordre et maillage : enfant publié avant son parent sans lien vers lui ; `transverse` sans retour ; liens hors ligne filtrés (dont `/demo`) | Maillage incomplet | Ordre de la section 6 ; `liensEntrants` pour les `transverse` ; traitement à part du type `conversion` |
| 8 | Les `remplace` divergent entre la file et les JSON publiés | Un ancien article remplacé deux fois casse le build (`en-ligne.mjs`, `controler`) | Retirer `groupes-multi-sites-pilotage` de `tiers-payant-opticien.json` dans la même PR que S0 |
| 9 | `unsplashQuery` n'est lu par aucun code | Confusion seulement | Valeurs neutres dans les nouvelles entrées |
| 10 | Les données de conversion (`granitData`) viennent de clients optique | Généralisation abusive | Sur le tronc, « dans les dossiers optique et audio que traitent nos agents », sans chiffre |

Préalables de file, hors moteur : renommer B5, G5 et G6 (slugs sans « opticien »/« optique »), passer C0 et les autres entrées du tronc sous T0, retirer `cliniques` de B3 et B7, corriger l'exemple de dépassement de `recouvrement-patient-empathie`.
