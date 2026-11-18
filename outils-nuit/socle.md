# Socle commun des trois outils (A codes rejet, B remboursement, C mutuelle → portail)

Rédigé le 18/11/2026 par product-designer (équipe de nuit). À coder **une seule fois**, dans un commit
« Outils : socle commun » posé sous les trois branches d'outil. Dépôt cible : `granit-landing-page` (public).
À lire avec `seo.md` (stratégie de requêtes) et `A|B|C/cadre.md` (chaque outil).

## 0. En bref

1. **Le socle seul ne change rien au site** : sans dossier d'outil, ni `/outils`, ni lien de pied de page, ni
   URL nouvelle dans le sitemap. Les deux outils de campagne (`tri-des-marques`, `heures-de-decembre`) gardent
   leur rendu, leur `head` en noindex et leurs événements.
2. **Un outil = un dossier** `src/lib/outils/<id>/` avec trois fichiers au contrat fixe (`outil.mjs`,
   `publication.mjs`, `pages.mjs`). Le socle les **découvre** : sitemap, `llms.txt`, page `/outils`, pied de
   page et tests communs les trouvent seuls. Aucune PR d'outil ne touche un fichier du socle (§ 1).
3. **Une page par entrée seulement si elle passe le seuil** (§ 4) : statut `sur`, sources datées, assez de
   texte propre, deux voisins publiés. Sinon l'entrée reste une ligne du hub, lisible en entier dans le HTML.
4. **Le hub porte la liste complète dans le HTML serveur** ; la recherche et les filtres ne font que masquer
   des lignes (attribut `hidden`), comme `src/components/ressources/Annuaire.tsx`. Sans JavaScript, le
   formulaire `GET ?q=` filtre côté serveur.
5. **Pas de formulaire, pas de mur** : la réponse d'abord ; la carte Granit (« pont ») ferme la page, jamais
   avant la réponse. Les nouveaux outils sont **indexables** : on ne recopie pas le `head` des outils de campagne.

Identifiants fixés ici, à ne pas changer : `codes-rejet` (A), `remboursement` (B), `mutuelle-portail` (C).
URL : `/outils`, `/outils/<id>`, `/outils/<id>/<slug>`. Paramètre de route : `$slug` pour les trois.

## 1. Les fichiers du socle (personne d'autre n'y touche)

| Fichier | Nouveau / modifié | Rôle |
|---|---|---|
| `src/lib/outils/socle/types.ts` | nouveau | Types partagés (§ 2.4) |
| `src/lib/outils/socle/metiers.mjs` + `.d.mts` | nouveau | Les 5 métiers et leurs libellés (§ 5) |
| `src/lib/outils/socle/mots.mjs` + `.d.mts` | nouveau | Comptage des mots propres, seuil (§ 4) |
| `src/lib/outils/socle/texte.mjs` + `.d.mts` | nouveau | `normaliser`, `cleCode`, `slugifier`, `formaterDate`, `fauteTypo` |
| `src/lib/outils/socle/recherche.ts` | nouveau | `filtrerLignes`, `nettoyerRequete`, `suggestions` |
| `src/lib/outils/socle/seo.ts` | nouveau | `headOutil`, `webPageLd`, `collectionPageLd`, `filLd` |
| `src/lib/outils/socle/pont.ts` | nouveau | `lienDemoOutil`, `cibleMetier` |
| `src/lib/outils/socle/suivi.ts` | nouveau | Noms d'événements, `useVuUneFois`, `marquerDepuis` / `lireDepuis` |
| `src/lib/outils/socle/outils.ts` | nouveau | `outilsDisponibles()`, `outilDisponible(id)` (glob des `outil.mjs`) |
| `src/lib/outils/socle/site.ts` | nouveau | `contexteSite()` : articles en ligne, pour `pages.mjs` côté serveur (§ 2.3) |
| `src/components/outils/socle/*.tsx` | nouveau | Les composants du § 6 |
| `src/components/outils/OutilShared.tsx` | **modifié** | Type `Outil`, `useSuiviOutil`, `EnTeteOutil` (§ 6.1, § 9) |
| `src/lib/calcom.ts` | **modifié** | `calcomDemoUrl(emplacement, article?, campagne = "blog")` : 3e paramètre, défaut inchangé |
| `src/components/Footer.tsx` | **modifié** | Lien « Outils gratuits » vers `/outils`, seulement si `outilsDisponibles().length > 0` |
| `src/routes/outils.index.tsx` | nouveau | Page `/outils` (§ 7.3) ; `notFound()` si aucun outil |
| `scripts/outils/decouvrir.mjs` + `.d.mts` | nouveau | Découverte et contrôle des outils (§ 3) |
| `scripts/gen-sitemap.mjs`, `scripts/gen-llms.mjs` | **modifiés** | Appellent `decouvrirOutils()` (§ 3) |
| `tests/outils/socle.ts` | nouveau | Le helper de tests (§ 10) ; pas `.test.ts`, sinon `npm test` le lance seul |
| `tests/outils/socle.test.ts` | nouveau | Tests du socle + tests communs de chaque outil découvert |

Règles : une PR d'outil n'ajoute que des fichiers **dans son périmètre** (§ 2.1) et `src/routeTree.gen.ts`
régénéré. Elle ne commite ni `public/sitemap.xml` ni `public/llms.txt` (le build de déploiement les refait ;
`git checkout public/sitemap.xml public/llms.txt` avant de commiter). Un manque dans le socle se corrige par un
commit de socle à part, rebasé sous les trois branches, jamais dans une PR d'outil.

## 2. Le contrat d'un outil

### 2.1 Périmètre d'une PR d'outil

```
src/lib/outils/<id>/outil.mjs + outil.d.mts         descripteur (§ 2.2), importable partout
src/lib/outils/<id>/publication.mjs                 constantes que Paul règle (vague, familles, métiers, seuil)
src/lib/outils/<id>/pages.mjs + pages.d.mts         contrat de découverte (§ 2.3), Node et serveur seulement
src/lib/outils/<id>/donnees.json                    copie de nuit/outils-nuit/<X>/donnees.json
src/lib/outils/<id>/serveur.ts                      createServerFn : seul fichier de l'app qui lit donnees.json
src/lib/outils/<id>/*.ts|*.mjs                      le reste, libre
src/routes/outils.<id>.index.tsx                    le hub
src/routes/outils.<id>.$slug.tsx                    les entrées
src/components/outils/<id>/*.tsx                    composants propres à l'outil
tests/outils/<id>.test.ts                           tests propres à l'outil
```

`donnees.json` et `pages.mjs` ne sont **jamais** importés par une route ou un composant : seulement par
`serveur.ts` (handlers de `createServerFn`, retirés du bundle client) et par les scripts Node. Un test du socle
le vérifie (§ 10.3). Contrôle manuel après `npm run build` : `grep -rl note_verification dist/client` ne
renvoie rien.

### 2.2 `outil.mjs` (descripteur, sans donnée)

```js
/** @type {import("../socle/types").OutilDescripteur} */
export const OUTIL = {
  id: "codes-rejet",                       // = nom du dossier
  chemin: "/outils/codes-rejet",           // = `/outils/${id}`
  nom: "Codes rejet",                      // fil d'Ariane, cartes, llms.txt
  titreCarte: "Que veut dire ce code rejet ?",   // carte de /outils (avec espace insécable avant « ? »)
  description: "…",                         // une phrase, 160 caractères au plus (carte /outils, llms.txt)
  metiers: ["optique", "dentaire", "centres", "pharmacie", "cliniques"],
  ordre: 1,                                 // A = 1, C = 2, B = 3 (ordre de /outils)
};
```

### 2.3 `pages.mjs` (contrat de découverte)

ESM pur, lisible par Node 22 sans option (`import d from "./donnees.json" with { type: "json" }`), sans
import de `.ts`, sans `import.meta.glob`. Il importe `publication.mjs`, `donnees.json` et `../socle/*.mjs`.

```js
export function pages(options)             // PageOutil[] : le hub en premier, puis les entrées publiées
export function audit(options)             // AuditPage[] : une ligne par entrée publiée (§ 10)
export function redirections(options)      // { [slugReçu]: cheminCible } : alias en 301 (§ 8.3)
```

`options.site` (obligatoire) : ce que l'outil doit savoir du reste du site, sans lire le disque (le même
`pages.mjs` tourne dans le worker Cloudflare, où `node:fs` n'existe pas). Côté Node, `decouvrirOutils` le
construit depuis `scripts/ressources/en-ligne.mjs` (`articlesEnLigne` + `anciensSlugsFr`) ; côté app,
`contexteSite()` (`src/lib/outils/socle/site.ts`, serveur seulement) le construit depuis `virtual:ressources` et
`src/lib/articles.ts`. C s'en sert pour savoir quelles mutuelles ont déjà une fiche `/ressources/portail-<x>`,
A et B pour ne lier que des articles en ligne.

`options.candidates === true` : toutes les entrées qui **pourraient** avoir une page (statut `sur`, seuil
passé), en ignorant la vague, les familles et les métiers fermés de `publication.mjs`. Sert aux tests : si Paul
ouvre une famille d'une ligne, rien ne casse.

La **même** fonction décide de la publication pour le sitemap, les routes (via `serveur.ts`) et les tests :
une entrée est en ligne si et seulement si elle est dans `pages()`.

### 2.4 Types (`src/lib/outils/socle/types.ts`)

```ts
export type OutilId = "codes-rejet" | "remboursement" | "mutuelle-portail";
export type MetierOutil = "optique" | "dentaire" | "centres" | "pharmacie" | "cliniques";

export type OutilDescripteur = {
  id: OutilId; chemin: string; nom: string; titreCarte: string; description: string;
  metiers: MetierOutil[]; ordre: number;
};

export type PageOutil = {
  type: "hub" | "entree";
  chemin: string;          // sans barre finale ; entrée : `${OUTIL.chemin}/${slug}`
  slug?: string;           // entrées seulement
  titre: string;           // <title>, 60 caractères au plus, unique
  description: string;     // meta description, 140 à 160 caractères, unique
  h1: string;
  lastmod: string;         // AAAA-MM-JJ : date de vérification de l'entrée (hub : la plus récente)
  priorite?: string;       // défaut "0.8" hub, "0.6" entrée
  frequence?: "weekly" | "monthly";   // défaut weekly hub, monthly entrée
};

export type SourceDonnee = {
  id: string; titre: string; url: string; editeur: string;
  date_source: string;     // ISO ou texte (« non datée », « état au 2026-11-18 »)
  consulte_le: string;     // ISO
};

export type AuditPage = {
  chemin: string;
  entrees: { id: string; statut: "sur" | "a_verifier"; source_ids: string[] }[];  // ce que la page affiche comme acquis
  sources: SourceDonnee[];  // sources résolues de ces entrées
  textePropre: string;      // le texte propre à l'entrée tel qu'il est rendu (§ 4)
  voisins: string[];        // chemins du bloc « voisins » (pages de l'outil ou /ressources/…)
  articles: string[];       // slugs /ressources du bloc « articles liés »
};

export type ContexteSite = { articles: ReadonlySet<string> };   // slugs /ressources en ligne (JSON et anciens)
export type OptionsPages = { site: ContexteSite; candidates?: boolean };
```

`lastmod` et « Vérifié le » = `entree.verifie_le` si le champ existe, sinon `donnees.genere_le`. Les scripts de
données ne doivent changer `verifie_le` que si le contenu affiché change (un `lastmod` qui bouge sans raison
fait perdre la confiance de Google).

### 2.5 `publication.mjs` (ce que Paul règle d'une ligne)

Chaque outil y met, en commentaire, la décision attendue et son effet chiffré. Forme commune :

```js
export const SEUIL_MOTS_PROPRES = SEUIL_DEFAUT;   // importé de ../socle/mots.mjs ; surchargeable
export const PAGES_MAX = 25;                      // taille de la vague publiée
export const PRIORITE = ["…slug", "…"];           // ordre de publication ; hors de cette liste, jamais de page
// + les constantes propres à l'outil (familles, métiers ouverts…), voir cadre.md
```

Entrées publiées = `PRIORITE` filtrée (statut `sur`, famille ou métier ouvert, seuil passé, voisins) puis
coupée à `PAGES_MAX`. Une vague 2 = allonger `PRIORITE` ou relever `PAGES_MAX`.

### 2.6 `serveur.ts` et routes

```ts
export const chargerHub = createServerFn({ method: "GET" }).handler(async () => ({ lignes, groupes, sources, verifieLe }));
export const chargerEntree = createServerFn({ method: "GET" })
  .inputValidator((d: { slug: string }) => d)
  .handler(async ({ data }) => /* { type: "page", … } | { type: "redirection", vers } | { type: "introuvable" } */);
```

Les deux handlers appellent `pages({ site: contexteSite() })`, `audit(…)` et `redirections(…)` : la décision
de publication est celle du sitemap. Route d'entrée : le `loader` appelle `chargerEntree` ; `redirection` → `throw redirect({ href: vers, statusCode: 301 })`,
`introuvable` → `throw notFound()` (`notFoundComponent` = `PageIntrouvableOutil`). Hub : `validateSearch`
accepte `q` (chaîne) et `metier` (`MetierOutil`), le loader n'en dépend pas (pas de `loaderDeps`) ; le filtre
est appliqué au rendu, côté serveur comme côté client.

## 3. Découverte (sitemap, llms.txt, /outils)

`scripts/outils/decouvrir.mjs` :

```js
export async function decouvrirOutils(racine)   // [{ id, outil: OUTIL, pages: PageOutil[], redirections }]
```

- Parcourt les sous-dossiers de `src/lib/outils/` qui contiennent **à la fois** `outil.mjs` et `pages.mjs`
  (`socle/` n'en a pas ; les fichiers `calculs.ts`, `mailOutils.ts` à la racine sont ignorés).
- Importe chacun (`pathToFileURL`), trie par `OUTIL.ordre`, appelle `pages({ site })` et
  `redirections({ site })` avec le contexte construit une fois depuis `scripts/ressources/en-ligne.mjs`.
- **Arrête le build** (exception, message en français) si : `OUTIL.id` ≠ nom du dossier ; `chemin` ≠
  `/outils/<id>` ; `pages()[0]` n'est pas le hub au chemin de l'outil ; un chemin sort de `/outils/<id>` ou
  finit par `/` ; un chemin apparaît deux fois (dans un outil ou entre deux outils) ; un `lastmod` n'est pas
  `AAAA-MM-JJ`.

`gen-sitemap.mjs` (modifié une fois) : ajoute `/outils` (si au moins un outil ; `lastmod` = le plus récent des
hubs, weekly, 0.8) puis `pages()` de chaque outil (valeurs par défaut du § 2.4). Le `console.log` final compte
« N outils ». `gen-llms.mjs` : une section « Outils gratuits » après « Pages principales » : la ligne `/outils`,
puis pour chaque outil `- [nom](hub): description`, puis ses entrées `- [titre](chemin): description`, filtrées
par `publie(path)` comme le reste. Rien d'autre ne change dans ces scripts ; les PR d'outil n'y touchent pas.

Côté app, `src/lib/outils/socle/outils.ts` : `import.meta.glob("/src/lib/outils/*/outil.mjs", { eager: true,
import: "OUTIL" })`. Sert à `/outils`, au pied de page et aux liens entre outils (`LienOutil` n'affiche rien si
l'outil visé n'est pas fusionné).

IndexNow : rien à faire dans le socle ; le workflow `seo-indexnow.yml` suit le sitemap.

## 4. Seuil de contenu (`src/lib/outils/socle/mots.mjs`)

```js
export const SEUIL_DEFAUT = 100;   // mots propres dédupliqués ; voir la note ci-dessous
export const MIN_VOISINS = 2;
export function compterMots(texte)                       // /[\p{L}\p{N}]+(?:[’'-][\p{L}\p{N}]+)*/gu
export function decouperPhrases(texte)                   // /(?<=[.!?…])\s+/, phrases vides retirées
export function phrasesGabarit(textes, repetition = 3)   // Set des phrases (normalisées) présentes dans ≥ 3 textes
export function motsPropres(texte, gabarit)              // mots des phrases hors gabarit, chaque phrase comptée une fois
```

La règle, identique pour les trois outils :

1. `textePropre` d'une entrée = ses champs propres **tels qu'ils sont rendus** (liste exacte dans chaque
   `cadre.md`), sans les intertitres, les liens, les blocs communs ni la carte Granit.
2. Une phrase qui revient dans **3 entrées candidates ou plus** du même outil est du gabarit : elle ne compte pas.
   La population est l'ensemble des entrées `sur` candidates (pas seulement la vague), pour que le compte d'une
   entrée ne dépende pas de la vague.
3. Une page existe si `motsPropres ≥ SEUIL_MOTS_PROPRES` **et** statut `sur` **et** au moins une source datée
   **et** au moins `MIN_VOISINS` voisins publiés (pages de l'outil ou articles `/ressources` en ligne).

**Note pour Paul (décision commune).** `seo.md` fixe 150 mots propres, sans dire comment on les compte. Compté
sans les phrases répétées, 150 ne laisse que 3 codes A et presque aucune mutuelle C ; compté champ par champ,
sans déduplication, 150 donne 18 codes A, soit à peu près ce que donne 100 mots dédupliqués (22 codes publiés,
voir `A/cadre.md`). Le socle met **100 mots dédupliqués** par défaut ; remettre 150 se fait d'une ligne
(`SEUIL_DEFAUT`) ou par outil (`SEUIL_MOTS_PROPRES`). Les comptes de chaque `cadre.md` sont des estimations de
la nuit ; le test calcule les vrais.

## 5. Métiers (`src/lib/outils/socle/metiers.mjs`)

Les 5 métiers du site (`src/lib/ressources/verticales.json`), dans cet ordre :

| `MetierOutil` | `nom` (verticales.json) | `court` (pastille, filtre) | Page métier | Rubrique |
|---|---|---|---|---|
| `optique` | Opticiens et audioprothésistes | Optique et audio | `/metiers/opticiens` | `/ressources/metier/optique` |
| `dentaire` | Centres dentaires | Dentaire | `/metiers/dentaire` | `/ressources/metier/dentaire` |
| `centres` | Centres de santé et ophtalmologie | Centres de santé | `/metiers/centres-sante` | `/ressources/metier/centres` |
| `pharmacie` | Pharmacies | Pharmacie | `/metiers/pharmacie` | `/ressources/metier/pharmacie` |
| `cliniques` | Cliniques et laboratoires | Cliniques et labos | `/metiers/cliniques-laboratoires` | `/ressources/metier/cliniques` |

`export const METIERS_OUTILS` (tableau ordonné) et `export function versMetiers(cles, table)` : chaque outil
déclare sa table dans son `pages.mjs` (A : `optique-audio → optique`, `centre-de-sante → centres`,
`clinique-laboratoire → cliniques` ; C : `optique` et `audio → optique`, `laboratoire` et `hospitalisation →
cliniques` ; B : `optique` et `audio → optique`). Une clé inconnue fait échouer le test.

## 6. Composants (`src/components/outils/socle/`)

Règles pour tous : jetons de `DESIGN.md` seulement (check-marque strict), Geist pour le texte, Source Serif 4
(`opsz` 20) pour les titres, **pas de police à chasse fixe** (les codes en Geist `num-tabular`), gouttière 16 px
(`px-4`), texte à 65 caractères au plus (`max-w-[680px]` pour le corps d'une entrée), cibles tactiles de 44 px,
**aucun défilement horizontal à 375 px** (les longues chaînes en `break-words`, jamais d'URL brute affichée),
typographie française (espaces insécables avant `: ; ? !` et dans « »). Tous les textes fixes sont en français
seulement (pas de copie `en`). Tout le contenu est rendu par le serveur ; JavaScript n'ajoute que le filtre,
le calcul (B) et le suivi.

### 6.1 `EnTeteOutil` (modifié, dans `OutilShared.tsx`)

```ts
{ titre: string; accent: string; chapeau: string;
  surTitre?: string;          // défaut "Outil gratuit pour les opticiens" : les deux outils existants ne changent pas
  compact?: boolean;          // H1 clamp(30px, 4.4vw, 52px), py-10 md:py-14 ; pour les hubs
  children?: ReactNode }      // rendu sous le chapeau : la recherche du hub
```

Rôle : en-tête des hubs (dégradé de marque en grand fond, seul usage permis du dégradé). Sur-titre des trois
outils : « Outil gratuit · tiers payant ». À 375 px, compact : barre (64) + en-tête jusqu'au champ de recherche
≈ 450 px, le champ est visible sans défiler sur un écran de 667 px.

### 6.2 `FilOutil`

```ts
{ items: { nom: string; chemin?: string }[] }   // après « Accueil › Outils » ; le dernier sans chemin
```

Réutilise `src/components/ressources/Fil.tsx` (à 375 px : seulement « ‹ niveau parent » ; dès 768 px : le fil
complet) et pose le `BreadcrumbList` JSON-LD avec `breadcrumbLd` de `src/lib/ressources/seo.ts` (Accueil ›
Outils › {nom de l'outil} › {entrée}).

### 6.3 `RechercheOutil`

```ts
{ action: string;                 // chemin du hub (formulaire GET, marche sans JS)
  q: string; onChange: (q: string) => void;
  libelle: string;                // label visible au-dessus du champ, ex. « Code ou libellé du rejet »
  placeholder: string;            // ex. « 0450054, ETM non trouvée… »
  aide?: string;                  // une ligne sous le champ, ex. « Avec ou sans espaces, avec ou sans le 0 du début. »
  inputMode?: "text" | "search";
  total: number; visibles: number; unite: [string, string];   // « 29 codes », « 3 sur 29 »
  onSoumettre?: () => void }      // JS : fait défiler jusqu'aux résultats
```

`<form role="search" method="get" action>` ; `<input type="search" name="q" autoComplete="off"
enterKeyHint="search" spellCheck={false}>` de 48 px de haut, bouton « Chercher » (`btn-primary`, 48 px) à
droite ; à 375 px le champ prend `flex-1`, le bouton 104 px. Compteur `aria-live="polite"` sous le champ.
Avec JS, chaque frappe filtre aussitôt ; l'URL suit par `window.history.replaceState` (pas `navigate`, qui
relancerait le loader), 300 ms après la dernière frappe.

### 6.4 `FiltreFacette` (et `FiltreMetier`)

```ts
{ id: string; libelle: string;
  options: { valeur: string; libelle: string; compte?: number }[];
  valeur: string | null; onChange: (v: string | null) => void;
  hrefPour: (v: string | null) => string }    // lien de repli sans JS : `?metier=dentaire`
```

Rôle : filtre à pastilles (« Tous » + options). Jusqu'à 6 options : pastilles (`<a>` + `aria-pressed`, clic
intercepté en JS) qui passent à la ligne à 375 px ; au-delà : `<select>`. `FiltreMetier` = `FiltreFacette`
préréglé avec `METIERS_OUTILS` (libellés `court`), options sans ligne masquées.

### 6.5 `ListeHub<L extends LigneHub>`

```ts
type LigneHub = {
  id: string;                     // slug ; ancre `#id` sur la ligne
  code?: string;                  // affiché en num-tabular
  titre: string; resume?: string;
  groupe: string;                 // id d'un GroupeHub
  facettes: Record<string, string[]>;   // { metier: ["optique", …], classe: ["a"] … }
  chemin?: string;                // page publiée (ou fiche /ressources) : la ligne est un lien
  cles: string[];                 // formes exactes cherchables, passées par cleCode (codes, autres écritures, n° AMC)
  texte: string;                  // texte cherchable, passé par normaliser (libellé, autres noms…)
};
props: { lignes: L[]; groupes: GroupeHub[]; q: string; filtres: Record<string, string | null>;
         rendreDetails?: (l: L) => ReactNode;      // contenu d'une ligne sans page (<details>)
         replier?: boolean;                         // B : sans recherche ni filtre, chaque groupe est un <details> fermé
         vide: (q: string) => ReactNode;            // EtatVide de l'outil
         suivre: Suivre }
type GroupeHub = { id: string; titre: string; intro?: string; chemin?: string; resume?: string };  // chemin : page du groupe (B)
```

Rendu : une `<section aria-labelledby>` par groupe (`<h2 id={groupe.id}>`, sommaire d'ancres au-dessus de la
liste quand il y a 2 groupes ou plus), une `<ul>` de lignes. Avec `replier`, sans recherche ni filtre, le
groupe s'affiche fermé (titre, `resume`, nombre de lignes, lien vers `chemin`) et s'ouvre au toucher ; dès
qu'une recherche ou un filtre est posé, les groupes qui gardent des lignes s'ouvrent. Toutes les lignes sont
dans le HTML dans tous les cas ; une ligne filtrée reçoit `hidden`, un groupe sans ligne visible aussi. Ligne avec `chemin` : bloc lien entier (code,
titre, résumé, « › ») ; ligne sans `chemin` : `<details>` dont le `<summary>` montre code et titre et dont le
corps vient de `rendreDetails` (rendu serveur, donc indexé avec le hub). À 375 px : une ligne = un bloc empilé
(code 14 px en sur-titre, titre 16 px sur 2 lignes au plus, résumé 14 px secondaire), filet entre les lignes,
48 px de haut au moins. Dès 768 px : grille code | titre | résumé | ›.

Filtre (`src/lib/outils/socle/recherche.ts`, fonction pure, la même côté serveur et client) :
`filtrerLignes(lignes, q, filtres)` garde une ligne si les filtres de facette correspondent **et** si
`q` vide, ou `cleCode(q)` égale ou préfixe une de ses `cles`, ou chaque mot de `normaliser(q)` est dans `texte`.
Un outil peut fournir `variantes(q): string[]` (A : « 450054 » → « 0450054 »). Ordre : celui du HTML ; une
correspondance exacte de code est en plus signalée (`exact: true`) pour le suivi.

### 6.6 `EtatVide`

```ts
{ q: string; message: ReactNode;                  // propre à l'outil (cadre.md), cas par cas
  suggestions?: { chemin?: string; ancre?: string; code?: string; titre: string }[];  // 3 au plus
  conseils?: ReactNode; liens?: { nom: string; chemin: string }[];
  onEffacer: () => void }
```

Encadré papier sous le compteur : « Aucun résultat pour « {q} » », le message de l'outil, jusqu'à 3
suggestions (`suggestions(lignes, q)` : même préfixe de code, puis distance d'édition ≤ 2 sur `cles`), un
bouton « Effacer la recherche ». Jamais de formulaire. Un lien `mailto:contact@getgranit.ai?subject=…`
« Signaler un code manquant » est permis (pas un champ, pas une obligation).

### 6.7 Gabarit d'entrée : `GabaritEntree`, `EnTeteEntree`, `BlocEssentiel`

```ts
GabaritEntree { fil: FilOutil["items"]; entete: EnTeteEntreeProps; essentiel: LigneEssentiel[];
                avertissement: ReactNode; children: ReactNode;        // sections propres à l'outil
                sources: SourceDonnee[]; verifieLe: string;
                voisins: VoisinProps; articles: string[]; outilsLies?: LienOutilProps[];
                pont: CartePontProps; jsonLd: object[] }
EnTeteEntree { surTitre: string; h1: string; reponse: string[];      // 2 phrases, la réponse
               metiers?: MetierOutil[] }                              // pastilles
BlocEssentiel { titre?: string = "L'essentiel"; lignes: { libelle: string; valeur: ReactNode }[] }  // 3 à 5
```

`EnTeteEntree` : fond rosé (pas de dégradé), sur-titre 12 px capitales, H1 Source Serif 300 en
`clamp(28px, 3.6vw, 44px)`, `text-wrap: balance`, la réponse en 17 px juste dessous : à 375 px, la réponse est
lue sans défiler. `BlocEssentiel` : carte papier, `<dl>` ; à 375 px libellé au-dessus de la valeur, dès 768 px
sur deux colonnes (180 px | reste). L'ordre des blocs est fixé au § 7.2.

### 6.8 `BlocAvertissement`

```ts
{ variante?: "fait-foi" | "a-venir"; titre?: string; children: ReactNode; sourceIds?: string[] }
```

Carte papier, filet à gauche de 3 px en `--profond`, icône `Info` (lucide-react) 18 px, texte 15 px. Pas de
rouge : c'est une information (`DESIGN.md`). `fait-foi` : la phrase obligatoire de chaque outil (cadre.md),
placée juste sous « L'essentiel ». `a-venir` : un changement daté et sourcé (B, 01/01/2027), avec la date en
sur-titre et le lien vers la source.

### 6.9 `BlocSources`

```ts
{ sources: SourceDonnee[]; verifieLe: string; relecteur?: string; titre?: string = "Sources" }
```

`<h2>`, liste ordonnée : éditeur, titre en lien (`target="_blank" rel="noopener"`, suivi `lm_source_clic`),
puis « document du {date_source} · consulté le {consulte_le} » (`formaterDate` : ISO → 22/11/2019, sinon le
texte tel quel). Dernière ligne : « Vérifié le {verifieLe} » et, si `RELECTEUR_OUTILS` (constante du socle,
`null` cette nuit, Paul la renseigne) existe, « par {nom}, {fonction} ». À 375 px : une source par bloc, le
titre passe à la ligne.

### 6.10 `EntreesVoisines`

```ts
{ titre: string;                      // « Codes voisins », « Mutuelles du même opérateur »…
  de: string;                         // slug de la page
  entrees: { chemin: string; code?: string; titre: string; resume?: string }[];   // 3 à 6
  suivre: Suivre }
```

Liste de liens en cartes (une par ligne à 375 px, deux colonnes dès 768 px). Clic : `marquerDepuis("voisin")`
puis `lm_voisin_clic`. Règle de choix (dans chaque outil) : voisins déclarés et publiés d'abord, puis
complétés par des pages publiées du même groupe, jusqu'à 6.

### 6.11 `ArticlesLies` et `LienOutil`

```ts
ArticlesLies { slugs: string[]; titre?: string = "Pour aller plus loin"; outils?: LienOutilProps[] }
LienOutil    { id: OutilId; texte: string; ancre?: string }   // vers le hub de l'autre outil, jamais vers ?q=
```

`ArticlesLies` lit titre et description des articles en ligne (`ficheJson` de `src/lib/ressources/contenu.ts`) ;
un slug absent ou hors ligne n'est pas rendu (et fait échouer le test commun). 1 à 3 articles, plus au plus 2
liens vers les autres outils. `LienOutil` ne rend rien si l'outil n'est pas fusionné (`outilDisponible`).

### 6.12 `CartePont`

```ts
{ outil: OutilId; page: "hub" | "entree"; slug?: string;
  texte: string;                         // la phrase de l'outil (cadre.md)
  metiers?: MetierOutil[];               // un seul métier → page de ce métier ; sinon /metiers
  suivre: Suivre }
```

La seule place de Granit sur la page : **le dernier bloc**, après voisins et articles, jamais avant la réponse,
jamais collante, sans formulaire ni animation. Carte papier, filet, rayon 14 px, padding 24 px (20 à 375 px).
Contenu fixe : titre Source Serif 400 22 px « Vos équipes soignent. **Granit gère le reste.** » (seconde
moitié en `--profond`, `TON.md`) ; `texte` de l'outil en 15 px ; bouton secondaire « Voir ce que font les
agents » vers `cibleMetier(metiers)` ; lien texte « Demander une démo » vers
`lienDemoOutil(outil, page, slug)` = `calcomDemoUrl(\`outil-${page}\`, slug, \`outil-${outil}\`)`. À 375 px,
bouton et lien empilés, pleine largeur pour le bouton. Suivi : `lm_pont_vu` (à moitié dans l'écran, une fois),
`lm_pont_clic` (`cible: "metier" | "demo"`).

### 6.13 `FaqOutil`

```ts
{ items: { question: string; reponse: string }[]; jsonLd?: boolean = false }
```

`<h2>Questions fréquentes</h2>` puis un `<details>` par question (résumé 16 px, 48 px de haut). `jsonLd`
ajoute `faqPageLd` (de `src/lib/seo.ts`) : sur les **hubs seulement** (`seo.md` § 2.4 : plus de résultat
enrichi FAQ depuis mai 2026, pas de FAQ gabarit répétée sur les entrées).

### 6.14 `TableauOutil<T>`

```ts
{ legende: string; colonnes: { cle: string; entete: string; rendu: (l: T) => ReactNode;
                               numerique?: boolean; principale?: boolean }[];
  lignes: T[]; idLigne?: (l: T) => string }       // ancre (B : lpp-2263287)
```

Un vrai `<table>` (avec `<caption>`), lisible par Google. À 375 px, sans CSS ajouté à `styles.css` : classes
Tailwind `max-md:block` sur `table/tbody/tr/td`, chaque ligne devient une carte, chaque cellule affiche son
en-tête par `max-md:before:content-[attr(data-entete)]` ; la colonne `principale` passe en tête de carte en 16 px.
`numerique` : `num-tabular`, aligné à droite dès 768 px. `<thead>` masqué à 375 px (`max-md:sr-only`).

### 6.15 `PageIntrouvableOutil`

```ts
{ outil: OutilDescripteur; slug: string; message: ReactNode; q: string }   // q tiré du slug (cadre.md)
```

Statut 404, `noindex` dans le `head`. Fil d'Ariane jusqu'au hub, H1 « {slug} : introuvable », le message de
l'outil, `RechercheOutil` préremplie avec `q` (son formulaire envoie vers le hub), lien vers le hub,
`CartePont`. Aucune redirection automatique vers le hub (un 404 franc pour une URL qui n'a jamais existé).

## 7. Gabarits de page

### 7.1 Hub `/outils/<id>`

Ordre fixe : `FilOutil` (Accueil › Outils › {nom}) ; `EnTeteOutil compact` avec `RechercheOutil` et filtres
dans `children` ; sommaire d'ancres des groupes ; `ListeHub` (ou `EtatVide`) ; texte de méthode propre à
l'outil (300 à 500 mots, intertitres `<h2>`) ; `BlocSources` (toutes les sources de l'outil) ; `FaqOutil`
(3 à 5 questions, `jsonLd`) ; `ArticlesLies` ; `CartePont`. JSON-LD : `collectionPageLd` (CollectionPage,
`dateModified`, `publisher` = `organizationRef`) + BreadcrumbList (+ FAQPage).

### 7.2 Entrée `/outils/<id>/<slug>`

Ordre fixe : `FilOutil` ; `EnTeteEntree` (sur-titre, H1, réponse en 2 phrases, pastilles métier) ;
`BlocEssentiel` ; `BlocAvertissement fait-foi` ; sections propres à l'outil (`<h2>`, cadre.md) ;
`BlocSources` ; `EntreesVoisines` ; `ArticlesLies` (+ `LienOutil`) ; `CartePont`. JSON-LD : `webPageLd`
(WebPage, `name`, `description`, `url`, `inLanguage: "fr-FR"`, `dateModified`, `isPartOf` = le WebSite,
`publisher` = `organizationRef`, `citation` = URL des sources) + BreadcrumbList.

```
375 px                                   ┐
‹ Codes rejet                            │ FilOutil (mobile : retour seul)
CODE REJET NOEMIE · ASSURANCE MALADIE    │
Code rejet 0450054 :                     │ EnTeteEntree
« ETM NON TROUVEE EN BDO »               │
La facture demande un 100 % que la       │ réponse, 17 px, visible sans défiler
caisse ne retrouve pas…                  │
[Optique et audio] [Dentaire] [+3]       ┘
┌ L'essentiel ───────────────────────┐   BlocEssentiel
│ Cause probable                     │
│ Exonération saisie à tort…         │
│ Quoi corriger                      │
│ Vérifiez les droits (ADRi)…        │
└────────────────────────────────────┘
│ ⓘ Le libellé de votre retour fait foi…  BlocAvertissement
## … sections de l'outil …
## Sources · Vérifié le 18/11/2026       BlocSources
## Codes voisins  [carte] [carte] [carte] EntreesVoisines
## Pour aller plus loin  [article] [outil] ArticlesLies
┌ Vos équipes soignent. Granit gère le reste. ┐  CartePont (dernier bloc)
│ [ Voir ce que font les agents ]             │
│ Demander une démo                           │
└─────────────────────────────────────────────┘
```

### 7.3 Page `/outils` (socle)

`<title>` « Outils gratuits pour le tiers payant » ; description « Des outils gratuits pour le tiers payant des
professionnels de santé, en libre accès : chaque donnée y porte sa source officielle et la date de sa
vérification. » (160) ; H1 « Outils gratuits pour le tiers payant ». Une carte par outil disponible (ordre
`OUTIL.ordre`) : `titreCarte`, `description`, pastilles métier, lien. Les deux outils de campagne n'y sont pas.
Pas de `CartePont` (page de navigation). Sans outil : `notFound()`.

## 8. SEO (`src/lib/outils/socle/seo.ts`)

### 8.1 `head`

```ts
headOutil({ titre, description, robots? }) =>
  ({ meta: [{ title: titre }, { name: "description", content: description },
            { property: "og:title", content: titre }, { name: "twitter:title", content: titre },
            { property: "og:description", content: description }, { property: "og:type", content: "website" },
            ...(robots ? [{ name: "robots", content: robots }] : [])] })
```

Pas de robots sur les hubs et les entrées (indexables). `robots: "noindex"` seulement pour
`PageIntrouvableOutil`. Pas de suffixe « - Granit » (`seo.md` § 2.3). Le canonical vient déjà de
`src/components/Seo.tsx` (chemin sans requête) : `/outils/codes-rejet?q=0450054` a pour canonical le hub.
**Aucun lien interne vers une URL `?q=` ou `?metier=`** (le filtre sans JS est un formulaire, pas un lien ;
les pastilles de filtre portent `rel="nofollow"`).

### 8.2 Textes

`<title>` 60 caractères au plus ; description 140 à 160 ; uniques dans l'outil. Gabarits par outil dans
cadre.md ; un générateur qui sort des bornes essaie ses formes courtes dans l'ordre, et le test échoue s'il
n'en trouve aucune. `fauteTypo(texte)` (`texte.mjs`) renvoie la première faute : espace simple avant `: ; ? !`,
guillemets droits `"`, tiret long `—`, « tiers-payant », « certifié HDS ».

### 8.3 Redirections

Une variante d'identifiant (code collé, sans zéro initial, ancien slug, ancienne URL) → **301** vers l'URL
canonique, par `redirections()`. Une entrée connue sans page (sous le seuil, famille fermée, `a_verifier`,
passée de page à ligne) → **301 vers le hub, ancre `#slug`** si la ligne est visible, sinon le hub : jamais
de 404 sur une URL qui a pu être indexée (`seo.md` § 2.2). Inconnu → 404 (§ 6.15).

## 9. Suivi PostHog

### 9.1 Type `Outil` et `useSuiviOutil` (dans `OutilShared.tsx`)

```ts
export type Outil = "tri-des-marques" | "heures-de-decembre" | "codes-rejet" | "remboursement" | "mutuelle-portail";
type ContexteSuivi = { page?: "hub" | "entree" | "index" | "introuvable"; entree?: string; groupe?: string };
export function useSuiviOutil(outil: Outil, contexte: ContexteSuivi = {})
// renvoie { suivre, commence, resultat } comme aujourd'hui, plus :
//   rechercher(q: string, r: { visibles: number; exact: boolean; filtres: Record<string, string | null> })
```

Compatibilité : appel sans `contexte` = comportement actuel à l'identique (mêmes événements, mêmes propriétés).
`contexte` est fusionné dans chaque événement. Les dépendances des effets sont les **valeurs** du contexte
(`outil, page, entree, groupe`), pas l'objet, sinon `lm_page_vue` repartirait à chaque rendu. En navigation
d'une entrée à sa voisine, `entree` change : `lm_page_vue` repart, c'est voulu. `lienRdv(outil: string)`
accepte déjà toute chaîne. `useVuUneFois(ref, rappel, seuil = 0.5)` (`suivi.ts`) reprend l'observateur de
`lm_resultat_vu` pour les autres blocs.

### 9.2 Catalogue

Tous les événements portent `outil` et le contexte. Les quatre premiers existent déjà.

| Événement | Quand | Propriétés en plus |
|---|---|---|
| `lm_page_vue` | chaque page (hub, entrée, /outils, 404) | aucune |
| `lm_outil_commence` | première frappe dans la recherche (ou le calcul B) | aucune |
| `lm_resultat_vu` | hub : la liste entre à moitié dans l'écran, une fois | `apres_saisie` |
| `lm_rdv_clic` | inchangé (outils de campagne) | |
| `lm_recherche` | 800 ms après la dernière frappe, si `q` a 2 caractères ou plus et diffère du dernier envoi ; aussi au chargement d'un `?q=` | `q` (nettoyée), `longueur`, `nb_resultats`, `exact`, `metier`, `origine: "saisie" \| "url"` |
| `lm_filtre` | changement d'une facette | `facette`, `valeur`, `nb_resultats` |
| `lm_resultat_clic` | clic sur une ligne du hub qui a une page | `vers`, `rang` (parmi les visibles), `avec_recherche` |
| `lm_entree_vue` | entrée vue : au chargement d'une page d'entrée (`mode: "page"`) ou à l'ouverture d'un `<details>` du hub (`mode: "ligne"`) | `entree`, `mode`, `depuis: "recherche" \| "voisin" \| "article" \| "autre-outil" \| "site" \| "externe" \| "direct"` |
| `lm_voisin_clic` | clic dans voisins, articles liés ou lien vers un autre outil | `de`, `vers`, `bloc: "voisins" \| "articles" \| "autre-outil"` |
| `lm_source_clic` | clic sur une source | `source_id` |
| `lm_pont_vu` | la carte pont à moitié dans l'écran, une fois par page | `page` |
| `lm_pont_clic` | clic dans la carte pont | `cible: "metier" \| "demo"` |

`depuis` : `marquerDepuis(type)` écrit `sessionStorage["outil_depuis"]` au clic d'un lien interne ;
`lireDepuis()` le lit et l'efface au chargement de l'entrée, sinon déduit du `document.referrer` (même domaine
→ `site`, autre → `externe`, vide → `direct`). Lecture et écriture en `try/catch`.

### 9.3 Ce qu'on n'envoie jamais

`nettoyerRequete(q)` avant tout envoi : espaces réduits, 40 caractères au plus ; requête **non envoyée**
(`q: "[retiree]"`) si elle contient `@` ; toute suite de 11 chiffres ou plus remplacée par `#` (NIR, numéro
de téléphone collé par erreur) ; les numéros AMC (10 chiffres) passent. Aucun événement ne porte de texte saisi
ailleurs que dans la recherche (B : `lm_calcul` envoie des booléens et le code, pas le prix).

## 10. Tests

### 10.1 Helper `tests/outils/socle.ts`

```ts
export async function chargerOutils(): Promise<OutilDecouvert[]>     // via scripts/outils/decouvrir.mjs
export function siteNode(): ContexteSite                            // articlesEnLigne + anciensSlugsFr (scripts/ressources/en-ligne.mjs)
export function testsCommunsOutil(o: OutilDecouvert): void          // déclare les tests node:test ci-dessous
export { compterMots, motsPropres, phrasesGabarit } from "../../src/lib/outils/socle/mots.mjs";
export { fauteTypo, normaliser, cleCode } from "../../src/lib/outils/socle/texte.mjs";
```

### 10.2 Tests communs (pour chaque outil découvert, avec `pages({ site })` puis `pages({ site, candidates: true })`)

1. Descripteur : `id` = dossier, `chemin` = `/outils/<id>`, `description` ≤ 160, métiers connus.
2. Un seul hub, en premier, au chemin de l'outil ; les entrées sous ce chemin ; slugs
   `^[a-z0-9]+(?:-[a-z0-9]+)*$`, 80 caractères au plus ; chemins uniques, y compris entre outils.
3. `titre` 10 à 60 caractères, `description` 140 à 160, `h1` non vide ; titres et descriptions uniques ;
   `fauteTypo` ne trouve rien dans titre, description, h1.
4. `lastmod` au format `AAAA-MM-JJ`, entre 2026-01-01 et aujourd'hui.
5. `audit()` couvre exactement les entrées de `pages()`.
6. **Aucune page à partir d'une entrée à vérifier** : chaque `entrees[].statut === "sur"`.
7. Chaque entrée a au moins un `source_id`, chacun résolu vers une source avec `url` (http/https), `titre`,
   `editeur`, `date_source` non vide et `consulte_le` ISO.
8. `motsPropres(textePropre, phrasesGabarit(textes des candidates)) >= SEUIL_MOTS_PROPRES` de l'outil.
9. `voisins` : au moins `MIN_VOISINS`, sans doublon ni la page elle-même ; chacun est une page publiée de
   l'outil ou un `/ressources/<slug>` en ligne.
10. `articles` : chaque slug est en ligne (`siteNode().articles`).
11. `redirections()` : aucune clé n'est un slug publié ; chaque cible est une page publiée ou le hub (avec ancre
    éventuelle) ; pas de chaîne (une cible n'est jamais une clé).
12. `pages()` ⊆ `pages({ candidates: true })` ; `PRIORITE` sans doublon ni slug inconnu.

### 10.3 `tests/outils/socle.test.ts`

- Tests unitaires du socle : `compterMots` (« d’exonération » = 1 mot, espaces insécables), `decouperPhrases`,
  `phrasesGabarit`, `normaliser` (« Exonération » = « exoneration »), `cleCode` (« 0450 054 » = « 0450-054 » =
  « 0450054 »), `nettoyerRequete` (NIR, e-mail), `fauteTypo`, `filtrerLignes`, `suggestions`.
- `for (const o of await chargerOutils()) testsCommunsOutil(o)` : chaque PR d'outil a ces tests sans rien écrire.
- Garde-fou statique : aucun fichier de `src/routes/` ni de `src/components/` n'importe `donnees.json` ou
  `pages.mjs` (lecture des sources, expression régulière sur les `import`).
- Sans dossier d'outil : `decouvrirOutils` renvoie `[]` et les tests passent.

### 10.4 Tests propres à chaque outil (`tests/outils/<id>.test.ts`)

Ce que le socle ne peut pas savoir (formules B, alias A, fiches C…) : liste dans chaque cadre.md.

## 11. Branches et fusion

- `outils/socle` : main + un commit « Outils : socle commun ». `outils/codes-rejet`, `outils/mutuelle-portail`,
  `outils/remboursement` : ce même commit (même SHA) + les commits de l'outil. Fusion par commit de fusion
  (comme les PR actuelles), dans n'importe quel ordre : le commit de socle déjà présent ne crée pas de conflit.
- Seul conflit possible : `src/routeTree.gen.ts`. Le résoudre en prenant n'importe quelle version puis en le
  régénérant (`npm run build`, ou `npm run dev` le temps que le plugin l'écrive), et commiter le résultat.
- Chaque PR : `npm test`, `npm run build`, `node scripts/check-marque.mjs --strict`, puis `npm run planche`
  (captures 375 et 1280 px de toutes les URL du sitemap, donc des nouvelles pages).

## 12. Critères d'acceptation du socle (avant d'y poser un outil)

- [ ] Sans dossier d'outil, `public/sitemap.xml` et `public/llms.txt` régénérés sont identiques à ceux de main.
- [ ] `/outils` renvoie 404 et le pied de page n'a pas de lien « Outils gratuits ».
- [ ] `/outils/tri-des-marques` et `/outils/heures-de-decembre` : même rendu (planche avant / après), même
      `head` (noindex), mêmes événements et propriétés.
- [ ] `calcomDemoUrl(emplacement, article)` renvoie la même URL qu'avant.
- [ ] `npm test`, `npm run build`, `check-marque --strict` verts.
- [ ] Un outil factice dans un dossier temporaire (non commité) est découvert, apparaît dans le sitemap, dans
      `llms.txt` et sur `/outils`, et ses tests communs tournent.
