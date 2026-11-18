# Outil C · Mutuelle → portail de tiers payant · textes

Rédigé le 18/11/2026 par copy-seo (équipe de nuit). À lire avec `cadre.md` (une seule URL par mutuelle, le hub est
l’outil), `sources.md`, `../socle.md` et `../seo.md` § 4. Ce fichier donne les mots ; il ne change ni les blocs ni les
règles de publication de `cadre.md`, sauf là où il est écrit « écart avec cadre.md ».

**Conventions**

- La typographie est déjà posée : espace insécable avant `: ; ? !`, dans les guillemets « », dans les nombres ;
  apostrophe ’. Recopier tel quel.
- Longueurs comptées par script, en caractères, espaces comprises : `<title>` 60 au plus ; description entre 140 et 155.
- Entre accolades : un champ de `donnees.json` (ou extrait de `note_verification` par l’expression de `cadre.md` § 5).
  Un métier `a_verifier` n’est jamais écrit comme acquis : il apparaît « à confirmer sur la carte », dans le hub
  seulement. Identifiant de source entre crochets.
- « Libellé relevé », pas « libellé à choisir » (écart avec `cadre.md`) : les listes publiques donnent le libellé de
  l’opérateur ; aucune source lue ne dit qu’il est mot pour mot celui du sélecteur du portail.

## 1. Le hub `/outils/mutuelle-portail`

### 1.1 En-tête

| Élément | Texte | Car. |
|---|---|---|
| `<title>` | Quel portail pour quelle mutuelle ? Tiers payant par métier | 59 |
| Description | Cherchez la complémentaire par son nom ou son numéro AMC : le portail de tiers payant relevé pour chaque métier, sa source et sa date. La carte fait foi. | 153 |
| H1, `titre` | Quel portail de tiers payant | |
| H1, `accent` | pour quelle mutuelle ? | |
| Sur-titre | Outil gratuit · tiers payant | |
| Chapeau | Cherchez la complémentaire par son nom ou son numéro AMC (assurance maladie complémentaire) : vous voyez le portail relevé pour votre métier et la date du relevé. La carte de tiers payant du patient fait foi. | |

### 1.2 Recherche, filtres, lignes (repris de `cadre.md`)

| Élément | Texte |
|---|---|
| Libellé du champ | Nom de la mutuelle ou numéro AMC |
| Placeholder | Harmonie, MGEN, 0045900442… |
| Aide | Le numéro AMC est sur la carte de tiers payant. |
| Compteur | « {n} complémentaires », « {visibles} sur {n} » |
| Filtre opérateur | « Tous les opérateurs », puis SP santé, iSanté, Viamedis, Almerys, Carte Blanche Partenaires, Santéclair, Actil, Korelio, GIE Groupama TPG |
| Résumé d’une ligne | « {métiers} : {opérateur} », métiers fusionnés (« Optique, audio, dentaire : Viamedis ») ; filtre posé : le seul métier, « Dentaire : iSanté · libellé « MNH » » |
| Métier à vérifier | « {Métier} : {opérateur}, à confirmer sur la carte » (texte secondaire) |
| Aucun métier sûr | « Pas de source publique datée pour l’instant » |
| Lien de la ligne | fiche : « Fiche » ; page d’outil : « Voir » ; sinon la ligne s’ouvre (`<details>`) |

### 1.3 Blocs avertissement du hub

`a-venir`, sur-titre « Changements récents · relevé du 18/11/2026 », au-dessus de la liste :

> Oxantis a fermé le 26/10/2026 : Viamedis reprend l’optique et l’audioprothèse (Acuité, 16/09/2026). MGEN : optique
> et audio chez Viamedis depuis le 27/10/2026 ; iVoirNet annonce tout le tiers payant MGEN chez Viamedis à partir du
> 30/11/2026, à confirmer après cette date.

[acuite-oxantis, ivoirnet-mgen] · À relire le 01/12/2026 : la phrase MGEN change dès que la bascule du 30/11 est
confirmée.

Pas de `fait-foi` séparé sur le hub : la dernière phrase du chapeau le porte.

### 1.4 État vide

| Situation | Message |
|---|---|
| Nom absent | « {q} » n’est pas dans notre relevé. Regardez la carte de tiers payant du patient : elle désigne l’opérateur de chaque prestation, par son nom, son logo ou un code. Cherchez ensuite la mutuelle sur le portail de cet opérateur. |
| 8 à 10 chiffres inconnus | Ce numéro AMC n’est dans aucune des listes publiques relevées le 18/11/2026 (SP santé, iSanté). Regardez la carte de tiers payant : elle désigne l’opérateur de chaque prestation. |
| La mutuelle existe, le filtre métier la masque | {Mutuelle} est dans l’annuaire, sans portail relevé pour {métier}. + bouton « Voir tous les métiers » |

Dessous, dans les deux premiers cas : « Les portails des opérateurs : » puis les fiches en ligne (`portail-viamedis`,
`portail-almerys`, `portail-sp-sante`, `portail-isante`, `portail-santeclair`, `portail-carte-blanche`,
`portail-actil`) ; pour un numéro, en plus : « Lire le numéro AMC sur la carte » (`mutuelle-quel-portail`). Toujours :
« Effacer la recherche », « Signaler une mutuelle manquante »
(`mailto:contact@getgranit.ai?subject=Mutuelle%20manquante`).

[« nom, logo ou code » : aesio-specimen-2025, groupama-attestation]

### 1.5 Entrée introuvable (404, `noindex`)

- H1 : « {slug en mots} : introuvable » (`mutuelle-xyz` → « mutuelle xyz »)
- Message : « Nous n’avons pas de page pour cette complémentaire. Cherchez-la dans l’annuaire par son nom, un autre nom
  ou son numéro AMC. »
- Recherche préremplie avec les mots du slug, lien « Voir toutes les complémentaires ».

### 1.6 Texte de méthode du hub (proposé, environ 340 mots)

> **## De la carte au portail**
>
> La carte de tiers payant du patient désigne l’opérateur de chaque prestation : c’est elle qui tranche. Elle peut le
> nommer ou porter son logo, comme le spécimen de carte Aésio de 2025 (« PEC optique, audio, dentaire et
> hospitalisation : almerys.com »), ou un code par catégorie de soins : sur la carte Groupama, chaque catégorie (OPTI,
> PHAR, HOSP…) porte un code de mode de gestion. Pour SP santé, seules les dépenses qui portent la mention « SP » sur
> l’attestation passent par lui.
> [aesio-specimen-2025, groupama-attestation, sp-presentation]
>
> **## Pourquoi deux portails pour une même mutuelle**
>
> Une complémentaire peut confier chaque métier à un opérateur différent : dans les listes publiques relevées le
> 18/11/2026, la Mutuelle de Poitiers Assurances figure chez SP santé pour l’optique, le dentaire et la pharmacie, et
> chez iSanté pour les cliniques. La date compte aussi : la MGEN est chez Viamedis en optique et en audio depuis le
> 27/10/2026, et iVoirNet annonce le reste de son tiers payant chez Viamedis au 30/11/2026.
> [sp-liste-amc, isante-liste-amc, ivoirnet-mgen]
>
> **## Opérateur ou réseau de soins**
>
> Un opérateur de tiers payant reçoit la demande de prise en charge et paie le professionnel : SP santé, iSanté,
> Viamedis, Almerys. Un réseau de soins regroupe des professionnels partenaires aux tarifs négociés : Kalixia, Itelis,
> Sévéane. Kalixia n’est pas un portail de prise en charge : pour la Mutuelle RATP, la demande passe par Viamedis,
> opticien partenaire Kalixia ou non. Santéclair, Carte Blanche Partenaires et Actil font les deux.
> [sources.md, « Comment lire ces données » ; acuite-ratp]
>
> **## Comment ce relevé est fait**
>
> L’annuaire reprend les listes publiques de SP santé et d’iSanté, qui donnent pour chaque complémentaire un libellé, un
> numéro AMC et les métiers ouverts, avec leurs dates ; elles sont mises à jour à chaque ouverture ou fermeture d’un
> segment. Il y ajoute les pages des complémentaires et la presse professionnelle, datées. Un métier n’est affiché comme
> relevé que si une source publique datée nomme l’opérateur pour ce métier ; sinon, il est marqué « à confirmer sur la
> carte ». Les autres opérateurs, dont Viamedis et Almerys, ne publient pas de liste de leurs clients par métier.
> [sp-liste-amc, isante-liste-amc, isante-faq ; sources.md, « Ce qui a bloqué »]

### 1.7 Carte pont (hub et entrées)

| Élément | Texte |
|---|---|
| `texte` | Prises en charge saisies, factures suivies, relances faites : les agents Granit travaillent sur vos portails, comme le ferait une personne. |
| Bouton (socle) | Voir ce que font les agents ; option métier (filtre posé ou mutuelle d’un seul métier sûr) : « Voir ce que font les agents pour les opticiens » · « en centre dentaire » · « en pharmacie »… |
| Lien | Demander une démo |

Écart avec `cadre.md` § 9 : mêmes objets (prises en charge, factures, relances), le résultat d’abord. Pas de « toutes
les plateformes » : l’outil couvre les cinq métiers, et la formule n’est validée qu’en optique et en audio.

## 2. FAQ du hub

`FaqOutil` avec `jsonLd: true` sur le hub seulement (`cadre.md` § 4, socle § 6.13), sans attente d’affichage enrichi
(`seo.md` § 2.4). Aucune FAQ sur les pages d’entrée. Les questions évitent celles déjà posées par les articles
`mutuelle-quel-portail`, `checklist-prise-en-charge` et `portails-tiers-payant` (« Comment savoir par quel portail
passe une mutuelle ? », « Une mutuelle peut-elle passer par plusieurs portails ? », « Que faire si la mutuelle
n’apparaît dans aucun portail ? ») : chaque réponse s’appuie sur les données de l’outil.

**Quelles mutuelles passent par iSanté ou SP santé ?**
Les deux opérateurs publient la liste des complémentaires ouvertes, métier par métier, avec leurs dates. L’annuaire
les reprend : filtrez par opérateur et par métier. Les autres opérateurs, dont Viamedis et Almerys, ne publient pas de
liste de leurs clients par métier ; pour eux, l’annuaire s’appuie sur les pages des complémentaires et la presse
professionnelle. [sp-liste-amc, isante-liste-amc ; sources.md]

**Pourquoi une même mutuelle a-t-elle deux portails ?**
Parce qu’elle peut confier chaque métier à un opérateur différent : la Mutuelle de Poitiers Assurances figure chez SP
santé pour l’optique et chez iSanté pour les cliniques (listes publiques au 18/11/2026). La date compte aussi, quand une
complémentaire change d’opérateur. La carte de tiers payant du patient désigne l’opérateur de chaque prestation.
[sp-liste-amc, isante-liste-amc]

**Le numéro AMC suffit-il à trouver le portail ?**
Il aide à retrouver la complémentaire dans les listes publiques, qui donnent un numéro AMC par libellé : vous pouvez le
taper dans la recherche. Mais un même organisme peut avoir plusieurs libellés et plusieurs numéros (sept pour Mutualia
chez iSanté), et c’est la carte qui désigne l’opérateur. [isante-liste-amc]

**Que faire si la mutuelle n’est pas dans l’annuaire ?**
Suivez la carte de tiers payant du patient : elle désigne l’opérateur de chaque prestation. Cherchez ensuite la
complémentaire sur le portail de cet opérateur. Certaines complémentaires gèrent elles-mêmes une partie de leur tiers
payant, comme Swiss Life pour l’hospitalisation. [sl-tp ; sources.md]

**Ces données changent-elles ?**
Oui. Les listes de SP santé et d’iSanté sont mises à jour à chaque ouverture ou fermeture d’un segment, et des
opérateurs ferment : Oxantis a cessé le 26/10/2026, Viamedis reprend l’optique et l’audioprothèse. Chaque ligne de
l’annuaire porte la date de son relevé. [isante-faq, acuite-oxantis]

## 3. Les pages d’entrée `/outils/mutuelle-portail/<slug>`

Rappel de `cadre.md` § 6 : au seuil de 100 mots, 2 pages (Mutualia, SMABTP) ; les 22 mutuelles qui ont une fiche
`/ressources/portail-<x>` n’ont jamais de page d’outil. Les règles ci-dessous valent pour les 26 candidates.

### 3.1 Les trois cas

| Cas | Quand | `<title>` (formes essayées dans l’ordre) | H1 |
|---|---|---|---|
| C1 | un seul métier sûr | « {Mutuelle} tiers payant {métier court} : quel portail ? » → « {Mutuelle} : tiers payant {métier court} » | « {Mutuelle} tiers payant en {métier court} : quel portail ? » |
| C2 | plusieurs métiers sûrs, un seul opérateur | « {Mutuelle} tiers payant : {opérateur}, pour quels métiers ? » → « {Mutuelle} tiers payant : {opérateur} par métier » → « {Mutuelle} : tiers payant {opérateur} » | « {Mutuelle} tiers payant : quel portail, métier par métier ? » |
| C3 | plusieurs opérateurs | « {Mutuelle} tiers payant : le portail, métier par métier » → « {Mutuelle} tiers payant : portail par métier » → « {Mutuelle} : tiers payant par métier » | idem C2 |

Chaque forme est essayée avec le nom complet, puis avec le nom court de `NOMS_COURTS`, avant de passer à la forme suivante (« Mutuelle de Poitiers », « La
Banque Postale », « Mutuelle des Sapeurs-Pompiers »). Métier court : optique, audio, dentaire, pharmacie, centres de
santé, laboratoire, clinique. Le C2 met l’opérateur dans le titre sans laisser croire qu’il vaut pour tous les métiers :
« pour quels métiers ? » est la question à laquelle la page répond.

Écart avec `cadre.md` § 5 : « {Mutuelle} tiers payant : le portail, métier par métier » mentirait pour une mutuelle
d’un seul métier (Mutualia, optique seule) : d’où les cas C1 et C2.

**Sur-titre** : « Complémentaire santé » (+ « · {groupe} » si `groupe`) ; `type: gestionnaire` (Henner, Sigmage) :
« Gestionnaire de tiers payant ».

### 3.2 Description

Premier candidat entre 140 et 155 caractères, dans cet ordre :

| Source des métiers sûrs | Début | Fins essayées |
|---|---|---|
| Listes publiques SP santé ou iSanté, un opérateur | « {Mutuelle} figure dans la liste publique {opérateur} pour {métiers} (relevé du {date}). » puis « …pour {métiers}, au {date}. » | « Le libellé, le numéro AMC et que faire si la carte du patient diffère. » → « Libellé, numéro AMC et que faire si la carte du patient diffère. » → « Libellé, numéro AMC et que faire si la carte diffère. » → « Le libellé et le numéro AMC à vérifier sur la carte. » → « Libellé et numéro AMC à vérifier sur la carte. » Plusieurs libellés : « Les {k} libellés, leurs numéros AMC et que faire si la carte diffère. » → « Les {k} libellés et leurs numéros AMC, carte à l’appui. » → « Libellés et numéros AMC à vérifier sur la carte. » |
| Listes publiques, plusieurs opérateurs | « {Mutuelle} : {opérateur 1} pour {métiers 1}, {opérateur 2} pour {métiers 2}, d’après leurs listes publiques ({date}). » puis « …(listes publiques du {date}). » | « Libellés, numéros AMC et que faire si la carte diffère. » → « Libellés et numéros AMC à vérifier sur la carte. » → « Libellés et numéros AMC, carte à l’appui. » (« numéro AMC » au singulier quand les libellés partagent un numéro) |
| Page de la complémentaire, non datée | « {Mutuelle} indique passer par {opérateur} pour {métiers} (page lue le {date}). » | « Ce qu’il faut vérifier sur la carte du patient, et que faire si elle diffère. » → « Ce qu’il faut vérifier sur la carte, et que faire si elle diffère. » → « Que vérifier sur la carte, et que faire si elle diffère. » |
| Presse datée | « Selon {éditeur} ({date}), {Mutuelle} passe par {opérateur} pour {métiers}. » | idem |

{métiers} : un ou deux métiers nommés (« l’optique et l’audioprothèse ») ; trois et plus qui se suivent dans l’ordre du
site : « {n} métiers, de {premier} à {dernier} » (« cinq métiers, du dentaire aux cliniques ») ; sinon « {n} métiers ».
Une mutuelle dont le nom commence par « Mutuelle » prend l’article en milieu de phrase (« la Mutuelle SG », « les
Mutuelles du Soleil », verbe au pluriel) : table `SUJETS` de `publication.mjs`. Les 26 candidates tiennent toutes dans
les bornes (annexe 3.7).

### 3.3 Réponse (chapeau) et L’essentiel

Première phrase, selon la source :

| Cas | Phrase |
|---|---|
| Liste publique, un libellé | « Pour {métiers}, {Mutuelle} figure dans la liste publique {opérateur} sous le libellé « {libellé} » (numéro AMC {n}, relevé du {date}). » |
| Liste publique, plusieurs libellés | « Pour {métiers}, {Mutuelle} figure dans la liste publique {opérateur} sous {k} libellés, chacun avec son numéro AMC (relevé du {date}). » |
| Plusieurs opérateurs | « Pour {métiers 1}, {Mutuelle} figure dans la liste publique {opérateur 1} ; pour {métiers 2}, dans celle {d’}{opérateur 2} (relevé du {date}). » |
| Page de la complémentaire | « {Mutuelle} indique passer par {opérateur} pour {métiers} (page non datée, lue le {date}). » |
| Presse | « Selon {éditeur} ({date}), {Mutuelle} passe par {opérateur} pour {métiers} depuis le {date d’effet}. » |

Seconde phrase, fixe : « La carte de tiers payant du patient fait foi : elle désigne l’opérateur de chaque
prestation. »

**L’essentiel** : Portail ou opérateur (« {opérateur} ({métiers}) », un groupe par opérateur) · Libellé relevé (ou
« Libellés relevés : {k} » et la liste) · Numéro AMC · Réseau de soins (seulement s’il est `sur`) · Relevé le.

**Avertissement** (`fait-foi`) : « Un opérateur relevé pour un métier ne veut pas dire que tous les contrats {de
Mutuelle} y passent : pour chaque dossier, suivez la carte de tiers payant du patient. » (la carte « fait foi » est déjà
dans la réponse : l’avertissement ne la répète pas). [sources.md, « Les deux sources qui font l’essentiel »]

### 3.4 Intertitres et textes de gabarit

| Section | Intertitre | Texte |
|---|---|---|
| Tableau | « {Mutuelle} : le portail relevé, métier par métier » | une ligne par métier ; colonne « État » : « relevé », « à confirmer sur la carte » (et la raison), « pas de source publique » |
| Sous-domaines | (colonne du tableau) | « Sous-domaine listé : stomatologues », « consultations externes », « frais de séjour » ; quand la liste a aussi une ligne sans restriction : « tous les dentistes, et une ligne stomatologues » |
| Segments fermés | « Segments fermés chez {opérateur} » | « Chez {opérateur}, les segments {métiers} du libellé « {libellé} » sont fermés depuis le {date}. Pour ces métiers, suivez la carte du patient. » |
| Réseau de soins | « Réseau de soins de {Mutuelle} » | nom, métiers, ce qu’en dit la source (si `sur`) |
| Carte | « Vérifier sur la carte {opérateur} » | SP santé : « Seules les dépenses qui portent la mention « SP » sur l’attestation sont prises en charge par SP santé. » [sp-presentation] · iSanté : « Pour la télétransmission, iSanté indique un numéro unique : 00733931. » [isante-faq] · Viamedis : « Prises en charge et factures sur viamedis.net ; conventionnement sur viamedispro.com. » [hm-contacts] · Carte Blanche Partenaires : « Prises en charge sur pec.carteblanchepartenaires.fr. » [sl-tp] |
| Écart | « Si la carte dit autre chose » | « Suivez la carte : un même organisme peut avoir des contrats gérés ailleurs. Si l’opérateur de la carte ne retrouve pas l’adhérent, voyez le rejet « bénéficiaire inconnu » (lien `rejet-beneficiaire-inconnu`) ; pour un rejet de la part Sécurité sociale, la liste des codes rejets NOEMIE (`LienOutil` A). » + « Signaler un écart » (`mailto:`) |
| Voisins | « Autres complémentaires chez {opérateur} », puis « Autres complémentaires du {groupe} » | pages d’outil publiées et fiches `/ressources/portail-<x>`, 3 à 6 |
| Articles | « Pour aller plus loin » | la fiche de l’opérateur principal (`portail-isante`, `portail-sp-sante`, `portail-viamedis`, `portail-almerys`, `portail-carte-blanche`, `portail-actil`, `portail-santeclair`), `mutuelle-quel-portail` ; `LienOutil` B (« Combien la complémentaire prend en charge ») et A |

### 3.5 Règles de choix, en résumé

| Si… | Alors |
|---|---|
| un seul métier sûr | C1 ; pastille et bouton de la carte pont vers ce métier |
| plusieurs métiers, un opérateur | C2 |
| plusieurs opérateurs | C3 ; réponse « pour…, pour… » ; description à deux opérateurs |
| plusieurs libellés pour un même opérateur | « sous {k} libellés, chacun avec son numéro AMC » ; L’essentiel liste les libellés |
| `segments_fermes` non vide | section « Segments fermés chez {opérateur} » |
| sous-domaine « UNIQUEMENT STOMATOLOGUE (18) » sans ligne sans restriction | jamais « dentaire » seul : « dentaire (sous-domaine listé : stomatologues) » (`cadre.md` § 5) |
| `type: gestionnaire` | sur-titre « Gestionnaire de tiers payant » ; la note de `notes` (« Henner est un gestionnaire de contrats… ») en tête du tableau |
| nom long (plus de 25 caractères) | nom court de `NOMS_COURTS` dans le titre si la forme longue dépasse 60 |

### 3.6 Trois exemples rendus à partir de `donnees.json`

**1. `mutualia`** (C1 : un métier, un opérateur, sept libellés ; page proposée par `cadre.md`)

- **Sur-titre** : Complémentaire santé
- **`<title>`** (46) : Mutualia tiers payant optique : quel portail ?
- **Description** (155) : Mutualia figure dans la liste publique iSanté pour l’optique (relevé du 18/11/2026). Les sept libellés, leurs numéros AMC et que faire si la carte diffère.
- **H1** : Mutualia tiers payant en optique : quel portail ?
- **Réponse** (chapeau) : Pour l’optique, Mutualia figure dans la liste publique iSanté sous sept libellés, chacun avec son numéro AMC (relevé du 18/11/2026). La carte de tiers payant du patient fait foi : elle désigne l’opérateur de chaque prestation.
- **L’essentiel** :
  - Portail ou opérateur : iSanté (optique)
  - Libellés relevés : 7 (MUTUALIA ALSACE GRAND EST · MUTUALIA GRAND OUEST · MUTUALIA NORD DE FRANCE · MUTUALIA SANTE ATLANTIQUE · MUTUALIA SUD OUEST · MUTUALIA-SANTE PREVOYANCE · MUTUALIA-SANTE SUD EST)
  - Numéros AMC : 0039096751 · 0040123424 · 0040128530 · 0040359626 · 0040897541 · 0044451849 · 0044957125
  - Relevé le : 18/11/2026
- **Avertissement** : Un opérateur relevé pour un métier ne veut pas dire que tous les contrats de Mutualia y passent : pour chaque dossier, suivez la carte de tiers payant du patient.
- **## Mutualia : le portail relevé, métier par métier** : 1 ligne(s) sûre(s) : optique → iSanté

**2. `smabtp`** (C2 : cinq métiers, un opérateur, segments fermés ; page proposée par `cadre.md`)

- **Sur-titre** : Complémentaire santé
- **`<title>`** (50) : SMABTP tiers payant : iSanté, pour quels métiers ?
- **Description** (151) : SMABTP figure dans la liste publique iSanté pour cinq métiers, du dentaire aux cliniques, au 18/11/2026. Libellé et numéro AMC à vérifier sur la carte.
- **H1** : SMABTP tiers payant : quel portail, métier par métier ?
- **Réponse** (chapeau) : Pour le dentaire, la pharmacie, les centres de santé, les laboratoires et les cliniques, SMABTP figure dans la liste publique iSanté sous le libellé « SMABTP VIE » (numéro AMC 0013400007, relevé du 18/11/2026). La carte de tiers payant du patient fait foi : elle désigne l’opérateur de chaque prestation.
- **L’essentiel** :
  - Portail ou opérateur : iSanté (dentaire, pharmacie, centres de santé, laboratoire, clinique)
  - Libellé relevé : « SMABTP VIE »
  - Numéro AMC : 0013400007
  - Relevé le : 18/11/2026
- **Avertissement** : Un opérateur relevé pour un métier ne veut pas dire que tous les contrats de SMABTP y passent : pour chaque dossier, suivez la carte de tiers payant du patient.
- **## SMABTP : le portail relevé, métier par métier** : 5 ligne(s) sûre(s) : dentaire → iSanté ; pharmacie → iSanté ; centres de santé → iSanté ; laboratoire → iSanté ; clinique → iSanté
- **## Segments fermés chez iSanté** : Chez iSanté, les segments audioprothésiste et opticien du libellé « SMABTP VIE » sont fermés depuis le 31/12/2025. Pour ces métiers, suivez la carte du patient.
  - Colonne « Sous-domaines listés » : dentaire : UNIQUEMENT STOMATOLOGUE (18) (plus une ligne sans restriction) ; clinique : POUR ACTES DE CONSULTATION EXTERNE, POUR FRAIS DE SEJOUR

**3. `mutuelle-de-poitiers`** (C3 : deux opérateurs ; sous le seuil à ce jour, ligne du hub)

- **Sur-titre** : Complémentaire santé
- **`<title>`** (54) : Mutuelle de Poitiers tiers payant : portail par métier
- **Description** (151) : Mutuelle de Poitiers : SP santé pour cinq métiers, iSanté pour les cliniques (listes publiques du 18/11/2026). Libellés et numéro AMC, carte à l’appui.
- **H1** : Mutuelle de Poitiers Assurances tiers payant : quel portail, métier par métier ?
- **Réponse** (chapeau) : Pour l’optique, le dentaire, la pharmacie, les centres de santé et les laboratoires, la Mutuelle de Poitiers Assurances figure dans la liste publique SP santé ; pour les cliniques, dans celle d’iSanté (relevé du 18/11/2026). La carte de tiers payant du patient fait foi : elle désigne l’opérateur de chaque prestation.
- **L’essentiel** :
  - Portail ou opérateur : SP santé (optique, dentaire, pharmacie, centres de santé, laboratoire) ; iSanté (clinique)
  - Libellés relevés : 2 (MUTUELLE DE POITIERS ASS · MUTUELLE DE POITIERS ASSURANCES)
  - Numéro AMC : 0004400008
  - Relevé le : 18/11/2026
- **Avertissement** : Un opérateur relevé pour un métier ne veut pas dire que tous les contrats de la Mutuelle de Poitiers Assurances y passent : pour chaque dossier, suivez la carte de tiers payant du patient.
- **## Mutuelle de Poitiers Assurances : le portail relevé, métier par métier** : 6 ligne(s) sûre(s) : optique → SP santé ; dentaire → SP santé ; pharmacie → SP santé ; centres de santé → SP santé ; laboratoire → SP santé ; clinique → iSanté
  - Colonne « Sous-domaines listés » : dentaire : UNIQUEMENT STOMATOLOGUE (18) (plus une ligne sans restriction) ; clinique : POUR ACTES DE CONSULTATION EXTERNE, POUR FRAIS DE SEJOUR

### 3.7 Annexe : `<title>` et description des 26 candidates

| Slug | Cas | `<title>` | n | Description | n |
|---|---|---|---|---|---|
| `gan` | C2 | Gan Assurances tiers payant : SP santé, pour quels métiers ? | 60 | Gan Assurances figure dans la liste publique SP santé pour quatre métiers, au 18/11/2026. Libellé, numéro AMC et que faire si la carte du patient diffère. | 154 |
| `axa` | C2 | AXA tiers payant : SP santé, pour quels métiers ? | 49 | AXA figure dans la liste publique SP santé pour cinq métiers (relevé du 18/11/2026). Le libellé, le numéro AMC et que faire si la carte du patient diffère. | 155 |
| `gmf` | C2 | GMF tiers payant : SP santé, pour quels métiers ? | 49 | GMF figure dans la liste publique SP santé pour quatre métiers, au 18/11/2026. Le libellé, le numéro AMC et que faire si la carte du patient diffère. | 149 |
| `abeille-assurances` | C3 | Abeille Assurances tiers payant : portail par métier | 52 | Abeille Assurances : SP santé pour cinq métiers, iSanté pour les cliniques (listes publiques du 18/11/2026). Libellés et numéro AMC, carte à l’appui. | 149 |
| `acm` | C2 | ACM tiers payant : SP santé, pour quels métiers ? | 49 | ACM figure dans la liste publique SP santé pour quatre métiers, du dentaire aux laboratoires, au 18/11/2026. Libellé et numéro AMC à vérifier sur la carte. | 155 |
| `uneo` | C2 | Unéo tiers payant : iSanté, pour quels métiers ? | 48 | Unéo figure dans la liste publique iSanté pour sept métiers, de l’optique aux cliniques, au 18/11/2026. Libellé et numéro AMC à vérifier sur la carte. | 150 |
| `mnh` | C2 | MNH tiers payant : iSanté, pour quels métiers ? | 47 | MNH figure dans la liste publique iSanté pour sept métiers, de l’optique aux cliniques, au 18/11/2026. Le libellé et le numéro AMC à vérifier sur la carte. | 155 |
| `mcdef` | C2 | MCDef tiers payant : iSanté, pour quels métiers ? | 49 | MCDef figure dans la liste publique iSanté pour sept métiers, de l’optique aux cliniques, au 18/11/2026. Libellé et numéro AMC à vérifier sur la carte. | 151 |
| `la-banque-postale-prevoyance` | C2 | La Banque Postale tiers payant : iSanté par métier | 50 | La Banque Postale Prévoyance figure dans la liste publique iSanté pour sept métiers, au 18/11/2026. Libellé, numéro AMC et que faire si la carte diffère. | 153 |
| `ircem` | C2 | IRCEM tiers payant : iSanté, pour quels métiers ? | 49 | IRCEM figure dans la liste publique iSanté pour sept métiers, de l’optique aux cliniques, au 18/11/2026. Libellé et numéro AMC à vérifier sur la carte. | 151 |
| `mutuelles-du-soleil` | C2 | Mutuelles du Soleil tiers payant : iSanté par métier | 52 | Les Mutuelles du Soleil figurent dans la liste publique iSanté pour sept métiers, au 18/11/2026. Libellé, numéro AMC et que faire si la carte diffère. | 150 |
| `mutuelle-sapeurs-pompiers` | C2 | Mutuelle des Sapeurs-Pompiers : tiers payant iSanté | 51 | La Mutuelle des Sapeurs-Pompiers figure dans la liste publique iSanté pour quatre métiers, au 18/11/2026. Libellé et numéro AMC à vérifier sur la carte. | 152 |
| `territoria-mutuelle` | C2 | Territoria Mutuelle tiers payant : iSanté par métier | 52 | Territoria Mutuelle figure dans la liste publique iSanté pour sept métiers, au 18/11/2026. Libellé, numéro AMC et que faire si la carte du patient diffère. | 155 |
| `entis` | C2 | Entis Mutuelles tiers payant : iSanté, pour quels métiers ? | 59 | Entis Mutuelles figurent dans la liste publique iSanté pour sept métiers, au 18/11/2026. Libellé, numéro AMC et que faire si la carte du patient diffère. | 153 |
| `harmonie-fonction-publique` | C2 | Harmonie Fonction Publique tiers payant : iSanté par métier | 59 | Harmonie Fonction Publique figure dans la liste publique iSanté pour cinq métiers, au 18/11/2026. Libellé, numéro AMC et que faire si la carte diffère. | 151 |
| `mutualia` | C1 | Mutualia tiers payant optique : quel portail ? | 46 | Mutualia figure dans la liste publique iSanté pour l’optique (relevé du 18/11/2026). Les sept libellés, leurs numéros AMC et que faire si la carte diffère. | 155 |
| `cpcea-agrica` | C1 | CPCEA - Agrica tiers payant optique : quel portail ? | 52 | CPCEA - Agrica figure dans la liste publique iSanté pour l’optique, au 18/11/2026. Le libellé, le numéro AMC et que faire si la carte du patient diffère. | 153 |
| `smabtp` | C2 | SMABTP tiers payant : iSanté, pour quels métiers ? | 50 | SMABTP figure dans la liste publique iSanté pour cinq métiers, du dentaire aux cliniques, au 18/11/2026. Libellé et numéro AMC à vérifier sur la carte. | 151 |
| `apgis` | C2 | APGIS tiers payant : SP santé, pour quels métiers ? | 51 | APGIS figure dans la liste publique SP santé pour cinq métiers, du dentaire aux cliniques, au 18/11/2026. Libellé et numéro AMC à vérifier sur la carte. | 152 |
| `areas` | C2 | Areas Assurances tiers payant : SP santé par métier | 51 | Areas Assurances figure dans la liste publique SP santé pour cinq métiers, au 18/11/2026. Libellé, numéro AMC et que faire si la carte du patient diffère. | 154 |
| `mapa` | C2 | MAPA tiers payant : SP santé, pour quels métiers ? | 50 | MAPA figure dans la liste publique SP santé pour quatre métiers, au 18/11/2026. Le libellé, le numéro AMC et que faire si la carte du patient diffère. | 150 |
| `mutuelle-de-poitiers` | C3 | Mutuelle de Poitiers tiers payant : portail par métier | 54 | Mutuelle de Poitiers : SP santé pour cinq métiers, iSanté pour les cliniques (listes publiques du 18/11/2026). Libellés et numéro AMC, carte à l’appui. | 151 |
| `mutuelle-sg` | C2 | Mutuelle SG tiers payant : iSanté, pour quels métiers ? | 55 | La Mutuelle SG indique passer par iSanté pour six métiers (page lue le 18/11/2026). Ce qu’il faut vérifier sur la carte, et que faire si elle diffère. | 150 |
| `mutuelle-ratp` | C2 | Mutuelle RATP tiers payant : Viamedis, pour quels métiers ? | 59 | Selon Acuité (09/01/2026), la Mutuelle RATP passe par Viamedis pour l’optique et l’audioprothèse. Que vérifier sur la carte, et que faire si elle diffère. | 154 |
| `henner` | C2 | Henner tiers payant : SP santé, pour quels métiers ? | 52 | Henner figure dans la liste publique SP santé pour quatre métiers, au 18/11/2026. Le libellé, le numéro AMC et que faire si la carte du patient diffère. | 152 |
| `sigmage` | C2 | Sigmage tiers payant : SP santé, pour quels métiers ? | 53 | Sigmage figure dans la liste publique SP santé pour cinq métiers, au 18/11/2026. Le libellé, le numéro AMC et que faire si la carte du patient diffère. | 151 |

## 4. Maillage

### 4.1 Articles qui devraient pointer vers l’outil, par pertinence

Les dev en posent 3 au plus : les rangs 1 à 3. Contenu du moteur SEO (`content/ressources/`) : PR à part, après la mise
en ligne du hub.

| Rang | Article | Où | Quoi poser (phrase exacte) | Pourquoi |
|---|---|---|---|---|
| 1 | `mutuelle-quel-portail` | H2 « Comment lire le résultat de notre outil mutuelle → portail ? », 1er paragraphe (en gras) | Le remplacer par : `<strong>Notre <a href="/outils/mutuelle-portail">annuaire Quel portail pour quelle mutuelle ?</a> donne, pour chaque complémentaire relevée, l’opérateur de tiers payant métier par métier, avec la source et la date du relevé.</strong> Il sert à gagner du temps quand la carte n’affiche pas clairement la plateforme, ou quand vous voulez savoir où vous connecter avant d’ouvrir un portail.` ; et, au paragraphe suivant, « Qu’une mutuelle apparaisse dans le sélecteur d’un portail veut dire qu’elle y était proposée au moment du relevé. » devient « Qu’une mutuelle figure dans la liste d’un opérateur veut dire qu’elle y était ouverte au moment du relevé. » | Le titre de l’article promet l’outil ; la phrase actuelle annonce 281 mutuelles relevées dans les sélecteurs, ce que l’outil n’est pas. Le reste de la section (« Quatre usages », « Ce que l’outil ne remplace pas ») reste juste. Le changement de H1 reste à Paul (`cadre.md` § 12) |
| 2 | `portails-tiers-payant` | H2 « Comment savoir quel portail correspond à la mutuelle du client ? », à la fin du 1er paragraphe | Ajouter : `Pour vous orienter avant d’ouvrir un portail, notre <a href="/outils/mutuelle-portail">annuaire des mutuelles par portail</a> donne l’opérateur relevé pour chaque métier, avec sa date.` | L’intertitre est la question de l’outil ; page déjà visible en Search Console |
| 3 | `portail-isante` | H2 « Qu’est-ce qu’iSanté et quelles mutuelles passent par lui ? », à la fin du 5e paragraphe (« Au moment de la demande… ») | Ajouter : `Pour les autres métiers, de l’audioprothèse aux cliniques, notre <a href="/outils/mutuelle-portail">annuaire des mutuelles par portail</a> reprend la liste publique d’iSanté, métier par métier, avec la date du relevé.` | Une des fiches les plus vues du site ; la section répond déjà à « quelles mutuelles passent par iSanté » pour l’optique seulement |
| 4 | `portail-sp-sante` | H2 « Qu’est-ce que SP Santé et quelles mutuelles passent par lui ? », à la fin du 4e paragraphe (« Côté optique, la liste publique… ») | Ajouter : `Pour les autres métiers, de l’audioprothèse aux cliniques, notre <a href="/outils/mutuelle-portail">annuaire des mutuelles par portail</a> reprend cette liste publique, métier par métier.` | Même raison que le rang 3 |
| 5 | `quand-relancer-mutuelle` | H2 « Pourquoi un dossier de tiers payant reste-t-il impayé ? », 2e paragraphe | Remplacer la phrase « L’outil Ma mutuelle passe par quel portail ? permet de retrouver… » par : `Notre annuaire <a href="/outils/mutuelle-portail">Quel portail pour quelle mutuelle ?</a> retrouve l’opérateur relevé pour votre métier, à partir du nom de la mutuelle ou de son numéro AMC.` | La phrase actuelle renvoie vers un outil qui n’existe pas |
| 6 | `rejet-beneficiaire-inconnu` | H2 « Comment corriger… sans refacturer l’AMO ? », puce « Vérifier le bon portail » | Remplacer la fin par : `notre <a href="/outils/mutuelle-portail">annuaire des mutuelles par portail</a> donne l’opérateur relevé pour votre métier, avec la date du relevé.` | La puce promet « ce que propose le sélecteur de chaque portail », que l’outil ne donne pas |
| 7 | `checklist-prise-en-charge` | H2 « Quelles sont les causes d’un rejet de prise en charge optique ? », 3e paragraphe | Adresse du lien « savoir par quel portail passe une mutuelle » → `/outils/mutuelle-portail` (ancre inchangée) | Ancre déjà juste |
| 8 | `almerys-prise-en-charge` | H2 « Qu’est-ce qu’une PEC Almerys et qui décide de l’accord ? », paragraphe « Sur le portail, il n’y a pas de liste… » | Adresse du lien → `/outils/mutuelle-portail` ; texte de l’ancre : « Quel portail pour quelle mutuelle ? » | Page très visible ; promesse d’outil |
| 9 | `portail-oxantis` | H2 « Quelles mutuelles passaient par Oxantis TP ? », à la fin du 4e paragraphe | Ajouter : `Pour savoir où passe aujourd’hui une mutuelle, métier par métier, voyez notre <a href="/outils/mutuelle-portail">annuaire des mutuelles par portail</a>.` | Les anciens clients d’Oxantis cherchent leur nouveau portail |
| 10 | `refus-pec-verres-myopie-miyosmart-courrier` | H2 « Quand relancer le réseau, et vers qui escalader ? », paragraphe « Vous ne savez pas quelle plateforme… » | Remplacer « Notre outil Ma mutuelle passe par quel portail ? indique ce que propose le sélecteur de chaque portail. » par : `Notre annuaire <a href="/outils/mutuelle-portail">Quel portail pour quelle mutuelle ?</a> donne l’opérateur relevé pour chaque métier.` | Promesse fausse à corriger |

**Le lot des fiches mutuelles** (hors des 3, une seule PR moteur, l’adresse du lien seulement) : 19 fiches disent
« notre outil aide à savoir par quel portail passe une mutuelle » avec un lien vers `mutuelle-quel-portail` :
`portail-aesio`, `portail-alan`, `portail-allianz`, `portail-april`, `portail-generali`, `portail-groupama`,
`portail-harmonie-mutuelle`, `portail-interiale`, `portail-klesia`, `portail-maaf`, `portail-malakoff-humanis`,
`portail-matmut`, `portail-mnt`, `portail-mutuelle-familiale`, `portail-previfrance`, `portail-pro-btp`,
`portail-solimut`, `portail-swiss-life`, `portail-viasante`, plus `gerer-tiers-payant-magasin` et
`audioprothese-renouvellement-tiers-payant`. Remplacer `/ressources/mutuelle-quel-portail` par `/outils/mutuelle-portail`
dans ce seul lien. Restent sur l’article (« cette page aide à… », « voyez comment… ») : `portail-apicil`,
`portail-carte-blanche`, `portail-kalixia`, `portail-mgen`, `portail-mma`. C’est aussi le lien retour fiche → hub que
demande `seo.md` § 4.5.

### 4.2 Liens de l’outil vers les articles (`ArticlesLies`)

| Page | Articles (1 à 3) | Autres outils |
|---|---|---|
| Hub | `mutuelle-quel-portail` (lire le numéro AMC), `portails-tiers-payant`, `rejet-beneficiaire-inconnu` | B : « Combien la complémentaire prend en charge » ; A : « Un rejet de la part Sécurité sociale » |
| Entrées | la fiche de l’opérateur principal, `mutuelle-quel-portail` | B, A |
| Lignes du hub vers les fiches | chaque mutuelle qui a une fiche y mène (« Fiche ») | |

## 5. Liste de contrôle TON.md

- [x] **Le résultat d’abord, l’IA jamais en premier** : carte pont « Prises en charge saisies, factures suivies, relances
  faites : les agents Granit… » ; « agents », jamais « IA » (§ 1.7).
- [x] **Phrases courtes, affirmatives, concrètes** : réponses en deux phrases, FAQ en trois ou quatre phrases.
- [x] **Les vrais objets du métier** : carte de tiers payant, numéro AMC, opérateur, prise en charge, portail, segment.
- [x] **Un chiffre vrai et sourcé** : numéros AMC, dates de relevé et d’ouverture, « sept libellés » : tous lus dans les
  listes publiques ; aucun nombre de complémentaires par opérateur (les chiffres des comparateurs se contredisent) ;
  aucun « 281 ».
- [x] **Pas de superlatif ni de peur** : aucun.
- [x] **Vouvoiement** : « Cherchez », « vous voyez », « Suivez la carte ».
- [x] **Français simple, sigles définis** : AMC défini dans le chapeau ; PEC n’est cité que dans une citation de carte.
- [x] **Pas de tiret long** : aucun.
- [x] **Typographie française** : espaces insécables, guillemets « », apostrophe ’.
- [x] **Pas d’emoji**.
- [x] **On dit / on ne dit pas** : « la mutuelle », « la complémentaire » ; « sur vos portails, comme le ferait une
  personne » (formule de la colonne « on dit ») ; pas de « connecteur », pas d’« intégration ».
- [x] **Jargon interdit** : aucun.
- [x] **Ce qu’on peut affirmer** : pas de « Granit travaille avec toutes les plateformes » (validé en optique et audio
  seulement, l’outil vise cinq métiers) ; pas de client, pas de prix, pas de délai.
- [x] **Allié contre la paperasse, jamais contre quelqu’un** : aucun jugement sur un opérateur ou une mutuelle (Oxantis :
  un fait daté, sans commentaire).
- [x] **Première phrase sur le lecteur** : « Cherchez la complémentaire… ».

## 6. À signaler

- **Paul** : « libellé relevé » au lieu de « libellé à choisir » (conventions) ; les cas C1 et C2 (§ 3.1) ; le lot de
  liens du § 4.1, qui corrige en même temps une promesse d’outil inexistant dans une trentaine d’articles.
- **Le 01/12/2026** : relire la phrase MGEN de l’encadré « Changements récents » (§ 1.3) et les métiers MGEN
  `a_verifier`, après la bascule annoncée au 30/11/2026.
- **data-C** : les champs structurés de `cadre.md` § 5 (`libelle_selecteur` à renommer `libelle_liste`, `numero_amc`,
  `actif_depuis`, `sous_domaines`) éviteraient l’extraction par expression régulière ; le nom court de trois
  complémentaires (`NOMS_COURTS`) et l’article des noms en « Mutuelle… » (`SUJETS`) sont dans le script de la nuit
  (`scripts/copy-seo/rendre_c.py`) : à reprendre dans `publication.mjs`.
- **dev-C** : `sources.md` (tableau des entrées) marque MGEN pharmacie « Viamedis (sûr) » alors que `donnees.json` le dit
  `a_verifier` : suivre `donnees.json`.
