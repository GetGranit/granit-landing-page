# Pages métier : de 8 à 5

Proposition de nuit du 3 novembre 2026. Rien n'est codé : ce document décrit ce qu'il faudrait changer, dans une PR à part (qui ne touche pas `src/styles.css`, pour respecter la règle du propriétaire unique pendant la bascule de marque).

## Ce qu'on recommande, en une phrase

On garde 5 des 8 adresses `/ressources/metier/{slug}` telles quelles (on change seulement leur nom affiché), on redirige les 3 autres en 301, et on ne crée aucune adresse nouvelle.

## Les 5 pages

| Verticale (décision de Paul) | Adresse gardée | Nom affiché | Nom court | État aujourd'hui |
|---|---|---|---|---|
| 1. Opticiens et audioprothésistes | `/ressources/metier/optique` | Opticiens et audioprothésistes | Optique et audio | indexée, métier principal (`VERTICALE_PRINCIPALE`) |
| 2. Centres dentaires | `/ressources/metier/dentaire` | Centres dentaires | Dentaire | indexée |
| 3. Centres de santé et ophtalmologie | `/ressources/metier/centres` | Centres de santé et ophtalmologie | Centres et ophtalmo | indexée |
| 4. Pharmacies | `/ressources/metier/pharmacie` | Pharmacies | Pharmacie | indexée |
| 5. Cliniques et laboratoires | `/ressources/metier/cliniques` | Cliniques et laboratoires | Cliniques et labos | `noindex` (moins de 3 articles) |

Pourquoi garder `optique` plutôt que créer `optique-audio` : c'est la page la plus liée et la seule toujours indexée. Une nouvelle adresse coûterait une 301 de plus, le renommage de `VERTICALE_PRINCIPALE`, des photos et du sitemap, pour un gain nul (le nom affiché dit déjà « audioprothésistes »).

Nouvel ordre dans `verticales.json` → `ordre` : `optique, dentaire, centres, pharmacie, cliniques`.

## Les 3 adresses qui disparaissent

| Adresse | État aujourd'hui | Redirection proposée | Raison |
|---|---|---|---|
| `/ressources/metier/audio` | indexée, au sitemap et dans `llms.txt` | **301 → `/ressources/metier/optique`** | l'audio rejoint la verticale 1 |
| `/ressources/metier/laboratoires` | `noindex`, hors sitemap | **301 → `/ressources/metier/cliniques`** | les labos rejoignent la verticale 5 |
| `/ressources/metier/ehpad` | `noindex`, hors sitemap | **301 → `/ressources`** | EHPAD disparaît ; aucune page métier n'est pertinente (une 301 vers une page hors sujet serait traitée comme une erreur 404 par Google) |

## Comment le site fait ses 301 (vérifié dans le code)

Il n'y a pas de fichier `public/_redirects` et `nitro.config.ts` ne contient que les proxys PostHog. Le site redirige dans les routes TanStack Start, par `beforeLoad` + `throw redirect({ …, statusCode: 301 })`. Exemples existants : `src/routes/produit.tsx` (`/produit` → `/agents`), `src/routes/blog.$.tsx` avec `src/lib/legacyBlog.ts`, `src/routes/ressources.$slug.tsx` (anciens articles remplacés, via le champ `remplace`).

Proposition :

1. Dans `src/lib/ressources/verticales.json`, ajouter :
   ```json
   "fusions": { "audio": "optique", "laboratoires": "cliniques", "ehpad": null }
   ```
2. Dans `src/routes/ressources.metier.$verticale.tsx`, ajouter un `beforeLoad` qui lit `fusions[params.verticale]` : une cible donne `throw redirect({ to: "/ressources/metier/$verticale", params: { verticale: cible }, statusCode: 301 })`, `null` donne `throw redirect({ to: "/ressources", statusCode: 301 })`. Le `beforeLoad` passe avant le `loader`, qui renverrait sinon une 404 une fois les slugs retirés.
3. Après déploiement : `curl -I https://www.getgranit.ai/ressources/metier/audio` doit répondre 301, et `npm run planche` ne doit montrer aucun lien interne cassé.

## L'article EHPAD publié : on le garde, hors des pages métier

`/ressources/facturation-ehpad-controle-humain` (refonte R2) est 100 % EHPAD. Deux constats dans le code :

- il est tagué `pharmacie` par erreur (dans la file et dans son JSON) : il s'affiche aujourd'hui sur la page Pharmacie ;
- son JSON porte `remplace: [hopital-prive-ordonnancement, logs-agent-sante, ia-generative-sante-cadre, ia-vs-rpa-sante]`. Si on le dépublie, ces 4 anciennes adresses reviennent en ligne, car les 301 ne se calculent qu'à partir des articles en ligne.

Recommandation :

1. `surcharges["facturation-ehpad-controle-humain"] = []` dans `verticales.json` : il sort de toutes les pages métier, il reste accessible à son adresse et depuis le hub.
2. Corriger `metierDe()` dans `src/lib/ressources/contenu.ts` : avec une liste vide, il retombe sur l'optique dans le fil d'Ariane ; il doit renvoyer `undefined`.
3. Corriger `verticales: ["pharmacie"]` de l'entrée R2 dans la file, dans la même PR de code (la proposition `articles-queue.v5.json` laisse les entrées publiées telles quelles).
4. Le jour où le pilier clinique sort (il est en attente, voir RECAP), transférer `hopital-prive-ordonnancement` vers lui (`tiers-payant-clinique-privee`, champ `remplace` dans la file v5) et, **dans la même PR de relecture**, le retirer du `remplace` du JSON EHPAD. Sinon le build casse (« ancien article remplacé deux fois »).
5. Dans 3 mois, regarder la Search Console. Sans trafic : 301 vers le pilier transverse `tiers-payant-professionnels-de-sante`.

À signaler au passage : `content/ressources/tiers-payant-opticien.json` déclare `remplace: groupes-multi-sites-pilotage`, alors que la file ne le dit pas. Résultat : un ancien article sur les centres multi-sites redirige vers le pilier opticien. Proposition : le transférer au pilier `tiers-payant-centre-de-sante` quand il sortira (même méthode qu'au point 4 ; l'entrée S0 de `articles-queue.v5.json` porte déjà ce `remplace`).

## Articles publiés à retaguer (sans réécrire)

Via `surcharges` dans `verticales.json` (la surcharge passe avant le champ `verticales` du JSON) :

| Article publié | Tag aujourd'hui | Tag proposé |
|---|---|---|
| `sesam-vitale-evolutions-2025` | 5 métiers (dont `audio`) | `optique, dentaire, centres, pharmacie` |
| `recouvrement-patient-empathie` | `centres` | `centres, dentaire` (attention : il cite un dépassement impayé comme cas type en centre de santé, ce que la loi y interdit ; à corriger à sa prochaine révision) |
| `integration-doctolib-lgo` | `centres` | `centres, dentaire` |
| `audioprothese-renouvellement-tiers-payant` | `audio` | `optique` |
| `portail-viamedis` | `optique, audio, dentaire` | `optique, dentaire` |
| `facturation-ehpad-controle-humain` | `pharmacie` (erreur) | `[]` |

Dans `anciens` : `audioprothese-renouvellement-tiers-payant` passe à `["optique"]`, `facturation-ehpad-controle-humain` à `[]`.

## Impacts dans le code (une seule PR, à faire valider)

| Fichier | Changement |
|---|---|
| `src/lib/ressources/verticales.json` | `ordre` à 5 ; `nom`, `court`, `description` des 5 ; clé `fusions` ; `surcharges` et `anciens` ci-dessus ; entrées `audio`, `laboratoires`, `ehpad` retirées |
| `src/lib/ressources/types.ts` | `VerticaleSlug` réduit aux 5. Créer un type à part (ex. `MetierAnnuaire`, avec `audio` et `laboratoires`) pour `annuaire.ts` et `MurPlateformes.tsx` : le mur des plateformes s'appuie sur un relevé daté qu'on ne doit pas perdre |
| `src/lib/ressources/verticales.ts` | `ALTS` réduit à 5. Les photos `audio-*`, `laboratoires-*`, `ehpad-*.jpg` deviennent orphelines. Une photo « lunettes et aide auditive » serait plus juste pour la verticale 1 (plus tard) |
| `src/components/ressources/MurPlateformes.tsx` | `METIER_COURT` sur le nouveau type ; entrée `ehpad` retirée |
| `scripts/ressources/vite-plugin.ts` | `verticalesDe` normalise par `fusions` (des JSON publiés portent encore `audio`) |
| `src/lib/ressources/contenu.ts` | `metierDe` avec liste vide ; pilier transverse à la une |
| `scripts/gen-sitemap.mjs` | même normalisation. Bug existant : le sitemap compte les anciens déjà remplacés et compte deux fois les refontes, alors que la page compte autrement ; une page `noindex` peut finir au sitemap |
| Règle des 3 articles (page métier + sitemap) | ne compter que les articles **propres** au métier. Sinon les ~20 articles du tronc commun, tagués sur les 5 métiers, feraient indexer 5 pages presque identiques |
| `scripts/gen-llms.mjs` | rien : il lit `ordre` |
| `src/components/ressources/Hub.tsx` | texte d'accroche sans EHPAD |
| `src/lib/ressources/categories.json` | retirer « en optique », « comptoir des opticiens » des descriptions de catégories |
| `scripts/seo-engine/README.md` | liste des slugs `verticales` du contrat |
| Hors Ressources | `src/components/home/HomeSections.tsx` garde EHPAD dans les filtres et cas d'usage : à traiter avec le rebranding, pas avec le cocon |

## Ordre de mise en œuvre conseillé

1. PR code (verticales.json, types, 301, `metierDe`, règle des 3 articles) **avant** que le premier article non optique sorte de la file. Sinon il s'affiche sur la page optique (un article sans `verticales` retombe sur `optique`).
2. Vérifier les 3 redirections avec `curl -I` et la planche.
3. Soumettre le sitemap à jour (le workflow IndexNow part tout seul au déploiement).
