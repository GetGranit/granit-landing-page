# Outil A · Codes rejet · cadre pour dev-A

Rédigé le 18/11/2026 par product-designer. À lire avec `../socle.md` (composants, contrat, tests communs),
`../seo.md` § 3, `sources.md` et `questions.md`. Données : `donnees.json` (202 entrées, 112 `sur`).

## 1. La promesse

> Vous tapez le code ou le libellé de votre retour NOEMIE ; vous lisez ce que la caisse reproche, la cause
> probable et quoi corriger, avec le libellé publié par la caisse et sa date.

`outil.mjs` : `id: "codes-rejet"`, `nom: "Codes rejet"`, `titreCarte: "Que veut dire ce code rejet ?"`,
`description: "Le sens d'un code rejet NOEMIE, sa cause probable et quoi corriger, avec le libellé publié par
la caisse et sa date."`, métiers : les 5, `ordre: 1`.

## 2. Le parcours à 375 px

1. **Depuis Google sur un code** (« code rejet 0450054 », « etm non trouvée en bdo ») : la page d'entrée.
   Sans défiler : « ‹ Codes rejet », sur-titre, H1 avec le libellé, la réponse en deux phrases. Un pouce plus
   bas : « L'essentiel » (cause, correction), puis « Le libellé de votre retour fait foi ». La correction pas à
   pas, les sources datées, les codes voisins, la carte Granit en dernier.
2. **Depuis Google sur la liste** (« liste codes rejets noemie ») : le hub. Le champ de recherche est visible
   sans défiler. L'opticien tape « 450054 » : une seule ligne reste, il la touche, il est sur la page du code.
3. **Code sans page** (sûr mais sous le seuil) : la ligne s'ouvre sur place (`<details>`) avec le libellé,
   l'explication, la correction et la source. Pas de page, pas d'impasse.
4. **Code inconnu ou court** (« 153 ») : l'état vide explique pourquoi (§ 6) et renvoie vers la méthode.
5. **Filtre métier** : « Dentaire » garde les 20 codes qui citent le dentaire (13 des 29 codes ne concernent
   qu'un métier ; le filtre sert).

## 3. Le hub `/outils/codes-rejet`

| Élément | Texte |
|---|---|
| `<title>` | Liste des codes rejet NOEMIE : sens, cause et correction (56) |
| Description | La liste des codes rejet NOEMIE de l’Assurance maladie, code par code : libellé exact, cause probable, correction et métiers concernés, avec la source datée. (157) |
| H1 (`titre` + `accent`) | « Codes rejet NOEMIE et télétransmission : » + « la liste, code par code » |
| Chapeau | Tapez le code ou le libellé de votre retour : vous voyez ce que la caisse reproche, la cause probable et quoi corriger. Le libellé de votre retour fait foi. |

Blocs dans l'ordre (gabarit hub du socle, § 7.1) :

1. `FilOutil` : Accueil › Outils › Codes rejet.
2. `EnTeteOutil compact`, sur-titre « Outil gratuit · tiers payant », avec dans `children` :
   `RechercheOutil` (libellé « Code ou libellé du rejet », placeholder « 0450054, bénéficiaire inconnu… »,
   aide « Avec ou sans espaces, avec ou sans le 0 du début. », unité « code / codes ») et `FiltreMetier`.
3. Sommaire d'ancres des familles visibles (« Rejets NOEMIE · ARL négatifs · Messages de service »), seulement
   si plus d'une famille est ouverte.
4. `ListeHub` : un groupe par famille ouverte (`FAMILLES`, § 4). Ligne : `code` (« 0450054 »,
   « Traitement caisse »), `titre` = libellé officiel, `resume` = première phrase de `explication`.
   `cles` = `code` + `autres_ecritures` + forme sur 6 chiffres sans le 0 ; `texte` = libellé + variantes.
   Facette `metier` (table A → socle, `socle.md` § 5). Ligne avec page : lien. Ligne sans page : `<details>`
   avec libellé, explication, cause, action, source principale et sa date.
5. Méthode, 300 à 500 mots, écrite **à partir des seules sources de `sources.md`** : « Comment lire un code
   rejet » (la norme NOEMIE transmet un code et son libellé ; part obligatoire ou complémentaire) ; « Ce qui
   n'est pas un rejet » (Traitement caisse, ARL positif, absence d'ARL après 48 h, d'après ameli.fr) ;
   « Pourquoi le libellé de votre retour fait foi » (deux caisses, deux libellés : l'exemple 0450072) ; « Un
   numéro court n'est pas un code NOEMIE » (« 153 », « 159 »).
6. `BlocSources` : les sources citées par les lignes visibles (par défaut : ameli.fr et les mémos CPAM),
   regroupées « Assurance Maladie et CPAM », « GIE SESAM-Vitale » et « Éditeurs » (ces deux groupes seulement
   si une famille GIE est ouverte).
7. `FaqOutil jsonLd` : Qu'est-ce qu'un code rejet NOEMIE ? · Un rejet veut-il dire que je ne serai pas payé ?
   · « Traitement caisse » : faut-il renvoyer la facture ? · ARL négatif ou rejet : quelle différence ? ·
   Que veut dire un code comme 153 ? Réponses tirées de `donnees.json` et des sources ameli.fr.
8. `ArticlesLies` : `codes-rejets-noemie`, `rejet-beneficiaire-inconnu`, `quand-relancer-mutuelle` ;
   `LienOutil` vers C (« Rejet de la part mutuelle : trouver le portail de la complémentaire »).
9. `CartePont` (§ 7).

```
375 px
‹ Outils
OUTIL GRATUIT · TIERS PAYANT
Codes rejet NOEMIE et
télétransmission : la liste,
code par code
Tapez le code ou le libellé…
Le libellé de votre retour fait foi.
Code ou libellé du rejet
[ 0450054, bénéficiaire…  ][Chercher]
Avec ou sans espaces, avec ou sans le 0.
29 codes
[Tous][Optique et audio][Dentaire]
[Centres de santé][Pharmacie][Cliniques…]
── Rejets NOEMIE ───────────────────
0450054                              ›
ETM NON TROUVEE EN BDO
La facture demande un 100 % que…
────────────────────────────────────
0710060                              ▾   (sans page : se déplie)
…
## Comment lire un code rejet …
```

## 4. Quelles entrées ont une page

`publication.mjs` :

```js
export const FAMILLES = {
  noemie:         { liste: true,  pages: true  },
  arl:            { liste: false, pages: false },   // GIE SESAM-Vitale : décision Paul n° 1
  "sesam-vitale": { liste: false, pages: false },   // idem
};                                                  // amc-tiers-payant et autre : 0 entrée sûre, jamais listées
export const SEUIL_MOTS_PROPRES = SEUIL_DEFAUT;     // 100 dédupliqués ; seo.md : 150 (décision Paul n° 2)
export const PAGES_MAX = 25;
export const PRIORITE = [ /* ci-dessous */ ];
export const LIBELLES_COURTS = { "noemie-0450054": "ETM non trouvée en BDO", /* … */ };  // ≤ 30 car., fidèles
export const ARTICLES = { /* slug → slugs /ressources ; défaut ["codes-rejets-noemie"] */ };
export const OUTILS_LIES = { /* slug → ["remboursement" | "mutuelle-portail"] */ };
```

**Règle exacte** : une entrée a une page si elle est dans `PRIORITE`, de statut `sur`, d'une famille dont
`pages` est vrai, avec `motsPropres ≥ SEUIL_MOTS_PROPRES` et au moins 2 voisins publiés ; les 25 premières
seulement. Une entrée `sur` d'une famille dont `liste` est vrai et sans page : ligne dépliable du hub. Une
entrée `a_verifier` : nulle part (ni liste ni recherche ; elle reste dans `donnees.json` pour data-A).

**`textePropre`** (ce que la page rend comme propre à l'entrée) : `libelle_officiel`, `explication`, `cause`,
`action`, `libelles_variantes[].texte`, `questions_reelles`, `note_verification`. Les phrases présentes dans 3
entrées sûres ou plus (ex. « Si le nouvel essai échoue aussi, ameli.fr conseille de contacter la caisse
concernée. ») ne comptent pas.

**Ordre de publication** (`PRIORITE`, fréquence dans les mémos CPAM, `questions.md`) : noemie-0450056,
0450054, 0250050, 0270051, 0700060, 0460051, 2900005, 0180051, traitement-caisse, 0470049, 0460053, 0650001,
0450072, 0450082, 0730055, 0480054, 0600064, 0600069, 0450097, 2900230, 2600649, 2600650, 2600710, 4000057,
4000055, 4000067, 4000072, 0100052 (préfixe `noemie-`), puis arl-2004, arl-2004-certificat-vitale, arl-2502,
arl-3001, arl-4003, arl-5001, arl-5002 (sans effet tant que la famille est fermée).

**Comptes estimés cette nuit** (le test commun calcule les vrais) :

| Seuil (mots dédupliqués) | Pages NOEMIE publiées | Dont |
|---|---|---|
| 150 (seo.md) | 3 | 0450054 (174), 0450072 (166), 0180051 (161) |
| **100 (proposé)** | **22** | les 28 de `PRIORITE` sauf 0480054 (97), 0600064 (91), 4000055 (80), 4000067 (78), 4000072 (74), 0100052 (54) ; 0450056 (104) et traitement-caisse (100) sont justes au seuil |
| 100, familles GIE ouvertes | 23 | + arl-2004-certificat-vitale (105) ; les autres ARL répètent la consigne de la table (≤ 78) |

Liste du hub par défaut : les **29** codes NOEMIE sûrs. Avec les familles GIE : + 30 ARL + 53 messages de
service = 112. dev-A ne rédige aucun texte pour franchir le seuil : seul data-A enrichit `donnees.json`, avec
des sources.

## 5. La page d'entrée `/outils/codes-rejet/<slug>`

| Élément | Gabarit |
|---|---|
| `<title>` | « Code rejet {code} : {libellé court}, que corriger » ; sinon « Code rejet {code} : {libellé court} ». Traitement caisse : « Traitement caisse NOEMIE : ce n’est pas un rejet » |
| Description | « Code rejet {code} « {libellé} » : ce que la caisse reproche, la cause probable et quoi corriger avant de renvoyer la facture. Source {caisse}, {année}. » ; trop long : retirer « avant de renvoyer la facture », puis remplacer le libellé par le libellé court |
| H1 | « Code rejet {code} : « {libellé officiel} » » |
| Sur-titre | « Code rejet NOEMIE · Assurance Maladie » (ARL : « ARL négatif · SESAM-Vitale ») |

`{libellé court}` vient de `LIBELLES_COURTS` (écrit à la main, fidèle au libellé, 30 caractères au plus ; le
test échoue s'il manque pour une page publiée). `{caisse}` et `{année}` : `source_ids[0]`, la source du
libellé officiel (convention de data-A ; le test vérifie qu'elle est datée de 2016 ou après pour un code NOEMIE).

Blocs dans l'ordre (gabarit d'entrée, socle § 7.2) :

1. `FilOutil` : Accueil › Outils › Codes rejet › {code}.
2. `EnTeteEntree` : sur-titre, H1, réponse = les deux premières phrases de `explication`, pastilles métier
   (les 5 métiers → une seule pastille « Tous les métiers »).
3. `BlocEssentiel` : Libellé officiel · Cause probable (1re phrase de `cause`) · Quoi corriger (1re phrase
   de `action`) · Métiers.
4. `BlocAvertissement fait-foi` : « Le libellé de votre retour fait foi. Celui-ci est celui publié par
   {caisse} ({document} du {date}) ; une autre caisse ou un autre régime (MSA, régimes spéciaux) peut écrire
   autre chose. »
5. `## Le libellé, caisse par caisse` : `TableauOutil` (Caisse ou éditeur · Document et date · Libellé),
   lignes = libellé officiel + `libelles_variantes`. Une seule ligne : une phrase à la place du tableau.
6. `## Aussi écrit` : `autres_ecritures` sur une ligne (utile à la recherche et à Google).
7. `## Causes probables` : `cause` en entier.
8. `## Quoi corriger` : `action` découpée en étapes (`<ol>`, une phrase par étape).
9. `## La question telle qu'on la pose` (si `questions_reelles`) : la question reformulée, le lien d'origine
   de `questions.md`, jamais de nom de personne.
10. `## À savoir sur cette source` : `note_verification`, et « Cité dans les mémos des CPAM pour : {professions_citees_par_les_sources} ».
11. `BlocSources` (sources de l'entrée, avec leurs dates, y compris les anciennes : elles montrent la stabilité du code).
12. `EntreesVoisines` « Codes voisins » : `codes_voisins` publiés, puis codes publiés de la même famille au
    préfixe de 4 chiffres le plus proche, 3 à 6.
13. `ArticlesLies` : `ARTICLES[slug]` (défaut `codes-rejets-noemie`) ; `rejet-beneficiaire-inconnu` pour les
    codes de droits (0250050, 0270051) ; `LienOutil` selon `OUTILS_LIES` (B si la correction porte sur un
    taux, un tarif, un code LPP ou CCAM ; C si elle porte sur l'organisme complémentaire).
14. `CartePont`.

```
375 px
‹ Codes rejet
CODE REJET NOEMIE · ASSURANCE MALADIE
Code rejet 0450054 :
« ETM NON TROUVEE EN BDO »
La facture demande une prise en charge
à 100 % que la caisse ne retrouve pas
dans son fichier des assurés (BDO)…
[Tous les métiers]
┌ L'essentiel ───────────────────────┐
│ Cause probable                     │
│ Exonération saisie à tort ou…      │
│ Quoi corriger                      │
│ Vérifiez les droits du patient…    │
└────────────────────────────────────┘
┃ⓘ Le libellé de votre retour fait foi.
┃  Celui-ci est celui de la CPAM de la
┃  Gironde (mémo du 22/11/2019)…
## Le libellé, caisse par caisse
┌ CPAM de l'Isère · 30/08/2023 ───────┐
│ Exoneration du ticket modérateur…   │
└─────────────────────────────────────┘
## Quoi corriger  1. … 2. … 3. …
## Sources · Vérifié le 18/11/2026
## Codes voisins [0450056][0450072][0450082]
## Pour aller plus loin
┌ Vos équipes soignent. Granit gère le reste. ┐
```

## 6. URL, slug, redirections

- Slug = le `slug` de `donnees.json` : `noemie-0450054`, `noemie-traitement-caisse`, `arl-2502`,
  `arl-2004-certificat-vitale`, `sv-chiffrement-4005`. Écart volontaire avec `seo.md` (`0450-054`) : le
  préfixe de famille évite les collisions (ARL 4005 et message de service 4005, 9999 dans deux tables), il est
  déjà unique et testé dans les données, et il porte le mot « noemie » cherché avec le code.
- `redirections()` en 301 vers le slug : pour chaque entrée sûre d'une famille ouverte, `cleCode` de chaque
  écriture (`0450054`, `0450-054`, `450054`, `0450 054` reçu encodé), et la forme de `seo.md` (`0450-054`).
  Une écriture partagée par deux entrées (4005) n'est pas une redirection : 302 vers `/outils/codes-rejet?q=4005`.
- Entrée connue sans page (sous le seuil, famille fermée, `a_verifier`) : 301 vers le hub, ancre `#slug` si la
  ligne est visible.
- 404 sinon (`PageIntrouvableOutil`, § 7).

## 7. État vide et entrée introuvable

`EtatVide` du hub, selon la requête (`variantes(q)` d'abord : « 450054 » → « 0450054 ») :

| Requête | Message |
|---|---|
| 6 ou 7 chiffres, inconnus | « Ce code n'est pas dans les mémos des caisses que nous avons pu vérifier. Le libellé de votre retour fait foi : lisez-le en entier, il dit ce qui manque. » + suggestions de même préfixe (« 0450… ») |
| 1 à 3 chiffres (« 153 ») | « Un code rejet NOEMIE du régime général s'écrit sur 7 chiffres (0450054). Un numéro court comme 153 est le plus souvent un code tronqué ou propre à votre logiciel : cherchez plutôt un mot du libellé. » |
| 4 chiffres, familles GIE fermées | « Un code à 4 chiffres est souvent un accusé de réception logique (ARL) négatif ou un message de service SESAM-Vitale. Ils ne sont pas encore dans cette liste : votre logiciel en donne le libellé. » + lien `codes-rejets-noemie` |
| Commence par une lettre (« R5003 ») | « Un code qui commence par une lettre vient en général d'un organisme concentrateur ou d'une complémentaire : sa nomenclature fait foi. Pour la part mutuelle, cherchez le portail de la complémentaire. » + `LienOutil` C |
| Texte sans résultat | « Aucun libellé ne contient « {q} ». Essayez un seul mot du libellé (« exonération », « bénéficiaire ») ou le code. » |

Toujours dessous : « Rejet de la part mutuelle ? Le motif vient de la complémentaire ou de sa plateforme »
(lien C), lien vers `codes-rejets-noemie` (méthode), « Effacer la recherche », lien « Signaler un code
manquant » (`mailto:contact@getgranit.ai?subject=Code%20rejet%20manquant`).

`PageIntrouvableOutil` (404, noindex) : H1 « {code} : introuvable », le message de la ligne correspondante du
tableau ci-dessus, la recherche préremplie avec le code tiré du slug (`noemie-0999999` → « 0999999 »).

## 8. Le pont vers Granit

`CartePont` en dernier bloc du hub et de chaque entrée (jamais au-dessus de la réponse). `texte` :
« Des agents font l'administratif de vos équipes dans les logiciels qu'elles utilisent déjà. Les rejets, ils
les repèrent avant l'envoi et les traitent. » (formulations permises par `TON.md` : « dans vos logiciels »,
« on les repère avant l'envoi et on les traite »). Cible du bouton : la page du métier si l'entrée n'en
concerne qu'un (0450097 → `/metiers/dentaire`) ou si le filtre du hub est posé, sinon `/metiers`. Lien
« Demander une démo » : Cal.com, `utm_campaign=outil-codes-rejet`, `utm_content=outil-entree`, `utm_term={slug}`.

## 9. Mesure (PostHog)

Événements du socle seulement (`socle.md` § 9.2), `outil: "codes-rejet"`. Ce qu'on regarde chaque semaine :

- **Requêtes sans résultat** (`lm_recherche`, `nb_resultats = 0`, regroupées par `q`) : la liste des codes à
  sourcer en priorité pour data-A. C'est le premier usage du suivi.
- Part des recherches par code (`exact`) et par mot ; codes les plus cherchés qui n'ont pas de page → `PRIORITE`.
- `lm_entree_vue` par `depuis` : `externe` = arrivées depuis Google par code, à rapprocher des impressions
  Search Console des URL `/outils/codes-rejet/` (revue hebdo).
- `lm_resultat_clic` et son `rang` ; `lm_entree_vue mode=ligne` (codes sans page qu'on ouvre : candidats à une page).
- `lm_voisin_clic` (le maillage sert-il ?), `lm_source_clic` (on vérifie la source ?).
- `lm_pont_vu` → `lm_pont_clic` par `cible`.

## 10. Tests propres à A (`tests/outils/codes-rejet.test.ts`)

- Chaque écriture de `autres_ecritures` d'une entrée publiée redirige vers elle ; la forme à 6 chiffres
  redirige vers le code à 7 chiffres ; aucune écriture n'est une redirection vers deux entrées.
- Une famille fermée n'a ni ligne dans `chargerHub`, ni page, ni redirection vers une page.
- `LIBELLES_COURTS` : présent et de 30 caractères au plus pour chaque page publiée.
- `source_ids[0]` d'un code NOEMIE publié est daté de 2016 ou après.
- Aucune entrée `a_verifier` dans les lignes du hub.

## 11. Les 3 décisions de Paul

1. **ARL et messages de service (GIE SESAM-Vitale).** Le cahier des charges demande l'accord du GIE pour toute
   reproduction, même partielle. Par défaut : familles `arl` et `sesam-vitale` **fermées** (ni liste, ni page).
   (a) Demander l'accord du GIE et tout ouvrir (+ 83 lignes, 1 page de plus) ; (b) ouvrir la liste seulement,
   au titre de la courte citation, sans page ; (c) garder fermé. Une ligne par famille dans `publication.mjs`.
2. **Seuil et vague 1.** Proposé : 100 mots propres dédupliqués, soit **22 pages NOEMIE** et un hub de 29
   codes. Avec les 150 mots de `seo.md` comptés de la même façon : 3 pages. Régler `SEUIL_DEFAUT` (socle) ou
   `SEUIL_MOTS_PROPRES` (A) ; la liste suit seule.
3. **Partage avec l'article `codes-rejets-noemie`.** Le hub prend « liste codes rejets noemie » ; une fois le
   hub indexé, retitrer l'article « Rejet NOEMIE : lire le retour, corriger, renvoyer la facture »
   (`primaryKeyword` « rejet noemie », URL inchangée), retirer « cette page ne reproduit aucun code » et
   ajouter le lien vers la liste et un bloc des 10 codes les plus fréquents. Hors de la PR A (contenu du moteur
   SEO) : à faire par qui, et quand ?
