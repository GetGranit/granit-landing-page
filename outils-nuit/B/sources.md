# Outil B · Remboursement — sources, couverture, points à vérifier

Généré le 18/11/2026 (équipe de nuit, data-B). Données : `donnees.json` (296 entrées). Formules : `formules.md`.
Scripts : `outils-nuit/B/scripts/` (`maj.py` régénère tout ; `construire.py` fabrique `donnees.json`).

## En bref

| Métier | Entrées | `sur` | `a_verifier` | Base officielle lue |
|---|---|---|---|---|
| Optique | 201 | 201 | 0 | Base LPP de l'Assurance Maladie, version 910 (MAJ 13/11/2026) + taux ameli |
| Audio | 8 | 8 | 0 | Base LPP v910 + page ameli aides auditives |
| Dentaire | 40 | 31 | 9 | Tableau ameli des honoraires limites (au 01/01/2026) ; soins : page ameli assuré |
| Pharmacie | 47 | 23 | 24 | BDPM (MAJ 03/11/2026) recoupée avec les fiches BdM_IT de l'Assurance Maladie (MAJ 17/11/2026) |

**Le plus important pour la suite** : au 01/01/2027, trois décrets du 21/08/2026 font baisser la part Sécu
en dentaire (n° 2026-809), en optique et audio (n° 2026-810) et sur les médicaments à 30 % et 15 % (n° 2026-811).
Les taux exacts n'étaient pas publiés au 18/11/2026. Voir « Ce qui change au 01/01/2027 ».
L'article du site `ticket-moderateur-2027-tiers-payant` ne cite que le décret dentaire : à corriger (voir « Erreurs »).

## Sources (identifiants de `donnees.json`)

| id | Source | Date de la source | Consultée | Comment elle a été lue |
|---|---|---|---|---|
| `lpp-cnam-v910` | Base LPP (TIPS), fichier `LPP910.zip` (DBF fiche + historique), [page de téléchargement](http://www.codage.ext.cnamts.fr/codif/tips//telecharge/index_tele.php?p_site=AMELI) | 13/11/2026 (version 910) | 18/11/2026 | curl. **En http** : la poignée de main TLS de `www.codage.ext.cnamts.fr` est coupée via le proxy (« connection reset ») ; voir « Réseau ». Champs utilisés : `TARIF` (= BR), `PUREGLEMEN` (= prix unitaire réglementé = PLV), `DEBUTVALID` (date d'effet), `ARRETE`, `JO`, `AGE_MAX` (description des champs : `lisezmoi.doc` du zip) |
| `ameli-taux` | [Tableaux récapitulatifs des taux de remboursement](https://www.ameli.fr/assure/remboursements/rembourse/tableau-recapitulatif-taux-remboursement) | 30/09/2026 | 18/11/2026 | Linkup (ameli refuse curl et Chromium headless : défi Cloudflare) |
| `ameli-optique` | [Lunettes et lentilles : quelle prise en charge ?](https://www.ameli.fr/assure/remboursements/rembourse/soins-protheses-dentaires-optique-audition/lunettes-lentilles) | 13/01/2026 | 18/11/2026 | Linkup |
| `ameli-audio` | [Aides auditives : quelle prise en charge ?](https://www.ameli.fr/assure/remboursements/rembourse/soins-protheses-dentaires-optique-audition/protheses-auditives) | 20/02/2026 | 18/11/2026 | Linkup |
| `ameli-dentiste-tarifs-hlf` | [Les tarifs conventionnels (chirurgien-dentiste)](https://www.ameli.fr/chirurgien-dentiste/exercice-liberal/facturation-remuneration/tarifs-conventionnels/tarifs), tableau « Honoraires limites de facturation des prothèses dentaires (au 1er janvier 2026) » | page du 03/02/2026, tarifs au 01/01/2026 | 18/11/2026 | Linkup ; recopié dans `scripts/B/saisie/dentaire_ameli_2026.json` (31 actes, relus un par un) |
| `ameli-assure-soins-dentaires` | [Consultations et soins dentaires : vos remboursements](https://www.ameli.fr/assure/remboursements/rembourse/soins-protheses-dentaires-optique-audition/consultations-soins-protheses-dentaires/consultations-soins-dentaires) | page du 02/02/2026, tarifs au 25/10/2024 | 18/11/2026 | Linkup |
| `ameli-franchise` | [La franchise médicale](https://www.ameli.fr/assure/remboursements/reste-charge/franchise-medicale) | 29/09/2026 | 18/11/2026 | Linkup |
| `bdpm-cis-cip` | [BDPM, téléchargement](https://base-donnees-publique.medicaments.gouv.fr/telechargement) : `CIS_bdpm.txt`, `CIS_CIP_bdpm.txt` (+ notice de format v5) | 03/11/2026 | 18/11/2026 | curl https |
| `bdmit-cnam` | [BdM_IT](http://www.codage.ext.cnamts.fr/codif/bdm_it/index.php?p_site=AMELI), fiche CIP de chacun des 47 médicaments (historique des prix et taux, groupe TFR, « tarif de remboursement ajusté ») | 17/11/2026 (version 1541) | 18/11/2026 | curl http (même problème TLS), une fiche toutes les 6 s |
| `css-r871-2` | [CSS art. R871-2](https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000038035521) (contrat responsable) | version du 28/11/2025 | 18/11/2026 | WebFetch (Légifrance refuse curl / Chromium / Linkup) |
| `css-l871-1` | [CSS art. L871-1](https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000051382496) | version du 28/02/2025 | 18/11/2026 | WebFetch |
| `css-r160-5-2026` | [CSS art. R160-5](https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000053285637), version en vigueur depuis le 01/01/2026 | 01/01/2026 | 18/11/2026 | extrait Légifrance renvoyé par la recherche Linkup |
| `css-r160-5-2027` | [CSS art. R160-5, version au 01/01/2027](https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000054739003/2027-01-01) | 01/01/2027 | 18/11/2026 | WebFetch |
| `decret-2026-809` | [Décret n° 2026-809 du 21/08/2026](https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000054733581) (dentaire) | JO 22/08/2026 | 18/11/2026 | WebFetch de la version R160-5 2027 + recherche ; contenu recoupé avec 5 articles de presse |
| `decret-2026-810` | [Décret n° 2026-810 du 21/08/2026](https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000054733591) (LPP) | JO 22/08/2026 | 18/11/2026 | WebFetch (texte : art. 1 = R160-5 8° 40/50 % → 50/60 %, 19° et 20° 35/45 % → 50/60 % ; art. 2 = entrée en vigueur 01/01/2027) |
| `decret-2026-811` | [Décret n° 2026-811 du 21/08/2026](https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000054733601) (médicaments) | JO 22/08/2026 | 18/11/2026 | WebFetch (6° 70/75 → 85/95 % ; 7° 85/90 → 93/97 % ; 14° 80/90 → 93/97 % ; 15° 70/75 → 85/95 % ; entrée en vigueur 01/01/2027) |
| `jorf-dila-novembre-2026` | [Archives quotidiennes du JO (DILA)](https://echanges.dila.gouv.fr/OPENDATA/JORF/), 21 fichiers du 08/11 au 18/11/2026 | 18/11/2026 | 18/11/2026 | curl https, lus par `grep_jorf.py` / `lire_jorf.py` |

Recoupements (non cités par entrée, mais lus) :
- [metiers.sante.gouv.fr, « La réforme 100 % Santé optique »](https://metiers.sante.gouv.fr/systeme-de-sante/100pourcent-sante/espace-professionnels/les-nouvelles-mesures-optique/article/la-reforme-100-sante-optique) (extrait de recherche) : équipement faible correction 95 € dont 30 € de monture, 180 € en progressifs. La base LPP donne exactement 30 + 2 × 32,50 = 95 € (2222124 + 2 × 2263287) et 30 + 2 × 75 = 180 € (2222124 + 2 × 2249229). Les fichiers LPP téléchargés en http sont donc cohérents avec la source ministérielle.
- ameli aides auditives : base 400 € / 1 400 €, PLV 950 € / 1 400 €, taux 60 % : identiques à la base LPP.
- BDPM ↔ BdM_IT : prix et taux identiques pour 46 médicaments sur 47 (écart : Eliquis, voir plus bas).

## Ce qu'on a extrait

### Optique (201 entrées, toutes `sur`)
- Tous les **codes génériques** (préfixe 22) de la section optique 2.2.5 de la LPP en vigueur : verres unifocaux, multifocaux,
  progressifs et neutres classe A et B (30 + 30 + 30 + 1 par classe), montures adulte et enfant A et B, supplément monture à coque
  (moins de 6 ans), prestations d'adaptation A et B, appairage (3 niveaux), verres teintés, prismes, filtres, supplément
  d'accompagnement classe A, verres freinateurs de myopie (6 codes sous nom de marque).
- Les ~16 000 **codes par fabricant** (préfixe 7, même libellé suivi du nom du fabricant, mêmes montants) ne sont pas repris :
  ils dupliquent les codes génériques. À ajouter si l'outil doit accepter le code exact imprimé sur un devis.
- **Adulte / enfant** : la LPP ne distingue l'âge que pour les **montures** (« monture enfant », âge maximal 15 ans) et quelques
  suppléments (coque < 6 ans, prisme et filtre enfant). Les verres classe A et B ont un seul code quel que soit l'âge, avec la même
  base. Il n'existe pas de « base enfant » des verres classe B dans la base v910 (0,05 € pour tous).
- Taux 60 % (`ameli-taux`) ; conditions de renouvellement recopiées d'`ameli-optique`.
- Date d'effet des montants : 07/07/2023 (arrêté du 03/07/2023, JO du 06/07/2023, lu dans la base) pour presque tous les codes ;
  10/08/2023 pour le supplément d'accompagnement ; 30/06/2025 pour les verres freinateurs.

### Audio (8 entrées, toutes `sur`)
- Aides auditives classe I et II, droite et gauche, « > 20 ans » et « ≤ 20 ans » (libellés LPP). BR 400 € / 1 400 €, PLV classe I
  950 € / 1 400 €, taux 60 %, renouvellement 4 ans, essai 30 jours, plafond contrat responsable 1 700 € (classe II).
- Non repris : piles, entretien, réparations, implants (hors sujet de l'outil, mais disponibles dans la même base).

### Dentaire (31 `sur` + 9 `a_verifier`)
- 31 actes prothétiques CCAM avec **base de remboursement et honoraire limite de facturation au 01/01/2026** : couronnes (7),
  inlay-core (2), couronnes transitoires (2), bridges (6), inlay-onlay (1), prothèses amovibles résine / transition / châssis (9),
  réparations (3), mainteneur d'espace (1).
- **Panier** : renseigné pour 16 actes à partir des listes « rappel de la facturation » de la page ameli (8 « sans reste à charge »
  → `100-sante`, 8 « à entente directe limitée » → `modere`). Les 15 autres ont un honoraire limite mais la page ne dit pas leur panier :
  `panier_100_sante = null`, à compléter depuis la convention dentaire (annexe des paniers) avant d'afficher un panier.
- **Soins conservateurs et extractions (9 entrées `a_verifier`)** : tarif et taux lus sur ameli, mais **sans code CCAM** (la page
  n'en donne pas ; le site CCAM d'ameli, fiches et téléchargements, répond 403 à curl, à Chromium, à Linkup et à WebFetch).
  Il manque le code ; ne pas l'inventer. Ces 9 tarifs sont datés « au 25 octobre 2024 » : vérifier qu'ils n'ont pas bougé.
- Taux 60 % (`ameli-taux`, `ameli-assure-soins-dentaires`).

### Pharmacie (23 `sur` + 24 `a_verifier`)
- 47 présentations très courantes (paracétamol, antibiotiques, antihypertenseurs, statines, anticoagulants, insuline, inhalateurs,
  IPP, metformine, anxiolytiques, corticoïdes, vitamine D, fer, folates…), choisies dans `scripts/B/saisie/selection_pharmacie.json`.
  Taux **lus** : 65 % (36), 30 % (4), 15 % (4), 100 % (3, hormonothérapies du cancer du sein).
- BR = prix public TTC hors honoraire, ou TFR en vigueur pour le CIP (16 présentations sont dans un groupe TFR ; BR = TFR pour
  les 15 où la fiche BdM_IT donne un TFR en cours). L'honoraire de dispensation (1,02 €) est donné à part.
- Raisons des 24 `a_verifier` :
  - **22 avec un « tarif de remboursement ajusté »** affiché par BdM_IT (Advilmed, Augmentin, Levothyrox, Crestor, Xarelto, Eliquis,
    Tahor, Lovenox, Triatec, Lasilix, Mopral, Atarax, Seroplex, Deroxat, Solupred, Zymad, Speciafoldine, Aerius, Duphalac, Gaviscon,
    Stilnox, Imovane). D'après des sources secondaires (Vidal 2020, CSMF 2020), c'est la base appliquée quand le patient refuse
    le générique sans mention « non substituable » justifiée (LFSS 2019, art. 66). Texte officiel non relu : la page devra montrer
    les deux bases. Le montant est dans `tarif_remboursement_ajuste_bdmit`.
  - **Eliquis 5 mg B/60** : BDPM (03/11) 58,95 € ; BdM_IT (17/11) nouveau prix 28,30 € applicable au 01/11/2026, opposable au
    09/12/2026. Baisse de prix en cours : ne pas publier avant le 09/12/2026 et une nouvelle extraction.
  - **Kardegic, Crestor, Spasfon** : la BDPM associe un texte d'indications au taux (taux pouvant dépendre de l'indication).
  - **Gaviscon** : groupe générique TFR, mais aucun TFR en vigueur lu pour ce CIP.

## Ce qui change au 01/01/2027 (recherche active)

| Texte | Effet | Statut au 18/11/2026 |
|---|---|---|
| Décret n° 2026-809 (JO 22/08/2026) | Dentaire : participation de l'assuré 35-45 % → 50-60 % (R160-5 3° bis). Part Sécu 60 % → 40 à 50 % | Taux exact non publié. L'Uncam avait jusqu'au 22/10/2026 ; à défaut le ministre fixe par arrêté (presse, Selectra 23/10/2026, non officiel) |
| Décret n° 2026-810 (JO 22/08/2026) | LPP (optique, aides auditives, autres DM) : 40-50 % → 50-60 % (8°) ; télésurveillance et DM numériques 35-45 % → 50-60 % (19°, 20°). Part Sécu 60 % → 40 à 50 % | Taux exact non publié |
| Décret n° 2026-811 (JO 22/08/2026) | Médicaments SMR modéré (30 %) : 70-75 % → 85-95 % (6°, 15°) ; homéopathie (7°) et SMR faible (15 %, 14°) → 93-97 % | Taux exact non publié |
| Décret n° 2026-812 (JO 22/08/2026) | Transports sanitaires (hors outil) | — |
| Base LPP v910 | Aucune date d'effet postérieure au 18/11/2026 pour l'optique (2.2) et l'audio (2.3) : BR et PLV inchangés à ce jour | vérifié par `futurs_lpp.py` |
| Dentaire, BR et HLF | Aucune revalorisation au 01/01/2027 trouvée (la FAQ ameli de la convention 2023-2028 mentionne +3 % des HLF au 01/01/2026, déjà appliqués) | rien de sourcé pour 2027 |
| JO du 08/11 au 18/11/2026 | Aucune décision Uncam ni arrêté fixant ces taux 2027. Trouvés seulement : avis de décisions Uncam fixant les taux de spécialités pharmaceutiques au cas par cas (JO 10/11 et 18/11/2026, JORFTEXT000055075669 et 000055099290, non dépouillés), décision Uncam du 07/10/2026 sur la CCAM (actes médicaux, pas dentaires) | `grep_jorf.py` |
| PLFSS 2027 | Rejeté par l'Assemblée le 23/10/2026, en navette (presse) ; aucune mesure optique/audio/dentaire votée à ce jour | à suivre |

Chaque entrée porte `change_au_2027_01_01`. À faire dès publication du taux : modifier `TAUX_LPP` / `TAUX_DENTAIRE` (et les taux
médicaments 30 % / 15 %) dans `construire.py`, ajouter la décision en source, régénérer.

## Erreurs ou approximations relevées dans les articles du site

- `ticket-moderateur-2027-tiers-payant.json` (10/11/2026) — **erreur à corriger** : l'article dit que les décrets d'août 2026
  concernent le dentaire et que « pour l'optique, l'audio et les médicaments, aucun nouveau taux n'est publié ». C'est vrai pour
  le taux, mais il omet que les **décrets n° 2026-810 (LPP : optique, audio) et n° 2026-811 (médicaments à 30 % et 15 %)** changent
  aussi la fourchette au 01/01/2027 : la part Sécu baissera mécaniquement en optique, en audio et sur ces médicaments, comme en dentaire.
  Le tableau « Optique et audio : taux non publié, ne pas modifier les devis » et le paragraphe pharmacie sont à réécrire.
- `audioprothese-renouvellement-tiers-payant.json` : le délai de 4 ans est calculé « à compter de la date de délivrance » ;
  ameli (20/02/2026) dit « les dates retenues pour le calcul de cette durée sont les dates de **facturation** de l'aide auditive
  précédente et de la nouvelle ». L'article parle ensuite de la date « qui figure sur la facture d'origine » : reformuler avec
  « date de facturation ». Seuil d'âge : l'article dit « adulte de plus de 20 ans », ameli dit « 20 ans et plus », la LPP « > 20 ans » /
  « ≤ 20 ans » : la LPP fait foi pour le code, ameli est ambigu sur l'âge exact de 20 ans.
- `dentaire-paniers-100-sante-tiers-payant.json` : « La réforme 100 % Santé couvre l'ensemble des prothèses dentaires depuis le
  1er janvier 2021 » peut se lire comme « toutes les prothèses sont 100 % Santé ». Plus juste : depuis 2021, toutes les prothèses
  relèvent de l'un des trois paniers. Le reste de l'article est cohérent avec le tableau ameli des HLF.
- Page ameli `tableau-recapitulatif-taux-remboursement` (30/09/2026), à **ne pas recopier** : son exemple optique (monture BR 2,84 €,
  verre BR 6,25 €) date d'avant la réforme 100 % Santé ; la base LPP actuelle donne 0,05 € (classe B) ou 9 € (monture classe A).
- `reste-a-charge-drees-expliquer-devis.json` et `tiers-payant-opticien.json` : pas d'erreur vue sur les points touchant l'outil B.

## Réseau (pour l'agent suivant)

- `www.codage.ext.cnamts.fr` : en https, la connexion est coupée pendant la poignée de main TLS via le proxy (Linkup échoue aussi).
  En **http**, la page et les fichiers répondent (200). Les fichiers LPP et BdM_IT ont donc été pris en http ; cohérence vérifiée
  avec ameli et le ministère (voir Recoupements). `maj.py` essaie https puis http.
- `www.ameli.fr` : 403 à curl, Chromium headless, WebFetch ; **Linkup fetch fonctionne** pour les pages d'article (pas pour le site
  CCAM `ameli.fr/accueil-de-la-ccam/…`, ni pour les fichiers `sites/default/files/…`, ni pour `assurance-maladie.ameli.fr`).
- `www.legifrance.gouv.fr` : 403 à curl, Chromium, Linkup fetch ; **WebFetch fonctionne** (résumé, citations courtes).
  Pour un texte du JO récent : archives DILA `echanges.dila.gouv.fr/OPENDATA/JORF/` (quotidiennes, 10 derniers jours seulement).

## Ce qui manque (par priorité)

1. Codes CCAM des soins dentaires courants (détartrage, caries, dévitalisations, extractions) et leurs tarifs officiels : il faut
   la base CCAM (ameli, « CCAM téléchargement » ou fiche par code), inaccessible cette nuit.
2. Panier des 15 actes prothétiques à HLF sans panier indiqué (prothèses amovibles, bridge zircone, inlay-onlay, réparations).
3. Texte officiel du « tarif de remboursement ajusté » des médicaments (LFSS 2019 art. 66, CSS L162-16) pour sortir 22 médicaments
   de `a_verifier`.
4. Prise en charge de l'honoraire de dispensation (taux) : non calculée.
5. Taux 2027 (Uncam / arrêté) : à guetter au JO avant le 01/01/2027.
6. Conditions de prise en charge des verres freinateurs de myopie (arrêté d'inscription non lu).

## Procédure de mise à jour

Automatique, depuis la racine du dépôt :
`python3 -I outils-nuit/B/scripts/maj.py --racine <dossier de téléchargements hors du dépôt>` : retélécharge la LPP
(version lue sur la page), la BDPM et les fiches BdM_IT dans un dossier daté neuf (`<racine>/maj-AAAAMMJJ/`), refait la
sélection pharmacie et régénère `outils-nuit/B/donnees.json` (`--sortie` pour un autre chemin, `--date AAAA-MM-JJ` pour la
date de mise à jour, défaut aujourd'hui). `--sans-telechargement` reconstruit à partir des dossiers de la nuit du
18/11/2026 (`lpp910_extrait`, `bdpm_cis`, `bdpm_cis_cip`, `bdmit_fiches` sous `--racine`) : testé par dev-B avec
`--date 2026-11-18`, résultat identique octet pour octet. Ensuite : relire le diff, copier le fichier dans
`src/lib/outils/remboursement/donnees.json`, `npm test` (les tests vérifient Sécu = base × taux, les groupes, le seuil,
les repères des textes), `npm run build`.

Manuel, à chaque mise à jour :
1. Relire sur ameli (via Linkup) le tableau des HLF dentaires et la page soins dentaires ; mettre à jour
   `scripts/B/saisie/dentaire_ameli_2026.json` (renommer avec la nouvelle date).
2. Vérifier les taux sur le tableau ameli des taux et au JO (taux 2027) ; mettre à jour `TAUX_LPP`, `TAUX_DENTAIRE`,
   les textes `CHANGE_*` et les dates de `SOURCES` dans `construire.py`.
3. Lancer `futurs_lpp.py <dossier> <version> <AAAAMMJJ> 2.2` (et `2.3`) pour voir les changements programmés dans la LPP.
4. Relire la liste des `a_verifier` (le script les signale) avant toute publication.

## Notes de dev-B (18/11/2026, intégration sur le site)

- **Aucune donnée corrigée** : `donnees.json` est copié tel quel dans `src/lib/outils/remboursement/`.
- **Panier non renseigné** (appairage, 3 codes ; supplément verres teintés ; verres freinateurs, 6 codes) : `panier_100_sante`
  reste `null`. Le site n'affiche pour eux ni panier, ni part de la complémentaire, ni alerte « au-delà du prix limite » ;
  leur prix limite (champ `PUREGLEMEN`) est affiché tel quel. Le filtre « Panier » du hub ne les range nulle part.
- **Verres freinateurs** : lignes du hub seulement (pas de page, conditions d'inscription non lues).
- **Textes des pages** : aucun montant n'est écrit en dur dans les textes de `groupes.mjs` et `textesHub.mjs` ; ce sont des
  repères (`{base:2263287}`, `{plv:2222124}`…) remplis depuis `donnees.json`. Les affirmations des textes (montants égaux,
  prix limite le plus élevé, équipements à 95 € et 180 €) sont vérifiées par `tests/outils/remboursement.test.ts` : un
  changement de la LPP qui les rendrait fausses fait échouer les tests.
- **Le jour où le taux 2027 paraît** : ajouter la décision Uncam (ou l'arrêté) dans `SOURCES` de
  `scripts/construire.py`, régénérer, puis dans `src/lib/outils/remboursement/publication.mjs` remplacer
  `TAUX_2027.lpp = null` par `{ taux: <taux Sécu en %>, source_id: "<id de la source>" }` (idem `dentaire`,
  `medicament_30`, `medicament_15`). Le site recalcule alors Sécu, ticket modérateur et complémentaire, et date ces
  montants par la nouvelle source. Tant que la valeur est `null`, à partir du 01/01/2027 (date du serveur, Europe/Paris)
  le site n'affiche aucun montant Sécu. `TAUX_LPP` de `construire.py` reste le taux 2026 tant que les données de 2026
  servent avant la bascule.
