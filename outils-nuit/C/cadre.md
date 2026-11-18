# Outil C · Mutuelle → portail de tiers payant · cadre pour dev-C

Rédigé le 18/11/2026 par product-designer. À lire avec `../socle.md`, `../seo.md` § 4 et `sources.md`.
Données : `donnees.json` (54 complémentaires dont 42 `sur` ; 13 opérateurs, réseaux ou portails ; 46 sources).

## 1. La promesse

> Vous cherchez la complémentaire du patient ; vous lisez, pour votre métier, le portail ou l'opérateur qui gère
> son tiers payant, le libellé à choisir et la date du relevé. La carte de tiers payant du patient fait foi.

`outil.mjs` : `id: "mutuelle-portail"`, `nom: "Portail par mutuelle"`, `titreCarte: "Quel portail pour cette
mutuelle ?"`, `description: "Pour chaque complémentaire, le portail ou l'opérateur de tiers payant métier par
métier, le libellé à choisir et la date du relevé."`, métiers : les 5, `ordre: 2`.

## 2. Une seule URL par mutuelle (règle retenue)

Proposition par défaut confirmée, pour trois raisons : aucune PR d'outil ne touche `content/` (domaine du moteur
SEO) ; les 22 fiches existantes sont déjà découvertes par Google et ne doivent pas avoir de doublon ; une page
d'outil se génère des données, une fiche s'écrit à la main.

| Cas | Ce qui existe | Ce que fait le hub |
|---|---|---|
| La mutuelle a une fiche `/ressources/portail-<x>` (22 : 21 slugs identiques + `la-mutuelle-familiale` → `mutuelle-familiale`) | la fiche seulement | la ligne mène à la fiche ; `/outils/mutuelle-portail/<slug>` → 301 vers la fiche |
| Pas de fiche, `sur`, seuil passé | `/outils/mutuelle-portail/<slug>` | la ligne mène à la page |
| Pas de fiche, sous le seuil ou `a_verifier` | rien | ligne dépliable (`<details>`) avec tout le relevé |

Une fiche créée plus tard par le moteur SEO pour une mutuelle qui a une page d'outil : `pages.mjs` la voit dans
`options.site`, la page d'outil disparaît du sitemap et part en 301 vers la fiche, sans toucher au code. Les
autres solutions (enrichir les fiches, tout migrer) sont la décision n° 1.

## 3. Le parcours à 375 px

1. **Au comptoir** : l'opticien tape « harmo » ; deux lignes restent (Harmonie Mutuelle, Harmonie Fonction
   Publique). Il pose le filtre « Optique et audio » : la ligne affiche en gros « Optique : Viamedis ». Il
   touche : la fiche Harmonie Mutuelle.
2. **Par numéro AMC** lu sur la carte (« 0045900442 ») : une seule ligne, MNH.
3. **Depuis Google** (« mnh tiers payant ») : la page d'outil si elle existe ; sinon le hub, ancre `#mnh`,
   la ligne ouverte (le relevé complet y est).
4. **Mutuelle absente** : l'état vide (§ 7) dit comment lire la carte et vers quelles fiches de plateforme aller.

## 4. Le hub `/outils/mutuelle-portail`

| Élément | Texte |
|---|---|
| `<title>` | Quel portail pour quelle mutuelle ? Tiers payant par métier (59) |
| Description | Quel portail de tiers payant pour quelle mutuelle ? Cherchez la complémentaire : portail par métier, libellé à choisir, date du relevé et source. (145) |
| H1 | « Quel portail de tiers payant » + « pour quelle mutuelle ? » |
| Chapeau | Cherchez la complémentaire par son nom ou son numéro AMC : vous voyez le portail relevé pour votre métier et la date du relevé. La carte de tiers payant du patient fait foi. |

Blocs dans l'ordre :

1. `FilOutil` : Accueil › Outils › Portail par mutuelle.
2. `EnTeteOutil compact` (« Outil gratuit · tiers payant ») avec `RechercheOutil` (libellé « Nom de la
   mutuelle ou numéro AMC », placeholder « Harmonie, MGEN, 0045900442… », aide « Le numéro AMC est sur la
   carte de tiers payant. », unité « complémentaire / complémentaires »), `FiltreMetier` et `FiltreFacette`
   `operateur` (`<select>` : SP santé, iSanté, Viamedis, Almerys, Carte Blanche Partenaires, Santéclair,
   Actil, Korelio, GIE Groupama TPG).
3. Encadré « Changements récents » (`BlocAvertissement a-venir`, daté) : Oxantis fermé le 26/10/2026,
   Viamedis reprend l'optique et l'audioprothèse (`acuite-oxantis`) ; MGEN chez Viamedis en optique et audio
   depuis le 27/10/2026, le reste annoncé au 30/11/2026, à confirmer (`ivoirnet-mgen`, `uspo-mgen-mai`).
4. `ListeHub` : groupes A à Z (lettres présentes seulement), les **54** complémentaires. Ligne :
   - `titre` = nom, `resume` = opérateurs fusionnés par métier (« Optique, audio, dentaire : Viamedis ») ;
     filtre métier posé : seulement ce métier, en 16 px (« Dentaire : iSanté · libellé « MNH » ») ;
   - métier `a_verifier` : « {opérateur}, à confirmer sur la carte » en texte secondaire, jamais comme acquis ;
     métier sans source : rien (aucun signe affiché) ; entrée sans aucun métier sûr : « Pas de source
     publique datée pour l'instant » ;
   - `cles` : `cleCode` des numéros AMC ; `texte` : nom, `autres_noms`, libellés de sélecteur, groupe ;
   - facettes `metier` (métiers `sur` **et** à confirmer) et `operateur` ;
   - lien vers la fiche ou la page d'outil, sinon `<details>` : le tableau « Portail par métier » (§ 5,
     bloc 5), réseaux, segments fermés, sources et date.
5. Méthode (300 à 500 mots, sources de `sources.md` seulement) : « De la carte au portail » (le nom ou le logo
   de l'opérateur, le numéro AMC, la mention propre à l'opérateur, ex. « SP » pour SP santé) ; « Pourquoi deux
   portails pour une même mutuelle » (métier, contrat, date) ; « Opérateur ou réseau de soins » (Kalixia n'est
   pas un portail : la PEC passe par l'opérateur) ; « Comment ce relevé est fait » (listes publiques SP santé et
   iSanté, pages des complémentaires, presse professionnelle, dates).
6. `BlocSources` (46 sources, avec l'accès : « lu en direct », « texte intégral lu, le site refusant l’accès direct »,
   « extraits de la page seulement, date inconnue »).
7. `FaqOutil jsonLd` : Comment savoir si une mutuelle passe par Viamedis, Almerys ou SP santé ? · Où trouver
   le numéro AMC ? · Une mutuelle peut-elle passer par plusieurs portails ? · Que faire si la mutuelle
   n'apparaît dans aucun portail ? · Ce relevé change-t-il ?
8. `ArticlesLies` : `mutuelle-quel-portail`, `portails-tiers-payant`, `rejet-beneficiaire-inconnu` ;
   `LienOutil` B (« Combien la complémentaire prend en charge ») et A (« Un rejet de la part mutuelle »).
9. `CartePont`.

```
375 px
‹ Outils
OUTIL GRATUIT · TIERS PAYANT
Quel portail de tiers payant
pour quelle mutuelle ?
Cherchez la complémentaire… La carte
de tiers payant du patient fait foi.
Nom de la mutuelle ou numéro AMC
[ Harmonie, MGEN, 0045900442… ][Chercher]
54 complémentaires
[Tous][Optique et audio][Dentaire][Centres…]
[Pharmacie][Cliniques et labos]
Opérateur [ Tous les opérateurs        ▾]
┃ⓘ CHANGEMENTS RÉCENTS · Oxantis fermé le
┃  26/10/2026 ; MGEN chez Viamedis…
A B C G H I K L M …
── H ──────────────────────────────
Harmonie Mutuelle            Fiche ›
Optique, audio, dentaire : Viamedis
───────────────────────────────────
Henner                            ▾
Dentaire, pharmacie, centres, labos :
SP santé
```

## 5. La page d'entrée `/outils/mutuelle-portail/<slug>`

| Élément | Gabarit |
|---|---|
| `<title>` | « {Mutuelle} tiers payant : le portail, métier par métier » ; plus de 60 : « {Mutuelle} tiers payant : portail par métier » |
| Description | « {Mutuelle} : quel portail de tiers payant, métier par métier ? Le portail relevé, le libellé à choisir, le numéro AMC et quoi faire si la carte du patient diffère. » ; trop long : retirer « et quoi faire si la carte du patient diffère » ; trop court : ajouter « , avec la date du relevé » |
| H1 | « {Mutuelle} tiers payant : quel portail, métier par métier ? » |
| Sur-titre | « Complémentaire santé » (+ « · {groupe} ») ; `type: gestionnaire` : « Gestionnaire de tiers payant » |

Blocs dans l'ordre :

1. `FilOutil` : Accueil › Outils › Portail par mutuelle › {Mutuelle}.
2. `EnTeteEntree` : réponse générée. Un opérateur : « Pour {métiers}, {Mutuelle} figure dans la liste publique
   {opérateur} : choisissez le libellé « {libellé} » (numéro AMC {n}). La carte de tiers payant du patient fait
   foi : elle désigne l'opérateur de chaque prestation. » Plusieurs : « En {métiers}, {opérateur 1} ; en
   {métiers}, {opérateur 2}. » + la même seconde phrase. Pastilles des métiers sûrs.
3. `BlocEssentiel` : Portail ou opérateur (fusionné par métier) · Libellé à choisir · Numéro AMC · Réseau de
   soins (sûr seulement) · Relevé le.
4. `BlocAvertissement fait-foi` : « La carte de tiers payant du patient fait foi. Un opérateur relevé pour un
   métier ne veut pas dire que tous les contrats de {Mutuelle} y passent. »
5. `## Portail par métier` : `TableauOutil`, une ligne par métier de C (Optique, Audio, Dentaire, Pharmacie,
   Centre de santé, Laboratoire, Clinique) : Opérateur (lien vers son espace pro, suivi `lm_portail_clic`) ·
   Libellé · N° AMC · Ouvert depuis · Sous-domaines listés · État (« relevé », « à confirmer sur la carte » avec
   la raison, « pas de source publique »). Les `alternatives` sûres en lignes en plus.
6. `## Segments fermés` (si `segments_fermes`) : « iSanté « SMABTP VIE » : optique et audio fermés le
   31/12/2025. » Fusionnés par libellé et date.
7. `## Réseau de soins` (si un réseau est `sur`) : nom, métiers, ce qu'en dit la source.
8. `## Vérifier sur la carte` : gabarit par opérateur, à partir de `operateurs[].note` (ex. SP santé : seules
   les dépenses portant la mention « SP » sur l'attestation).
9. `## Si la carte dit autre chose` (gabarit) : suivre la carte ; si l'opérateur de la carte ne trouve pas
   l'adhérent, lien vers `rejet-beneficiaire-inconnu` et vers l'outil A.
10. `BlocSources` + « Relevé le {date} ».
11. `EntreesVoisines` « Même opérateur » puis « Même groupe » : pages d'outil publiées **et fiches**
    `/ressources/portail-<x>` (les deux sont des pages de mutuelle), 3 à 6.
12. `ArticlesLies` : la fiche de l'opérateur principal (`portail-isante`, `portail-sp-sante`,
    `portail-viamedis`…), `mutuelle-quel-portail` ; `LienOutil` B et A.
13. `CartePont`.

**Données à structurer** : libellé de sélecteur, numéro AMC, segment, date d'ouverture et sous-domaines ne sont
aujourd'hui que dans `note_verification`. Demander à data-C des champs (`libelle_selecteur`, `numero_amc`,
`actif_depuis`, `sous_domaines`) ; à défaut, les extraire par une expression testée (`/Libellé « ([^»]+) » \(n°
AMC (\d+)\), segment « ([^»]+) » actif depuis le (\d\d\/\d\d\/\d{4})/`), le test exigeant que 100 % des notes
SP santé et iSanté soient lues.

**À vérifier avec data-C avant publication** : 28 segments dentaires `sur` listent le seul sous-domaine
« UNIQUEMENT STOMATOLOGUE (18) » (« Sous-domaines listés »), alors que `sources.md` classe « uniquement
stomatologue » en `a_verifier` quand c'est une restriction (« Restreint au sous-domaine »). Tant que la
différence n'est pas confirmée, la page affiche la mention à côté de l'opérateur (« sous-domaine listé :
stomatologues »), jamais un dentaire sans réserve.

## 6. Quelles entrées ont une page

`publication.mjs` :

```js
export const ALIAS_FICHES = { "la-mutuelle-familiale": "mutuelle-familiale" };   // slug C → fiche existante
export const SEUIL_MOTS_PROPRES = SEUIL_DEFAUT;   // 100 dédupliqués (décision Paul n° 2)
export const PAGES_MAX = 25;
export const PRIORITE = ["mutualia", "smabtp", "abeille-assurances", "mutuelle-de-poitiers", "axa",
  "henner", "sigmage", "uneo", "mnh", "mutuelle-sg", "mutuelle-ratp", /* … les 26 sûres sans fiche */];
export const A_CONFIRMER_VISIBLE = true;          // métiers « à vérifier » montrés « à confirmer » (décision n° 3)
```

**Règle exacte** : page si l'entrée est dans `PRIORITE`, `statut: "sur"`, **sans fiche** (`site.articles` ne
contient pas `portail-<ALIAS_FICHES[slug] ?? slug>`), au moins un métier `sur`, `motsPropres ≥
SEUIL_MOTS_PROPRES` et 2 voisins (pages ou fiches). Sur la page, seuls les métiers `sur` sont affichés comme
acquis (`audit().entrees` = les métiers sûrs).

**`textePropre`** : les phrases **fusionnées** que la page rend, une par fait : une par couple (opérateur,
libellé, numéro AMC) avec ses métiers et sa date ; une par restriction de sous-domaine ; une par segment fermé
(fusionné) ; une par réseau sûr ; les `notes` ; les `note_verification` des sources hors listes SP santé et
iSanté. Fusionner n'est pas une astuce de comptage : sept lignes identiques sont illisibles à 375 px. « Ne vaut
que pour une carte qui désigne iSanté. » revient partout : gabarit, non compté.

**Comptes** (estimés, le test calcule les vrais) : 54 entrées ; 22 ont une fiche (16 `sur`, 6 `a_verifier`) ;
32 sans fiche dont **26 `sur`** (candidates) et 6 `a_verifier` (Apivia Macif, AG2R La Mondiale, La Mutuelle
Générale, Audiens, Mutuelle Mieux-Être, Ipeca). Les candidates relevées seulement dans une liste SP santé ou
iSanté tiennent en une phrase fusionnée : 45 à 65 mots propres.

| Seuil (mots dédupliqués) | Pages d'outil | Lesquelles |
|---|---|---|
| 150 (seo.md) | 1 | Mutualia (7 libellés iSanté en optique) |
| **100 (proposé)** | **2** | + SMABTP (segments fermés) |
| 80 | 4 | + Abeille Assurances, Mutuelle de Poitiers |
| 50 | une vingtaine | presque toutes les mutuelles iSanté et SP santé, en pages quasi identiques : déconseillé |

Conséquence voulue : **le hub est l'outil**. Il porte les 54 complémentaires dans le HTML serveur, avec le relevé
complet de chacune dans sa ligne ; les pages d'outil restent rares tant qu'il n'y a pas plus à dire.

## 7. URL, slug, redirections

- `/outils/mutuelle-portail/<slug>`, slug = `slug` de `donnees.json` : nom usuel, minuscules, sans accents ni
  forme juridique, mots séparés par des tirets (`mutuelle-de-poitiers`, `la-banque-postale-prevoyance`), identique
  à la règle des fiches (`seo.md` § 4.4). Une page par organisme, jamais par libellé de sélecteur ou par contrat.
- `redirections()` (301) : slug d'une mutuelle à fiche → `/ressources/portail-<fiche>` ; `slugifier` de chaque
  `autres_noms` → le slug ; entrée connue sans page → hub `#slug`. Fusion ou changement de nom d'un organisme :
  301 vers le nouvel organisme, avec une mention sur sa page.
- 404 sinon.

## 8. État vide et entrée introuvable

| Situation | Message |
|---|---|
| Nom absent | « « {q} » n'est pas dans notre relevé. Regardez la carte de tiers payant du patient : elle porte le nom ou le logo de l'opérateur et le numéro AMC. Cherchez ensuite la mutuelle sur le portail de cet opérateur. » + liens vers les fiches d'opérateur en ligne (`portail-viamedis`, `portail-almerys`, `portail-sp-sante`, `portail-isante`, `portail-santeclair`, `portail-carte-blanche`, `portail-actil`) |
| 8 à 10 chiffres inconnus | « Ce numéro AMC n'est dans aucune des listes publiques relevées le 18/11/2026 (SP santé, iSanté). » + même suite, + `mutuelle-quel-portail` (lire le numéro AMC) |
| La mutuelle existe mais le filtre métier la masque | « {Mutuelle} est dans l'annuaire, sans portail relevé pour {métier}. » + bouton « Voir tous les métiers » |
| Entrée sans aucun métier sûr | pas un état vide : la ligne dit « Pas de source publique datée pour l'instant » et, si elle existe, mène à la fiche |

Toujours : « Effacer la recherche », « Signaler une mutuelle manquante » (`mailto:`). 404 : H1 « {slug} :
introuvable », la recherche préremplie avec le slug en mots (« mutuelle-xyz » → « mutuelle xyz »).

## 9. Le pont vers Granit

`CartePont` en dernier bloc. `texte` : « Des agents font l'administratif de vos équipes sur vos portails, comme
le ferait une personne : prises en charge, factures, relances. » (formulations de la colonne « on dit » de
`TON.md` ; pas de « tous les portails », permis en optique seulement). Cible : page du métier si le filtre est
posé ou si la mutuelle n'a qu'un métier sûr, sinon `/metiers`. « Demander une démo » :
`utm_campaign=outil-mutuelle-portail`.

## 10. Mesure (PostHog)

Événements du socle, `outil: "mutuelle-portail"`, plus `lm_portail_clic` `{ entree, operateur, metier }` au clic
sur le lien d'un espace pro (sortie vers le portail : le signe le plus net que l'outil a servi).

- Requêtes sans résultat (noms, numéros AMC) : la liste des complémentaires à relever par data-C.
- Répartition de `lm_filtre facette=metier` : quels métiers viennent vraiment (C vise les cinq).
- `lm_resultat_clic` vers fiche ou vers page ; `lm_entree_vue mode=ligne` (mutuelles sans page qu'on ouvre :
  candidates à une page si le relevé s'enrichit).
- `lm_portail_clic` par opérateur ; `lm_voisin_clic` vers A et B ; `lm_pont_vu` → `lm_pont_clic`.

## 11. Tests propres à C (`tests/outils/mutuelle-portail.test.ts`)

- Aucune page d'outil pour un slug qui a une fiche (avec `ALIAS_FICHES`) ; toute mutuelle à fiche redirige vers elle.
- Une page n'affiche comme acquis que des métiers `sur` ; un métier `a_verifier` n'apparaît qu'avec « à confirmer ».
- 100 % des `note_verification` SP santé et iSanté sont lues par l'extraction (ou les champs structurés existent).
- Chaque `operateur_id` cité existe dans `operateurs` ; Oxantis n'est jamais proposé comme portail actif.
- Les liens d'espace pro sont en `https`.

## 12. Hors de la PR C, à faire ensuite (à signaler à Paul)

- `mutuelle-quel-portail` : son H1 promet « l'outil » et « 281 mutuelles ». Une fois le hub en ligne : H1
  « Numéro AMC : c'est quoi, où le lire sur la carte ? », la section « Comment lire le résultat de notre outil »
  remplacée par un lien vers le hub, le nombre retiré (`seo.md` § 4.1).
- `portail-mgen` : à relire face au relevé (Viamedis en optique et audio depuis le 27/10/2026), pour que la
  fiche et le hub ne se contredisent pas.

## 13. Les 3 décisions de Paul

1. **Où vit la page d'une mutuelle.** Par défaut : le hub `/outils/mutuelle-portail` est l'annuaire de toutes
   les mutuelles ; une page d'outil seulement pour une mutuelle **sans** fiche ; la fiche existante reste
   l'unique URL des 22 autres. Autres choix : (a) enrichir les 22 fiches d'un tableau « Portail par métier »
   nourri par C (option a de `seo.md`, PR à part sur `content/plateformes` et le gabarit des fiches) et créer les
   nouvelles mutuelles en fiches ; (b) un jour, tout migrer sous `/outils` en 301, après indexation.
2. **Seuil et vague 1.** Proposé : 100 mots propres dédupliqués, soit **le hub et 2 pages** (Mutualia, SMABTP).
   Descendre à 50 donnerait une vingtaine de pages presque identiques (déconseillé). Ou garder le hub seul en
   vague 1, et ouvrir des pages quand data-C aura structuré plus de faits par mutuelle.
3. **Les faits « à confirmer ».** Proposé (`A_CONFIRMER_VISIBLE = true`) : montrer dans l'annuaire les
   opérateurs `a_verifier` avec « à confirmer sur la carte » et la raison (ex. MNT → Viamedis, déduit de la
   fermeture d'Oxantis), jamais sur une page comme acquis. Sinon, 44 couples mutuelle et métier (dans 19
   entrées, dont les 12 entièrement « à vérifier ») n'affichent que « pas de source publique datée ».
