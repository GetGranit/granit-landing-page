# Outil B · Remboursement · textes

Rédigé le 18/11/2026 par copy-seo (équipe de nuit). À lire avec `cadre.md` (les groupes, les pages publiées),
`formules.md` (qui fait foi pour tout montant), `sources.md`, `../socle.md` et `../seo.md` § 5. Ce fichier donne les
mots ; il ne change ni les groupes ni les règles de `cadre.md`, sauf là où il est écrit « écart avec cadre.md ».
Périmètre : la V0 de `cadre.md`, optique et audio, 7 pages de groupe.

**Conventions**

- La typographie est déjà posée : espace insécable avant `: ; ? !`, dans les guillemets « », entre un nombre et son
  unité (9,75 €, 60 %) et dans les milliers (1 400 €) ; apostrophe ’. Recopier tel quel.
- Longueurs comptées par script, en caractères, espaces comprises : `<title>` 60 au plus ; description entre 140 et
  155 (le test du socle accepte 160).
- Entre accolades : un champ de `donnees.json` ou de `groupes.mjs`. Tout montant affiché vient de `donnees.json` ou de
  `formules.md` ; les mots ne font que les relier. Identifiant de source entre crochets.
- « Sécu » dans les titres et les descriptions (le mot cherché) ; « Sécurité sociale » dans les phrases.

## 1. Le hub `/outils/remboursement`

### 1.1 En-tête

| Élément | Texte | Car. |
|---|---|---|
| `<title>` | Remboursement par code LPP : base Sécu et part mutuelle | 55 |
| Description | Pour chaque code LPP d’optique et d’audio : base de remboursement, part Sécu, ticket modérateur et part de la mutuelle en 100 % Santé, au tarif daté. | 149 |
| H1, `titre` | Base de remboursement et part mutuelle, | |
| H1, `accent` | code par code | |
| Sur-titre | Outil gratuit · tiers payant | |
| Chapeau | Tapez un code de la liste des produits et prestations (LPP) ou cherchez un équipement : verre, monture, aide auditive. Vous lisez la base de remboursement, la part de la Sécurité sociale, le ticket modérateur et ce qui revient à la complémentaire, d’après la base LPP de l’Assurance Maladie. | |

Écart avec `cadre.md` § 5 : la description dit « part de la mutuelle en 100 % Santé » et non « part mutuelle de
chaque code » : hors 100 % Santé, l’outil ne donne que le minimum dû par un contrat responsable (`formules.md` § 2).

### 1.2 Recherche, filtres, lignes (repris de `cadre.md`)

| Élément | Texte |
|---|---|
| Libellé du champ | Code LPP ou équipement |
| Placeholder | 2263287, verre progressif… |
| Aide | Le code à 7 chiffres du devis ou de la facture. |
| Compteur | « {n} codes », « {visibles} sur {n} » |
| Filtres | `domaine` : Tous · Optique · Audio ; `panier` : Tous · 100 % Santé · Tarif libre |
| Groupe replié | « {nom} · {n} codes · base {de … à …} » et le lien « Voir la page » |
| Ligne | « Base {base} · Sécu {rembourse_secu} · Prix limite {prix_limite} » ; tarif libre : « Base {base} · Sécu {rembourse_secu} · Prix libre » |

### 1.3 Blocs avertissement

`a-venir`, **avant** la liste (hub) et sous l’avertissement `fait-foi` (pages de groupe). Sur-titre « Au 1er janvier
2027 » :

> La part de la Sécurité sociale sur les produits de la LPP (optique, aides auditives) va baisser : le taux,
> aujourd’hui de 60 %, sera compris entre 40 et 50 % (décret n° 2026-810 du 21 août 2026). Le taux exact n’était pas
> publié au 18/11/2026. Le décret ne change ni la base ni le prix limite ; en 100 % Santé, le reste à charge reste nul en
> contrat responsable : c’est la part de la complémentaire qui augmente.

[decret-2026-810, css-r160-5-2027, css-r871-2 ; `formules.md` § 5]

À partir du 01/01/2027, tant que `TAUX_2027.lpp` vaut `null` (sur-titre « Depuis le 1er janvier 2027 ») :

> Depuis le 1er janvier 2027, la part de la Sécurité sociale sur la LPP est comprise entre 40 et 50 % (décret
> n° 2026-810). Le taux exact n’est pas encore publié : nous n’affichons pas de montant Sécu.

`fait-foi` (pages de groupe, sous L’essentiel ; hub : au-dessus des sources) :

> Ces montants viennent de la base LPP de l’Assurance Maladie (version 910 du 13/11/2026), qui fait foi. Un code par
> fabricant reprend en général les montants de son code générique.

### 1.4 État vide

| Requête | Message |
|---|---|
| 7 chiffres commençant par 7 | Les codes qui commencent par 7 sont des codes par fabricant : ils reprennent en général la désignation et les montants d’un code générique, qui commence par 2. Cherchez la désignation (« verre unifocal classe A ») ou retrouvez le code générique dans la base LPP. + lien « Base LPP de l’Assurance Maladie » (source `lpp-cnam-v910`) |
| 7 chiffres, inconnus | Ce code n’est pas un code générique d’optique ou d’audio de la base LPP du 13/11/2026. Vérifiez-le dans la base LPP de l’Assurance Maladie. |
| Code CCAM (4 lettres, 3 chiffres) | Le dentaire n’est pas encore dans l’outil. Les honoraires limites des prothèses sont publiés par l’Assurance Maladie. + lien `dentaire-paniers-100-sante-tiers-payant` |
| 13 chiffres commençant par 34 | Les médicaments ne sont pas dans l’outil. La base de données publique des médicaments donne le prix et le taux de chaque boîte. + lien base-donnees-publique.medicaments.gouv.fr |
| Texte | Aucun équipement ne correspond à « {q} ». Essayez « verre », « monture », « progressif », « aide auditive » ou le code à 7 chiffres. |

Toujours dessous : « Effacer la recherche », « Comment se calcule un remboursement » (ancre de la méthode), « Signaler
un code manquant » (`mailto:contact@getgranit.ai?subject=Code%20LPP%20manquant`).

[codes 7… : sources.md, « Ce qu’on a extrait » ; CIP : bdpm-cis-cip]

### 1.5 Entrée introuvable (404, `noindex`)

- H1 : « {slug} : introuvable »
- Message, selon la forme du slug : `lpp-7…` ou `7…` → la ligne « commençant par 7 » du tableau 1.4 ; `ccam-…` → la
  ligne CCAM ; sinon : « Cette page n’existe pas. Les pages de l’outil portent sur un groupe d’équipements : verres
  unifocaux, multifocaux ou progressifs de classe A, verres de classe B, montures, prestations, aides auditives. »
- Recherche préremplie avec le code tiré du slug, lien « Voir tous les codes ».

### 1.6 Texte de méthode du hub (proposé, environ 330 mots)

> **## Comment se calcule un remboursement**
>
> La Sécurité sociale rembourse un pourcentage de la base de remboursement : 60 % pour l’optique et les aides
> auditives au 18/11/2026. Le reste de la base est le ticket modérateur. Exemple lu dans la base LPP : le verre
> unifocal de classe A « SPHERE] 0 A -2,00] » (code 2263287) a une base de 9,75 € ; la Sécurité sociale rembourse
> 5,85 €, le ticket modérateur est de 3,90 €.
> [ameli-taux, lpp-cnam-v910 ; `formules.md` § 1]
>
> **## 100 % Santé et prix limite de vente**
>
> En classe A (optique) et en classe I (aides auditives), le prix ne peut pas dépasser le prix limite de vente fixé
> par la LPP. Jusqu’à ce prix, un contrat responsable prend en charge le ticket modérateur et tout ce qui dépasse la
> base : le patient ne paie rien. Pour le verre 2263287 facturé 32,50 €, la complémentaire paie 26,65 €. Sans
> complémentaire, ou avec un contrat non responsable, ce reste à charge nul n’est pas garanti.
> [lpp-cnam-v910, css-r871-2, ameli-optique ; `formules.md` § 2]
>
> **## Hors 100 % Santé**
>
> En classe B et en classe II, le prix est libre. Un contrat responsable doit couvrir au moins le ticket modérateur ;
> au-delà, tout dépend du contrat, dans des plafonds fixés par l’article R871-2 du Code de la sécurité sociale :
> 100 € pour une monture, 1 700 € par aide auditive, Sécurité sociale comprise. Pour les verres, les plafonds dépendent
> de catégories (verres simples, complexes) que les textes lus ne relient pas aux codes LPP : l’outil n’en affiche pas.
> [css-r871-2 ; `formules.md` § 2]
>
> **## Codes génériques et codes par fabricant**
>
> Les montants de l’outil sont ceux des codes génériques de la LPP, qui commencent par 2. Un code par fabricant, qui
> commence par 7, reprend, souvent en abrégé, la désignation d’un code générique suivie du nom du fabricant, en général avec les mêmes montants :
> cherchez sa désignation pour les retrouver.
> [lpp-cnam-v910 ; sources.md, « Ce qu’on a extrait »]
>
> **## Ce que l’outil ne calcule pas**
>
> Les cas où le taux de la Sécurité sociale diffère : affection de longue durée, Complémentaire santé solidaire,
> accident du travail ou maladie professionnelle, maternité, régime local d’Alsace-Moselle, régime des Mines. Ni la
> part réelle d’un contrat au-delà de ces minimums : elle dépend du contrat.
> [`formules.md` § 1 et § 2]

### 1.7 Carte pont (hub et groupes)

| Élément | Texte |
|---|---|
| `texte` | La prise en charge saisie, la facture envoyée, le virement de la mutuelle pointé : les agents Granit s’en chargent, dans les logiciels que vos équipes utilisent déjà. |
| Bouton (socle) | Voir ce que font les agents ; option métier : « Voir ce que font les agents pour les opticiens » (cible `/metiers/opticiens`, `cadre.md` § 9) |
| Lien | Demander une démo |

Écart avec `cadre.md` § 9 : mêmes verbes (« saisissent les prises en charge, facturent et pointent les virements »),
tournés pour que le résultat vienne avant les agents (TON.md, règle 1).

## 2. FAQ du hub

`FaqOutil` avec `jsonLd: true` sur le hub seulement (`cadre.md` § 5, socle § 6.13) ; le balisage décrit une FAQ visible,
sans attente d’affichage enrichi (`seo.md` § 2.4). Aucune FAQ sur les pages de groupe. Les questions évitent celles des
articles `reste-a-charge-drees-expliquer-devis` (« Le panier 100 % Santé supprime-t-il tout reste à charge ? ») et
`ticket-moderateur-2027-tiers-payant` (« Qu’est-ce qui change au 1er janvier 2027… ? »).

**Combien rembourse la Sécurité sociale pour une monture de classe A ?**
5,40 € : la base de remboursement d’une monture de classe A, adulte ou enfant, est de 9 €, remboursée à 60 % (taux au
18/11/2026). Le prix limite de vente est de 30 € ; en contrat responsable, la complémentaire paie les 24,60 € restants
et le patient ne paie rien. [lpp-cnam-v910, ameli-taux, css-r871-2]

**Qu’est-ce que le prix limite de vente ?**
C’est le prix maximal qu’un professionnel peut facturer pour un produit du 100 % Santé, fixé par la LPP : classe A en
optique, classe I en audio. Jusqu’à ce prix, un contrat responsable prend en charge tout ce que la Sécurité sociale ne
rembourse pas. Sans complémentaire, ou avec un contrat non responsable, le reste à charge nul n’est pas garanti.
[lpp-cnam-v910, css-r871-2 ; `formules.md` § 2]

**Peut-on associer des verres de classe A et une monture de classe B ?**
Oui. La monture et les verres peuvent être de classes différentes. Les deux verres, eux, doivent être de la même
classe. [ameli-optique]

**La part de la Sécurité sociale sur les lunettes change-t-elle en 2027 ?**
Oui. Le décret n° 2026-810 du 21 août 2026 fait passer la participation de l’assuré sur les produits de la LPP
(optique, aides auditives) de 40 à 50 % à 50 à 60 % au 1er janvier 2027 : la part de la Sécurité sociale sera comprise
entre 40 et 50 %, au lieu de 60 %. Le taux exact n’était pas publié au 18/11/2026. La base et le prix limite ne
changent pas ; en 100 % Santé, la complémentaire d’un contrat responsable prend la différence.
[decret-2026-810, css-r160-5-2027, css-r871-2]

**Pourquoi le code LPP du devis commence-t-il par 7 ?**
C’est un code par fabricant. Il reprend, souvent en abrégé, la désignation d’un code générique, qui commence par 2, suivie du nom du
fabricant, en général avec les mêmes montants. Cherchez la désignation (« verre unifocal classe A ») pour retrouver la base et le
prix limite. [lpp-cnam-v910 ; sources.md]

## 3. Les pages de groupe `/outils/remboursement/<groupe>`

### 3.1 Ce que chaque groupe porte dans `groupes.mjs`

| Slug | Nom (fil, cartes) | `<title>` | n | Description | n | H1 | Sur-titre |
|---|---|---|---|---|---|---|---|
| `verre-unifocal-classe-a` | Verre unifocal classe A | Verre unifocal classe A : remboursement Sécu et mutuelle | 56 | Les 30 codes LPP du verre unifocal classe A : base de remboursement, part Sécu, ticket modérateur, prix limite et part mutuelle, d’après la base LPP. | 149 | Verre unifocal classe A : base de remboursement et part mutuelle | Optique · 100 % Santé · code LPP |
| `verre-multifocal-classe-a` | Verre multifocal classe A | Verre multifocal classe A : remboursement Sécu et mutuelle | 58 | Les 30 codes LPP du verre multifocal classe A : base, part Sécu, ticket modérateur, prix limite et part de la mutuelle, lus dans la base LPP. | 141 | Verre multifocal classe A : base de remboursement et part mutuelle | Optique · 100 % Santé · code LPP |
| `verre-progressif-classe-a` | Verre progressif classe A | Verre progressif classe A : remboursement Sécu et mutuelle | 58 | Verre progressif classe A : base de remboursement, part Sécu, prix limite et part mutuelle des 30 codes LPP, avec le calcul pour un code et sa date. | 148 | Verre progressif classe A : base de remboursement et part mutuelle | Optique · 100 % Santé · code LPP |
| `verres-classe-b` | Verres classe B | Verres classe B : remboursement Sécu et mutuelle | 48 | Verres classe B : 0,05 € de base pour les 90 codes LPP, ce que rembourse la Sécu et ce que doit au moins un contrat responsable. Tarif daté, source LPP. | 152 | Verres classe B : base de remboursement et part mutuelle | Optique · tarif libre · code LPP |
| `montures` | Monture de lunettes | Monture de lunettes : remboursement Sécu et mutuelle | 52 | Monture adulte ou enfant, classe A ou B : base de remboursement, part Sécu, prix limite de 30 € en 100 % Santé et plafond de 100 € en contrat responsable. | 154 | Monture classe A ou B : base de remboursement et part mutuelle | Optique · classes A et B · code LPP |
| `prestations-optique` | Prestations et suppléments optique | Adaptation, appairage, suppléments : remboursement LPP | 54 | Adaptation des verres, appairage, supplément d’accompagnement, verres teintés : la base LPP, la part Sécu et le prix limite de chaque code, datés. | 146 | Adaptation, appairage et suppléments optique : base de remboursement | Optique · prestations · code LPP |
| `aides-auditives` | Aide auditive | Aide auditive classe I ou II : remboursement et mutuelle | 56 | Aide auditive classe I ou II, avant ou après 20 ans : base de remboursement, part Sécu, prix limite, plafond de 1 700 € et calcul pour un code LPP. | 147 | Aide auditive classe I ou II : base de remboursement et part mutuelle | Audio · classes I et II · code LPP |

Règle pour un groupe ajouté plus tard (dentaire, freinateurs) : `<title>` « {Nom} : remboursement Sécu et mutuelle »,
H1 « {Nom} : base de remboursement et part mutuelle », sur-titre « {Métier} · {panier} · code {LPP ou CCAM} »,
description écrite à la main, avec le nombre de codes et la source.

### 3.2 Réponse (chapeau), selon le panier du groupe

| Cas | Jusqu’au 31/12/2026 | Depuis le 01/01/2027, `TAUX_2027` à `null` |
|---|---|---|
| Tout le groupe en 100 % Santé (verres de classe A) | « La Sécurité sociale rembourse 60 % de la base, soit {de Sécu min à Sécu max} par verre selon la correction. En contrat responsable, la complémentaire paie le reste jusqu’au prix limite ({prix limite min à max}) : le patient ne paie rien. » | « Depuis le 1er janvier 2027, le nouveau taux de la Sécurité sociale n’est pas encore publié : nous n’affichons pas sa part. La base reste {de … à …} et le prix limite {de … à …} ; en contrat responsable, le patient ne paie rien jusqu’à ce prix. » |
| Tout le groupe à tarif libre (verres de classe B) | « La base est de {base} par verre, quelle que soit la correction : la Sécurité sociale rembourse {Sécu}. Au-delà, la prise en charge dépend du contrat ; un contrat responsable couvre au moins le ticket modérateur ({ticket modérateur}). » | même première phrase ; puis « La base reste de {base} par verre ; au-delà, la prise en charge dépend du contrat. » |
| Groupe mixte (montures, prestations, aides auditives) | phrase écrite par groupe dans `groupes.mjs`, à partir des montants (exemples ci-dessous) | même première phrase ; puis la base et le prix limite du groupe, sans montant Sécu |

Groupes mixtes, texte à recopier :

- `montures` : « Une monture de classe A, adulte ou enfant, a une base de 9 € : la Sécurité sociale en rembourse
  5,40 €, et un contrat responsable paie le reste jusqu’au prix limite de 30 €. En classe B, la base est de 0,05 €
  (0,03 € remboursés) et le prix est libre ; la prise en charge d’un contrat responsable est plafonnée à 100 €,
  Sécurité sociale comprise. » [lpp-cnam-v910, css-r871-2]
- `prestations-optique` : « Chaque prestation a son code LPP : adaptation des verres, appairage, supplément
  d’accompagnement, verres teintés, verre neutre. La Sécurité sociale rembourse 60 % de leur base, de 0,03 € à
  25,20 € selon le code ; le tableau donne le prix limite de chacun. » [lpp-cnam-v910, ameli-taux]
- `aides-auditives` : voir l’exemple 3 du § 3.8.

### 3.3 L’essentiel, selon le panier

| Ligne | 100 % Santé | Tarif libre | Mixte |
|---|---|---|---|
| Base de remboursement | {de … à …} | {base} (tous les codes) | « Classe A : 9 € · classe B : 0,05 € » (montures) ; « 400 € ou 1 400 € selon l’âge » (aides auditives) ; {de … à …} (prestations) |
| Taux Sécu | « 60 % (jusqu’au 31/12/2026) » ; depuis le 01/01/2027 : « taux 2027 non publié » | idem | idem |
| Prix limite de vente | {de … à …} | « prix libre » | par classe |
| Reste à charge en contrat responsable | « 0 € jusqu’au prix limite » | « selon le contrat » | « 0 € en classe A (I) ; selon le contrat en classe B (II) » |
| Tarif en vigueur depuis | « {date_tarif} (arrêté du {date_arrete}) » ; supplément d’accompagnement : 10/08/2023 | idem | idem |

### 3.4 Intertitres des sections (`cadre.md` § 6, blocs 6 à 9)

| Section | Verres de classe A | Verres de classe B | Montures | Prestations | Aides auditives |
|---|---|---|---|---|---|
| Calcul | Calculer le remboursement d’un verre | Calculer le remboursement d’un verre | Calculer le remboursement d’une monture | Calculer le remboursement d’une prestation | Calculer le remboursement d’une aide auditive |
| Tableau | Les 30 codes LPP du {verre unifocal, multifocal, progressif} classe A | Les 90 codes LPP des verres classe B | Les 6 codes LPP des montures | Les 9 codes LPP des prestations et suppléments | Les 8 codes LPP des aides auditives |
| Paragraphe généré | D’une correction à l’autre | D’une correction à l’autre | Adulte, enfant, classe A ou B | D’une prestation à l’autre | Selon l’âge, la classe et l’oreille |
| `texte` du groupe | Un équipement complet en classe A (unifocal, progressif) ; Multifocal ou progressif : deux codes (multifocal) | Ce que doit le contrat responsable | Monture enfant et monture à coque | Adaptation, appairage, accompagnement | Renouvellement et essai |
| Conditions | Conditions de prise en charge | idem | idem | (absent : pas de conditions dans les données) | idem |
| Limites | Ce que ce calcul ne couvre pas | idem | idem | idem | idem |

« Ce que ce calcul ne couvre pas » (gabarit commun) : « Ce calcul vaut pour le cas général. Il ne couvre pas les
situations où le taux de la Sécurité sociale diffère : affection de longue durée, Complémentaire santé solidaire,
accident du travail ou maladie professionnelle, maternité, régime local d’Alsace-Moselle, régime des Mines. Il ne dit
pas non plus ce que rembourse un contrat donné au-delà des minimums du contrat responsable. » [`formules.md` § 1, § 2]

### 3.5 Le paragraphe généré « D’une correction à l’autre »

Gabarit (verres) : « Les {n} codes se répartissent en {k} montants. La base va de {base min} ({codes et désignations
au minimum}) à {base max} ({codes et désignations au maximum}), et le prix limite de {min} à {max}. » Les désignations
sont citées telles quelles, entre guillemets (pas de réécriture des intervalles). Rendu pour le verre unifocal classe A :

> Les 30 codes se répartissent en 10 montants. La base va de 9,75 € (2229362 « SPHERE] 0 A +2,00] », 2263287 « SPHERE] 0 A -2,00] ») à 35,25 € (2236586 « SPHERE < -12,00 ET CYLINDRE (+) >4 », 2293390 « SPHERE] -8,00 A -12,00] ET CYLINDRE (+) >4 »), et le prix limite de 32,50 € à 117,50 €.

Verres de classe B : « Les 90 codes ont la même base, 0,05 €, quelle que soit la correction ; seule la désignation
change. » Montures, prestations, aides auditives : une phrase par code ou par paire de codes, dans l’ordre du tableau.

### 3.6 Le texte propre de chaque groupe (`texte` de `groupes.mjs`)

Chaque paragraphe porte ses sources ; rien qui ne soit dans `donnees.json`, `sources.md` ou `formules.md`. Environ 60 à
90 mots par groupe, comme le demande `cadre.md` § 4.

```js
export const TEXTES = {
  "verre-unifocal-classe-a": [
    { p: "Un équipement complet de classe A, soit une monture adulte de classe A (code 2222124, prix limite 30 €) et deux verres 2263287 (« SPHERE] 0 A -2,00] », 32,50 € chacun), revient au plus à 95 € : en contrat responsable, le patient ne paie rien.",
      source_ids: ["lpp-cnam-v910", "css-r871-2"] },
    { p: "Deux codes peuvent avoir les mêmes montants pour des sphères de signe opposé : 2263287 (« SPHERE] 0 A -2,00] ») et 2229362 (« SPHERE] 0 A +2,00] ») ont tous deux une base de 9,75 € et un prix limite de 32,50 €. Le code dépend du signe de la sphère, pas seulement de sa valeur.",
      source_ids: ["lpp-cnam-v910"] },
  ],
  "verre-multifocal-classe-a": [
    { p: "Multifocal et progressif n’ont ni les mêmes codes ni les mêmes montants pour une même correction : pour « SPHERE [0 A -2,00] », le verre multifocal 2245190 a une base de 13,50 € et un prix limite de 45 €, le verre progressif 2249229 une base de 22,50 € et un prix limite de 75 €.",
      source_ids: ["lpp-cnam-v910"] },
    { p: "Avec une monture adulte de classe A (30 €), un équipement de deux verres 2245190 revient au plus à 120 € : en contrat responsable, le patient ne paie rien.",
      source_ids: ["lpp-cnam-v910", "css-r871-2"] },
  ],
  "verre-progressif-classe-a": [
    { p: "Un équipement de classe A en verres progressifs « SPHERE [0 A -2,00] » (code 2249229, 75 € par verre) et une monture adulte de classe A (30 €) revient au plus à 180 € : en contrat responsable, le patient ne paie rien.",
      source_ids: ["lpp-cnam-v910", "css-r871-2"] },
    { p: "Le prix limite le plus élevé, 170 € par verre, vaut pour les fortes corrections avec un cylindre de plus de 4 (codes 2234334 et 2299196).",
      source_ids: ["lpp-cnam-v910"] },
  ],
  "verres-classe-b": [
    { p: "Le contrat responsable fixe, pour la complémentaire, des minimums et des maximums par équipement (deux verres et une monture), Sécurité sociale comprise, selon que les verres sont simples ou complexes (article R871-2 du Code de la sécurité sociale). Les textes lus ne disent pas à quel code LPP correspond chaque catégorie : l’outil n’affiche donc pas de plafond pour les verres.",
      source_ids: ["css-r871-2"] },
    { p: "Dans un équipement à tarif libre, la monture a son propre plafond : 100 € au plus, Sécurité sociale comprise. Les deux verres doivent être de la même classe ; la monture peut être d’une autre classe.",
      source_ids: ["css-r871-2", "ameli-optique"] },
  ],
  "montures": [
    { p: "La monture enfant a son propre code jusqu’à 15 ans (âge maximal inscrit dans la base LPP), avec les mêmes montants que la monture adulte : base de 9 € et prix limite de 30 € en classe A, base de 0,05 € en classe B.",
      source_ids: ["lpp-cnam-v910"] },
    { p: "Avant 6 ans, un supplément pour monture à coque s’ajoute : base de 6 € et prix limite de 20 € en classe A, base de 0,05 € en classe B (âge maximal inscrit : 5 ans).",
      source_ids: ["lpp-cnam-v910"] },
  ],
  "prestations-optique": [
    { p: "La prestation d’adaptation des verres de classe A a une base égale à son prix limite, 10 € : la Sécurité sociale en rembourse 6 €, la complémentaire d’un contrat responsable 4 €. En classe B, sa base est de 0,05 € pour le même prix limite de 10 €.",
      source_ids: ["lpp-cnam-v910", "css-r871-2"] },
    { p: "L’appairage a trois niveaux, de 5 € à 15 € de prix limite pour des bases de 1,50 € à 4,50 €. Le supplément d’accompagnement de classe A, en vigueur depuis le 10/08/2023, a une base et un prix limite de 42 € : la Sécurité sociale en rembourse 25,20 €.",
      source_ids: ["lpp-cnam-v910"] },
    { p: "Pour l’appairage et le supplément pour verres teintés, la base LPP lue ne précise pas le panier : l’outil n’affiche pas de part de la complémentaire pour ces codes.",
      source_ids: ["lpp-cnam-v910"] },
  ],
  "aides-auditives": [
    { p: "La LPP distingue chaque oreille : un code par côté, par classe et par âge (plus de 20 ans, 20 ans et moins). La base de 1 400 € s’applique aussi, sans limite d’âge, aux personnes atteintes de cécité ou d’un handicap visuel.",
      source_ids: ["lpp-cnam-v910", "ameli-audio"] },
    { p: "Le renouvellement est pris en charge après 4 ans, comptés entre les dates de facturation de l’aide précédente et de la nouvelle. La facture suit un essai d’au moins 30 jours : la délivrance, et le tiers payant, interviennent à la fin de l’essai.",
      source_ids: ["ameli-audio"] },
  ],
};
```

Les équipements à 95 € et 180 € concordent avec la page du ministère sur la réforme 100 % Santé optique (sources.md,
« Recoupements ») ; celui à 120 € est la même addition sur la base LPP.

### 3.7 Le calcul (libellés, `cadre.md` § 6.1)

| Élément | Texte |
|---|---|
| Champ code | « Code LPP » (liste du groupe ; option : « {code} · {désignation} ») |
| Champ prix | « Prix facturé » (prérempli au prix limite en 100 % Santé, vide sinon) |
| Lignes du résultat | « Base de remboursement » · « Remboursé par la Sécurité sociale (60 %) » · « Ticket modérateur » · « Reste après la Sécurité sociale » |
| Contrat responsable, 100 % Santé | « La complémentaire prend {prix − Sécu} ; reste à charge : 0 €. » |
| Contrat responsable, tarif libre | « Au moins le ticket modérateur ({TM}) ; au-delà, selon le contrat. » ; monture : « Plafond : 100 € au plus, Sécurité sociale comprise. » ; aide auditive classe II : « Plafond : 1 700 € au plus par aide auditive, Sécurité sociale comprise. » |
| Alerte (100 % Santé, prix au-delà du prix limite) | « Au-delà du prix limite de vente ({PLV}), ce produit ne peut pas être facturé en 100 % Santé. » |
| Toujours | « Sans complémentaire, ou avec un contrat non responsable, le reste à charge n’est pas garanti nul. » |
| Depuis le 01/01/2027, taux non publié | « Taux 2027 non publié : nous n’affichons pas de montant Sécurité sociale. » |

### 3.8 Trois exemples rendus à partir de `donnees.json`

**1. `verre-unifocal-classe-a`** (tout en 100 % Santé)

- **Sur-titre** : Optique · 100 % Santé · code LPP
- **`<title>`** (56) : Verre unifocal classe A : remboursement Sécu et mutuelle
- **Description** (149) : Les 30 codes LPP du verre unifocal classe A : base de remboursement, part Sécu, ticket modérateur, prix limite et part mutuelle, d’après la base LPP.
- **H1** : Verre unifocal classe A : base de remboursement et part mutuelle
- **Réponse** (chapeau, jusqu’au 31/12/2026) : La Sécurité sociale rembourse 60 % de la base, soit de 5,85 € à 21,15 € par verre selon la correction. En contrat responsable, la complémentaire paie le reste jusqu’au prix limite (32,50 € à 117,50 €) : le patient ne paie rien.
- **Réponse** (à partir du 01/01/2027, taux non publié) : Depuis le 1er janvier 2027, le nouveau taux de la Sécurité sociale n’est pas encore publié : nous n’affichons pas sa part. La base reste de 9,75 € à 35,25 € et le prix limite de 32,50 € à 117,50 € ; en contrat responsable, le patient ne paie rien jusqu’à ce prix.
- **L’essentiel** : Base 9,75 € à 35,25 € · Taux Sécu 60 % (jusqu’au 31/12/2026) · Prix limite 32,50 € à 117,50 € ·
  Reste à charge en contrat responsable : 0 € jusqu’au prix limite · Tarif en vigueur depuis le 07/07/2023 (arrêté du
  03/07/2023)

**2. `verres-classe-b`** (tout à tarif libre)

- **Sur-titre** : Optique · tarif libre · code LPP
- **`<title>`** (48) : Verres classe B : remboursement Sécu et mutuelle
- **Description** (152) : Verres classe B : 0,05 € de base pour les 90 codes LPP, ce que rembourse la Sécu et ce que doit au moins un contrat responsable. Tarif daté, source LPP.
- **H1** : Verres classe B : base de remboursement et part mutuelle
- **Réponse** (chapeau, jusqu’au 31/12/2026) : La base est de 0,05 € par verre, quelle que soit la correction : la Sécurité sociale rembourse 0,03 €. Au-delà, la prise en charge dépend du contrat ; un contrat responsable couvre au moins le ticket modérateur (0,02 €).
- **Réponse** (à partir du 01/01/2027, taux non publié) : Depuis le 1er janvier 2027, le nouveau taux de la Sécurité sociale n’est pas encore publié : nous n’affichons pas sa part. La base reste de 0,05 € par verre ; au-delà, la prise en charge dépend du contrat.
- **L’essentiel** : Base 0,05 € (les 90 codes) · Taux Sécu 60 % (jusqu’au 31/12/2026) · Prix libre · Reste à charge
  en contrat responsable : selon le contrat, au moins le ticket modérateur (0,02 €) couvert · Tarif en vigueur depuis
  le 07/07/2023

**3. `aides-auditives`** (groupe mixte, audio)

- **Sur-titre** : Audio · classes I et II · code LPP
- **`<title>`** (56) : Aide auditive classe I ou II : remboursement et mutuelle
- **Description** (147) : Aide auditive classe I ou II, avant ou après 20 ans : base de remboursement, part Sécu, prix limite, plafond de 1 700 € et calcul pour un code LPP.
- **H1** : Aide auditive classe I ou II : base de remboursement et part mutuelle
- **Réponse** (chapeau, jusqu’au 31/12/2026) : En classe I (100 % Santé), la base est de 400 € pour les plus de 20 ans et de 1 400 € pour les 20 ans et moins : la Sécurité sociale en rembourse 60 %, et un contrat responsable paie le reste jusqu’au prix limite (950 € ou 1 400 €). En classe II, la base est la même et le prix libre ; la prise en charge d’un contrat responsable est plafonnée à 1 700 € par aide auditive, Sécurité sociale comprise.
- **Réponse** (à partir du 01/01/2027, taux non publié) : Depuis le 1er janvier 2027, le nouveau taux de la Sécurité sociale n’est pas encore publié : nous n’affichons pas sa part. Le décret ne change ni la base (400 € ou 1 400 €) ni le prix limite de la classe I ; en classe I et en contrat responsable, le patient ne paie rien jusqu’à ce prix.
- **L’essentiel** : Base 400 € (plus de 20 ans) ou 1 400 € (20 ans et moins) · Taux Sécu 60 % (jusqu’au 31/12/2026) ·
  Prix limite en classe I : 950 € ou 1 400 € · Reste à charge en contrat responsable : 0 € en classe I, selon le
  contrat en classe II (plafond 1 700 €) · Tarif en vigueur depuis le 07/07/2023

## 4. Maillage

### 4.1 Articles qui devraient pointer vers l’outil, par pertinence

Les dev en posent 3 au plus : les rangs 1 à 3. Contenu du moteur SEO (`content/ressources/`) : PR à part, après la mise
en ligne du hub. Une seule ancre par article.

| Rang | Article | Où | Phrase exacte à ajouter | Pourquoi |
|---|---|---|---|---|
| 1 | `virement-mutuelle-inferieur` | H3 « Le cas du 100 % Santé », à la fin du paragraphe | `Le prix limite de chaque verre et de chaque monture de classe A, et la part qui revient à la complémentaire, sont dans notre <a href="/outils/remboursement">outil de remboursement par code LPP</a>.` | La page parle déjà de prix limite et de part complémentaire : l’outil donne le chiffre que l’article ne donne pas |
| 2 | `tiers-payant-opticien` | H2 « Qui paie quoi entre l’AMO et l’AMC ? », à la fin du 2e paragraphe (« La base de remboursement AMO vient de la LPP… ») | `Pour chaque code LPP d’optique, notre <a href="/outils/remboursement">outil de remboursement</a> donne la base, la part de la Sécurité sociale et le ticket modérateur, avec la date du tarif.` | Pilier optique déjà visible en Search Console ; la phrase cite la base LPP sans la chiffrer |
| 3 | `checklist-prise-en-charge` | H2 « Quels points vérifier avant d’envoyer une prise en charge optique ? », à la fin du 3e paragraphe (« La LPP (liste des produits… ») | `Pour un code générique, notre <a href="/outils/remboursement">outil de remboursement par code LPP</a> affiche la base, le prix limite et la part de la Sécurité sociale lus dans cette base, avec leur date.` | Contrôle du code LPP avant l’envoi : usage direct de l’outil |
| 4 | `rejet-tiers-payant` | H3 « L’ordonnance et le codage », à la fin du 1er paragraphe | `Pour vérifier la désignation et les montants d’un code générique, voyez notre <a href="/outils/remboursement">outil de remboursement par code LPP</a>.` | Rejet de codage LPP |
| 5 | `reste-a-charge-drees-expliquer-devis` | H2 « Qu’est-ce que le reste à charge, exactement ? », à la fin du 2e paragraphe (« Quatre notions… ») | `Pour les lunettes et les aides auditives, notre <a href="/outils/remboursement">outil de remboursement</a> donne, code LPP par code LPP, la base, le ticket modérateur et la part de la complémentaire en 100 % Santé.` | Définit base et ticket modérateur ; page pas encore indexée, d’où le rang |
| 6 | `audioprothese-renouvellement-tiers-payant` | H2 « Quelle différence entre classe I et classe II pour le tiers payant ? », à la fin du 2e paragraphe (« Selon ameli.fr, le prix d’une aide auditive de classe I… ») | `Les bases, prix limites et parts de la Sécurité sociale des 8 codes d’aides auditives sont dans notre <a href="/outils/remboursement/aides-auditives">outil de remboursement</a>.` | Lien vers une page de groupe. **Après** la correction de l’article (point de départ des 4 ans : date de facturation, pas de délivrance ; `sources.md` de B, « Erreurs ») |
| 7 | `almerys-prise-en-charge` | H3 « Les codes LPP : la saisie qui fait les montants », à la fin du paragraphe | `Pour la base et le prix limite d’un code générique, voyez notre <a href="/outils/remboursement">outil de remboursement par code LPP</a> ; un code de fournisseur reprend ceux de son code générique.` | Page très visible ; l’outil n’a pas les codes par fabricant, la phrase le dit |
| 8 | `codes-rejets-noemie` | H2 « Pourquoi une facture est-elle rejetée ? », à la fin du paragraphe « La LPP (liste des produits… » | `La base et le prix limite de chaque code générique d’optique sont dans notre <a href="/outils/remboursement">outil de remboursement par code LPP</a>.` | Maillage A ↔ B (`seo.md` § 2.7) |

Non retenus : `ticket-moderateur-2027-tiers-payant`, tant que l’article dit que l’optique et l’audio ne sont pas
concernés par les décrets d’août 2026 (faux depuis le décret n° 2026-810, `sources.md` de B) ;
`refus-pec-verres-myopie-miyosmart-courrier`, tant que le groupe des verres freinateurs n’a pas de page ;
`dentaire-paniers-100-sante-tiers-payant`, tant que le dentaire est fermé.

### 4.2 Liens de l’outil vers les articles (`ArticlesLies`)

| Page | Articles (1 à 3) | Autres outils |
|---|---|---|
| Hub | `tiers-payant-opticien`, `virement-mutuelle-inferieur`, `reste-a-charge-drees-expliquer-devis` | C : « Où faire la prise en charge de la part mutuelle » ; A : « Un rejet de taux ou de prix unitaire » |
| Verres de classe A | `tiers-payant-opticien`, `virement-mutuelle-inferieur` | C, A |
| Verres de classe B | `reste-a-charge-drees-expliquer-devis`, `virement-mutuelle-inferieur` | C |
| Montures | `virement-mutuelle-inferieur` (plafond de 100 €), `tiers-payant-opticien` | C |
| Prestations | `tiers-payant-opticien`, `checklist-prise-en-charge` | A |
| Aides auditives | `reste-a-charge-drees-expliquer-devis` ; `audioprothese-renouvellement-tiers-payant` une fois corrigé | C |

Écart avec `cadre.md` § 5 : `audioprothese-renouvellement-tiers-payant` sort de la liste du hub tant que l’article
contredit la page aides auditives sur le point de départ des 4 ans.

## 5. Liste de contrôle TON.md

- [x] **Le résultat d’abord, l’IA jamais en premier** : la carte pont commence par « La prise en charge saisie, la
  facture envoyée, le virement de la mutuelle pointé » ; « agents », jamais « IA » (§ 1.7).
- [x] **Phrases courtes, affirmatives, concrètes** : réponses chiffrées en deux phrases (§ 3.2) ; FAQ en trois ou quatre
  phrases.
- [x] **Les vrais objets du métier** : base de remboursement, ticket modérateur, prix limite de vente, contrat
  responsable, code LPP, devis, facture.
- [x] **Un chiffre vrai et sourcé** : chaque montant vient de la base LPP v910 ou de `formules.md` (R871-2, décret
  n° 2026-810) ; les additions d’équipement (95 €, 120 €, 180 €) sont faites sur ces montants, deux recoupées par le
  ministère ; aucun plafond de verre (correspondance non sourcée) ; aucun chiffre 2027 inventé.
- [x] **Pas de superlatif ni de peur** : aucun.
- [x] **Vouvoiement** : « Tapez », « Cherchez », « vous lisez ».
- [x] **Français simple, sigles définis** : LPP défini dans le chapeau du hub ; « Sécu » réservé aux titres (le mot
  cherché).
- [x] **Pas de tiret long** : aucun.
- [x] **Typographie française** : espaces insécables, « 9,75 € », « 1 400 € », « 60 % », guillemets « », apostrophe ’.
- [x] **Pas d’emoji**.
- [x] **On dit / on ne dit pas** : « la complémentaire », « la mutuelle » (au comptoir) ; pas d’« assureur », pas de
  « solution », pas d’« optimiser ».
- [x] **Jargon interdit** : aucun.
- [x] **Ce qu’on peut affirmer** : aucune affirmation sur Granit hors de la carte pont (verbes de la colonne « on dit ») ;
  pas de délai, pas de prix, pas de client, pas de « 100 % automatique ».
- [x] **Ce qu’on n’affirme jamais** : pas de reste à charge nul promis sans « en contrat responsable » ; « 100 % » n’apparaît
  que dans « 100 % Santé ».
- [x] **Première phrase sur le lecteur** : « Tapez un code… ».

## 6. À signaler

- **Paul** : la description du hub (« part de la mutuelle en 100 % Santé », § 1.1) ; le retrait provisoire de
  `audioprothese-renouvellement-tiers-payant` des articles liés (§ 4.2) ; le bandeau 2027 (décision n° 3 de `cadre.md`).
- **Moteur SEO** : `reste-a-charge-drees-expliquer-devis`, section « Qu’est-ce qui change pour le reste à charge en
  2027 ? », ne cite que le décret n° 2026-809 (dentaire) pour tous les postes : ajouter le décret n° 2026-810 (optique,
  audio), comme pour `ticket-moderateur-2027-tiers-payant`.
- **data-B** : pour l’appairage (3 codes) et le supplément pour verres teintés, `panier_100_sante` vaut `null` alors
  qu’un prix limite existe ; la page n’affiche pas de part complémentaire pour eux (§ 3.6) tant que le panier n’est
  pas sourcé.
- **dev-B** : les tables du § 3.1 et du § 3.6 vont dans `groupes.mjs` ; chaque `texte` a ses `source_ids` (test de
  `cadre.md` § 11).
