# Outil A · Codes rejet · textes

Rédigé le 18/11/2026 par copy-seo (équipe de nuit). À lire avec `cadre.md` (les blocs, les pages publiées, le seuil),
`sources.md` (les faits), `questions.md`, `../socle.md` et `../seo.md`. Ce fichier donne les mots ; il ne change ni
les blocs ni les règles de publication de `cadre.md`, sauf là où il est écrit « écart avec cadre.md ».

**Conventions**

- La typographie est déjà posée : espace insécable avant `: ; ? !`, dans les guillemets « », entre un nombre et son
  unité (60 %, 48 h) et dans les milliers ; apostrophe ’. Recopier tel quel.
- Longueurs comptées par script, en caractères, espaces comprises (une espace insécable compte pour 1) :
  `<title>` 60 au plus ; description entre 140 et 155 (le test du socle accepte 160 : la marge est volontaire).
- Entre accolades : un champ de `donnees.json` ou de `publication.mjs`. Les mots autour relient ces faits, ils n’en
  ajoutent aucun. Tout ce qui est affirmé ici sans accolade est cité dans `sources.md` (identifiant entre crochets).

## 1. Le hub `/outils/codes-rejet`

### 1.1 En-tête

| Élément | Texte | Car. |
|---|---|---|
| `<title>` | Liste des codes rejets NOEMIE : sens, cause et correction | 57 |
| Description | Les codes rejets NOEMIE publiés par les caisses, code par code : libellé, cause probable, quoi corriger et métiers concernés, avec la source et sa date. | 152 |
| H1, `titre` | Codes rejets NOEMIE et télétransmission : | |
| H1, `accent` | la liste, code par code | |
| Sur-titre | Outil gratuit · tiers payant | |
| Chapeau | Tapez le code ou le libellé de votre retour NOEMIE, où la caisse dit ce qu’elle a payé ou rejeté : vous lisez ce qu’elle reproche, la cause probable et quoi corriger. Chaque code renvoie au mémo de la caisse qui l’a publié, avec sa date. Le libellé de votre propre retour fait foi. | |

Écart avec `cadre.md` : « codes rejets » au pluriel dans le `<title>` et le H1, comme la requête déjà visible en Search
Console (« liste codes rejets noemie ») et l’article existant. Proposition : `OUTIL.nom = "Codes rejets"` pour le fil
d’Ariane et la carte de `/outils` ; l’identifiant `codes-rejet` ne change pas.

### 1.2 Recherche et filtre (repris de `cadre.md`, sans changement)

| Élément | Texte |
|---|---|
| Libellé du champ | Code ou libellé du rejet |
| Placeholder | 0450054, bénéficiaire inconnu… |
| Aide | Avec ou sans espaces, avec ou sans le 0 du début. |
| Compteur | « {n} codes », « {visibles} sur {n} » |
| Filtre métier | « Tous », puis les libellés courts du socle (Optique et audio, Dentaire, Centres de santé, Pharmacie, Cliniques et labos) |

Option pour dev-A (hors `cadre.md`) : tant que seule la famille NOEMIE est ouverte, le hub n’a qu’un groupe de 29
lignes. On peut le découper en quatre ancres, les familles de l’article `codes-rejets-noemie` : « Droits du patient »
(11 codes), « Identification » (5), « Contenu de la facture » (9), « Transmission et doublons » (4, avec Traitement
caisse). La table `NATURES` du § 3.1 donne le classement.

### 1.3 Bloc avertissement du hub

Variante `fait-foi`, au-dessus de la liste (le gabarit hub du socle ne le prévoit pas : si dev-A ne le pose pas, la
dernière phrase du chapeau suffit) :

> Ces libellés viennent de mémos publiés par des caisses primaires entre 2016 et 2023 et de pages ameli.fr. Le
> libellé de votre propre retour fait foi : une autre caisse ou un autre régime (MSA, régimes spéciaux) peut écrire
> autre chose.

[sources.md, « Règles appliquées » et « Pièges relevés »]

### 1.4 État vide

Sous le compteur, après « Aucun résultat pour « {q} » ». Le message dépend de la forme de la requête, testée dans cet
ordre (après `variantes(q)` : « 450054 » devient « 0450054 ») :

| Requête | Message |
|---|---|
| 6 ou 7 chiffres, inconnus | Ce code n’est pas dans les mémos des caisses que nous avons pu vérifier. Le libellé de votre retour fait foi : lisez-le en entier, il dit ce qui manque. |
| 1 à 3 chiffres (« 153 ») | Dans les mémos des caisses, un code rejet NOEMIE s’écrit sur 7 chiffres, comme 0450054. Un numéro court comme {q} n’y figure pas : c’est souvent un code tronqué ou propre à votre logiciel. Cherchez plutôt un mot du libellé. |
| 4 chiffres (tant que les familles GIE sont fermées) | Un code à 4 chiffres peut être un accusé de réception logique (ARL) négatif ou un message de service SESAM-Vitale. Ils ne sont pas encore dans cette liste : votre logiciel en donne le libellé. |
| Commence par une lettre (« R5003 ») | Ce code ne suit pas l’écriture des rejets NOEMIE de l’Assurance Maladie. Les codes qui commencent par une lettre viennent d’autres nomenclatures, par exemple celle d’un organisme concentrateur : c’est elle qui fait foi. |
| Texte sans résultat | Aucun libellé ne contient « {q} ». Essayez un seul mot du libellé (« exonération », « bénéficiaire ») ou le code. |

Suggestions (3 au plus, socle) : « Codes proches : » puis les lignes. Toujours dessous, dans cet ordre :

- « Rejet de la part mutuelle ? Le motif vient de la complémentaire ou de sa plateforme : trouvez son portail. »
  (`LienOutil` vers C ; rien si C n’est pas fusionné)
- « Lire un retour NOEMIE, pas à pas » (lien vers `/ressources/codes-rejets-noemie`)
- bouton « Effacer la recherche »
- lien « Signaler un code manquant » (`mailto:contact@getgranit.ai?subject=Code%20rejet%20manquant`)

[« 4 chiffres » : tables ARL et messages de service du GIE ; « lettre » : nomenclature OCT Résopharma ; « 153 » :
sources.md, « Pièges relevés »]

### 1.5 Entrée introuvable (404, `noindex`)

- H1 : « {code} : introuvable » (le code tiré du slug : `noemie-0999999` → « 0999999 »)
- Message : celui de la ligne du tableau 1.4 qui correspond à la forme du code, précédé de « Ce code n’a pas de page. »
- Sous la recherche préremplie : « Voir tous les codes rejets » (lien vers le hub)
- `CartePont` en dernier, comme partout.

### 1.6 Texte de méthode du hub (proposé, environ 340 mots)

Écrit à partir des seules sources de `sources.md` ; l’identifiant de la source suit chaque paragraphe, à garder en
commentaire dans le code.

> **## Comment lire un code rejet**
>
> Quand la caisse ne peut pas payer une facture en l’état, votre retour NOEMIE l’indique par un code et un libellé.
> Le cahier des charges NOEMIE des professionnels de santé prévoit, pour chaque rejet, une codification, un libellé en
> clair, le niveau visé (la facture, une ligne ou un « code affiné ») et la part en cause, obligatoire ou
> complémentaire. Les mémos des caisses écrivent le code sur 7 chiffres (0450054), parfois en deux groupes
> (0450 054) ou sans le zéro du début (450054) : c’est le même code, et la recherche accepte les trois écritures.
> [cahier des charges NOEMIE PS, mai 2004 ; sources.md, « Règles appliquées »]
>
> **## Ce qui n’est pas un rejet**
>
> « Traitement caisse » n’est pas un rejet : la caisse étudie la facture, et un second retour dira si elle est payée
> ou rejetée. Ne la renvoyez pas en attendant, ce serait un doublon. L’ARL (accusé de réception logique) répond au lot
> télétransmis, pas à chaque facture : négatif, le lot n’a pas été pris en charge ; ameli.fr conseille alors un
> nouvel essai, puis de contacter la caisse. En mode dégradé, il n’y a pas d’ARL.
> [ameli-medecin-rejets-2026, ameli-pharmacien-retour-noemie-2022, ameli-pharmacien-fse-mode-emploi-2021,
> gie-cdc-annexe1b-2025]
>
> **## Pourquoi le libellé de votre retour fait foi**
>
> Un même code peut porter deux textes. Le code 0450072 s’écrit « DIVERGENCE VITALE/EXO BDO ABSENTE » dans le mémo
> 2018 de la CPAM de la Gironde, et « Situation d’exonération inconnue pour ce bénéficiaire » dans celui de la CPAM de
> l’Isère en 2023 : le sens est le même, les mots changent. Les libellés de cette liste viennent de caisses du régime
> général ; un autre régime (MSA, régimes spéciaux) peut employer d’autres textes. Chaque page donne donc la caisse,
> la date du document et les autres libellés relevés pour le même code.
> [cpam33-laboratoires-2018, cpam38-pharmaciens-2023, sources.md, « Pièges relevés »]
>
> **## Un numéro court n’est pas un code NOEMIE**
>
> Des numéros comme « 153 » ou « 159 » circulent sur le web. Aucun ne figure dans les documents officiels lus : un code
> rejet NOEMIE du régime général s’écrit sur 7 chiffres. Un numéro court est souvent un code tronqué ou propre à un
> logiciel. Cherchez un mot du libellé, ou demandez la table à votre éditeur : la table complète des codes n’est pas
> publique, elle est diffusée aux éditeurs.
> [sources.md, « Pièges relevés » et « Ce qui manque »]
>
> **## Et la part mutuelle ?**
>
> Les motifs de rejet des complémentaires et de leurs plateformes s’affichent dans leurs portails : nous n’en avons
> trouvé aucune table publique. Pour un rejet de la part mutuelle, partez du portail de la complémentaire.
> [sources.md, « Ce qui manque »] + `LienOutil` C (« Trouver le portail de la complémentaire »)

### 1.7 Carte pont (hub et entrées)

Titre fixe du socle : « Vos équipes soignent. **Granit gère le reste.** »

| Élément | Texte |
|---|---|
| `texte` | Les rejets repérés avant l’envoi, puis traités : c’est le travail des agents Granit, dans les logiciels que vos équipes utilisent déjà. |
| Bouton (socle) | Voir ce que font les agents |
| Bouton, si la page ne concerne qu’un métier (option, demande un paramètre du socle) | Voir ce que font les agents en pharmacie · en centre dentaire · en centre de santé · pour les opticiens · en clinique et laboratoire |
| Lien | Demander une démo |

Écart avec `cadre.md` § 8 : même contenu, ordre inversé pour mettre le résultat avant les agents (TON.md, règle 1).
« Repérés avant l’envoi, puis traités » est la formulation permise par TON.md (« ce qu’on n’affirme jamais »).

## 2. FAQ du hub

`FaqOutil` avec `jsonLd: true` sur le hub seulement, comme le prévoient `cadre.md` § 3 et le socle § 6.13 : le
balisage reste parce qu’il décrit une FAQ visible et ne coûte rien, sans attente d’affichage enrichi (`seo.md` § 2.4 :
plus de résultat enrichi FAQ dans Google depuis le 7 mai 2026). Jamais de FAQ ni de `FAQPage` sur les pages d’entrée.
Les questions évitent celles de la FAQ de l’article `codes-rejets-noemie` (« Qu’est-ce qu’un code rejet NOEMIE ? »,
« Où trouver la liste… ? ») pour ne pas lui disputer ses réponses.

**Que veut dire un code rejet comme 153 ?**
Aucun code de ce format ne figure dans les documents officiels lus : un code rejet NOEMIE du régime général s’écrit
sur 7 chiffres, comme 0450054. Un numéro court est souvent un code tronqué ou propre à votre logiciel. Cherchez plutôt
un mot du libellé affiché sur votre retour. [sources.md, « Pièges relevés » ; questions.md]

**Pourquoi un même code a-t-il deux libellés ?**
Parce que chaque caisse publie ses propres mémos, et qu’ils changent avec le temps. Le code 0450072 s’écrit
« DIVERGENCE VITALE/EXO BDO ABSENTE » chez la CPAM de la Gironde en 2018, et « Situation d’exonération inconnue pour
ce bénéficiaire » chez la CPAM de l’Isère en 2023 : le sens est le même. Le libellé de votre propre retour fait foi.
[cpam33-laboratoires-2018, cpam38-pharmaciens-2023]

**« Traitement caisse » : faut-il renvoyer la facture ?**
Non. Ce n’est pas un rejet : la caisse étudie la facture, et un second retour NOEMIE dira si elle est payée ou
rejetée. Un nouvel envoi serait un doublon. Si le résultat tarde, contactez votre caisse, par exemple avec le
téléservice « Réclamation paiements » d’amelipro. [ameli-medecin-rejets-2026, ameli-pharmacien-retour-noemie-2022]

**ARL négatif ou rejet : quelle différence ?**
L’ARL (accusé de réception logique) répond au lot télétransmis : négatif, le lot n’a pas été pris en charge et il faut
le renvoyer ; ameli.fr conseille un nouvel essai, puis de contacter la caisse. Le rejet arrive plus tard, dans le
retour NOEMIE : la caisse a reçu la facture, mais ne peut pas la payer en l’état.
[ameli-medecin-rejets-2026, ameli-pharmacien-fse-mode-emploi-2021, gie-cdc-annexe1b-2025]

**Une facture rejetée sera-t-elle payée ?**
Pas en l’état : la caisse attend une correction. Chaque page de code dit quoi corriger avant de retransmettre, d’après
les mémos des caisses. Pour un doublon (facture déjà payée ou déjà en traitement), ne renvoyez rien : vérifiez vos
paiements et, au besoin, faites une réclamation à la caisse. [entrées `noemie-2900005`, `noemie-0180051`]

## 3. Les pages d’entrée `/outils/codes-rejet/<slug>`

### 3.1 Les tables à recopier dans `publication.mjs`

`LIBELLES_COURTS` (demandé par `cadre.md` § 4) pour les 28 codes numériques sûrs (les 27 de `PRIORITE` et 0710060) ; `RESUMES` (une
proposition fidèle à `explication`, pour la description) ; `NATURES` (le classement en quatre familles de l’article
`codes-rejets-noemie`, qui ne sert qu’à choisir les formulations : il n’est jamais affiché comme un fait).

```js
export const LIBELLES_COURTS = {   // 30 caractères au plus, fidèles au libellé officiel
  "noemie-0450054": "ETM non trouvée en BDO",   // 22
  "noemie-0450056": "ETM connue mais non transmise",   // 29
  "noemie-0450072": "exonération inconnue en BDO",   // 27
  "noemie-0450082": "ETM maternité non transmise",   // 27
  "noemie-0250050": "assuré absent de la BDO",   // 23
  "noemie-0270051": "bénéficiaire inconnu en BDO",   // 27
  "noemie-0700060": "écart taux demandé et calculé",   // 29
  "noemie-0460051": "prescripteur inconnu",   // 20
  "noemie-0460053": "prescripteur étab. inconnu",   // 26
  "noemie-0470049": "prescription interdite",   // 22
  "noemie-0730055": "exercice non valide à la date",   // 29
  "noemie-0480054": "type de contrat incompatible",   // 28
  "noemie-2900005": "facture déjà payée",   // 18
  "noemie-0180051": "facture déjà en traitement",   // 26
  "noemie-2900230": "facturations multiples",   // 22
  "noemie-0450097": "date d’examen non valide",   // 24
  "noemie-0600064": "bucco-dentaire absente",   // 22
  "noemie-0600069": "rubrique prévention absente",   // 27
  "noemie-2600710": "numéro de dent incompatible",   // 27
  "noemie-2600649": "code association différent",   // 26
  "noemie-2600650": "code association non renseigné",   // 30
  "noemie-0710060": "montant demandé supérieur",   // 25
  "noemie-0650001": "prix unitaire absent",   // 20
  "noemie-4000067": "prix au-dessus de l’opposable",   // 29
  "noemie-4000055": "prix supérieur à la base",   // 24
  "noemie-4000057": "quantité au-delà du seuil",   // 25
  "noemie-4000072": "vaccin grippe sans code 7",   // 25
  "noemie-0100052": "habilitation envoi de messages",   // 30
};

export const RESUMES = {   // ce que la caisse reproche, en une proposition tirée de `explication`
  "noemie-0450054": "la caisse ne retrouve pas l’exonération demandée",
  "noemie-0450056": "l’exonération connue de la caisse manque sur la facture",
  "noemie-0450072": "l’exonération de la carte Vitale est inconnue de la caisse",
  "noemie-0450082": "l’exonération maternité connue de la caisse manque",
  "noemie-0250050": "la caisse ne connaît pas l’assuré dans son fichier",
  "noemie-0270051": "l’assuré est connu, pas le bénéficiaire tel qu’il est saisi",
  "noemie-0700060": "le taux demandé n’est pas celui que calcule la caisse",
  "noemie-0460051": "le numéro du prescripteur est inconnu ou erroné",
  "noemie-0460053": "l’établissement prescripteur est inconnu du fichier national",
  "noemie-0470049": "le prescripteur ne pouvait pas prescrire à cette date",
  "noemie-0730055": "votre numéro n’est pas valide à la date des soins",
  "noemie-0480054": "le type de contrat complémentaire transmis diffère",
  "noemie-2900005": "une facture au même numéro a déjà été payée",
  "noemie-0180051": "une facture au même numéro est déjà en traitement",
  "noemie-2900230": "deux actes identiques le même jour pour le même patient",
  "noemie-0450097": "soins de suite M’T dents hors période ou avant l’examen",
  "noemie-0600064": "pas de prise en charge de prévention sous ce numéro",
  "noemie-0600069": "aucune prise en charge de prévention enregistrée",
  "noemie-2600710": "la dent indiquée ne correspond pas à l’acte CCAM",
  "noemie-2600649": "code association erroné ou actes non associables",
  "noemie-2600650": "le code association obligatoire n’a pas été transmis",
  "noemie-0710060": "le montant demandé dépasse le calcul de la caisse",
  "noemie-0650001": "le prix unitaire manque sur la facture",
  "noemie-4000067": "le prix transmis n’est plus celui en vigueur",
  "noemie-4000055": "le prix transmis dépasse celui de la base des médicaments",
  "noemie-4000057": "la quantité délivrée dépasse le seuil autorisé",
  "noemie-4000072": "vaccin antigrippal facturé sans le code prévention 7",
  "noemie-0100052": "vous n’êtes pas habilité à télétransmettre à cette caisse",
};

export const NATURES = {   // famille de rejet (classement de l’article codes-rejets-noemie), sert au choix des formulations
  // droits
  "noemie-0450054": "droits",
  "noemie-0450056": "droits",
  "noemie-0450072": "droits",
  "noemie-0450082": "droits",
  "noemie-0250050": "droits",
  "noemie-0270051": "droits",
  "noemie-0700060": "droits",
  "noemie-0480054": "droits",
  "noemie-0450097": "droits",
  "noemie-0600064": "droits",
  "noemie-0600069": "droits",
  // identification
  "noemie-0460051": "identification",
  "noemie-0460053": "identification",
  "noemie-0470049": "identification",
  "noemie-0730055": "identification",
  "noemie-0100052": "identification",
  // facture
  "noemie-0650001": "facture",
  "noemie-4000067": "facture",
  "noemie-4000055": "facture",
  "noemie-4000057": "facture",
  "noemie-4000072": "facture",
  "noemie-2600710": "facture",
  "noemie-2600649": "facture",
  "noemie-2600650": "facture",
  "noemie-0710060": "facture",
  // transmission
  "noemie-2900005": "transmission",
  "noemie-0180051": "transmission",
  "noemie-2900230": "transmission",
  // attente
  "noemie-traitement-caisse": "attente",
};
```

### 3.2 `<title>`, description, H1, sur-titre

| Élément | Règle |
|---|---|
| `<title>` | T1 « Code rejet {code} : {libellé court}, que corriger » ; famille `transmission` : « …, que faire » (on ne corrige pas un doublon). Plus de 60 : T2 sans la fin (« Code rejet {code} : {libellé court} »). Traitement caisse : « Traitement caisse NOEMIE : ce n’est pas un rejet » (48) |
| Description | « Code rejet {code} : {résumé}. {objet}, selon {la caisse} ({année}). » Le générateur essaie les objets dans l’ordre et garde le premier qui tient entre 140 et 155 ; cas normal : « La cause probable et quoi corriger avant de renvoyer la facture » → « …avant de la renvoyer » → « …avant de renvoyer » → « La cause probable et ce qu’il faut corriger » → « La cause probable et quoi corriger » → « Cause probable et correction » ; famille `transmission` : « Pourquoi ne pas renvoyer la facture et que faire à la place » → « Pourquoi ne pas la renvoyer et que faire à la place » → « Pourquoi ne pas la renvoyer, et que faire » → « Que faire au lieu de la renvoyer ». Traitement caisse : « « Traitement caisse » dans un retour NOEMIE : la caisse étudie la facture, ce n’est pas un rejet. Que faire en attendant, et pourquoi ne pas la renvoyer. » (153) |
| {la caisse}, {année} | `editeur` de `source_ids[0]` coupé avant « ( », précédé de « la » (CPAM) ou « l’ » (Assurance Maladie) ; année de `date_source` |
| H1 | « Code rejet {code} : « {libellé officiel} » ». Un libellé qui contient déjà des guillemets les passe en “ ” (2600650). Traitement caisse : « « Traitement caisse » dans un retour NOEMIE : ce n’est pas un rejet » |
| Sur-titre | « Code rejet NOEMIE · Assurance Maladie » ; entrée d’un seul métier : « Code rejet NOEMIE · {métier court en minuscules} » (« · dentaire », « · pharmacie ») ; Traitement caisse : « Retour NOEMIE · Assurance Maladie » |

Avec ces règles, les 29 codes sûrs tiennent tous dans les bornes, sans retouche à la main (annexe 3.8). Le test commun
du socle le vérifiera de toute façon.

### 3.3 Réponse (chapeau), L’essentiel, avertissement

**Réponse**, deux phrases sous le H1 (écart avec `cadre.md` § 5, qui prend les deux premières phrases
d’`explication` : 25 explications sur 29 n’en ont qu’une) :

- R1, `explication` a deux phrases ou plus : ces deux phrases.
- R2, sinon : la phrase d’`explication`, puis la première phrase d’`action` (ce que la caisse reproche, puis la
  correction la plus probable, comme le demande `seo.md` § 3.4). Si cette phrase fait moins de 40 caractères (« Ne
  retransmettez pas. »), on lui ajoute la suivante.

**L’essentiel**, 3 ou 4 lignes :

| Libellé | Valeur |
|---|---|
| Libellé officiel | `libelle_officiel` (guillemets internes en “ ”) |
| Cause probable | la première proposition de `cause`, jusqu’au premier « ; », avec un point |
| Quoi corriger | la première phrase d’`action`, **seulement en R1** (en R2 elle est déjà dans la réponse : la ligne disparaît) |
| Métiers | « Tous les métiers » si les 5 ; sinon les libellés courts du socle, séparés par « · » |

**Avertissement** (`fait-foi`, sous L’essentiel) :

> Le libellé de votre retour fait foi. Celui-ci est celui publié par {la caisse} (document du {date_source}) ; une
> autre caisse ou un autre régime (MSA, régimes spéciaux) peut écrire autre chose.

Traitement caisse : « Ce motif est décrit par ameli.fr (pages du 26/01/2026 et du 29/04/2022) ; il n’a pas de code
numérique. Le texte exact affiché par votre logiciel fait foi. »

### 3.4 Intertitres des sections

Ils varient avec la famille et la plupart portent le code : deux pages n’ont pas la même suite de `<h2>`.

| Section (ordre de `cadre.md` § 5) | Intertitre |
|---|---|
| Libellés par source | Plusieurs libellés : « Le libellé {code}, caisse par caisse » (tableau). Un seul : « Le libellé publié », puis la phrase « « {libellé} », d’après {la caisse} (document du {date}). Aucun autre libellé n’a été relevé pour ce code dans les {n} documents lus. » |
| Autres écritures | « Le code {code} s’écrit aussi » (les `autres_ecritures`, séparées par « · ») ; section absente si la liste est vide |
| Causes | `droits` : « D’où vient l’écart avec les droits du patient » ; `identification` : « D’où vient l’erreur d’identification » ; `facture` : « Ce qui ne va pas dans la facture » ; `transmission` : « Pourquoi la caisse y voit un doublon » ; Traitement caisse : « Pourquoi la facture est à l’étude ». Contenu : `cause` découpée en liste aux « ; », une majuscule par point |
| Correction | cas normal : « Corriger un rejet {code}, étape par étape » ; `transmission` : « Que faire à la place d’un nouvel envoi » ; Traitement caisse : « Que faire en attendant le retour suivant ». Contenu : `action`, une phrase par étape (`<ol>`) ; une seule phrase : un paragraphe, pas de liste |
| Question réelle | « La question posée par des professionnels » (si `questions_reelles`) : la question, puis « Lire la discussion d’origine » (lien de `questions.md`), jamais de nom |
| Note de source | « À savoir sur cette source » : `note_verification` **sans** la phrase commune à presque toutes les entrées (« Libellés publiés par des CPAM du régime général ; le libellé reçu… », déjà dite par l’avertissement), puis « Cité dans les mémos des caisses pour : {professions_citees_par_les_sources}. » |
| Sources | « Sources » (socle) |

### 3.5 Codes voisins et articles liés

Choix des voisins, 3 à 6 (complète `cadre.md` § 5, bloc 12, pour que le titre du bloc reste vrai) : 1. les
`codes_voisins` publiés ; 2. pour une entrée d’un seul métier, les codes publiés de ce seul métier ; 3. les codes
publiés de la même famille (`NATURES`, Traitement caisse compté avec `transmission`), du préfixe le plus proche au
plus éloigné ; 4. s’il en manque pour arriver à 3, le préfixe le plus proche, toutes familles.

| Cas | Titre du bloc |
|---|---|
| Entrée d’un seul métier | « Autres codes rejets en dentaire » · « en pharmacie » · « en optique et audio » · « en établissement » |
| Tous les voisins de la même famille | `droits` : « Autres rejets liés aux droits du patient » ; `identification` : « Autres rejets d’identification » ; `facture` : « Autres rejets sur le contenu de la facture » ; `transmission` : « Autres retours à ne pas renvoyer tels quels » |
| Sinon | « Codes voisins » |

Articles liés (`ARTICLES` de `publication.mjs`, 1 à 3) : par défaut `codes-rejets-noemie` ; `noemie-0250050` et
`noemie-0270051` : + `rejet-beneficiaire-inconnu` ; famille `droits` et `identification` : + `rejet-tiers-payant`
(ses sections « Les droits et le bénéficiaire », « L’ordonnance et le codage ») ; `transmission` et Traitement caisse :
+ `quand-relancer-mutuelle` (ARL et retours, étape par étape) ; codes pharmacie (`4000…`) : + `officine-balance-agee-tiers-payant` ;
codes dentaires seuls : + `dentaire-paniers-100-sante-tiers-payant`. `OUTILS_LIES` : `noemie-0650001` → `remboursement`
(prix unitaire d’un produit LPP) avec le texte « Vérifier la base et le prix limite d’un code LPP » ; aucun code NOEMIE
sûr ne porte sur l’organisme complémentaire, donc pas de lien vers C depuis les entrées.

### 3.6 Règles de choix, en résumé

| Si… | Alors |
|---|---|
| famille `transmission` (2900005, 0180051, 2900230) | titre « …, que faire » ; description « Pourquoi ne pas renvoyer… » ; intertitres « Pourquoi la caisse y voit un doublon », « Que faire à la place d’un nouvel envoi » |
| `slug` = `noemie-traitement-caisse` | titre, description, H1, sur-titre et avertissement propres (§ 3.2, 3.3) |
| un seul métier | sur-titre « Code rejet NOEMIE · {métier} » ; voisins du même métier d’abord ; titre du bloc « Autres codes rejets en {métier} » |
| `explication` d’une phrase | réponse R2 ; pas de ligne « Quoi corriger » dans L’essentiel |
| pas de `libelles_variantes` | « Le libellé publié » au lieu du tableau |
| pas de `questions_reelles` | pas de section « La question posée… » |
| `cause_action_origine` = `deduit_du_libelle` (aucun des 29 codes ouverts ; ARL, OCT) | intertitres « Ce que le libellé laisse supposer » et « Ce qu’on peut vérifier », et la phrase « La source ne donne pas de cause : ces pistes sont déduites du libellé. » sous chacun |

### 3.7 Trois exemples rendus à partir de `donnees.json`

**1. `noemie-0270051`** (famille `droits`, tous métiers, libellé cherché tel quel en Search Console)

- **Sur-titre** : Code rejet NOEMIE · Assurance Maladie
- **`<title>`** (48) : Code rejet 0270051 : bénéficiaire inconnu en BDO
- **Description** (153) : Code rejet 0270051 : l’assuré est connu, pas le bénéficiaire tel qu’il est saisi. La cause probable et quoi corriger, selon la CPAM de la Gironde (2018).
- **H1** : Code rejet 0270051 : « BENEFICIAIRE INCONNU DANS LA BDO »
- **Réponse** (chapeau, règle R2) : L’assuré est connu, mais pas le bénéficiaire des soins tel qu’il a été saisi : la date de naissance ou le rang ne correspondent pas, ou la personne est affiliée sous un autre numéro ou à un autre organisme. Vérifiez la date de naissance, le rang et le numéro sous lequel le patient est couvert (ADRi, amelipro, attestation de droits), puis retransmettez à la caisse dont il dépend avec ces données exactes.
- **L’essentiel** :
  - Libellé officiel : BENEFICIAIRE INCONNU DANS LA BDO
  - Cause probable : Date de naissance ou rang de naissance erronés.
  - Métiers : Tous les métiers
- **Avertissement** : Le libellé de votre retour fait foi. Celui-ci est celui publié par la CPAM de la Gironde (document du 29/06/2018) ; une autre caisse ou un autre régime (MSA, régimes spéciaux) peut écrire autre chose.
- **## Le libellé 0270051, caisse par caisse** : tableau de 4 lignes, dont :
  - Assurance Maladie · 26/06/2018 · « BENEFICIAIRE DE PRESTATIONS INCONNU DANS LA BDO »
  - CPAM de l’Isère · 30/08/2023 · « Bénéficiaire de prestations inconnu dans le référentiel assuré »
  - CPAM du Bas-Rhin · non datée dans le texte lu · « Bénéficiaire de prestations inconnu dans BDO »
- **## Le code 0270051 s’écrit aussi** : 0270 051 · 0270-051 · 270051
- **## D’où vient l’écart avec les droits du patient** : liste de 3 point(s) : Date de naissance ou rang de naissance erronés. / Bénéficiaire passé du statut d’ayant droit à celui d’assuré (il a son propre numéro). / Affiliation à un autre organisme.
- **## Corriger un rejet 0270051, étape par étape** : 2 étape(s) : 1. Vérifiez la date de naissance, le rang et le numéro sous lequel le patient est couvert (ADRi, amelipro, attestation de droits), puis retransmettez à la caisse dont il dépend avec ces données exactes. / 2. Pour les établissements, le mémo demande de changer le numéro de facture.
- **## À savoir sur cette source** : Cité dans les mémos des caisses pour : laboratoires, établissements publics, pharmaciens, médecins, opticiens.
- **Sources** : 7 documents, du plus récent au plus ancien, avec leur date ; « Vérifié le 18/11/2026 ».
- **Autres rejets liés aux droits du patient** : 0250050 (assuré absent de la BDO), 0450056 (ETM connue mais non transmise), 0450054 (ETM non trouvée en BDO), 0450072 (exonération inconnue en BDO), 0450082 (ETM maternité non transmise), 0450097 (date d’examen non valide) (déclarés dans les données et publiés : 0250050 ; la suite par la règle du § 3.5)

**2. `noemie-2900005`** (famille `transmission`, question réelle)

- **Sur-titre** : Code rejet NOEMIE · Assurance Maladie
- **`<title>`** (50) : Code rejet 2900005 : facture déjà payée, que faire
- **Description** (154) : Code rejet 2900005 : une facture au même numéro a déjà été payée. Pourquoi ne pas la renvoyer et que faire à la place, selon la CPAM de la Gironde (2019).
- **H1** : Code rejet 2900005 : « FACTURE DEJA PAYEE »
- **Réponse** (chapeau, règle R2) : Une facture portant le même numéro a déjà été réglée pour le même bénéficiaire : la caisse considère l’envoi comme un doublon. Ne retransmettez pas. Vérifiez vos ARL, vos retours NOEMIE et vos paiements sur amelipro.
- **L’essentiel** :
  - Libellé officiel : FACTURE DEJA PAYEE
  - Cause probable : Facture renvoyée alors qu’elle avait déjà été payée.
  - Métiers : Tous les métiers
- **Avertissement** : Le libellé de votre retour fait foi. Celui-ci est celui publié par la CPAM de la Gironde (document du 12/04/2019) ; une autre caisse ou un autre régime (MSA, régimes spéciaux) peut écrire autre chose.
- **## Le libellé 2900005, caisse par caisse** : tableau de 2 lignes, dont :
  - CPAM de l’Isère · 30/08/2023 · « Facture déjà payée »
- **## Le code 2900005 s’écrit aussi** : 2900 005 · 2900-005
- **## Pourquoi la caisse y voit un doublon** : liste de 3 point(s) : Facture renvoyée alors qu’elle avait déjà été payée. / Facture rectificative télétransmise. / Compteur de numéros de facture revenu en arrière après restauration d’une sauvegarde (CPAM de la Loire-Atlantique).
- **## Que faire à la place d’un nouvel envoi** : 3 étape(s) : 1. Ne retransmettez pas. / 2. Vérifiez vos ARL, vos retours NOEMIE et vos paiements sur amelipro. / 3. Si le paiement est introuvable ou s’il s’agit d’une régularisation, faites une réclamation à votre caisse : le mémo de la CPAM de la Gironde précise qu’en cas de litige la télétransmission spontanée n’est pas autorisée.
- **## La question posée par des professionnels** : « Après correction d’un rejet de la caisse, faut-il renvoyer la facture avec le même numéro ou un nouveau, et comment éviter de créer un doublon sur la part mutuelle ? » + lien d’origine (`questions.md`)
- **## À savoir sur cette source** : Cité dans les mémos des caisses pour : pharmaciens, médecins, opticiens.
- **Sources** : 7 documents, du plus récent au plus ancien, avec leur date ; « Vérifié le 18/11/2026 ».
- **Autres retours à ne pas renvoyer tels quels** : 0180051 (facture déjà en traitement), 2900230 (facturations multiples), Traitement caisse (déclarés dans les données et publiés : 0180051, 2900230, Traitement caisse ; la suite par la règle du § 3.5)

**3. `noemie-0450097`** (un seul métier, dentaire, pas d’autre libellé)

- **Sur-titre** : Code rejet NOEMIE · dentaire
- **`<title>`** (59) : Code rejet 0450097 : date d’examen non valide, que corriger
- **Description** (149) : Code rejet 0450097 : soins de suite M’T dents hors période ou avant l’examen. La cause probable et quoi corriger, selon la CPAM de la Gironde (2019).
- **H1** : Code rejet 0450097 : « Soins de suite sans date d’examen valide »
- **Réponse** (chapeau, règle R2) : Des soins de suite du dispositif de prévention bucco-dentaire (M’T dents) ont été facturés hors de la période de prise en charge, ou avant que l’examen de prévention ne soit réglé et enregistré par la caisse. Vérifiez la période de prise en charge ou l’âge de l’enfant, et le numéro de sécurité sociale sous lequel il est couvert (celui de la prise en charge M’T dents).
- **L’essentiel** :
  - Libellé officiel : Soins de suite sans date d’examen valide
  - Cause probable : Prise en charge M’T dents plus valable.
  - Métiers : Dentaire
- **Avertissement** : Le libellé de votre retour fait foi. Celui-ci est celui publié par la CPAM de la Gironde (document du 10/04/2019) ; une autre caisse ou un autre régime (MSA, régimes spéciaux) peut écrire autre chose.
- **## Le libellé publié** : « « Soins de suite sans date d’examen valide », d’après la CPAM de la Gironde (document du 10/04/2019). Aucun autre libellé n’a été relevé pour ce code dans les 3 documents lus. »
- **## Le code 0450097 s’écrit aussi** : 0450 097 · 0450-097 · 450097
- **## D’où vient l’écart avec les droits du patient** : liste de 4 point(s) : Prise en charge M’T dents plus valable. / Soins saisis avant la date anniversaire de l’enfant. / Enfant rattaché sous un autre numéro que celui de la prise en charge. / Soins de suite facturés avant que l’examen de prévention soit réglé et enregistré.
- **## Corriger un rejet 0450097, étape par étape** : 2 étape(s) : 1. Vérifiez la période de prise en charge ou l’âge de l’enfant, et le numéro de sécurité sociale sous lequel il est couvert (celui de la prise en charge M’T dents). / 2. Établissez deux factures distinctes : une pour l’examen de prévention, une seconde pour les soins de suite.
- **## À savoir sur cette source** : Cité dans les mémos des caisses pour : chirurgiens-dentistes.
- **Sources** : 3 documents, du plus récent au plus ancien, avec leur date ; « Vérifié le 18/11/2026 ».
- **Autres codes rejets en dentaire** : 0600069 (rubrique prévention absente), 2900230 (facturations multiples), 2600649 (code association différent), 2600710 (numéro de dent incompatible), 0450056 (ETM connue mais non transmise), 0450054 (ETM non trouvée en BDO) (déclarés dans les données et publiés : 0600069, 2900230 ; la suite par la règle du § 3.5)

Les voisins supposent les 22 pages estimées par `cadre.md` § 4 ; le test commun calcule les vraies.

### 3.8 Annexe : `<title>` et description des 29 codes sûrs

| Slug | `<title>` | n | Description | n |
|---|---|---|---|---|
| `noemie-0450054` | Code rejet 0450054 : ETM non trouvée en BDO, que corriger | 57 | Code rejet 0450054 : la caisse ne retrouve pas l’exonération demandée. La cause probable et ce qu’il faut corriger, selon la CPAM de la Gironde (2019). | 151 |
| `noemie-0450056` | Code rejet 0450056 : ETM connue mais non transmise | 50 | Code rejet 0450056 : l’exonération connue de la caisse manque sur la facture. La cause probable et quoi corriger, selon la CPAM de la Gironde (2019). | 149 |
| `noemie-0450072` | Code rejet 0450072 : exonération inconnue en BDO | 48 | Code rejet 0450072 : l’exonération de la carte Vitale est inconnue de la caisse. La cause probable et quoi corriger, selon la CPAM de la Gironde (2018). | 152 |
| `noemie-0450082` | Code rejet 0450082 : ETM maternité non transmise | 48 | Code rejet 0450082 : l’exonération maternité connue de la caisse manque. La cause probable et ce qu’il faut corriger, selon l’Assurance Maladie (2018). | 151 |
| `noemie-0250050` | Code rejet 0250050 : assuré absent de la BDO, que corriger | 58 | Code rejet 0250050 : la caisse ne connaît pas l’assuré dans son fichier. La cause probable et ce qu’il faut corriger, selon la CPAM de la Gironde (2018). | 153 |
| `noemie-0270051` | Code rejet 0270051 : bénéficiaire inconnu en BDO | 48 | Code rejet 0270051 : l’assuré est connu, pas le bénéficiaire tel qu’il est saisi. La cause probable et quoi corriger, selon la CPAM de la Gironde (2018). | 153 |
| `noemie-0700060` | Code rejet 0700060 : écart taux demandé et calculé | 50 | Code rejet 0700060 : le taux demandé n’est pas celui que calcule la caisse. La cause probable et quoi corriger, selon la CPAM de la Gironde (2016). | 147 |
| `noemie-0460051` | Code rejet 0460051 : prescripteur inconnu, que corriger | 55 | Code rejet 0460051 : le numéro du prescripteur est inconnu ou erroné. La cause probable et ce qu’il faut corriger, selon la CPAM de la Gironde (2019). | 150 |
| `noemie-0460053` | Code rejet 0460053 : prescripteur étab. inconnu | 47 | Code rejet 0460053 : l’établissement prescripteur est inconnu du fichier national. La cause probable et quoi corriger, selon la CPAM de la Gironde (2019). | 154 |
| `noemie-0470049` | Code rejet 0470049 : prescription interdite, que corriger | 57 | Code rejet 0470049 : le prescripteur ne pouvait pas prescrire à cette date. La cause probable et quoi corriger, selon la CPAM de la Gironde (2018). | 147 |
| `noemie-0730055` | Code rejet 0730055 : exercice non valide à la date | 50 | Code rejet 0730055 : votre numéro n’est pas valide à la date des soins. La cause probable et ce qu’il faut corriger, selon la CPAM de la Gironde (2019). | 152 |
| `noemie-0480054` | Code rejet 0480054 : type de contrat incompatible | 49 | Code rejet 0480054 : le type de contrat complémentaire transmis diffère. La cause probable et ce qu’il faut corriger, selon la CPAM de la Gironde (2019). | 153 |
| `noemie-2900005` | Code rejet 2900005 : facture déjà payée, que faire | 50 | Code rejet 2900005 : une facture au même numéro a déjà été payée. Pourquoi ne pas la renvoyer et que faire à la place, selon la CPAM de la Gironde (2019). | 154 |
| `noemie-0180051` | Code rejet 0180051 : facture déjà en traitement, que faire | 58 | Code rejet 0180051 : une facture au même numéro est déjà en traitement. Pourquoi ne pas la renvoyer, et que faire, selon la CPAM de l’Isère (2023). | 147 |
| `noemie-2900230` | Code rejet 2900230 : facturations multiples, que faire | 54 | Code rejet 2900230 : deux actes identiques le même jour pour le même patient. Que faire au lieu de la renvoyer, selon la CPAM de la Gironde (2019). | 147 |
| `noemie-0450097` | Code rejet 0450097 : date d’examen non valide, que corriger | 59 | Code rejet 0450097 : soins de suite M’T dents hors période ou avant l’examen. La cause probable et quoi corriger, selon la CPAM de la Gironde (2019). | 149 |
| `noemie-0600064` | Code rejet 0600064 : bucco-dentaire absente, que corriger | 57 | Code rejet 0600064 : pas de prise en charge de prévention sous ce numéro. La cause probable et ce qu’il faut corriger, selon la CPAM de la Gironde (2019). | 154 |
| `noemie-0600069` | Code rejet 0600069 : rubrique prévention absente | 48 | Code rejet 0600069 : aucune prise en charge de prévention enregistrée. La cause probable et ce qu’il faut corriger, selon la CPAM de la Gironde (2019). | 151 |
| `noemie-2600710` | Code rejet 2600710 : numéro de dent incompatible | 48 | Code rejet 2600710 : la dent indiquée ne correspond pas à l’acte CCAM. La cause probable et ce qu’il faut corriger, selon la CPAM de la Gironde (2016). | 151 |
| `noemie-2600649` | Code rejet 2600649 : code association différent | 47 | Code rejet 2600649 : code association erroné ou actes non associables. La cause probable et ce qu’il faut corriger, selon la CPAM de la Gironde (2016). | 151 |
| `noemie-2600650` | Code rejet 2600650 : code association non renseigné | 51 | Code rejet 2600650 : le code association obligatoire n’a pas été transmis. La cause probable et ce qu’il faut corriger, selon l’Assurance Maladie (2018). | 153 |
| `noemie-0710060` | Code rejet 0710060 : montant demandé supérieur, que corriger | 60 | Code rejet 0710060 : le montant demandé dépasse le calcul de la caisse. La cause probable et ce qu’il faut corriger, selon l’Assurance Maladie (2018). | 150 |
| `noemie-0650001` | Code rejet 0650001 : prix unitaire absent, que corriger | 55 | Code rejet 0650001 : le prix unitaire manque sur la facture. La cause probable et quoi corriger avant de la renvoyer, selon la CPAM de la Gironde (2019). | 153 |
| `noemie-4000067` | Code rejet 4000067 : prix au-dessus de l’opposable | 50 | Code rejet 4000067 : le prix transmis n’est plus celui en vigueur. La cause probable et ce qu’il faut corriger, selon la CPAM de la Gironde (2019). | 147 |
| `noemie-4000055` | Code rejet 4000055 : prix supérieur à la base, que corriger | 59 | Code rejet 4000055 : le prix transmis dépasse celui de la base des médicaments. La cause probable et quoi corriger, selon la CPAM de l’Isère (2023). | 148 |
| `noemie-4000057` | Code rejet 4000057 : quantité au-delà du seuil, que corriger | 60 | Code rejet 4000057 : la quantité délivrée dépasse le seuil autorisé. La cause probable et quoi corriger avant de renvoyer, selon la CPAM de l’Isère (2023). | 155 |
| `noemie-4000072` | Code rejet 4000072 : vaccin grippe sans code 7, que corriger | 60 | Code rejet 4000072 : vaccin antigrippal facturé sans le code prévention 7. La cause probable et ce qu’il faut corriger, selon la CPAM de l’Isère (2023). | 152 |
| `noemie-0100052` | Code rejet 0100052 : habilitation envoi de messages | 51 | Code rejet 0100052 : vous n’êtes pas habilité à télétransmettre à cette caisse. La cause probable et quoi corriger, selon la CPAM de la Gironde (2016). | 151 |
| `noemie-traitement-caisse` | Traitement caisse NOEMIE : ce n’est pas un rejet | 48 | « Traitement caisse » dans un retour NOEMIE : la caisse étudie la facture, ce n’est pas un rejet. Que faire en attendant, et pourquoi ne pas la renvoyer. | 153 |

## 4. Maillage

### 4.1 Articles qui devraient pointer vers l’outil, par pertinence

Les dev en posent 3 au plus : les rangs 1 à 3. Les articles sont du contenu du moteur SEO (`content/ressources/`),
hors de la PR A : la modification passe par une PR moteur, après la mise en ligne du hub. Partage des intentions
(`seo.md` § 3.1) : une ancre qui dit « la liste » ou « chaque code » va au hub ; une ancre qui dit « lire », « page »
ou « méthode » reste sur l’article `codes-rejets-noemie`.

| Rang | Article | Où | Quoi poser (phrase exacte) | Pourquoi |
|---|---|---|---|---|
| 1 | `codes-rejets-noemie` | H2 « Où trouver la liste des codes rejets NOEMIE ? », à la fin du 2e paragraphe (« Les codes évoluent… ») | Ajouter : `Les libellés publiés par les caisses, avec leur source et leur date, sont rassemblés dans notre <a href="/outils/codes-rejet">liste des codes rejets NOEMIE, code par code</a>.` | La page qui reçoit déjà la requête « liste » : elle passe l’intention au hub sans renier sa phrase « cette page ne reproduit aucun code ». Le retitrage reste la décision n° 3 de Paul |
| 2 | `rejet-tiers-payant` | H3 « Ce que vous voyez au comptoir ou en back-office », 1er paragraphe | Remplacer l’adresse du lien « liste codes rejets NOEMIE » : `/ressources/codes-rejets-noemie` → `/outils/codes-rejet` (ancre inchangée) | Page déjà visible en Search Console ; l’ancre est la requête exacte du hub |
| 3 | `rejet-beneficiaire-inconnu` | H2 « Où voit-on ce rejet et que faut-il relever ? », à la fin du 2e paragraphe (« Le libellé n’est pas toujours mot pour mot… ») | Ajouter : `Si c’est la caisse qui rejette, et non la mutuelle, le libellé peut être « BENEFICIAIRE INCONNU DANS LA BDO » : voyez la page du <a href="/outils/codes-rejet/noemie-0270051">code rejet 0270051</a>.` | Lien vers une entrée, sur un libellé déjà cherché tel quel ; relie l’article AMC à l’entrée AMO (`seo.md` § 3.1) |
| 4 | `checklist-prise-en-charge` | H2 « Quand escalader un rejet, et vers qui ? », 3e paragraphe | Adresse du lien « codes rejets NOEMIE » → `/outils/codes-rejet` | La phrase promet déjà « la signification de chaque code et l’action à mener », ce que l’article ne donne pas et que le hub donne |
| 5 | `quand-relancer-mutuelle` | H2 « Dans quel cas faut-il relancer une mutuelle ? », 3e paragraphe | Adresse du lien « liste codes rejets noemie » → `/outils/codes-rejet` | Ancre « liste » |
| 6 | `ordonnances-medecins-deconventionnes-2027` | H2 « Peut-on encore délivrer sur l’ordonnance d’un médecin déconventionné ? », paragraphe « Pour lire les retours… » | Adresse du lien → `/outils/codes-rejet` ; la phrase suivante (« Elle ne contient pas, à ce jour, de code dédié à l’article 76 ») reste vraie pour le hub | Promesse « chaque code connu » |
| 7 | `officine-balance-agee-tiers-payant` | H3 « 2. La facture est arrivée, puis rejetée », paragraphe « Le rejet tiers payant pharmacie arrive… » | Adresse du lien « codes rejets NOEMIE » → `/outils/codes-rejet` | Pharmacie : 4 codes `4000…` sourcés par les CPAM |
| 8 | `virement-mutuelle-inferieur` | H2 « Où voir le montant réellement payé par la mutuelle ? », 2e paragraphe | Adresse du lien « liste codes rejets noemie » → `/outils/codes-rejet` | Ancre « liste » |
| 9 | `gerer-tiers-payant-magasin` | H2 « Quels indicateurs suivre, quel que soit le modèle ? », puce « Les rejets par motif » | Adresse du lien → `/outils/codes-rejet` | Ancre « Notre liste des codes rejets NOEMIE » |
| 10 | `plfss-2027-senat-taxe-complementaires-groupements` | H2 « Que faire dans votre structure avant le vote final ? », puce « Réduire le stock de rejets mutuelle » | Adresse du lien → `/outils/codes-rejet` | « donnent le motif à corriger » |

Restent sur l’article (ancre « page », « lire ») : `dentaire-paniers-100-sante-tiers-payant`, `orthodontie-facturation-traitements-longs`,
`recouvrement-patient-empathie`, `audioprothese-renouvellement-tiers-payant`, `trois-boucles-pharmacie`. Non retenus :
les fiches plateformes (`portail-sp-sante`, `portail-isante`…), dont les rejets sont ceux de la part mutuelle, et
l’ancien article `reduire-rejets-cpam`, qui affiche des taux de rejet sans source (TON.md, « ce qu’on n’affirme
jamais ») : à ne pas renforcer.

### 4.2 Liens de l’outil vers les articles (`ArticlesLies`)

| Page | Articles (1 à 3) | Autre outil |
|---|---|---|
| Hub | `codes-rejets-noemie` (lire un retour, pas à pas), `rejet-beneficiaire-inconnu`, `quand-relancer-mutuelle` | C : « Rejet de la part mutuelle : trouver le portail de la complémentaire » |
| Entrées | règle du § 3.5 | B pour `noemie-0650001` seulement |

## 5. Liste de contrôle TON.md

- [x] **Le résultat d’abord, l’IA jamais en premier** : la carte pont commence par « Les rejets repérés avant l’envoi,
  puis traités » ; on dit « agents », jamais « IA » (§ 1.7).
- [x] **Phrases courtes, affirmatives, concrètes** : réponses en deux phrases, FAQ en trois phrases au plus (§ 2, § 3.3).
- [x] **Les vrais objets du métier** : rejet, retour NOEMIE, facture, caisse, droits, prescripteur, doublon (partout).
- [x] **Un chiffre vrai et sourcé** : les seuls nombres sont des codes, des dates de documents et le format à 7 chiffres,
  tous dans `sources.md` ; aucun taux de rejet (les fréquences de 2010 du lexique optique ne sont pas reprises).
- [x] **Pas de superlatif ni de peur** : aucun.
- [x] **Vouvoiement** : « Tapez », « votre retour », « Vérifiez » (chapeau, état vide, réponses).
- [x] **Français simple, sigles définis** : ARL défini à sa première apparition (état vide, méthode, FAQ) ; NOEMIE
  expliqué dans le chapeau ; ETM et BDO définis dans les `explication` affichées juste sous le H1 ; « que corriger »
  plutôt que « process ».
- [x] **Pas de tiret long** : aucun dans ce fichier.
- [x] **Typographie française** : espaces insécables, guillemets « », apostrophe ’, « 7 chiffres », « 60 % » (posés par le
  script d’assemblage).
- [x] **Pas d’emoji**.
- [x] **On dit / on ne dit pas** : « tiers payant » sans trait d’union ; « dans les logiciels que vos équipes utilisent
  déjà » ; aucun « solution », « optimiser », « automatiser ».
- [x] **Jargon interdit** : aucun (« n’hésitez pas », « il est essentiel de »… absents).
- [x] **Ce qu’on peut affirmer** : « repérés avant l’envoi, puis traités » (formulation validée) ; pas de « zéro rejet »,
  pas de « 100 % », pas de métier servi nommé, pas de délai de déploiement, pas de prix, pas de client.
- [x] **HDS** : non cité (le sujet ne s’y prête pas) ; jamais la formule que TON.md interdit sur la certification.
- [x] **Au niveau de la marque, le tiers payant est un exemple** : la carte pont parle des rejets comme d’un travail des
  agents parmi d’autres, sans définir Granit par le tiers payant.
- [x] **Première phrase sur le lecteur** : le chapeau commence par « Tapez le code… de votre retour ».

## 6. À signaler

- **Paul** : « codes rejets » au pluriel dans les titres (§ 1.1) ; l’ordre inversé de la carte pont (§ 1.7) ; la règle
  R2 de la réponse (§ 3.3) ; le lot de liens du § 4.1 (une PR moteur SEO, après la mise en ligne du hub).
- **data-A** : `noemie-2600650` est dans `PRIORITE` alors que sa source vise les établissements publics et que sa note
  dit « rattachement aux cliniques à confirmer » : la pastille « Cliniques et labos » affirmerait plus que la source.
  Le retirer de `PRIORITE` ou confirmer le rattachement. Même remarque pour `noemie-0710060` (hors `PRIORITE`, liste
  seulement), dont la note dit « pas les cliniques privées ».
- **dev-A** : les tables du § 3.1 vont dans `publication.mjs` ; le test « `LIBELLES_COURTS` ≤ 30 » de `cadre.md` § 10
  passe pour les 29 codes. Ajouter au test : `RESUMES` présent pour chaque page publiée.
