# Outil B · Remboursement · cadre pour dev-B

Rédigé le 18/11/2026 par product-designer. À lire avec `../socle.md`, `../seo.md` § 5, `sources.md` et
**`formules.md`, qui fait foi pour tout montant affiché**. Données : `donnees.json` (296 entrées, 263 `sur` :
optique 201, audio 8, dentaire 31, pharmacie 23).

## 1. La promesse

> Vous tapez un code LPP ou cherchez un équipement ; vous lisez la base de remboursement, ce que paie la Sécu,
> le ticket modérateur et ce qui revient à la complémentaire en contrat responsable, au tarif daté et sourcé.

`outil.mjs` : `id: "remboursement"`, `nom: "Remboursement"`, `titreCarte: "Combien rembourse la Sécu, et la
mutuelle ?"`, `description: "Base de remboursement, part Sécu, ticket modérateur et part mutuelle par code
LPP, 100 % Santé compris, avec la date du tarif et sa source."`, `metiers: ["optique"]` (+ `"dentaire"` le jour
où le dentaire ouvre), `ordre: 3`.

## 2. Le parcours à 375 px

1. **Au comptoir, un code du devis** : l'opticienne tape « 2263287 » dans le hub ; le groupe « Verre unifocal
   classe A » s'ouvre sur une seule ligne : base 9,75 €, Sécu 5,85 €, prix limite 32,50 €. Elle touche la ligne :
   page du groupe, ancre `#lpp-2263287`, ligne surlignée, calcul prérempli avec ce code.
2. **Depuis Google** (« base de remboursement verre progressif classe A ») : la page du groupe. Sans défiler :
   H1 et réponse chiffrée en deux phrases. Puis « L'essentiel », le bandeau 2027, le calcul, le tableau des codes.
3. **Le patient demande « et la mutuelle ? »** : le calcul. Prix facturé prérempli au prix limite (classe A) ou
   vide (classe B) ; la carte de résultat dit ce que paie la Sécu, le minimum dû par un contrat responsable, et,
   en 100 % Santé, que le reste à charge est nul.
4. **Code par fabricant** (« 7227824 »), code CCAM, CIP : l'état vide explique et oriente (§ 7).

## 3. Les groupes (ce qui se lit ensemble)

Une page par **groupe**, jamais par code LPP : les 201 codes optique ont 1 à 10 montants différents par
catégorie (les 90 verres de classe B ont tous la base de 0,05 €). Le tableau des codes est dans la page ;
chaque code a son ancre `#lpp-<code>` et reste trouvable par la recherche. `src/lib/outils/remboursement/groupes.mjs` :

| Slug du groupe | Catégories de `donnees.json` | Codes | Montants (lus) | Vague 1 |
|---|---|---|---|---|
| `verre-unifocal-classe-a` | verre unifocal classe A | 30 | base 9,75 à 35,25 € ; prix limite 32,50 à 117,50 € | oui |
| `verre-multifocal-classe-a` | verre multifocal classe A | 30 | base 13,50 à 39 € ; prix limite 45 à 130 € | oui |
| `verre-progressif-classe-a` | verre progressif classe A | 30 | base 22,50 à 51 € ; prix limite 75 à 170 € | oui |
| `verres-classe-b` | verre unifocal, multifocal, progressif classe B | 90 | base 0,05 € (tous) ; prix libre | oui |
| `montures` | monture adulte et enfant A et B, supplément monture à coque A et B | 6 | A : base 9 €, prix limite 30 € ; B : base 0,05 € | oui |
| `prestations-optique` | adaptation A et B, appairage (3), accompagnement A, verres teintés, verre neutre A et B | 9 | ex. supplément d'accompagnement : base et prix limite 42 € | oui |
| `aides-auditives` | aide auditive classe I et II, plus de 20 ans et 20 ans et moins | 8 | base 400 € / 1 400 € ; classe I prix limite 950 € / 1 400 € | oui |
| `verres-freinateurs-myopie` | verre unifocal freinateur de myopie | 6 | base 44,28 € ; prix limite 147,60 € | non : un seul fabricant, conditions d'inscription non lues |
| `couronnes-dentaires`, `bridges-dentaires`, `inlay-core`, `protheses-dentaires-amovibles` | 9, 6, 3, 12 actes CCAM | 30 | tableau ameli des honoraires limites au 01/01/2026 | non (métier fermé, décision n° 2) |

`HORS_GROUPE` : mainteneur d'espace (1 acte), ligne du hub seulement. Chaque code `sur` d'un métier ouvert est
dans **un** groupe ou dans `HORS_GROUPE` (test).

Chaque groupe porte, écrits à la main dans `groupes.mjs` : `nom`, `titre`, `description`, `h1`, `surTitre`,
`texte` (paragraphes, **chacun avec ses `source_ids`**, rien qui ne soit dans `sources.md` ou `formules.md`),
`voisins`, `articles`.

## 4. Quelles entrées ont une page

`publication.mjs` :

```js
export const METIERS = {
  optique:   { liste: true,  pages: true  },
  audio:     { liste: true,  pages: true  },
  dentaire:  { liste: false, pages: false },   // décision Paul n° 2
  pharmacie: { liste: false, pages: false },   // pas de page par CIP (seo.md) ; liste fermée en V0
};
export const SEUIL_MOTS_PROPRES = SEUIL_DEFAUT;  // 100 dédupliqués
export const PAGES_MAX = 25;
export const PRIORITE = ["verre-unifocal-classe-a", "verre-progressif-classe-a", "montures", "verres-classe-b",
  "verre-multifocal-classe-a", "aides-auditives", "prestations-optique",
  "couronnes-dentaires", "bridges-dentaires", "inlay-core", "protheses-dentaires-amovibles"];
export const TAUX_2027 = { lpp: null, dentaire: null };   // null tant que l'Uncam ou l'arrêté n'est pas publié
export const DATE_BASCULE = "2027-01-01";
```

**Règle exacte** : un groupe a une page s'il est dans `PRIORITE`, si son métier a `pages: true`, si **tous** ses
codes sont `sur`, si `motsPropres ≥ SEUIL_MOTS_PROPRES` et s'il a 2 voisins publiés. Un code `sur` d'un métier
dont `liste` est vrai : ligne du hub (lien vers `groupe#lpp-<code>` si le groupe a une page, sinon `<details>`).
Un code `a_verifier` : nulle part (pharmacie : 24 ; dentaire : 9 soins sans code CCAM).

**`textePropre`** d'un groupe : la réponse en deux phrases et les valeurs de « L'essentiel » (générées à partir
des montants du groupe), le paragraphe « D'une tranche à l'autre » (généré : bornes de base et de prix limite
avec la désignation de la tranche), et `texte` de `groupes.mjs`. Pas les lignes du tableau, pas les conditions
communes (`conditions`, identiques sur les verres), pas le bandeau 2027 : répétés dans 3 groupes ou plus, ils
sont du gabarit de toute façon.

**Comptes** : V0 = 7 pages de groupe (les 7 « oui » ci-dessus, si chacun passe le seuil ; prévoir 60 mots de
`texte` propre au groupe, le reste vient des chiffres) et un hub de 209 lignes (201 optique, 8 audio) en 8
groupes repliés. Dentaire ouvert : + 30 lignes et 4 pages possibles. Moins que les 15 à 25 de `seo.md` : B est
le dernier outil de la priorité, et c'est le nombre de lectures vraiment distinctes de la LPP optique et audio.

## 5. Le hub `/outils/remboursement`

| Élément | Texte |
|---|---|
| `<title>` | Remboursement par code LPP : base Sécu et part mutuelle (55) |
| Description | Base de remboursement, taux Sécu, ticket modérateur et part mutuelle de chaque code LPP d’optique et d’audio, 100 % Santé compris, avec la date et la source. (157) |
| H1 | « Base de remboursement et part mutuelle, » + « code par code » |
| Chapeau | Tapez un code LPP ou cherchez un équipement (verre, monture, aide auditive) : base, part Sécu, ticket modérateur et part de la complémentaire, au tarif en vigueur. |

Blocs : `FilOutil` ; `EnTeteOutil compact` (« Outil gratuit · tiers payant ») avec `RechercheOutil` (libellé
« Code LPP ou équipement », placeholder « 2263287, verre progressif… », aide « Le code à 7 chiffres du devis ou
de la facture. », `inputMode: "search"`) et deux `FiltreFacette` : `domaine` (Optique · Audio) et `panier`
(100 % Santé · Tarif libre) ; `BlocAvertissement a-venir` (2027, § 6) **avant** la liste ; `ListeHub replier`
(groupe fermé : nom, « 30 codes · base 9,75 à 35,25 € », lien vers la page ; ligne : code, désignation courte,
« Base 9,75 € · Sécu 5,85 € · Prix limite 32,50 € ») ; méthode (« Comment se calcule un remboursement » :
base × taux, ticket modérateur, 100 % Santé jusqu'au prix limite, minimum d'un contrat responsable ; « Codes
génériques et codes par fabricant » ; « Ce que l'outil ne calcule pas » : ALD, C2S, AT/MP, maternité,
Alsace-Moselle, régime des Mines, tout de `formules.md`) ; `BlocSources` ; `FaqOutil jsonLd` (Combien rembourse
la Sécu pour une monture de classe A ? · Le 100 % Santé, c'est zéro reste à charge pour tous ? · Peut-on
associer des verres de classe A et une monture de classe B ? · Qu'est-ce qui change au 1er janvier 2027 ? ·
Pourquoi le code du devis commence-t-il par 7 ?) ; `ArticlesLies` (`reste-a-charge-drees-expliquer-devis`,
`tiers-payant-opticien`, `audioprothese-renouvellement-tiers-payant`) + `LienOutil` C (« Où faire la prise en
charge de la part mutuelle ») et A ; `CartePont`.

```
375 px
OUTIL GRATUIT · TIERS PAYANT
Base de remboursement et part
mutuelle, code par code
Code LPP ou équipement
[ 2263287, verre progressif… ][Chercher]
209 codes
[Tous][Optique][Audio]   [Tous][100 % Santé][Tarif libre]
┃ⓘ AU 1ER JANVIER 2027
┃  La part Sécu sur la LPP baissera : entre
┃  40 et 50 % au lieu de 60 %. Taux exact non
┃  publié au 18/11/2026. Décret 2026-810 ›
▸ Verre unifocal classe A · 30 codes
  base 9,75 à 35,25 € · Voir la page ›
▸ Verres classe B · 90 codes · base 0,05 €
▸ Montures · 6 codes
…
```

## 6. La page de groupe `/outils/remboursement/<groupe>`

Gabarits (par groupe dans `groupes.mjs`, contrôlés par le test commun) : `<title>` « {Nom} : base de
remboursement et mutuelle » (ex. 59 caractères pour le verre unifocal classe A) ; description écrite à la main,
140 à 160 (« Verre unifocal classe A : base de remboursement, part Sécu, ticket modérateur, prix limite et part
mutuelle des 30 codes LPP, lus dans la base LPP du 13/11/2026. » fait 161 : à raccourcir) ; H1 « {Nom} : base
de remboursement et part mutuelle » ; sur-titre « Optique · 100 % Santé · code LPP ».

Blocs dans l'ordre :

1. `FilOutil` : Accueil › Outils › Remboursement › {Nom}.
2. `EnTeteEntree` : réponse générée, deux phrases. 100 % Santé : « La Sécurité sociale rembourse 60 % de la
   base, soit de 5,85 € à 21,15 € par verre selon la correction. En contrat responsable, la complémentaire paie
   le reste jusqu'au prix limite (32,50 € à 117,50 €) : le patient ne paie rien. » Tarif libre : « La base est de
   0,05 € par verre, quelle que soit la correction : la Sécu rembourse 0,03 €. Au-delà, la prise en charge
   dépend du contrat ; un contrat responsable couvre au moins le ticket modérateur (0,02 €). »
3. `BlocEssentiel` : Base de remboursement · Taux Sécu « 60 % (jusqu'au 31/12/2026) » · Prix limite de vente ·
   Reste à charge en contrat responsable (« 0 € » ou « selon le contrat ») · Tarif en vigueur depuis
   (« 07/07/2023, arrêté du 03/07/2023 »).
4. `BlocAvertissement fait-foi` : « Ces montants viennent de la base LPP de l'Assurance Maladie (version 910
   du 13/11/2026), qui fait foi. Un code par fabricant reprend les montants de son code générique. »
5. `BlocAvertissement a-venir` « Au 1er janvier 2027 » : « La part de la Sécurité sociale sur les produits de
   la LPP (optique, aides auditives) baissera : le taux, aujourd'hui de 60 %, sera compris entre 40 et 50 %
   (décret n° 2026-810 du 21 août 2026). Le taux exact n'était pas publié au 18/11/2026. La base et le prix
   limite ne changent pas ; en 100 % Santé, le reste à charge reste nul en contrat responsable : c'est la part
   de la complémentaire qui augmente. » Sources : `decret-2026-810`, `css-r160-5-2027`, `css-r871-2`.
   Dentaire : décret n° 2026-809.
6. `## Calculer pour un code` (composant `CalculRemboursement`, § 6.1).
7. `## Les {n} codes` : `TableauOutil`, ancre `lpp-<code>` par ligne. Colonnes : Code · Désignation LPP
   (texte officiel exact) · Base · Sécu (60 %) · Ticket modérateur · Prix limite · Complémentaire au prix limite
   (100 % Santé seulement). À 375 px : une carte par code, désignation en tête.
8. `## D'une tranche à l'autre` (généré) puis `## Ce qu'il faut savoir` (`texte` du groupe, sourcé).
9. `## Conditions de prise en charge` (`conditions` des codes, ameli) et `## Ce que ce calcul ne couvre pas`
   (cas particuliers de `formules.md` § 1).
10. `BlocSources` (sources des codes du groupe + celles du `texte`), « Vérifié le 18/11/2026 ».
11. `EntreesVoisines` « Dans la même famille » : `voisins` déclarés (unifocal A ↔ multifocal A ↔ progressif A
    ↔ verres B ; montures ↔ verres ; aides auditives ↔ prestations), 3 à 6.
12. `ArticlesLies` (`articles` du groupe ; `refus-pec-verres-myopie-miyosmart-courrier` pour les freinateurs le
    jour où ils ont une page) + `LienOutil` C et A.
13. `CartePont`.

### 6.1 Le calcul (ce qui est affiché, et rien d'autre)

Entrées : le code (liste du groupe, prérempli : ancre de l'URL, sinon premier code) et le prix facturé
(prérempli au prix limite en 100 % Santé, vide sinon). Rendu serveur avec ces valeurs : le résultat existe
sans JavaScript. Sorties, toutes tirées de `donnees.json` ou de `formules.md` :

| Ligne | 100 % Santé | Tarif libre |
|---|---|---|
| Base de remboursement | `base_remboursement` | idem |
| Remboursé par la Sécu (taux) | `rembourse_secu` (pas recalculé) | idem |
| Ticket modérateur | `ticket_moderateur` | idem |
| Reste après la Sécu | prix − `rembourse_secu` | idem |
| Contrat responsable | « La complémentaire prend {prix − Sécu} ; reste à charge 0 € » | « Au moins le ticket modérateur ({TM}) ; au-delà, selon le contrat » |
| Plafond | rien | monture : « 100 € au plus, Sécu et ticket modérateur compris » ; aide auditive classe II : « 1 700 € au plus par aide auditive » (R871-2). **Aucun plafond pour les verres** : la correspondance entre « verres simples, complexes » et codes LPP n'est pas sourcée (`formules.md`) |
| Alerte | prix > prix limite : « Au-delà du prix limite de vente ({PLV}), ce produit ne peut pas être facturé en 100 % Santé. » | rien |
| Toujours | « Sans complémentaire, ou avec un contrat non responsable, le reste à charge n'est pas garanti nul. » | |

Jamais : un montant de mutuelle au-delà de ces règles, un plafond de participation forfaitaire, une franchise
(non sourcée pour la LPP), un calcul ALD ou C2S.

**Après le 01/01/2027** (date du serveur, Europe/Paris) : si `TAUX_2027.lpp` est `null`, les colonnes Sécu,
ticket modérateur et complémentaire affichent « taux 2027 non publié », le calcul aussi, et le bandeau devient
« Depuis le 1er janvier 2027 : le taux n'est pas encore publié, nous n'affichons pas de montant Sécu. » Dès que
le taux est renseigné (avec sa source ajoutée aux données), montants recalculés et datés. Fonction pure
`montantsAffiches(code, date, TAUX_2027)`, testée.

```
375 px  (verre-unifocal-classe-a)
‹ Remboursement
OPTIQUE · 100 % SANTÉ · CODE LPP
Verre unifocal classe A : base de
remboursement et part mutuelle
La Sécurité sociale rembourse 60 % de la
base, soit de 5,85 € à 21,15 € par verre…
┌ L'essentiel ───────────────────────┐
│ Base       9,75 à 35,25 €          │
│ Taux Sécu  60 % (jusqu'au 31/12/2026)│
│ Prix limite 32,50 à 117,50 €       │
│ Reste à charge (contrat resp.) 0 € │
└────────────────────────────────────┘
┃ⓘ La base LPP de l'Assurance Maladie fait foi…
┃ⓘ AU 1ER JANVIER 2027 …
## Calculer pour un code
[ 2263287 · sphère ]0 ; −2,00]     ▾]
Prix facturé [ 32,50 ] €
┌ Sécu 5,85 € · Ticket modérateur 3,90 € ┐
│ Complémentaire 26,65 € · Patient 0 €   │
└────────────────────────────────────────┘
## Les 30 codes
┌ 2263287 ───────────────────────────┐
│ OPTIQUE, VERRE UNIFOCAL CLASSE A,  │
│ SPHERE] 0 A -2,00]                 │
│ Base 9,75 € · Sécu 5,85 € · TM 3,90 €│
│ Prix limite 32,50 € · Compl. 26,65 €│
└────────────────────────────────────┘
…
```

## 7. URL, slug, redirections

- Groupes : `/outils/remboursement/<groupe>` (slugs du § 3). Écart volontaire avec `seo.md`
  (`/outils/remboursement/lpp-2222124`) : une page par code ferait des centaines de pages presque identiques.
- `redirections()` (301) : `lpp-<code>`, `<code>` et le `slug` de `donnees.json`
  (`lpp-2263287-verre-unifocal-classe-a-sphere-0-a-2-00`) → `/outils/remboursement/<groupe>#lpp-<code>`.
  Dentaire ouvert : `ccam-<code>`, `<code>` → `<groupe>#ccam-<code>`. Code d'un groupe sans page : hub `#lpp-<code>`.
- Pas d'URL par CIP. 404 pour le reste (`PageIntrouvableOutil`, message selon la forme du slug, § 8).

## 8. État vide et entrée introuvable

| Requête | Message |
|---|---|
| 7 chiffres commençant par 7 | « Les codes qui commencent par 7 sont des codes par fabricant : ils reprennent la désignation et les montants d'un code générique (qui commence par 2). Cherchez la désignation (« verre unifocal classe A ») ou retrouvez le code générique dans la base LPP. » + lien vers la base LPP (source `lpp-cnam-v910`) |
| 7 chiffres inconnus | « Ce code n'est pas un code générique d'optique ou d'audio de la base LPP du 13/11/2026. Vérifiez-le dans la base LPP de l'Assurance Maladie. » |
| Code CCAM (4 lettres, 3 chiffres) | « Le dentaire n'est pas encore dans l'outil. Les honoraires limites des prothèses sont publiés par l'Assurance Maladie. » + `dentaire-paniers-100-sante-tiers-payant` |
| 13 chiffres commençant par 34 (CIP) | « Les médicaments ne sont pas dans l'outil. La base de données publique des médicaments donne le prix et le taux de chaque boîte. » + lien base-donnees-publique.medicaments.gouv.fr |
| Texte | « Aucun équipement ne correspond à « {q} ». Essayez « verre », « monture », « progressif », « aide auditive » ou le code à 7 chiffres. » |

Dessous : « Effacer la recherche », lien vers la méthode du hub, « Signaler un code manquant » (mailto).

## 9. Le pont vers Granit

`CartePont` en dernier bloc. `texte` : « Des agents font l'administratif de vos équipes dans les logiciels
qu'elles utilisent déjà : ils saisissent les prises en charge, facturent et pointent les virements. » (verbes
de la colonne « on dit » de `TON.md`). Cible : `/metiers/opticiens` (optique et audio ; `/metiers/dentaire` pour
les groupes dentaires). « Demander une démo » : `utm_campaign=outil-remboursement`.

## 10. Mesure (PostHog)

Événements du socle, `outil: "remboursement"`, plus un événement propre :
`lm_calcul` `{ entree: groupe, code, prix_modifie: bool, au_dela_plv: bool }`, envoyé 800 ms après la dernière
saisie (jamais le prix lui-même).

- Requêtes sans résultat par forme (`7…` fabricant, CCAM, CIP, texte) : la demande réelle pour les codes
  fabricant, le dentaire et la pharmacie, donc l'argument chiffré pour la décision n° 2.
- Groupes les plus vus, `depuis: "externe"` ; part des visites avec calcul ; `au_dela_plv` (incompréhension
  du prix limite ?).
- `lm_voisin_clic` vers A et C (le maillage C → B → A sert-il ?), `lm_pont_vu` → `lm_pont_clic`.

## 11. Tests propres à B (`tests/outils/remboursement.test.ts`)

- Chaque code : `rembourse_secu + ticket_moderateur = base` au centime ; `rembourse_secu` = base × taux arrondi
  au centime ; 100 % Santé : `part_complementaire_au_prix_limite = prix_limite − rembourse_secu`.
- Chaque code `sur` d'un métier ouvert est dans un groupe ou dans `HORS_GROUPE`, et dans un seul.
- `montantsAffiches` : le 02/01/2027 avec `TAUX_2027.lpp = null`, aucun montant Sécu ; avant, ceux des données.
- Le calcul ne renvoie jamais de plafond pour un verre ; renvoie l'alerte au-delà du prix limite.
- Chaque paragraphe de `texte` d'un groupe a au moins un `source_id` connu.
- `redirections()` : `lpp-<code>` et le slug d'origine mènent au bon groupe et à la bonne ancre.

## 12. Les 3 décisions de Paul

1. **Granularité.** Proposé : 7 pages de groupe en V0 (tableau des codes dedans), aucune page par code LPP. À
   trancher aussi pour plus tard : le dentaire par groupe (4 pages) ou par code CCAM (« hbld634 » se cherche et
   quatre sites concurrents font une page par code ; 31 actes sûrs, une seule ligne de tarif chacun).
2. **Périmètre de la V0.** Proposé : optique et audio seulement. Le dentaire (31 actes sûrs, honoraires limites
   au 01/01/2026, panier inconnu pour 15 d'entre eux) peut ouvrir en liste ou en pages d'une ligne dans
   `METIERS`. La pharmacie reste fermée : 23 médicaments sûrs sur des milliers, et 22 autres portent un « tarif
   de remboursement ajusté » non sourcé.
3. **2027.** Valider le texte du bandeau et la règle « après le 01/01/2027 sans taux publié, aucun montant Sécu
   affiché ». Et faire corriger avant que B y renvoie l'article `ticket-moderateur-2027-tiers-payant`, qui ne
   cite que le décret dentaire alors que les décrets n° 2026-810 (optique, audio) et 2026-811 (médicaments)
   baissent aussi la part Sécu (`sources.md`, « Erreurs »).
